/*FETCH BUTTON CLICK FUNCTION*/
$(document).ready(function() {

	$(".datepicker").attr("autocomplete", "off");

	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD/MM/YYYY',
		autocomplete: 'off',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD/MM/YYYY',
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



var list3 = [];
$(document).ready(
	function() {

		var ticksStyle = {
			fontColor: '#495057',
			fontStyle: 'bold'
		}
		var backgroundClr = ['#641E16', '#F4D03F', '#9B59B6', '#CB4335', '#27AE60', '#979A9A', '#D7BDE2', '#34495E', '#D35400', '#F39C12', '#DFFF00', '#00FFFF', '#00FFFF', '#FF00FF', '#FF0000', '#810541'];

		list3 = $('#trendList').val();
		list3 = list3.replace('[', '');
		list3 = list3.replace(']', '');
		var itemsArr = list3.split(",");
		checkLableArr = [];
		dataCountArr = [];
		var bgColr = [];
		for (var itr in itemsArr) {
			var iteArr = itemsArr[itr].split("~");

			checkLableArr.push(iteArr[0]);
			dataCountArr.push(iteArr[1]);
			bgColr.push(backgroundClr[itr]);
		}

		var donutData = {

			labels: checkLableArr,

			datasets: [{

				data: dataCountArr,
				backgroundColor: bgColr

			}]
		}
		var pieChartCanvas = $('#pieChartZone').get(0)
			.getContext('2d')
		var pieData = donutData;
		var pieOptions = {
			maintainAspectRatio: true,
			responsive: true,
			legend: {
				position: "right",
				text: "This is example",
				fontSize: 15,
				labels: {
					usePointStyle: true,
				}
			},
			scales: {

				xAxes: [{
					display: false,
					gridLines: {
						display: false
					},
					scaleLabel: {
						display: true,
						labelString: 'Vertical wise total Count'
					},
					ticks: ticksStyle
				}]
			}

		}
		//Create pie or douhnut chart
		// You can switch between pie and douhnut using the method below.
		new Chart(pieChartCanvas, {
			type: 'pie',
			data: pieData,
			options: pieOptions
		})
		/* var scrollPos = $("#branchWiseReportTable").offset.top;
		$(window).scrollTop(scrollPos); */
	});


$(function() {

	var currentdate = new Date();
	var datetime = +currentdate.getDate() + "/"
		+ (currentdate.getMonth() + 1) + "/"
		+ currentdate.getFullYear() + "_" + currentdate.getHours()
		+ ":" + currentdate.getMinutes() + ":"
		+ currentdate.getSeconds();
	$("#zoneWiseReportTable").DataTable({

		"responsive": false,

		"lengthMenu": [5, 10, 20],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"paging": false,
		"lengthChange": false,
		"bPaginate": false,
		"order": [],
		"aoColumnDefs": [
			{ "bSortable": false, "aTargets": [0, 1, 2, 3] }
		],
		"bLengthChange": false,
		"bFilter": true,
		"bInfo": false,
		"bAutoWidth": false,
		"language": {
			"emptyTable": "No Data Available"
		},
		"buttons": [{

			extend: 'excel',
			title: 'VerticalWiseCount_' + datetime,

		}, {

			extend: 'pdfHtml5',
			title: 'VerticalWiseCount_' + datetime,

		}]
	}).buttons().container().appendTo(
		'#zoneWiseReportTable_wrapper .col-md-6:eq(0)');
});

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

var ticksStyle = {
	fontColor: '#495057',
	fontStyle: 'bold'
}

$(document).on("click", ".regionWiseCount", function() {

	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();




		if (endDate === null || endDate === '' || endDate === undefined) {
			if (startDate === null || startDate === '' || startDate === undefined) {
				startDate = '';
				endDate = '';
			}
			startDate = '';
			endDate = '';
		}


		var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
			+ "    \"zoneId\":\"" + zoneNameList[1] + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchRegionWiseCount',
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

				$('#zoneId').text(obj.zoneId);
				$('#regionTable').css("display", "");
				$(".regionWiseCountBody").empty();
				$("#regionWiseCounttFooter").empty();
				$('#regionWiseReportTable').dataTable().fnClearTable();
				$('#regionWiseReportTable').DataTable().destroy();
				obj.regionAlertCountList.forEach(function(item) {

					$(
						"<tr>"

						+ "<td class='text-capitalize'>"
						+ item.regionName
						+ "</a></td>"

						+ "<td class='text-red text-bold'>"
						+ item.openCount
						+ "</td>"

						+ "<td class='text-green text-bold'>"
						+ item.closeCount
						+ "</td>"

						+ "<td class='text-yellow text-bold'>"
						+ item.escalateCount
						+ "</td>"

						+ "<td class='text-center text-bold text-blue branchAlertCount' id='regionName~" + item.regionName + "' name='regionName'><a style='cursor: pointer;' class='badge badge-primary'>"
						+ item.totalCount
						+ "</a></td>"

						+ "</tr>")
						.appendTo("#regionWiseCountBody");

				});

				$(
					"<tr>"

					+ "<td class='tFooter'>"
					+ "Total"
					+ "</a></td>"

					+ "<td class='tFooter'>"
					+ obj.openCount
					+ "</td>"

					+ "<td class='tFooter'>"
					+ obj.closeCount
					+ "</td>"

					+ "<td class='tFooter'>"
					+ obj.escalateCount
					+ "</td>"

					+ "<td class='text-center tFooter' >"
					+ obj.totalCount
					+ "</td>"

					+ "</tr>")
					.appendTo("#regionWiseCounttFooter");
				$("#regionWiseReportTable").DataTable({
					"columnDefs": [{
						orderable: false
					}],
					"order": [0, "asc"],
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
						title: 'Region wise Alert Count ',

					},
					{

						extend: 'pdf',
						title: 'Region wise Alert Count ',

					}

					],

				}).buttons().container().appendTo(
					'#regionWiseReportTable_wrapper .col-md-6:eq(0)');

				$(window).scrollTop($('#regionWiseReportTable').offset().top);

				$("#regionWiseReportTableRuleRisk").hide();



				var pieData = obj.regionAlertCount;

				checkLableArr = [];
				dataCountArr = [];
				var bgColr = [];
				var itemsArr
				pieData.forEach(function(items) {
					////alertitems);
					var itemsCur = items;
					/*var label = '';*/
					itemsArr = itemsCur.split("~");
					/*if (itemsArr[0].includes(' ii')) {
						label = itemsArr[0].substr(0, 1).toUpperCase() + itemsArr[0].substr(1).split(' ')[0] +' '+ itemsArr[0].substr(1).split(' ')[1].toUpperCase();
					} else {
						label = itemsArr[0].substr(0, 1).toUpperCase() + itemsArr[0].substr(1).split(' ')[0] +' '+ itemsArr[0].substr(1).split(' ')[1].substr(0, 1).toUpperCase()+itemsArr[0].substr(1).split(' ')[1].substr( 1);
					}*/
					checkLableArr.push(itemsArr[0]);
					////alert"checkLableArr "+ checkLableArr);
					dataCountArr.push(itemsArr[1]);
					bgColr.push(getRandomColor());
					////alert"dataCountArr "+ dataCountArr);
				});

				$('#regionPie').remove();
				$('#pie-app-chart').append('<canvas id="regionPie" style="min-height: 350px; height: 350px; max-height: 350px; max-width: 100%;"></canvas>');


				//$('<canvas id="regionPie" style="min-height: 350px; height: 350px; max-height: 350px; max-width: 100%;"></canvas>").appendTo();


				var donutData = {

					labels: checkLableArr,

					datasets: [
						{
							data: dataCountArr,
							backgroundColor: bgColr,
							//backgroundColor: [greenColor, amberColor, redColor],
						}
					]
				}
				var pieChartCanvas = $('#regionPie').get(0).getContext('2d')
				var pieData = donutData;
				var pieOptions = {
					maintainAspectRatio: true,
					responsive: true,
					legend: {
						position: "right",
						text: "This is example",
						fontSize: 15,
						labels: {
							usePointStyle: true,
						}
					},
					scales: {

						xAxes: [{
							display: false,
							gridLines: {
								display: false
							},
							scaleLabel: {
								display: true,
								labelString: 'Vertical wise total Count'
							},
							ticks: ticksStyle
						}]
					}

				}
				//Create pie or douhnut chart
				// You can switch between pie and douhnut using the method below.
				new Chart(pieChartCanvas, {
					type: 'pie',
					data: pieData,
					options: pieOptions
				})

				//$(window).scrollTop($("#topofthePage").offset().top);

				//$("#regionTable")
				var scrollPos = $("#regionTable").offset.top;
				$(window).scrollTop(scrollPos);


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

$(document).on("click", ".branchAlertCount", function() {

	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		if (endDate === null || endDate === '' || endDate === undefined) {
			if (startDate === null || startDate === '' || startDate === undefined) {
				startDate = '';
				endDate = '';
			}
			startDate = '';
			endDate = '';
		}

		var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
			+ "    \"regionId\":\"" + zoneNameList[1] + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchBranchWiseCount',
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


				$('#branchTable').css("display", "");
				$('#regionId').text(zoneNameList[1]);
				$(".branchWiseCountBody").empty();
				$("#branchWiseCountFooter").empty();
				$('#branchWiseReportTable').dataTable().fnClearTable();
				$('#branchWiseReportTable').DataTable().destroy();
				obj.branchAlertCountList.forEach(function(item) {

					$(
						"<tr>"

						+ "<td name='branchId'>"
						+ item.branchId + "-" + item.branchName
						+ "</td>"

						+ "<td class='text-bold text-red'>"
						+ item.openCount
						+ "</td>"

						+ "<td class='text-bold text-green'>"
						+ item.closeCount
						+ "</td>"

						+ "<td class='text-bold text-yellow'>"
						+ item.escalateCount
						+ "</td>"

						+ "<td class='text-center text-bold text-blue ruleAlertCount' id='branchId~" + item.branchId + "' name='branchId'><a href='#' class='badge badge-primary'>"
						+ item.totalCount
						+ "</a></td>"

						+ "</tr>")
						.appendTo("#branchWiseCountBody");

				});

				$(
					"<tr>"

					+ "<td class='tFooter'>"
					+ "Total"
					+ "</a></td>"

					+ "<td class='tFooter'>"
					+ obj.openCount
					+ "</td>"

					+ "<td class='tFooter'>"
					+ obj.closeCount
					+ "</td>"

					+ "<td class='tFooter'>"
					+ obj.escalateCount
					+ "</td>"

					+ "<td class='text-center tFooter' >"
					+ obj.totalCount
					+ "</td>"

					+ "</tr>")
					.appendTo("#branchWiseCountFooter");

				$("#branchWiseReportTable").DataTable({
					"columnDefs": [{
						orderable: false
					}],
					"responsive": false,
					"order": [0, "asc"],
					"autoWidth": true,
					"searching": true,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					},
					"buttons": [
						{
							extend: 'excel',
							title: 'Branchwise Alert Status Report ',
						},
						{
							extend: 'pdf',
							title: 'Branchwise Alert Status Report ',
						},
					]
				}).buttons().container().appendTo(
					'#branchWiseReportTable_wrapper .col-md-6:eq(0)');
				$(window).scrollTop($('#branchWiseReportTable').offset().top);

				var pieData = obj.newPriorityList;

				checkLableArr = [];
				dataCountArr = [];
				var bgColr = [];
				var itemsArr
				pieData.forEach(function(items) {
					////alertitems);
					var itemsCur = items;
					itemsArr = itemsCur.split("~");
					checkLableArr.push(itemsArr[0].substr(0, 1).toUpperCase() + itemsArr[0].substr(1));
					////alert"checkLableArr "+ checkLableArr);
					dataCountArr.push(itemsArr[1]);
					if (itemsArr[0] === 'HIGH') {
						bgColr.push("red");
					} else if (itemsArr[0] === 'LOW') {
						bgColr.push("green");
					} else if (itemsArr[0] === 'MEDIUM') {
						bgColr.push("yellow");
					}
				});

				$('#pieChartRisk').remove();
				$('#riskGraph').append('<canvas id="pieChartRisk" style="min-height: 200px; height: 200px; max-height: 200px; max-width: 100%;"></canvas>');


				var donutData = {

					labels: checkLableArr,

					datasets: [
						{
							data: dataCountArr,
							backgroundColor: bgColr,
							//backgroundColor: [greenColor, amberColor, redColor],
						}
					]
				}
				var pieChartCanvas = $('#pieChartRisk').get(0).getContext('2d')
				var pieData = donutData;
				var pieOptions = {
					maintainAspectRatio: true,
					responsive: true,
					legend: {
						position: "right",
						text: "This is example",
						fontSize: 15,
						labels: {
							usePointStyle: true,
						}
					},
					scales: {

						xAxes: [{
							display: false,
							gridLines: {
								display: false
							},
							scaleLabel: {
								display: true,
								labelString: 'Vertical wise total Count'
							},
							ticks: ticksStyle
						}]
					}

				}
				//Create pie or douhnut chart
				// You can switch between pie and douhnut using the method below.
				new Chart(pieChartCanvas, {
					type: 'pie',
					data: pieData,
					options: pieOptions
				})

				//classification graph

				var pieData = obj.newClassificationGraphList;

				checkLableArr = [];
				dataCountArr = [];
				var bgColr = [];
				var itemsArr
				pieData.forEach(function(items) {
					////alertitems);
					var itemsCur = items;
					itemsArr = itemsCur.split("~");
					checkLableArr.push(itemsArr[0]);
					////alert"checkLableArr "+ checkLableArr);
					dataCountArr.push(itemsArr[1]);
					bgColr.push(getRandomColor());
					////alert"dataCountArr "+ dataCountArr);
				});

				$('#pieChartClassification').remove();
				$('#classificationGraph').append('<canvas id="pieChartClassification" style="min-height: 200px; height: 200px; max-height: 200px; max-width: 100%;"></canvas>');


				var donutData = {

					labels: checkLableArr,

					datasets: [
						{
							data: dataCountArr,
							backgroundColor: bgColr,
							//backgroundColor: [greenColor, amberColor, redColor],
						}
					]
				}
				var pieChartCanvas = $('#pieChartClassification').get(0).getContext('2d')
				var pieData = donutData;
				var pieOptions = {
					maintainAspectRatio: true,
					responsive: true,
					legend: {
						position: "right",
						text: "This is example",
						fontSize: 15,
						labels: {
							usePointStyle: true,
						}
					},
					scales: {

						xAxes: [{
							display: false,
							gridLines: {
								display: false
							},
							scaleLabel: {
								display: true,
								labelString: 'Vertical wise total Count'
							},
							ticks: ticksStyle
						}]
					}

				}
				//Create pie or douhnut chart
				// You can switch between pie and douhnut using the method below.
				new Chart(pieChartCanvas, {
					type: 'pie',
					data: pieData,
					options: pieOptions
				})
			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.error('Some Error Occured');
			}
		});
	}
});

