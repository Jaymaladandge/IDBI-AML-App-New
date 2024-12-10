var labelList;
var checkArr;
var checkLableArr = [];
var dataCountArr = [];
var greenColor='';
var redColor='';
var amberColor='';
$(document).ready(function() {
	labelList = $("#tpRiskCount").val(); 
	greenColor=$("#greenColour").val();
	amberColor=$("#amberColour").val();
	redColor=$("#redColour").val();
	
	
	labelList = $("#tpRiskCount").val().replace('[', '');
	labelList = labelList.replace(']', '');
	/*labelList = labelList.split(',');*/
	
	checkArr = labelList.split(',');

	for (var a in checkArr) {
		var variable = checkArr[a].split('-')[0];
		var count = checkArr[a].split('-')[1];
		checkLableArr.push(variable.replaceAll('~',', '));
		dataCountArr.push(count);
	}
	/*PIE CHART*/

	var donutData = {

		labels: checkLableArr,

		datasets: [
			{
				data: dataCountArr,
				//backgroundColor: ['#00a62a', '#f39c32','#f56954'],
				backgroundColor: [greenColor, amberColor,redColor],
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

	/*PIE CHART*/
	});
