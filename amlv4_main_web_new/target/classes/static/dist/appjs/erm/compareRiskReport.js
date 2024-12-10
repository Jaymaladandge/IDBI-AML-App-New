/*Global Variable*/

var deptIdExport = "";
var assessmentDate1Export = "";
var assessmentDate2Export = "";
var officeCodeExport = "";
var officeTypeExport = "";
var currentDept = "";
var officeType = "";
var officeCode = "";
var assessmentDate1 = "";
var assessmentDate2 = "";
var deptId = "";

/*Global Variable*/

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
			{
				visible: false,
				targets: [1, 2, 5, 6, 7, 11, 12, 16],
			},
			{
				orderable: false,
				targets: [17, 18]
			}
		],
		"order": [[1, "asc"]],
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

		/*$(function() {
	$("#riskDetailsTable").DataTable({
		"columnDefs":  [ {
					orderable : false,
				
				} ],
		        "order" : [ 0, "desc" ],
				"responsive" : false,
				"lengthMenu" : [ 10,25, 50, 75, 100 ],
				"autoWidth" : true,
				"searching" : true,
				"fixedHeader" : true,
				 "buttons": ["csv", "excel", "pdf", "print"],
				"language" : {
					"emptyTable" : "No Data Available"
				}
	}).buttons().container().appendTo(
		'#riskDetailsTable_wrapper .col-md-6:eq(0)');
});
*/

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
	
	$("#card-body1").hide();
	$("#compare-body2").hide();
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


// fetch office code
$("#officeType").change(function () {
			 
			 
			 var userOffice=$('#officeType').find(":selected").val().toUpperCase();
			 var userOfficeType='';
			 if(userOffice=='CENTRAL OFFICE'){
				 userOfficeType='CO';
			 }else if(userOffice=='ZONAL OFFICE'){
				 userOfficeType='ZO';
			 }else if(userOffice=='DIVISIONAL OFFICE'){
				 userOfficeType='DO';
			 }else if(userOffice=='BRANCH OFFICE'){
				 userOfficeType='BO';
			 }
			 
			 
			 
			 var pageValJson = "{\"officeType\":" + "\""+ userOfficeType + "\"}";
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
							$("#selectDept").empty();
							
								
								
								$("<option />", {
									val: "",
									text: "Select Department"
								}).appendTo($("#selectDept"));
							$("<option />", {
								val: "ALL",
								text: "ALL"
							}).appendTo($("#selectDept"));
							
							obj.deptList.forEach(function(items) {
								

								$("<option />", {
									val: items.deptId,
									text: items.deptName
								}).appendTo($("#selectDept"));


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
									text: items.officeCode
								}).appendTo($("#officeCode"));


							});
							}
							$("#officeCodeDropDown").show();
							$('.select2').select2();
							
				},
				error: function(xhr, status, error) {
					console.log(xhr);
					toastr
						.error('Some Error Occured here	');
				}
			
		});
 	
	});

