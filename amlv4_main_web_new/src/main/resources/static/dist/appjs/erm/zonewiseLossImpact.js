
var labelList;
var zoneList;

var checkArr;
var zoneArr;
var checkLableArr = [];
var dataCountArr = [];
var zoneCountArr = [];
var zoneLableArr = [];

var currYrArr;
var prevYrArr;
var currYearList=[];
var currYearArray;
var currYearCountArray=[];
var prevYearList=[];
var prevYearArray;
var prevYearCountArray=[];
var quaterList;
var qList;
var quarterListArray=[];
var countQuarter=[];
var quartersArray=[];
var internalFraudArray=[];
var externalFraudArray=[];


$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

$(document).ready(function() {
	


	$(".zoneWise").change(function(){
		
		if($('.zoneWise :selected').val() == "pie"){
			$('#zonePie').show();
			$('#zoneBar').hide();
		}else if($('.zoneWise :selected').val() == "bar"){
			$('#zonePie').hide();
			$('#zoneBar').show();
		}
	});	


});	




$(document).ready(function() {
	
	//zone wise pie chart
	zoneList = $("#officeSubNameCount").val(); 
	zoneList = $("#officeSubNameCount").val().replace('[', '');
	zoneList = zoneList.replace(']', '');
	/*labelList = labelList.split(',');*/
	zoneArr = zoneList.split(',');
	for (var a in zoneArr) {
		var variable = zoneArr[a].split('-')[0];
		var count = zoneArr[a].split('-')[1];
		zoneLableArr.push(variable);
		zoneCountArr.push(count);
		
	}
	
	
	
	/*PIE CHART ZONE*/
	var donutData = {
		labels: zoneLableArr,
		datasets: [
			{
				data: zoneCountArr,
				backgroundColor: ['#f56954', '#00a62a', '#f39c32', '#00c0ef', '#3c8dbc', '#d2d6de', '#16A085', '#0C0934', '#9490D6'],
			}
		]
	}
	var pieChartCanvas = $('#pieChartZone').get(0).getContext('2d')
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

	/*PIE CHART ZONE*/
	
	
	
	//zone Bar
var zoneBarChart = document.getElementById("zoneChart").getContext("2d");

var zoneChart = new Chart(zoneBarChart, {
	type: 'bar',
	data: {
		labels: zoneLableArr,
		
		datasets: [{
			data: zoneCountArr,
			backgroundColor: ['#f56954', '#00a62a', '#f39c32', '#00c0ef', '#3c8dbc', '#d2d6de', '#16A085', '#0C0934']
			
		}]
	},

	options: {
		legend: {
			display: false,
			position: 'top',
			labels: {
				fontColor: "#000080",
			}
		},
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: false
				}
			}],
			xAxes: [{
				barPercentage: 0.4,
				ticks: {
					beginAtZero: true
				}
			}]
		},
		responsive: true,
		maintainAspectRatio: false,
	}
});	
	
	
	
	// pie chart
	$('.downloadPiePdfIM').click(function(event) {

	//var position = $('.downloadPdfIM').val();
	// get size of report page
	var reportPageHeight = $('.report-pageIM').innerHeight();
	var reportPageWidth = $('.report-pageIM').innerWidth();
	
	reportPageWidth = reportPageWidth ;
	reportPageHeight = 500;
	
	console.log("Report Page Width"+ reportPageWidth);
	console.log("Report Page Height"+ reportPageHeight);

	// create a new canvas object that we will populate with all other canvas objects
	var pdfCanvas = $('<canvas />').attr({
		id: "canvaspdf",
		width: reportPageWidth,
		height: reportPageHeight
	});

	// keep track canvas position
	var pdfctx = $(pdfCanvas)[0].getContext('2d');
	var pdfctxX = 40;
	var pdfctxY = 30;
	var buffer = 3000;

	//var selectedValue = $('option:selected', this).val();
	//var selectedValueIs = $("#choosegraph").val();
	                    
	var divName = "#pieChartZone";
	var filename = "Zone wise Operational Impact";
                

	
	// for each chart.js chart
	$(divName).each(function(index) {
		// get the chart height/width
		var canvasHeight = $(this).innerHeight();
		var canvasWidth = $(this).innerWidth();

		//alert("Canvas height "+ canvasHeight);
		//alert("Canvas width "+ canvasWidth);

		// draw the chart into the new canvas
		pdfctx.drawImage($(this)[0], pdfctxX, pdfctxY, canvasWidth, canvasHeight);
		pdfctxX += canvasWidth + buffer;

		// our report page is in a grid pattern so replicate that in the new canvas
		if (index % 2 === 1) {
			pdfctxX = 0;
			pdfctxY += canvasHeight + buffer;
		}
	});

	// create new pdf and add our new canvas as an image
	var pdf = new jsPDF('l', 'pt', [reportPageWidth, reportPageHeight]);
	pdf.addImage($(pdfCanvas)[0], 'PNG', 0, 0);

	// download the pdf
	pdf.save(filename);
});



$('.downloadPdfIM').click(function(event) {

	
	// get size of report page
	var reportPageHeight = $('.report-pageIM').innerHeight();
	var reportPageWidth = $('.report-pageIM').innerWidth();
	
	reportPageWidth = reportPageWidth + 380;
	reportPageHeight = 500;
	
	console.log("Report Page Width"+ reportPageWidth);
	console.log("Report Page Height"+ reportPageHeight);

	// create a new canvas object that we will populate with all other canvas objects
	var pdfCanvas = $('<canvas />').attr({
		id: "canvaspdf",
		width: reportPageWidth,
		height: reportPageHeight
	});

	// keep track canvas position
	var pdfctx = $(pdfCanvas)[0].getContext('2d');
	var pdfctxX = 40;
	var pdfctxY = 30;
	var buffer = 3000;

	// if 
	                    
	var divName = "#zoneChart";
	var filename = "Zone wise Operational Impact Bar Chart(IM).pdf";
                

	
	// for each chart.js chart
	$(divName).each(function(index) {
		// get the chart height/width
		var canvasHeight = $(this).innerHeight();
		var canvasWidth = $(this).innerWidth();

		//alert("Canvas height "+ canvasHeight);
		//alert("Canvas width "+ canvasWidth);

		// draw the chart into the new canvas
		pdfctx.drawImage($(this)[0], pdfctxX, pdfctxY, canvasWidth, canvasHeight);
		pdfctxX += canvasWidth + buffer;

		// our report page is in a grid pattern so replicate that in the new canvas
		if (index % 2 === 1) {
			pdfctxX = 0;
			pdfctxY += canvasHeight + buffer;
		}
	});

	// create new pdf and add our new canvas as an image
	var pdf = new jsPDF('l', 'pt', [reportPageWidth, reportPageHeight]);
	pdf.addImage($(pdfCanvas)[0], 'PNG', 0, 0);

	// download the pdf
	pdf.save(filename);
});

	
	
	
});	
	
