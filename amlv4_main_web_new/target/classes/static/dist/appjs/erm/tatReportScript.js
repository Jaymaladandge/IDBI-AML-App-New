/*Loader*/
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
/*Loader*/

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
		format: 'DD-MM-YYYY',
		autocomplete: 'off',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY',
		autocomplete: 'off',
		onChangeDateTime: function(dp, $input) {
		}
	});

	$('.datepicker').on('click', function(e) {
		e.preventDefault();
		$(this).attr("autocomplete", "off");
	})

	//$('#reportTable').hide();

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

$(function() {

	var currentdate = new Date();
	var datetime = +currentdate.getDate() + "/"
		+ (currentdate.getMonth() + 1) + "/"
		+ currentdate.getFullYear() + "_" + currentdate.getHours()
		+ ":" + currentdate.getMinutes() + ":"
		+ currentdate.getSeconds();
	$("#tatReportTable").DataTable({
		"columnDefs": [{
			orderable: false
		}],
		"order": [0, "desc"],
		"responsive": false,
		"lengthMenu": [5, 10, 20],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,

		"language": {
			"emptyTable": "No Data Available"
		},
		"buttons": [{

			extend: 'excel',
			title: 'TatReport_' + datetime,

		}, {

			extend: 'pdfHtml5',
			title: 'TatReport_' + datetime,

		}]
	}).buttons().container().appendTo(
		'#tatReportTable_wrapper .col-md-6:eq(0)');

	/*$("#tatBranchReportTable").DataTable({
		"columnDefs": [{
			orderable: false
		}],
		"order": [0, "desc"],
		"responsive": false,
		"lengthMenu": [5, 10, 20],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,

		"language": {
			"emptyTable": "No Data Available"
		},
		"buttons": [{

			extend: 'excel',
			title: 'TatReport_' + datetime,

		}, {

			extend: 'pdfHtml5',
			title: 'TatReport_' + datetime,

		}]
	}).buttons().container().appendTo(
		'#tatBranchReportTable_wrapper .col-md-6:eq(0)');*/
});


$(document).on("click", ".branchTatReport", function() {
	var alertDetails = $(this).attr('id');
	var values = alertDetails.split('~');
	var branchid = values[0];
	var startDate = values[1];
	var endDate = values[2];

	var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n" +
		"    \"branchId\":\"" + branchid + "\",\n" +
		"    \"endDate\":\"" + endDate + "\"\n" + "}";
	console.log(pagevalJson)
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchBranchWiseReportCount',
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
			console.log(obj);

			$('#tatBranchReportTable').css("display", "");
			$(".tatBranchTBody").empty();
			$('#tatBranchReportTable').dataTable().fnClearTable();
			$('#tatBranchReportTable').DataTable().destroy();
			obj.alertList
				.forEach(function(item) {

					$(
						"<tr>"

						+ "<td>"
						+ item.custId
						+ "</a></td>"

						+ "<td class='text-capitalize'>"
						+ item.custName
						+ "</a></td>"

						+ "<td>"
						+ item.custAcid
						+ "</td>"

						+ "<td>"
						+ item.ruleId
						+ "</a></td>"

						+ "<td>"
						+ item.ruleDesc
						+ "</a></td>"

						+ "<td>"
						+ item.actUserId
						+ "</a></td>"

						+ "<td>"
						+ item.userId
						+ "</a></td>"

						+ "<td>"
						+ item.branchId
						+ "</a></td>"

						+ "<td>"
						+ item.generatedTime
						+ "</a></td>"

						+ "<td>"
						+ item.closeLastChangeTime
						+ "</a></td>"

						+ "<td>"
						+ item.alertTat
						+ "</a></td>"

						+ "<td>"
						+ item.commentedBy
						+ "</a></td>"

						+ "<td>"
						+ item.commentedDate
						+ "</a></td>"

						+ "<td>"
						+ item.comment
						+ "</a></td>"

						+ "</tr>")
						.appendTo(
							".tatBranchTBody");

				});

			$(window).scrollTop($('#tatBranchReportTable').offset().top);
			var currentdate = new Date();
			var datetime = +currentdate.getDate() + "/"
				+ (currentdate.getMonth() + 1) + "/"
				+ currentdate.getFullYear() + "_" + currentdate.getHours()
				+ ":" + currentdate.getMinutes() + ":"
				+ currentdate.getSeconds();
			$("#tatBranchReportTable").DataTable({
				"columnDefs": [{
					orderable: false
				}],
				"order": [0, "desc"],
				"responsive": false,
				"lengthMenu": [5, 10, 20],
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,

				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": [{

					extend: 'excel',
					title: 'TatReport_' + datetime,

				}, {

					extend: 'pdfHtml5',
					title: 'TatReport_' + datetime,

				}]
			}).buttons().container().appendTo(
				'#tatBranchReportTable_wrapper .col-md-6:eq(0)');

		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.error('Some Error Occured');
		}
	});
});