$(document).on("click", ".ruleAlertCount", function() {

	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();



		if (endDate === null || endDate === '' || endDate === undefined) {
			if (startDate === null || startDate === '' || startDate === undefined) {
				startDate = '';
				endDate = '';
			}
			startDate = '';
			endDate = '';
		}

		var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
			+ "    \"branchId\":\"" + zoneNameList[1] + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchRuleWiseCount',
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

				$('#ruleTable').css("display", "");
				$('#branchId').text(obj.branchName);
				$(".ruleWiseCountBody").empty();
				$('#ruleWiseReportTable').dataTable().fnClearTable();
				$('#ruleWiseReportTable').DataTable().destroy();
				var priority = null;
				obj.ruleAlertCountList.forEach(function(item) {

					if (item.rulePriority === 'H') {
						priority = 'High';
					} else if (item.rulePriority === 'M') {
						priority = 'Medium';
					} else if (item.rulePriority === 'L') {
						priority = 'Low';
					}

					$(
						"<tr>"

						+ "<td >"
						+ item.ruleId
						+ "</a></td>"

						+ "<td style='width: 55%;'>"
						+ item.ruleDesc
						+ "</a></td>"

						+ "<td >"
						+ priority
						+ "</a></td>"

						+ "<td >"
						+ item.ruleClassification
						+ "</a></td>"

						+ "<td class='text-red text-bold'>"
						+ item.openCount
						+ "</td>"

						+ "<td class='text-green text-bold'>"
						+ item.closeCount
						+ "</td>"

						+ "<td class='text-yellow text-bold'>"
						+ item.escalateCount
						+ "</td>"

						+ "<td class='text-center text-bold text-blue accountAlertCount' id='ruleId~" + item.ruleId + "~" + item.branchId + "' name='ruleId'><a href='#' class='badge badge-primary'>"
						+ item.totalCount
						+ "</a></td>"

						+ "</tr>")
						.appendTo("#ruleWiseCountBody");

				});

				$(window).scrollTop($('#ruleTable').offset().top);
				$("#ruleWiseReportTable").DataTable({
					"columnDefs": [{
						orderable: false
					}],
					"order": [0, "asc"],
					"responsive": false,
					"autoWidth": true,
					"searching": false,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					},
					"buttons": [
						{
							extend: 'excel',
							title: 'Branchwise Alert Status Report ',
						},
						{
							extend: 'pdf',
							title: 'Branchwise Alert Status Report ',
						},
					]
				}).buttons().container().appendTo(
					'#ruleWiseReportTable_wrapper .col-md-6:eq(0)');

			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.error('Some Error Occured');
			}
		});
	}
});

