$(document).ready(function() {

	$("#regnDrpDown").hide();
	$("#zoneDrpDown").hide();
	$(".navTempRegion").hide();
	$(".navTempZone").hide();
	$(".navTempBranch").hide();
	$("#branchWiseReportTableRuleRisk").hide();

	$("#branchWiseReportTable").DataTable({
		"columnDefs": [{
			orderable: false
		}],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"buttons": [{

			extend: 'excel',
			title: 'Branch wise Alert Count ',

		}],
		"language": {
			"emptyTable": "No Data Available"
		},
	}).buttons().container().appendTo(
		'#zoneWiseReportTable_wrapper .col-md-6:eq(0)');



	$("#zoneWiseReportTable").DataTable({
		"columnDefs": [{
			orderable: false
		}],
		"responsive": false,
		"autoWidth": true,
		"searching": true,
		"fixedHeader": true,
		"bPaginate": false,
		"buttons": [{

			extend: 'excel',
			title: 'Zone Wise Alert Count ',

		}],
		"language": {
			"emptyTable": "No Data Available"
		},
	}).buttons().container().appendTo(
		'#zoneWiseReportTable_wrapper .col-md-6:eq(0)');






})
var backgroundClr = ['#00FFFF', '#FF0000', '#0000FF', '#C0C0C0', '#eb4034', '#1f70a6', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
var list = [];
//var list2 = [];
$(document).ready(function() {

	list = $('#regionList').val();
	console.log("list " + list);
	list = list.replace('[', '');
	list = list.replace(']', '');
	var itemsArr = list.split(",");
	checkLableArr = [];
	dataCountArr = [];
	var bgColr = [];
	/*itemsArr.forEach(function(items) {
		checkLableArr.push(itemsArr[0]);
			dataCountArr.push(itemsArr[1]);
		}*/
	for (var itr in itemsArr) {

		var iteArr = itemsArr[itr].split("~");
		checkLableArr.push(iteArr[0]);
		dataCountArr.push(iteArr[1]);
		bgColr.push(getRandomColor());
	}

	/*console.log("list " + list)
	
	
	var itemsArr;

	var list2 = [];
	for (var a in list) {

	}

	//finalList.forEach(function(items) {
	list.forEach(function(items) {
		//alert"till here correct");
		var itemsCur = items;
		var itemsArr = itemsCur.split("~");
		checkLableArr.push(itemsArr[0]);
		dataCountArr.push(itemsArr[1]);
		bgColr.push(getRandomColor());
		////alert"dataCountArr "+ dataCountArr);
	});*/


	console.log('checkLableArr ', checkLableArr);
	console.log('dataCountArr ', dataCountArr);
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
	var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
	var pieData = donutData;
	var pieOptions = {
		maintainAspectRatio: false,
		responsive: true,
	}
	//Create pie or douhnut chart
	// You can switch between pie and douhnut using the method below.
	new Chart(pieChartCanvas, {
		type: 'pie',
		data: pieData,
		options: pieOptions
	})
	var scrollPos = $("#regionTablePie").offset.top;
	$(window).scrollTop(scrollPos);
});

$("#fetchDataBtnRule").click(function() {



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
		+ "    \"branchId\":\"" + $("#branchId2").text() + "\",\n" +
		"    \"endDate\":\"" + endDate + "\"\n" + "}";

	//alert"pagevalJson " + pagevalJson);
	console.log(pagevalJson)
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
			console.log(obj);

			$('#branchId').text($("#branchId2").text());
			$(".ruleWiseCountBody").empty();
			$('#ruleWiseReportTable').dataTable().fnClearTable();
			$('#ruleWiseReportTable').DataTable().destroy();
			obj.ruleAlertCountList.forEach(function(item) {

				$(
					"<tr>"

					+ "<td>"
					+ item.ruleId
					+ "</a></td>"

					+ "<td>"
					+ item.ruleDesc
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

					+ "<td class='text-center text-bold text-blue accountAlertCount' id='ruleId~" + item.ruleId + "~" + $("#branchId2").text() + "' name='ruleId'><a style='cursor: pointer;'>"
					+ item.totalCount
					+ "</a></td>"

					+ "</tr>")
					.appendTo("#ruleWiseCountBody");

			});
			$("#ruleWiseReportTable").DataTable({
				"columnDefs": [{
					orderable: false
				}],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"buttons": [{

					extend: 'excel',
					title: 'Rule wise Alert Count ',

				}],

				"language": {
					"emptyTable": "No Data Available"
				},
			}).buttons().container().appendTo(
				'#ruleWiseReportTable_wrapper .col-md-6:eq(0)');

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

$("#fetchDataBtnBranch").click(function() {

	$("#regnDrpDown").show();



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
		+ "    \"regionId\":\"" + $("#regionId2").text() + "\",\n" +
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
			$(".branchWiseCountBody").empty();
			$('#branchWiseReportTable').dataTable().fnClearTable();
			$('#branchWiseReportTable').DataTable().destroy();
			obj.branchAlertCountList.forEach(function(item) {

				$(
					"<tr>"

					+ "<td>"
					+ item.branchId
					+ "</a></td>"

					+ "<td>"
					+ item.branchName
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

					+ "<td class='text-center text-bold text-blue ruleAlertCount' id='branchId~" + item.branchId + "' name='branchId'><a style='cursor: pointer;'>"
					+ item.totalCount
					+ "</a></td>"

					+ "</tr>")
					.appendTo("#branchWiseCountBody");

			});
			$("#branchWiseReportTable").DataTable({
				"columnDefs": [{
					orderable: false
				}],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"buttons": [{

					extend: 'excel',
					title: 'Branch Wise Alert Count ',

				}],

				"language": {
					"emptyTable": "No Data Available"
				},
			}).buttons().container().appendTo(
				'#branchWiseReportTable_wrapper .col-md-6:eq(0)');

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

$("#fetchDataBtnReg").click(function() {

	$("#zoneDrpDown").show();

	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var zomflag = $('#zomBranchFlg').val();


	if (endDate === null || endDate === '' || endDate === undefined) {
		if (startDate === null || startDate === '' || startDate === undefined) {
			startDate = '';
			endDate = '';
		}
		startDate = '';
		endDate = '';
	}

	var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
		+ "    \"zoneId\":\"" + $("#zoneId2").text() + "\",\n" +
		"    \"zomDashboardParam\":\"" + zomflag + "\",\n" +
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
					$('#regionWiseCountBody').focus();
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
			$('#regionWiseReportTable').dataTable().fnClearTable();
			$('#regionWiseReportTable').DataTable().destroy();
			obj.regionAlertCountList.forEach(function(item) {

				$(
					"<tr>"

					+ "<td class='text-capitalize'>"
					+ item.regionName
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

					+ "<td class='text-center text-bold text-blue branchAlertCount' id='regionName~" + item.regionName + "' name='regionName'><a style='cursor: pointer;'>"
					+ item.totalCount
					+ "</a></td>"

					+ "</tr>")
					.appendTo("#regionWiseCountBody");

			});

			$("#rulePriorityZonal").hide();
			$("#defaultZonal").show();
			$("#regionWiseReportTable").show();

			$("#regionWiseReportTable").DataTable({
				"columnDefs": [{
					orderable: false
				}],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"bPaginate": false,
				"buttons": [{

					extend: 'excel',
					title: 'Region wise Alert Count ',

				},
				{

					extend: 'pdf',
					title: 'Region wise Alert Count ',

				}
				],

				"language": {
					"emptyTable": "No Data Available"
				},
			}).buttons().container().appendTo(
				'#regionWiseReportTable_wrapper .col-md-6:eq(0)');



			var pieData = obj.regionAlertCount;

			$('#pieData').remove();
			$('#zonal-pie-app-chart').empty();
			$('#zonal-pie-app-chart').append('<canvas id="pieChart" style="min-height: 250px; height: 300px; max-height: 300px; max-width: 100%;"></canvas>');


			checkLableArr = [];
			dataCountArr = [];
			var bgColr = [];
			var itemsArr
			pieData.forEach(function(items) {
				var itemsCur = items;
				itemsArr = itemsCur.split("~");
				checkLableArr.push(itemsArr[0]);
				////alert"checkLableArr "+ checkLableArr);
				dataCountArr.push(itemsArr[1]);
				bgColr.push(getRandomColor());
				////alert"dataCountArr "+ dataCountArr);
			});



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
			var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
			var pieData = donutData;
			var pieOptions = {
				maintainAspectRatio: false,
				responsive: true,
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
				.success('Some Error Occured');
		}
	});
});

$("#fetchDataBtn").click(function() {

	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();

	var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
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
			$("#zoneWiseReportTable").DataTable({
				"columnDefs": [{
					orderable: false
				}],
				"responsive": false,
				"autoWidth": true,
				"searching": true,
				"fixedHeader": true,
				"bPaginate": false,
				"buttons": ['pdf', 'print'],
				"language": {
					"emptyTable": "No Data Available"
				},
			}).buttons().container().appendTo(
				'#zoneWiseReportTable_wrapper .col-md-6:eq(0)');
			//var list = [];
			var zoneList = [];

			var qList = [];
			var data = [];
			var $visitorsChart = $('#visitors-chart')
			var ticksStyle = {
				fontColor: '#495057',
				fontStyle: 'bold'
			}
			// eslint-disable-next-line no-unused-vars
			var open = [];
			var close = [];
			var escalate = [];
			var mode = 'index'
			var intersect = true

			var list = obj.zoneAlertCount;
			var temp = obj.zoneAlertCount;

			if (temp != '') {
				//list = list.replace(/[\[\]']/g, '');
				//list = list.replace(/]/g, '');
				//qList = list.split(",");


				$.each(list, function(index, value) {
					data = value.split('~');
					zoneList.push(data[0]);
					open.push(data[1]);
					close.push(data[2]);
					escalate.push(data[3]);
				})
				var visitorsChart = new Chart($visitorsChart, {
					data: {
						labels: zoneList,
						datasets: [{
							type: 'line',
							label: 'open',
							data: open,
							backgroundColor: 'transparent',
							borderColor: '#28A745',
							pointBorderColor: '#28A745',
							pointBackgroundColor: '#28A745',
							fill: false
							// pointHoverBackgroundColor: '#007bff',
							// pointHoverBorderColor : '#007bff'
						}, {
							type: 'line',
							label: 'close',
							data: close,
							backgroundColor: 'tansparent',
							borderColor: '#FFBF00',
							pointBorderColor: '#FFBF00',
							pointBackgroundColor: '#FFBF00',
							fill: false
							// pointHoverBackgroundColor: '#ced4da',
							// pointHoverBorderColor : '#ced4da'
						}, {
							type: 'line',
							label: 'escalate',
							data: escalate,
							backgroundColor: 'tansparent',
							borderColor: '#FF0000',
							pointBorderColor: '#FF0000',
							pointBackgroundColor: '#FF0000',
							fill: false
							// pointHoverBackgroundColor: '#ced4da',
							// pointHoverBorderColor : '#ced4da'
						}]
					},
					options: {
						maintainAspectRatio: false,
						tooltips: {
							mode: mode,
							intersect: intersect
						},
						hover: {
							mode: mode,
							intersect: intersect
						},
						legend: {
							display: true
						},
						scales: {
							yAxes: [{
								// display: false,
								scaleMinSpace: 100,
								gridLines: {
									display: true,
									lineWidth: '4px',
									color: 'rgba(0, 0, 0, .2)',
									zeroLineColor: 'transparent'
								},
								scaleLabel: {
									display: true,
									labelString: 'Alerts Count'
								},
								ticks: $.extend({
									beginAtZero: true,

								}, ticksStyle)
							}],
							xAxes: [{
								display: true,
								gridLines: {
									display: true
								},
								scaleLabel: {
									display: true,
									labelString: 'Zones'
								},
								ticks: ticksStyle
							}]
						}
					}
				})

			}

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


/*FETCH BUTTON CLICK FUNCTION*/
var list = [];
var zoneList = [];
var qList = [];
var data = [];
var $visitorsChart = $('#visitors-chart')
var ticksStyle = {
	fontColor: '#495057',
	fontStyle: 'bold'
}
// eslint-disable-next-line no-unused-vars
var open = [];
var close = [];
var escalate = [];
var mode = 'index'
var intersect = true
$(document).ready(function() {


	if ($('#endDate').val() === null || $('#endDate').val() === '' || $('#endDate').val() === undefined) {
		if ($('#startDate').val() === null || $('#startDate').val() === '' || $('#startDate').val() === undefined) {

			list = $('#trendList').val();

			var temp = $('#trendList').val();
			if (temp != '') {
				/*$('#onLoadGraph').show();
				$('#onAjaxGraph').hide();*/
				list = list.replace('[', '');
				list = list.replace(']', '');
				qList = list.split(',');
				console.log(qList);
				$.each(qList, function(index, value) {
					data = value.split('~');
					zoneList.push(data[0]);
					open.push(data[1]);
					close.push(data[2]);
					escalate.push(data[3]);
				})
				var visitorsChart = new Chart($visitorsChart, {
					data: {
						labels: zoneList,
						datasets: [{
							type: 'line',
							label: 'open',
							data: open,
							backgroundColor: 'transparent',
							borderColor: '#28A745',
							pointBorderColor: '#28A745',
							pointBackgroundColor: '#28A745',
							fill: false
							// pointHoverBackgroundColor: '#007bff',
							// pointHoverBorderColor : '#007bff'
						}, {
							type: 'line',
							label: 'close',
							data: close,
							backgroundColor: 'tansparent',
							borderColor: '#FFBF00',
							pointBorderColor: '#FFBF00',
							pointBackgroundColor: '#FFBF00',
							fill: false
							// pointHoverBackgroundColor: '#ced4da',
							// pointHoverBorderColor : '#ced4da'
						}, {
							type: 'line',
							label: 'escalate',
							data: escalate,
							backgroundColor: 'tansparent',
							borderColor: '#FF0000',
							pointBorderColor: '#FF0000',
							pointBackgroundColor: '#FF0000',
							fill: false
							// pointHoverBackgroundColor: '#ced4da',
							// pointHoverBorderColor : '#ced4da'
						}]
					},
					options: {
						maintainAspectRatio: false,
						tooltips: {
							mode: mode,
							intersect: intersect
						},
						hover: {
							mode: mode,
							intersect: intersect
						},
						legend: {
							display: true
						},
						scales: {
							yAxes: [{
								// display: false,
								scaleMinSpace: 100,
								gridLines: {
									display: true,
									lineWidth: '4px',
									color: 'rgba(0, 0, 0, .2)',
									zeroLineColor: 'transparent'
								},
								scaleLabel: {
									display: true,
									labelString: 'Alerts Count'
								},
								ticks: $.extend({
									beginAtZero: true,

								}, ticksStyle)
							}],
							xAxes: [{
								display: true,
								gridLines: {
									display: true
								},
								scaleLabel: {
									display: true,
									labelString: 'Zones'
								},
								ticks: ticksStyle
							}]
						}
					}
				})

			}
		}
	}
});

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
				console.log(obj);

				$('#zoneId').text(obj.zoneId);
				$('#regionTable').css("display", "");
				$(".regionWiseCountBody").empty();
				$('#regionWiseReportTable').dataTable().fnClearTable();
				$('#regionWiseReportTable').DataTable().destroy();
				obj.regionAlertCountList.forEach(function(item) {

					$(
						"<tr>"

						+ "<td class='text-capitalize'>"
						+ item.regionName
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

						+ "<td class='text-center text-bold text-blue branchAlertCount' id='regionName~" + item.regionName + "' name='regionName'><a style='cursor: pointer;'>"
						+ item.totalCount
						+ "</a></td>"

						+ "</tr>")
						.appendTo("#regionWiseCountBody");

				});
				$("#regionWiseReportTable").DataTable({
					"columnDefs": [{
						orderable: false
					}],
					"responsive": false,
					"autoWidth": true,
					"searching": false,
					"fixedHeader": true,
					"bPaginate": false,
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

				$("#regionWiseReportTableRuleRisk").hide();

				var pieData = obj.regionAlertCount;

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
					maintainAspectRatio: false,
					responsive: true,
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
				var scrollTop = $(window).scrollTop(scrollPos);
				var scrollBottom = $(window).scrollTop(scrollPos) + $(window).height();


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
		var ruleRisk = null;
		var status = null;
		var searchParam = null;

		if (zoneNameList[2] === null || zoneNameList[2] === '' || zoneNameList[2] === undefined) {

		} else {
			ruleRisk = zoneNameList[2];
			status = zoneNameList[3];
			if (zoneNameList[4] == "ruleRisk") {
				searchParam = "ruleRisk";
				if (ruleRisk == 'H') {
					$("#branchWiseReportTableRuleRiskHeading").text("High");
				} else if (ruleRisk == 'M') {
					$("#branchWiseReportTableRuleRiskHeading").text("Medium");
				} else if (ruleRisk == 'L') {
					$("#branchWiseReportTableRuleRiskHeading").text("Low");
				}


			} else if (zoneNameList[4] == "riskClassification") {
				searchParam = "riskClassification";
				if (ruleRisk == 'Operational Deficiency') {
					$("#branchWiseReportTableRuleRiskHeading").text("Operational Deficiency");
				} else if (ruleRisk == 'Irregular Transactions') {
					$("#branchWiseReportTableRuleRiskHeading").text("Irregular Transactions");
				} else if (ruleRisk == 'Financial Exposure') {
					$("#branchWiseReportTableRuleRiskHeading").text("Financial Exposure");
				} else if (ruleRisk == 'Income Leakage') {
					$("#branchWiseReportTableRuleRiskHeading").text("Income Leakage");
				} else if (ruleRisk == 'Regulatory Non-Compliance') {
					$("#branchWiseReportTableRuleRiskHeading").text("Regulatory Non-Compliance");
				}
			}

			if (status == 'O') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Open Alert Count");
			} else if (status == 'C') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Closed Alert Count");
			} else if (status == 'U') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Escalated Alert Count");
			}
		}


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
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
			"    \"status\": \"" + status + "\",\n" +

			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		$("#task-tab").hide();
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
						$('#branchTable').focus();
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);


				$("#regionId").text(zoneNameList[1]);

				$('#branchTable').css("display", "");

				if (searchParam !== null && searchParam == 'ruleRisk') {
					$(".branchWiseCountBody").empty();
					$('#branchWiseReportTable').dataTable().fnClearTable();
					$('#branchWiseReportTable').DataTable().destroy();
					$('#branchWiseReportTable').hide();

					$(".branchWiseCountBodyRuleRisk").empty();
					$('#branchWiseReportTableRuleRisk').dataTable().fnClearTable();
					$('#branchWiseReportTableRuleRisk').DataTable().destroy();

					obj.branchAlertCountList.forEach(function(item) {
						$(
							"<tr>"

							+ "<td>"
							+ item.branchId
							+ "</a></td>"


							+ "<td>"
							+ item.branchName
							+ "</a></td>"

							/*+ "<td>"
							+ item.statusWiseCount
							+ "</td>"*/

							+ "<td style='cursor: pointer;' class='text-center text-bold text-blue ruleAlertCount' id='branchId~" + item.branchId + "~" + zoneNameList[2] + "~" + zoneNameList[3] + "' name='branchId'><a>"
							+ item.statusWiseCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#branchWiseCountBodyRuleRisk");

					});

					$("#branchWiseReportTableRuleRisk").DataTable({
						"columnDefs": [{
							//orderable: false
						}],
						"order": [[2, 'desc']],
						"responsive": false,
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"buttons": [{

							extend: 'excel',
							title: 'Rule Priority wise Branch Alert Count ',

						},
						{

							extend: 'pdf',
							title: 'Rule Priority wise Branch Alert Count ',

						}],

						"language": {
							"emptyTable": "No Data Available"
						},
					}).buttons().container().appendTo(
						'#branchWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');


				} else {

					$('#regionId').text(zoneNameList[1]);
					$(".branchWiseCountBody").empty();
					$('#branchWiseReportTable').dataTable().fnClearTable();
					$('#branchWiseReportTable').DataTable().destroy();
					obj.branchAlertCountList.forEach(function(item) {

						$(
							"<tr>"

							+ "<td>"
							+ item.branchId
							+ "</a></td>"

							+ "<td>"
							+ item.branchName
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

							+ "<td class='text-center text-bold text-blue ruleAlertCount' id='branchId~" + item.branchId + "' name='branchId'><a style='cursor: pointer;'>"
							+ item.totalCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#branchWiseCountBody");

					});
					$("#branchWiseReportTable").DataTable({
						"columnDefs": [{
							orderable: false
						}],
						"responsive": false,
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"buttons": [{

							extend: 'excel',
							title: 'Branch wise Alert Count ',

						},
						{

							extend: 'pdf',
							title: 'Branch wise Alert Count ',

						}

						],
						"language": {
							"emptyTable": "No Data Available"
						},
					}).buttons().container().appendTo(
						'#branchWiseReportTable_wrapper .col-md-6:eq(0)');

					$("#branchWiseReportTableRuleRisk").hide();
				}



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


$(document).on("click", ".branchAlertCountClassificationWise", function() {
	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		var ruleRisk = null;
		var status = null;
		var searchParam = null;

		if (zoneNameList[2] === null || zoneNameList[2] === '' || zoneNameList[2] === undefined) {

		} else {
			ruleRisk = zoneNameList[2];
			status = zoneNameList[3];
			if (zoneNameList[4] == "ruleRisk") {
				searchParam = "ruleRisk";
				if (ruleRisk == 'H') {
					$("#branchWiseReportTableRuleRiskHeading").text("High");
				} else if (ruleRisk == 'M') {
					$("#branchWiseReportTableRuleRiskHeading").text("Medium");
				} else if (ruleRisk == 'L') {
					$("#branchWiseReportTableRuleRiskHeading").text("Low");
				}


			} else if (zoneNameList[4] == "riskClassification") {
				searchParam = "riskClassification";
				if (ruleRisk == 'Operational Deficiency') {
					$("#branchWiseReportTableRuleRiskHeading").text("Operational Deficiency");
				} else if (ruleRisk == 'Irregular Transactions') {
					$("#branchWiseReportTableRuleRiskHeading").text("Irregular Transactions");
				} else if (ruleRisk == 'Financial Exposure') {
					$("#branchWiseReportTableRuleRiskHeading").text("Financial Exposure");
				} else if (ruleRisk == 'Income Leakage') {
					$("#branchWiseReportTableRuleRiskHeading").text("Income Leakage");
				} else if (ruleRisk == 'Regulatory Non-Compliance') {
					$("#branchWiseReportTableRuleRiskHeading").text("Regulatory Non-Compliance");
				}
			}

			if (status == 'O') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Open Alert Count");
			} else if (status == 'C') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Closed Alert Count");
			} else if (status == 'U') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Escalated Alert Count");
			}
		}


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
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
			"    \"status\": \"" + status + "\",\n" +

			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		////alert"pagevalJson " + pagevalJson);

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
						$('#branchTable').focus();
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);


				$("#regionId").text(zoneNameList[1]);

				$('#branchTable').css("display", "");

				if (searchParam !== null && searchParam == 'ruleRisk') {
					$(".branchWiseCountBody").empty();
					$('#branchWiseReportTable').dataTable().fnClearTable();
					$('#branchWiseReportTable').DataTable().destroy();
					$('#branchWiseReportTable').hide();

					$(".branchWiseCountBodyRuleRisk").empty();
					$('#branchWiseReportTableRuleRisk').dataTable().fnClearTable();
					$('#branchWiseReportTableRuleRisk').DataTable().destroy();

					obj.branchAlertCountList.forEach(function(item) {
						$(
							"<tr>"

							+ "<td>"
							+ item.branchId
							+ "</a></td>"

							/*+ "<td>"
							+ item.statusWiseCount
							+ "</td>"*/

							+ "<td style='cursor: pointer;' class='text-center text-bold text-blue ruleAlertCountClassificationWise' id='branchId~" + item.branchId + "~" + zoneNameList[2] + "~" + zoneNameList[3] + "~" + searchParam + "' name='branchId'><a>"
							+ item.statusWiseCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#branchWiseCountBodyRuleRisk");

					});

					$("#branchWiseReportTableRuleRisk").DataTable({
						"columnDefs": [{
							orderable: false
						}],
						"responsive": false,
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"buttons": [{

							extend: 'excel',
							title: 'Branch wise Alert Count ',

						}],
						"language": {
							"emptyTable": "No Data Available"
						},
					}).buttons().container().appendTo(
						'#branchWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');


				} else if (searchParam !== null && searchParam == 'riskClassification') {
					$(".branchWiseCountBody").empty();
					$('#branchWiseReportTable').dataTable().fnClearTable();
					$('#branchWiseReportTable').DataTable().destroy();
					$('#branchWiseReportTable').hide();

					$(".branchWiseCountBodyRuleRisk").empty();
					$('#branchWiseReportTableRuleRisk').dataTable().fnClearTable();
					$('#branchWiseReportTableRuleRisk').DataTable().destroy();

					obj.branchAlertCountList.forEach(function(item) {
						$(
							"<tr>"

							+ "<td>"
							+ item.branchId
							+ "</a></td>"

							+ "<td>"
							+ item.branchName
							+ "</a></td>"


							+ "<td style='cursor: pointer;' class='text-center text-bold text-blue ruleAlertCountClassificationWise' id='branchId~" + item.branchId + "~" + zoneNameList[2] + "~" + zoneNameList[3] + "~" + searchParam + "' name='branchId'><a>"
							+ item.statusWiseCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#branchWiseCountBodyRuleRisk");

					});

					$("#branchWiseReportTableRuleRisk").DataTable({
						"columnDefs": [{
							//orderable: false
						}],
						"responsive": false,
						"order": [[2, 'desc']],
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"language": {
							"emptyTable": "No Data Available"
						},
						"buttons": [{

							extend: 'excel',
							title: 'Branch wise Rule Risk Alert Count ',

						}],
					}).buttons().container().appendTo(
						'#branchWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');


				} else {

					$('#regionId').text(zoneNameList[1]);
					$(".branchWiseCountBody").empty();
					$('#branchWiseReportTable').dataTable().fnClearTable();
					$('#branchWiseReportTable').DataTable().destroy();
					obj.branchAlertCountList.forEach(function(item) {

						$(
							"<tr>"

							+ "<td>"
							+ item.branchId
							+ "</a></td>"

							+ "<td>"
							+ item.branchName
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

							+ "<td class='text-center text-bold text-blue ruleAlertCount' id='branchId-" + item.branchId + "' name='branchId'><a href='#'>"
							+ item.totalCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#branchWiseCountBody");

					});
					$("#branchWiseReportTable").DataTable({
						"columnDefs": [{
							orderable: false
						}],
						"responsive": false,
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"buttons": [{

							extend: 'excel',
							title: 'Branch wise Alert Count ',

						}],
						"language": {
							"emptyTable": "No Data Available"
						},
					}).buttons().container().appendTo(
						'#branchWiseReportTable_wrapper .col-md-6:eq(0)');
				}



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


$(document).on("click", ".branchAlertCountClassificationWise2", function() {
	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		var ruleRisk = null;
		var status = null;
		var searchParam = null;
		var rulePriority = null;

		$('#branchRuleClassificationTableforZonal').hide();
		$('#ruleTable').hide();
		$('#accountTable').hide();




		if (zoneNameList[2] === null || zoneNameList[2] === '' || zoneNameList[2] === undefined) {

		} else {
			ruleRisk = zoneNameList[2];
			status = zoneNameList[3];
			if (zoneNameList[7] == "ruleRisk") {
				searchParam = "ruleRisk";
				if (ruleRisk == 'H') {
					$("#branchWiseReportTableRuleRiskHeading").text("High");
				} else if (ruleRisk == 'M') {
					$("#branchWiseReportTableRuleRiskHeading").text("Medium");
				} else if (ruleRisk == 'L') {
					$("#branchWiseReportTableRuleRiskHeading").text("Low");
				}


			} else if (zoneNameList[7] == "riskClassification") {
				searchParam = "riskClassification";
				rulePriority = ruleRisk;
				if (ruleRisk == 'Operational Deficiency') {
					$("#branchWiseReportTableRuleRiskHeading").text("Operational Deficiency");
				} else if (ruleRisk == 'Irregular Transactions') {
					$("#branchWiseReportTableRuleRiskHeading").text("Irregular Transactions");
				} else if (ruleRisk == 'Financial Exposure') {
					$("#branchWiseReportTableRuleRiskHeading").text("Financial Exposure");
				} else if (ruleRisk == 'Income Leakage') {
					$("#branchWiseReportTableRuleRiskHeading").text("Income Leakage");
				} else if (ruleRisk == 'Regulatory Non-Compliance') {
					$("#branchWiseReportTableRuleRiskHeading").text("Regulatory Non-Compliance");
				}
			}

			if (status == 'O') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Open Alert Count");
			} else if (status == 'C') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Closed Alert Count");
			} else if (status == 'U') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Escalated Alert Count");
			}
		}


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
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
			"    \"status\": \"" + status + "\",\n" +

			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		//alert"pagevalJson " + pagevalJson);

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
						$('#branchTable').focus();
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);


				$(".regionIdForZonal").text(zoneNameList[1]);

				$('#branchTable').hide();

				$('#branchWiseReportTable').hide();
				$('#branchWiseReportTableRuleRisk').hide();

				//branchWiseReportTableRuleClassificationForZonalOfc
				/*$("#branchWiseCountBodyRuleRiskForZonalOfc").empty();
				$('#branchWiseReportTableRuleClassificationForZonalOfc').dataTable().fnClearTable();
				$('#branchWiseReportTableRuleClassificationForZonalOfc').DataTable().destroy();
				$("#branchRuleClassificationTableforZonal").show();
				$("#defaultZonal").hide();
				$("#branchTable").hide();
				$("#branchRuleRiskTableforZonal").hide();
				$("#branchWiseReportTableRuleClassificationForZonalOfc").show();
				$("#branchRuleClassificationTableforZonal").show();*/

				$("#branchRuleClassificationTableforZonal").show();
				$("#branchWiseCountBodyRuleClassificationForZonalOfc").empty();
				$('#branchWiseReportTableRuleClassificationForZonalOfc').dataTable().fnClearTable();
				$('#branchWiseReportTableRuleClassificationForZonalOfc').DataTable().destroy();
				$("#branchWiseReportTableRuleClassificationForZonalOfc").show();




				obj.branchAlertCountList.forEach(function(item) {
					$(


						"<tr>"
						+ "<td>"
						+ item.branchId
						+ "</a></td>"

						+ "<td>"
						+ item.branchName
						+ "</a></td>"
						+ "<td style='cursor: pointer;' class='text-center text-bold text-blue ruleAlertCountClassificationWise' id='branchId~" + item.branchId + "~" + zoneNameList[2] + "~" + zoneNameList[3] + "~" + searchParam + "' name='branchId'><a>"
						+ item.statusWiseCount
						+ "</a></td>"

						+ "</tr>")
						.appendTo("#branchWiseCountBodyRuleClassificationForZonalOfc");

				});



				$("#branchWiseReportTableRuleClassificationForZonalOfc").DataTable({
					"columnDefs": [{
						//orderable: false
					}],
					"responsive": false,
					"order": [[2, 'desc']],
					"autoWidth": true,
					"searching": false,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					},
					"buttons": [{

						extend: 'excel',
						title: 'Branch wise Rule Risk Alert Count ',

					},
					{

						extend: 'pdf',
						title: 'Branch wise Rule Risk Alert Count ',

					}],
				}).buttons().container().appendTo(
					'#branchWiseReportTableRuleClassificationForZonalOfc_wrapper .col-md-6:eq(0)');

				if (status == 'O') {
					$("#branchWiseReportTableRuleClassificationAlertHeadingForZonalOfc").text("Open Alert Count for Rule Classifcation - " + rulePriority);
				} else if (status == 'C') {
					$("#branchWiseReportTableRuleClassificationAlertHeadingForZonalOfc").text("Closed Alert Count for Rule Classifcation - " + rulePriority);
				} else if (status == 'U') {
					$("#branchWiseReportTableRuleClassificationAlertHeadingForZonalOfc").text("Escalte Alert Count for Rule Classifcation - " + rulePriority);
				}


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



$(document).on("click", ".ruleAlertCount", function() {
	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();

		var ruleRisk = null;
		var status = null;
		var searchParam = null;

		if (zoneNameList[2] === null || zoneNameList[2] === '' || zoneNameList[2] === undefined) {

		} else {
			ruleRisk = zoneNameList[2];
			status = zoneNameList[3];
			searchParam = "ruleRisk";

			if (ruleRisk == 'H') {
				$("#ruleWiseReportTableRuleRiskheading").text("High");
			} else if (ruleRisk == 'M') {
				$("#ruleWiseReportTableRuleRiskheading").text("Medium");
			} else if (ruleRisk == 'L') {
				$("#ruleWiseReportTableRuleRiskheading").text("Low");
			}

			if (status == 'O') {
				$("#ruleWiseReportTableRuleRiskAlertHeading").text("Open Alert Count");
			} else if (status == 'C') {
				$("#ruleWiseReportTableRuleRiskAlertHeading").text("Closed Alert Count");
			} else if (status == 'U') {
				$("#ruleWiseReportTableRuleRiskAlertHeading").text("Escalated Alert Count");
			}
		}


		if (endDate === null || endDate === '' || endDate === undefined) {
			if (startDate === null || startDate === '' || startDate === undefined) {
				startDate = '';
				ndDate = '';
			}
			startDate = '';
			endDate = '';
		}

		var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
			+ "    \"branchId\":\"" + zoneNameList[1] + "\",\n" +

			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
			"    \"status\": \"" + status + "\",\n" +

			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		//alert"pagevalJson " + pagevalJson);

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

						$('#branchId').focus()
						document
							.getElementById('interactive');
						document
							.getElementById('load').style.visibility = "hidden";
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);


				$('#ruleTable').css("display", "");
				if (searchParam != '' && searchParam == 'ruleRisk') {
					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBody").empty();
					$('#ruleWiseReportTable').dataTable().fnClearTable();
					$('#ruleWiseReportTable').DataTable().destroy();
					$('#ruleWiseReportTable').hide();

					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBodyRuleRisk").empty();
					$('#ruleWiseReportTableRuleRisk').dataTable().fnClearTable();
					$('#ruleWiseReportTableRuleRisk').DataTable().destroy();



					obj.ruleAlertCountList.forEach(function(item) {

						$(
							"<tr>"

							+ "<td>"
							+ item.ruleId
							+ "</a></td>"

							+ "<td>"
							+ item.ruleDesc
							+ "</a></td>"

							+ "<td style='cursor: pointer;' class='text-center text-bold text-blue accountAlertCount' id='ruleId~" + item.ruleId + "~" + item.branchId + "~" + ruleRisk + "~" + status + "~" + searchParam + "' name='ruleId'><a style='cursor: pointer;'>"
							+ item.statusWiseCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#ruleWiseCountBodyRuleRisk");

					});
					$("#ruleWiseReportTableRuleRisk").DataTable({
						"columnDefs": [{
							//orderable: false
						}],
						"order": [[1, 'desc']],
						"responsive": false,
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"buttons": [{

							extend: 'excel',
							title: 'Rule Priority wise Alert Count ',

						},
						{

							extend: 'pdf',
							title: 'Rule Priority wise Alert Count ',

						}

						],
						"language": {
							"emptyTable": "No Data Available"
						},
					}).buttons().container().appendTo(
						'#ruleWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

				} else {
					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBody").empty();
					$('#ruleWiseReportTable').dataTable().fnClearTable();
					$('#ruleWiseReportTable').DataTable().destroy();
					obj.ruleAlertCountList.forEach(function(item) {

						$(
							"<tr>"

							+ "<td>"
							+ item.ruleId
							+ "</a></td>"

							+ "<td>"
							+ item.ruleDesc
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

							+ "<td  class='text-center text-bold text-blue accountAlertCount' id='ruleId~" + item.ruleId + "~" + item.branchId + "' name='ruleId'><a style='cursor: pointer;'>"
							+ item.totalCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#ruleWiseCountBody");

					});
					$("#ruleWiseReportTable").DataTable({
						"columnDefs": [{
							orderable: false
						}],
						"responsive": false,
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"buttons": [{

							extend: 'excel',
							title: 'Rule wise Alert Count ',

						},
						{

							extend: 'pdf',
							title: 'Rule wise Alert Count ',
						}

						],
						"language": {
							"emptyTable": "No Data Available"
						},
					}).buttons().container().appendTo(
						'#ruleWiseReportTable_wrapper .col-md-6:eq(0)');

					$("#ruleWiseReportTableRuleRisk").hide();
				}




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

$(document).on("click", ".ruleAlertCountClassificationWise", function() {

	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {

		$('#ruleTable').hide();
		$('#accountTable').hide();



		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();

		var ruleRisk = null;
		var status = null;
		var searchParam = null;
		var additionalText = null;

		if (zoneNameList[2] === null || zoneNameList[2] === '' || zoneNameList[2] === undefined) {

		} else {

			ruleRisk = zoneNameList[2];
			status = zoneNameList[3];
			searchParam = "ruleRisk";


			if (zoneNameList[4] == "ruleRisk") {
				searchParam = "ruleRisk";
				if (ruleRisk == 'H') {
					additionalText = "High Rule Priority";
					$("#branchWiseReportTableRuleRiskHeading").text("High");
				} else if (ruleRisk == 'M') {
					additionalText = "Medium  Rule Priority";
					$("#branchWiseReportTableRuleRiskHeading").text("Medium");
				} else if (ruleRisk == 'L') {
					additionalText = "Low Rule Priority";
					$("#branchWiseReportTableRuleRiskHeading").text("Low");
				}


			} else if (zoneNameList[4] == "riskClassification") {
				searchParam = "riskClassification";
				additionalText = "Rule Classification - " + ruleRisk;
				if (ruleRisk == 'Operational Deficiency') {

					$("#branchWiseReportTableRuleRiskHeading").text("Operational Deficiency");
				} else if (ruleRisk == 'Irregular Transactions') {
					$("#branchWiseReportTableRuleRiskHeading").text("Irregular Transactions");
				} else if (ruleRisk == 'Financial Exposure') {
					$("#branchWiseReportTableRuleRiskHeading").text("Financial Exposure");
				} else if (ruleRisk == 'Income Leakage') {
					$("#branchWiseReportTableRuleRiskHeading").text("Income Leakage");
				} else if (ruleRisk == 'Regulatory Non-Compliance') {
					$("#branchWiseReportTableRuleRiskHeading").text("Regulatory Non-Compliance");
				}
			}

			if (status == 'O') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text(additionalText);
			} else if (status == 'C') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text(additionalText);
			} else if (status == 'U') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text(additionalText);
			}

		}


		if (endDate === null || endDate === '' || endDate === undefined) {
			if (startDate === null || startDate === '' || startDate === undefined) {
				startDate = '';
				ndDate = '';
			}
			startDate = '';
			endDate = '';
		}

		var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
			+ "    \"branchId\":\"" + zoneNameList[1] + "\",\n" +

			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
			"    \"status\": \"" + status + "\",\n" +

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
				if (searchParam != '' && searchParam == 'ruleRisk') {
					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBody").empty();
					$('#ruleWiseReportTable').dataTable().fnClearTable();
					$('#ruleWiseReportTable').DataTable().destroy();
					$('#ruleWiseReportTable').hide();

					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBodyRuleRisk").empty();
					$('#ruleWiseReportTableRuleRisk').dataTable().fnClearTable();
					$('#ruleWiseReportTableRuleRisk').DataTable().destroy();



					obj.ruleAlertCountList.forEach(function(item) {

						$(
							"<tr>"

							+ "<td>"
							+ item.ruleId
							+ "</a></td>"

							+ "<td>"
							+ item.ruleDesc
							+ "</a></td>"

							+ "<td style='cursor: pointer;' class='text-center text-bold text-blue accountAlertCount' id='ruleId~" + item.ruleId + "~" + item.branchId + "~" + ruleRisk + "~" + status + "~" + searchParam + "' name='ruleId'><a style='cursor: pointer;'>"
							+ item.statusWiseCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#ruleWiseCountBodyRuleRisk");

					});
					$("#ruleWiseReportTableRuleRisk").DataTable({
						"columnDefs": [{
							//orderable: false
						}],
						"order": [[2, 'desc']],
						"responsive": false,
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"language": {
							"emptyTable": "No Data Available"
						},
						"buttons": [{

							extend: 'excel',
							title: 'Rule wise Alert Count ',

						},
						{

							extend: 'pdf',
							title: 'Rule wise Alert Count ',

						}],
					}).buttons().container().appendTo(
						'#ruleWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

					if (status == 'O') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					} else if (status == 'C') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					} else if (status == 'U') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					}

					$('#ruleWiseReportTableRuleRisk').show();
					$('#ruleTable').show();


					//#ruleWiseCountBodyRuleRisk
					$("#header").attr('tabindex', -1).focus();
					var itemID = $(this);
					itemID.focus();

				} else if (searchParam != '' && searchParam == 'riskClassification') {
					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBody").empty();
					$('#ruleWiseReportTable').dataTable().fnClearTable();
					$('#ruleWiseReportTable').DataTable().destroy();
					$('#ruleWiseReportTable').hide();

					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBodyRuleRisk").empty();
					$('#ruleWiseReportTableRuleRisk').dataTable().fnClearTable();
					$('#ruleWiseReportTableRuleRisk').DataTable().destroy();



					obj.ruleAlertCountList.forEach(function(item) {

						$(
							"<tr>"

							+ "<td>"
							+ item.ruleId
							+ "</a></td>"

							+ "<td>"
							+ item.ruleDesc
							+ "</a></td>"

							+ "<td  class='text-center text-bold text-blue accountAlertCountClassification' id='ruleId~" + item.ruleId + "~" + item.branchId + "~" + ruleRisk + "~" + status + "~" + searchParam + "' name='ruleId'><a style='cursor: pointer;'>"
							+ item.statusWiseCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#ruleWiseCountBodyRuleRisk");

					});
					$("#ruleWiseReportTableRuleRisk").DataTable({
						"columnDefs": [{
							//orderable: false
						}],
						"order": [[2, 'desc']],
						"responsive": false,
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"buttons": [{

							extend: 'excel',
							title: 'Rule wise Alert Count ',

						},
						{

							extend: 'pdf',
							title: 'Rule wise Alert Count ',

						}],
						"language": {
							"emptyTable": "No Data Available"
						},
					}).buttons().container().appendTo(
						'#ruleWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

					if (status == 'O') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					} else if (status == 'C') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					} else if (status == 'U') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					}

					$('#ruleTable').show();

				}




				else {
					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBody").empty();
					$('#ruleWiseReportTable').dataTable().fnClearTable();
					$('#ruleWiseReportTable').DataTable().destroy();
					obj.ruleAlertCountList.forEach(function(item) {

						$(
							"<tr>"

							+ "<td>"
							+ item.ruleId
							+ "</a></td>"

							+ "<td>"
							+ item.ruleDesc
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

							+ "<td class='text-center text-bold text-blue accountAlertCount' id='ruleId~" + item.ruleId + "~" + item.branchId + "' name='ruleId'><a href='#'>"
							+ item.totalCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#ruleWiseCountBody");

					});
					$("#ruleWiseReportTable").DataTable({
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
					}).buttons().container().appendTo(
						'#ruleWiseReportTable_wrapper .col-md-6:eq(0)');

					$('#ruleTable').show();
				}




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


$(document).on("click", ".ruleAlertCountClassificationWise2", function() {
	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		$('#ruleTable').hide();

		$('#accountTable').hide();


		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		var additionalText = null;

		var ruleRisk = null;
		var status = null;
		var searchParam = null;


		if (zoneNameList[2] === null || zoneNameList[2] === '' || zoneNameList[2] === undefined) {

		} else {

			ruleRisk = zoneNameList[2];
			status = zoneNameList[3];
			searchParam = "ruleRisk";

			if (zoneNameList[7] == "ruleRisk") {
				searchParam = "ruleRisk";
				if (ruleRisk == 'H') {
					additionalText = "High Rule Priority";
					$("#branchWiseReportTableRuleRiskHeading").text("High");
				} else if (ruleRisk == 'M') {
					additionalText = "Medium Rule Priority";
					$("#branchWiseReportTableRuleRiskHeading").text("Medium");
				} else if (ruleRisk == 'L') {
					additionalText = "Low Rule Priority";
					$("#branchWiseReportTableRuleRiskHeading").text("Low");
				}


			} else if (zoneNameList[7] == "riskClassification") {
				searchParam = "riskClassification";
				additionalText = "Risk Classification -" + ruleRisk;
				if (ruleRisk == 'Operational Deficiency') {
					$("#branchWiseReportTableRuleRiskHeading").text("Operational Deficiency");
				} else if (ruleRisk == 'Irregular Transactions') {
					$("#branchWiseReportTableRuleRiskHeading").text("Irregular Transactions");
				} else if (ruleRisk == 'Financial Exposure') {
					$("#branchWiseReportTableRuleRiskHeading").text("Financial Exposure");
				} else if (ruleRisk == 'Income Leakage') {
					$("#branchWiseReportTableRuleRiskHeading").text("Income Leakage");
				} else if (ruleRisk == 'Regulatory Non-Compliance') {
					$("#branchWiseReportTableRuleRiskHeading").text("Regulatory Non-Compliance");
				}


			}

			if (status == 'O') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Open Alert Count");
			} else if (status == 'C') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Closed Alert Count");
			} else if (status == 'U') {
				$("#branchWiseReportTableRuleRiskAlertHeading").text("Escalated Alert Count");
			}

		}


		if (endDate === null || endDate === '' || endDate === undefined) {
			if (startDate === null || startDate === '' || startDate === undefined) {
				startDate = '';
				ndDate = '';
			}
			startDate = '';
			endDate = '';
		}

		var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
			+ "    \"branchId\":\"" + zoneNameList[1] + "\",\n" +

			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
			"    \"status\": \"" + status + "\",\n" +

			"    \"endDate\":\"" + endDate + "\"\n" + "}";
		console.log(pagevalJson)
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
				if (searchParam != '' && searchParam == 'ruleRisk') {
					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBody").empty();
					$('#ruleWiseReportTable').dataTable().fnClearTable();
					$('#ruleWiseReportTable').DataTable().destroy();
					$('#ruleWiseReportTable').hide();

					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBodyRuleRisk").empty();
					$('#ruleWiseReportTableRuleRisk').dataTable().fnClearTable();
					$('#ruleWiseReportTableRuleRisk').DataTable().destroy();



					obj.ruleAlertCountList.forEach(function(item) {

						$(
							"<tr>"

							+ "<td>"
							+ item.ruleId
							+ "</a></td>"

							+ "<td>"
							+ item.ruleDesc
							+ "</a></td>"

							+ "<td style='cursor: pointer;' class='text-center text-bold text-blue accountAlertCount' id='ruleId~" + item.ruleId + "~" + item.branchId + "~" + ruleRisk + "~" + status + "~" + searchParam + "' name='ruleId'><a style='cursor: pointer;'>"
							+ item.statusWiseCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#ruleWiseCountBodyRuleRisk");

					});
					$("#ruleWiseReportTableRuleRisk").DataTable({
						"columnDefs": [{
							//orderable: false
						}],
						"order": [[2, 'desc']],
						"responsive": false,
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"language": {
							"emptyTable": "No Data Available"
						},
						"buttons": [{
							extend: 'excel',
							title: 'Rule wise Alert Count ',
						},
						{
							extend: 'pdf',
							title: 'Rule wise Alert Count ',
						}],
					}).buttons().container().appendTo(
						'#ruleWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

					// $("#ruleWiseReportTableRuleRisk")
					var scrollPos = $("#ruleWiseReportTableRuleRisk").offset.top;
					$(window).scrollTop(scrollPos);

					// ruleWiseReportTableRuleRiskAlertHeading
					if (status == 'O') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					} else if (status == 'C') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					} else if (status == 'U') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					}

				} else if (searchParam != '' && searchParam == 'riskClassification') {
					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBody").empty();
					$('#ruleWiseReportTable').dataTable().fnClearTable();
					$('#ruleWiseReportTable').DataTable().destroy();
					$('#ruleWiseReportTable').hide();

					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBodyRuleRisk").empty();
					$('#ruleWiseReportTableRuleRisk').dataTable().fnClearTable();
					$('#ruleWiseReportTableRuleRisk').DataTable().destroy();



					obj.ruleAlertCountList.forEach(function(item) {

						$(
							"<tr>"

							+ "<td>"
							+ item.ruleId
							+ "</a></td>"

							+ "<td>"
							+ item.ruleDesc
							+ "</a></td>"

							+ "<td  class='text-center text-bold text-blue accountAlertCountClassification' id='ruleId~" + item.ruleId + "~" + item.branchId + "~" + ruleRisk + "~" + status + "~" + searchParam + "' name='ruleId'><a style='cursor: pointer;'>"
							+ item.statusWiseCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#ruleWiseCountBodyRuleRisk");

					});
					$("#ruleWiseReportTableRuleRisk").DataTable({
						"columnDefs": [{
							//orderable: false
						}],
						"order": [[2, 'desc']],
						"responsive": false,
						"autoWidth": true,
						"searching": false,
						"fixedHeader": true,
						"language": {
							"emptyTable": "No Data Available"
						},
					}).buttons().container().appendTo(
						'#ruleWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

					if (status == 'O') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					} else if (status == 'C') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					} else if (status == 'U') {
						$("#ruleWiseReportTableRuleRiskAlertHeading").text(additionalText);
					}

					$('#ruleTable').show();

				}


				else {
					$('#branchId').text(zoneNameList[1]);
					$(".ruleWiseCountBody").empty();
					$('#ruleWiseReportTable').dataTable().fnClearTable();
					$('#ruleWiseReportTable').DataTable().destroy();
					obj.ruleAlertCountList.forEach(function(item) {

						$(
							"<tr>"

							+ "<td>"
							+ item.ruleId
							+ "</a></td>"

							+ "<td>"
							+ item.ruleDesc
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

							+ "<td class='text-center text-bold text-blue accountAlertCount' id='ruleId~" + item.ruleId + "~" + item.branchId + "' name='ruleId'><a href='#'>"
							+ item.totalCount
							+ "</a></td>"

							+ "</tr>")
							.appendTo("#ruleWiseCountBody");

					});
					$("#ruleWiseReportTable").DataTable({
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
					}).buttons().container().appendTo(
						'#ruleWiseReportTable_wrapper .col-md-6:eq(0)');
				}




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




$(document).on("click", ".accountAlertCount", function() {
	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var searchParam = null;
		var endDate = $('#endDate').val();
		var tempStatus = null;
		var ruleRisk = null;
		if (zoneNameList[3] === null || zoneNameList[3] === '' || zoneNameList[3] === undefined) {

		} else {
			ruleRisk = zoneNameList[3];
			status = zoneNameList[4];
			searchParam = zoneNameList[5];

			if (status == 'O') {
				tempStatus = "Open";
			} else if (status == 'C') {
				tempStatus = "Closed";
			} else if (status == 'U') {
				tempStatus = "Escalate";
			}
		}


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

			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
			"    \"status\": \"" + status + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		//alert"pagevalJson " + pagevalJson);
		console.log("pagevalJson " + pagevalJson);
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
				console.log(obj);

				$('#accountTable').css("display", "");
				$('#ruleId').text(zoneNameList[1]);
				$(".accountWiseCountBody").empty();
				$('#accountWiseReportTable').dataTable().fnClearTable();
				$('#accountWiseReportTable').DataTable().destroy();



				obj.accountAlertCountList.forEach(function(item) {

					if (tempStatus != null) {
						if (item.alertStatus.toUpperCase() == tempStatus.toUpperCase()) {
							$(
								"<tr>"

								+ "<td><a style='cursor: pointer;' id='" + item.alertId + "' class='text-blue viewAlertModal'>"
								+ item.alertId
								+ "</a></td>"

								+ "<td >"
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

								+ "<td class='text-right'>"
								+ item.generatedTime
								+ "</td>"

								+ "<td class='text-right'>"
								+ item.recurrenceCnt
								+ "</td>"

								+ "</tr>")
								.appendTo("#accountWiseCountBody");
						}
					} else {

						$(
							"<tr>"

							+ "<td><a style='cursor: pointer;' id='" + item.alertId + "' class='text-blue viewAlertModal'>"
							+ item.alertId
							+ "</a></td>"

							+ "<td class='text-left'>"
							+ item.custAcid
							+ "</td>"

							+ "<td class='text-left'>"
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

							+ "<td class='text-right'>"
							+ item.generatedTime
							+ "</td>"

							+ "<td class='text-right'>"
							+ item.recurrenceCnt
							+ "</td>"

							+ "</tr>")
							.appendTo("#accountWiseCountBody");

					}



				});
				$("#accountWiseReportTable").DataTable({
					"columnDefs": [{
						orderable: false
					}],
					"responsive": false,
					"autoWidth": true,
					"searching": false,
					"fixedHeader": true,
					"buttons": [{

						extend: 'excel',
						title: 'Account wise Alert Count ',

					},
					{

						extend: 'pdf',
						title: 'Account wise Alert Count ',

					}],
					"language": {
						"emptyTable": "No Data Available"
					},
				}).buttons().container().appendTo(
					'#accountWiseReportTable_wrapper .col-md-6:eq(0)');



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

//accountAlertCountClassification
$(document).on("click", ".accountAlertCountClassification", function() {

	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		var tempStatus = null;
		$('#accountTable').hide();
		$('#ruleTable').hide();

		if (zoneNameList[3] === null || zoneNameList[3] === '' || zoneNameList[3] === undefined) {

		} else {
			ruleRisk = zoneNameList[3];
			status = zoneNameList[4];
			searchParam = zoneNameList[5];
			if (status == 'O') {
				tempStatus = "Open";
			} else if (status == 'C') {
				tempStatus = "Closed";
			} else if (status == 'U') {
				tempStatus = "Escalate";
			}
		}


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

			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
			"    \"status\": \"" + status + "\",\n" +
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
					////alert"item.alertStatus.toUppercase() " + item.alertStatus.toUpperCase());
					////alert"tempStatus " + tempStatus);
					if (item.alertStatus.toUpperCase() == tempStatus.toUpperCase()) {
						$(
							"<tr>"

							+ "<td><a style='cursor: pointer;' id='" + item.alertId + "' class='text-blue viewAlertModal'>"
							+ item.alertId
							+ "</a></td>"

							+ "<td class='text-left'>"
							+ item.custAcid
							+ "</td>"

							+ "<td class='text-left'>"
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

							+ "<td class='text-right'>"
							+ item.generatedTime
							+ "</td>"

							+ "<td class='text-right'>"
							+ item.recurrenceCnt
							+ "</td>"

							+ "</tr>")
							.appendTo("#accountWiseCountBody");
					}


				});
				$("#accountWiseReportTable").DataTable({
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
				}).buttons().container().appendTo(
					'#accountWiseReportTable_wrapper .col-md-6:eq(0)');

				$('#accountTable').show();
				$('#ruleTable').hide();

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

// accountAlertCountClassification2
//accountAlertCountClassification
$(document).on("click", ".accountAlertCountClassification2", function() {
	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		var tempStatus = null;
		$('#accountWiseReportTable').hide();

		if (zoneNameList[3] === null || zoneNameList[3] === '' || zoneNameList[3] === undefined) {

		} else {
			ruleRisk = zoneNameList[3];
			status = zoneNameList[4];
			searchParam = zoneNameList[5];
			if (status == 'O') {
				tempStatus = "Open";
			} else if (status == 'C') {
				tempStatus = "Closed";
			} else if (status == 'U') {
				tempStatus = "Escalate";
			}
		}


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

			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
			"    \"status\": \"" + status + "\",\n" +
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
					////alert"item.alertStatus.toUppercase() " + item.alertStatus.toUpperCase());
					////alert"tempStatus " + tempStatus);
					if (item.alertStatus.toUpperCase() == tempStatus.toUpperCase()) {
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

							+ "<td class='text-right'>"
							+ item.generatedTime
							+ "</td>"

							+ "<td class='text-right'>"
							+ item.recurrenceCnt
							+ "</td>"

							+ "</tr>")
							.appendTo("#accountWiseCountBody");
					}


				});
				$("#accountWiseReportTable").DataTable({
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
				}).buttons().container().appendTo(
					'#accountWiseReportTable_wrapper .col-md-6:eq(0)');

				$('#accountWiseReportTable').show();

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


$(document).ready(function() {

	var mdleName = $("#mdleName").text();
	if (mdleName == 'System Admin') {
		$("#sysAdmi").show();
		$("#sysTexta").show();
	} else if (mdleName != 'System Admin') {
		$("#sysTexta").hide();
		$("#sysAdmi").hide();
	}


});


// Dropdown change
$(document).on("change", ".searchParam", function() {
	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");
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

	if (searchParam.includes('makerTimestamp~')) {
		//$("#hideDropDown").hide();
		//$("#searchcriteria").show();
	}
	else if (searchParam.includes('ruleRisk')) {

		var pageValJson = "{\"searchParam\":" + "\"" + searchParam + "\",\n" +
			"   \"startDate\": \"" + startDate + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";
		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				url: 'fetchGraphSearchParamWise',
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

					$(".zoneWiseCountBodyRuleRisk").empty();

					$('#zoneWiseReportTableRuleRisk').dataTable()
						.fnClearTable();
					$('#zoneWiseReportTableRuleRisk').DataTable()
						.destroy();


					$(".zoneWiseReportTableRuleClassification").empty();
					$('#zoneWiseReportTableRuleClassification').dataTable()
						.fnClearTable();
					$('#zoneWiseReportTableRuleClassification').DataTable()
						.destroy();
					$("#zoneWiseReportTableRuleClassification").hide();



					$('#zoneWiseReportTable').dataTable()
						.fnClearTable();
					$('#zoneWiseReportTable').DataTable()
						.destroy();
					$("#zoneWiseReportTable").hide();
					$("#zoneWiseReportTableRuleRisk").show();



					obj.zoneAlertCountList
						.forEach(function(item) {
							//$('#actionplantable tr:last').after(
							//////alert"Risk Id "+ item.riskId);

							if (item.zoneName)
								$(
									"<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-capitalize text-left'>"
									+ item.zoneName
									+ "</td>"

									+ "<td class='text-right text-bold text-red'><a style='cursor: pointer;' class='text-bold text-red viewRegion' id='zoneName~"
									+ item.zoneName + "~" + "H" + "~" + "O" + "~" + "High" + "~" + "Open Alert Count" + "~" + "#28A745"
									+ "'> "
									+ item.highOpenCount
									+ "</a></td>"

									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green viewRegion' id='zoneName~"
									+ item.zoneName + "~" + "H" + "~" + "C" + "~" + "High" + "~" + "Closed Alert Count" + "~" + "#28A745"
									+ "'> "
									+ item.highCloseCount
									+ "</a></td>"

									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange viewRegion' id='zoneName~"
									+ item.zoneName + "~" + "H" + "~" + "U" + "~" + "High" + "~" + "Escalated Alert Count" + "~" + "#28A745"
									+ "'> "
									+ item.highEscalateCount
									+ " </a></td>"

									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red viewRegion' id='zoneName~"
									+ item.zoneName + "~" + "M" + "~" + "O" + "~" + "Medium" + "~" + "Open Alert Count" + "~" + "##FFBF00"
									+ "'> "
									+ item.mediumOpenCount
									+ "</td>"


									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green viewRegion' id='zoneName~"
									+ item.zoneName + "~" + "M" + "~" + "C" + "~" + "Medium" + "~" + "Closed Alert Count" + "~" + "##FFBF00"
									+ "'> "
									+ item.mediumCloseCount
									+ "</td>"

									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange viewRegion' id='zoneName~"
									+ item.zoneName + "~" + "M" + "~" + "U" + "~" + "Medium" + "~" + "Escalated Alert Count" + "~" + "##FFBF00"
									+ "'> "
									+ item.mediumEscalateCount
									+ "</td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red viewRegion' id='zoneName~"
									+ item.zoneName + "~" + "L" + "~" + "O" + "~" + "Low" + "~" + "Open Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.lowOpenCount
									+ "</td>"


									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green viewRegion' id='zoneName~"
									+ item.zoneName + "~" + "L" + "~" + "C" + "~" + "Low" + "~" + "Closed Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.lowCloseCount
									+ "</td>"

									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange viewRegion' id='zoneName~"
									+ item.zoneName + "~" + "L" + "~" + "U" + "~" + "Low" + "~" + "Escalated Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.lowEscalateCount
									+ "</td>"


									+ "<td class='text-blue text-bold text-right'>"
									+ item.totalCount
									+ "</td>"



									+ "</tr>")
									.appendTo(
										".zoneWiseCountBodyRuleRisk");

						});


					$("#zoneWiseReportTableRuleRisk").DataTable({
						"columnDefs": [{
							orderable: false
						}],
						"responsive": false,
						"autoWidth": true,
						"searching": true,
						"fixedHeader": true,
						"bPaginate": false,
						"buttons": [{

							extend: 'excel',
							title: 'Rule Priority wise Zone Alert Count ',

						},
						{

							extend: 'pdf',
							title: 'Rule Priority wise Zone Alert Count ',

						}


						],
						"language": {
							"emptyTable": "No Data Available"
						},
					}).buttons().container().appendTo(
						'#zoneWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

					var scrollPos = $("#zoneWiseReportTableRuleRisk").offset.top;
					$(window).scrollTop(scrollPos);


				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

	}
	else {
		//$("#hideDropDown").show();
		//$("#searchcriteria").hide();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam + "\",\n" +
			"   \"startDate\": \"" + startDate + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";
		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				url: 'fetchGraphSearchParamClassificationWise',
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

					$(".zoneWiseCountBodyRuleRisk").empty();

					$('#zoneWiseReportTableRuleRisk').dataTable()
						.fnClearTable();
					$('#zoneWiseReportTableRuleRisk').DataTable()
						.destroy();
					$('#zoneWiseReportTableRuleRisk').hide();




					$('#zoneWiseReportTable').dataTable()
						.fnClearTable();
					$('#zoneWiseReportTable').DataTable()
						.destroy();
					$("#zoneWiseReportTable").hide();


					$(".zoneWiseCountBodyRuleClassification").empty();
					$('#zoneWiseReportTableRuleClassification').dataTable()
						.fnClearTable();
					$('#zoneWiseReportTableRuleClassification').DataTable()
						.destroy();
					$("#zoneWiseReportTableRuleClassification").show();


					obj.zoneAlertCountList
						.forEach(function(item) {
							if (item.zoneName)
								$(
									"<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-left text-capitalize'>"
									+ item.zoneName
									+ "</td>"

									+ "<td class='text-right text-bold text-red'><a style='cursor: pointer;' class='text-bold text-red text-capitalize viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Operational Deficiency" + "~" + "O" + "~" + "Operational Deficiency" + "~" + "Open Alert Count" + "~" + "#28A745"
									+ "'> "
									+ item.operationalOpenCount
									+ "</a></td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Operational Deficiency" + "~" + "C" + "~" + "Operational Deficiency" + "~" + "Closed Alert Count" + "~" + "#28A745"
									+ "'> "
									+ item.operationalCloseCount
									+ "</a></td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Operational Deficiency" + "~" + "U" + "~" + "Operational Deficiency" + "~" + "Escalated Alert Count" + "~" + "#28A745"
									+ "'> "
									+ item.operationalEscalteCount
									+ " </a></td>"




									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Irregular Transactions" + "~" + "O" + "~" + "Irregular Transactions" + "~" + "Open Alert Count" + "~" + "##FFBF00"
									+ "'> "
									+ item.irregularTranOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Irregular Transactions" + "~" + "C" + "~" + "Irregular Transactions" + "~" + "Closed Alert Count" + "~" + "##FFBF00"
									+ "'> "
									+ item.irregularTranCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Irregular Transactions" + "~" + "U" + "~" + "Irregular Transactions" + "~" + "Escalated Alert Count" + "~" + "##FFBF00"
									+ "'> "
									+ item.irregularTranEscalteCount
									+ "</td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Financial Exposure" + "~" + "O" + "~" + "Financial Exposure" + "~" + "Open Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.financialExpOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Financial Exposure" + "~" + "C" + "~" + "Financial Exposure" + "~" + "Closed Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.financialExpCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Financial Exposure" + "~" + "U" + "~" + "Financial Exposure" + "~" + "Escalated Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.financialExpEscalteCount
									+ "</td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Income Leakage" + "~" + "O" + "~" + "Income Leakage" + "~" + "Open Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.incomeLeakageOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Income Leakage" + "~" + "C" + "~" + "Income Leakage" + "~" + "Closed Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.incomeLeakageCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Income Leakage" + "~" + "U" + "~" + "Income Leakage" + "~" + "Escalated Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.incomeLeakageEscalteCount
									+ "</td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Regulatory Non-Compliance" + "~" + "O" + "~" + "Regulatory Non-Compliance" + "~" + "Open Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.regulatoryComplOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Regulatory Non-Compliance" + "~" + "C" + "~" + "Regulatory Non-Compliance" + "~" + "Closed Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.regulatoryComplCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange viewRegionClassificationWise' id='zoneName~"
									+ item.zoneName + "~" + "Regulatory Non-Compliance" + "~" + "U" + "~" + "Regulatory Non-Compliance" + "~" + "Escalated Alert Count" + "~" + "#FF0000"
									+ "'> "
									+ item.regulatoryComplEscalteCount
									+ "</td>"



									+ "</tr>")
									.appendTo(
										".zoneWiseCountBodyRuleClassification");

						});


					$("#zoneWiseReportTableRuleClassification").DataTable({
						"columnDefs": [{
							orderable: false
						}],
						"responsive": false,
						"autoWidth": true,
						"searching": true,
						"fixedHeader": true,
						"bPaginate": false,
						"scrollX": true,
						"buttons": [{
							extend: 'excel',
							title: 'Rule Classification wise Zone Alert Count ',
						}],
						"language": {
							"emptyTable": "No Data Available"
						},
					}).buttons().container().appendTo(
						'#zoneWiseReportTableRuleClassification_wrapper .col-md-6:eq(0)');

					var scrollPos = $("#zoneWiseReportTableRuleClassification").offset.top;
					$(window).scrollTop(scrollPos);


				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

	}

})


// Dropdown for Region Filter
$(document).on("change", ".searchParamRegionwise", function() {

	$('#ruleTable').hide();
	$('#accountTable').hide();

	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");

	var selectedFlag = null;
	if ($("#auditFlag").val() == "true") {
		selectedFlag = "CENTRAL";
	} else if ($("#zonalFlag").val() == "true") {
		selectedFlag = "ZONAL";
	} else if ($("#regionalFlag").val() == "true") {
		selectedFlag = "REGIONAL";
	} else if ($("#ruleFlag").val() == "true") {
		selectedFlag = "BRANCH";
	}

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

	$(".navTempRegion").show();

	//$("#branchWiseReportTable").hide()


	if (searchParam.includes('makerTimestamp~')) {
		//$("#hideDropDown").hide();
		//$("#searchcriteria").show();
	}
	else if (searchParam.includes('ruleRisk')) {


		$(".classificationExcelBtn").hide();
		$(".priorityExcelBtn").show();

		//var pageValJson = "{\"selectedFlag\":" + "\"" + selectedFlag + "\"}";

		/*var pageValJson = "{\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"selectedFlag\": \"" + selectedFlag + "\" \n" +
			"}";*/

		var pageValJson = "{\"startDate\": \"" + startDate + "\",\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"selectedFlag\": \"" + selectedFlag + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				url: 'fetchRuleRiskParamWise',
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

					if ($("#regionalFlag").val() == "true") {

						$(".branchWiseCountBodyRuleRisk").empty();
						$('#branchWiseReportTableRuleRisk').dataTable()
							.fnClearTable();
						$('#branchWiseReportTableRuleRisk').DataTable()
							.destroy();
						$(".branchWiseCountBodyRuleClassification").empty();
						$('#branchWiseReportTableRuleClassification').dataTable()
							.fnClearTable();
						$('#branchWiseReportTableRuleClassification').DataTable()
							.destroy();
						$("#branchWiseReportTableRuleClassification").hide();
						$('#branchWiseReportTable').dataTable()
							.fnClearTable();
						$('#branchWiseReportTable').DataTable()
							.destroy();
						$("#branchWiseReportTable").hide();
						obj.zoneAlertCountList
							.forEach(function(item) {

								if (item.branchId)
									//alert("branch Id " + item.branchId);

									$(
										"<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-left'>"
										+ item.branchId
										+ "</td>"

										+ "<td class='sorting_1 text-left'>"
										+ item.branchName
										+ "</td>"

										+ "<td class='text-right text-bold text-red'><a style='cursor: pointer;' class='text-bold text-red ruleAlertCountClassificationWise2' id='branchId~"
										+ item.branchId + "~" + "H" + "~" + "O" + "~" + "High" + "~" + "Open Alert Count" + "~" + "#28A745" + "~" + "ruleRisk"
										+ "'> <span class='badge text-white' style='background-color: #E14023'>"
										+ item.highOpenCount
										+ "</span></a></td>"

										+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green ruleAlertCountClassificationWise2' id='branchId~"
										+ item.branchId + "~" + "H" + "~" + "C" + "~" + "High" + "~" + "Closed Alert Count" + "~" + "#28A745" + "~" + "ruleRisk"
										+ "'> <span class='badge text-white' style='background-color: #28A745'>"
										+ item.highCloseCount
										+ "</span></a></td>"

										+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange ruleAlertCountClassificationWise2' id='branchId~"
										+ item.branchId + "~" + "H" + "~" + "U" + "~" + "High" + "~" + "Escalated Alert Count" + "~" + "#28A745" + "~" + "ruleRisk"
										+ "'> <span class='badge text-white' style='background-color: #FFBF00'>"
										+ item.highEscalateCount
										+ " </span></a></td>"

										+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red ruleAlertCountClassificationWise2' id='branchId~"
										+ item.branchId + "~" + "M" + "~" + "O" + "~" + "Medium" + "~" + "Open Alert Count" + "~" + "##FFBF00" + "~" + "ruleRisk"
										+ "'><span class='badge text-white' style='background-color: #E14023'> "
										+ item.mediumOpenCount
										+ "</span></td>"


										+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green ruleAlertCountClassificationWise2' id='branchId~"
										+ item.branchId + "~" + "M" + "~" + "C" + "~" + "Medium" + "~" + "Closed Alert Count" + "~" + "##FFBF00" + "~" + "ruleRisk"
										+ "'> <span class='badge text-white' style='background-color: #28A745'>"
										+ item.mediumCloseCount
										+ "</span></td>"

										+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange ruleAlertCountClassificationWise2' id='branchId~"
										+ item.branchId + "~" + "M" + "~" + "U" + "~" + "Medium" + "~" + "Escalated Alert Count" + "~" + "##FFBF00" + "~" + "ruleRisk"
										+ "'><span class='badge text-white' style='background-color: #FFBF00'> "
										+ item.mediumEscalateCount
										+ "</span></td>"


										+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red ruleAlertCountClassificationWise2' id='branchId~"
										+ item.branchId + "~" + "L" + "~" + "O" + "~" + "Low" + "~" + "Open Alert Count" + "~" + "#FF0000" + "~" + "ruleRisk"
										+ "'> <span class='badge text-white' style='background-color: #E14023'>"
										+ item.lowOpenCount
										+ "</span></td>"


										+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green ruleAlertCountClassificationWise2' id='branchId~"
										+ item.branchId + "~" + "L" + "~" + "C" + "~" + "Low" + "~" + "Closed Alert Count" + "~" + "#FF0000" + "~" + "ruleRisk"
										+ "'> <span class='badge text-white' style='background-color: #28A745'>"
										+ item.lowCloseCount
										+ "</span></td>"

										+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange ruleAlertCountClassificationWise2' id='branchId~"
										+ item.branchId + "~" + "L" + "~" + "U" + "~" + "Low" + "~" + "Escalated Alert Count" + "~" + "#FF0000" + "~" + "ruleRisk"
										+ "'> <span class='badge text-white' style='background-color: #FFBF00'>"
										+ item.lowEscalateCount
										+ "</span></td>"


										+ "<td class='text-blue text-bold text-right'>"
										+ item.totalCount
										+ "</td>"

										+ "</tr>")
										.appendTo(
											".branchWiseCountBodyRuleRisk1");

							});


						$("#branchWiseReportTableRuleRisk").DataTable({
							"columnDefs": [{
								orderable: false
							}],
							"responsive": true,
							"autoWidth": false,
							"searching": true,
							"fixedHeader": true,
							"bPaginate": false,
							/*"buttons": [{

								extend: 'excel',
								title: 'Rule Risk wise Zone Alert Count ',

							}],*/
							"language": {
								"emptyTable": "No Data Available"
							},
						}).buttons().container().appendTo(
							'#branchWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

						$("#branchWiseReportTableRuleRisk").show();

						$("#ruleClassificationGraph").hide();
						$('#home').css('display', '');


						/*var scrollPos = $("#branchWiseReportTableRuleRisk").offset.top;
						$(window).scrollTop(scrollPos);*/

					}

					var totalOpenCount = 0;
					var totalCloseCount = 0;
					var totalEscalateCount = 0;

					var totalMedOpenCount = 0;
					var totalMedCloseCount = 0;
					var totalMedEscalateCount = 0;

					var totalLowOpenCount = 0;
					var totalLowCloseCount = 0;
					var totalLowEscalateCount = 0;


					obj.zoneAlertCountList
						.forEach(function(item) {

							totalOpenCount = (totalOpenCount + item.highOpenCount);

							totalCloseCount = (totalCloseCount + item.highCloseCount);

							totalEscalateCount = (totalEscalateCount + item.highEscalateCount);

							totalMedOpenCount = (totalMedOpenCount + item.mediumOpenCount);

							totalMedCloseCount = (totalMedCloseCount + item.mediumCloseCount);

							totalMedEscalateCount = (totalMedEscalateCount + item.mediumEscalateCount);

							totalLowOpenCount = (totalLowOpenCount + item.lowOpenCount);

							totalLowCloseCount = (totalLowCloseCount + item.lowCloseCount);

							totalLowEscalateCount = (totalLowEscalateCount + item.lowEscalateCount);


						});
					/*alert("totalOpenCount = " + totalOpenCount);
					alert("totalCloseCount = " + totalCloseCount);
					alert("totalEscalateCount = " + totalEscalateCount);*/

					/*HIGH*/
					/*PIE CHART*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalOpenCount, totalCloseCount, totalEscalateCount],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChart').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART*/


					/*HIGH*/

					/*MEDIUM*/

					/*PIE CHART*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalMedOpenCount, totalMedCloseCount, totalMedEscalateCount],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartMed').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART*/

					/*MEDIUM*/

					/*LOW*/
					/*PIE CHART*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalLowOpenCount, totalLowCloseCount, totalLowEscalateCount],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartLow').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART*/

					/*LOW*/

					$("#ruleRiskGraph").show();


				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

	}
	else {

		$(".priorityExcelBtn").hide();
		$(".classificationExcelBtn").show();



		//var pageValJson = "{\"selectedFlag\":" + "\"" + selectedFlag + "\"}";

		/*var pageValJson = "{\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"selectedFlag\": \"" + selectedFlag + "\" \n" +
			"}";*/

		var pageValJson = "{\"startDate\": \"" + startDate + "\",\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"selectedFlag\": \"" + selectedFlag + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				// fetchRuleRiskParamWise
				url: 'fetchRuleClassificationParamWise',
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


					if ($("#regionalFlag").val() == "true") {
						$(".branchWiseCountBodyRuleRisk").empty();
						$('#branchWiseReportTableRuleRisk').dataTable()
							.fnClearTable();
						$('#branchWiseReportTableRuleRisk').DataTable()
							.destroy();
						$(".branchWiseCountBodyRuleClassification").empty();
						$('#branchWiseReportTableRuleClassification').dataTable()
							.fnClearTable();
						$('#branchWiseReportTableRuleClassification').DataTable()
							.destroy();
						$("#branchWiseReportTableRuleClassification").hide();
						$('#branchWiseReportTable').dataTable()
							.fnClearTable();
						$('#branchWiseReportTable').DataTable()
							.destroy();
						$("#branchWiseReportTable").hide();
						$("#branchWiseReportTableRuleRisk").hide();


						$('#branchWiseReportTableRuleClassification').dataTable()
							.fnClearTable();
						$('#branchWiseReportTableRuleClassification').DataTable()
							.destroy();
						$("#branchWiseReportTableRuleClassification").show();


						obj.zoneAlertCountList.forEach(function(item) {
							if (item.branchId)
								$(
									"<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-left'>"
									+ item.branchId
									+ "</td>"

									+ "<td class='sorting_1 text-left'>"
									+ item.branchName
									+ "</td>"

									+ "<td class='text-right text-bold text-red'><a style='cursor: pointer;' class='text-bold text-red ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Operational Deficiency" + "~" + "O" + "~" + "Operational Deficiency" + "~" + "Open Alert Count" + "~" + "#28A745" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #E14023'>"
									+ item.operationalOpenCount
									+ "</span></a></td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Operational Deficiency" + "~" + "C" + "~" + "Operational Deficiency" + "~" + "Closed Alert Count" + "~" + "#28A745" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #28A745'>"
									+ item.operationalCloseCount
									+ "</span></a></td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Operational Deficiency" + "~" + "U" + "~" + "Operational Deficiency" + "~" + "Escalated Alert Count" + "~" + "#28A745" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #FFBF00'>"
									+ item.operationalEscalteCount
									+ " </span></a></td>"




									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Irregular Transactions" + "~" + "O" + "~" + "Irregular Transactions" + "~" + "Open Alert Count" + "~" + "##FFBF00" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #E14023'>"
									+ item.irregularTranOpenCount
									+ "</span></a></td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Irregular Transactions" + "~" + "C" + "~" + "Irregular Transactions" + "~" + "Closed Alert Count" + "~" + "##FFBF00" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #28A745'>"
									+ item.irregularTranCloseCount
									+ "</span></a></td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Irregular Transactions" + "~" + "U" + "~" + "Irregular Transactions" + "~" + "Escalated Alert Count" + "~" + "##FFBF00" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #FFBF00'>"
									+ item.irregularTranEscalteCount
									+ "</span></a></td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Financial Exposure" + "~" + "O" + "~" + "Financial Exposure" + "~" + "Open Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'><span class='badge text-white' style='background-color: #E14023'> "
									+ item.financialExpOpenCount
									+ "</span></a></td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Financial Exposure" + "~" + "C" + "~" + "Financial Exposure" + "~" + "Closed Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #28A745'>"
									+ item.financialExpCloseCount
									+ "</span></a></td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Financial Exposure" + "~" + "U" + "~" + "Financial Exposure" + "~" + "Escalated Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #FFBF00'>"
									+ item.financialExpEscalteCount
									+ "</span></a></td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Income Leakage" + "~" + "O" + "~" + "Income Leakage" + "~" + "Open Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'><span class='badge text-white' style='background-color: #E14023'> "
									+ item.incomeLeakageOpenCount
									+ "</span></a></td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Income Leakage" + "~" + "C" + "~" + "Income Leakage" + "~" + "Closed Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #28A745'>"
									+ item.incomeLeakageCloseCount
									+ "</span></a></td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Income Leakage" + "~" + "U" + "~" + "Income Leakage" + "~" + "Escalated Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #FFBF00'>"
									+ item.incomeLeakageEscalteCount
									+ "</span></a></td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Regulatory Non-Compliance" + "~" + "O" + "~" + "Regulatory Non-Compliance" + "~" + "Open Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #E14023'>"
									+ item.regulatoryComplOpenCount
									+ "</span></a></td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Regulatory Non-Compliance" + "~" + "C" + "~" + "Regulatory Non-Compliance" + "~" + "Closed Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #28A745'>"
									+ item.regulatoryComplCloseCount
									+ "</span></a></td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange ruleAlertCountClassificationWise2' id='branchId~"
									+ item.branchId + "~" + "Regulatory Non-Compliance" + "~" + "U" + "~" + "Regulatory Non-Compliance" + "~" + "Escalated Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> <span class='badge text-white' style='background-color: #FFBF00'>"
									+ item.regulatoryComplEscalteCount
									+ "</span></a></td>"



									+ "</tr>")
									.appendTo(
										".branchWiseCountBodyRuleClassification");

						});
						$("#ruleRiskGraph").hide();
						$("#branchWiseReportTableRuleRisk").hide();


						$('#home').css('display', '');
						$("#branchWiseReportTableRuleClassification").show();

						$("#branchWiseReportTableRuleClassification").DataTable({
							"columnDefs": [{
								orderable: false
							}],
							"responsive": false,
							"autoWidth": false,
							"searching": true,
							"fixedHeader": true,
							"bPaginate": false,
							"scrollX": true,
							/*"buttons": [{
								extend: 'excel',
								title: 'Rule Classification wise Zone Alert Count ',
							}],*/
							"language": {
								"emptyTable": "No Data Available"
							},
						}).buttons().container().appendTo(
							'#branchWiseReportTableRuleClassification_wrapper .col-sm-12:eq(0)');

						/*var scrollPos = $("#branchWiseReportTableRuleClassification").offset.top;
						$(window).scrollTop(scrollPos);*/


					}

					var totalODOpenCount = 0;
					var totalODCloseCount = 0;
					var totalODverificationCount = 0;

					var totalITOpenCount = 0;
					var totalITCloseCount = 0;
					var totalITverificationCount = 0;

					var totalFEOpenCount = 0;
					var totalFECloseCount = 0;
					var totalFEverificationCount = 0;

					var totalILOpenCount = 0;
					var totalILCloseCount = 0;
					var totalILverificationCount = 0;

					var totalRNOpenCount = 0;
					var totalRNCloseCount = 0;
					var totalRNverificationCount = 0;

					var totalOTCClassification = 0;
					var totalVTCClassification = 0;


					obj.zoneAlertCountList.forEach(function(item) {

						totalODOpenCount = (totalODOpenCount + item.operationalOpenCount);
						totalODCloseCount = (totalODCloseCount + item.operationalCloseCount);
						totalODverificationCount = (totalODverificationCount + item.operationalEscalteCount);

						totalITOpenCount = (totalITOpenCount + item.irregularTranOpenCount);
						totalITCloseCount = (totalITCloseCount + item.irregularTranCloseCount);
						totalITverificationCount = (totalITverificationCount + item.irregularTranEscalteCount);

						totalFEOpenCount = (totalFEOpenCount + item.financialExpOpenCount);
						totalFECloseCount = (totalFECloseCount + item.financialExpCloseCount);
						totalFEverificationCount = (totalFEverificationCount + item.financialExpEscalteCount);

						totalILOpenCount = (totalILOpenCount + item.incomeLeakageOpenCount);
						totalILCloseCount = (totalILCloseCount + item.incomeLeakageCloseCount);
						totalILverificationCount = (totalILverificationCount + item.incomeLeakageEscalteCount);

						totalRNOpenCount = (totalRNOpenCount + item.regulatoryComplOpenCount);
						totalRNCloseCount = (totalRNCloseCount + item.regulatoryComplCloseCount);
						totalRNverificationCount = (totalRNverificationCount + item.regulatoryComplEscalteCount);

					});

					totalOTCClassification = (totalODOpenCount + totalITOpenCount + totalFEOpenCount + totalILOpenCount + totalRNOpenCount);
					totalVTCClassification = (totalODverificationCount + totalITverificationCount + totalFEverificationCount + totalILverificationCount + totalRNverificationCount);



					/*PIE CHART OD*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalODOpenCount, totalODCloseCount, totalODverificationCount],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartOD').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHARTOD*/


					/*PIE CHART IT*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalITOpenCount, totalITCloseCount, totalITverificationCount],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartIT').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHARTIT*/

					/*PIE CHART FE*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalFEOpenCount, totalFECloseCount, totalFEverificationCount],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartFE').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART FE*/

					/*PIE CHART IL*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalILOpenCount, totalILCloseCount, totalILverificationCount],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartIL').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART IL*/


					/*PIE CHART RN*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalRNOpenCount, totalRNCloseCount, totalRNverificationCount],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartRN').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART RN*/


					/*CLASSIFICATION WISE*/

					/*PIE CHART OPEN*/

					var donutData = {
						labels: ['Operational Deficiency', 'Irregular Transactions', 'Financial Exposure', 'Income Leakage', 'Regulatory Non-Compliance'],
						datasets: [
							{
								data: [totalODOpenCount, totalITOpenCount, totalFEOpenCount, totalILOpenCount, totalRNOpenCount],
								backgroundColor: ['#ffd700', '#0a0', '#1b458b', '#08f', '#f80'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartOTC').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART OPEN*/


					/*PIE CHART VERIFY*/

					var donutData = {
						labels: ['Operational Deficiency', 'Irregular Transactions', 'Financial Exposure', 'Income Leakage', 'Regulatory Non-Compliance'],
						datasets: [
							{
								data: [totalODverificationCount, totalITverificationCount, totalFEverificationCount, totalILverificationCount, totalRNverificationCount],
								backgroundColor: ['#ffd700', '#0a0', '#1b458b', '#08f', '#f80'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartVTC').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART VERIFY*/

					/*CLASSIFICATION WISE*/



					$("#ruleClassificationGraph").show();


				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

	}

})

// searchParamBranchWise
$(document).on("change", ".searchParamBranchWise", function() {

	$('#accountTable').hide();


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

	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");

	var selectedFlag = null;
	if ($("#auditFlag").val() == "true") {
		selectedFlag = "CENTRAL";
	} else if ($("#zonalFlag").val() == "true") {
		selectedFlag = "ZONAL";
	} else if ($("#regionalFlag").val() == "true") {
		selectedFlag = "REGIONAL";
	} else if ($("#ruleFlag").val() == "true") {
		selectedFlag = "BRANCH";
	}

	$(".navTempBranch").show();

	if (searchParam.includes('makerTimestamp~')) {
		//$("#hideDropDown").hide();
		//$("#searchcriteria").show();
	}
	else if (searchParam.includes('ruleRisk')) {


		$(".classificationExcelBtn").hide();
		$(".priorityExcelBtn").show();

		//var pageValJson = "{\"selectedFlag\":" + "\"" + selectedFlag + "\"}";

		/*	var pageValJson = "{\n" +
				"    \"searchParam\": \"" + searchParam + "\",\n" +
				"    \"selectedFlag\": \"" + selectedFlag + "\" \n" +
				"}";*/

		var pageValJson = "{\"startDate\": \"" + startDate + "\",\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"selectedFlag\": \"" + selectedFlag + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				url: 'fetchRuleRiskParamWise',
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


					if ($("#ruleFlag").val() == "true") {

						//alert"Object "+ obj);
						$(".regionWiseCountBody").empty();
						$('#ruleWiseReportTable').dataTable()
							.fnClearTable();
						$('#ruleWiseReportTable').DataTable()
							.destroy();

						$("#ruleWiseReportTable").hide();

						$(".regionWiseReportTableBodyRuleClassification").empty();
						$('#ruleWiseReportTableRuleClassification').dataTable()
							.fnClearTable();
						$('#ruleWiseReportTableRuleClassification').DataTable()
							.destroy();
						$("#ruleWiseReportTableRuleClassification").hide();

						$('#ruleWiseReportTableRuleRisk').dataTable()
							.fnClearTable();
						$('#ruleWiseReportTableRuleRisk').DataTable()
							.destroy();
						$(".ruleWiseCountBodyRuleRisk").empty();
						$("#ruleWiseReportTableRuleRisk").show();

						obj.zoneAlertCountList
							.forEach(function(item) {

								if (item.ruleId)
									$(
										"<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-left'>"
										+ item.ruleId
										+ "</td>"

										+ "<td class='text-right text-bold text-red'><a style='cursor: pointer;' class='text-bold text-red accountAlertCountClassification2' id='ruleId~"
										//+ item.ruleId + "~" + "H" + "~" + "O" + "~" + "High" + "~" + "Open Alert Count" + "~" + "#28A745" + "~" + "ruleRisk"
										+ item.ruleId + "~" + obj.branchId + "~" + "H" + "~" + "O" + "~" + "ruleRisk"
										+ "'> "
										+ item.highOpenCount
										+ "</a></td>"

										+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green accountAlertCountClassification2' id='branchId~"
										//+ item.ruleId + "~" + "H" + "~" + "C" + "~" + "High" + "~" + "Closed Alert Count" + "~" + "#28A745" + "~" + "ruleRisk"
										+ item.ruleId + "~" + obj.branchId + "~" + "H" + "~" + "C" + "~" + "ruleRisk"
										+ "'> "
										+ item.highCloseCount
										+ "</a></td>"

										+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange accountAlertCountClassification2' id='branchId~"
										//+ item.ruleId + "~" + "H" + "~" + "U" + "~" + "High" + "~" + "Escalated Alert Count" + "~" + "#28A745" + "~" + "ruleRisk"
										+ item.ruleId + "~" + obj.branchId + "~" + "H" + "~" + "U" + "~" + "ruleRisk"
										+ "'> "
										+ item.highEscalateCount
										+ " </a></td>"

										+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red accountAlertCountClassification2' id='branchId~"
										//+ item.ruleId + "~" + "M" + "~" + "O" + "~" + "Medium" + "~" + "Open Alert Count" + "~" + "##FFBF00"+ "~" + "ruleRisk"
										+ item.ruleId + "~" + obj.branchId + "~" + "M" + "~" + "O" + "~" + "ruleRisk"
										+ "'> "
										+ item.mediumOpenCount
										+ "</td>"


										+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green accountAlertCountClassification2' id='branchId~"
										+ item.ruleId + "~" + obj.branchId + "~" + "M" + "~" + "C" + "~" + "ruleRisk"
										//+ item.ruleId + "~" + "M" + "~" + "C" + "~" + "Medium" + "~" + "Closed Alert Count" + "~" + "##FFBF00" + "~" + "ruleRisk"
										+ "'> "
										+ item.mediumCloseCount
										+ "</td>"

										+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange accountAlertCountClassification2' id='branchId~"
										//+ item.ruleId + "~" + "M" + "~" + "U" + "~" + "Medium" + "~" + "Escalated Alert Count" + "~" + "##FFBF00" + "~" + "ruleRisk"
										+ item.ruleId + "~" + obj.branchId + "~" + "M" + "~" + "U" + "~" + "ruleRisk"
										+ "'> "
										+ item.mediumEscalateCount
										+ "</td>"


										+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red accountAlertCountClassification2' id='branchId~"
										//+ item.ruleId + "~" + "L" + "~" + "O" + "~" + "Low" + "~" + "Open Alert Count" + "~" + "#FF0000" + "~" + "ruleRisk"
										+ item.ruleId + "~" + obj.branchId + "~" + "L" + "~" + "O" + "~" + "ruleRisk"
										+ "'> "
										+ item.lowOpenCount
										+ "</td>"


										+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green accountAlertCountClassification2' id='branchId~"
										//+ item.ruleId + "~" + "L" + "~" + "C" + "~" + "Low" + "~" + "Closed Alert Count" + "~" + "#FF0000" + "~" + "ruleRisk"
										+ item.ruleId + "~" + obj.branchId + "~" + "L" + "~" + "C" + "~" + "ruleRisk"
										+ "'> "
										+ item.lowCloseCount
										+ "</td>"

										+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange accountAlertCountClassification2' id='branchId~"
										//+ item.ruleId + "~" + "L" + "~" + "U" + "~" + "Low" + "~" + "Escalated Alert Count" + "~" + "#FF0000" + "~" + "ruleRisk"
										+ item.ruleId + "~" + obj.branchId + "~" + "L" + "~" + "U" + "~" + "ruleRisk"
										+ "'> "
										+ item.lowEscalateCount
										+ "</td>"


										+ "<td class='text-blue text-bold text-right'>"
										+ item.totalCount
										+ "</td>"



										+ "</tr>")
										.appendTo(
											".ruleWiseCountBodyRuleRisk");

							});


						//$("#pieChart2").hide();
						//$("#pieChart2").remove();


						$("#ruleWiseReportTableRuleRisk").DataTable({
							"columnDefs": [{
								orderable: false
							}],
							"responsive": false,
							"autoWidth": true,
							"searching": true,
							"fixedHeader": true,
							"bPaginate": false,
							/*"buttons": [{

								extend: 'excel',
								title: 'Region wise Alert Count ',

							}],*/
							"language": {
								"emptyTable": "No Data Available"
							},
						}).buttons().container().appendTo(
							'#ruleWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

						$("#ruleWiseReportTableRuleRisk").show();
						$("#ruleClassificationGraph").hide();


						/*var scrollPos = $("#ruleWiseReportTableRuleRisk").offset.top;
						$(window).scrollTop(scrollPos);*/

					}


					var totalOpenCountBranch = 0;
					var totalCloseCountBranch = 0;
					var totalEscalateCountBranch = 0;

					var totalMedOpenCountBranch = 0;
					var totalMedCloseCountBranch = 0;
					var totalMedEscalateCountBranch = 0;

					var totalLowOpenCountBranch = 0;
					var totalLowCloseCountBranch = 0;
					var totalLowEscalateCountBranch = 0;


					obj.zoneAlertCountList
						.forEach(function(item) {


							totalOpenCountBranch = (totalOpenCountBranch + item.highOpenCount);

							totalCloseCountBranch = (totalCloseCountBranch + item.highCloseCount);

							totalEscalateCountBranch = (totalEscalateCountBranch + item.highEscalateCount);

							totalMedOpenCountBranch = (totalMedOpenCountBranch + item.mediumOpenCount);

							totalMedCloseCountBranch = (totalMedCloseCountBranch + item.mediumCloseCount);

							totalMedEscalateCountBranch = (totalMedEscalateCountBranch + item.mediumEscalateCount);

							totalLowOpenCountBranch = (totalLowOpenCountBranch + item.lowOpenCount);

							totalLowCloseCountBranch = (totalLowCloseCountBranch + item.lowCloseCount);

							totalLowEscalateCountBranch = (totalLowEscalateCountBranch + item.lowEscalateCount);


						});

					/*HIGH*/
					/*PIE CHART*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalOpenCountBranch, totalCloseCountBranch, totalEscalateCountBranch],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartBranch').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART*/
					/*HIGH*/


					/*MEDIUM*/
					/*PIE CHART*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalMedOpenCountBranch, totalMedCloseCountBranch, totalMedEscalateCountBranch],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartMedBranch').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART*/
					/*MEDIUM*/

					/*LOW*/
					/*PIE CHART*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalLowOpenCountBranch, totalLowCloseCountBranch, totalLowEscalateCountBranch],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartLowBranch').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART*/

					/*LOW*/

					$("#ruleRiskGraphBranch").show();

					$("#ruleClassificationGraphBranch").hide();


				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

	}
	else {


		$(".priorityExcelBtn").hide();
		$(".classificationExcelBtn").show();

		//var pageValJson = "{\"selectedFlag\":" + "\"" + selectedFlag + "\"}";

		/*var pageValJson = "{\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"selectedFlag\": \"" + selectedFlag + "\" \n" +
			"}";*/

		var pageValJson = "{\"startDate\": \"" + startDate + "\",\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"selectedFlag\": \"" + selectedFlag + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				// fetchRuleRiskParamWise
				url: 'fetchRuleClassificationParamWise',
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


					if ($("#ruleFlag").val() == "true") {

						$(".regionWiseCountBody").empty();
						$('#ruleWiseReportTable').dataTable()
							.fnClearTable();
						$('#ruleWiseReportTable').DataTable()
							.destroy();

						$("#ruleWiseReportTable").hide();

						$(".ruleWiseReportTableBodyRuleClassification").empty();
						$('#ruleWiseReportTableRuleClassification').dataTable()
							.fnClearTable();
						$('#ruleWiseReportTableRuleClassification').DataTable()
							.destroy();
						$("#ruleWiseReportTableRuleClassification").hide();

						$('#ruleWiseReportTableRuleRisk').dataTable()
							.fnClearTable();
						$('#ruleWiseReportTableRuleRisk').DataTable()
							.destroy();
						$(".ruleWiseCountBodyRuleRisk").empty();
						$("#ruleWiseReportTableRuleRisk").hide();
						$("#ruleWiseReportTableRuleClassification").show();

						obj.zoneAlertCountList.forEach(function(item) {
							if (item.ruleId)
								$(

									"<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-left'>"
									+ item.ruleId
									+ "</td>"

									+ "<td class='text-right text-bold text-red'><a style='cursor: pointer;' class='text-bold text-red accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Operational Deficiency" + "~" + "O" + "~" + "Operational Deficiency" + "~" + "Open Alert Count" + "~" + "#28A745" + "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Operational Deficiency" + "~" + "O" + "~" + "riskClassification"
									+ "'> "
									+ item.operationalOpenCount
									+ "</a></td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Operational Deficiency" + "~" + "C" + "~" + "Operational Deficiency" + "~" + "Closed Alert Count" + "~" + "#28A745" + "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Operational Deficiency" + "~" + "C" + "~" + "riskClassification"
									+ "'> "
									+ item.operationalCloseCount
									+ "</a></td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Operational Deficiency" + "~" + "U" + "~" + "Operational Deficiency" + "~" + "Escalated Alert Count" + "~" + "#28A745"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Operational Deficiency" + "~" + "U" + "~" + "riskClassification"
									+ "'> "
									+ item.operationalEscalteCount
									+ " </a></td>"




									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Irregular Transactions" + "~" + "O" + "~" + "Irregular Transactions" + "~" + "Open Alert Count" + "~" + "##FFBF00"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Irregular Transactions" + "~" + "O" + "~" + "riskClassification"
									+ "'> "
									+ item.irregularTranOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Irregular Transactions" + "~" + "C" + "~" + "Irregular Transactions" + "~" + "Closed Alert Count" + "~" + "##FFBF00"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Irregular Transactions" + "~" + "C" + "~" + "riskClassification"
									+ "'> "
									+ item.irregularTranCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Irregular Transactions" + "~" + "U" + "~" + "Irregular Transactions" + "~" + "Escalated Alert Count" + "~" + "##FFBF00"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Irregular Transactions" + "~" + "U" + "~" + "riskClassification"
									+ "'> "
									+ item.irregularTranEscalteCount
									+ "</td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Financial Exposure" + "~" + "O" + "~" + "Financial Exposure" + "~" + "Open Alert Count" + "~" + "#FF0000"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Financial Exposure" + "~" + "O" + "~" + "riskClassification"
									+ "'> "
									+ item.financialExpOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Financial Exposure" + "~" + "C" + "~" + "Financial Exposure" + "~" + "Closed Alert Count" + "~" + "#FF0000"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Financial Exposure" + "~" + "C" + "~" + "riskClassification"
									+ "'> "
									+ item.financialExpCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Financial Exposure" + "~" + "U" + "~" + "Financial Exposure" + "~" + "Escalated Alert Count" + "~" + "#FF0000"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Financial Exposure" + "~" + "U" + "~" + "riskClassification"
									+ "'> "
									+ item.financialExpEscalteCount
									+ "</td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Income Leakage" + "~" + "O" + "~" + "Income Leakage" + "~" + "Open Alert Count" + "~" + "#FF0000"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Income Leakage" + "~" + "O" + "~" + "riskClassification"
									+ "'> "
									+ item.incomeLeakageOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green accountAlertCountClassification2' id='branchId~"
									+ item.ruleId + "~" + obj.branchId + "~" + "Income Leakage" + "~" + "C" + "~" + "riskClassification"
									+ "'> "
									+ item.incomeLeakageCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange accountAlertCountClassification2' id='branchId~"
									+ item.ruleId + "~" + obj.branchId + "~" + "Income Leakage" + "~" + "U" + "~" + "riskClassification"
									+ "'> "
									+ item.incomeLeakageEscalteCount
									+ "</td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Regulatory Non-Compliance" + "~" + "O" + "~" + "Regulatory Non-Compliance" + "~" + "Open Alert Count" + "~" + "#FF0000"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Regulatory Non-Compliance" + "~" + "O" + "~" + "riskClassification"
									+ "'> "
									+ item.regulatoryComplOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Regulatory Non-Compliance" + "~" + "C" + "~" + "Regulatory Non-Compliance" + "~" + "Closed Alert Count" + "~" + "#FF0000"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Regulatory Non-Compliance" + "~" + "U" + "~" + "riskClassification"
									+ "'> "
									+ item.regulatoryComplCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange accountAlertCountClassification2' id='branchId~"
									//+ item.ruleId + "~" + "Regulatory Non-Compliance" + "~" + "U" + "~" + "Regulatory Non-Compliance" + "~" + "Escalated Alert Count" + "~" + "#FF0000"+ "~" + "riskClassification"
									+ item.ruleId + "~" + obj.branchId + "~" + "Regulatory Non-Compliance" + "~" + "U" + "~" + "riskClassification"
									+ "'> "
									+ item.regulatoryComplEscalteCount
									+ "</td>"



									+ "</tr>")
									.appendTo(
										".ruleWiseReportTableBodyRuleClassification");

						});


						$("#ruleRiskGraphBranch").hide();

						$("#branchWiseReportTableRuleRisk").hide();

						$("#ruleWiseReportTableRuleClassification").show();



						$("#branchWiseReportTableRuleClassification").show();


						//$("#pieChart2").hide();
						//$("#pieChart2").remove();


						$("#ruleWiseReportTableRuleClassification").DataTable({
							"columnDefs": [{
								orderable: false
							}],
							"responsive": false,
							"autoWidth": true,
							"searching": true,
							"fixedHeader": true,
							"bPaginate": false,
							"scrollX": true,
							/*"buttons": [{
								extend: 'excel',
								title: 'Region wise Alert Count ',
							}],*/
							"language": {
								"emptyTable": "No Data Available"
							},
						}).buttons().container().appendTo(
							'#ruleWiseReportTableRuleClassification_wrapper .col-md-6:eq(0)');

						/*var scrollPos = $("#ruleWiseReportTableRuleClassification").offset.top;
						$(window).scrollTop(scrollPos);*/

					}


					var totalODOpenCountBranch = 0;
					var totalODCloseCountBranch = 0;
					var totalODverificationCountBranch = 0;

					var totalITOpenCountBranch = 0;
					var totalITCloseCountBranch = 0;
					var totalITverificationCountBranch = 0;

					var totalFEOpenCountBranch = 0;
					var totalFECloseCountBranch = 0;
					var totalFEverificationCountBranch = 0;

					var totalILOpenCountBranch = 0;
					var totalILCloseCountBranch = 0;
					var totalILverificationCountBranch = 0;

					var totalRNOpenCountBranch = 0;
					var totalRNCloseCountBranch = 0;
					var totalRNverificationCountBranch = 0;

					var totalOTCClassificationBranch = 0;
					var totalVTCClassificationBranch = 0;


					obj.zoneAlertCountList.forEach(function(item) {

						totalODOpenCountBranch = (totalODOpenCountBranch + item.operationalOpenCount);
						totalODCloseCountBranch = (totalODCloseCountBranch + item.operationalCloseCount);
						totalODverificationCountBranch = (totalODverificationCountBranch + item.operationalEscalteCount);

						totalITOpenCountBranch = (totalITOpenCountBranch + item.irregularTranOpenCount);
						totalITCloseCountBranch = (totalITCloseCountBranch + item.irregularTranCloseCount);
						totalITverificationCountBranch = (totalITverificationCountBranch + item.irregularTranEscalteCount);

						totalFEOpenCountBranch = (totalFEOpenCountBranch + item.financialExpOpenCount);
						totalFECloseCountBranch = (totalFECloseCountBranch + item.financialExpCloseCount);
						totalFEverificationCountBranch = (totalFEverificationCountBranch + item.financialExpEscalteCount);

						totalILOpenCountBranch = (totalILOpenCountBranch + item.incomeLeakageOpenCount);
						totalILCloseCountBranch = (totalILCloseCountBranch + item.incomeLeakageCloseCount);
						totalILverificationCountBranch = (totalILverificationCountBranch + item.incomeLeakageEscalteCount);

						totalRNOpenCountBranch = (totalRNOpenCountBranch + item.regulatoryComplOpenCount);
						totalRNCloseCountBranch = (totalRNCloseCountBranch + item.regulatoryComplCloseCount);
						totalRNverificationCountBranch = (totalRNverificationCountBranch + item.regulatoryComplEscalteCount);

					});

					totalOTCClassificationBranch = (totalODOpenCountBranch + totalITOpenCountBranch + totalFEOpenCountBranch + totalILOpenCountBranch + totalRNOpenCountBranch);
					totalVTCClassificationBranch = (totalODverificationCountBranch + totalITverificationCountBranch + totalFEverificationCountBranch + totalILverificationCountBranch + totalRNverificationCountBranch);


					/*PIE CHART OD*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalODOpenCountBranch, totalODCloseCountBranch, totalODverificationCountBranch],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartODBranch').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHARTOD*/

					/*PIE CHART IT*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalITOpenCountBranch, totalITCloseCountBranch, totalITverificationCountBranch],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartITBranch').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHARTIT*/


					/*PIE CHART FE*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalFEOpenCountBranch, totalFECloseCountBranch, totalFEverificationCountBranch],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartFEBranch').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART FE*/


					/*PIE CHART IL*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalILOpenCountBranch, totalILCloseCountBranch, totalILverificationCountBranch],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartILBranch').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART IL*/

					/*PIE CHART RN*/

					var donutData = {
						labels: ['Open', 'Close', 'Verification'],
						datasets: [
							{
								data: [totalRNOpenCountBranch, totalRNCloseCountBranch, totalRNverificationCountBranch],
								backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartRNBranch').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART RN*/

					/*CLASSIFICATION WISE*/

					/*PIE CHART OPEN*/

					var donutData = {
						labels: ['Operational Deficiency', 'Irregular Transactions', 'Financial Exposure', 'Income Leakage', 'Regulatory Non-Compliance'],
						datasets: [
							{
								data: [totalODOpenCountBranch, totalITOpenCountBranch, totalFEOpenCountBranch, totalILOpenCountBranch, totalRNOpenCountBranch],
								backgroundColor: ['#ffd700', '#0a0', '#1b458b', '#08f', '#f80'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartOTCBranch').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART OPEN*/


					/*PIE CHART VERIFY*/

					var donutData = {
						labels: ['Operational Deficiency', 'Irregular Transactions', 'Financial Exposure', 'Income Leakage', 'Regulatory Non-Compliance'],
						datasets: [
							{
								data: [totalODverificationCountBranch, totalITverificationCountBranch, totalFEverificationCountBranch, totalILverificationCountBranch, totalRNverificationCountBranch],
								backgroundColor: ['#ffd700', '#0a0', '#1b458b', '#08f', '#f80'],
							}
						]
					}
					var pieChartCanvas = $('#mypieChartVTCBranch').get(0).getContext('2d')
					var pieData = donutData;
					var pieOptions = {
						maintainAspectRatio: false,
						responsive: true,
					}
					//Create pie or douhnut chart
					new Chart(pieChartCanvas, {
						type: 'pie',
						data: pieData,
						options: pieOptions
					})
					/*PIE CHART VERIFY*/

					/*CLASSIFICATION WISE*/

					$("#ruleClassificationGraphBranch").show();

				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

	}

})


// Dropdown for Region Filter
$(document).on("change", ".searchParamZonewise", function() {

	$('#branchRuleClassificationTableforZonal').hide();
	$('#ruleTable').hide();
	$('#accountTable').hide();


	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");

	var selectedFlag = null;
	if ($("#auditFlag").val() == "true") {
		selectedFlag = "CENTRAL";
	} else if ($("#zonalFlag").val() == "true") {
		selectedFlag = "ZONAL";
	} else if ($("#regionalFlag").val() == "true") {
		selectedFlag = "REGIONAL";
	} else if ($("#ruleFlag").val() == "true") {
		selectedFlag = "BRANCH";
	}

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

	$(".navTempZone").show();

	if (searchParam.includes('makerTimestamp~')) {
		//$("#hideDropDown").hide();
		//$("#searchcriteria").show();
	}
	else if (searchParam.includes('ruleRisk')) {


		//var pageValJson = "{\"selectedFlag\":" + "\"" + selectedFlag + "\"}";

		var pageValJson = "{\"startDate\": \"" + startDate + "\",\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"selectedFlag\": \"" + selectedFlag + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		//alert"pageValJson " + pageValJson);

		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				url: 'fetchRuleRiskParamWise',
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

					if ($("#zonalFlag").val() == "true") {
						$("#defaultZonal").hide();
						$("#rulePriorityZonal").show();
						$(".regionWiseCountBody").empty();
						$('#regionWiseReportTable').dataTable()
							.fnClearTable();
						$('#regionWiseReportTable').DataTable()
							.destroy();

						$("#regionWiseReportTable").hide();

						$(".regionWiseReportTableBodyRuleClassification").empty();
						$('#regionWiseReportTableRuleClassification').dataTable()
							.fnClearTable();
						$('#regionWiseReportTableRuleClassification').DataTable()
							.destroy();
						$("#regionWiseReportTableRuleClassification").hide();


						$('#zoneWiseReportTableRuleRisk').dataTable()
							.fnClearTable();
						$('#zoneWiseReportTableRuleRisk').DataTable()
							.destroy();
						$("#regionWiseReportTable").hide();
						$("#regionWiseReportTableRuleRisk").show();

						obj.zoneAlertCountList
							.forEach(function(item) {

								if (item.regionName)
									$(
										"<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-left'>"
										+ item.regionName
										+ "</td>"

										+ "<td class='text-right text-bold text-red'><a style='cursor: pointer;' class='text-bold text-red branchAlertCountPriorityWise2' id='branchId~"
										+ item.regionName + "~" + "H" + "~" + "O" + "~" + "High" + "~" + "Open Alert Count" + "~" + "#28A745" + "~" + "ruleRisk"
										+ "'> "
										+ item.highOpenCount
										+ "</a></td>"

										+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green branchAlertCountPriorityWise2' id='branchId~"
										+ item.regionName + "~" + "H" + "~" + "C" + "~" + "High" + "~" + "Closed Alert Count" + "~" + "#28A745" + "~" + "ruleRisk"
										+ "'> "
										+ item.highCloseCount
										+ "</a></td>"

										+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange branchAlertCountPriorityWise2' id='branchId~"
										+ item.regionName + "~" + "H" + "~" + "U" + "~" + "High" + "~" + "Escalated Alert Count" + "~" + "#28A745" + "~" + "ruleRisk"
										+ "'> "
										+ item.highEscalateCount
										+ " </a></td>"

										+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red branchAlertCountPriorityWise2' id='branchId~"
										+ item.regionName + "~" + "M" + "~" + "O" + "~" + "Medium" + "~" + "Open Alert Count" + "~" + "##FFBF00" + "~" + "ruleRisk"
										+ "'> "
										+ item.mediumOpenCount
										+ "</td>"


										+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green branchAlertCountPriorityWise2' id='branchId~"
										+ item.regionName + "~" + "M" + "~" + "C" + "~" + "Medium" + "~" + "Closed Alert Count" + "~" + "##FFBF00" + "~" + "ruleRisk"
										+ "'> "
										+ item.mediumCloseCount
										+ "</td>"

										+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange branchAlertCountPriorityWise2' id='branchId~"
										+ item.regionName + "~" + "M" + "~" + "U" + "~" + "Medium" + "~" + "Escalated Alert Count" + "~" + "##FFBF00" + "~" + "ruleRisk"
										+ "'> "
										+ item.mediumEscalateCount
										+ "</td>"


										+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red branchAlertCountPriorityWise2' id='branchId~"
										+ item.regionName + "~" + "L" + "~" + "O" + "~" + "Low" + "~" + "Open Alert Count" + "~" + "#FF0000" + "~" + "ruleRisk"
										+ "'> "
										+ item.lowOpenCount
										+ "</td>"


										+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green branchAlertCountPriorityWise2' id='branchId~"
										+ item.regionName + "~" + "L" + "~" + "C" + "~" + "Low" + "~" + "Closed Alert Count" + "~" + "#FF0000" + "~" + "ruleRisk"
										+ "'> "
										+ item.lowCloseCount
										+ "</td>"

										+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange branchAlertCountPriorityWise2' id='branchId~"
										+ item.regionName + "~" + "L" + "~" + "U" + "~" + "Low" + "~" + "Escalated Alert Count" + "~" + "#FF0000" + "~" + "ruleRisk"
										+ "'> "
										+ item.lowEscalateCount
										+ "</td>"


										+ "<td class='text-blue text-bold text-right'>"
										+ item.totalCount
										+ "</td>"



										+ "</tr>")
										.appendTo(
											".regionWiseCountBodyRuleRisk");

							});


						$("#pieChart2").hide();
						$("#pieChart2").remove();


						$("#regionWiseReportTableRuleRisk").show();
						$("#regionWiseReportTableRuleClassification").hide();

						$("#regionWiseReportTableRuleRisk").DataTable({
							"columnDefs": [{
								orderable: false
							}],
							"responsive": false,
							"autoWidth": true,
							"searching": false,
							"fixedHeader": true,
							"bPaginate": false,

							"language": {
								"emptyTable": "No Data Available"
							},
						}).buttons().container().appendTo(
							'#regionWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

						var scrollPos = $("#regionWiseReportTableRuleRisk").offset.top;
						$(window).scrollTop(scrollPos);


						$("#ruleClassificationGraphZone").hide();

						var totalOpenCountZone = 0;
						var totalCloseCountZone = 0;
						var totalEscalateCountZone = 0;

						var totalMedOpenCountZone = 0;
						var totalMedCloseCountZone = 0;
						var totalMedEscalateCountZone = 0;

						var totalLowOpenCountZone = 0;
						var totalLowCloseCountZone = 0;
						var totalLowEscalateCountZone = 0;


						obj.zoneAlertCountList
							.forEach(function(item) {

								totalOpenCountZone = (totalOpenCountZone + item.highOpenCount);

								totalCloseCountZone = (totalCloseCountZone + item.highCloseCount);

								totalEscalateCountZone = (totalEscalateCountZone + item.highEscalateCount);

								totalMedOpenCountZone = (totalMedOpenCountZone + item.mediumOpenCount);

								totalMedCloseCountZone = (totalMedCloseCountZone + item.mediumCloseCount);

								totalMedEscalateCountZone = (totalMedEscalateCountZone + item.mediumEscalateCount);

								totalLowOpenCountZone = (totalLowOpenCountZone + item.lowOpenCount);

								totalLowCloseCountZone = (totalLowCloseCountZone + item.lowCloseCount);

								totalLowEscalateCountZone = (totalLowEscalateCountZone + item.lowEscalateCount);


							});
						/*alert("totalOpenCount = " + totalOpenCount);
						alert("totalCloseCount = " + totalCloseCount);
						alert("totalEscalateCount = " + totalEscalateCount);*/

						/*HIGH*/
						/*PIE CHART*/

						var donutData = {
							labels: ['Open', 'Close', 'Verification'],
							datasets: [
								{
									data: [totalOpenCountZone, totalCloseCountZone, totalEscalateCountZone],
									backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
								}
							]
						}
						var pieChartCanvas = $('#mypieChartZone').get(0).getContext('2d')
						var pieData = donutData;
						var pieOptions = {
							maintainAspectRatio: false,
							responsive: true,
						}
						//Create pie or douhnut chart
						new Chart(pieChartCanvas, {
							type: 'pie',
							data: pieData,
							options: pieOptions
						})
						/*PIE CHART*/


						/*HIGH*/

						/*MEDIUM*/

						/*PIE CHART*/

						var donutData = {
							labels: ['Open', 'Close', 'Verification'],
							datasets: [
								{
									data: [totalMedOpenCountZone, totalMedCloseCountZone, totalMedEscalateCountZone],
									backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
								}
							]
						}
						var pieChartCanvas = $('#mypieChartMedZone').get(0).getContext('2d')
						var pieData = donutData;
						var pieOptions = {
							maintainAspectRatio: false,
							responsive: true,
						}
						//Create pie or douhnut chart
						new Chart(pieChartCanvas, {
							type: 'pie',
							data: pieData,
							options: pieOptions
						})
						/*PIE CHART*/

						/*MEDIUM*/

						/*LOW*/
						/*PIE CHART*/

						var donutData = {
							labels: ['Open', 'Close', 'Verification'],
							datasets: [
								{
									data: [totalLowOpenCountZone, totalLowCloseCountZone, totalLowEscalateCountZone],
									backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
								}
							]
						}
						var pieChartCanvas = $('#mypieChartLowZone').get(0).getContext('2d')
						var pieData = donutData;
						var pieOptions = {
							maintainAspectRatio: false,
							responsive: true,
						}
						//Create pie or douhnut chart
						new Chart(pieChartCanvas, {
							type: 'pie',
							data: pieData,
							options: pieOptions
						})
						/*PIE CHART*/

						/*LOW*/

						$("#ruleRiskGraphZone").show();



					}


				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

	}
	else {


		//var pageValJson = "{\"selectedFlag\":" + "\"" + selectedFlag + "\"}";

		/*var pageValJson = "{\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"selectedFlag\": \"" + selectedFlag + "\" \n" +
			"}";*/

		var pageValJson = "{\"startDate\": \"" + startDate + "\",\n" +
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"selectedFlag\": \"" + selectedFlag + "\",\n" +
			"    \"endDate\":\"" + endDate + "\"\n" + "}";

		//alert"pageValJson " + pageValJson);


		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				// fetchRuleRiskParamWise
				url: 'fetchRuleClassificationParamWise',
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


					if ($("#zonalFlag").val() == "true") {

						$("#defaultZonal").hide();
						$("#rulePriorityZonal").show();
						$(".regionWiseCountBody").empty();
						$('#regionWiseReportTable').dataTable()
							.fnClearTable();
						$('#regionWiseReportTable').DataTable()
							.destroy();

						$("#regionWiseReportTable").hide();

						$(".regionWiseReportTableBodyRuleClassification").empty();
						$('#regionWiseReportTableRuleClassification').dataTable()
							.fnClearTable();
						$('#regionWiseReportTableRuleClassification').DataTable()
							.destroy();
						$("#regionWiseReportTableRuleClassification").hide();

						$('#zoneWiseReportTableRuleRisk').dataTable()
							.fnClearTable();
						$('#zoneWiseReportTableRuleRisk').DataTable()
							.destroy();
						$("#regionWiseReportTable").hide();
						$("#regionWiseReportTableRuleRisk").hide();
						$("#regionWiseReportTableRuleClassification").show();

						obj.zoneAlertCountList.forEach(function(item) {
							if (item.regionName)
								$(

									"<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-left'>"
									+ item.regionName
									+ "</td>"

									+ "<td class='text-right text-bold text-red'><a style='cursor: pointer;' class='text-bold text-red branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Operational Deficiency" + "~" + "O" + "~" + "Operational Deficiency" + "~" + "Open Alert Count" + "~" + "#28A745" + "~" + "riskClassification"
									+ "'> "
									+ item.operationalOpenCount
									+ "</a></td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Operational Deficiency" + "~" + "C" + "~" + "Operational Deficiency" + "~" + "Closed Alert Count" + "~" + "#28A745" + "~" + "riskClassification"
									+ "'> "
									+ item.operationalCloseCount
									+ "</a></td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Operational Deficiency" + "~" + "U" + "~" + "Operational Deficiency" + "~" + "Escalated Alert Count" + "~" + "#28A745" + "~" + "riskClassification"
									+ "'> "
									+ item.operationalEscalteCount
									+ " </a></td>"




									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Irregular Transactions" + "~" + "O" + "~" + "Irregular Transactions" + "~" + "Open Alert Count" + "~" + "##FFBF00" + "~" + "riskClassification"
									+ "'> "
									+ item.irregularTranOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Irregular Transactions" + "~" + "C" + "~" + "Irregular Transactions" + "~" + "Closed Alert Count" + "~" + "##FFBF00" + "~" + "riskClassification"
									+ "'> "
									+ item.irregularTranCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Irregular Transactions" + "~" + "U" + "~" + "Irregular Transactions" + "~" + "Escalated Alert Count" + "~" + "##FFBF00" + "~" + "riskClassification"
									+ "'> "
									+ item.irregularTranEscalteCount
									+ "</td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Financial Exposure" + "~" + "O" + "~" + "Financial Exposure" + "~" + "Open Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> "
									+ item.financialExpOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Financial Exposure" + "~" + "C" + "~" + "Financial Exposure" + "~" + "Closed Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> "
									+ item.financialExpCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Financial Exposure" + "~" + "U" + "~" + "Financial Exposure" + "~" + "Escalated Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> "
									+ item.financialExpEscalteCount
									+ "</td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Income Leakage" + "~" + "O" + "~" + "Income Leakage" + "~" + "Open Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> "
									+ item.incomeLeakageOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Income Leakage" + "~" + "C" + "~" + "Income Leakage" + "~" + "Closed Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> "
									+ item.incomeLeakageCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Income Leakage" + "~" + "U" + "~" + "Income Leakage" + "~" + "Escalated Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> "
									+ item.incomeLeakageEscalteCount
									+ "</td>"


									+ "<td class='text-bold text-red text-right'><a style='cursor: pointer;' class='text-bold text-red branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Regulatory Non-Compliance" + "~" + "O" + "~" + "Regulatory Non-Compliance" + "~" + "Open Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> "
									+ item.regulatoryComplOpenCount
									+ "</td>"
									+ "<td class='text-bold text-green text-right'><a style='cursor: pointer;' class='text-bold text-green branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Regulatory Non-Compliance" + "~" + "C" + "~" + "Regulatory Non-Compliance" + "~" + "Closed Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> "
									+ item.regulatoryComplCloseCount
									+ "</td>"
									+ "<td class='text-bold text-orange text-right'><a style='cursor: pointer;' class='text-bold text-orange branchAlertCountClassificationWise2' id='branchId~"
									+ item.regionName + "~" + "Regulatory Non-Compliance" + "~" + "U" + "~" + "Regulatory Non-Compliance" + "~" + "Escalated Alert Count" + "~" + "#FF0000" + "~" + "riskClassification"
									+ "'> "
									+ item.regulatoryComplEscalteCount
									+ "</td>"



									+ "</tr>")
									.appendTo(
										".regionWiseReportTableBodyRuleClassification");

						});

						$("#pieChart2").hide();
						$("#pieChart2").remove();
						$("#ruleRiskGraphZone").hide();
						$("#regionWiseReportTableRuleRisk").hide();



						$("#regionWiseReportTableRuleClassification").DataTable({
							"columnDefs": [{
								orderable: false
							}],
							"responsive": false,
							"autoWidth": true,
							"searching": false,
							"fixedHeader": true,
							"bPaginate": false,
							"scrollX": true,
							"language": {
								"emptyTable": "No Data Available"
							},
						}).buttons().container().appendTo(
							'#regionWiseReportTableRuleClassification_wrapper .col-md-6:eq(0)');

						var scrollPos = $("#regionWiseReportTableRuleClassification").offset.top;
						$(window).scrollTop(scrollPos);

						$("#regionWiseReportTableRuleRisk").hide();
						$("#regionWiseReportTableRuleClassification").show();

						$("#regionWiseReportTableRuleClassification").show();

						var totalODOpenCountZone = 0;
						var totalODCloseCountZone = 0;
						var totalODverificationCountZone = 0;

						var totalITOpenCountZone = 0;
						var totalITCloseCountZone = 0;
						var totalITverificationCountZone = 0;

						var totalFEOpenCountZone = 0;
						var totalFECloseCountZone = 0;
						var totalFEverificationCountZone = 0;

						var totalILOpenCountZone = 0;
						var totalILCloseCountZone = 0;
						var totalILverificationCountZone = 0;

						var totalRNOpenCountZone = 0;
						var totalRNCloseCountZone = 0;
						var totalRNverificationCountZone = 0;

						var totalOTCClassificationZone = 0;
						var totalVTCClassificationZone = 0;


						obj.zoneAlertCountList.forEach(function(item) {

							totalODOpenCountZone = (totalODOpenCountZone + item.operationalOpenCount);
							totalODCloseCountZone = (totalODCloseCountZone + item.operationalCloseCount);
							totalODverificationCountZone = (totalODverificationCountZone + item.operationalEscalteCount);

							totalITOpenCountZone = (totalITOpenCountZone + item.irregularTranOpenCount);
							totalITCloseCountZone = (totalITCloseCountZone + item.irregularTranCloseCount);
							totalITverificationCountZone = (totalITverificationCountZone + item.irregularTranEscalteCount);

							totalFEOpenCountZone = (totalFEOpenCountZone + item.financialExpOpenCount);
							totalFECloseCountZone = (totalFECloseCountZone + item.financialExpCloseCount);
							totalFEverificationCountZone = (totalFEverificationCountZone + item.financialExpEscalteCount);

							totalILOpenCountZone = (totalILOpenCountZone + item.incomeLeakageOpenCount);
							totalILCloseCountZone = (totalILCloseCountZone + item.incomeLeakageCloseCount);
							totalILverificationCountZone = (totalILverificationCountZone + item.incomeLeakageEscalteCount);

							totalRNOpenCountZone = (totalRNOpenCountZone + item.regulatoryComplOpenCount);
							totalRNCloseCountZone = (totalRNCloseCountZone + item.regulatoryComplCloseCount);
							totalRNverificationCountZone = (totalRNverificationCountZone + item.regulatoryComplEscalteCount);

						});

						totalOTCClassificationZone = (totalODOpenCountZone + totalITOpenCountZone + totalFEOpenCountZone + totalILOpenCountZone + totalRNOpenCountZone);
						totalVTCClassificationZone = (totalODverificationCountZone + totalITverificationCountZone + totalFEverificationCountZone + totalILverificationCountZone + totalRNverificationCountZone);



						/*PIE CHART OD*/

						var donutData = {
							labels: ['Open', 'Close', 'Verification'],
							datasets: [
								{
									data: [totalODOpenCountZone, totalODCloseCountZone, totalODverificationCountZone],
									backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
								}
							]
						}
						var pieChartCanvas = $('#mypieChartODZone').get(0).getContext('2d')
						var pieData = donutData;
						var pieOptions = {
							maintainAspectRatio: false,
							responsive: true,
						}
						//Create pie or douhnut chart
						new Chart(pieChartCanvas, {
							type: 'pie',
							data: pieData,
							options: pieOptions
						})
						/*PIE CHARTOD*/


						/*PIE CHART IT*/

						var donutData = {
							labels: ['Open', 'Close', 'Verification'],
							datasets: [
								{
									data: [totalITOpenCountZone, totalITCloseCountZone, totalITverificationCountZone],
									backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
								}
							]
						}
						var pieChartCanvas = $('#mypieChartITZone').get(0).getContext('2d')
						var pieData = donutData;
						var pieOptions = {
							maintainAspectRatio: false,
							responsive: true,
						}
						//Create pie or douhnut chart
						new Chart(pieChartCanvas, {
							type: 'pie',
							data: pieData,
							options: pieOptions
						})
						/*PIE CHARTIT*/

						/*PIE CHART FE*/

						var donutData = {
							labels: ['Open', 'Close', 'Verification'],
							datasets: [
								{
									data: [totalFEOpenCountZone, totalFECloseCountZone, totalFEverificationCountZone],
									backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
								}
							]
						}
						var pieChartCanvas = $('#mypieChartFEZone').get(0).getContext('2d')
						var pieData = donutData;
						var pieOptions = {
							maintainAspectRatio: false,
							responsive: true,
						}
						//Create pie or douhnut chart
						new Chart(pieChartCanvas, {
							type: 'pie',
							data: pieData,
							options: pieOptions
						})
						/*PIE CHART FE*/

						/*PIE CHART IL*/

						var donutData = {
							labels: ['Open', 'Close', 'Verification'],
							datasets: [
								{
									data: [totalILOpenCountZone, totalILCloseCountZone, totalILverificationCountZone],
									backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
								}
							]
						}
						var pieChartCanvas = $('#mypieChartILZone').get(0).getContext('2d')
						var pieData = donutData;
						var pieOptions = {
							maintainAspectRatio: false,
							responsive: true,
						}
						//Create pie or douhnut chart
						new Chart(pieChartCanvas, {
							type: 'pie',
							data: pieData,
							options: pieOptions
						})
						/*PIE CHART IL*/


						/*PIE CHART RN*/

						var donutData = {
							labels: ['Open', 'Close', 'Verification'],
							datasets: [
								{
									data: [totalRNOpenCountZone, totalRNCloseCountZone, totalRNverificationCountZone],
									backgroundColor: ['#E14023', '#28A745', '#FFBF00'],
								}
							]
						}
						var pieChartCanvas = $('#mypieChartRNZone').get(0).getContext('2d')
						var pieData = donutData;
						var pieOptions = {
							maintainAspectRatio: false,
							responsive: true,
						}
						//Create pie or douhnut chart
						new Chart(pieChartCanvas, {
							type: 'pie',
							data: pieData,
							options: pieOptions
						})
						/*PIE CHART RN*/


						/*CLASSIFICATION WISE*/

						/*PIE CHART OPEN*/

						var donutData = {
							labels: ['Operational Deficiency', 'Irregular Transactions', 'Financial Exposure', 'Income Leakage', 'Regulatory Non-Compliance'],
							datasets: [
								{
									data: [totalODOpenCountZone, totalITOpenCountZone, totalFEOpenCountZone, totalILOpenCountZone, totalRNOpenCountZone],
									backgroundColor: ['#ffd700', '#0a0', '#1b458b', '#08f', '#f80'],
								}
							]
						}
						var pieChartCanvas = $('#mypieChartOTCZone').get(0).getContext('2d');
						var pieData = donutData;
						var pieOptions = {
							maintainAspectRatio: false,
							responsive: true,
						}
						//Create pie or douhnut chart
						new Chart(pieChartCanvas, {
							type: 'pie',
							data: pieData,
							options: pieOptions
						})
						/*PIE CHART OPEN*/


						/*PIE CHART VERIFY*/

						var donutData = {
							labels: ['Operational Deficiency', 'Irregular Transactions', 'Financial Exposure', 'Income Leakage', 'Regulatory Non-Compliance'],
							datasets: [
								{
									data: [totalODverificationCountZone, totalITverificationCountZone, totalFEverificationCountZone, totalILverificationCountZone, totalRNverificationCountZone],
									backgroundColor: ['#ffd700', '#0a0', '#1b458b', '#08f', '#f80'],
								}
							]
						}
						var pieChartCanvas = $('#mypieChartVTCZone').get(0).getContext('2d')
						var pieData = donutData;
						var pieOptions = {
							maintainAspectRatio: false,
							responsive: true,
						}
						//Create pie or douhnut chart
						new Chart(pieChartCanvas, {
							type: 'pie',
							data: pieData,
							options: pieOptions
						})
						/*PIE CHART VERIFY*/

						/*CLASSIFICATION WISE*/



						$("#ruleClassificationGraphZone").show();





					}
				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

	}

})


// branchAlertCountPriorityWise2
$(document).on("click", ".branchAlertCountPriorityWise2", function() {
	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('~');
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		var ruleRisk = null;
		var status = null;
		var searchParam = null;
		var rulePriority = null;
		$('#ruleTable').hide();
		$('#accountTable').hide();




		if (zoneNameList[2] === null || zoneNameList[2] === '' || zoneNameList[2] === undefined) {

		} else {
			ruleRisk = zoneNameList[2];
			status = zoneNameList[3];
			if (zoneNameList[7] == "ruleRisk") {
				searchParam = "ruleRisk";
				if (ruleRisk == 'H') {
					rulePriority = "High";
					$("#branchWiseReportTableRuleRiskHeading").text("High");
				} else if (ruleRisk == 'M') {
					rulePriority = "Medium";
					$("#branchWiseReportTableRuleRiskHeading").text("Medium");
				} else if (ruleRisk == 'L') {
					rulePriority = "Low";
					$("#branchWiseReportTableRuleRiskHeading").text("Low");
				}


			} else if (zoneNameList[7] == "riskClassification") {
				searchParam = "riskClassification";
				if (ruleRisk == 'Operational Deficiency') {

					$("#branchWiseReportTableRuleRiskHeading").text("Operational Deficiency");
				} else if (ruleRisk == 'Irregular Transactions') {
					$("#branchWiseReportTableRuleRiskHeading").text("Irregular Transactions");
				} else if (ruleRisk == 'Financial Exposure') {
					$("#branchWiseReportTableRuleRiskHeading").text("Financial Exposure");
				} else if (ruleRisk == 'Income Leakage') {
					$("#branchWiseReportTableRuleRiskHeading").text("Income Leakage");
				} else if (ruleRisk == 'Regulatory Non-Compliance') {
					$("#branchWiseReportTableRuleRiskHeading").text("Regulatory Non-Compliance");
				}
			}


		}

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
			"    \"searchParam\": \"" + searchParam + "\",\n" +
			"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
			"    \"status\": \"" + status + "\",\n" +

			"    \"endDate\":\"" + endDate + "\"\n" + "}";


		//alert"pagevalJson " + pagevalJson);
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
						$('#branchTable').focus();
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);
				//alert"Object " + obj);

				$("#regionIdForZonal").text(zoneNameList[1]);
				$('#branchRuleRiskTableforZonal').css("display", "");

				/*$(".branchWiseCountBody").empty();
				$('#branchWiseReportTable').dataTable().fnClearTable();
				$('#branchWiseReportTable').DataTable().destroy();
				$('#branchWiseReportTable').hide();
	
				$(".branchWiseCountBodyRuleRisk").empty();
				$('#branchWiseReportTableRuleRisk').dataTable().fnClearTable();
				$('#branchWiseReportTableRuleRisk').DataTable().destroy();
				$('#branchWiseReportTableRuleRisk').remove();
				$('#branchWiseReportTableRuleRisk').hide();
	
				// branchWiseReportTableRuleRiskForZonalOfc
				$("#branchWiseCountBodyRuleRiskForZonalOfc").empty();
				$('#branchWiseReportTableRuleRiskForZonalOfc').dataTable().fnClearTable();
				$('#branchWiseReportTableRuleRiskForZonalOfc').DataTable().destroy();
				$('#branchWiseReportTableRuleRiskForZonalOfc').show();*/

				// branchWiseReportTableRuleRiskForZonalOfc
				$(".branchWiseCountBodyRuleRiskForZonalOfc").empty();
				$('#branchWiseReportTableRuleRiskForZonalOfc').dataTable().fnClearTable();
				$('#branchWiseReportTableRuleRiskForZonalOfc').DataTable().destroy();


				obj.branchAlertCountList.forEach(function(item) {
					$(
						"<tr>"

						+ "<td>"
						+ item.branchId
						+ "</a></td>"

						+ "<td>"
						+ item.branchName
						+ "</a></td>"

						/*+ "<td>"
						+ item.statusWiseCount
						+ "</td>"*/

						+ "<td style='cursor: pointer;' class='text-center text-bold text-blue ruleAlertCountClassificationWise' id='branchId~" + item.branchId + "~" + zoneNameList[2] + "~" + zoneNameList[3] + "~" + searchParam + "' name='branchId'><a>"
						+ item.statusWiseCount
						+ "</a></td>"

						+ "</tr>")
						.appendTo("#branchWiseCountBodyRuleRiskForZonalOfc");

				});


				$(window).scrollTop($('#branchWiseReportTableRuleRiskForZonalOfc').offset.top);

				$("#branchWiseReportTableRuleRiskForZonalOfc").DataTable({
					"columnDefs": [{
						//orderable: false
					}],
					"order": [[2, 'desc']],
					"responsive": false,
					"autoWidth": true,
					"searching": false,
					"fixedHeader": true,
					"buttons": [{

						extend: 'excel',
						title: 'Branch wise Alert Count ',

					},
					{

						extend: 'pdf',
						title: 'Branch wise Alert Count ',

					}
					],
					"language": {
						"emptyTable": "No Data Available"
					},
				}).buttons().container().appendTo(
					'#branchWiseReportTableRuleRiskForZonalOfc_wrapper .col-md-6:eq(0)');

				if (status == 'O') {
					$("#branchWiseReportTableRuleRiskAlertHeadingForZonalOfc").text("Open Alert Count for " + rulePriority + " Rule Priority");
				} else if (status == 'C') {
					$("#branchWiseReportTableRuleRiskAlertHeadingForZonalOfc").text("Closed Alert Count for " + rulePriority + " Rule Priority");
				} else if (status == 'U') {
					$("#branchWiseReportTableRuleRiskAlertHeadingForZonalOfc").text("Escalte Alert Count for " + rulePriority + " Rule Priority");
				}


			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.success('Some Error Occured');
			}


		})
	}
});


// viewRegion

$(document).on("click", ".viewRegion", function() {
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

	var searchParam = "ruleRisk";
	var ruleRisk = zoneNameList[2];
	var status = zoneNameList[3];
	/*var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
		+ "    \"searchParam\":\"" + searchParam + "\",\n" +
		+ "    \"searchRuleRisk\":\"" + ruleRisk + "\",\n" +
		+ "    \"status\":\"" + status + "\",\n" +
		"    \"endDate\":\"" + endDate + "\"\n" + "}";*/

	const str2 = zoneNameList[1].charAt(0).toUpperCase() + zoneNameList[1].slice(1);

	var pagevalJson = "{\n" +
		"    \"startDate\": \"" + startDate + "\",\n" +
		"    \"searchParam\": \"" + searchParam + "\",\n" +
		"    \"searchRuleRisk\": \"" + ruleRisk + "\",\n" +
		"    \"status\": \"" + status + "\",\n" +
		"    \"zoneId\":\"" + str2 + "\",\n" +
		"    \"endDate\": \"" + endDate + "\"\n" +
		"}";


	//alert"pagevalJson " + pagevalJson);

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
			// #regionPie
			//$('#regionTable').get(0).focus();
			//$(".regionCardZone").focus();
			/*var scrollPos = $("#regionCardZone").offset.top;
			$(window).scrollTop(scrollPos);*/
			$(document).on("focus", "#regionCardZone", function() {

			});

			$('#zoneId').text(obj.zoneId);
			$('#regionTable').css("display", "");
			$(".regionWiseCountBodyRuleRisk").empty();
			$('#regionWiseReportTableRuleRisk').dataTable().fnClearTable();
			$('#regionWiseReportTableRuleRisk').DataTable().destroy();

			$('#regionWiseReportTable').dataTable()
				.fnClearTable();
			$('#regionWiseReportTable').DataTable()
				.destroy();
			$("#regionWiseReportTable").hide();

			$("#regionWiseReportTableRuleRiskheding").text(zoneNameList[4]);
			$("#regionWiseReportTableRuleRiskAlertheding").text(zoneNameList[5]);


			//branchWiseReportTableRuleRiskHeading
			//branchWiseReportTableRuleRiskAlertHeading

			obj.regionAlertCountList.forEach(function(item) {


				$(
					"<tr>"

					+ "<td class='text-capitalize'>"
					+ item.regionName
					+ "</a></td>"

					+ "<td style='cursor: pointer;' class='text-center text-bold text-blue branchAlertCount' id='regionName~" + item.regionName + "~" + ruleRisk + "~" + status + "~" + searchParam + "' name='regionName'><a style='cursor: pointer;'>"
					+ item.statusWiseCount
					+ "</a></td>"

					+ "</tr>")
					.appendTo("#regionWiseCountBodyRuleRisk");

			});
			$("#regionWiseReportTableRuleRisk").DataTable({
				"columnDefs": [{
					//orderable: false
				}],
				"order": [[1, 'desc']],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"bPaginate": false,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": [
					{
						extend: 'excel',
						title: 'Region wise Rule Priority Report ',
					},
					{
						extend: 'pdf',
						title: 'Region wise Rule Priority Report ',
					},
				]
			}).buttons().container().appendTo(
				'#regionWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

			$("#regionWiseReportTableRuleRisk").show();
			var pieData = obj.regionAlertCount;

			$('#regionPie').remove();
			$('#pie-app-chart').empty();
			$('#pie-app-chart').append('<canvas id="regionPie" style="min-height: 250px; height: 300px; max-height: 300px; max-width: 100%;"></canvas>');


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
				maintainAspectRatio: false,
				responsive: true,
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
				.success('Some Error Occured');
		}
	});
});


/* View Region Classification Wise */
// viewRegion

$(document).on("click", ".viewRegionClassificationWise", function() {

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

	var searchParam = "riskClassification";
	var riskClassification = zoneNameList[2];
	var status = zoneNameList[3];
	/*var pagevalJson = "{\"startDate\": \"" + startDate + "\",\n"
		+ "    \"searchParam\":\"" + searchParam + "\",\n" +
		+ "    \"searchRuleRisk\":\"" + ruleRisk + "\",\n" +
		+ "    \"status\":\"" + status + "\",\n" +
		"    \"endDate\":\"" + endDate + "\"\n" + "}";*/

	const str2 = zoneNameList[1].charAt(0).toUpperCase() + zoneNameList[1].slice(1);

	var pagevalJson = "{\n" +
		"    \"startDate\": \"" + startDate + "\",\n" +
		"    \"searchParam\": \"" + searchParam + "\",\n" +
		"    \"searchRuleRisk\": \"" + riskClassification + "\",\n" +
		"    \"status\": \"" + status + "\",\n" +
		"    \"zoneId\":\"" + str2 + "\",\n" +
		"    \"endDate\": \"" + endDate + "\"\n" +
		"}";



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
			console.log(obj);
			// #regionPie
			//$('#regionTable').get(0).focus();
			//$(".regionCardZone").focus();
			/*var scrollPos = $("#regionCardZone").offset.top;
			$(window).scrollTop(scrollPos);*/
			$(document).on("focus", "#regionCardZone", function() {

			});

			$('#zoneId').text(obj.zoneId);
			$('#regionTable').css("display", "");
			$(".regionWiseCountBodyRuleRisk").empty();
			$('#regionWiseReportTableRuleRisk').dataTable().fnClearTable();
			$('#regionWiseReportTableRuleRisk').DataTable().destroy();

			$('#regionWiseReportTable').dataTable()
				.fnClearTable();
			$('#regionWiseReportTable').DataTable()
				.destroy();
			$("#regionWiseReportTable").hide();

			$("#regionWiseReportTableRuleRiskheding").text(zoneNameList[4]);
			$("#regionWiseReportTableRuleRiskAlertheding").text(zoneNameList[5]);


			//branchWiseReportTableRuleRiskHeading
			//branchWiseReportTableRuleRiskAlertHeading

			obj.regionAlertCountList.forEach(function(item) {


				$(
					"<tr>"

					+ "<td class='text-capitalize'>"
					+ item.regionName
					+ "</a></td>"

					+ "<td style='cursor: pointer;' class='text-center text-bold text-blue branchAlertCountClassificationWise' id='regionName~" + item.regionName + "~" + riskClassification + "~" + status + "~" + searchParam + "' name='regionName'><a style='cursor: pointer;'>"
					+ item.statusWiseCount
					+ "</a></td>"

					/*+ "<td>"
					+ item.closeCount
					+ "</td>"
	
					+ "<td>"
					+ item.escalateCount
					+ "</td>"
	
					+ "<td class='text-center text-bold text-blue branchAlertCount' id='regionName~" + item.regionName + "' name='regionName'><a href='#'>"
					+ item.totalCount
					+ "</a></td>"*/

					+ "</tr>")
					.appendTo("#regionWiseCountBodyRuleRisk");

			});
			$("#regionWiseReportTableRuleRisk").DataTable({
				"columnDefs": [{
					//orderable: false
				}],
				"order": [[1, 'desc']],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"bPaginate": false,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": [
					{
						extend: 'excel',
						title: 'Region wise Report ',
					},
					{
						extend: 'pdf',
						title: 'Region wise Report ',
					},
				]
			}).buttons().container().appendTo(
				'#regionWiseReportTableRuleRisk_wrapper .col-md-6:eq(0)');

			$("#regionWiseReportTableRuleRisk").show();
			var pieData = obj.regionAlertCount;
			console.log(pieData);

			$('#regionPie').remove();
			//$('#regionPie').destroy();
			$('#pie-app-chart').empty();
			$('#pie-app-chart').append('<canvas id="regionPie" style="min-height: 250px; height: 300px; max-height: 300px; max-width: 100%;"></canvas>');


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


			console.log('checkLableArr ', checkLableArr);
			console.log('dataCountArr ', dataCountArr);
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
				maintainAspectRatio: false,
				responsive: true,
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
				.success('Some Error Occured');
		}
	});
});

/*VIEW ALERT DETAIL MODAL*/
$(document).on("click", ".viewAlertModal", function() {

	var alertId = $(this).attr('id');
	var pageValJson = "{\"alertId\":" + "\"" + alertId
		+ "\"}";

	////alert"pageValJson "+ pageValJson);
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

			console.log("Object " + obj.alertCat);
			console.log("Object " + obj.ruleRisk);
			console.log("Object " + obj.branchId);
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
			$('#zone').val(obj.zone);
			$('#generatedTime').val(obj.generatedTime);
			$('#custVertical').val(obj.custVertical);
			$('#actRoleId').val(obj.actRoleId);
			$('#ruleClassification').val(obj.ruleClassification);



			$('#viewAlertmodal').modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.success('Some Error Occured');
		}
	});

});

/*VIEW ALERT DETAIL MODAL*/

$('#downloadPie').click(function(event) {

	var table = $('#rcsaGraphTable').DataTable();
	table.destroy();
	window.print();
	$("#rcsaGraphTable").DataTable({
		"columnDefs": [{
			orderable: false,

		}],

		//"order" : [ 0, "asc" ],
		"lengthMenu": [50, 100],
		"responsive": false,
		"autoWidth": false,
		"searching": true,
		"fixedHeader": true,

		"language": {
			"emptyTable": "No Data Available"
		},
		"buttons": [{

			extend: 'excel',
			title: 'RCSA - Residual Assessment ' + assessmentDate,

		}]
	}).buttons().container().appendTo(
		'#rcsaGraphTable_wrapper .col-md-6:eq(0)');

});


/*VIEW COMMENTS*/


$('#commentsTablink').click(function() {

	var alertId = $("#alertId").val();

	var pageValJson = "{\"moduleId\":"
		+ "\"" + alertId + "\"}";

	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchCommentHistory',
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
					document.getElementById('load').style.visibility = "hidden";
				}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			$(".timeDivBlock").empty();
			//if (obj.length > 0) {
			var data = obj.commentList;
			data.forEach(function(items) {

				$(
					"<p class='test'><div class='time-label'><span class='bg-success'>"
					+ items.commentTimeStamp
					+ "</span></div>"
					+ "<div><i class='fas fa-comments bg-warning'></i>"
					+ "<div class='timeline-item'>"
					+ "<h3 class='timeline-header text-capitalize'><a href='#'>"
					+ items.commentBy
					+ " "
					+ " </a> Comment: "
					+ "</h3>"
					+ "<div class='timeline-body'>"
					+ items.comment
					+ "</div>"
					+ "<div class='timeline-item-additional'>"
					+ "<div class='timelineAdd-body'>"
					+ items.additionalComments
					+ "</div>"
					+ "</div>"
					+ "</div>"
					+ "</p>")
					.appendTo(
						".timeDivBlock");
			});
			$("<div> <i class='far fa-clock bg-gray'></i> </div>").appendTo(".timeDivBlock");
			$('#commentsTablink').css('class', 'border');
			$('#commentsTablink').css('display', '');
			//$('#commentsTablink').click();
			//}
			$('#commentModal').modal('show');
			$('#viewAlertmodal').modal('show');
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
/*VIEW COMMENTS*/



$(document).ready(function() {
	/*$('#pieChartRowMed').hide();
	$('#pieChartRowLow').hide();*/
	$('#pieChartRowOTCG').hide();
	$('#pieChartRowVTCG').hide();
	$('#pieChartRowOTCGBranch').hide();
	$('#pieChartRowVTCGBranch').hide();
	$('#pieChartRowOTCGZone').hide();
	$('#pieChartRowVTCGZone').hide();


	/*$('#pieChartRowITG').hide();
	$('#pieChartRowFEG').hide();
	$('#pieChartRowILG').hide();
	$('#pieChartRowRNG').hide();*/

	$(".eventWise").change(function() {

		if ($('.eventWise :selected').val() == "High") {
			$('#pieChartRow').show();
			$('#pieChartRowMed').hide();
			$('#pieChartRowLow').hide();

		} else if ($('.eventWise :selected').val() == "Medium") {
			$('#pieChartRow').hide();
			$('#pieChartRowMed').show();
			$('#pieChartRowLow').hide();
		} else if ($('.eventWise :selected').val() == "Low") {
			$('#pieChartRow').hide();
			$('#pieChartRowMed').hide();
			$('#pieChartRowLow').show();
		}
	});

	$(".eventWiseClassification").change(function() {
		$('#classificationWise').hide();

		if ($('.eventWiseClassification :selected').val() == "sw") {
			$('#classificationWise').hide();
			$('#statusWise').show();



		} else if ($('.eventWiseClassification :selected').val() == "cw") {

			$('#statusWise').hide();
			$('#classificationWise').show();
			$('#pieChartRowOTCG').show();
			$('#pieChartRowVTCG').show();

		}

	});

});



// New Code For Tab
$(document).ready(function() {

	$(".navTempBranch").hide();


	var message = $('#message').val();
	/*if (message != "" || message != null) {
		toastr.success(message);
	}*/
	$("#summarylink").click(function() {

		$('#task-tab').css('display', '');
		$('#info-tab').css('display', 'none');

	});

	$("#actionplanlink").click(function() {
		$('#task-tab').css('display', 'none');
		$('#info-tab').css('display', '');
	});

	/*BRANCH*/
	$("#summarylinkBranch").click(function() {

		$('#task-tabBranch').css('display', '');
		$('#info-tabBranch').css('display', 'none');

	});

	$("#actionplanlinkBranch").click(function() {
		$('#task-tabBranch').css('display', 'none');
		$('#info-tabBranch').css('display', '');
	});

	/*BRANCH*/

	/*ZONAL*/
	$("#summarylinkZone").click(function() {

		$('#task-tabZone').css('display', '');
		$('#info-tabZone').css('display', 'none');

	});

	$("#actionplanlinkZone").click(function() {
		$('#task-tabZone').css('display', 'none');
		$('#info-tabZone').css('display', '');
	});

	/*ZONAL*/


	$(".eventWiseClassificationBranch").change(function() {
		$('#classificationWise').hide();

		if ($('.eventWiseClassificationBranch :selected').val() == "sw") {
			$('#classificationWiseBranch').hide();
			$('#statusWiseBranch').show();



		} else if ($('.eventWiseClassificationBranch :selected').val() == "cw") {

			$('#statusWiseBranch').hide();
			$('#classificationWiseBranch').show();
			$('#pieChartRowOTCGBranch').show();
			$('#pieChartRowVTCGBranch').show();

		}

	});

	$(".eventWiseClassificationZone").change(function() {
		$('#classificationWiseZone').hide();

		if ($('.eventWiseClassificationZone :selected').val() == "sw") {
			$('#classificationWiseZone').hide();
			$('#statusWiseZone').show();



		} else if ($('.eventWiseClassificationZone :selected').val() == "cw") {

			$('#statusWiseZone').hide();
			$('#classificationWiseZone').show();
			$('#pieChartRowOTCGZone').show();
			$('#pieChartRowVTCGZone').show();

		}

	});


});

$(document).ready(function() {

	$(".priorityExcelBtn").hide();
	$(".classificationExcelBtn").hide();

	/*	$('.exportExcelRuleClassification').hide();
		$('.exportRulePriority').hide();
		$('.exportExcelRuleClassificationR').hide();
		$('.exportExcelRulePriorityR').hide();*/


});



/*EXPORT EXCEL RULE CLASSIFICATION*/
$('.exportExcelRuleClassification').click(function() {
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
	var selectedFlag = null;
	if ($("#auditFlag").val() == "true") {
		selectedFlag = "CENTRAL";
	} else if ($("#zonalFlag").val() == "true") {
		selectedFlag = "ZONAL";
	} else if ($("#regionalFlag").val() == "true") {
		selectedFlag = "REGIONAL";
	} else if ($("#ruleFlag").val() == "true") {
		selectedFlag = "BRANCH";
	}
	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");
	var pageValJson = "{\"startDate\": \"" + startDate + "\",\n" +
		"    \"searchParam\": \"" + searchParam + "\",\n" +
		"    \"selectedFlag\": \"" + selectedFlag + "\",\n" +
		"    \"endDate\":\"" + endDate + "\"\n" + "}";
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonExportRC").val(ciphertext + ':~:' + passphrase);
	$("#exportRuleClassification").submit();
	document.getElementById('load').style.visibility = "disable";
});
/*EXPORT EXCEL RULE CLASSIFICATION*/


/*EXPORT EXCEL RULE PRIORITY*/
$('.exportRulePriority').click(function() {
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
	var selectedFlag = null;
	if ($("#auditFlag").val() == "true") {
		selectedFlag = "CENTRAL";
	} else if ($("#zonalFlag").val() == "true") {
		selectedFlag = "ZONAL";
	} else if ($("#regionalFlag").val() == "true") {
		selectedFlag = "REGIONAL";
	} else if ($("#ruleFlag").val() == "true") {
		selectedFlag = "BRANCH";
	}
	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");
	var pageValJson = "{\"startDate\": \"" + startDate + "\",\n" +
		"    \"searchParam\": \"" + searchParam + "\",\n" +
		"    \"selectedFlag\": \"" + selectedFlag + "\",\n" +
		"    \"endDate\":\"" + endDate + "\"\n" + "}";
	console.log(pageValJson)
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonExportRP").val(ciphertext + ':~:' + passphrase);
	$("#exportExcelRulePriority").submit();
	document.getElementById('load').style.visibility = "disable";
});
/*EXPORT EXCEL RULE PRIORITY*/


/*---- REGION EXPORT ----*/

/*EXPORT EXCEL RULE CLASSIFICATION*/
$('.exportExcelRuleClassificationR').click(function() {
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
	var selectedFlag = null;
	if ($("#auditFlag").val() == "true") {
		selectedFlag = "CENTRAL";
	} else if ($("#zonalFlag").val() == "true") {
		selectedFlag = "ZONAL";
	} else if ($("#regionalFlag").val() == "true") {
		selectedFlag = "REGIONAL";
	} else if ($("#ruleFlag").val() == "true") {
		selectedFlag = "BRANCH";
	}
	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");
	var pageValJson = "{\"startDate\": \"" + startDate + "\",\n" +
		"    \"searchParam\": \"" + searchParam + "\",\n" +
		"    \"selectedFlag\": \"" + selectedFlag + "\",\n" +
		"    \"endDate\":\"" + endDate + "\"\n" + "}";
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonExportRCR").val(ciphertext + ':~:' + passphrase);
	$("#exportRuleClassificationR").submit();
	document.getElementById('load').style.visibility = "disable";
});
/*EXPORT EXCEL RULE CLASSIFICATION*/

/*EXPORT EXCEL RULE PRIORITY*/
$('.exportExcelRulePriorityR').click(function() {
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
	var selectedFlag = null;
	if ($("#auditFlag").val() == "true") {
		selectedFlag = "CENTRAL";
	} else if ($("#zonalFlag").val() == "true") {
		selectedFlag = "ZONAL";
	} else if ($("#regionalFlag").val() == "true") {
		selectedFlag = "REGIONAL";
	} else if ($("#ruleFlag").val() == "true") {
		selectedFlag = "BRANCH";
	}
	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");
	var pageValJson = "{\"startDate\": \"" + startDate + "\",\n" +
		"    \"searchParam\": \"" + searchParam + "\",\n" +
		"    \"selectedFlag\": \"" + selectedFlag + "\",\n" +
		"    \"endDate\":\"" + endDate + "\"\n" + "}";
	console.log(pageValJson)
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonExportRPR").val(ciphertext + ':~:' + passphrase);
	$("#exportExcelRulePriorityR").submit();
	document.getElementById('load').style.visibility = "disable";
});
/*EXPORT EXCEL RULE PRIORITY*/


/*---- REGION EXPORT ----*/

$("#regionWiseReportTable").DataTable({
	"columnDefs": [{
		orderable: false
	}],
	"responsive": false,
	"autoWidth": true,
	"searching": false,
	"fixedHeader": true,
	"bPaginate": false,
	"buttons": [{

		extend: 'excel',
		title: 'Region wise Alert Count ',

	},
	{

		extend: 'pdf',
		title: 'Region wise Alert Count ',

	}
	],

	"language": {
		"emptyTable": "No Data Available"
	},
}).buttons().container().appendTo(
	'#regionWiseReportTable_wrapper .col-md-6:eq(0)');

