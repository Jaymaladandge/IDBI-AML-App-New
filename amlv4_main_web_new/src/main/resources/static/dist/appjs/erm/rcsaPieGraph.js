function printDiv() {
			window.print();}
			
			
$(document).ready(function() {
	$('select option').each(function() {
	    t = $(this).text();
	    $(this).text(t.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }))
	});
});
	
	
$(document).ready(function () {
		$('select option').filter(function(){
				return ($(this).val().trim()=="" && $(this).text().trim()=="");
			}).remove();
			
			$("select option").each(function() {
			  $(this).siblings('[value="'+ this.value +'"]').remove();
			});
		});
	
	
	
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();

	//Date range picker
	$('#completionDate').datetimepicker({
		format : 'DD-MM-YYYY'
	//format : 'YYYY-MM-DD'
	});
})


$('#downloadPie').click(function(event) {
	
		var assessmentDate1 = $('#creationPeriod').find(":selected").val();
		var table = $('#rcsaGraphTable').DataTable();
		table.destroy();
		window.print();
		$("#rcsaGraphTable").DataTable({
		"columnDefs" : [ {
			orderable : false,

		} ],

		//"order" : [ 0, "asc" ],
		"lengthMenu" : [ 50 , 100 ],
		"responsive" : false,
		"autoWidth" : false,
		"searching" : true,
		"fixedHeader" : true,

		"language" : {
			"emptyTable" : "No Data Available"
		},
		"buttons" : [ {

			extend : 'excel',
			title : 'RCSA - Residual Assessment ' + assessmentDate1,

		} ]
	}).buttons().container().appendTo(
			'#rcsaGraphTable_wrapper .col-md-6:eq(0)');
		
});


document.onreadystatechange = function() {
			var state = document.readyState
			if (state == 'interactive') {
				//document.getElementById('contents').style.visibility = "hidden";
			} else if (state == 'complete') {
				setTimeout(
						function() {
							//document.getElementById('interactive');
							document.getElementById('load').style.visibility = "hidden";
						}, 1000);
			}
		}
		
		
