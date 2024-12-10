/*Loader*/
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
/*Loader*/

// BS-Stepper Init
$(document).ready(function() {
	var stepper = new Stepper($('.bs-stepper')[0])
})
// BS-Stepper Init
document.addEventListener('DOMContentLoaded', function() {
	window.stepper = new Stepper(document.querySelector('.bs-stepper'))
})

function validateFirst() {
	var flg = false;
	var count = 0;
	$('input[name="alertIdCheckBox"]:checked').each(function() {
		count = count + 1;
	});
	if (count > 0) {
		flg = true;
	}
	if (flg) {
		$("#transferParameter").css("display", "");
		stepper.next();
	} else {
		toastr.error("Select Alerts");
	}
}

/*Initialize Select2 Elements*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});
/*Initialize Select2 Elements*/

$(document).ready(function() {

	var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}

	$("#transferTempTable").hide();
	$("#tempDivAudit").hide();



});


$(function() {
	$("#transferAlertTable").DataTable({
		"columnDefs": [{
			orderable: false,

		}],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"searching": true,
		"language": {
			"emptyTable": "No Data Available"
		},
		"buttons": ["csv", "excel", "pdf", "print"]
	}).buttons().container().appendTo(
		'#transferAlertTable_wrapper .col-md-6:eq(0)');
});

/*SELECT ALL FUNCTION*/
/*
$("#checkAll").click(function() {

	$('input:checkbox').not(this).prop('checked', this.checked);
});
*/
/*SELECT ALL FUNCTION*/


