$(document).ready(function() {
	$("#branchWiseReportTable").DataTable({
		"columnDefs": [{
			orderable: true,
			order: [[1, 'asc']]
		}],
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
				title: 'Branch wise Alert Status Report ',
			},
			{
				extend: 'pdf',
				title: 'Branch wise Alert Status Report ',
			},
		]
	}).buttons().container().appendTo(
		'#branchWiseReportTable_wrapper .col-md-6:eq(0)');
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

	list = $('#ageWisePieChartData').val();
	list = list.replace('[', '');
	list = list.replace(']', '');
	var itemsArr = list.split("~");
	checkLableArr = [];
	dataCountArr = [];
	var bgColr = [];
	for (var itr in itemsArr) {
		var iteArr = itemsArr[itr].split("-");
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
	var pieChartCanvas = $('#ageWisePieChart').get(0).getContext('2d')
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
					labelString: 'Age wise Open Count'
				},
				ticks: ticksStyle
			}]
		}

	}
	//Create pie or douhnut chart
	// You can switch between pie and douhnut using the method below.
	new Chart(pieChartCanvas, {
		type: 'pie',
		title: {
			text: "Age Wise Open Alert"
		},
		data: pieData,
		options: pieOptions
	});
	list = $('#regionList').val();
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
	var pieChartCanvas = $('#pieChart2').get(0).getContext('2d')
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
					+ "<td class='text-red'>"
					+ item.openCount
					+ "</td>"
					+ "<td class='text-green'>"
					+ item.closeCount
					+ "</td>"
					+ "<td class='text-yellow'>"
					+ item.escalateCount
					+ "</td>"
					+ "<td class='text-center text-bold text-blue accountAlertCount' id='ruleId-" + item.ruleId + "-" + $("#branchId2").text() + "' name='ruleId'><a href='#' class='badge badge-primary>"
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

$("#fetchDataBtnBranch").click(function() {
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
	console.log(pagevalJson)
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
					+ "<td class='text-bold text-blue '  name='branchId'><a href='#' class='branchWiseAlertView badge badge-primary' id='branchId-" + item.branchId + "'>"
					+ item.branchId + "-" + item.branchName
					+ "</a></td>"
					+ "<td class='text-bold text-red'>"
					+ item.openCount
					+ "</td>"
					+ "<td class='text-bold text-green'>"
					+ item.closeCount
					+ "</td>"
					+ "<td class='text-bold text-yellow'>"
					+ item.escalateCount
					+ "</td>"
					+ "<td class='text-center text-bold text-blue ruleAlertCount' id='branchId-" + item.branchId + "' name='branchId'><a href='#' class='badge badge-primary'>"
					+ item.totalCount
					+ "</a></td>"
					+ "</tr>")
					.appendTo("#branchWiseCountBody");
			});
			$("#branchWiseReportTable").DataTable({
				"columnDefs": [{
					orderable: true
				}],
				"responsive": false,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
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
				.error('Some Error Occured');
		}
	});
});

