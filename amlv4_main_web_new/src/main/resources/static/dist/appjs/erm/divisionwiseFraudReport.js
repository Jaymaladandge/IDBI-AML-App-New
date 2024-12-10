var selectedOfficeTypeE = "";
var selectedValueE = "";
var formattedSDateE = "";
var deptIdE = "";
var officeCodeE = "";
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

$(document).ready(function() {
	$('#startDate').datetimepicker({
		format: 'YYYY-MM-DD',
		maxDate: new Date()
	});
	//Date range picker
	$('#endDate').datetimepicker({
		format: 'YYYY-MM-DD',
		maxDate: new Date()
	});
});


$("#fetchDataBtn").click(function() {

	var date1 = $("#startDate").val();
	var date2 = $("#endDate").val();
	var startDate = new Date(date1);
	var endDate = new Date(date2);

	var officeType = $("#officeType").val();
	var selectedValue = $('.zoneWise :selected').val();
	var validFlg = true;
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
	} else if (selectedValue === '' || selectedValue == null) {
		toastr.error("Please Select Zone");
		validFlg = false;
	}
	if ($("#incidentDept").val() === "") {
		toastr.error("Please Select Department");
		validFlg = false;
	}
	var formattedSDate = [startDate.getDate(), startDate.getMonth() + 1, startDate.getFullYear()].join('-');
	var formattedEDate = [endDate.getDate(), endDate.getMonth() + 1, endDate.getFullYear()].join('-');


	if (validFlg) {

		var pageValJson = "";

		var selectedOfficeType = $('#officeType :selected').val();
		var deptId = $('#incidentDept :selected').val();
		var officeId = $('#officeId').val();
		var userDeptId = $("#userDeptId").val();
		var officeCode = $("#officeCode").val();


		 selectedOfficeTypeE = selectedOfficeType;
		 selectedValueE = selectedValue;
		 formattedSDateE = formattedSDate;
		 deptIdE = deptId;
		 officeCodeE = officeCode;
		 userDeptIdE = userDeptId;
		 officeIdE = officeId;
		 formattedEDateE = formattedEDate;

		pageValJson = "{\n"
			+ "    \"ofcLoc\": \"" + selectedOfficeType + "\",\n"
			+ "    \"searchParam\": \"" + selectedValue + "\",\n"
			+ "    \"startDate\": \"" + formattedSDate + "\",\n"
			+ "    \"department\": \"" + deptId + "\",\n"
			+ "    \"officeCode\": \"" + officeCode + "\",\n"
			+ "    \"userDept\": \"" + userDeptId + "\",\n"
			+ "    \"officeId\": \"" + officeId + "\",\n"
			+ "    \"endDate\":\"" + formattedEDate + "\"\n" + "}";


		console.log(pageValJson);

		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchDivisionList',
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
				var dataList = obj.divisionCountAndAmount;
				$(".divList > #tbodyR").empty();
				$('#divisionList').dataTable().fnClearTable();
				$('#divisionList').DataTable().destroy();
				dataList.forEach(function(items) {
					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.split("~")[3]
						+ "</td><td><span name='code' value='" + items.split("~")[1] + "' class='textCapitalize'>"
						+ items.split("~")[0]
						+ "</td><td><span name='amount' value='" + items.split("~")[1] + "' class='textCapitalize'>"
						+ items.split("~")[1]
						+ "</td><td><span name='incidentDescription' value='" + items.split("~")[2] + "' class='textCapitalize description'>"
						+ items.split("~")[2]
						+ "</span></td>"
						+ "</tr>").appendTo(".divList");
				});
				$("#divisionList").DataTable({
					"columnDefs": [{
						orderable: false
						//targets: [6]
					}],
					"responsive": true,
					"autoWidth": true,
					"searching": false,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					},
					
				}).buttons().container().appendTo(
					'#divisionList_wrapper .col-md-6:eq(0)');
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

	pageValJson = "{\n"
		+ "    \"ofcLoc\": \"" + selectedOfficeTypeE + "\",\n"
		+ "    \"searchParam\": \"" + selectedValueE + "\",\n"
		+ "    \"startDate\": \"" + formattedSDateE + "\",\n"
		+ "    \"department\": \"" + deptIdE + "\",\n"
		+ "    \"officeCode\": \"" + officeCodeE + "\",\n"
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



});
