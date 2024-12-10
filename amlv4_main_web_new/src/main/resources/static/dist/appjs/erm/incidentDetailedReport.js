
var officeTypeE="";
var formattedSDDateE="";
var statusE="";
var formattedEDDateE="";


document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
	} else if (state == 'complete') {
		setTimeout(function() {
			document.getElementById('interactive');
			document.getElementById('load').style.visibility = "hidden";
		}, 1000);
	}
}
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});

$(document).ready(function() {
	$("#IncidentReportTableList").DataTable({
		"columnDefs": [{
			orderable: false
			//targets: [6]
		}],
		"order": [0, "desc"],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": false,
		"language": {
			"emptyTable": "No Data Available"
		},
	}).buttons().container().appendTo(
		'#IncidentReportTableList_wrapper .col-sm-12:eq(0)');
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

$(document).ready(function() {
var  deptNameTemp = $('#userDept').val();
	if (deptNameTemp != 'ERM') {
		
		var userOffice = $("#userOffice").val();
		if (userOffice === 'CO') {
		$('#officeType option[value="ZO"]').attr("disabled", false);
		$('#officeType option[value="DO"]').attr("disabled", false);
		$('#officeType option[value="BO"]').attr("disabled", false);
	}else if (userOffice === 'ZO') {
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
$("#fetchDataBtn").click(function() {
	$("#reportTable").css("display", "none");
	$("#showTable").css("display", "");
	var date1 = $("#startDate").val();
	var date2 = $("#endDate").val();
	var startDate = new Date(date1);
	var endDate = new Date(date2);
	var officeType = $("#officeType").val();
	var validFlg = true;
	var formattedSDate = [ startDate.getDate(),startDate.getMonth() + 1, startDate.getFullYear()].join('-');
	var formattedEDate = [ endDate.getDate(), endDate.getMonth() + 1,endDate.getFullYear()].join('-');
	
	if (startDate > endDate) {
		toastr.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (startDate === '' || startDate == null) {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (endDate === '' || endDate == null) {
		toastr.error("end date cannot be blank");
		validFlg = false;
	} else if (officeType === '' || officeType == null) {
		toastr.error("Office Type cannot be null");
		validFlg = false;
	}

	if (validFlg) {

		var pageValJson = "";

		var selectedOfficeType = $('#officeType :selected').val();
		pageValJson = "{\n" 
			+ "    \"searchParam\": \"" + selectedOfficeType + "\",\n"
			+ "    \"startDate\": \"" + formattedSDate + "\",\n"
		    + "    \"endDate\":\"" + formattedEDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: "fetchIncidentReportCount",
			type: "POST",
			data: {
				pageValJson: pageValJson
			},// important line for thymeleaf http security
			headers: {
				"X-CSRF-TOKEN": $("input[name='_csrf']").val()
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

				var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);
				console.log('obj' + obj);
				var dataMap = obj.incidentStatusHs;
				console.log('dataMap ' + dataMap);
				console.log('type ' + jQuery.type(dataMap));
				$(".IncidentReportTable > #tbodyR").empty();
				$('#IncidentReportTable').dataTable().fnClearTable();
				$('#IncidentReportTable').DataTable().destroy();




				var parameter = selectedOfficeType + "~" + startDate + "~" + endDate;

				$("<tr role='row'><td><a href='#IncidentReportTable' class='text-blue' id='D~" + parameter + "' onclick='getReportData(this.id)'>"
					+ dataMap["Incident Created"]
					+ "</a></td><td><a href='#IncidentReportTable' class='text-blue' id='S~" + parameter + "' onclick='getReportData(this.id)'>"
					+ dataMap["Incident Validated"]
					+ "</a></td><td><a href='#IncidentReportTable' class='text-blue' id='T~" + parameter + "' onclick='getReportData(this.id)'>"
					+ dataMap["Incident Remediated"]
					+ "</a></td><td><a href='#IncidentReportTable' class='text-blue' id='V~" + parameter + "' onclick='getReportData(this.id)'>"
					+ dataMap["Incident Verified"]
					+ "</a></td><td><a href='#IncidentReportTable' class='text-blue' id='C~" + parameter + "' onclick='getReportData(this.id)'>"
					+ dataMap["Incident Closed"]
					+ "</a></td><td><a href='#IncidentReportTable' class='text-blue' id='R~" + parameter + "' onclick='getReportData(this.id)'>"
					+ dataMap["Incident Rejected"]
					+ "</a></td>"
					+ "</tr>").appendTo(".IncidentReportTable");

				$("#IncidentReportTable").DataTable({
					"columnDefs": [{
						orderable: false,
						targets: [0,1,2,3,4,5]
					}],
					"responsive": false,
					"autoWidth": true,
					"sorting": false,
					"bPaginate": false,
					"searching": false,
					"bInfo" : false,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					}
				}).buttons().container().appendTo(
					'#IncidentReportTable_wrapper .col-sm-12:eq(0)');

			}, error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.success('Some Error Occured');
			}
		});

	}
});

function getReportData(reportId) {
	$("#showTable").css("display", "");
	var status = reportId.split('~')[0];
	var officeType = reportId.split('~')[1];
	var date1 = reportId.split('~')[2];
	var date2 = reportId.split('~')[3];
	var startDate = new Date(date1);
	var endDate = new Date(date2);
	
	var formattedSDDate = [ startDate.getDate(),startDate.getMonth() + 1, startDate.getFullYear()].join('-');
	var formattedEDDate = [ endDate.getDate(), endDate.getMonth() + 1,endDate.getFullYear()].join('-');

	$("#reportTable").css("display", "");
	
	officeTypeE = officeType;
	formattedSDDateE = formattedSDDate;
	statusE = status;
	formattedEDDateE = formattedEDDate;
	
	
	var pageValJson = "";


	pageValJson = "{\n" 
		+ "    \"searchParam\": \""+ officeType + "\",\n"
		+ "    \"startDate\": \"" + formattedSDDate + "\",\n"
		+ "    \"actionStatus\": \"" + status + "\",\n" 
		+ "    \"endDate\":\"" + formattedEDDate + "\"\n" + "}";
	//	alert(pageValJson);

	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$
		.ajax({
			url: 'incidentReportDetilsList',
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
				var obj = JSON
					.parse(jsonResponse);
				var IncidentReportTableList = $(
					'#IncidentReportTableList')
					.DataTable();

				IncidentReportTableList.clear().draw();
				$(
					".IncidentReportTableList > #tbodyR")
					.empty();
				var dataList = obj.incidentList;
				dataList.forEach(function(items) {

					console.log('items' + items.incidentId);


					var tr = $("<tr>"
						+ "<td class='text-capitalize' id='"
						+ items.incidentId
						+ "'>"
						+ items.incidentId
						+ "</td>"
						+ "<td class='text-capitalize'>"
						+ items.incidentName
						+ "</td>"
						+ "<td class='text-capitalize'>"
						+ items.department
						+ "</td>"
						+ "<td class='text-capitalize'>"
						+ items.incidentStatus
						+ "</td>"
						+ "<td class='text-capitalize'>"
						+ items.officeCode
						+ "</td>"
						+ "<td class='text-capitalize'>"
						+ items.incidentRecordDate
						+ "</td>"
						+ "</tr>");

					IncidentReportTableList.row.add(tr[0]).draw();

				});

					$('#viewIncidentReportmodal').modal('show');
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


$('.exportExcel').click(function() {
	
	
	
 pageValJson = "{\n" 
		+ "    \"searchParam\": \""+ officeTypeE + "\",\n"
		+ "    \"startDate\": \"" + formattedSDDateE + "\",\n"
		+ "    \"actionStatus\": \"" + statusE + "\",\n" 
		+ "    \"endDate\":\"" + formattedEDDateE + "\"\n" + "}";
		

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

