$("#fetchDataBtnReg").click(function() {

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
		+ "    \"zoneId\":\"" + $("#zoneId2").text() + "\",\n" +
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
			$('#regionWiseReportTable').dataTable().fnClearTable();
			$('#regionWiseReportTable').DataTable().destroy();
			obj.regionAlertCountList.forEach(function(item) {

				$(
					"<tr>"

					+ "<td class='text-capitalize text-bold'>"
					+ item.regionName
					+ "</a></td>"

					+ "<td class='text-bold text-red'>"
					+ item.openCount
					+ "</td>"

					+ "<td class='text-bold text-green'>"
					+ item.closeCount
					+ "</td>"

					+ "<td class='text-bold text-yellow'>"
					+ item.escalateCount
					+ "</td>"

					+ "<td class='text-center text-bold text-blue branchAlertCount' id='regionName-" + item.regionName + "' name='regionName'><a href='#' class='badge badge-primary'>"
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
				"searching": true,
				"fixedHeader": true,
				"bPaginate": false,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": [
					{
						extend: 'excel',
						title: 'Region wise Alert Status Report ',
					},
					{
						extend: 'pdf',
						title: 'Region wise Alert Status Report ',
					},
				]


			}).buttons().container().appendTo(
				'#regionWiseReportTable_wrapper .col-md-6:eq(0)');

			var pieData = obj.regionAlertCount;
			checkLableArr = [];
			dataCountArr = [];
			var bgColr = [];
			var itemsArr
			pieData.forEach(function(items) {
				//alert(items);
				var itemsCur = items;
				itemsArr = itemsCur.split("-");
				checkLableArr.push(itemsArr[0]);
				//alert("checkLableArr "+ checkLableArr);
				dataCountArr.push(itemsArr[1]);
				bgColr.push(getRandomColor());
				//alert("dataCountArr "+ dataCountArr);
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
				.error('Some Error Occured');
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

					+ "<td class='text-center text-bold text-blue regionWiseCount' id='zoneName-" + item.zoneName + "'><a href='#'>"
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
				"buttons": [
					{
						extend: 'excel',
						title: 'Zonewise Alert Status Report ',
					},
					{
						extend: 'pdf',
						title: 'Zonewise Alert Status Report ',
					},
				]
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
									labelString: 'Numbers Of Alerts'
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
				.error('Some Error Occured');
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
var intersect = true;

$(document).on("click", ".regionWiseCount", function() {

	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {

		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('-');
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
						+ "<td class='text-center text-bold text-blue branchAlertCount' id='regionName-" + item.regionName + "' name='regionName'><a href='#'>"
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
					"searching": true,
					"fixedHeader": true,
					"bPaginate": false,
					"language": {
						"emptyTable": "No Data Available"
					},
					"buttons": [
						{
							extend: 'excel',
							title: 'Regionwise Alert Status Report ',
						},
						{
							extend: 'pdf',
							title: 'Regionwise Alert Status Report ',
						},
					]
				}).buttons().container().appendTo(
					'#regionWiseReportTable_wrapper .col-md-6:eq(0)');

				var pieData = obj.regionAlertCount;
				checkLableArr = [];
				dataCountArr = [];
				var bgColr = [];
				var itemsArr
				pieData.forEach(function(items) {
					//alert(items);
					var itemsCur = items;
					itemsArr = itemsCur.split("-");
					checkLableArr.push(itemsArr[0]);
					//alert("checkLableArr "+ checkLableArr);
					dataCountArr.push(itemsArr[1]);
					bgColr.push(getRandomColor());
					//alert("dataCountArr "+ dataCountArr);
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
					.error('Some Error Occured');
			}
		});
	}
});

$(document).on("click", ".branchAlertCount", function() {
	var actualCount = $(this).text();
	if (actualCount == 0) {

	} else {
		var zoneName = $(this).attr('id');
		var zoneNameList = zoneName.split('-');
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
				$('#branchWiseReportTable').dataTable().fnClearTable();
				$('#branchWiseReportTable').DataTable().destroy();
				obj.branchAlertCountList.forEach(function(item) {

					$(
						"<tr>"

						+ "<td class='text-bold text-blue '  name='branchId'><a href='#' class='branchWiseAlertView badge badge-primary' id='branchId-" + item.branchId + "'>"
						+ item.branchId + "-" + item.branchName
						+ "</a></td>"

						+ "<td class='text-bold text-red'>"
						+ item.openCount
						+ "</td>"

						+ "<td class='text-bold text-green'>"
						+ item.closeCount
						+ "</td>"

						+ "<td class='text-bold text-yellow'>"
						+ item.escalateCount
						+ "</td>"

						+ "<td class='text-center text-bold text-blue ruleAlertCount' id='branchId-" + item.branchId + "' name='branchId'><a href='#' class='badge badge-primary'>"
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
		var zoneNameList = zoneName.split('-');
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

						+ "<td class='text-center text-bold text-blue accountAlertCount' id='ruleId-" + item.ruleId + "-" + item.branchId + "' name='ruleId'><a href='#' class='badge badge-primary'>"
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
					"responsive": false,
					"autoWidth": true,
					"searching": false,
					"fixedHeader": true,
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
		var zoneNameList = zoneName.split('-');
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
				$("#accountWiseReportTable").DataTable({
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

$('.exportExcelRulePriorityMV').click(function() {

	var verticalList;
	verticalList = "[\n";
	if ($('#roleValueTable > #tbodyVg  > tr').length > 0) {
		$('#roleValueTable > #tbodyVg  > tr').each(function(index, value) {
			verticalList = verticalList +
				" { \"vertical\": \"" + $(this).find('td:eq(0)').text() + "\",\n" +
				"\"l30days\": \"" + $(this).find('td:eq(1)').text().trim() + "\",\n" +
				"\"g30l45days\": \"" + $(this).find('td:eq(2)').text().trim() + "\",\n" +
				"\"g45days\": \"" + $(this).find('td:eq(3)').text().trim() + "\",\n" +
				"\"verification\": \"" + $(this).find('td:eq(4)').text().trim() + "\",\n" +
				"\"close\": \"" + $(this).find('td:eq(5)').text().trim() + "\"},";
		});
		verticalList = verticalList.substring(0, verticalList.length - 1);
	} else {

		toastr.warning("No Data Available")

	}
	verticalList += "]";

	var pageValJson = "{\"verticalExportDto\":" + verticalList + "}"



	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonExportData").val(ciphertext + ':~:' + passphrase);
	$("#exportExcelMyVerticalData").submit();
	document.getElementById('load').style.visibility = "disable";
});