$("#getReport").click(function() {

	var currentDept = null;
	var officeType = null;
	var assessmentDate1 = null;
	var assessmentDate2 = null;
	var deptId = null;

	currentDept = $('#currentDept').val();
	officeType = $('#officeType').find(":selected").val();
	assessmentDate1 = $('#assessmentDate1').find(":selected").val();
	assessmentDate2 = $('#assessmentDate2').find(":selected").val();
	deptId = $('#selectDept').val();

	if (currentDept != 'ERM') {
		officeCode = $('#officeCode').find(":selected").val();
		if (officeCode == '') {
			toastr.error('Please Select Office Code');
			e.preventDefault();
		}
	}
	else {
		var officeCode = "ALL";
	}
	if (assessmentDate1 == '') {
		toastr.error('Please Select First Assessment Period for Compare');
	} else if (assessmentDate1 == assessmentDate2) {
		toastr.error('Select Different Assessment Period');
	} else if (officeType == '') {
		toastr.error('Please Select Office Type');
	} else if (deptId == '') {
		toastr.error('Please Select Department');
	} else {

		officeCode = $('#officeCode').find(":selected").val();
		officeCodeExport = officeCode;
		var searchParameter = "compareReports";

		var pageValJson = "{\"searchParameter\":" + "\"" + searchParameter
			+ "\",\"selectedDept\":\"" + deptId
			+ "\",\"selectedAssessmentPeriod\":\"" + assessmentDate1
			+ "\",\"selectedAssessmentPeriod2\":\"" + assessmentDate2
			+ "\",\"selectedOfficeCode\":\"" + officeCode
			+ "\",\"officeName\":\"" + $("#officeType option:selected").text()
			+ "\",\"selectedOfficeType\":\"" + officeType
			+ "\"}";

		console.log("pageValJson " + pageValJson);

		document.getElementById('load').style.visibility = "visible";
		$("#card-body1").hide();
		$("#compare-body2").hide();
		// ajax call
		$.ajax({
			url: 'assessmentsCompareInherentAndResidual',
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

						document.getElementById('load').style.visibility = "hidden";

					}, 1000);

				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);

				console.log(obj);
				console.log(obj.riskAssessmentDtoList);

				$(".registerBodyCorp").empty();
				$('#corpviewTable').dataTable()
					.fnClearTable();
				$('#corpviewTable').DataTable()
					.destroy();
					
				if(obj.corporationList != null){
					var severe='SEVERE';
					var moderate='MODERATE';
					var minor='MINOR';
					var high='HIGH';
					var medium='MEDIUM';
					var low='LOW';
					
				obj.corporationList.forEach(function(item) {

					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ item.corporationalAssPeriod
						+ "</td>"
						+ "<td>"
						+ item.corporationalOfc
						+ "</td>"
						+ "<td class='text-bold text-blue '>"
						+ item.corporationalTotalNoRisk
						+ "</td>"
						+ "<td class=' text-right '>"
						+ item.corporationalTotalNoRiskAssessed
						+ "</td>"
						+ "<td class='text-bold text-right text-red'  id='"+severe+'~'+item.corporationalAssPeriod+'~'+item.corporationSevereCount+"' onclick='viewRiskData(this.id)'><a href='#'>"
						+ item.corporationSevereCount
						+ "</a></td>"
						+ "<td class='text-bold text-right text-orange' id='"+moderate+'~'+item.corporationalAssPeriod+'~'+item.corporationSevereCount+"' onclick='viewRiskData(this.id)'><a href='#'>"
						+ item.corporationModerateCount
						+ "</a></td>"
						+ "<td class='text-bold text-right text-green' id='"+minor+'~'+item.corporationalAssPeriod+'~'+item.corporationSevereCount+"' onclick='viewRiskData(this.id)'><a href='#'>"
						+ item.corporationMinorCount
						+ "</a></td>"
						+ "<td class='text-bold text-right text-red' id='"+high+'~'+item.corporationalAssPeriod+'~'+item.corporationSevereCount+"' onclick='viewRiskData(this.id)'><a href='#'>"
						+ item.corporationHighCount
						+ "</a></td>"
						+ "<td class='text-bold text-right text-orange' id='"+medium+'~'+item.corporationalAssPeriod+'~'+item.corporationSevereCount+"' onclick='viewRiskData(this.id)'><a href='#'>"
						+ item.corporationMediumCount
						+ "</a></td>"
						+ "<td class='text-bold text-right text-green' id='"+low+'~'+item.corporationalAssPeriod+'~'+item.corporationSevereCount+"' onclick='viewRiskData(this.id)'><a href='#'>"
						+ item.corporationLowCount
						+ "</a></td>"
						+ "</tr>")
						.appendTo(
							".registerBodyCorp");

				});
				
				$("#officeHeader").text($("#officeType option:selected").text()+' - '+officeCode);

				$("#corpviewTable").DataTable({
					"columnDefs": [
						{
							targets: [2],
							width: "12%"
						},
						{
							targets: [3],
							width: "12%"
						},
						{
							targets: [4],
							width: "12%"
						},
						{
							orderable: false,
							targets: [0]
						}],

					"responsive": false,
					"autoWidth": false,
					"pagination":false,
					"ordering": false,
					"searching": false,
					"fixedHeader": true,


				}).buttons().container().appendTo(
					'#corpviewTable_wrapper .col-md-6:eq(0)');
					

				$('#corpassPeriod1').text("Inherent Risk Assessment");
				$('#corpassPeriod2').text("Residual Risk Assessment");
				$('#riskstmttable').show();

				$('#card-body').show();
				$('#cardheaderCorp').text('Corporation View');

				}
				$(".registerBody").empty();
				$('#riskstmttable').dataTable()
					.fnClearTable();
				$('#riskstmttable').DataTable()
					.destroy();

				obj.riskAssessmentDtoList
					.forEach(function(item) {

						//$('#actionplantable tr:last').after(
						//alert("Risk Id "+ item.selectedOfficeId);
						if (item.deptName) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ item.assessmentPeriod
								+ "</td>"
								+ "<td>"
								+ item.deptName
								+ "</td>"
								+ "<td class='text-right'><a href='#' class='text-bold text-blue viewRisk' data-assessmentDate='"
								+ item.assessmentPeriod
								+ "' data-toggle='modal' id='"
								+ item.selectedOfficeId
								+ "'</a>"
								+ item.totalNoOfRisk
								+ "</td>"
								+ "<td class='text-right'>"
								+ item.totalNoRiskAssessed
								+ "</td>"
								+ "<td class='text-bold text-right text-red'>"
								+ item.severe
								+ "</td>"
								+ "<td class='text-bold text-right text-orange'>"
								+ item.moderate
								+ "</td>"
								+ "<td class='text-bold text-right text-green'>"
								+ item.minor
								+ "</td>"
								+ "<td class='text-bold text-right  text-red'>"
								+ item.high
								+ "</td>"
								+ "<td class='text-bold text-right text-orange'>"
								+ item.medium
								+ "</td>"
								+ "<td class='text-bold text-right text-green'>"
								+ item.low
								+ "</td>"
								+ "</tr>")
								.appendTo(
									".registerBody");

						}

					});

				$("#riskstmttable").DataTable({
					"columnDefs": [
						{
							targets: [2],
							width: "12%"
						},
						{
							targets: [3],
							width: "12%"
						},
						{
							targets: [4],
							width: "12%"
						},
						{
							orderable: true,
							targets: [0]
						}],

					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"ordering": false,
					"searching": true,
					"fixedHeader": true,

					"language": {
						"emptyTable": "No Data Available",
						"search": "Search Department:"
					},


				}).buttons().container().appendTo(
					'#riskstmttable_wrapper .col-md-6:eq(0)');

				$('#assPeriod1').text("Inherent Risk Assessment");
				$('#assPeriod2').text("Residual Risk Assessment");
				$('#riskstmttable').show();

				$('#card-body').show();
				$('#card-header').text('Compare Risk Assessment');
				
				// show hidden div
				$('#export-btn').show();
				$('#card-body').show();
				$('#compare-body').show();
				
				$("#card-body1").show();
				$("#compare-body2").show();

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


