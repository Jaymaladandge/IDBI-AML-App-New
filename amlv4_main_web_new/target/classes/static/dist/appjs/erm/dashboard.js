 

//risk-appe-queue
	$(".risk-appe-queue").change(function() {


		quarter_count = $(this).val();
	
		var moduleName = "RISK APPETITE";
			var pageValJson = "{\"quarterCount\":"
				+ "\"" + quarter_count + "\"}";
				
				
			$("#loading-image").show();
			$("#riskAppetite-data").hide();
			
			
						// ajax call
			$
				.ajax({
					url: 'viewGraphCountByQuarter',
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
					//async:false,
					//beforeSend: function() {
					// $("#myloader").show();
					//},
					success: function(response) {

						var jsonResponse = JSON
							.stringify(response);
						var obj = JSON.parse(jsonResponse);
				
						console.log(obj);
						
						
						
						if (obj.withinTolerance != null) {
							$("#loading-image").hide();
							$('#riskAppetite-data').show();
							$('#risk-appetite-queue').show();

						}
						//$("#withinTolerance").text(obj.withinTolerance);
						//$("#aboveTolerance").text(obj.aboveTolerance);
						$("#loading-image").hide();
					
						console.log(obj);
						
						var withinTolerance = obj.withinToleranceList;
						var aboveTolerance =  obj.aboveToleranceList;
						
						
//						alert(obj.withinToleranceList);
						var i=1;
						var elements = [];
							var abovetoleranceArr = [];
							var withintoleranceArr = [];
						
						
//						alert("Elements "+ elements);
//						alert("till here correct");

		$('#barChart').remove();
		$('#risk-app-chart').append('<canvas id="barChart" style="min-height: 250px; height: 250px; max-height: 250px; max-width: 100%;"></canvas>');


	
		
		obj.withinToleranceList.forEach(function(items) {
			withintoleranceArr.push(items);
			i++;
		});
		

//		alert("Within Tolerance "+ withintoleranceArr);
		obj.aboveToleranceList.forEach(function(items) {
			abovetoleranceArr.push(items);
		});

//		alert("Above Tolerance Array "+ abovetoleranceArr);
//		alert("Within Tolerance Array "+ withintoleranceArr);
//						
//
//		alert("till here correct 2");


		/* ChartJS
		 * -------
		 * Here we will create a few charts using ChartJS
		 */

		//--------------
		//- AREA CHART -
		//--------------

		var areaChartData = {
			labels: obj.quater1,
			datasets: [
				{
					label: 'Above Tolerance',
					backgroundColor: '#ff0000',
					borderColor: '#ff0000',
					pointRadius: false,
					pointColor: '#3b8bba',
					pointStrokeColor: 'rgba(60,141,188,1)',
					pointHighlightFill: '#fff',
					pointHighlightStroke: 'rgba(60,141,188,1)',
					data: abovetoleranceArr
				},
				{
					label: 'Within Tolerance',
					backgroundColor: '#1e7e34',
					borderColor: '#1e7e34',
					pointRadius: false,
					pointColor: 'rgba(210, 214, 222, 1)',
					pointStrokeColor: '#c1c7d1',
					pointHighlightFill: '#fff',
					pointHighlightStroke: 'rgba(220,220,220,1)',
					data: withintoleranceArr
				},
				{
			          label               : 'Above Tolerance',
			          borderColor         : '#ff0000',
			          backgroundColor	  : 'transparent',
			          data                :  abovetoleranceArr,
			          pointRadius          : 2,
			          pointColor          : '#fff',
			          type				  :  'line'
		        },
			    {
			          label               : 'Within Tolerance',
			          borderColor         : '#1e7e34',
			          backgroundColor	  : 'transparent',
			          data                :  withintoleranceArr,
			          pointRadius          : 2,
			          pointColor          : '#fff',
			          type				  :  'line'
			     }
			]
		}

		var areaChartOptions = {
			maintainAspectRatio: false,
			responsive: true,
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
					gridLines: {
						display: false,
					}
				}],
				yAxes: [{
					display: true,
					ticks: {
						suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
						// OR //
						beginAtZero: true   // minimum value will be 0.
					},
					gridLines: {
						display: false,
					}
				}]
			}
		}


		//-------------
		//- BAR CHART -
		//-------------
		var barChartCanvas = $('#barChart').get(0).getContext('2d')
		var barChartData = $.extend(true, {}, areaChartData)
		var temp0 = areaChartData.datasets[0]
		var temp1 = areaChartData.datasets[1]
		barChartData.datasets[0] = temp1
		barChartData.datasets[1] = temp0

		var barChartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			datasetFill: false,
			scales: {
				yAxes: [{
					display: true,
					ticks: {
						suggestedMax: 8,
						suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
						// OR //
						beginAtZero: true   // minimum value will be 0.
					}
				}],
				plugins: {
					datalabels: {
						anchor: 'end',
						align: 'top',
						formatter: Math.round,
						font: {
							weight: 'bold'
						}
					}
				}
			}

		}

		function getSize(elementId) {
			return {
				width: document.getElementById(elementId).offsetWidth,
				height: document.getElementById(elementId).offsetHeight,
			}
		}

		let data = [
			[0, 1, 2, 3, 4, 5, 6],
			[2, 3, 4, 5],
			[7, 6, 5, 4]
		];

		const optsLineChart = {
			...getSize('barChart'),
			scales: {
				x: {
					time: false,
				},
				y: {
					range: [0, 100],
				},
			},
			series: [
				{},
				{
					fill: 'transparent',
					width: 5,
					stroke: 'rgba(60,141,188,1)',
				},
				{
					stroke: '#c1c7d1',
					width: 5,
					fill: 'transparent',
				},
			],
		};


		let lineChart = new uPlot(optsLineChart, data, document.getElementById('lineChart'));

		window.addEventListener("resize", e => {

			lineChart.setSize(getSize('lineChart'));
		});

		new Chart(barChartCanvas, {
			type: 'bar',
			data: barChartData,
			options: barChartOptions
		})
		
		//alert("Final alert");


					},
					error: function(xhr, status, error) {
						console.log(xhr);
						console.log(status);
						console.log(error);
						toastr
							.success('Some Error Occured');
					}
				});
			
			

		//barChart4
		

	});

//Main Script





//Print 

$('.downloadPdf').click(function(event) {

	var position = $('.downloadPdf').val();
	// get size of report page
	var reportPageHeight = $('.report-page').innerHeight();
	var reportPageWidth = $('.report-page').innerWidth();
	
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

	var selectedValue = $('option:selected', this).val();
	var selectedValueIs = $("#choosegraph").val();
	                    
	var divName = "#barChart";
	var filename = "Risk Appetite Bar Chart Report.pdf";
                

	
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

	// Print
	
	
	// pie chart
	$('.downloadPiePdf').click(function(event) {

	var position = $('.downloadPdf').val();
	// get size of report page
	var reportPageHeight = $('.report-page').innerHeight();
	var reportPageWidth = $('.report-page').innerWidth();
	
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

	var selectedValue = $('option:selected', this).val();
	var selectedValueIs = $("#choosegraph").val();
	                    
	var divName = "#donutChartRiskAppitite";
	var filename = "Risk Appetite Pie Chart Report.pdf";
                

	
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
	
	
	
	
	
	// pie chart
	/*$('.downloadPiePdfIM').click(function(event) {

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
});*/

