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

$('#downloadPie').click(function(event) {
		
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
			title : 'RCSA - Residual Assessment ' + assessmentDate,

		} ]
	}).buttons().container().appendTo(
			'#rcsaGraphTable_wrapper .col-md-6:eq(0)');
		
});

$(function() {
	var assesmentId = $("#assesmentDate").val();
	if (assesmentId == 'Default') {
		//$("#divHide").hide();
	} else {
		//$("#divHide").show();
	}
	
	var userDeptName = $("#userDeptName").val();
	
	if (userDeptName != 'ERM') {
		$("#officeType").prop("disabled", true);
		$("#officeCode").prop("disabled", true);
		$("#creationPeriod").prop("disabled", true);
		$("#getReport").prop("disabled", true);
		$("#getReport").prop("readonly", true);
		$("#divHide").hide();
	}
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();

	var currentdate = new Date();
	var datetime = +currentdate.getDate() + "/"
			+ (currentdate.getMonth() + 1) + "/"
			+ currentdate.getFullYear() + "_" + currentdate.getHours()
			+ ":" + currentdate.getMinutes() + ":"
			+ currentdate.getSeconds();
			
	var assessmentDate = $("#seleectedAssessmentDate").val();

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
			title : 'RCSA - Residual Assessment ' + assessmentDate,

		} ]
	}).buttons().container().appendTo(
			'#rcsaGraphTable_wrapper .col-md-6:eq(0)');
});

var list = [];
var deptList = [];
var high = [];
var low = [];
var medium = [];
var qList = [];
var data = [];
var $visitorsChart = $('#visitors-chart')
var ticksStyle = {
	fontColor : '#495057',
	fontStyle : 'bold'
}
// eslint-disable-next-line no-unused-vars
var mode = 'index'
var intersect = true

$(document).ready(function() {

	list = $('#trendData').val();
	var temp = $('#trendData').val();
	if(temp != ''){
	list = list.replace('[', '');
	list = list.replace(']', '');
	qList = list.split(',');

	$.each(qList, function(index, value) {
		data = value.split('~');
		deptList.push(data[0]);
		low.push(data[3]);
		medium.push(data[4]);
		high.push(data[5]);

		// List
		// Department | count | low % | medium % | high % 
	});
	var visitorsChart = new Chart($visitorsChart, {
		data : {
			labels : deptList,
			datasets : [ {
				type : 'line',
				label : 'Low',
				data : low,
				backgroundColor : 'transparent',
				borderColor : '#28A745',
				pointBorderColor : '#28A745',
				pointBackgroundColor : '#28A745',
				fill : false
			// pointHoverBackgroundColor: '#007bff',
			// pointHoverBorderColor : '#007bff'
			}, {
				type : 'line',
				label : 'Medium',
				data : medium,
				backgroundColor : 'tansparent',
				borderColor : '#FFBF00',
				pointBorderColor : '#FFBF00',
				pointBackgroundColor : '#FFBF00',
				fill : false
			// pointHoverBackgroundColor: '#ced4da',
			// pointHoverBorderColor : '#ced4da'
			}, {
				type : 'line',
				label : 'High',
				data : high,
				backgroundColor : 'tansparent',
				borderColor : '#FF0000',
				pointBorderColor : '#FF0000',
				pointBackgroundColor : '#FF0000',
				fill : false
			// pointHoverBackgroundColor: '#ced4da',
			// pointHoverBorderColor : '#ced4da'
			} ]
		},
		options : {
			maintainAspectRatio : false,
			tooltips : {
				mode : mode,
				intersect : intersect
			},
			hover : {
				mode : mode,
				intersect : intersect
			},
			legend : {
				display : true
			},
			scales : {
				yAxes : [ {
					// display: false,
					scaleMinSpace : 100,
					gridLines : {
						display : true,
						lineWidth : '4px',
						color : 'rgba(0, 0, 0, .2)',
						zeroLineColor : 'transparent'
					},
					scaleLabel : {
						display : true,
						labelString : 'Percentage'
					},
					ticks : $.extend({
						beginAtZero : true,

					}, ticksStyle)
				} ],
				xAxes : [ {
					display : true,
					gridLines : {
						display : true
					},
					scaleLabel : {
						display : true,
						labelString : 'Departments'
					},
					ticks : ticksStyle
				} ]
			}
		}
	})
		
	}
	

})

// Office Type Changes
$(function() {

	$("#officeType")
			.change(
					function() {
						var userOffice = $("#officeType").val();
						var userOfficeText = $("#officeType option:selected").text();
						var pageValJson = "{\"officeType\":" + "\""
								+ userOffice + "\"}";

						document.getElementById('load').style.visibility = "visible";

						// ajax call
						$
								.ajax({
									url : 'DeptRiskOfficeWise',
									type : "POST",
									data : {
										pageValJson : pageValJson
									},// important line for thymeleaf http security

									headers : {
										"X-CSRF-TOKEN" : $(
												"input[name='_csrf']")
												.val()
									},
									cache : false,
									// async:true,
									success : function(response) {
										setTimeout(
												function() {
													document
															.getElementById('load').style.visibility = "hidden";
												}, 1000);

										var jsonResponse = JSON
												.stringify(response);

										obj = JSON.parse(jsonResponse);

										if (obj.officeCodeList != null) {
											$("#officeCode").empty();
											/* $("<option />", {
													val: "",
													text: "Select Department"
												}).appendTo($("#officeCode")); */
											obj.officeCodeList
													.forEach(function(
															items) {

														$(
																"<option />",
																{
																	val : items.officeCode,
																	text :items.officeCode
																})
																.appendTo(
																		$("#officeCode"));

													});
										}
										$('.select2').select2();

									},
									error : function(xhr, status, error) {
										console.log(xhr);
										toastr
												.error('Some Error Occured here	');
									}

								});
					});

});

