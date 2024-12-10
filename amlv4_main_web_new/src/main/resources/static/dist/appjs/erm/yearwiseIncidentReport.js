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
var currYearList = [];
var currYearArray;
var currYearCountArray = [];
var prevYearList = [];
var prevYearArray;
var prevYearCountArray = [];
var quaterList;
var qList;
var quarterListArray = [];
var countQuarter = [];
var quartersArray = [];
var internalFraudArray = [];
var externalFraudArray = [];


var currentYear = $('#currYear').val();
var previousYear = $('#prevYear').val();

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
	
	
	currYrArr = $("#currYearList").val(); 
	currYrArr = $("#currYearList").val().replace('[', '');
	currYrArr = currYrArr.replace(']', '');
	currYearArray = currYrArr.split(',');
	for (var a in currYearArray) {
		var variable = currYearArray[a].split('-')[0];
		var count = currYearArray[a].split('-')[1];
		currYearList.push(variable);
		currYearCountArray.push(count);
		
	}
	prevYrArr = $("#prevYearList").val();
	prevYrArr = $("#prevYearList").val().replace('[', '');
	prevYrArr = prevYrArr.replace(']', '');
	prevYearArray = prevYrArr.split(',');
	for (var b in prevYearArray) {
		var variable = prevYearArray[b].split('-')[0];
		var count = prevYearArray[b].split('-')[1];
		prevYearList.push(variable);
		prevYearCountArray.push(count);
	}
	
	
	//year wise comparison bar chart

var barChartCanvas = $('#barChartCompare').get(0).getContext('2d')
	
	var barChartData={
	labels  : currYearList,	
	 datasets : [
        {
          label               : currentYear,
          backgroundColor     : 'rgba(60,141,188,0.9)',
          borderColor         : 'rgba(60,141,188,0.8)',
          pointRadius          : false,
          pointColor          : '#3b8bba',
          pointStrokeColor    : 'rgba(60,141,188,1)',
          pointHighlightFill  : '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          data                : currYearCountArray
        },
        {
          label               : previousYear,
          backgroundColor     : 'rgba(210, 214, 222, 1)',
          borderColor         : 'rgba(210, 214, 222, 1)',
          pointRadius         : false,
          pointColor          : 'rgba(210, 214, 222, 1)',
          pointStrokeColor    : '#c1c7d1',
          pointHighlightFill  : '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data                : prevYearCountArray
        },
      ]
	}

    var barChartOptionsOne = {
      responsive              : true,
      maintainAspectRatio     : false,
      datasetFill             : false
    }

    new Chart(barChartCanvas, {
      type: 'bar',
      data: barChartData,
      options: barChartOptionsOne
    })

	
	
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



