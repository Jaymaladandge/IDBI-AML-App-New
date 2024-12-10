/*Loader*/
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
/*Loader*/

/*Initialize Select2 Elements*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});
/*Initialize Select2 Elements*/


$(document).ready(function() {

	$(".datepicker").attr("autocomplete", "off");

	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'YYYY/MM/DD',
		autocomplete: 'off',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'YYYY/MM/DD',
		autocomplete: 'off',
		onChangeDateTime: function(dp, $input) {
		}
	});

	$('#reportTable').hide();

});


/*FETCH DEFAULT ALL RULES TILL DATE*/
$("#fetchDataBtn").click(function() {


	var searchParam = "fetchAll";
	var ruleFrequency = $('#ruleFrequencyDropdown').val();


	var validFlg = true;


	/*var date1 = $("#startDate").val();
	var date2 = $("#endDate").val();
	var startDate1 = new Date(date1);
	var endDate1 = new Date(date2);*/


	/*if (startDate1 > endDate1) {
		toastr
			.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (startDate1 === '' || startDate1 == null) {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (endDate1 === '' || endDate1 == null) {
		toastr.error("end date cannot be blank");
		validFlg = false;
	}*/

	if (ruleFrequency == '') {
		toastr.error("Rule Frequency cannot be blank");
		validFlg = false;
	}






	var pageValJson = "{\"ruleFrequency\":" + "\"" + ruleFrequency + "\"\n" + "}";

	console.log("pageValJson :" + pageValJson)
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchAllRuleListDetails',
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
			var dataList = obj.ruleAndDayWiseCount;
			/*var firstDate = "";
			var secondDate = "";
			var thirdDate = "";*/

			$(".ruleWiseReportTable > #tbodyR").empty();
			$('#ruleWiseReportTable').dataTable().fnClearTable();
			$('#ruleWiseReportTable').DataTable().destroy();
			dataList.forEach(function(items) {
				/*firstDate = items.fdate;
				secondDate = items.sDate;
				thirdDate = items.tDate;*/
				$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
					+ items.ruleId
					+ "</td><td><span name='incidentName' value='" + items.ruleDesc + "' class='textCapitalize'>"
					+ items.ruleDesc
					+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleClassification + "' class='textCapitalize'>"
					+ items.ruleClassification
					+ "</td><td><span name='operatingOfcLocation' value='" + items.rulePriority + "' class='textCapitalize'>"
					+ items.rulePriority
					+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleFrequency + "' class='textCapitalize'>"
					+ items.ruleFrequency
					+ "</td>><td><span name='operatingOfcLocation' value='" + items.firstCount + "' class='textCapitalize'>"
					+ items.firstCount
					+ "</td><td><span name='operatingOfcLocation' value='" + items.secondCount + "' class='textCapitalize'>"
					+ items.secondCount
					+ "</td><td><span name='operatingOfcLocation' value='" + items.thirdCount + "' class='textCapitalize'>"
					+ items.thirdCount
					+ "</td>"
					+ "</tr>").appendTo(".ruleWiseReportTable");
			});
			/*$('#fDate').html(firstDate)
			$('#sDate').html(secondDate)
			$('#tDate').html(thirdDate)*/

			$("#ruleWiseReportTable").DataTable({
				"columnDefs": [{
					orderable: false
				}],
				"responsive": false,
				"autoWidth": true,
				"searching": true,
				"fixedHeader": true,
				"language": {
					"emptyTable": "No Data Available"
				},
			}).buttons().container().appendTo(
				'#ruleWiseReportTable_wrapper .col-md-6:eq(0)');

			$('#reportTable').show();

		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.success('Some Error Occured');
		}
	});


});
/*FETCH DEFAULT ALL RULES TILL DATE*/


/*EXPORT EXCEL*/
$('.exportExcel').click(function() {
	var searchParam = "fetchAll";
	var ruleFrequency = $('#ruleFrequencyDropdown').val();


	var validFlg = true;


	var date1 = $("#startDate").val();
	var date2 = $("#endDate").val();
	var startDate1 = new Date(date1);
	var endDate1 = new Date(date2);


	if (startDate1 > endDate1) {
		toastr
			.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (startDate1 === '' || startDate1 == null) {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (endDate1 === '' || endDate1 == null) {
		toastr.error("end date cannot be blank");
		validFlg = false;
	}

	if (ruleFrequency == '') {
		toastr.error("Rule Frequency cannot be blank");
		validFlg = false;
	}


	if (validFlg) {

		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();



		var pageValJson = "{\"searchParam\":" + "\"" + searchParam + "\",\n"
			+ "    \"ruleFrequency\": \"" + ruleFrequency + "\",\n"
			+ "    \"startDate\": \"" + startDate + "\",\n"
			+ "    \"endDate\":\"" + endDate + "\"\n" + "}";


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

/*EXPORT EXCEL*/
