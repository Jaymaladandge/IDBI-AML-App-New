$(document).ready(function () {
		$('select option').filter(function(){
				return ($(this).val().trim()=="" && $(this).text().trim()=="");
			}).remove();
			
			$("select option").each(function() {
			  $(this).siblings('[value="'+ this.value +'"]').remove();
			});
			
			$('option').each(function() {
			    t = $(this).text();
			    $(this).text(t.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }))
			});
		});

$(function() {
	$("#controlTable").DataTable({
		"columnDefs": [
			{
				targets: [3],
				width: "30%"
			},
			{
				targets: [4],
				width: "70%"
			},
			//			{
			//				visible: true,
			//				targets: [2, 3, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 20, 21, 22],
			//
			//			},
			{
				visible: false,
				targets: [1, 2, 3, 5, 6, 7, 11, 12, 16],

			},
			{
				orderable: false,
				targets: [18, 19]

			}
		],

		"order": [0, "asc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": false,
		"searching": true,
		"fixedHeader": true,
		//"buttons": ["csv", "excel"],
		"language": {
			"emptyTable": "No Data Available",
			"search": "Search:"
		},

	}).buttons().container().appendTo(
		'#controlTable_wrapper .col-md-6:eq(0)');

});

//search by date method
function searchDateData() {


	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var range = $("#reservation").val();
	if (startDate == '') {
		toastr.info('Please Select Start Date For Search');
	} else if (endDate == '') {
		toastr.info('Please Select End Date For Search');
	}
	else if (process(startDate) > process(endDate)) {
		toastr.info('Start Date Cannot Be Greater Than End Date');
	} else {
		var pageValJson = "{\"startDate\":" + "\"" + startDate
			+ "\",\"endDate\":\"" + endDate + "\"}";
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedDateJson").val(ciphertext + ':~:' + passphrase);
		$("#searchDateForm").submit();
	}
}

$('a.closemodal').click(function() {
			$('#stmtId').text($(this).attr('id'));
			$('#closemodal').modal('show');
		});
		
// Add Toaster
$(document).ready(function() {
	
			var message = $('#message').val();
			if (message != "") {
				toastr.success(message);
			}
});


// Validating the form before submit
	$("#closeRa")
			.click(
					function() {
						var actionName = $(this).attr("name");
						var stmtId = $("#stmtId").html();
						var reason = $('#reason').val();
						var action = "XQ";
						
						if (reason == '') {
							$('span[id^="reason-error"]').remove();
							$('#reason').addClass('is-invalid');
							$('#reason')
									.after(
											'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
						} else if (reason.length < 10) {
							$('span[id^="reason-error"]').remove();
							$('#reason').addClass('is-invalid');
							$('#reason')
									.after(
											'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
						} else {
							$('span[id^="reason-error"]').remove();
							var iterationCount = 1000;
							var keySize = 128;
							//passPhrase is the key
							var passphrase = CryptoJS.lib.WordArray.random(
									128 / 8).toString(CryptoJS.enc.Hex);
							var aesUtil = new AesUtil(keySize,
									iterationCount);
							var pageValJson = "{\"riskId\":" + "\""
									+ stmtId + "\",\"riskActionStatus\":\""
									+ action + "\","
									+ "    \"riskActionName\":\""
									+ actionName + "\",\n"
									+ "  \"commentDto\":{\"comment\":\""
									+ reason + "\"}}";
							var ciphertext = aesUtil.encrypt(
									reverseText(passphrase), pageValJson);
							$("#encryptedJsonClose").val(
									ciphertext + ':~:' + passphrase);
									
							//alert("Json "+ pageValJson);
							$("#raForm").submit();
						}
					});


function process(date) {
	var parts = date.split("-");
	return new Date(parts[2], parts[1] - 1, parts[0]);
}


//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
}

//$('#collapseOne').click(
//		function() {
//		$('#collapseOne').addClass( "collapsed-card" );	
//});
//
//$('.collapseBtn').click(
//		function() {
//		$('#collapseOne').addClass( "collapsed-card" );	
//});


$('.export')
	.click(
		function() {

			var deptId = $('#selectDept').val();
			var officeType = $('#officeType').find(":selected").val();
			var officeCode = $('#officeCode').find(":selected").val();
			var assessmentDate1 = $('#assessmentDate1').find(":selected").val();
			
			
 					if(assessmentDate1 == ''){
							toastr.error('Please Select Assessment Period for Register');
					  }else if(officeType == ''){
							toastr.error('Please Select Office Type');
					  }else if(officeCode == '') {
							toastr.error('Please Select Office Code');
						} else if(deptId == ''){
						 	toastr.error('Please Select Department');
					   		}else
							{
								var searchParameter = "searchDeptwise";
								var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
																		+ "\",\"selectedDept\":\"" + deptId
																		+ "\",\"assessmentPeriod\":\"" +  assessmentDate1
																		+ "\",\"selectedOfcCode\":\"" +  officeCode
																		+ "\",\"selectOfficeType\":\"" +  officeType
																		+ "\"}";
			
									//console.log("pageValJson "+ pageValJson);
									var iterationCount = 1000;
									var keySize = 128;
									//passPhrase is the key
									var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
										.toString(CryptoJS.enc.Hex);
									var aesUtil = new AesUtil(keySize, iterationCount);
									var ciphertext = aesUtil.encrypt(reverseText(passphrase),
										pageValJson);
									$("#encryptedJsonExport").val(ciphertext + ':~:' + passphrase);
									$("#export").submit();
									
									document.getElementById('load').style.visibility = "disable";
								
									
							}


//
//			//alert("Function Called");
//			if($('#selectDept').find(":selected").val() =="" || $('#selectDept').find(":selected").val() == null)
//			{	
//				
//				$('#collapseOne').removeClass( "collapsed-card" );
//				//$($(".btn-tool").data('target')).collapse('show')
//				//$($(".btn-tool").data('target')).collapse('show');
//				toastr.error('Please Select Department');
//			}
//			else{
//				//alert($('#selectDept').find(":selected").val());
//			var riskDept = $('#selectDept').find(":selected").val();
//			
//			//alert(riskDept);
//
//			if (riskDept == null || riskDept == "") {
//				searchParameter = "All";
//				riskDept = $('userDeptId').val();
//			}else
//			{
//				searchParameter = "searchDeptwise";
//			}
//
//			
//			var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
//				+ "\",\"searchValue\":\"" + riskDept + "\"}";
//
//			//alert(" pageValJson "+ pageValJson);
//			//document.getElementById('load').style.visibility = "visible";
//
//			var iterationCount = 1000;
//			var keySize = 128;
//			//passPhrase is the key
//			var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
//				.toString(CryptoJS.enc.Hex);
//			var aesUtil = new AesUtil(keySize, iterationCount);
//			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
//				pageValJson);
//			$("#encryptedJsonExport").val(ciphertext + ':~:' + passphrase);
//			$("#export").submit();
//			
//			document.getElementById('load').style.visibility = "disable";
//			}


			

		});

$('a.viewControlModal')
	.click(
		function() {
			var riskId = $(this).attr('id');
			var pageValJson = "{\"riskId\":" + "\""
				+ riskId + "\"}";
			document.getElementById('load').style.visibility = "visible";
			// ajax call
			$
				.ajax({
					url: 'viewRiskModal',
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
									.getElementById('interactive');
								document
									.getElementById('load').style.visibility = "hidden";
								document
									.getElementById('contents').style.visibility = "visible";
							}, 1000);
						var jsonResponse = JSON
							.stringify(response);
						var obj = JSON.parse(jsonResponse);

						$('#controlId').val(obj.riskId);
						$('#recordstatus').val(
							obj.riskStatus);
						$('#controlDept').val(obj.riskDept);
						$('#controlFunction')
							.val(obj.riskFunction);
						$('#controlName').val(
							obj.riskName);
						$('#controlAssessmentFreq').val(
							obj.riskAssessmentFreq);

						var riskName = obj.riskName;
						$('#classification').val(
							obj.riskClassification);
						$('#subrisk').val(
							obj.subRiskClassification);

						var rowCount = $('#capturetbl tr').length;
						if (rowCount == 1) {
							$('#asrDiv').hide();
						} else {
							$('#asrDiv').show();
						}

						$('#linkedModuleTbl tr:gt(0)').remove();
						$('#previousMatrix tr:gt(0)').remove();
						$('#modalFileId tr:gt(0)').remove();


						/* LInked Controls Start*/
						if (obj.riskCntrlLinkList.length > 0) {
							obj.riskCntrlLinkList
								.forEach(function(item) {
									$(
										'#linkedModuleTbl tr:last')
										.after(
											'<tr role="row" class="odd" id="row_id"><td class="sorting_1">'
											+ item.controlId
											+ '</td><td>'
											+ item.cntrlFunName
											+ '</td><td>'
											+ item.cntrlName
											+ '</td>>'
											+ '<td>'
											+ item.cntrlAssessmentFreq
											+ '</td></tr>');
								});

							var seen = {};

							$('#linkedModuleTbl tr')
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

							$('#asrDiv').show();
						}

						/** Linked Controls End */

						/* Risk Assessment Details */

						if (obj.matrixCalcList.length > 0) {
							obj.matrixCalcList
								.forEach(function(items) {
									$(
										'#previousMatrix tr:last')
										.after(
											'<tr><td>'
											+ riskName
											+ '</td><td>'
											+ items.impactRatingScale
											+ '</td><td>'
											+ items.likelihoodRatingScale
											+ '</td><td class="text-capitalize"> <span class="badge text-white" style="background-color:'
											+ items.colorCode
											+ '">'
											+ items.assessmentRatingScale
											+ '</span></td><td>'
											+ items.assessmentDate
											+ '</td>'
											+ '<td>'
											+ items.makerId
											+ '</td></tr>');
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




						if (obj.filedetailsList.length > 0) {
							obj.filedetailsList
								.forEach(function(item) {
									$(
										'#modalFileId tr:last')
										.after(
											'<tr><td>'
											+ item.fileName
											+ '</td><td>'
											+ item.fileSize
											+ '</td><td class="text-capitalize">'
											+ item.uploadedBy
											+ '</td><td>'
											+ item.uploadTimestamp
											+ '</td><td><div class="btn-group btn-group-sm">'
											+ '<a name=' + item.fileName + ' href="#" class="btn btn-info downloadfile"><i '
											+ ' class="fas fa-download"></i></a>'
											+ '</div></td></tr>');
								});
							var seen = {};
							$('#modalFileId tr')
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
							$('#fileDiv').show();
						}
						$('#controlmodal').modal('show');
					},
					error: function(xhr, status, error) {
						toastr
							.success('Some Error Occured');
					}
				});
		});



// Ajax call for office type selection
// fetch office code
$('#officeType').change(
		function() {
			
			
			var currentDept = $('#currentDept').val();
			
				
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
		
			
		});
		




// department select
// selectDept
//$('#selectDept')
//	.change(
//		function() {
			
$("#getReport").click(function() {
	
			
			var deptId = $('#selectDept').val();
			var officeType = $('#officeType').find(":selected").val();
			var officeCode = $('#officeCode').find(":selected").val();
			var assessmentDate1 = $('#assessmentDate1').find(":selected").val();
			
			
 					if(assessmentDate1 == ''){
							toastr.error('Please Select Assessment Period for Register');
					  }else if(officeType == ''){
							toastr.error('Please Select Office Type');
					  }else if(officeCode == '') {
							toastr.error('Please Select Office Code');
						} else if(deptId == ''){
						 	toastr.error('Please Select Department');
					   		}else
							{	
			

									var searchParameter = "searchDeptwise";
									
									var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
																		+ "\",\"selectedDept\":\"" + deptId
																		+ "\",\"assessmentPeriod\":\"" +  assessmentDate1
																		+ "\",\"selectedOfcCode\":\"" +  officeCode
																		+ "\",\"selectOfficeType\":\"" +  officeType
																		+ "\"}";
			
									//console.log("pageValJson "+ pageValJson);
									// var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
									// 		+ "\",\"searchValue\":\"" + dept + "\"}";
						
									document.getElementById('load').style.visibility = "visible";


										// ajax call
										$
											.ajax({
												url: 'fetchRegisterForOfcCode',
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
							
													//alert("Object " + obj);
													$(".registerBody").empty();
							
													$('#controlTable').dataTable()
														.fnClearTable();
													$('#controlTable').DataTable()
														.destroy();
							
													obj.registerList
														.forEach(function(item) {
							
															//$('#actionplantable tr:last').after(
															//alert("Risk Id "+ item.riskId);
							
															if (item.riskId)
																$(
																	"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
																	+ item.srNo
																	+ "</td>"
																	+ "<td>"
																	+ item.riskId
																	+ "</td>"
																	+ "<td>"
																	+ item.riskFunction
																	+ "</td>"
							
																	+ "<td>"
																	+ item.riskDept
																	+ "</td>"
							
																	+ "<td>"
																	+ item.riskDescription
																	+ "</td>"
							
																	+ "<td>"
																	+ item.riskClassification
																	+ "</td>"
							
							
																	+ "<td>"
																	+ item.subRiskClassification
																	+ "</td>"
							
							
																	+ "<td>"
																	+ item.riskImpact
																	+ "</td>"
							
							
																	+ "<td>"
																	+ item.probRiskEvent
																	+ "</td>"
							
							
																	+ "<td>"
																	+ item.financeImpact
																	+ "</td>"
							
																	+ "<td><span class='badge text-white' style='background-color:"
																	+ item.inherentRiskStatusCol
																	+ "'; >"
																	+ item.severityLevel
																	+ "</span></td>"
							
																	+ "<td>"
																	+ item.controlDescription
																	+ "</td>"
							
							
																	+ "<td>"
																	+ item.cntrlOwner
																	+ "</td>"
							
							
																	+ "<td><span class='badge text-white' style='background-color:"
																	+ item.controlEffectivenessCol
																	+ "'; >"
																	+ item.cntrlEffectiveness
																	+ "</span></td>"
							
																	+ "<td><span class='badge text-white' style='background-color:"
																	+ item.residualRiskCol
																	+ "'; >"
																	+ item.residualRiskRating
																	+ "</span></td>"
							
							
																	+ "<td><span class='badge text-white' style='background-color:"
																	+ item.recordStatusCol
																	+ "'; >"
																	+ "Open"
																	+ "</span></td>"
							
																	+ "<td>"
																	+ item.keyMitigationMeasures
																	+ "</td>"
																	
																	+ "<td>"
																	+ item.selectedOfcCode
																	+ "</td>"
							
																	+ "</td><td class='project-actions text-center'><span><a data-pagename='riskRegister' class='btn-sm bg-primary checkRiskData'"
																	+ "id='"
																	+ item.riskId
																	+ "' "
																	+ "title='Detailed View'> <i "
																	+ "class='fas fa-glasses text-white'></i></a>"
																	+ "	</span></td>"
							
																	+"<td><span><a class='btn btn-sm bg-navy closemodal disabled' title='Close'> <i class='fas fa-times-circle'></i></a></span> </td>"
							
							
																	+ "</tr>")
																	.appendTo(
																		".registerBody");
							
														});
							
													$("#controlTable").DataTable({
														"columnDefs": [
															{
																targets: [3],
																width: "30%"
															},
															{
																targets: [4],
																width: "70%"
															},
															//			{
															//				visible: true,
															//				targets: [2, 3, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 20, 21, 22],
															//
															//			},
															{
																visible: false,
																targets: [1, 2, 5, 6, 7, 11, 12, 16],
												
															},
															{
																orderable: false,
																targets: [17, 18]
												
															}
														],
							
														"order": [0, "asc"],
														"responsive": false,
														"lengthMenu": [25, 50, 75, 100],
														"autoWidth": false,
														"searching": true,
														"fixedHeader": true,
														//"buttons": ["csv", "excel"],
														"language": {
															"emptyTable": "No Data Available",
															"search": "Search:"
														},
							
													}).buttons().container().appendTo(
														'#controlTable_wrapper .col-md-6:eq(0)');
							
													$("#assessmentText").text(assessmentDate1);
							
													console.log(obj);
							
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

// Audit trail   
$('a.viewAuditTrail')
	.click(
		function() {
			var userId = $(this).attr('id');
			var pageValJson = "{\"activityImpactTblKey\":"
				+ "\"" + userId + "\"}";
			document.getElementById('load').style.visibility = "visible";

			$("#auditLabelId").text(userId);

			// ajax call
			$
				.ajax({
					url: 'viewAuditTrail',
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
									.getElementById('interactive');
								document
									.getElementById('load').style.visibility = "hidden";
								document
									.getElementById('contents').style.visibility = "visible";
							}, 1000);

						var jsonResponse = JSON
							.stringify(response);
						var obj = JSON.parse(jsonResponse);
						$(".timeline-inverse").empty();
						obj
							.forEach(function(items) {
								$(
									"<p class='test'><div class='time-label'><span class='bg-success'>"
									+ items.actDate
									+ "</span></div>"
									+ "<div><i class='fas fa-comments bg-warning'></i>"
									+ "<div class='timeline-item'>"
									+ "<h3 class='timeline-header text-capitalize'><a href='#'>"
									+ items.userName
									+ " "
									+ " ("
									+ items.userRole
									+ ") </a>"
									+ items.actionPerformed
									+ "</h3>"
									+ "<div class='timeline-body'>"
									+ items.actionComment
									+ "</div>"
									+ "</div>"
									+ "</div>"
									+ "</p>")
									.appendTo(
										".timeline-inverse");

							});


						$(
							"<div> <i class='far fa-clock bg-gray'></i> </div>")
							.appendTo(
								".timeline-inverse");
						$('#timelinelink').css('class',
							'border');
						$('#timelinelink').css('display',
							'');
						$('#timelinelink').click();

						console.log(obj);

					},
					error: function(xhr, status, error) {
						console.log(xhr);
						console.log(status);
						console.log(error);
						toastr
							.success('Some Error Occured');
					}
				});
		});


//edit control
$(".editRisk").click(
	function() {
		var riskId = $(this).attr('id');
		var pageValJson = "{\"riskId\":" + "\"" + riskId
			+ "\"}";
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJsonEdit")
			.val(ciphertext + ':~:' + passphrase);
		$("#controlForm").submit();
	});

//search method
function searchData() {
	var searchParam = $('#dimension').find(":selected").val();
	var searchValue = $('#searchcriteria').val().toUpperCase();
	if (searchParam == '') {
		toastr.info('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.info('Please Add Some Value For Search');
	} else {
		if (searchParam == 'controlStatus') {
			if (searchValue.includes('PENDING APPROVAL')) {
				searchValue = 'D';
			} else {
				searchValue = searchValue.charAt(0);
			}
		}
		var sortValue = $('#sorting').find(":selected").val();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam
			+ "\",\"searchValue\":\"" + searchValue
			+ "\",\"sortValue\":\"" + sortValue + "\"}";
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$("#searchForm").submit();
	}
}

// view Risk Register By Id
$(".registerBody").on("click", "a.checkRiskData", function(){
   // alert("Function Called");
	
			var riskId = $(this).attr('id');
			var pageName = $(this).attr("data-pagename");
			//var searchValue = $("#selectDept").find(":selected").val();
			//alert("Risk Id "+ riskId);
			//alert(riskId);
			var pageValJson = "{\"riskId\":" + "\""
				+ riskId 
				+ "\",\"pageName\":\"" + pageName
				+ "\"}";

			document.getElementById('load').style.visibility = "visible";
			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
				.toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
				pageValJson);
			$("#encryptedJsonReg").val(ciphertext + ':~:' + passphrase);
			
			$("#registerForm").submit();

});

//$('a.checkRiskData')
//	.click(
//		function() {
//			alert("Function Called");
//			var riskId = $(this).attr('id');
//			//alert(riskId);
//			var pageValJson = "{\"riskId\":" + "\""
//				+ riskId + "\"}";
//
//			document.getElementById('load').style.visibility = "visible";
//
//			var iterationCount = 1000;
//			var keySize = 128;
//			//passPhrase is the key
//			var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
//				.toString(CryptoJS.enc.Hex);
//			var aesUtil = new AesUtil(keySize, iterationCount);
//			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
//				pageValJson);
//			$("#encryptedJsonReg").val(ciphertext + ':~:' + passphrase);
//			$("#registerForm").submit();
//
//		});
