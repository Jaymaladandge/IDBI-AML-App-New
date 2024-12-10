//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
}

$(document).ready(function() {
	$('#penAlertList').hide();
	$('#test').hide();
	$('#test1').hide();
});

$("#getReport").click(function() {

	var validationFlag = false;
	var userRole = $("#userRole").val();

	//alert(userRole);

	if (userRole == "") {
		toastr.info('Please select user role');
		document.getElementById("getReport").disabled = false;
		validationFlag = false;
	} else {
		validationFlag = true;
		pageValJson = "{"
			+ "\"roleId\": \"" + userRole + "\"}";
	}

	$("#encryptedJson").val(pageValJson);
	$("#ageReportFrm").attr('action', './fetchAlertPendencyCount');
	$("#ageReportFrm").submit();

});

$(".fetchPenAlertList").click(
	function() {

		var status = $(this).attr('status');
		var currentRole = $(this).attr('act');
		var days = $(this).attr('val');
		var repType = $(this).attr('repType');

		//alert("days-" + days + ' currentRole-' + currentRole + ' status-' + status);
		var pageValJson = "{\"days\": \"" + days + "\"," + "\"currentRole\": \"" + currentRole
			+ "\"," + "\"status\": \"" + status + "\"," + "\"reportType\": \"" + repType + "\"}";
		$('#agingRepListHdn').val(pageValJson);
		document.getElementById('load').style.visibility = "visible";
		
			

		$.ajax({
			url: 'fetchAlertPendencyList',
			type: "POST",
			async: false,
			data: {
				pageValJson: pageValJson
			},// important line for thymeleaf http security
			headers: {
				"X-CSRF-TOKEN": $(
					"input[name='_csrf']")
					.val()
			},
			cache: false,
			// async:true,
			success: function(response) {
				document.getElementById('load').style.visibility = "hidden";
				//alert("response :" + response);
				var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);
				//alert("response :" + obj.alertMasterList);

				if (obj.alertMasterList != null) {
					$('#penAlertList').show();
					//$('#alertTab').show();
					//$('#strReqTab').hide();
					$('#test1').hide();
					$('#test').show();
				
	                 $('#alertTab').DataTable().destroy();
					 $('#alertTab tbody').empty();

					obj.alertMasterList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.alertId
							+ "</td><td style='text-align: right;'>"
							+ items.alertAggVal
							+ "</td><td>"
							+ items.alertRuleId
							+ "</td><td style='text-align: right;'> "
							+  Number(items.alertVal).toLocaleString()
							+ "</td><td > "
							+ items.alertStatus
							+ "</td><td style='text-align: right;'> "
							+ items.alertAge
							+ "</td><td> "
							+ items.userId
							+ "</td></tr>").appendTo("#alertTabbody");
					});

					$("#alertTab").DataTable({
						"destroy": true,
						"order": [],
						"columnDefs": []
						 //"dom": 'Bfrtip'
						//"buttons": ['copy', 'csv', 'excelHtml5', 'pdf', 'print']
					});

				} else {
					$('#penAlertList').show();
					//$('#strReqTab').show();
					//$('#alertTab').hide();
					$('#test').hide();
					$('#test1').show();
					
				  $('#strReqTab').DataTable().destroy();
				   $('#strReqTab tbody').empty();
					
					obj.strReqList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.reqId
							+ "</td><td>"
							+ items.month
							+ "</td><td style='text-align: right;'>"
							+ items.year
							+ "</td><td> "
							+ items.userId
							+ "</td><td> "
							+ items.userRoleId
							+ "</td><td> "
							+ items.amlRefNo
							+ "</td><td> "
							+ items.reqTime
							+ "</td><td> "
							+ items.reqStatus
							+ "</td><td style='text-align: right;'> "
							+ items.reqAge
							+ "</td></tr>").appendTo("#strReqTabbody");
					});

					$("#strReqTab").DataTable({
						"destroy": true,
						"order": [],
						"columnDefs": []
						//"dom": 'Bfrtip'
						//"buttons": ['copy', 'csv', 'excelHtml5', 'pdf', 'print']
					});

				}
			},
			error: function(xhr, status, error) {

				toastr.info('Some Error Occured');
			}


		});
	});

function getExport() {

	//alert("in export");

	var userRole = $("#userRole").val();

	//alert("userRole: " + userRole);
	var pageVal = "{" + "\"roleId\": \"" + userRole + "\"}";
	//alert(pageVal);

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray
		.random(128 / 8).toString(
			CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize,
		iterationCount);

	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), pageVal);

	$("#encryptedJson").val(
		ciphertext + ':~:' + passphrase);
	//$("#encryptedJson").val(pageValJson);
	$("#ageReportFrm").attr('action', './exportFetchAlertPendencyCount');
	$("#ageReportFrm").submit();

}

function getAgingReportListExport(){
	
	var pageVal = $('#agingRepListHdn').val();
	//alert(pageVal);

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray
		.random(128 / 8).toString(
			CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize,
		iterationCount);

	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), pageVal);

	$("#encryptedJson").val(
		ciphertext + ':~:' + passphrase);
	//$("#encryptedJson").val(pageValJson);
	$("#ageReportFrm").attr('action', './exportFetchAlertPendencyList');
	$("#ageReportFrm").submit();
}