// reload Function
$("#reload").click(function() {
	location.reload();
});

$("#getReport").click(
		function() {
			
			var userDeptName = $("#userDeptName").val();
	
	if (userDeptName == 'ERM') {

			var search = "filtered";
			var selectedValue = "";
			var deptId = "";
			var ofcCode = "";
			deptId = $('#riskDept :selected').val();
			var pageValJson = "";
			if ($("#officeType").val() === "") {
				toastr.error("Please Select Office Type");
			} else {
				selectedValue = $('#officeType :selected').val();
			}

			if ($("#officeCode").val() === "") {
				toastr.error("Please Select Office Code");
			} else {
				ofcCode = $('#officeCode :selected').val();
			}
	if (selectedValue != null && selectedValue != "") {
		if (ofcCode != null && ofcCode != "") {

			pageValJson = "{\n" + "    \"officeType\": \""
					+ selectedValue + "\",\n"
					+ "    \"selectedAssessmentPeriod\": \""
					+ $("#creationPeriod").find(":selected").val() + "\",\n"
					+ "    \"officeName\": \""
					+ $("#officeType option:selected").text() + "\",\n"
					+ "    \"searchParam\": \"" + search
					+ "\",\n" + "    \"filterCode\": \""
					+ $("#officeCode").val() + "\"\n" + "}";

			//	document.getElementById('load').style.visibility = "disable";
			var iterationCount = 1000;

			var keySize = 128;
			//passPhrase is the key	
			var passphrase = CryptoJS.lib.WordArray.random(
					128 / 8).toString(CryptoJS.enc.Hex);

			var aesUtil = new AesUtil(keySize, iterationCount);

			var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), pageValJson);

			$("#encryptedJson").val(
					ciphertext + ':~:' + passphrase);
			$("#frmGraph").submit();

			//document.getElementById('load').style.visibility = "disable";
		}
	}
	
	}
	else{
		toastr.error("This Report will be available for ERM Department Only");
	}
});



// Risk Modal
$('a.riskmodal').click(function() {

	var officeId = $(this).attr('id');
	var assesmentId = $("#assesmentDate").val();
	
	if(assesmentId =='Default'){
		assesmentId = $("#seleectedAssessmentDate").val();
	}

	//var sourceName="createVerify";
	var pageValJson = "{\"selectedAssessmentPeriod\":"
			+ "\"" + assesmentId
			+ "\",\"selectedOfficeId\":\"" + officeId
			+ "\"}";

	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$
			.ajax({
				url : 'viewRiskAssessmentList',
				type : "POST",
				data : {
					pageValJson : pageValJson
				},// important line for thymeleaf http security
				headers : {
					"X-CSRF-TOKEN" : $(
							"input[name='_csrf']")
							.val()
				},
				cache : false,
				// async:true,
				success : function(response) {
					setTimeout(
							function() {
								document
										.getElementById('interactive');
								document
										.getElementById('load').style.visibility = "hidden";
								document
										.getElementById('contents').style.visibility = "visible";
							}, 1000);
					var jsonResponse = JSON
							.stringify(response);
					var obj = JSON.parse(jsonResponse);

					//$('#previousMatrix').dataTable().fnClearTable();
					//$('#previousMatrix').DataTable().destroy();

					$('#controlDept').val(obj.riskDept);
					$('#status').val("View");

					$('#linkedModuleTbl tr:gt(0)')
							.remove();
					$('#previousMatrix tr:gt(0)')
							.remove();
					$('#modalFileId tr:gt(0)').remove();

					/* Risk Assessment Details */
					var i = 1;
					if (obj.registerList.length > 0) {
						obj.registerList
								.forEach(function(items) {
									$(
											'#previousMatrix tr:last')
											.after(
													'<tr><td>'
															+ i++
															+ '</td><td>'
															+ items.riskDescription
															+ '</td>'

															+ "<td><span class='badge text-white' style='background-color:"
												+ items.inherentRiskStatusCol
												+ "'; >"
															+ items.severityLevel
															+ "</span></td>"

															+ "<td><span class='badge text-white' style='background-color:"
												+ items.residualRiskCol
												+ "'; >"
															+ items.residualRiskRating
															+ "</span></td>"

															+ "<td>"
															+ items.srNo
															+ "</td>"

															+ '<td class="text-capitalize"> <span class="badge text-white" style="background-color:'
												+ items.riskStatusColor
												+ '">'
															+ items.riskStatus
															+ '</span></td>'

															+ '</tr>');
								});

						var seen = {};

						$('#previousMatrix tr')
								.each(
										function() {
											var txt = $(
													this)
													.text();
											if (seen[txt])
												$(this)
														.remove();
											else
												seen[txt] = true;
										});

						$('#previousMatrixRow').show();
					}

					/* Risk Assessment Details End */

					$('#riskmodal').modal('show');
				},
				error : function(xhr, status, error) {
					toastr
							.success('Some Error Occured');
				}
			});
});