var searchParamE = "";
var formattedSDateE = "";
var deptIdE = "";
var officeCodeE = "";
var ofcLocE = "";
var userDeptIdE = "";
var officeIdE = "";
var formattedEDateE = "";



$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

$(document).ready(function() {
	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'YYYY-MM-DD',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'YYYY-MM-DD',
		onChangeDateTime: function(dp, $input) {
		}
	});
});


$(document).ready(function() {
	var deptNameTemp = $('#userDept').val();
	if (deptNameTemp != 'ERM') {

		var userOffice = $("#userOffice").val();
		if (userOffice === 'CO') {
			$('#officeType option[value="ZO"]').attr("disabled", false);
			$('#officeType option[value="DO"]').attr("disabled", false);
			$('#officeType option[value="BO"]').attr("disabled", false);
		} else if (userOffice === 'ZO') {
			$('#officeType option[value="CO"]').attr("disabled", true);
			$('#officeType option[value="DO"]').attr("disabled", false);
			$('#officeType option[value="BO"]').attr("disabled", false);
		} else if (userOffice === 'DO') {
			$('#officeType option[value="CO"]').attr("disabled", true);
			$('#officeType option[value="ZO"]').attr("disabled", true);
			$('#officeType option[value="BO"]').attr("disabled", false);
		} else if (userOffice === 'BO') {
			$('#officeType option[value="CO"]').attr("disabled", true);
			$('#officeType option[value="ZO"]').attr("disabled", true);
			$('#officeType option[value="DO"]').attr("disabled", true);
		}

	}

});


// loss details 
$("#fetchDataBtn").click(function() {

	var date1 = $("#startDate").val();
	var date2 = $("#endDate").val();
	var startDate = new Date(date1);
	var endDate = new Date(date2);
	var deptId = $('#incidentDept :selected').val();
	var officeType = $("#officeType").val();
	var validFlg = true;
	var formattedSDate = [startDate.getDate(), startDate.getMonth() + 1, startDate.getFullYear()].join('-');
	var formattedEDate = [endDate.getDate(), endDate.getMonth() + 1, endDate.getFullYear()].join('-');

	if (startDate > endDate) {
		toastr
			.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (date1 === '' || date1 == null) {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (date2 === '' || date2 == null) {
		toastr.error("end date cannot be blank");
		validFlg = false;
	}

	if (officeType === '' || officeType == null) {
		toastr.error("Office Type cannot be blank");
		validFlg = false;
	}
	if ($("#incidentDept").val() === "") {
		toastr.error("Please Select Department");
		validFlg = false;
	}
	if (validFlg) {
		var searchParam = formattedSDate + '~' + formattedEDate;

		var officeId = $('#officeId').val();
		var userDeptId = $("#userDeptId").val();
		var officeCode = $("#officeCode").val();
		var ofcLoc = $('#officeType :selected').val();
		//alert("searchParam = " + searchParam)

		 searchParamE = searchParam;
		 formattedSDateE = formattedSDate;
		 deptIdE = deptId;
		 officeCodeE = officeCode;
		 ofcLocE = ofcLoc;
		 userDeptIdE = userDeptId;
		 officeIdE = officeId;
		 formattedEDateE = formattedEDate;



		var value = "{\"searchParam\":" + "\"" + searchParam + "\",\n"
			+ "    \"startDate\": \"" + formattedSDate + "\",\n"
			+ "    \"department\": \"" + deptId + "\",\n"
			+ "    \"officeCode\": \"" + officeCode + "\",\n"
			+ "    \"ofcLoc\": \"" + ofcLoc + "\",\n"
			+ "    \"userDept\": \"" + userDeptId + "\",\n"
			+ "    \"officeId\": \"" + officeId + "\",\n"
			+ "    \"endDate\":\"" + formattedEDate + "\"\n" + "}";

		console.log(value);

		var ciphertext = null;
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(
			128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(
			reverseText(passphrase), value);
		var pageValJson = ciphertext + ':~:' + passphrase;

		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchRcaReportDetails',
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

				var dataList = obj.reportDtoList;

				dataList.forEach(function(items) {

					console.log(items.incidentId);
				});
				//alert("dataList =" + dataList);
				$(".detailList > #tbodyB").empty();
				$('#detailList').dataTable().fnClearTable();
				$('#detailList').DataTable().destroy();
				dataList.forEach(function(items) {
					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.incidentRecordDate
						+ "</td><td><span name='incidentName' value='" + items.operatingOfcLocation + "' class='textCapitalize'>"
						+ items.operatingOfcLocation
						+ "</td><td><span name='operatingOfcLocation' value='" + items.operatingOfcNo + "' class='textCapitalize'>"
						+ items.operatingOfcNo
						+ "</td><td><span name='operatingOfcLocation' value='" + items.department + "' class='textCapitalize'>"
						+ items.department
						+ "</td><td><span name='primaryLossEvent' value='" + items.primaryLossEvent + "' class='textCapitalize'>"
						+ items.primaryLossEvent
						+ "</td><td><span name='rootCauseDescription' value='" + items.rootCauseDescription + "' class='textCapitalize'>"
						+ items.rootCauseDescription
						+ "</td><td><span name='rootCauseIncident' value='" + items.rootCauseIncident + "' class='textCapitalize'>"
						+ items.rootCauseIncident
						+ "</td><td><span name='assessedImpactValue' value='" + items.assessedImpactValue + "' class='textCapitalize'>"
						+ items.assessedImpactValue
						+ "</td><td><span name='remark' class='textCapitalize'>"
						+ "</span></td>"
						+ "</tr>").appendTo(".detailList");
				});

				$("#detailList").DataTable({
					"columnDefs": [{
						orderable: false
						//targets: [6]
					}],
					"responsive": false,
					"autoWidth": true,
					"searching": false,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					},
				}).buttons().container().appendTo(
					'#detailList_wrapper .col-md-6:eq(0)');

			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.success('Some Error Occured');
			}
		});

	}
});

$('.exportExcel').click(function() {


	if(searchParamE == ""){
		toastr.error("Please Fetch The Data");
	}else{
	
	
 pageValJson = "{\"searchParam\":" + "\"" + searchParamE + "\",\n"
			+ "    \"startDate\": \"" + formattedSDateE + "\",\n"
			+ "    \"department\": \"" + deptIdE + "\",\n"
			+ "    \"officeCode\": \"" + officeCodeE + "\",\n"
			+ "    \"ofcLoc\": \"" + ofcLocE + "\",\n"
			+ "    \"userDept\": \"" + userDeptIdE + "\",\n"
			+ "    \"officeId\": \"" + officeIdE + "\",\n"
			+ "    \"endDate\":\"" + formattedEDateE + "\"\n" + "}";
	

	console.log(pageValJson);

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonExport").val(ciphertext + ':~:' + passphrase);
	$("#export").submit();

	document.getElementById('load').style.visibility = "disable";


}


});
