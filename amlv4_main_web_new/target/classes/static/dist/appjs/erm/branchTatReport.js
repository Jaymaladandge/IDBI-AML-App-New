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
		format: 'DD-MM-YY',
		autocomplete: 'off',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YY',
		autocomplete: 'off',
		onChangeDateTime: function(dp, $input) {
		}
	});

	$('.datepicker').on('click', function(e) {
		e.preventDefault();
		$(this).attr("autocomplete", "off");
	});



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

	var zoneValue = $('#zoneValue').val();

	var pageValJson = "{\"regionId\":" + "\"" + regionValue + "\",\n"
		+ "    \"zone\":\"" + zoneValue + "\"\n" + "}";

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
					text: items.branchId + "-" + items.branchName
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
	var validFlg = true;
	var verticalDropdown = "";
	var yearDropdown = "";
	var monthDropdown = "";

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
	if ($('#verticalDropdown').val() !== null && $('#verticalDropdown').val() !== undefined &&
		$('#verticalDropdown').val() !== '') {
		verticalDropdown = $('#verticalDropdown').val();
	} else {
		validFlg = false;
		toastr
			.success('Select Verticals');
	}

	if ($('#yearDropdown').val() !== null && $('#yearDropdown').val() !== undefined &&
		$('#yearDropdown').val() !== '') {
		yearDropdown = $('#yearDropdown').val();
	} else {
		validFlg = false;
		toastr
			.success('Select Year');
	}

	if ($('#monthDropdown').val() !== null && $('#monthDropdown').val() !== undefined &&
		$('#monthDropdown').val() !== '') {
		monthDropdown = $('#monthDropdown').val();
	} else {
		validFlg = false;
		toastr
			.success('Select Month');
	}

	if (monthDropdown === 'Jan' || monthDropdown === 'Feb' || monthDropdown === 'Mar' && yearDropdown === '2023') {
		validFlg = false;
		toastr
			.success('TAT Report for selected Month has been already added');
	}

	var searchParam = $('#searchParam').val();

	if (validFlg) {


		var pagevalJson = "{\"branchId\":" + "\"" + branchId + "\",\n"
			+ "    \"region\": \"" + regionId + "\",\n"
			+ "    \"zone\": \"" + zoneId + "\",\n"
			+ "    \"searchParam\": \"" + searchParam + "\",\n"
			+ "    \"custVertical\": \"" + verticalDropdown + "\",\n"
			+ "    \"month\": \"" + monthDropdown + "\",\n"
			+ "    \"year\":\"" + yearDropdown + "\"\n" + "}";


		console.log(pagevalJson)
		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchBranchTatReport',
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

				$('#reportTable').css('display', '');

				$(".tatReportTable > #tbodyR").empty();
				$('#tatReportTable').dataTable().fnClearTable();
				$('#tatReportTable').DataTable().destroy();
				if (obj.alertList.length > 0) {
					obj.alertList
						.forEach(function(item) {

							$(
								"<tr>"

								+ "<td>"
								+ item.branchId
								+ "</td>"

								+ "<td>"
								+ item.branchName
								+ "</td>"

								+ "<td>"
								+ item.region
								+ "</td>"

								+ "<td>"
								+ item.zone
								+ "</td>"

								+ "<td>"
								+ item.inMonthCount
								+ "</td>"

								+ "<td>"
								+ item.beforeMonthCount
								+ "</td>"

								+ "<td>"
								+ item.totalCount
								+ "</td>"

								+ "<td>"
								+ item.inTat
								+ "</td>"

								+ "<td>"
								+ item.inTatPer
								+ "%</td>"

								+ "</tr>")
								.appendTo(
									"#tbodyR");

						});
				} else {

					toastr
						.success('TAT Not Yet Updated for selected Month');

				}

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

				});


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

$(document).on(
	"click",
	"#exportExcel",
	function() {

		var yearDropdown = "";
		var monthDropdown = "";

		if ($('#yearDropdown').val() !== null && $('#yearDropdown').val() !== undefined &&
			$('#yearDropdown').val() !== '') {
			yearDropdown = $('#yearDropdown').val();
		} else {
			validFlg = false;
			toastr
				.success('Select Verticals');
		}

		if ($('#monthDropdown').val() !== null && $('#monthDropdown').val() !== undefined &&
			$('#monthDropdown').val() !== '') {
			monthDropdown = $('#monthDropdown').val();
		} else {
			validFlg = false;
			toastr
				.success('Select Verticals');
		}

		$('#tatReportTable').DataTable().destroy();

		var filedetails1 = "[\n";

		if ($('#tatReportTable tr').length > 0) {
			$('#tatReportTable > tbody  > tr').each(
				function(index, value) {

					filedetails1 = filedetails1
						+ "  {    \"branchId\": \""
						+ $(this).find('td:eq(0)')
							.text().trim()
						+ "\",\n"
						+ "    \"branchName\": \""
						+ $(this).find('td:eq(1)')
							.text().trim()
						+ "\",\n"
						+ "    \"region\": \""
						+ $(this).find('td:eq(2)')
							.text().trim()
						+ "\",\n"
						+ "    \"zone\": \""
						+ $(this).find('td:eq(3)')
							.text().trim()
						+ "\",\n"
						+ "    \"inMonthCount\": \""
						+ $(this).find('td:eq(4)')
							.text().trim()
						+ "\",\n"
						+ "    \"beforeMonthCount\": \""
						+ $(this).find('td:eq(5)')
							.text().trim()
						+ "\",\n"
						+ "    \"totalCount\": \""
						+ $(this).find('td:eq(6)')
							.text().trim()
						+ "\",\n"
						+ "    \"inTat\": \""
						+ $(this).find('td:eq(7)')
							.text().trim()
						+ "\",\n"
						+ "    \"inTatPer\": \""
						+ $(this).find('td:eq(8)')
							.text().trim() + "\"\n"
						+ " },";
				});
		}

		filedetails1 = filedetails1.substring(0,
			filedetails1.length - 1);
		filedetails1 = filedetails1 + "]";

		var pageValJson = "{\n" + "    \"alertRuleList\": "
			+ filedetails1 + ",\n" + "    \"startDate\": \""
			+ monthDropdown + "\",\n" + "    \"endDate\": \""
			+ yearDropdown + "\"\n" + "}";

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

		});

		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJsonExport").val(ciphertext + ':~:' + passphrase);
		$("#raReportForm").submit();
	})