$('.exportExcel').click(function() {


	//deptIdExport = deptId;
	//assessmentDate1Export = assessmentDate1;
	//assessmentDate2Export = assessmentDate2;

	//officeTypeExport = officeType;
	
	/*currentDept = $('#currentDept').val();
	officeType = $('#officeType').find(":selected").val();
	assessmentDate1 = $('#assessmentDate1').find(":selected").val();
	assessmentDate2 = $('#assessmentDate2').find(":selected").val();
	deptId = $('#selectDept').val();

	if (currentDept != 'ERM') {
		officeCode = $('#officeCode').find(":selected").val();
		if (officeCode == '') {
			toastr.error('Please Select Office Code');
			e.preventDefault();
		}
	}
	else {
		var officeCode = "ALL";
	}


	var pageValJson = "{\"searchParameter\":" + "\"" + "ExportReport"
		+ "\",\"selectedDept\":\"" + deptId
		+ "\",\"selectedAssessmentPeriod\":\"" + assessmentDate1
		+ "\",\"selectedAssessmentPeriod2\":\"" + assessmentDate2
		+ "\",\"selectedOfficeCode\":\"" + officeCode
		+ "\",\"selectedOfficeType\":\"" + officeType
		+ "\"}";*/
		
		var currentDept = null;
	var officeType = null;
	var assessmentDate1 = null;
	var assessmentDate2 = null;
	var deptId = null;

	currentDept = $('#currentDept').val();
	officeType = $('#officeType').find(":selected").val();
	assessmentDate1 = $('#assessmentDate1').find(":selected").val();
	assessmentDate2 = $('#assessmentDate2').find(":selected").val();
	deptId = $('#selectDept').val();

	if (currentDept != 'ERM') {
		officeCode = $('#officeCode').find(":selected").val();
		if (officeCode == '') {
			toastr.error('Please Select Office Code');
			e.preventDefault();
		}
	}
	else {
		var officeCode = "ALL";
	}
	if (assessmentDate1 == '') {
		toastr.error('Please Select First Assessment Period for Compare');
	} else if (assessmentDate1 == assessmentDate2) {
		toastr.error('Select Different Assessment Period');
	} else if (officeType == '') {
		toastr.error('Please Select Office Type');
	} else if (deptId == '') {
		toastr.error('Please Select Department');
	} else {

		officeCode = $('#officeCode').find(":selected").val();
		officeCodeExport = officeCode;
		var searchParameter = "compareReports";

		var pageValJson = "{\"searchParameter\":" + "\"" + searchParameter
			+ "\",\"selectedDept\":\"" + deptId
			+ "\",\"selectedAssessmentPeriod\":\"" + assessmentDate1
			+ "\",\"selectedAssessmentPeriod2\":\"" + assessmentDate2
			+ "\",\"selectedOfficeCode\":\"" + officeCode
			+ "\",\"officeName\":\"" + $("#officeType option:selected").text()
			+ "\",\"selectedOfficeType\":\"" + officeType
			+ "\"}";

		console.log("pageValJson " + pageValJson);



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
});

$(document).ready(function() {
	$('select option').filter(function() {
		return ($(this).val().trim() == "" && $(this).text().trim() == "");
	}).remove();

	$("select option").each(function() {
		$(this).siblings('[value="' + this.value + '"]').remove();
	});

	$('option').each(function() {
		t = $(this).text();
		$(this).text(t.replace(/^(.)|\s(.)/g, function($1) { return $1.toUpperCase(); }))
	});
});

function viewRiskDetails(riskId){
	
							var riskId =riskId;
							var pageValJson = "{\"riskId\":" + "\""
									+ riskId + "\"}";
							document.getElementById('load').style.visibility = "visible";
							// ajax call
							$
									.ajax({
										url : 'viewRiskModal',
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
											
											$('#keymitigation').val(
													obj.keyMitigationMeasures);

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
																					+ '</td><td class="text-capitalize"> <span class="badge text-white" style="background-color:'
																					+ item.statusCol
																					+ '">'
																					+ item.recordStatus
																					+ '</span></td>'
																					+ '</tr>');
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
																					+ '<a name='+item.fileName+' href="#" class="btn btn-info downloadfile"><i '
																					+' class="fas fa-download"></i></a>'
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
										error : function(xhr, status, error) {
											toastr
													.success('Some Error Occured');
										}
									});
}




// viewRisk
//$(".registerBody").on("click", "a.checkRiskData", function(){

//$('a.viewRisk').click(function() {
	
$(".registerBody").on("click", "a.viewRisk", function(){
					
					var ofcId = $(this).attr('id');
					var assPeriod = $(this).attr('data-assessmentDate');
					
					//var pageValJson = "{\"selectedDept\":" + "\""
					//		+ deptId + "\"}";
							
					var pageValJson = "{\"selectedAssessmentPeriod\":" + "\"" + assPeriod
								+ "\",\"selectedOfficeId\":\"" + ofcId
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
									
									
									$('#linkedModuleTbl tr:gt(0)').remove();
									$('#previousMatrix tr:gt(0)').remove();
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
									
									
									
									
									
									$('#controlmodal').modal('show');
								},
								error : function(xhr, status, error) {
									toastr
											.success('Some Error Occured');
								}
			});
});


		
	