$(document).on("click", ".accountAlertCount", function() {

	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();



		if (endDate === null || endDate === '' || endDate === undefined) {
			if (startDate === null || startDate === '' || startDate === undefined) {
				startDate = '';
				endDate = '';
			}
			startDate = '';
			endDate = '';
		}

		var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
			+ "    \"ruleId\":\"" + zoneNameList[1] + "\",\n" +
			"    \"branchId\":\"" + zoneNameList[2] + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";
		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchAccountWiseCount',
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

				$('#accountTable').css("display", "");
				$('#ruleId').text(zoneNameList[1]);
				$(".accountWiseCountBody").empty();
				$('#accountWiseReportTable').dataTable().fnClearTable();
				$('#accountWiseReportTable').DataTable().destroy();
				obj.accountAlertCountList.forEach(function(item) {

					$(
						"<tr>"

						+ "<td><a style='cursor: pointer;' id='" + item.alertId + "' class='text-blue viewAlertModal'>"
						+ item.alertId
						+ "</a></td>"

						+ "<td>"
						+ item.custAcid
						+ "</td>"

						+ "<td>"
						+ item.custId
						+ "</td>"

						+ "<td class='text-capitalize'>"
						+ item.custName
						+ "</td>"

						+ "<td class='text-capitalize'>"
						+ item.alertStatus
						+ "</td>"

						+ "<td>"
						+ item.alertCat
						+ "</td>"

						+ "<td>"
						+ item.generatedTime
						+ "</td>"

						+ "<td>"
						+ item.recurrenceCnt
						+ "</td>"

						+ "</tr>")
						.appendTo("#accountWiseCountBody");

				});
				$(window).scrollTop($('#accountWiseReportTable').offset().top);
				$("#accountWiseReportTable").DataTable({
					"columnDefs": [{
						orderable: false
					}],
					"order": [0, "asc"],
					"responsive": false,
					"autoWidth": true,
					"searching": true,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					},
					"buttons": [
						{
							extend: 'excel',
							title: 'Branchwise Alert Status Report ',
						},
						{
							extend: 'pdf',
							title: 'Branchwise Alert Status Report ',
						},
					]
				}).buttons().container().appendTo(
					'#accountWiseReportTable_wrapper .col-md-6:eq(0)');

			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.error('Some Error Occured');
			}
		});
	}
});

