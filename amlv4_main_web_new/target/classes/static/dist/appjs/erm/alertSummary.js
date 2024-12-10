document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
		//document.getElementById('contents').style.visibility = "hidden";
	} else if (state == 'complete') {
		setTimeout(
			function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
				//document.getElementById('contents').style.visibility = "visible";
			}, 1000);
	}
}

//searchcriteria
$(document).ready(function() {
	$(".searchValue").hide();
});

$(document).on('click', ".tasknotification", function() {

	var notifyInfo = $(this).attr('id');

	var notifyArray = notifyInfo.split('~');
	var pageValJson;
	var url;
	/*var homeString = "{\n" + "    \"moduleId\": \""
		+ notifyArray[0] + "\",\n"
		+ "    \"moduleName\": \"" + notifyArray[1]
		+ "\",\n" + "    \"moduleAction\":\""
		+ notifyArray[2] + "\"\n" + "}";*/

	var homeString = "{\n" +
		"    \"moduleId\": \"" + notifyArray[0] + "\",\n" +
		"    \"moduleName\": \"" + notifyArray[1] + "\",\n" +
		"    \"moduleAction\": \"" + notifyArray[2] + "\",\n" +
		"    \"alertStatus\": \"" + notifyArray[4] + "\",\n" +
		"    \"ruleId\": \"" + notifyArray[3] + "\"\n" +
		"}";

	console.log(homeString);
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		homeString);
	$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
	$("#homeForm").submit();

});


$(function() {

		var currentdate = new Date(); 
	    var datetime =+ currentdate.getDate() + "/"
	                + (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getFullYear() + "_"  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes() + ":" 
	                + currentdate.getSeconds();
	
		$("#taskNotification").DataTable({
			"columnDefs": [
				{
					orderable: false,

				}],

			"order": [0, "desc"],
			"lengthMenu": [20, 40, 60, 80, 100],
			"responsive": false,
			"autoWidth": false,
			"searching": true,
			"fixedHeader": true,
			"language": {
				"emptyTable": "No Data Available"
			},
			"buttons": [{
			
			extend: 'excel',
			/*exportOptions: {
				columns: [0, 1, 2, 3, 4, 5]
            },*/
			title: 'Alert_Summary_'+datetime,
		
		},{
			
			extend: 'csvHtml5',
			/*exportOptions: {
				columns: [0, 1, 2, 3, 4, 5]
            },*/
			title: 'Alert_Summary_'+datetime,
		
		},{
			
			extend: 'print',
			/*exportOptions: {
				columns: [0, 1, 2, 3, 4, 5]
            },*/
			title: 'Alert_Summary_'+datetime,
		
		},{
			
			extend: 'pdfHtml5',
			/*exportOptions: {
				columns: [0, 1, 2, 3, 4, 5]
            },*/
			title: 'Alert_Summary_'+datetime,
		
		}]
		}).buttons().container().appendTo(
			'#taskNotification_wrapper .col-md-12:eq(0)');
		
});

// Dropdown change
$(document).on("change", ".searchParam", function() {
	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");

	if (searchParam.includes('makerTimestamp~')) {
		$("#hideDropDown").hide();
		$("#searchcriteria").show();
	}
	else {
		$("#hideDropDown").show();
		$("#searchcriteria").hide();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam + "\"}";
		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				url: 'fetchParamValueList',
				type: "POST",
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
					setTimeout(
						function() {
							document
								.getElementById('load').style.visibility = "hidden";

						}, 1000);
					var jsonResponse = JSON
						.stringify(response);
					var obj = JSON.parse(jsonResponse);

					$("#searchcriteria").hide();
					$("#selectSearchcriteria").empty();


					if (searchParam.includes('alertCat')) {
						obj.paramValueList.forEach(function(items) {

							$("<option />", {
								val: '',
								text: ''
							}).appendTo($("#selectSearchcriteria"));

							$("<option />", {
								val: items.split("~")[0],
								text: items.split("~")[1]
							}).appendTo($("#selectSearchcriteria"));
						});
					} else {
						obj.paramValueList.forEach(function(items) {

							$("<option />", {
								val: '',
								text: ''
							}).appendTo($("#selectSearchcriteria"));

							$("<option />", {
								val: items,
								text: items
							}).appendTo($("#selectSearchcriteria"));
						});
					}




					$("#selectSearchcriteria").show();
					$('.select2').select2();


				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

	}

})

//search method
function searchData() {

	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");
	if (searchParam.includes('makerTimestamp~')) {
		var searchValue = $('#searchcriteria').val().replace(/(\r\n|\n|\r)/gm, "");
	}
	else {
		var searchValue = $('#selectSearchcriteria').find(":selected").val();
	}

	if (searchParam == '') {
		toastr.error('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.error('Please Add Some Value For Search');
	} else {

		var pageValJson = "{\"searchParam\":" + "\"" + searchParam + "\",\"searchValue\":\"" + searchValue + "\"}";
		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				url: 'searchDataList',
				type: "POST",
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
					setTimeout(
						function() {
							document
								.getElementById('load').style.visibility = "hidden";

						}, 1000);
					var jsonResponse = JSON
						.stringify(response);
					var obj = JSON.parse(jsonResponse);

					$(".taskNotificationBody").empty();
					$('#taskNotification').dataTable().fnClearTable();
					$('#taskNotification').DataTable().destroy();

					obj.alertList
						.forEach(function(item) {

							if (item.alertId)
								$(
									"<tr>"

									+ "<td><a class='text-blue viewModal' data-toggle='modal' href='#' id='" + item.custId + "'>"
									+ item.custId
									+ "</a></td>"

									+ "<td>"
									+ item.ruleId
									+ "</td>"


									+ "<td>"
									+ item.custVertical
									+ "</td>"

									+ "<td>"
									+ item.generatedTime
									+ "</td>"

									+ "<td>"
									+ item.custName
									+ "</td>"


									+ "<td>"
									+ item.branchId
									+ "</td>"

									+ "<td>"
									+ item.ruleClassification
									+ "</td>"

									+ "<td class='project-actions text-center'><span class='badge text-white' >"
									+ "<a id='"
									+ item.alertId + "~" + "TRANSACTION MONITORING" + "~" + "AI" + "~" + item.ruleId + "~" + item.alertStatus
									+ "' class='btn-sm tasknotification bg-success'><em class='fas fa-arrow-circle-right text-white'></em></a>"
									+ "</span></td>"

									+ "</tr>")
									.appendTo(
										".taskNotificationBody");

						});



					$("#taskNotification").DataTable({
						"columnDefs": [
							{
								visible: false,
								targets: [1],
							},
							{
								orderable: false,

							}],

						"order": [0, "desc"],
						"lengthMenu": [20, 40, 60, 80, 100],
						"responsive": false,
						"autoWidth": false,
						"searching": true,
						"fixedHeader": true,
						"language": {
							"emptyTable": "No Data Available"
						}
					}).buttons().container().appendTo(
						'#actionplantable_wrapper .col-md-12:eq(0)');



				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

		//}
	}
}

$('a.viewModalCustomer')
	.click(
		function() {

			var acctId = $(this).attr('id');
			const keyValue = acctId.split("~");

			var pageValJson = "{\"searchParam\":" + "\"" + keyValue[1] + "\",\"searchValue\":\"" + keyValue[0] + "\"}";

			if (keyValue[1] != 'ACNO') {

				var urlValue = 'getCustDetailsById';

			} else {
				var urlValue = 'getAccountsDetailsById';
			}

			console.log(pageValJson);

			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: urlValue,
					type: "POST",
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
						setTimeout(
							function() {
								document
									.getElementById('interactive');
								document
									.getElementById('load').style.visibility = "hidden";
							}, 1000);
						var jsonResponse = JSON
							.stringify(response);
						var obj = JSON.parse(jsonResponse);
						if (keyValue[1] != 'ACNO') {
							$("#Accounts").hide();
							$("#accountModel").hide();

							$("#custId").text(obj.custId);
							$("#CustName").val(obj.custName);
							$("#custType").val(obj.custTypeCode);
							$("#custStatus").val(obj.custOpenDate);
							$("#custGender").val(obj.custSex);
							$("#custOccupation").val(obj.custOccpCode);
							$("#custConst").val(obj.custConst);
							$("#mailingAddress").text(obj.mailingAddress);
							$("#custPanNo").text(obj.custPanNo);
							$("#custNat").text(obj.natIdCardNum);
							$("#custPassport").text(obj.custPassportNo);

						} else {
							$("#cust").hide();
							$("#custModel").hide();

						}
						$('#ruleModalView').modal('show');

					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});
			$('#viewModalCustomer').modal('show');
		});

