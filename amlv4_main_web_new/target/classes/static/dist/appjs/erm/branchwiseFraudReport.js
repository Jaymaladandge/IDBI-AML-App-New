
var datalistE = ""
var formattedSDateE = "";
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
		$("#fetchDataBtn").prop("disabled", true);
		$("#status").prop("disabled", true);
		$("#officeType").prop("disabled", true);
	}
	var userOffice = $("#userOffice").val();
	if (userOffice === 'ZO') {
		$('#officeType option[value="CO"]').attr("disabled", true);
	} else if (userOffice === 'DO') {
		$('#officeType option[value="CO"]').attr("disabled", true);
		$('#officeType option[value="ZO"]').attr("disabled", true);
	} else if (userOffice === 'BO') {
		$('#officeType option[value="CO"]').attr("disabled", true);
		$('#officeType option[value="ZO"]').attr("disabled", true);
		$('#officeType option[value="DO"]').attr("disabled", true);
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
	var formattedSDate = [ startDate.getDate(),startDate.getMonth() + 1, startDate.getFullYear()].join('-');
	var formattedEDate = [ endDate.getDate(), endDate.getMonth() + 1,endDate.getFullYear()].join('-');
	var validFlg = true;
	if (startDate > endDate) {
		toastr
			.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (startDate === '' || startDate == null) {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (endDate === '' || endDate == null) {
		toastr.error("end date cannot be blank");
		validFlg = false;
	}
	
	/* else if (officeType === '' || officeType == null) {
		toastr.error("Office Type cannot be null");
		validFlg = false;
	}*/

	if (validFlg) {

		var pageValJson = "";

		var selectedOfficeType = $(
			'#officeType :selected').val();
			
		 formattedSDateE = formattedSDate;
		 formattedEDateE = formattedEDate;	
			
		pageValJson = "{\n" 
			+ "    \"startDate\": \"" + formattedSDate+ "\",\n" 
			+ "    \"endDate\":\"" + formattedEDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		
		$.ajax({
			url: "fetchIncidentBranchwiseFraudReport",
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
				var dataList = obj.branchCountWithYear;
				dataListE = dataList;
			
				$(".branchTable > #tbodyR").empty();
				$('#branchTable').dataTable().fnClearTable();
				$('#branchTable').DataTable().destroy();
		dataList.forEach(function(items) {
			
				$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
					+ items.split('~')[3]
					+ "</td><td><span name='officeCode' value='" + items.split('~')[0] + "' class='textCapitalize'>"
					+ items.split('~')[0] 
					+ "</td><td><span name='previousYear' value='" + items.split('~')[1] + "' class='textCapitalize'>"
					+ items.split('~')[1] 
					+ "</td><td><span name='currentYear' value='" + items.split('~')[2] + "' class='textCapitalize'>"
					+ items.split('~')[2]
					+ "</span></td><td><span name='status' value='" + items.split('~')[4] + "' class='textCapitalize'>"
					+ items.split('~')[4] 
					+ "</td>"
					+ "</tr>").appendTo(".branchTable");
			});
			
			$("#branchTable").DataTable({
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
				'#branchTable_wrapper .col-md-6:eq(0)');
			
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
			+ "    \"startDate\": \"" + formattedSDateE+ "\",\n" 
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