/*VIEW ALERT DETAIL MODAL*/
$(document).on("click", ".viewAlertModal", function() {

	var alertId = $(this).attr('id');
	var pageValJson = "{\"alertId\":" + "\"" + alertId
		+ "\"}";
	document.getElementById('load').style.visibility = "visible";

	$.ajax({
		url: 'viewAlertById',
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
		success: function(response) {
			setTimeout(function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);

			////alert"Object "+ obj.alertId);

			$('#alertIdM').val(obj.alertId);
			$('#alertStatus').val(obj.alertStatus);
			$('#custAcid').val(obj.custAcid);
			$('#ruleIdM').val(obj.ruleId);
			$('#alertCatM').val(obj.alertCat);
			$('#ruleRiskM').val(obj.ruleRisk);
			$('#custId').val(obj.custId);
			$('#actUserId').val(obj.actUserId);
			$('#lastUserId').val(obj.lastUserId);
			$('#branchIdM').val(obj.branchId);
			$('#region').val(obj.region);
			$('#region').val(obj.region);
			$('#ruleDescM').val(obj.ruleDesc);
			$('#zone').val(obj.zone);
			$('#generatedTime').val(obj.generatedTime);
			$('#custVertical').val(obj.custVertical);
			$('#actRoleId').val(obj.actRoleId);
			$('#ruleClassification').val(obj.ruleClassification);
			$('#viewAlertmodal').modal('show');
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

/*VIEW ALERT DETAIL MODAL*/

var branchMonitoring = '';



$(document).on("click", "#verticalBtnBranch", function() {

	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	branchMonitoring = "branchMonitoring";

	if (endDate === null || endDate === '' || endDate === undefined) {
		if (startDate === null || startDate === '' || startDate === undefined) {
			startDate = '';
			endDate = '';
		}
		startDate = '';
		endDate = '';
	}

	var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
		+ "    \"auditSearchParam\":\"" + branchMonitoring + "\",\n"
		+ "    \"endDate\":\"" + endDate + "\"\n" + "}";

	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchZoneWiseCount',
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
			$(".zoneWiseCountBody").empty();
			$("#zoneWiseCountFooter").empty();
			$('#zoneWiseReportTable').dataTable().fnClearTable();
			$('#zoneWiseReportTable').DataTable().destroy();
			$("#trendList").val(" ");
			
			obj.zoneAlertCountList.forEach(function(item) {

				$(
					"<tr>"

					+ "<td class='text-capitalize'>"
					+ item.zoneName
					+ "</a></td>"

					+ "<td>"
					+ item.openCount
					+ "</td>"

					+ "<td>"
					+ item.closeCount
					+ "</td>"

					+ "<td>"
					+ item.escalateCount
					+ "</td>"

					+ "<td class='text-center text-bold text-blue regionWiseCount' id='zoneName~" + item.zoneName + "'><a href='#' class='badge badge-primary'>"
					+ item.totalCount
					+ "</a></td>"

					+ "</tr>")
					.appendTo("#zoneWiseCountBody");

			});
		

			$(
				"<tr>"

				+ "<td class='tFooter'>"
				+ "Total"
				+ "</a></td>"

				+ "<td class='tFooter'>"
				+ obj.openCount
				+ "</td>"

				+ "<td class='tFooter'>"
				+ obj.closeCount
				+ "</td>"

				+ "<td class='tFooter'>"
				+ obj.escalateCount
				+ "</td>"

				+ "<td class='text-center tFooter' >"
				+ obj.totalCount
				+ "</td>"

				+ "</tr>")
				.appendTo("#zoneWiseCountFooter");

			var currentdate = new Date();
			var datetime = +currentdate.getDate() + "/"
				+ (currentdate.getMonth() + 1) + "/"
				+ currentdate.getFullYear() + "_" + currentdate.getHours()
				+ ":" + currentdate.getMinutes() + ":"
				+ currentdate.getSeconds();
			$("#zoneWiseReportTable").DataTable({

				"responsive": false,
				"order": [],
				"lengthMenu": [5, 10, 20],
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"paging": false,
				"lengthChange": false,
				"bPaginate": false,
				"bLengthChange": false,
				"aoColumnDefs": [
					{ "bSortable": false, "aTargets": [0, 1, 2, 3] }
				],
				"bFilter": true,
				"bInfo": false,
				"bAutoWidth": false,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": [{

					extend: 'excel',
					title: 'VerticalWiseCount_' + datetime,

				}, {

					extend: 'pdfHtml5',
					title: 'VerticalWiseCount_' + datetime,

				}]
			}).buttons().container().appendTo(
				'#zoneWiseReportTable_wrapper .col-md-6:eq(0)');


			var pieData = obj.zonePieGraphList;
			checkLableArr = [];
			dataCountArr = [];
			var bgColr = [];
			var itemsArr
			pieData.forEach(function(items) {
				////alertitems);
				var itemsCur = items;
				itemsArr = itemsCur.split("~");
				checkLableArr.push(itemsArr[0]);
				////alert"checkLableArr "+ checkLableArr);
				dataCountArr.push(itemsArr[1]);
				bgColr.push(getRandomColor());
				////alert"dataCountArr "+ dataCountArr);
			});

			$('#pieChartZone').remove();
			$('#zone-pie-chart').append('<canvas id="pieChartZone" style="min-height: 350px; height: 350px; max-height: 350px; max-width: 100%;"></canvas>');

			var donutData = {

				labels: checkLableArr,

				datasets: [
					{
						data: dataCountArr,
						backgroundColor: bgColr,
						//backgroundColor: [greenColor, amberColor, redColor],
					}
				]
			}
			var pieChartCanvas = $('#pieChartZone').get(0).getContext('2d')
			var pieData = donutData;
			var pieOptions = {
				maintainAspectRatio: true,
				responsive: true,
				legend: {
					position: "right",
					text: "This is example",
					fontSize: 15,
					labels: {
						usePointStyle: true,
					}
				},
				scales: {

					xAxes: [{
						display: false,
						gridLines: {
							display: false
						},
						scaleLabel: {
							display: true,
							labelString: 'Vertical wise total Count'
						},
						ticks: ticksStyle
					}]
				}

			}
			//Create pie or douhnut chart
			// You can switch between pie and douhnut using the method below.
			new Chart(pieChartCanvas, {
				type: 'pie',
				data: pieData,
				options: pieOptions
			})

			//$(window).scrollTop($("#topofthePage").offset().top);

			//$("#regionTable")
			var scrollPos = $("#zoneWiseReportTable").offset.top;
			$(window).scrollTop(scrollPos);
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

$(document).on("click", "#verticalBtnRom", function() {

	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	branchMonitoring = "RomMonitoring";

	if (endDate === null || endDate === '' || endDate === undefined) {
		if (startDate === null || startDate === '' || startDate === undefined) {
			startDate = '';
			endDate = '';
		}
		startDate = '';
		endDate = '';
	}

	var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
		+ "    \"auditSearchParam\":\"" + branchMonitoring + "\",\n"
		+ "    \"endDate\":\"" + endDate + "\"\n" + "}";

	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchZoneWiseCount',
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
			$(".zoneWiseCountBody").empty();
			$("#zoneWiseCountFooter").empty();
			$('#zoneWiseReportTable').dataTable().fnClearTable();
			$('#zoneWiseReportTable').DataTable().destroy();
			$("#trendList").val(" ");
			
			obj.zoneAlertCountList.forEach(function(item) {

				$(
					"<tr>"

					+ "<td class='text-capitalize'>"
					+ item.zoneName
					+ "</a></td>"

					+ "<td>"
					+ item.openCount
					+ "</td>"

					+ "<td>"
					+ item.closeCount
					+ "</td>"

					+ "<td>"
					+ item.escalateCount
					+ "</td>"

					+ "<td class='text-center text-bold text-blue regionWiseCount' id='zoneName~" + item.zoneName + "'><a href='#' class='badge badge-primary'>"
					+ item.totalCount
					+ "</a></td>"

					+ "</tr>")
					.appendTo("#zoneWiseCountBody");

			});

			$(
				"<tr>"

				+ "<td class='tFooter'>"
				+ "Total"
				+ "</a></td>"

				+ "<td class='tFooter'>"
				+ obj.openCount
				+ "</td>"

				+ "<td class='tFooter'>"
				+ obj.closeCount
				+ "</td>"

				+ "<td class='tFooter'>"
				+ obj.escalateCount
				+ "</td>"

				+ "<td class='text-center tFooter' >"
				+ obj.totalCount
				+ "</td>"

				+ "</tr>")
				.appendTo("#zoneWiseCountFooter");
			var currentdate = new Date();
			var datetime = +currentdate.getDate() + "/"
				+ (currentdate.getMonth() + 1) + "/"
				+ currentdate.getFullYear() + "_" + currentdate.getHours()
				+ ":" + currentdate.getMinutes() + ":"
				+ currentdate.getSeconds();
			$("#zoneWiseReportTable").DataTable({

				"responsive": false,
				"lengthMenu": [5, 10, 20],
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"paging": false,
				"lengthChange": false,
				"bPaginate": false,
				"bLengthChange": false,
				"order": [],
				"aoColumnDefs": [
					{ "bSortable": false, "aTargets": [0, 1, 2, 3] }
				],
				"bFilter": true,
				"bInfo": false,
				"bAutoWidth": false,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": [{

					extend: 'excel',
					title: 'VerticalWiseCount_' + datetime,

				}, {

					extend: 'pdfHtml5',
					title: 'VerticalWiseCount_' + datetime,

				}]
			}).buttons().container().appendTo(
				'#zoneWiseReportTable_wrapper .col-md-6:eq(0)');


			var pieData = obj.zonePieGraphList;
			checkLableArr = [];
			dataCountArr = [];
			var bgColr = [];
			var itemsArr
			pieData.forEach(function(items) {
				////alertitems);
				var itemsCur = items;
				itemsArr = itemsCur.split("~");
				checkLableArr.push(itemsArr[0]);
				////alert"checkLableArr "+ checkLableArr);
				dataCountArr.push(itemsArr[1]);
				bgColr.push(getRandomColor());
				////alert"dataCountArr "+ dataCountArr);
			});

			$('#pieChartZone').remove();
			$('#zone-pie-chart').append('<canvas id="pieChartZone" style="min-height: 350px; height: 350px; max-height: 350px; max-width: 100%;"></canvas>');

			var donutData = {

				labels: checkLableArr,

				datasets: [
					{
						data: dataCountArr,
						backgroundColor: bgColr,
						//backgroundColor: [greenColor, amberColor, redColor],
					}
				]
			}
			var pieChartCanvas = $('#pieChartZone').get(0).getContext('2d')
			var pieData = donutData;
			var pieOptions = {
				maintainAspectRatio: true,
				responsive: true,
				legend: {
					position: "right",
					text: "This is example",
					fontSize: 15,
					labels: {
						usePointStyle: true,
					}
				},
				scales: {

					xAxes: [{
						display: false,
						gridLines: {
							display: false
						},
						scaleLabel: {
							display: true,
							labelString: 'Vertical wise total Count'
						},
						ticks: ticksStyle
					}]
				}

			}
			//Create pie or douhnut chart
			// You can switch between pie and douhnut using the method below.
			new Chart(pieChartCanvas, {
				type: 'pie',
				data: pieData,
				options: pieOptions
			})

			//$(window).scrollTop($("#topofthePage").offset().top);

			//$("#regionTable")
			var scrollPos = $("#zoneWiseReportTable").offset.top;
			$(window).scrollTop(scrollPos);
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


$(document).on("click", "#verticalBtnVigilance", function() {

	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	branchMonitoring = "VgdMonitoring";

	if (endDate === null || endDate === '' || endDate === undefined) {
		if (startDate === null || startDate === '' || startDate === undefined) {
			startDate = '';
			endDate = '';
		}
		startDate = '';
		endDate = '';
	}

	var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
		+ "    \"auditSearchParam\":\"" + branchMonitoring + "\",\n"
		+ "    \"endDate\":\"" + endDate + "\"\n" + "}";

	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchZoneWiseCount',
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
			$(".zoneWiseCountBody").empty();
			$("#zoneWiseCountFooter").empty();
			$('#zoneWiseReportTable').dataTable().fnClearTable();
			$('#zoneWiseReportTable').DataTable().destroy();
			$("#trendList").val(" ");
			
			obj.zoneAlertCountList.forEach(function(item) {

				$(
					"<tr>"

					+ "<td class='text-capitalize'>"
					+ item.zoneName
					+ "</a></td>"

					+ "<td>"
					+ item.openCount
					+ "</td>"

					+ "<td>"
					+ item.closeCount
					+ "</td>"

					+ "<td>"
					+ item.escalateCount
					+ "</td>"

					+ "<td class='text-center text-bold text-blue regionWiseCount' id='zoneName~" + item.zoneName + "'><a href='#' class='badge badge-primary'>"
					+ item.totalCount
					+ "</a></td>"

					+ "</tr>")
					.appendTo("#zoneWiseCountBody");

			});

			$(
				"<tr>"

				+ "<td class='tFooter'>"
				+ "Total"
				+ "</a></td>"

				+ "<td class='tFooter'>"
				+ obj.openCount
				+ "</td>"

				+ "<td class='tFooter'>"
				+ obj.closeCount
				+ "</td>"

				+ "<td class='tFooter'>"
				+ obj.escalateCount
				+ "</td>"

				+ "<td class='text-center tFooter' >"
				+ obj.totalCount
				+ "</td>"

				+ "</tr>")
				.appendTo("#zoneWiseCountFooter");
			var currentdate = new Date();
			var datetime = +currentdate.getDate() + "/"
				+ (currentdate.getMonth() + 1) + "/"
				+ currentdate.getFullYear() + "_" + currentdate.getHours()
				+ ":" + currentdate.getMinutes() + ":"
				+ currentdate.getSeconds();
			$("#zoneWiseReportTable").DataTable({
				"order": [],

				"responsive": false,
				"lengthMenu": [5, 10, 20],
				"autoWidth": true,
				"paging": false,
				"lengthChange": false,
				"bPaginate": false,
				"bLengthChange": false,
				"aoColumnDefs": [
					{ "bSortable": false, "aTargets": [0, 1, 2, 3] }
				],
				"bFilter": true,
				"bInfo": false,
				"bAutoWidth": false,
				"searching": false,
				"fixedHeader": true,

				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": [{

					extend: 'excel',
					title: 'VerticalWiseCount_' + datetime,

				}, {

					extend: 'pdfHtml5',
					title: 'VerticalWiseCount_' + datetime,

				}]
			}).buttons().container().appendTo(
				'#zoneWiseReportTable_wrapper .col-md-6:eq(0)');


			var pieData = obj.zonePieGraphList;
			checkLableArr = [];
			dataCountArr = [];
			var bgColr = [];
			var itemsArr
			pieData.forEach(function(items) {
				////alertitems);
				var itemsCur = items;
				itemsArr = itemsCur.split("~");
				checkLableArr.push(itemsArr[0]);
				////alert"checkLableArr "+ checkLableArr);
				dataCountArr.push(itemsArr[1]);
				bgColr.push(getRandomColor());
				////alert"dataCountArr "+ dataCountArr);
			});

			$('#pieChartZone').remove();
			$('#zone-pie-chart').append('<canvas id="pieChartZone" style="min-height: 350px; height: 350px; max-height: 350px; max-width: 100%;"></canvas>');

			var donutData = {

				labels: checkLableArr,

				datasets: [
					{
						data: dataCountArr,
						backgroundColor: bgColr,
						//backgroundColor: [greenColor, amberColor, redColor],
					}
				]
			}
			var pieChartCanvas = $('#pieChartZone').get(0).getContext('2d')
			var pieData = donutData;
			var pieOptions = {
				maintainAspectRatio: true,
				responsive: true,
				legend: {
					position: "right",
					text: "This is example",
					fontSize: 15,
					labels: {
						usePointStyle: true,
					}
				},
				scales: {

					xAxes: [{
						display: false,
						gridLines: {
							display: false
						},
						scaleLabel: {
							display: true,
							labelString: 'Vertical wise total Count'
						},
						ticks: ticksStyle
					}]
				}

			}
			//Create pie or douhnut chart
			// You can switch between pie and douhnut using the method below.
			new Chart(pieChartCanvas, {
				type: 'pie',
				data: pieData,
				options: pieOptions
			})

			//$(window).scrollTop($("#topofthePage").offset().top);

			//$("#regionTable")
			var scrollPos = $("#zoneWiseReportTable").offset.top;
			$(window).scrollTop(scrollPos);
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

/*$(document).ready(function() {
	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: false,
		maxDate: new Date(),
		format: 'DD/MM/yyyy',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: false,
		maxDate: new Date(),
		format: 'DD/MM/yyyy',
		onChangeDateTime: function(dp, $input) {
		}
	});
});*/

$(document).on("click", "#fetchDataBtn", function() {

	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();

	if (endDate === null || endDate === '' || endDate === undefined) {
		if (startDate === null || startDate === '' || startDate === undefined) {
			startDate = '';
			endDate = '';
		}
		startDate = '';
		endDate = '';
	}

	var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
		+ "    \"auditSearchParam\":\"" + branchMonitoring + "\",\n"
		+ "    \"endDate\":\"" + endDate + "\"\n" + "}";


	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchZoneWiseCount',
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
			$(".zoneWiseCountBody").empty();
			$("#zoneWiseCountFooter").empty();
			$('#zoneWiseReportTable').dataTable().fnClearTable();
			$('#zoneWiseReportTable').DataTable().destroy();
			$("#trendList").val(" ");
			
			obj.zoneAlertCountList.forEach(function(item) {

				$(
					"<tr>"

					+ "<td class='text-capitalize'>"
					+ item.zoneName
					+ "</a></td>"

					+ "<td>"
					+ item.openCount
					+ "</td>"

					+ "<td>"
					+ item.closeCount
					+ "</td>"

					+ "<td>"
					+ item.escalateCount
					+ "</td>"

					+ "<td class='text-center text-bold text-blue regionWiseCount' id='zoneName~" + item.zoneName + "'><a href='#'>"
					+ item.totalCount
					+ "</a></td>"

					+ "</tr>")
					.appendTo("#zoneWiseCountBody");

			});
			
			$(
				"<tr>"

				+ "<td class='tFooter'>"
				+ "Total"
				+ "</a></td>"

				+ "<td class='tFooter'>"
				+ obj.openCount
				+ "</td>"

				+ "<td class='tFooter'>"
				+ obj.closeCount
				+ "</td>"

				+ "<td class='tFooter'>"
				+ obj.escalateCount
				+ "</td>"

				+ "<td class='text-center tFooter' >"
				+ obj.totalCount
				+ "</td>"

				+ "</tr>")
				.appendTo("#zoneWiseCountFooter");s
			
			var currentdate = new Date();
			var datetime = +currentdate.getDate() + "/"
				+ (currentdate.getMonth() + 1) + "/"
				+ currentdate.getFullYear() + "_" + currentdate.getHours()
				+ ":" + currentdate.getMinutes() + ":"
				+ currentdate.getSeconds();
			$("#zoneWiseReportTable").DataTable({
				"order": [],

				"responsive": false,
				"lengthMenu": [5, 10, 20],
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"paging": false,
				"lengthChange": false,
				"bPaginate": false,
				"bLengthChange": false,
				"bFilter": true,
				"bInfo": false,
				"bAutoWidth": false,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": [{

					extend: 'excel',
					title: 'VerticalWiseCount_' + datetime,

				}, {

					extend: 'pdfHtml5',
					title: 'VerticalWiseCount_' + datetime,

				}]
			}).buttons().container().appendTo(
				'#zoneWiseReportTable_wrapper .col-md-6:eq(0)');


			var pieData = obj.zonePieGraphList;
			checkLableArr = [];
			dataCountArr = [];
			var bgColr = [];
			var itemsArr
			pieData.forEach(function(items) {
				////alertitems);
				var itemsCur = items;
				itemsArr = itemsCur.split("~");
				checkLableArr.push(itemsArr[0]);
				////alert"checkLableArr "+ checkLableArr);
				dataCountArr.push(itemsArr[1]);
				bgColr.push(getRandomColor());
				////alert"dataCountArr "+ dataCountArr);
			});

			$('#pieChartZone').remove();
			$('#zone-pie-chart').append('<canvas id="pieChartZone" style="min-height: 350px; height: 350px; max-height: 350px; max-width: 100%;"></canvas>');

			var donutData = {

				labels: checkLableArr,

				datasets: [
					{
						data: dataCountArr,
						backgroundColor: bgColr,
						//backgroundColor: [greenColor, amberColor, redColor],
					}
				]
			}
			var pieChartCanvas = $('#pieChartZone').get(0).getContext('2d')
			var pieData = donutData;
			var pieOptions = {
				maintainAspectRatio: true,
				responsive: true,
				legend: {
					position: "right",
					text: "This is example",
					fontSize: 15,
					labels: {
						usePointStyle: true,
					}
				},
				scales: {

					xAxes: [{
						display: false,
						gridLines: {
							display: false
						},
						scaleLabel: {
							display: true,
							labelString: 'Vertical wise total Count'
						},
						ticks: ticksStyle
					}]
				}

			}
			//Create pie or douhnut chart
			// You can switch between pie and douhnut using the method below.
			new Chart(pieChartCanvas, {
				type: 'pie',
				data: pieData,
				options: pieOptions
			})

			//$(window).scrollTop($("#topofthePage").offset().top);

			//$("#regionTable")
			var scrollPos = $("#zoneWiseReportTable").offset.top;
			$(window).scrollTop(scrollPos);
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
