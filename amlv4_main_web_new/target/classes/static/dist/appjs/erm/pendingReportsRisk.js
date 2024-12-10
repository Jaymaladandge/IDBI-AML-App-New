document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
	} else if (state == 'complete') {
		setTimeout(function() {
			document.getElementById('interactive');
			document.getElementById('load').style.visibility = "hidden";
		}, 1000);
	}
}
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});

$(document).ready(function() {
	var deptNameTemp = $('#userDept').val();
	if (deptNameTemp != 'ERM') {
		$("#fetchDataBtn").prop("disabled", true);
		$("#status").prop("disabled", true);
		$("#officeType").prop("disabled", true);
	}
	
});
$("#fetchDataBtn").click(function() {
	var selectedValue = "";
	var statusValue = "";
	var pageValJson = "";
	if ($("#officeType").val() === "") {
		toastr.error("Please Select Office Type");
	} else {
		var selectedValue = $('#officeType :selected').val();
	}
	if ($("#status").val() === "") {
		toastr.error("Please Select Status");
	} else {
		var statusValue = $('#status :selected').val();
	}
	if (selectedValue != null && selectedValue != "") {
		if (statusValue != null && statusValue != "") {
			pageValJson = "{\n"
				+ "    \"searchParam\": \"" + selectedValue + "\",\n"
				+ "    \"statusParam\":\"" + statusValue + "\"\n"
				+ "}";

			document.getElementById('load').style.visibility = "visible";
			$.ajax({
				url: "fetchRiskAssessmentValue",
				type: "POST",
				data: {
					pageValJson: pageValJson
				},// important line for thymeleaf http security
				headers: {
					"X-CSRF-TOKEN": $("input[name='_csrf']").val()
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
						}, 1000);

					var jsonResponse = JSON.stringify(response);
					var obj = JSON.parse(jsonResponse);
					var dataList = obj.ntfDtoList;
					$(".RiskValueCapturetable > #tbodyR").empty();
					$('#RiskValueCapturetable').dataTable().fnClearTable();
					$('#RiskValueCapturetable').DataTable().destroy();


					dataList.forEach(function(items) {
						if(items.ntfModuleId!=null){
						 var ntf_date = moment(items.ntfStartDate).format('DD-MM-YYYY');  
      
						$("<tr role='row' class='deptName' value='" + items.ntfModuleId + "' id='" + items.ntfModuleId + "' name='" + items.ntfModuleId + "'><td><a href='#' id='" + items.ntfModuleId + "' onclick='viewRiskDetails(this.id)'> "
							+ items.ntfModuleId
							+ "</td><td><span value='" + items.ntfStatus + "' id='" + items.ntfStatus + "' name='" + items.ntfStatus + "' class='textCapitalize'>"
							+ items.ntfStatus
							+ "</td><td><span value='" + ntf_date + "' id='" + ntf_date + "' name='" + ntf_date + "' class='textCapitalize'>"
							+ ntf_date
							+ "</td><td><span value='" + items.deptName + "' id='" + items.deptName + "' name='" + items.deptName + "' class='textCapitalize'>"
							+ items.deptName
							+ "</td><td><span value='" + items.ofcCode + "' id='" + items.ofcCode + "' name='" + items.ofcCode + "' class='textCapitalize'>"
							+ items.ofcCode
							+ "</td>"
							+ "</tr>").appendTo(".RiskValueCapturetable");
							}

					});
					$("#RiskValueCapturetable").DataTable({
						"columnDefs": [{
							orderable: false
							//targets: [6]
						}],
						"responsive": false,
						"autoWidth": true,
						"searching": true,
						"fixedHeader": false,
						"language": {
							"emptyTable": "No Data Available"
						},
						"buttons": [{
							extend: 'csvHtml5',
							title: 'Risk Value Capture Data'
						}, {
							extend: 'pdfHtml5', title: 'Risk Value Capture Data',
							
						}, {
							extend: 'excel',
							title: 'Risk Value Capture Data', 
						}, {
							extend: 'print', 
							title: 'Risk Value Capture Data'
						}]
					}).buttons().container().appendTo(
						'#RiskValueCapturetable_wrapper .col-sm-12:eq(0)');

				}, error: function(xhr, status, error) {
					console.log(xhr);
					console.log(status);
					console.log(error);
					toastr
						.success('Some Error Occured');
				}
			});

		}
	}
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