var labelList;
	var checkArr;
	var checkLableArr = [];
	var dataCountArr = [];
	var greenColor='';
	var redColor='';
	var amberColor='';
	
	labelList = $("#pieData").val(); 
	greenColor=$("#greenColour").val();
	amberColor=$("#amberColour").val();
	redColor=$("#redColour").val();
	
	$(document).ready(function() {
		
		
		console.log('labelList ',labelList);
		labelList = $("#pieData").val().replace('[', '');//"pieData"
		labelList = labelList.replace(']', '');
		/*labelList = labelList.split(',');*/
		console.log('labelList ',labelList);
		checkArr = labelList.split(',');
		console.log('checkArr ',checkArr);
		for (var a in checkArr) {
			var variable = checkArr[a].split('-')[0];
			var count = checkArr[a].split('-')[1];
			checkLableArr.push(variable.replaceAll('~',', '));
			dataCountArr.push(count);
		}
		/*PIE CHART*/
console.log('dataCountArr ',dataCountArr);
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
		


// New Code

	
// fetch office code
/*$('#officeType').change(
		function() {
			
			
			var currentDept = $('#currentDept').val();
			if(currentDept =='ERM'){
				
				
			}else{
				
				var officeId = $('#userOfcId').val();
			var selectedOfficeType = $('#officeType').find(":selected").val();

			var pageValJson = "{\"selectedOfficeType\":" + "\"" + selectedOfficeType
								+ "\",\"officeId\":\"" +  officeId
								+ "\"}";
			
			document.getElementById('load').style.visibility = "visible";
			
								$.ajax({
									url: 'fetchOfficeCodes',
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
				
										//clear Drop-Down List of 

										$("#officeCode").empty();
										$("<option />", {
												val: "",
												text: "Select Office Code"
											}).appendTo($("#officeCode"));
										obj.ofcCodeList.forEach(function(items) {
											console.log(items);
					
											$("<option />", {
												val: items,
												text: items
											}).appendTo($("#officeCode"));
					
					
										});
										
										$("#officeCodeDropDown").show();
				
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
			
			
			
			
		});*/
$(function() {
		
		 
		 $("#officeType").change(function () {
			 var userOffice=$("#officeType").val();
			 var userOfficeText = $("#officeType option:selected").text();
			 var pageValJson = "{\"officeType\":" + "\""+ userOffice + "\"}";
			 console.log(pageValJson)
			document.getElementById('load').style.visibility = "visible";
				
				// ajax call
				$
					.ajax({
						url: 'DeptRiskOfficeWise',
						type: "POST",
						data: {
							pageValJson: pageValJson
						},// important line for thymeleaf http security

						headers: {
							"X-CSRF-TOKEN": $( "input[name='_csrf']").val()
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
							
							obj = JSON.parse(jsonResponse);
							
							console.log(obj)
							if(obj.deptList != null){
							$("#riskDept").empty();
							$("<option />", {
									val: "",
									text: "Select Department"
								}).appendTo($("#riskDept"));
							
							$("<option />", {
								val: "ALL",
								text: "ALL"
							}).appendTo($("#riskDept"));
							
							obj.deptList.forEach(function(items) {
								

								$("<option />", {
									val: items.deptId,
									text: items.deptName
								}).appendTo($("#riskDept"));
								
								


							});
							}
							if(obj.officeCodeList != null){
							$("#officeCode").empty();
							/* $("<option />", {
									val: "",
									text: "Select Department"
								}).appendTo($("#officeCode")); */
							obj.officeCodeList.forEach(function(items) {
								

								$("<option />", {
									val: items.officeCode,
									text:items.officeCode
								}).appendTo($("#officeCode"));


							});
							}
							$('.select2').select2();
							
				},
				error: function(xhr, status, error) {
					console.log(xhr);
					toastr
						.error('Some Error Occured here	');
				}
			
		});
 	
	});
	 $("#riskDept").prop("disabled", false);
 	 $("#officeCode").prop("disabled", false);
	 $("#officeCode").prop("selectedIndex", 0).val();
	
}); 
		
		
		
		
		// get Reports
$( "#getReport" ).click(function() {
			
			var deptName = $('#riskDept').val();
			
			var assessmentDate1 = $('#creationPeriod').find(":selected").val();
			var officeType = $('#officeType').find(":selected").val();
			var officeCode = $('#officeCode').find(":selected").val();
			var officeName=$("#officeType option:selected").text();
			
			
			
		  if(deptName == ''){
				toastr.error('Please Select Department');
		  }else if(assessmentDate1 == ''){
				toastr.error('Please Select Assessment Period');
		  } else if(officeType == ''){
				toastr.error('Please Select Office Type');
		  }else if(officeCode == ''){
			 	toastr.error('Please Select Office Code');
		   }else
				{	
				
					var searchParameter = "residualPieReport";
					
					/*var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
												+ "\",\"selectedDept\":\"" + deptName
												+ "\",\"selectedAssessmentPeriod\":\"" +  assessmentPeriod
												+ "\",\"selectedOfficeCode\":\"" +  officeCode
												+ "\",\"selectedOfficeType\":\"" +  officeType
												+ "\"}";*/
												
												
						var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
									+ "\",\"selectedDept\":\"" + deptName
									+ "\",\"selectedAssessmentPeriod\":\"" +  assessmentDate1
									+ "\",\"selectedOfficeCode\":\"" +  officeCode
									+ "\",\"officeName\":\"" +  officeName
									+ "\",\"selectedOfficeType\":\"" +  officeType
									+ "\"}";
												
					
					document.getElementById('load').style.visibility = "visible";
					
										$.ajax({
									url: 'fetchRCSAPieGraph',
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
										
										$('#pieChart').remove();
										$('#pieChartID').append('<canvas id="pieChart" style="min-height: 250px; height: 250px; max-height: 250px; max-width: 100%;"></canvas>');

										
										//alert(obj.pieData);
										
										
										var pieData =  obj.pieData;
										checkLableArr = [];
										dataCountArr = [];
										
										var itemsArr ;
										pieData.forEach(function(items) {
											//alert(items);
											var itemsCur = items;
											itemsArr = itemsCur.split("-");
											checkLableArr.push(itemsArr[0]);
											//alert("checkLableArr "+ checkLableArr);
											dataCountArr.push(itemsArr[1]);
											//alert("dataCountArr "+ dataCountArr);
										});
										
//										var low =0;
//										var medium = 0;
//										var high = 0;
//										alert(low);
//										alert(medium);
//										alert(high);
//										
										labelList = $("#pieData").val(); 
										greenColor=$("#greenColour").val();
										amberColor=$("#amberColour").val();
										redColor=$("#redColour").val();
										
//										console.log('labelList ',labelList);
//										labelList = $("#pieData").val().replace('[', '');//"pieData"
//										labelList = labelList.replace(']', '');
//										/*labelList = labelList.split(',');*/
//										console.log('labelList ',labelList)
//										checkArr = labelList.split(',');
//										console.log('checkArr ',checkArr);
//										for (var a in checkArr) {
//											var variable = checkArr[a].split('-')[0];
//											var count = checkArr[a].split('-')[1];
//											checkLableArr.push(variable.replaceAll('~',', '));
//											dataCountArr.push(count);
//										}
										/*PIE CHART*/
										$("#low").text(dataCountArr[0]);
										$("#medium").text(dataCountArr[1]);
										$("#high").text(dataCountArr[2]);
										
										console.log('checkLableArr ',checkLableArr);
										console.log('dataCountArr ',dataCountArr);
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
										$("#officeNameTemp").text(obj.officeName);
										
										$("#hiddenDiv").show();

										/*PIE CHART*/
										//$("#pieChart").remove() ;
										
										
										
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
		