/*Submit CLICK FUNCTION
$("#approve").click(function() {

	var flg = false;

	var finalString = "";

	var searchParam = $("#searchParam").val();

	//document.getElementById('load').style.visibility = "visible";

	if (searchParam == 'REGION') {

		var dataList = "";
		if ($('input[name=selectId]:checked').length <= 0) {
			toastr.error("Select atleast one Checkbox");
		}
		if ($("#branchDropdown").val() == "") {
			toastr.error("Please Select Branch Id");
		}
		var solId = $("#branchDropdown").val();


		$('input:checkbox[name=selectId]')
			.each(
				function() {
					if ($(this).is(':checked')) {
						var valueTemp = $(this).val();
						var branchId = valueTemp.split('~')[0]

						if (branchId.trim() == solId.trim()) {

							toastr.error("Branch Id cannot be same for Alert Transfer");
							flg = true;
						} else {
							flg = false;
						}


					}
				});


		dataList = "[\n";
		$('input:checkbox[name=selectId]')
			.each(
				function() {
					if ($(this).is(':checked')) {
						var valueTemp = $(this).val();
						dataList = dataList +
							" { \"branchId\": \"" + valueTemp.split('~')[0] + "\",\n" +
							"\"branchName\": \"" + valueTemp.split('~')[1] + "\",\n" +
							"\"ruleId\": \"" + valueTemp.split('~')[2] + "\"},";
						"\"countObj\": \"" + valueTemp.split('~')[3] + "\"},";
					}
				});
		dataList = dataList.substring(0, dataList.length - 1);
		dataList += "]";

		var reason = $('#approvereason').val().replace(/(\r\n|\n|\r)/gm, "");
		reason = reason.replace(/[\t\n]+/g, ' ');
		if (reason == '') {
			$('span[id^="reason-error"]').remove();
			$('#reason').addClass('is-invalid');
			$('#reason')
				.after(
					'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
		} else if (reason.length < 10) {
			$('span[id^="reason-error"]').remove();
			$('#reason').addClass('is-invalid');
			$('#reason')
				.after(
					'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
		} else {

			var zone = $("#zoneDropdown").val();
			var region = $("#regionDropdown").val();
			var value = $("#alertCategoryDropdown").val();

			finalString = "{\n" +
				"    \"branchId\": \"" + solId + "\",\n" +
				"    \"region\": \"" + region + "\",\n" +
				"    \"searchValue\": \"" + value + "\",\n" +
				"    \"zone\": \"" + zone + "\",\n" +
				"    \"searchParam\": \"" + searchParam + "\",\n" +
				"\"commentDto\":{\"comment\":\"" + reason + "\"}," +
				"    \"alertTransferDtoList\":" + dataList + "\}";

			console.log(finalString);

		}

	} else if (searchParam == 'BRANCH') {

		var flg = false;
		var roleName = "";
		var assetOperationFlg = $("#oaDropdown").val();

		if ($("#verticalDropdown").val() == "") {
			toastr.error("Please Select Vertical");
			flg = true;
		}


		var custVertical = $("#verticalDropdown").val();

		if (custVertical == 'Retail Banking') {
			if ($("#roleDropdown").val() !== null && $("#roleDropdown").val() !== undefined &&
				$("#roleDropdown").val() !== '') {
				custVertical = $("#roleDropdown").val();
			} else {
				toastr.error("Please Select Asset/Operation");
				flg = true;

			}

		}

		$('input:checkbox[name=selectId]')
			.each(
				function() {
					if ($(this).is(':checked')) {
						var valueTemp = $(this).val();
						var category = valueTemp.split('~')[5]

						if (category.trim() == roleName.trim()) {

							toastr.error("Category cannot be same for Alert Transfer");
							flg = true;
						} else {
							flg = false;
						}


					}
				});


		var dataList = "";
		if ($('input[name=selectId]:checked').length <= 0) {
			toastr.error("Select atleast one Checkbox");
			flg = true;
		}
		if ($("#verticalDropdown").val() == "") {
			toastr.error("Please Select Sol Id");
			flg = true;
		}




		dataList = "[\n";
		$('input:checkbox[name=selectId]')
			.each(
				function() {
					if ($(this).is(':checked')) {
						var valueTemp = $(this).val();
						dataList = dataList +
							" { \"branchId\": \"" + valueTemp.split('~')[0] + "\",\n" +
							"\"branchName\": \"" + valueTemp.split('~')[1] + "\",\n" +
							"\"alertId\": \"" + valueTemp.split('~')[5] + "\",\n" +
							"\"ruleId\": \"" + valueTemp.split('~')[2] + "\",\n" +
							"\"vertical\": \"" + valueTemp.split('~')[3] + "\"},";
					}
				});
		dataList = dataList.substring(0, dataList.length - 1);
		dataList += "]";


		var reason = $('#approvereason').val().replace(/(\r\n|\n|\r)/gm, "");
		reason = reason.replace(/[\t\n]+/g, ' ');
		if (reason == '') {
			$('span[id^="reason-error"]').remove();
			$('#reason').addClass('is-invalid');
			$('#reason')
				.after(
					'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
		} else if (reason.length < 10) {
			$('span[id^="reason-error"]').remove();
			$('#reason').addClass('is-invalid');
			$('#reason')
				.after(
					'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
		} else {

			finalString = "{\n" +
				"    \"custVertical\": \"" + custVertical + "\",\n" +
				"    \"searchParam\": \"" + searchParam + "\",\n" +
				"\"commentDto\":{\"comment\":\"" + reason + "\"}," +
				"    \"alertTransferDtoList\":" + dataList + "\}";


			console.log(finalString);
		}
	}



	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase), finalString);
	$("#encryptedJson").val(ciphertext + ':~:' + passphrase);

	if (flg == false) {
		//$('#transferAlertForm').submit();

	} else if (flg == true) {
		console.log(flg);
	}


});
Submit CLICK FUNCTION*/


/*transfer_btn click Function*/

$("#solDropdown").change(function() {

	if ($('input[name=selectId]:checked').length <= 0) {

		toastr.error("Select atleast one Checkbox");
	}

});

/*transfer_btn click Function*/

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
				val: "ALL",
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

/*FETCH BRANCH BASED ON REGION*/

