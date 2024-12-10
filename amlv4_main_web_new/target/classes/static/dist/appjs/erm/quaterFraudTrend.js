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


	$.each(qList, function(index, value) {
		quarterListArray.push(value);
	});

	for (var a in quarterListArray) {
		var variable = quarterListArray[a].split('~')[0];
		var qcount = quarterListArray[a].split('~')[1];
		var iFraud = quarterListArray[a].split('~')[2];
		var eFraud = quarterListArray[a].split('~')[3];
		countQuarter.push(variable);
		quartersArray.push("Q" + qcount);
		internalFraudArray.push(iFraud);
		externalFraudArray.push(eFraud);
		

	}


/*Quarter GRAPH*/
var $visitorsChart = $('#visitors-chart')
var ticksStyle = {
	fontColor: '#495057',
	fontStyle: 'bold'
}
// eslint-disable-next-line no-unused-vars
var mode = 'index'
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
		elements: {
			line: {
				tension: 0
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
/*Quarter GRAPH*/

})