// after click on Compliance Button
$("#closeAlert").click(function() {

	var action = 'Closed';
	var alertIdValues = '';
	var futureDate='';

	$('input[name="checkAllBox2"]:checked').each(function() {
		alertIdValues += this.value + ',';
	});
	
	alertIdValues = alertIdValues.substring(0,
							alertIdValues.length - 1);
	

	var finalJsonString = "{\n" + "\"alertId\": \"" +alertIdValues + "\",\n"
		+ "   \"action\": \"" + action + "\",\n"
		+ "   \"futureDate\": \"" + futureDate + "\"}";
	var iterationCount = 1000;
	var keySize = 128;
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase), finalJsonString);
	$("#encryptedJsonSave").val(ciphertext + ':~:' + passphrase);
	console.log("finalJsonString " + finalJsonString);
	$("#frmBulkCompliance").submit();

})

// after click on Compliance Button
$("#rejectAlert").click(function() {

	var action = 'Reject';
	var alertIdValues = '';
	var futureDate='';

	$('input[name="checkAllBox2"]:checked').each(function() {
		alertIdValues += this.value + ',';
	});
	
	alertIdValues = alertIdValues.substring(0,
							alertIdValues.length - 1);
	

	var finalJsonString = "{\n" + "\"alertId\": \"" +alertIdValues + "\",\n"
		+ "   \"action\": \"" + action + "\",\n"
		+ "   \"futureDate\": \"" + futureDate + "\"}";

	var iterationCount = 1000;
	var keySize = 128;
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase), finalJsonString);
	$("#encryptedJsonSave").val(ciphertext + ':~:' + passphrase);
	$("#frmBulkCompliance").submit();

})

