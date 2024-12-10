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

	$('.datepicker').on('click', function(e) {
		e.preventDefault();
		$(this).attr("autocomplete", "off");
	});


	$('#reportTable').hide();

});


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
				val: "All",
				text: "ALL"
			}).appendTo($("#regionDropdown"));

			obj.regionDtoList.forEach(function(items) {
				$("<option />", {
					val: items.regionName,
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

$('#regionDropdown').change(function() {
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
});
/*FETCH BRANCH BASED ON REGION*/

/*FETCH BUTTON CLICK FUNCTION*/

$("#fetchDataBtn").click(function() {

	var zoneId = "All";
	var branchId = "All";
	var regionId = "All";
	var alertStatus = "All";
	var validFlg = true;

	if ($('#zoneDropdown').val() !== null && $('#zoneDropdown').val() !== undefined &&
		$('#zoneDropdown').val() !== '') {
		zoneId = $("#zoneDropdown option:selected").text();
	}
	if ($('#branchDropdown').val() !== null && $('#branchDropdown').val() !== undefined &&
		$('#branchDropdown').val() !== '') {
		branchId = $('#branchDropdown').val();
	}
	if ($('#regionDropdown').val() !== null && $('#regionDropdown').val() !== undefined &&
		$('#regionDropdown').val() !== '') {
		regionId = $('#regionDropdown').val();
	}
	if ($('#alertStatus').val() !== null && $('#alertStatus').val() !== undefined &&
		$('#alertStatus').val() !== '') {

		alertStatus = $('#alertStatus').val();
	}

	var searchParam = $('#searchParam').val();

	var validFlg = true;

	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();

	if (startDate > endDate) {
		toastr
			.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (startDate == null && startDate == undefined &&
		startDate == '') {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (endDate == null && endDate == undefined &&
		endDate == '') {
		toastr.error("end date cannot be blank");
		validFlg = false;
	}

	if (validFlg) {

		var pagevalJson = "{\"branchId\":" + "\"" + branchId + "\",\n"
			+ "    \"region\": \"" + regionId + "\",\n"
			+ "    \"zone\": \"" + zoneId + "\",\n"
			+ "    \"alertStatus\": \"" + alertStatus + "\",\n"
			+ "    \"searchParam\": \"" + searchParam + "\",\n"
			+ "    \"startDate\": \"" + startDate + "\",\n"
			+ "    \"endDate\":\"" + endDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchConsolidatedReport',
			type: "POST",
			data: {
				pageValJson: pagevalJson
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
				var dataList = obj.consolidatedReportList;
				$(".consolidateReportTable > #tbodyR").empty();
				$('#consolidateReportTable').dataTable().fnClearTable();
				$('#consolidateReportTable').DataTable().destroy();
				dataList.forEach(function(items) {

					//alert("items.branch = " + items.branch);

					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.branch
						+ "</td><td><span name='incidentName' value='" + items.alertStatus + "' class='textCapitalize'>"
						+ items.alertStatus
						+ "</td><td><span name='operatingOfcLocation' value='" + items.reoccuranceCount + "' class='textCapitalize'>"
						+ items.reoccuranceCount
						+ "</td><td><span name='operatingOfcLocation' value='" + items.region + "' class='textCapitalize'>"
						+ items.region
						+ "</td><td><span name='operatingOfcLocation' value='" + items.zone + "' class='textCapitalize'>"
						+ items.zone
						+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleId + "' class='textCapitalize'>"
						+ items.ruleId
						+ "</td><td><span name='operatingOfcLocation' value='" + items.exceptionDescription + "' class='textCapitalize'>"
						+ items.exceptionDescription
						+ "</td><td><span name='primaryLossEvent' value='" + items.ruleFrequency + "' class='textCapitalize'>"
						+ items.ruleFrequency
						+ "</td><td><span name='primaryLossEvent' value='" + items.ruleTAT + "' class='textCapitalize'>"
						+ items.ruleTAT
						+ "</td><td><span name='primaryLossEvent' value='" + items.ruleCategory + "' class='textCapitalize'>"
						+ items.ruleCategory
						+ "</td><td><span name='primaryLossEvent' value='" + items.riskSeverity + "' class='textCapitalize'>"
						+ items.riskSeverity
						+ "</td><td><span name='primaryLossEvent' value='" + items.customerId + "' class='textCapitalize'>"
						+ items.customerId
						+ "</td><td><span name='primaryLossEvent' value='" + items.accountNumber + "' class='textCapitalize'>"
						+ items.accountNumber
						+ "</td><td><span name='primaryLossEvent' value='" + items.accountName + "' class='textCapitalize'>"
						+ items.accountName
						+ "</td><td><span name='primaryLossEvent' value='" + items.generatedTime + "' class='textCapitalize'>"
						+ items.generatedTime
						+ "</td><td><span name='primaryLossEvent' value='" + items.vertical + "' class='textCapitalize'>"
						+ items.vertical
						+ "</td><td><span name='primaryLossEvent' value='" + items.schemeType + "' class='textCapitalize'>"
						+ items.schemeType
						+ "</td><td><span name='primaryLossEvent' value='" + items.schemeCode + "' class='textCapitalize'>"
						+ items.schemeCode
						+ "</td><td><span name='primaryLossEvent' value='" + items.transactionId + "' class='textCapitalize'>"
						+ items.transactionId
						+ "</td><td><span name='primaryLossEvent' value='" + items.transactionDate + "' class='textCapitalize'>"
						+ items.transactionDate
						+ "</td><td><span name='primaryLossEvent' value='" + items.transactionType + "' class='textCapitalize'>"
						+ items.transactionType
						+ "</td><td><span name='primaryLossEvent' value='" + items.transactionAmount + "' class='textCapitalize'>"
						+ items.transactionAmount
						+ "</td><td><span name='primaryLossEvent' value='" + items.transactionParticulars + "' class='textCapitalize'>"
						+ items.transactionParticulars
						+ "</td><td><span name='primaryLossEvent' value='" + items.entryUserId + "' class='textCapitalize'>"
						+ items.entryUserId
						+ "</td><td><span name='primaryLossEvent' value='" + items.entryUserName + "' class='textCapitalize'>"
						+ items.entryUserName
						+ "</td><td><span name='primaryLossEvent' value='" + items.entryUserVertical + "' class='textCapitalize'>"
						+ items.entryUserVertical
						+ "</td><td><span name='primaryLossEvent' value='" + items.entryUserPosition + "' class='textCapitalize'>"
						+ items.entryUserPosition
						+ "</td><td><span name='primaryLossEvent' value='" + items.verifyUserId + "' class='textCapitalize'>"
						+ items.verifyUserId
						+ "</td><td><span name='primaryLossEvent' value='" + items.verifyUserName + "' class='textCapitalize'>"
						+ items.verifyUserName
						+ "</td><td><span name='primaryLossEvent' value='" + items.verifyUserVertical + "' class='textCapitalize'>"
						+ items.verifyUserVertical
						+ "</td><td><span name='primaryLossEvent' value='" + items.verifyUserPosition + "' class='textCapitalize'>"
						+ items.verifyUserPosition
						+ "</td><td><span name='primaryLossEvent' value='" + items.billId + "' class='textCapitalize'>"
						+ items.billId
						+ "</td><td><span name='primaryLossEvent' value='" + items.initSolId + "' class='textCapitalize'>"
						+ items.initSolId
						+ "</td><td><span name='primaryLossEvent' value='" + items.finacleUserId + "' class='textCapitalize'>"
						+ items.finacleUserId
						+ "</td><td><span name='primaryLossEvent' value='" + items.deviceId + "' class='textCapitalize'>"
						+ items.deviceId
						+ "</td><td><span name='primaryLossEvent' value='" + items.loginLogTime + "' class='textCapitalize'>"
						+ items.loginLogTime
						+ "</td><td><span name='primaryLossEvent' value='" + items.position + "' class='textCapitalize'>"
						+ items.position
						+ "</td><td><span name='primaryLossEvent' value='" + items.location + "' class='textCapitalize'>"
						+ items.location
						+ "</td><td><span name='primaryLossEvent' value='" + items.commentDate + "' class='textCapitalize'>"
						+ items.commentDate
						+ "</td><td><span name='primaryLossEvent' value='" + items.alertComment + "' class='textCapitalize'>"
						+ items.alertComment
						+ "</td><td><span name='primaryLossEvent' value='" + items.compliedByDate + "' class='textCapitalize'>"
						+ items.compliedByDate
						+ "</td><td><span name='primaryLossEvent' value='" + items.makerName + "' class='textCapitalize'>"
						+ items.makerName
						+ "</td><td><span name='primaryLossEvent' value='" + items.checkerName + "' class='textCapitalize'>"
						+ items.checkerName
						+ "</td>"
						+ "</tr>").appendTo(".consolidateReportTable");
				});
				$("#consolidateReportTable").DataTable({
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
					'#consolidateReportTable_wrapper.col-md-6:eq(0)');

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
	} else {
		toastr.success('Please select valid inputs');
	}
});

/*FETCH BUTTON CLICK FUNCTION*/

/*EXPORT EXCEL*/
$("#exportExcelButton").click(function() {

		var zoneId = "All";
	var branchId = "All";
	var regionId = "All";
	var alertStatus = "All";
	var validFlg = true;

	if ($('#zoneDropdown').val() !== null && $('#zoneDropdown').val() !== undefined &&
		$('#zoneDropdown').val() !== '') {
		zoneId = $("#zoneDropdown option:selected").text();
	}
	if ($('#branchDropdown').val() !== null && $('#branchDropdown').val() !== undefined &&
		$('#branchDropdown').val() !== '') {
		branchId = $('#branchDropdown').val();
	}
	if ($('#regionDropdown').val() !== null && $('#regionDropdown').val() !== undefined &&
		$('#regionDropdown').val() !== '') {
		regionId = $('#regionDropdown').val();
	}
	if ($('#alertStatus').val() !== null && $('#alertStatus').val() !== undefined &&
		$('#alertStatus').val() !== '') {

		alertStatus = $('#alertStatus').val();
	}

	var searchParam = $('#searchParam').val();

	var validFlg = true;

	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();

	if (startDate > endDate) {
		toastr
			.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (startDate == null && startDate == undefined &&
		startDate == '') {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (endDate == null && endDate == undefined &&
		endDate == '') {
		toastr.error("end date cannot be blank");
		validFlg = false;
	}

	if (validFlg) {

		var pagevalJson = "{\"branchId\":" + "\"" + branchId + "\",\n"
			+ "    \"region\": \"" + regionId + "\",\n"
			+ "    \"zone\": \"" + zoneId + "\",\n"
			+ "    \"alertStatus\": \"" + alertStatus + "\",\n"
			+ "    \"searchParam\": \"" + searchParam + "\",\n"
			+ "    \"startDate\": \"" + startDate + "\",\n"
			+ "    \"endDate\":\"" + endDate + "\"\n" + "}";
			
			
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pagevalJson);
		$("#encryptedJsonExport").val(ciphertext + ':~:' + passphrase);

		/*$("#consolidateReportTable").DataTable({
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
			'#consolidateReportTable_wrapper.col-md-6:eq(0)');*/

		document.getElementById('load').style.visibility = "hidden";
		$("#export").submit();
	}
});

/*EXPORT EXCEL*/

/*$(document).ready(function() {
	$("#exportAll").click(

		function() {
			//document.getElementById('load').style.visibility = "visible";
			//alert("function called successfully");
			tableToExcel('ruleWiseReportTable', 'Rule-Wise Count Report', 'Rule-Wise Count Report');
		}
	);
});*/

function getIEVersion()
// Returns the version of Windows Internet Explorer or a -1
// (indicating the use of another browser).
{
	var rv = -1; // Return value assumes failure.
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	return rv;
}


function tableToExcel(table, sheetName, fileName) {




	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
	{
		return fnExcelReport(table, fileName);
	}



	var uri = 'data:application/vnd.ms-excel;base64,',
		templateData = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
		base64Conversion = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
		formatExcelData = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }



	$("tbody > tr[data-level='0']").show();



	if (!table.nodeType)
		table = document.getElementById(table)



	var ctx = { worksheet: sheetName || 'Worksheet', table: table.innerHTML }



	var element = document.createElement('a');
	element.setAttribute('href', 'data:application/vnd.ms-excel;base64,' + base64Conversion(formatExcelData(templateData, ctx)));
	element.setAttribute('download', fileName);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);



	$("tbody > tr[data-level='0']").hide();
}



function fnExcelReport(table, fileName) {



	var tab_text = "<table border='2px'>";
	var textRange;



	if (!table.nodeType)
		table = document.getElementById(table)



	$("tbody > tr[data-level='0']").show();

	tab = document.getElementById('testExportId'); // id of table



	tab_text = tab_text + table.innerHTML;



	tab_text = tab_text + "</table>";
	tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
	tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
	tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params



	txtArea1.document.open("txt/html", "replace");
	txtArea1.document.write(tab_text);
	txtArea1.document.close();
	txtArea1.focus();
	sa = txtArea1.document.execCommand("SaveAs", false, fileName + ".xlsx");
	$("tbody > tr[data-level='0']").hide();

	document.getElementById('load').style.visibility = "disable";
	return (sa);

}

