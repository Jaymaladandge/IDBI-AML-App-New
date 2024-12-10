$(function() {
	$("#controlTable").DataTable({
		"columnDefs" : [ {
					orderable : false,
					targets : [ 4,5]
				} ],
		"order": [0, "desc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		//"buttons": ["csv", "excel", "pdf", "print"],
		"language": {
			"emptyTable": "No Data Available"
		},

	}).buttons().container().appendTo(
		'#controlTable_wrapper .col-md-6:eq(0)');
});


//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
}

		$(document).ready(function() {
			var message = $('#message').val();
			
			if (message != "") {
				toastr.success(message);
			}

			$("a .fa-twitch").click(function() {
				$('#timelinelink').css('class', 'border');
				$('#timelinelink').css('display', '');
				$('#timelinelink').click();
			});

			$("#summarylink").click(function() {
				$('#timelinelink').css('display', 'none');
			});

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
										url : 'viewAuditTrail',
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
										error : function(xhr, status, error) {
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