
var dataListTemp='';
var branchIdTemp='';

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

	$('#tatAlertListTable').hide();
	$('#alertDetailsTable').hide();


$('.datepicker').on('click', function(e) {
   e.preventDefault();
   $(this).attr("autocomplete", "off");  
});		
	
	
	

});




/*FETCH BUTTON CLICK FUNCTION*/

$("#fetchDataBtn").click(function() {


$('#tatAlertListTable').hide();

	var branchId = "";
	var searchParam = $('#searchParam').val();

	if (searchParam == 'ZONE') {
		branchId = $('#branchDropdown').val();
	} else if (searchParam == 'REGION') {
		branchId = $('#branchDropdown').val();
	} else {
		branchId = $('#branchDropdown').val();
	}

	var regionName = $('#regionDropdown').val();
	var validFlg = true;
	var zoneName = $('#zoneDropdown').val();
	
	
	var date1 = $("#startDate").val();
	var date2 = $("#endDate").val();
	var startDate1 = new Date(date1);
	var endDate1 = new Date(date2);


	if (startDate1 > endDate1) {
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

	if (validFlg) {

		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();


	var pagevalJson = "{\"branchId\":" + "\"" + branchId + "\",\n"
		+ "    \"region\": \"" + regionName + "\",\n"
		+ "    \"zone\": \"" + zoneName + "\",\n"
		+ "    \"startDate\": \"" + startDate + "\",\n"
		+ "    \"endDate\":\"" + endDate + "\"\n" + "}";

	console.log(pagevalJson);
	//alert(pagevalJson);



	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchTatStatusReport',
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
			var dataList = obj.tatReportList;
			dataListTemp = dataList;
			$(".tatReportTable > #tbodyR").empty();
			$('#tatReportTable').dataTable().fnClearTable();
			$('#tatReportTable').DataTable().destroy();
			dataList.forEach(function(items) {
				$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
					+ items.split('~')[0]
					+ "</td><td><span name='incidentName' value='" + items.split('~')[1] + "' class='textCapitalize'>"
					+ items.split('~')[1]
					+ "</td><td><span name='operatingOfcLocation' value='" + items.split('~')[2] + "' class='textCapitalize'> <a href='#' class='text-blue' id='" + items.split('~')[0] + "' onclick='viewAlertDetails(this.id)'>"
					+ items.split('~')[2]
					+ "</td><td><span name='operatingOfcLocation' value='" + items.split('~')[3] + "' class='textCapitalize'>"
					+ items.split('~')[3]
					+ "</td>"
					+ "</tr>").appendTo(".tatReportTable");
			});
			$("#tatReportTable").DataTable({
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
				"buttons": [{
							extend: 'excel',
							title: 'Closure TAT Report',
						},{	
							extend: 'csv',
							title: 'Closure TAT Report',
						},{	
							extend: 'pdf',
							title: 'Closure TAT Report',
						},{	
							extend: 'print',
							title: 'Closure TAT Report',

						}],
			}).buttons().container().appendTo(
				'#tatReportTable_wrapper .col-md-6:eq(0)');

	
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
/*FETCH BUTTON CLICK FUNCTION*/




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


/*View Alert Details*/

function viewAlertDetails(branchId) {
	
	 branchIdTemp = branchId;
	var branchId = branchId;
	//alert(branchId);
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();

	var pageValJson = "{\"branchId\":" + "\"" + branchId + "\",\n"
		+ "    \"startDate\": \"" + startDate + "\",\n"
		+ "    \"endDate\":\"" + endDate + "\"\n" + "}";

	console.log(pageValJson);

	document.getElementById('load').style.visibility = "visible";

	$.ajax({
		url: 'fetchAlertDetails',
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
			var dataList = obj.alertRuleList;
			console.log(dataList);
			$(".tatAlertListTable > #tbodyC").empty();
			$('#tatAlertListTable').dataTable().fnClearTable();
			$('#tatAlertListTable').DataTable().destroy();
			dataList.forEach(function(items) {
				//alert(items)
				$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
					+ items.alertId
					+ "</td><td><span name='ruleId' value='" + items.ruleId + "' class='textCapitalize'>"
					+ items.ruleId
					+ "</td><td><span name='ruleId' value='" + items.ruleDesc + "' class='textCapitalize'>"
					+ items.ruleDesc
					+ "</td><td><span name='alertStatus' value='" + items.alertStatus + "' class='textCapitalize'>"
					+ items.alertStatus
					+ "</td><td><span name='ruleclassification' value='" + items.ruleClassification + "' class='textCapitalize'>"
					+ items.ruleClassification
					+ "</td><td><span name='ruleclassification' value='" + items.generatedTime + "' class='textCapitalize'>"
					+ items.generatedTime
					+ "</td><td><span name='ruleTat' value='" + items.ruleTat + "' class='textCapitalize'>"
					+ items.ruleTat
					+ "</td>"
					+ "</tr>").appendTo(".tatAlertListTable");
			});
			$("#tatAlertListTable").DataTable({
				"columnDefs": [{
					orderable: false
				}],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": ["csv", "excel", "pdf", "print"]
			}).buttons().container().appendTo(
				'#tatAlertListTable_wrapper .col-md-6:eq(0)');

			$('#tatAlertListTable').show();
			$('#alertDetailsTable').show();

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

/*View Alert Details*/


/*FETCH ZONE WISE AND REGION WISE*/

/*$(document).ready(function() {

	var searchParam = $('#searchParam').val();
	var regionName = $('#region').val();
	var zone = $('#zone').val();


	if (searchParam == 'REGION') {

		var pageValJson = "{\"region\":" + "\"" + regionName + "\",\n"
			+ "    \"searchParam\":\"" + searchParam + "\"\n" + "}";



		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchBranchListByRegionNameList',
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
				/*$("<option />", {
					val: "All",
					text: "ALL"
				}).appendTo($("#branchDropdown"));*/
				/*obj.branchDtoList.forEach(function(items) {
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
		});*/


	/*} else if (searchParam == 'ZONE') {
		
		var pageValJson = "{\"zone\":" + "\"" + zone + "\",\n"
			+ "    \"searchParam\":\"" + searchParam + "\"\n" + "}";
		
		//alert("pageValJson = " + pageValJson)
		document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchRegionByZoneNameList',
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

	}*/


//});*/
/*FETCH ZONE WISE AND REGION WISE*/


/*FETCH BRANCH WISE BY REGION  IF SEARCH PARAM IS ZONE*/

/*$('#regionDropdown').change(function() {
	
	
	var pageValJson = "{\"region\":" + "\"" + regionName + "\",\n"
			+ "    \"searchParam\":\"" + searchParam + "\"\n" + "}";



		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchBranchListByRegionNameList',
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
				$("#branchDropdown1").empty();
				$("<option />", {
					val: "",
					text: "Select Branch"
				}).appendTo($("#branchDropdown1"));
				$("<option />", {
					val: "All",
					text: "ALL"
				}).appendTo($("#branchDropdown1"));
				obj.branchDtoList.forEach(function(items) {
					$("<option />", {
						val: items.branchId,
						text: items.branchName
					}).appendTo($("#branchDropdown1"));
				});
				$("#branchDropdown1").show();
			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.success('Some Error Occured');
			}
		});
	
});	*/

/*FETCH BRANCH WISE BY REGION */


/*EXPORT EXCEL*/
$('.exportExcel').click(function() {
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();

	var pageValJson = "{\"branchId\":" + "\"" + branchIdTemp + "\",\n"
		+ "    \"startDate\": \"" + startDate + "\",\n"
		+ "    \"sourceTxt\": \"" + dataListTemp + "\",\n"
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

});

/*EXPORT EXCEL*/


