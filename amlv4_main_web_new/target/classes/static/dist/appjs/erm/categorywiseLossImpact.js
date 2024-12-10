
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
	
	
	labelList = $("#countAndValue").val(); 
	labelList = labelList.replace('[', '');
	labelList = labelList.replace(']', '');
	/*labelList = labelList.split(',');*/
	checkArr = labelList.split(',');
	for (var a in checkArr) {
		var variable = checkArr[a].split('-')[0];
		var count = checkArr[a].split('-')[1];
		checkLableArr.push(variable.replaceAll('~',', '));
		dataCountArr.push(count);
	}
	
	
	$(".eventWise").change(function(){
		
		if($('.eventWise :selected').val() == "pie"){
			$('#pieChartRow').show();
			$('#barChartRow').hide();
		}else if($('.eventWise :selected').val() == "bar"){
			$('#pieChartRow').hide();
			$('#barChartRow').show();
		}
	});	



//*PIE CHART*/

	var donutData = {
		labels: checkLableArr,
		datasets: [
			{
				data: dataCountArr,
				backgroundColor: ['#f56954', '#00a62a', '#f39c32', '#00c0ef', '#3c8dbc', '#d2d6de', '#16A085', '#0C0934', '#9490D6'],
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
	
/*BAR CHART*/	
var ctx = document.getElementById("mybarChart").getContext("2d");

var mybarChart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: checkLableArr,
		datasets: [{
			data: dataCountArr,
			backgroundColor: ['#f56954', '#00a62a', '#f39c32', '#00c0ef', '#3c8dbc', '#d2d6de', '#16A085', '#0C0934', '#9490D6']
			
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
					beginAtZero: true
				}
			}],
			xAxes: [{
				barPercentage: 0.4
			}]
		},
		responsive: true,
		maintainAspectRatio: false,
	}
});	
/*BAR CHART*/


// pie chart
	$('.downloadPiePdfIM1').click(function(event) {

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
	                    
	var divName = "#mypieChart";
	var filename = "Event Category wise Operational loss Impact";
                

	
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
	
	
$('.downloadPdfIM1').click(function(event) {

	
	// get size of report page
	var reportPageHeight = $('.report-pageIM').innerHeight();
	var reportPageWidth = $('.report-pageIM').innerWidth();
	
	reportPageWidth = reportPageWidth + 1080;
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


	                    
	var divName = "#mybarChart";
	var filename = "Event Category wise Operational loss Impact BAR CHART(IM)";
                

	
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