$(document).on("click", ".fetchDataBtn", function() {
	var searchParam = $(this).attr('id');
	var regionValue = $('#regionDropdown').val();
	var zoneId = $('#zoneDropdown').val();
	var branchId = $('#branchDropdown').val();

	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();



	if (endDate === null || endDate === '' || endDate === undefined) {
		if (startDate === null || startDate === '' || startDate === undefined) {
			startDate = '';
			endDate = '';
		}
		startDate = '';
		endDate = '';
	}
	if (regionValue === null || regionValue === '' || regionValue === undefined) {
		regionValue = '';
	}
	if (zoneId === null || zoneId === '' || zoneId === undefined) {
		zoneId = '';
	}
	if (branchId === null || branchId === '' || branchId === undefined) {
		branchId = '';
	}

	

	var pagevalJson = "{\"tatStartDate\": \"" + startDate + "\",\n" +
		"    \"branchId\":\"" + branchId + "\",\n" +
		"    \"zoneName\":\"" + zoneId + "\",\n" +
		"    \"regionName\":\"" + regionValue + "\",\n" +
		"    \"searchValue\":\"" + searchParam + "\",\n" +
		"    \"tatEnddate\":\"" + endDate + "\"\n" + "}";
	console.log(pagevalJson)
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchTatReportCount',
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
			console.log(obj);

			$(".tatTBody").empty();
			$('#tatReportTable').dataTable().fnClearTable();
			$('#tatReportTable').DataTable().destroy();
			obj.tatReportList
				.forEach(function(item) {

					$(
						"<tr>"

						+ "<td><a style='cursor: pointer;' id='" + item.branchId + "~"+item.tatStartDate+"~"+item.tatEnddate+"' class='text-blue branchTatReport'>"
						+ item.branchId
						+ "</a></td>"

						+ "<td class='text-capitalize'>"
						+ item.branchName
						+ "</a></td>"

						+ "<td>"
						+ item.regionName
						+ "</td>"

						+ "<td>"
						+ item.zoneName
						+ "</a></td>"

						+ "<td>"
						+ item.tatStartDate
						+ "</a></td>"

						+ "<td>"
						+ item.tatEnddate
						+ "</a></td>"

						+ "<td>"
						+ item.numOfAlerts
						+ "</a></td>"

						+ "<td>"
						+ item.tatPercentage
						+ "</a></td>"

						+ "</tr>")
						.appendTo(
							".tatTBody");

				});

			$(window).scrollTop($('#tatBranchReportTable').offset().top);
			var currentdate = new Date();
			var datetime = +currentdate.getDate() + "/"
				+ (currentdate.getMonth() + 1) + "/"
				+ currentdate.getFullYear() + "_" + currentdate.getHours()
				+ ":" + currentdate.getMinutes() + ":"
				+ currentdate.getSeconds();
			$("#tatReportTable").DataTable({
				"columnDefs": [{
					orderable: false
				}],
				"order": [0, "desc"],
				"responsive": false,
				"lengthMenu": [5, 10, 20],
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,

				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": [{

					extend: 'excel',
					title: 'TatReport_' + datetime,

				}, {

					extend: 'pdfHtml5',
					title: 'TatReport_' + datetime,

				}]
			}).buttons().container().appendTo(
				'#tatReportTable_wrapper .col-md-6:eq(0)');

		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.error('Some Error Occured');
		}
	});



});

