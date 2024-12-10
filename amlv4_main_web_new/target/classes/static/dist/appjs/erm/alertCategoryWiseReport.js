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
	var zoneId = $('#zoneDropdown').val(); 
	var branchId = $('#branchDropdown').val();
	var regionId = $('#regionDropdown').val();
	var ruleClassification = $('#ruleCategoryDropdown').val();
	var ruleCategoryDropdown = $('#ruleCategoryDropdown').val();
	var validFlg = true;


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

	if (zoneId == '') {
		toastr.error("Zone cannot be blank");
		validFlg = false;
	}

	if (branchId == '') {
		toastr.error("Branch cannot be blank");
		validFlg = false;
	}

	if (regionId == '') {
		toastr.error("Region cannot be blank");
		validFlg = false;
	}

	if (ruleCategoryDropdown == '') {
		toastr.error("Rule Category cannot be blank");
		validFlg = false;
	}


	if (validFlg) {

		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();

		var pagevalJson = "{\"branchId\":" + "\"" + branchId + "\",\n"
			+ "    \"regionId\": \"" + regionId + "\",\n"
			+ "    \"ruleClassification\": \"" + ruleClassification + "\",\n"
			+ "    \"startDate\": \"" + startDate + "\",\n"
			+ "    \"endDate\":\"" + endDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchCategorywiseAlertCountReport',
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
				var dataList = obj.alertReportRiskwiseList;


				$(".ruleWiseReportTable > #tbodyR").empty();
				$('#ruleWiseReportTable').dataTable().fnClearTable();
				$('#ruleWiseReportTable').DataTable().destroy();
				dataList.forEach(function(items) {
					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.split('~')[0]
						+ "</td><td><span name='incidentName' value='" + items.split('~')[1] + "' class='textCapitalize'>"
						+ items.split('~')[1]
						+ "</td><td><span name='operatingOfcLocation' value='" + items.split('~')[2] + "' class='textCapitalize'>"
						+ items.split('~')[2]
						+ "</td><td><span name='operatingOfcLocation' value='" + items.split('~')[3] + "' class='textCapitalize'>"
						+ items.split('~')[3]
						+ "</td><td><span name='primaryLossEvent' value='" + items.split('~')[4] + "' class='textCapitalize'>"
						+ items.split('~')[4]
						+ "</td><td><span name='primaryLossEvent' value='" + items.split('~')[8] + "' class='textCapitalize'>"
						+ items.split('~')[8]
						+ "</td><td><span name='primaryLossEvent' value='" + items.split('~')[9] + "' class='textCapitalize'>"
						+ items.split('~')[9]
						+ "</td><td><span name='primaryLossEvent' value='" + items.split('~')[5] + "' class='textCapitalize'>"
						+ items.split('~')[5]
						+ "</td><td><span name='primaryLossEvent' value='" + items.split('~')[6] + "' class='textCapitalize'>"
						+ items.split('~')[6]
						+ "</td><td><span name='primaryLossEvent' value='" + items.split('~')[7] + "' class='textCapitalize'>"
						+ items.split('~')[7]
						+ "</td>"
						+ "</tr>").appendTo(".ruleWiseReportTable");
				});
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
	}
});
/*FETCH BUTTON CLICK FUNCTION*/

/*EXPORT EXCEL*/
$('.exportExcel').click(function() {
	var zoneId = $('#zoneDropdown').val(); 
	var branchId = $('#branchDropdown').val();
	var regionId = $('#regionDropdown').val();
	var ruleClassification = $('#ruleCategoryDropdown').val();
	var ruleCategoryDropdown = $('#ruleCategoryDropdown').val();
	var validFlg = true;


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

	if (zoneId == '') {
		toastr.error("Zone cannot be blank");
		validFlg = false;
	}

	if (branchId == '') {
		toastr.error("Branch cannot be blank");
		validFlg = false;
	}

	if (regionId == '') {
		toastr.error("Region cannot be blank");
		validFlg = false;
	}

	if (ruleCategoryDropdown == '') {
		toastr.error("Rule Category cannot be blank");
		validFlg = false;
	}


	if (validFlg) {

		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();

		var pageValJson = "{\"branchId\":" + "\"" + branchId + "\",\n"
			+ "    \"regionId\": \"" + regionId + "\",\n"
			+ "    \"ruleClassification\": \"" + ruleClassification + "\",\n"
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
