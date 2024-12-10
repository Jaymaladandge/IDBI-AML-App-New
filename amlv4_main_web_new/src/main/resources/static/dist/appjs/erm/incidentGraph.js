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

	quaterList = $('#quaterList').val();
	quaterList = $("#quaterList").val().replace('[', '');
	quaterList = quaterList.replace(']', '');
	qList = quaterList.split(',');


$.each(qList, function( index, value ) {
	quarterListArray.push(value);
});

for (var a in quarterListArray) {
	var variable = quarterListArray[a].split('~')[0];
		var qcount = quarterListArray[a].split('~')[1];
		var iFraud = quarterListArray[a].split('~')[2];
		var eFraud = quarterListArray[a].split('~')[3];
		countQuarter.push(variable);
		quartersArray.push("Q"+qcount);
		internalFraudArray.push(iFraud);
		externalFraudArray.push(eFraud);

}
})	


$(document).ready(function() {
	
	$(".eventWise").change(function(){
		
		if($('.eventWise :selected').val() == "pie"){
			$('#pieChartRow').show();
			$('#barChartRow').hide();
		}else if($('.eventWise :selected').val() == "bar"){
			$('#pieChartRow').hide();
			$('#barChartRow').show();
		}
	});	


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
	

	/*PIE CHART*/

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
	
	
/*EXAMPLE WALA GRAPH*/
  var $visitorsChart = $('#visitors-chart')
 var ticksStyle = {
    fontColor: '#495057',
    fontStyle: 'bold'
  }
  // eslint-disable-next-line no-unused-vars
 var mode='index'
 var intersect = true
  var visitorsChart = new Chart($visitorsChart, {
    data: {
      labels: quartersArray,
      datasets: [{
        type: 'line',
		label: 'Internal Fraud',
        data: internalFraudArray,
        backgroundColor: 'transparent',
        borderColor: '#00c0ef',
        pointBorderColor: '#007bff',
        pointBackgroundColor: '#007bff',
        fill: false
        // pointHoverBackgroundColor: '#007bff',
        // pointHoverBorderColor    : '#007bff'
      },
      {
        type: 'line',
		label: 'External Fraud',
        data: externalFraudArray,
        backgroundColor: 'tansparent',
        borderColor: '#d2d6de',
        pointBorderColor: '#ced4da',
        pointBackgroundColor: '#ced4da',
        fill: false
        // pointHoverBackgroundColor: '#ced4da',
        // pointHoverBorderColor    : '#ced4da'
      }]
    },
    options: {
	elements:{
			line:{
				tension:0
			}
		},
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
          gridLines: {
            display: true,
            lineWidth: '4px',
            color: 'rgba(0, 0, 0, .2)',
            zeroLineColor: 'transparent'
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
          ticks: ticksStyle
        }]
      }
    }
  })
/*EXAMPLE WALA GRAPH*/
	

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
	
	



// line chart SCRIPT TO ADD BELOW

/*const ctxl = document.getElementById('canvasLineChart').getContext('2d');
const myChart = new Chart(ctxl, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'transparent',
            borderColor: 'red',
            borderWidth: 3
        }]
    },
    options: {
	elements: {
		
		line: {
			tension: 0
		}
		
	},
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});*/


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
	// pie chart
	
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

	
	
	
	
	
});