$('#regionDropdown').change(function() {
	var regionValue = $("#regionDropdown option:selected").text();

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
				val: "ALL",
				text: "ALL"
			}).appendTo($("#branchDropdown"));
			obj.branchDtoList.forEach(function(items) {
				$("<option />", {
					val: items.branchId,
					text: items.branchId + '-' + items.branchName
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


/*FETCH REGION BASED ON ZONE*/

$('#zoneDropdown1').change(function() {

	var zoneValue = $('#zoneDropdown1').val();
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
			$("#regionDropdown1").empty();
			$("<option />", {
				val: "",
				text: "Select Region"
			}).appendTo($("#regionDropdown1"));
			obj.regionDtoList.forEach(function(items) {
				$("<option />", {
					val: items.regionName,
					text: items.regionName
				}).appendTo($("#regionDropdown1"));
			});
			$("#regionDropdown1").show();
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

$('#regionDropdown1').change(function() {
	var regionValue = $("#regionDropdown1 option:selected").text();

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
			$("#branchDropdown1").empty();
			$("<option />", {
				val: "",
				text: "Select Branch"
			}).appendTo($("#branchDropdown1"));
			obj.branchDtoList.forEach(function(items) {
				$("<option />", {
					val: items.branchId,
					text: items.branchId + '-' + items.branchName
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
});


$('#branchDropdown1').change(function() {
	var branchDropdown1 = $("#branchDropdown1").val();

	var pageValJson = "{\"branchId\":" + "\"" + branchDropdown1 + "\"\n" + "}"
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchBranchWiseVerticalList',
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
			$("#verticalDropdown").empty();
			$("<option />", {
				val: "",
				text: "Select Vertical"
			}).appendTo($("#verticalDropdown"));
			
			obj.riskList.forEach(function(items) {
				$("<option />", {
					val: items.split('~')[0],
					text: items.split('~')[1]
				}).appendTo($("#verticalDropdown"));
			});
			$("#verticalDropdown").show();
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

$('#verticalDropdown').change(function() {
	var verticalDropdown = $("#verticalDropdown").val();

	var pageValJson = "{\"custVertical\":" + "\"" + verticalDropdown + "\"\n" + "}"
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchVerticalWiseRoleList',
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
			$("#roleDropdown").empty();
			$("<option />", {
				val: "",
				text: "Select Role"
			}).appendTo($("#roleDropdown"));
			obj.tatReportList.forEach(function(items) {
				$("<option />", {
					val: items,
					text: items
				}).appendTo($("#roleDropdown"));
			});
			$("#roleDropdown").show();
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


$('#fetchDataBtn').click(function() {

	var zoneId = "All";
	var branchId = "All";
	var regionId = "All";
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
	var searchValue = "branchAlert";

	var searchParam = $('#searchParam').val();

	var pageValJson = "{\"branchId\":" + "\"" + branchId + "\",\n"
		+ "    \"region\": \"" + regionId + "\",\n"
		+ "    \"zone\": \"" + zoneId + "\",\n"
		+ "    \"searchValue\": \"" + searchValue + "\",\n"
		+ "    \"searchParam\": \"" + searchParam + "\"}";

	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchAuditAlertsNew',
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
			//clear Drop-Down List of ;
			var datalist = obj.alertList
			$("#branchWiseCountDiv").css("display", "");
			$("#tbodyAudit").empty();
			$('#transferAlertTableAudit').dataTable()
				.fnClearTable();
			$('#transferAlertTableAudit').DataTable()
				.destroy();

			datalist.forEach(function(item) {
				$(
					"<tr>"

					+ "<td>"
					+ item.branchId
					+ "</td>"

					+ "<td><span class='text-capitalize'>"
					+ item.branchName
					+ "</span></td>"

					+ "<td><a href='#' class='text-blue' id='" + item.branchId + "' onclick='viewCountDetail(this.id)'>"
					+ item.countObj
					+ "</td>"


					+ "</tr>"

				)
					.appendTo(
						"#tbodyAudit");

			});

			$("#tempDivAudit").show();
			$("#transferAlertTableAudit").DataTable({
				"columnDefs": [{
					orderable: false,

				}],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"searching": true,
				"language": {
					"emptyTable": "No Data Available"
				},
			})


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


/*SOL DROP DOWN*/
/*$(document).ready(function() {

	var region = $("#region").val();
	var searchParam = $("#searchParam").val();

if(searchParam == 'REGION'){
	
	var pageValJson = "{\n" +
		"    \"region\": \"" + region + "\",\n" +
		"    \"searchParam\":\"" + searchParam +"\"" +
		 "}";
	

	$.ajax({
		url: 'fetchBranchListByRegionName',
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
			$("#solDropdown").empty();
			$("<option />", {
				val: "",
				text: "Select Branch"
			}).appendTo($("#solDropdown"));
			obj.branchDtoList.forEach(function(items) {
				$("<option />", {
					val: items.branchId,
					text: items.branchName
				}).appendTo($("#solDropdown"));
			});
			$("#solDropdown").show();
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
});*/
/*SOL DROP DOWN*/


/*VERTICAL DROP DOWN*/

$(document).ready(function() {

	$("#roleSelectDrpDown").hide();


	var branchId = $("#branchId").val();
	var searchParam = $("#searchParam").val();

	if (searchParam == 'BRANCH') {

		var pageValJson = "{\n" +
			"    \"branchId\": \"" + branchId + "\",\n" +
			"    \"searchParam\":\"" + searchParam + "\"" +
			"}";

		console.log(pageValJson);

		$.ajax({
			url: 'fetchBranchListByRegionNameNew',
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
				$("#verticalDropdown").empty();
				$("<option />", {
					val: "",
					text: "Select Vertical"
				}).appendTo($("#verticalDropdown"));

				console.log("obj.roleDtoList = " + obj.branchDrpdownList)
				obj.branchDrpdownList.forEach(function(items) {
					$("<option />", {
						val: items,
						text: items
					}).appendTo($("#verticalDropdown"));
				});
				$("#verticalDropdown").show();
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


	$("#transferAlertTableAudit").DataTable({
		"columnDefs": [{
			orderable: false,

		}],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"searching": true,
		"language": {
			"emptyTable": "No Data Available"
		},
		"buttons": ["csv", "excel", "pdf", "print"]
	}).buttons().container().appendTo(
		'#transferAlertTableAudit_wrapper .col-md-6:eq(0)');

});
/*VERTICAL DROP DOWN*/

/*VERTICAL DROPDOWN CHANGE FUNCTION*/

$("#verticalDropdown").change(function() {

	var verticalName = $("#verticalDropdown").val();
	var searchParam = $("#searchParam").val();

	if (verticalName == 'Retail Banking') {

		$("#roleSelectDrpDown").show();
		/*$("#roleDropdown").empty();
		$("<option />", {
			val: "",
			text: "Select Category"
		}).appendTo($("#roleDropdown"));

		$("<option />", {
			val: "RBG Asset Officer",
			text: "RBG Asset Officer"
		}).appendTo($("#roleDropdown"));

		$("<option />", {
			val: "RBG Operation Officer",
			text: "RBG Operation Officer"
		}).appendTo($("#roleDropdown"));

		$("#roleDropdown").show();
		$("#roleSelectDrpDown").show();
*/

	} else {
		$("#roleSelectDrpDown").hide();
	}


});

/*VERTICAL DROPDOWN CHANGE FUNCTION*/

$("#alertCategoryDropdown").change(function() {

	var value = $("#alertCategoryDropdown").val();

	var pageValJson = "{\"searchValue\":" + "\"" + value + "\"\n" + "}"
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchBranchAlertTransferListNew',
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
			$("#tbodyR").empty();
			$('#transferAlertTable').dataTable()
				.fnClearTable();
			$('#transferAlertTable').DataTable()
				.destroy();

			obj.alertList
				.forEach(function(item) {

					$(
						"<tr>"

						+ "<td>"
						+ item.branchId
						+ "</td>"

						+ "<td><span class='text-capitalize'>"
						+ item.branchName
						+ "</span></td>"

						+ "<td><a href='#' class='text-blue' id='" + item.branchId + "' onclick='viewCountDetail(this.id)'>"
						+ item.countObj
						+ "</td>"


						+ "</tr>"

					)
						.appendTo(
							"#tbodyR");

				});

			$("#transferAlertTable").DataTable({
				"columnDefs": [{
					orderable: false,

				}],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"searching": true,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": ["csv", "excel", "pdf", "print"]
			}).buttons().container().appendTo(
				'#transferAlertTable_wrapper .col-md-6:eq(0)');

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


//viewAlertCount

$('a.viewAlertCount').click(function() {
	var branchId = $(this).attr('id');
	var region = $("#regionValue").val();


	var searchParam = "BRANCH";


	var pageValJson = "{\n" +
		"    \"branchId\": \"" + branchId + "\",\n" +
		"    \"searchParam\":\"" + searchParam + "\",\n" +
		"    \"region\":\"" + region + "\"" +
		"}";



	//fetchPositionWiseAlerts
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchAlertDetailedData',
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

			var dataList = obj.alertList;


			$("#transferTempTable").hide();
			$("#tbodyT").empty();
			$('#transferListTable').dataTable()
				.fnClearTable();
			$('#transferListTable').DataTable()
				.destroy();

			dataList.forEach(function(items) {

				if (items.alertId) {

					$("<tr role='row' class='odd' id='row_id'><td><input type='checkbox' name='alertIdCheckBox' title='" + items.alertId + "~" + items.alertId + "'  value='" + items.alertId + "~" + items.branchId + "' id='" + items.alertId + "'>"
						+ "</td><td>"
						+ items.alertId
						+ "</td><td><span name='incidentName' class='textCapitalize'>"
						+ items.branchId
						+ "</td><td><span name='branchName' class='textCapitalize'>"
						+ items.branchName
						+ "</td><td><span name='incidentName' class='textCapitalize'>"
						+ items.custAcid
						+ "</td><td><span name='incidentName' class='textCapitalize'>"
						+ items.acctName
						+ "</td><td><span name='incidentName' class='textCapitalize'>"
						+ items.ruleId
						+ "</td><td><span name='incidentDescription' value='" + items.ruleDesc + "' class='textCapitalize description'>"
						+ items.ruleDesc
						+ "</span></td>"
						+ "</tr>").appendTo(".transferListTable");
				}
			});

			$("#transferTempTable").show();

			$("#tempDivAudit").show();



			$("#transferListTable").DataTable({
				"columnDefs": [{
					orderable: false,

				}],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"searching": true,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": ["csv", "excel", "pdf", "print"]
			}).buttons().container().appendTo(
				'#transferListTable_wrapper .col-md-6:eq(0)');

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


$('#transfer_btnMo').click(function() {
	var zoneId = "";
	var branchId = "";
	var regionId = "";
	var vertical = "";
	var role = "";
	var validFlg = true;

	if ($('#zoneDropdown1').val() !== null && $('#zoneDropdown1').val() !== undefined &&
		$('#zoneDropdown1').val() !== '') {
		zoneId = $("#zoneDropdown1 option:selected").text();
	} else {
		validFlg = false;
	}
	if ($('#branchDropdown1').val() !== null && $('#branchDropdown1').val() !== undefined &&
		$('#branchDropdow1n').val() !== '') {
		branchId = $('#branchDropdown1').val();
	} else {
		validFlg = false;
	}
	if ($('#regionDropdown1').val() !== null && $('#regionDropdown1').val() !== undefined &&
		$('#regionDropdown1').val() !== '') {
		regionId = $('#regionDropdown1').val();
	} else {
		validFlg = false;
	}
	if ($('#verticalDropdown').val() !== null && $('#verticalDropdown').val() !== undefined &&
		$('#verticalDropdown').val() !== '') {
		vertical = $('#verticalDropdown').val();
	} else {
		validFlg = false;
	}
	if ($('#roleDropdown').val() !== null && $('#roleDropdown').val() !== undefined &&
		$('#roleDropdown').val() !== '') {
		role = $('#roleDropdown').val();
	} else {
		validFlg = false;
	}

	if (validFlg) {
		$('#approvecommentmodalM').modal('show');
	}
})

$('#approveM').click(function() {

	var alertIdValues = '';

	$('input[name="alertIdCheckBox"]:checked').each(function() {
		alertIdValues += this.value + ',';
	});
	alertIdValues = alertIdValues.substring(0,
		alertIdValues.length - 1);

	//	alert("alertIdValues :" + alertIdValues)

	var reason = $('#approvereasonM').val().replace(/(\r\n|\n|\r)/gm, "");
	reason = reason.replace(/[\t\n]+/g, ' ');
	
	if (reason == '') {
		alert(reason+"NA");
		$('span[id^="reason-error"]').remove();
		$('#approvereasonM').addClass('is-invalid');
		$('#approvereasonM')
			.after(
				'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
	} else if (reason.length < 10) {
		alert(reason+" "+reason.length);
		$('span[id^="reason-error"]').remove();
		$('#approvereasonM').addClass('is-invalid');
		$('#approvereasonM')
			.after(
				'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
	} else {

		var searchParam = $("#searchParam").val();
		var solId = $("#branchDropdown1").val();
		var zone = $("#zoneDropdown1 option:selected").text();
		var region = $("#regionDropdown1").val();
		var vertical = $('#verticalDropdown').val();
		var role = $('#roleDropdown').val();
		var value = "";
		value = "branchAlert";


		var finalStringM = "{\n" +
			"    \"branchId\": \"" + solId + "\",\n" +
			"    \"region\": \"" + region + "\",\n" +
			"    \"custVertical\": \"" + vertical + "\",\n" +
			"    \"actRoleId\": \"" + role + "\",\n" +
			"    \"searchValue\": \"" + value + "\",\n" +
			"    \"zone\": \"" + zone + "\",\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"\"commentDto\":{\"comment\":\"" + reason + "\"}," +
			"    \"ruleName\":\"" + alertIdValues + "\"}";



		console.log(finalStringM);
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(
			128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase), finalStringM);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$('#transferAlertForm').submit();
	}

})


function viewCountDetail(branchId) {

	var branchId = branchId;
	var searchParam = "Branch";

	var pageValJson = "{\n" +
		"    \"branchId\": \"" + branchId + "\",\n" +
		"    \"searchParam\":\"" + searchParam + "\"\n" +
		"}";

	//fetchPositionWiseAlerts
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchAlertDetailedData',
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

			var dataList = obj.alertList;
			$("#alertListDiv").css("display", "");


			$("#transferTempTable").hide();
			$("#tbodyT").empty();
			$('#transferListTable').dataTable()
				.fnClearTable();
			$('#transferListTable').DataTable()
				.destroy();

			dataList.forEach(function(items) {

				if (items.alertId) {

					$("<tr role='row' class='odd' id='row_id'><td><input type='checkbox' name='alertIdCheckBox' title='" + items.alertId + "~" + items.alertId + "'  value='" + items.alertId + "~" + items.branchId + "' id='" + items.alertId + "'>"
						+ "</td><td>"
						+ items.alertId
						+ "</td><td><span name='incidentName' class='textCapitalize'>"
						+ items.branchId
						+ "</td><td><span name='branchName' class='textCapitalize'>"
						+ items.branchName
						+ "</td><td><span name='incidentName' class='textCapitalize'>"
						+ items.custAcid
						+ "</td><td><span name='incidentName' class='textCapitalize'>"
						+ items.acctName
						+ "</td><td><span name='incidentName' class='textCapitalize'>"
						+ items.ruleId
						+ "</td><td><span name='incidentDescription' value='" + items.ruleDesc + "' class='textCapitalize description'>"
						+ items.ruleDesc
						+ "</span></td>"
						+ "</tr>").appendTo(".transferListTable");
				}
			});

			$("#transferTempTable").show();

			$("#transferListTable").DataTable({
				"columnDefs": [{
					orderable: false,

				}],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"searching": true,
				"language": {
					"emptyTable": "No Data Available"
				},
			})

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





// Required Field Validation
jQuery(document).ready(function() {

	$(function() {
		$('#transferAlertForm').validate(
			{
				rules: {

					zoneDropdown: {
						required: true,
					},

					regionDropdown: {
						required: true,
					},

					branchDropdown: {
						required: true,
					},


				},

				messages: {

					zoneDropdown: {
						required: "Please select a Zone"
					},
					regionDropdown: {
						required: "Please select a Region"
					},
					branchDropdown: {
						required: "Please select a  Branch"
					},

				},
				errorElement: 'span',
				errorPlacement: function(
					error, element) {
					error
						.addClass('invalid-feedback');
					element.closest(
						'.form-group')
						.append(error);
				},
				highlight: function(
					element,
					errorClass,
					validClass) {
					$(element).addClass(
						'is-invalid');
				},
				unhighlight: function(
					element,
					errorClass,
					validClass) {
					$(element).removeClass(
						'is-invalid');
				},
				submitHandler: function(
					form) {

					document
						.getElementById('load').style.visibility = "visible";
					form.submit();

				}
			});
	});
});

/*SUBMIT FUNCTION*/




$(document).ready(function() {
	$("#checkAll").change(function() {
		$('input:checkbox').not(this).prop('checked', this.checked);
	});
	$('.textCapitalize').on('click', function() {
		if ($('.textCapitalize:checked').length == $('.textCapitalize').length) {
			$('#checkAll').prop('checked', true);
		} else {
			$('#checkAll').prop('checked', false);
		}
	});
});
