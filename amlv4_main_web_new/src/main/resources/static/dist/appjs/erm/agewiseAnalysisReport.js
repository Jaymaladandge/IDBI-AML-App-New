

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


	$('#branchRows').hide();
	$('#regionRows').hide();
	$('#ruleewiseTable').hide();
	$('#branchewiseTable').hide();
	$('#regionewiseTable').hide();

});


/*reportType Change Function*/

$('#reportType').change(function() {


	var reportType = $('#reportType').val();

	if (reportType == 'Branch') {

		$('#branchRows').show();
		$('#regionRows').hide();

	} else if (reportType == 'Region') {
		$('#regionRows').show();
		$('#branchRows').hide();
	} else if (reportType == 'Rule') {
		$('#regionRows').hide();
		$('#branchRows').hide();
	}



});
/*reportType Change Function*/

/*FETCH REGION BASED ON ZONE*/

$('#zoneDropdown').change(function() {

	var zoneValue = $('#zoneDropdown').val();
	var pageValJson = "{\"zoneId\":" + "\"" + zoneValue + "\"\n" + "}"
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchRegionList',
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
			//clear Drop-Down List of 
			$("#regionDropdown").empty();
			$("<option />", {
				val: "",
				text: "Select Region"
			}).appendTo($("#regionDropdown"));
			obj.regionDtoList.forEach(function(items) {
				$("<option />", {
					val: items.regionId,
					text: items.regionName
				}).appendTo($("#regionDropdown"));
			});
			$("#regionDropdown").show();
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
/*FETCH REGION BASED ON ZONE*/

/*FETCH BRANCH BASED ON REGION*/

/*$('#regionDropdown').change(function() {
	var regionValue = $('#regionDropdown').val();
	var pageValJson = "{\"regionId\":" + "\"" + regionValue + "\"\n" + "}"
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchRegionWiseBranchList',
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
			//clear Drop-Down List of 
			$("#branchDropdown").empty();
			$("<option />", {
				val: "",
				text: "Select Branch"
			}).appendTo($("#branchDropdown"));
			$("<option />", {
				val: "All",
				text: "ALL"
			}).appendTo($("#branchDropdown"));
			obj.branchDtoList.forEach(function(items) {
				$("<option />", {
					val: items.branchId,
					text: items.branchName
				}).appendTo($("#branchDropdown"));
			});
			$("#branchDropdown").show();
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.success('Some Error Occured');
		}
	});
});*/
/*FETCH BRANCH BASED ON REGION*/


/*reportType  fetchDataBtn click function*/

$('#fetchDataBtn').click(function() {

	var reportType = $('#reportType').val();

	if (reportType == '') {
		toastr.error('Please Select Report Type');

	} else if (reportType == 'Rule') {

		var pageValJson = "{\"reportType\":" + "\"" + reportType + "\"\n" + "}"

		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchAgeingReportDetails',
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
				console.log(obj);
				var dataList = obj.ruleList;
				$(".ageWiseReportTable > #tbodyR").empty();
				$('#ageWiseReportTable').dataTable().fnClearTable();
				$('#ageWiseReportTable').DataTable().destroy();
				console.log(dataList);
				dataList.forEach(function(items) {
					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.ruleId
						+ "</td><td><span name='incidentName' value='" + items.ruleDesc + "' class='textCapitalize'>"
						+ items.ruleDesc
						+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleClassification + "' class='textCapitalize'>"
						+ items.ruleClassification
						+ "</td><td><span name='operatingOfcLocation' value='" + items.rulePriority + "' class='textCapitalize'>"
						+ items.rulePriority
						+ "</td><td><span name='operatingOfcLocation' value='" + items.oneDayCount + "' class='textCapitalize'>"
						+ items.oneDayCount
						+ "</td><td><span name='operatingOfcLocation' value='" + items.oneWeekCount + "' class='textCapitalize'>"
						+ items.oneWeekCount
						+ "</td><td><span name='operatingOfcLocation' value='" + items.gtOneWeekltTwoWeek + "' class='textCapitalize'>"
						+ items.gtOneWeekltTwoWeek
						+ "</td><td><span name='operatingOfcLocation' value='" + items.gtTwoWeekltOneMonth + "' class='textCapitalize'>"
						+ items.gtTwoWeekltOneMonth
						+ "</td><td><span name='primaryLossEvent' value='" + items.gtOneMonthltThreeMonth + "' class='textCapitalize'>"
						+ items.gtOneMonthltThreeMonth
						+ "</td><td><span name='primaryLossEvent' value='" + items.gtThreeMonthltSixMonth + "' class='textCapitalize'>"
						+ items.gtThreeMonthltSixMonth
						+ "</td><td><span name='primaryLossEvent' value='" + items.gtSixMonthltOneYear + "' class='textCapitalize'>"
						+ items.gtSixMonthltOneYear
						+ "</td><td><span name='primaryLossEvent' value='" + items.gtOneYears + "' class='textCapitalize'>"
						+ items.gtOneYears
						+ "</td><td><span name='primaryLossEvent' value='" + items.perRuleCount + "' class='textCapitalize'>"
						+ items.perRuleCount
						+ "</td>"
						+ "</tr>").appendTo(".ageWiseReportTable");
				});



				$("#a").text(obj.oneDayCountTotal);
				$("#b").text(obj.oneWeekCountTotal);
				$("#c").text(obj.gtOneWeekltTwoWeekTotal);
				$("#d").text(obj.gtTwoWeekltOneMonthTotal);
				$("#e").text(obj.gtOneMonthltThreeMonthTotal);
				$("#f").text(obj.gtThreeMonthltSixMonthTotal);
				$("#g").text(obj.gtSixMonthltOneYearTotal);
				$("#h").text(obj.gtOneYearsTotal);
				$("#i").text(obj.perRuleCountTotal);

				$("#ageWiseReportTable").DataTable({
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
					"buttons":
						[{
							extend: 'excel',
							title: 'Rule Wise Ageing Report',
						}, {
							extend: 'csv',
							title: 'Rule Wise Ageing Report',
						}, {
							extend: 'pdf',
							title: 'Rule Wise Ageing Report',
						}, {
							extend: 'print',
							title: 'Rule Wise Ageing Report',

						}],

				}).buttons().container().appendTo(
					'#ageWiseReportTable_wrapper .col-md-6:eq(0)');


				$("#ageWiseReportTable").show();
				$("#ruleewiseTable").show();
				$('#branchewiseTable').hide();
				$('#regionewiseTable').hide();

			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.success('Some Error Occured');
			}
		});

	} else if (reportType == 'Branch') {

		var zone = $('#zoneDropdown').val();
		var region = $('#regionDropdown').val();
		var branch = 'All';



		var pageValJson = "{\"branchId\":" + "\"" + branch + "\",\n"
			+ "    \"regionId\": \"" + region + "\",\n"
			+ "    \"zoneId\": \"" + zone + "\",\n"
			+ "    \"reportType\":\"" + reportType + "\"\n" + "}";



		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchAgeingReportDetails',
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
				console.log(obj);
				var dataList = obj.alertList;
				$(".branchAgeWiseReportTable > #tbodyR").empty();
				$('#branchAgeWiseReportTable').dataTable().fnClearTable();
				$('#branchAgeWiseReportTable').DataTable().destroy();
				console.log(dataList);
				dataList.forEach(function(items) {
					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.zone
						+ "</td><td><span name='incidentName' value='" + items.region + "' class='textCapitalize'>"
						+ items.region
						+ "</td><td><span name='operatingOfcLocation' value='" + items.branchName + "' class='textCapitalize'>"
						+ items.branchName
						+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleId + "' class='textCapitalize'>"
						+ items.ruleId
						+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleDesc + "' class='textCapitalize'>"
						+ items.ruleDesc
						+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleClassification + "' class='textCapitalize'>"
						+ items.ruleClassification
						+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleRisk + "' class='textCapitalize'>"
						+ items.ruleRisk
						+ "</td><td><span name='operatingOfcLocation' value='" + items.oneDayCountTotal + "' class='textCapitalize'>"
						+ items.oneDayCountTotal
						+ "</td><td><span name='primaryLossEvent' value='" + items.oneWeekCountTotal + "' class='textCapitalize'>"
						+ items.oneWeekCountTotal
						+ "</td><td><span name='primaryLossEvent' value='" + items.gtOneWeekltTwoWeekTotal + "' class='textCapitalize'>"
						+ items.gtOneWeekltTwoWeekTotal
						+ "</td><td><span name='primaryLossEvent' value='" + items.perRuleCountTotal + "' class='textCapitalize'>"
						+ items.perRuleCountTotal
						+ "</td>"
						+ "</tr>").appendTo(".branchAgeWiseReportTable");
				});



				$("#branchAgeWiseReportTable").DataTable({
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
					"buttons":
						[{
							extend: 'excel',
							title: 'Branchwise Ageing Report',
						}, {
							extend: 'csv',
							title: 'Branchwise Ageing Report',
						}, {
							extend: 'pdf',
							title: 'Branchwise Ageing Report',
						}, {
							extend: 'print',
							title: 'Branchwise Ageing Report',

						}],

				}).buttons().container().appendTo(
					'#branchAgeWiseReportTable_wrapper .col-md-6:eq(0)');


				$("#branchAgeWiseReportTable").show();
				$("#branchewiseTable").show();
				$('#ruleewiseTable').hide();
				$('#regionewiseTable').hide();
			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.success('Some Error Occured');
			}
		});

	} else if (reportType == 'Region') {

		var zone = $('#zoneDropdown1').val();
		var region = 'All';

		var pageValJson = "{\"regionId\":" + "\"" + region + "\",\n"
			+ "    \"zoneId\": \"" + zone + "\",\n"
			+ "    \"reportType\":\"" + reportType + "\"\n" + "}";



		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchAgeingReportDetails',
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
				console.log(obj);
				var dataList = obj.alertList;
				$(".regionAgeWiseReportTable > #tbodyR").empty();
				$('#regionAgeWiseReportTable').dataTable().fnClearTable();
				$('#regionAgeWiseReportTable').DataTable().destroy();
				console.log(dataList);
				dataList.forEach(function(items) {
					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.zone
						+ "</td><td><span name='incidentName' value='" + items.region + "' class='textCapitalize'>"
						+ items.region
						+ "</td><td><span name='operatingOfcLocation' value='" + items.oneDayCountTotal + "' class='textCapitalize'>"
						+ items.oneDayCount
						+ "</td><td><span name='primaryLossEvent' value='" + items.oneWeekCountTotal + "' class='textCapitalize'>"
						+ items.oneWeekCount
						+ "</td><td><span name='primaryLossEvent' value='" + items.gtOneWeekltTwoWeekTotal + "' class='textCapitalize'>"
						+ items.gtOneWeekltTwoWeek
						+ "</td><td><span name='primaryLossEvent' value='" + items.perRuleCountTotal + "' class='textCapitalize'>"
						+ items.perRuleCountTotal
						+ "</td>"
						+ "</tr>").appendTo(".regionAgeWiseReportTable");
				});


				$("#p").text(obj.oneDayCountTotal);
				$("#q").text(obj.oneWeekCountTotal);
				$("#r").text(obj.gtOneWeekltTwoWeekTotal);
				$("#s").text(obj.grandTotal);




				$("#regionAgeWiseReportTable").DataTable({
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
					'#regionAgeWiseReportTable_wrapper .col-md-6:eq(0)');


				$("#regionAgeWiseReportTable").show();
				$("#regionewiseTable").show();
				$('#ruleewiseTable').hide();
				$('#branchewiseTable').hide();

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

/*reportType change function*/

/*EXPORT EXCEL REGION WISE*/
$('.exportExcelRegion').click(function() {
	var reportType = $('#reportType').val();
	var zone = $('#zoneDropdown1').val();
		var region = 'All';

		var pageValJson = "{\"regionId\":" + "\"" + region + "\",\n"
			+ "    \"zoneId\": \"" + zone + "\",\n"
			+ "    \"reportType\":\"" + reportType + "\"\n" + "}";


	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonExportRegion").val(ciphertext + ':~:' + passphrase);
	$("#exportRegion").submit();
	document.getElementById('load').style.visibility = "disable";

});

/*EXPORT EXCEL REGION WISE*/

/*EXPORT EXCEL BRANCH WISE*/
$('.exportExcelBranch').click(function() {
	var reportType = $('#reportType').val();
	var zone = $('#zoneDropdown').val();
		var region = $('#regionDropdown').val();
		var branch = 'All';


		var pageValJson = "{\"branchId\":" + "\"" + branch + "\",\n"
			+ "    \"regionId\": \"" + region + "\",\n"
			+ "    \"zoneId\": \"" + zone + "\",\n"
			+ "    \"reportType\":\"" + reportType + "\"\n" + "}";

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonExportBranch").val(ciphertext + ':~:' + passphrase);
	$("#exportBranch").submit();
	document.getElementById('load').style.visibility = "disable";

});

/*EXPORT EXCEL BRANCH WISE*/

/*EXPORT EXCEL RULE WISE*/
$('.exportExcelRule').click(function() {
	var reportType = $('#reportType').val();
	
	
	var pageValJson = "{\"reportType\":" + "\"" + reportType + "\"\n" + "}"



	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonExportRule").val(ciphertext + ':~:' + passphrase);
	$("#exportRule").submit();
	document.getElementById('load').style.visibility = "disable";

});

/*EXPORT EXCEL RULE WISE*/

