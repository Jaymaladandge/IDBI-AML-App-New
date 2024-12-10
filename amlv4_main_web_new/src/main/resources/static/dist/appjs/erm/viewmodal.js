/**
 * 
 */
 $('a.viewModal')
	.click(
		function() {
			
			var id = $(this).attr('id').split('~');
			viewModelData(id);

		});
		
function viewModalFunc(modelId){
	var id=modelId.split('~');
	viewModelData(id);
			
}


$(".tempAlert").on("click", "a.viewNotification", function(){
		var id = this.id;
		id = id.split('~');
		viewModelData(id);
	});
												
		

function viewModelData(id){
	
	var stmtId = id[0];
				if (id[1].toUpperCase() == 'RISK APPETITE') {
				viewRaDetails(stmtId);
			} else if (id[1].toUpperCase() == 'KEY RISK INDICATOR') {
				viewKRIDetails(stmtId);
			} else if (id[1].toUpperCase() == 'TOP RISK') {
				viewTopRiskDetails(stmtId);
			} else if (id[1].toUpperCase() == 'BENCHMARK') {
				viewBenchMarkDetails(stmtId);
			} else if (id[1].toUpperCase() == 'RISK LIBRARY') {
				viewRiskLibraryDetails(stmtId);
			}else if (id[1].toUpperCase() == 'CONTROL') {
				viewControlLibraryDetails(stmtId);
			} 
			else if (id[1].toUpperCase() == 'ROLE MASTER') {
				viewRoleDetails(stmtId);
			} else if (id[1].toUpperCase() == 'MENU MASTER') {
				viewMenuDetails(stmtId);
			}else if (id[1].toUpperCase() == 'USER MASTER') {
				veiwRoleDetails(stmtId);
			} else if (id[1].toUpperCase() == 'APP PARAMETER') {
				veiwAppParameterDetails(stmtId);
			} else if (id[1].toUpperCase() == 'INCIDENT MANAGEMENT') {
				viewIncidentDetails(stmtId);
			}
			
}
		

 


// Modal For View Risk Appetite
function viewRaDetails(raStmtId) {
	var pageValJson = "{\"raStmtId\":" + "\""
		+ raStmtId + "\"}";
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$
		.ajax({
			url: 'viewRaModal',
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
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);
				$('#parameterId').val(obj.raStmtId);
				$('#recordstatus').val(
					obj.raRecordStatus);
				$('#riskcate').val(obj.raRiskCate);
				$('#risksubcate')
					.val(obj.raSubCate);
				$('#riskstmtname').val(
					obj.raStmtName);
				$('#riskdescription').val(
					obj.raStmtDescription);
				$('#datapoints').val(
					obj.raStmtDataPts);
				$('#datatype')
					.val(
						obj.raToleranceValueDatatype);
				$('#datadept').val(
					obj.raResponsibleDept);
				$('#datapdept').val(
					obj.raDeptProvidingData);
				$('#capturedept').val(
					obj.raCaptureValueDept);

				$('#frequency')
					.val(
						obj.raCaptureValueFrequency);
				$('#criteria').val(
					obj.raAssessmentCriteria);
				$('#threshold').val(
					obj.raToleranceThreshold);
				$('#capturetbl tr:gt(0)').remove();
				if (obj.mvcDtoList != null
					&& obj.mvcDtoList.length > 0) {
					obj.mvcDtoList
						.forEach(function(item) {
							if (item.assessmentStatus == 'Above Tolerance') {
								tolerance = '<td><span class="badge bg-danger">Above Tolerance</span></td>';
							} else if (item.assessmentStatus == 'Within Tolerance') {
								tolerance = '<td><span class="badge bg-success">Within Tolerance</span></td>';
							}
							$(
								'#capturetbl tr:last')
								.after(
									'<tr><td class="text-capitalize">'
									+ item.deptName
									+ '</td><td>'
									+ item.toleranceValue
									+ '</td><td>'
									+ item.assessmentValue
									+ '</td>'
									+ tolerance
									+ '<td class="text-capitalize">'
									+ item.captureUserName
									+ '</td><td>'
									+ moment(
										item.captureTime)
										.format(
											'DD/MM/YYYY')
									+ '</td></tr>');
						});
					var seen = {};
					$('#capturetbl tr')
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
				}

				var rowCount = $('#capturetbl tr').length;
				if (rowCount == 1) {
					$('#asrDiv').hide();
				} else {
					$('#asrDiv').show();
				}
				$('#riskmodal').modal('show');
			},
			error: function(xhr, status, error) {
				toastr
					.error('Some Error Occured');
			}
		});
}

// Modal For View Key Risk Indicator
function viewKRIDetails(kriId) {
	/*View KRI Modal*/
	var value = "{\"kriId\":" + "\"" + kriId
		+ "\"}";
	var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), value);
	var pageValJson = ciphertext + ':~:' + passphrase;
	//console.log(pageValJson);
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$.ajax({
		url: 'viewKriModal',
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
				}, 1000);

			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			$('#kriId').val(kriId);
			$('#kriStatus').val(obj.kriRecordStatus);
			$('#kriName').val(obj.kriName);
			$('#kriBenchmark').val(obj.kriBenchmark);
			$('#kriDataType').val(obj.kriDataType);
			$('#thresholddescription').val(obj.kriThresholdDescription);
			$('#datasourcedef').val(obj.kriDataSource);
			$('#frequency').val(obj.kriUpdateFrequency);
			$('#kriFormula').val(obj.kriFormula);
			$('#deptThresholdDetails tr:gt(0)').remove();

			if (obj.mdmDtoList.length > 0) {
				obj.mdmDtoList.forEach(function(mdmItem) {
					var mdtValue = "";
					mdmItem.mdtDtoList.forEach(function(mdtItem) {
						mdtValue += '<td><span class="text-capitalize text-bold" style="white-space:pre;color:' + mdtItem.bgClass + ';">' + mdtItem.deptThresholdType + '</span></td><td>' + mdtItem.asstTypeDesc + '</td><td>' + mdtItem.deptThresholdValue + '</td></tr>';
					});
					//console.log(mdtValue);
					$('#deptThresholdDetails tr:last')
						.after(
							'<tr><td class="text-capitalize text-bold" rowspan="' + mdmItem.mdtDtoList.length + '">'
							+ mdmItem.deptName.toLowerCase()
							+ '</td>'
							+ '<td rowspan="' + mdmItem.mdtDtoList.length + '">'
							+ mdmItem.remarks
							+ '</td>'
							+ mdtValue + '<tr>');
				});

				$('#modalDeptThresDiv').show();

			}
			$('#kriModal')
				.modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.error('Some Error Occured');
		}
	});
}
/*View KRI Modal End*/
// Modal For View Top Risk
function viewTopRiskDetails(topRiskId) {
	$('#topRiskId').val(topRiskId);
	var value = "{\"topRiskId\":" + "\"" + topRiskId
		+ "\"}";
	var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), value);
	var pageValJson = ciphertext + ':~:' + passphrase;
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$
		.ajax({
			url: 'viewTopRisk',
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
				$('#topRiskStatus').val(
					obj.topRiskRecordStatus);
				$('#theme').val(obj.topRiskTheme);
				$('#desc').val(
					obj.topRiskDescription);
				$('#modalDeptDiv').empty();
				obj.deptMasterList.forEach(function(item) {
						var trDiv = "";
						item.topRiskKriList
							.forEach(function(
								listItems) {
								var kriId = listItems.kriId;
								var kriName = listItems.kriName;
								var kriWt = listItems.kriWeightage;
								var threshold = "";
								listItems.mdtlist
									.forEach(function(
										items) {
										threshold = threshold
											+ '<tr><td><span style="white-space:pre; background-color:'
											+ items.bgClass
											+ ';" class="text-capitalize">'
											+ items.deptThresholdType.toLowerCase()
											+ '</span></td><td>'
											+ items.deptThresholdValue
											+ '</td></tr>';
									});
								var thresholdTab = '<table>'
									+ threshold
									+ '</table>';
								trDiv = trDiv
									+ ('<tr class="mainTab" id="tr' + kriId + '"><td>'
										+ kriId
										+ '</td><td> '
										+ kriName
										+ '</td><td>'
										+ thresholdTab
										+ '</td><td>'
										+ kriWt + '</td></tr>');

							});
						$('#modalDeptDiv')
							.prepend(
								$('<div class="row"><div class="card card-primary card-outline col-12">'
									+ '<div class="card-header">'
									+ '	<h5 class="card-title text-capitalize">'
									+ item.deptName
									+ '</h5>'
									+ '</div>'
									+ '	<div class="card-body table-responsive">'
									+ '		<table class="table centraloffice table-head-fixed table-bordered table-striped">'
									+ '	<thead><tr>'
									+ '		<th>KRI ID</th>'
									+ '			<th>KRI Name</th>'
									+ '			<th>Threshold</th>'
									+ '			<th>KRI Weight</th>'
									+ '	</tr></thead>'
									+ '	<tbody>'
									+ '	</tbody>'
									+ trDiv
									+ '	</table>'
									+ '	</div>'
									+ '</div>'
									+ '</div>'));

					});
				$('#viewTopRiskmodal')
					.modal('show');
			},
			error: function(xhr, status, error) {
				toastr
					.success('Some Error Occured');
			}
		});
}
//View Top Risk End
function viewBenchMarkDetails(bmId) {
	$('#bmId').val(bmId);
	var value = "{\"bmId\":" + "\"" + bmId
		+ "\"}";
	var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), value);
	var pageValJson = ciphertext + ':~:' + passphrase;
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$.ajax({
		url: 'viewBenchmark',
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
		success: function(response) {
			setTimeout(function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);

			$('#bmRecordStatus').val(obj.bmRecordStatus);
			$('#bmNameM').val(obj.bmName);
			$('#bmDescriptionM').val(obj.bmDescription);
			$('#bmApplicableOfficeM').val(obj.applicableOffice);
			$('#bmDatatypeM').val(obj.bmDatatype);
			$('#bmValueM').val(obj.bmValue);
			$('#bmAssessmentPeriodM').val(obj.bmAssessmentPeriod);
			 
			const ofc = obj.applicableOffice.split(",");
			Object.keys(ofc).forEach(function(key) {

				$("<input  class='form-check-input' type='checkbox' name='applicableOffice' checked=true disabled/>"
					+ "<label class='font-weight-normal'>"
					+ ofc[key]
					+ "&nbsp;</label><br/>").appendTo(".ofcName");

			});

			
			
		
			$('#viewBenchmarkmodal').modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.error('Some Error Occured');
		}
	});
}

// Control Modal
		function viewControlLibraryDetails(controlId) {
							//var controlId = $(this).attr('id');
						
							
							var pageValJson = "{\"controlId\":" + "\""
									+ controlId + "\"}";
							document.getElementById('load').style.visibility = "visible";
							
							// ajax call
							$
									.ajax({
										url : 'viewControlModal',
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
											
											console.log(obj);
											$('#controlModelId').val(obj.controlId);
											//alert(obj.controlId);
											$('#recordstatus').val(
													"View");
											$('#controlModelDept').val(obj.controlDept);
											$('#controlModelFunction')
													.val(obj.controlFunction);
											$('#controlModelName').val(
													obj.controlName);
											$('#controlModelAssessmentFreq').val(
													obj.controlAssessmentFreq);
													
											//office
											$(".office-set").empty();
											obj.officeCheckValue
													.forEach(function(items) {
														if(items.officeFlg){
														$(
															//"<div class='form-group text-capitalize'' id='officetypeCheck'>"+
													        "<div  class='form-check ofcCheckbox text-capitalize'>"+
															"<input class='form-check-input checkboxOffice' type='checkbox' name="+
															items.officeValue +
															" id=check-"+
															items.officeCode +
															" checked="+
															items.officeFlg+
															"  disabled> "+
                          								    "<label class='form-check-label' for=check-"+
															items.officeCode +
															" >"+
															items.officeValue+
															"</label> &nbsp"+
                          									"</div>")
																.appendTo(
																		".office-set");
														}else{
																$(
															//"<div class='form-group text-capitalize'' id='officetypeCheck'>"+
													        "<div  class='form-check ofcCheckbox text-capitalize'>"+
															"<input  class='form-check-input checkboxOffice' type='checkbox' name="+
															items.officeValue +
															" id=check-"+
															items.officeCode +
															"  disabled> "+
                          								    " <label class='form-check-label' for=check-"+
															items.officeCode +
															" >"+
															items.officeValue+
															"</label>"+
                          									"</div>")
																.appendTo(
																		".office-set");
														}
														

													});
													
													
																						//office
											$(".office-desc").empty();
											obj.officeDescValue
													.forEach(function(items) {
													$(	
													"<div class='form-group text-capitalize'>"+
													"<label for='controlDescCO' > "+
													 items.officeValue+
													"</label>"+
													"<textarea class='form-control form-control-sm officeDesc' "+
													" name='"+
													items.officeCode +  
													" id='"+
													items.officeCode+
													"' maxlength='3000' placeholder='Control Description' readonly>"+
													items.officeDesc+
													"</textarea> </div>"
													)
																.appendTo(
																		".office-desc");
														
											});
											//office

											var rowCount = $('#capturetbl tr').length;
											if (rowCount == 1) {
												$('#asrDiv').hide();
											} else {
												$('#asrDiv').show();
											}
											$('#modalFileId tr:gt(0)').remove();
											
											$('#controlLibrarymodal').modal('show');
										},
										error : function(xhr, status, error) {
											toastr
													.success('Some Error Occured');
										}
									});
						}


// Risk Modal
function viewRiskLibraryDetails(riskId) {
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
																					+ '<td><span class="badge bg-success">'
																					+ item.cntrlAssessmentFreq
																					+ '</span></td></tr>');
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
											
											$('#controlmodal').modal('show');
										},
										error : function(xhr, status, error) {
											toastr
													.success('Some Error Occured');
										}
									});
}





function viewRoleDetails(roleId){
	var value = "{\"roleId\":" + "\"" + roleId
		+ "\"}";
	var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), value);
	var pageValJson = ciphertext + ':~:' + passphrase;
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$.ajax({
		url: 'viewRole',
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
		success: function(response) {
			setTimeout(function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			
			var statusFlag="";
			if(obj.statusFlg=="A"){
				statusFlag="Active";
			}else if(obj.statusFlg=="R"){
				statusFlag="Rejected";
			}else if(obj.statusFlg=="D"){
				statusFlag="Pending Approval";
			}else if(obj.statusFlg=="E"){
				statusFlag="Edited";
			}
			$('#statusFlgM').val(statusFlag);
			$('#roleId').val(roleId);
			$('#roleNameM').val(obj.roleName);
			$('#roleCategoryM').val(obj.roleCategory);
			var liTag = '';
			obj.menus.forEach(function(item) {
				var subMenuli = '<ul>';
				var menuBtn = '<ul>';
				if (item.actionPath == null) {
					item.subMenus.forEach(function(subMenu) {
						var subMenuBtn = '<ul>';
						if (subMenu.subMenuAction != null) {
							subMenu.subMenuAction.forEach(function(subMenuBtns) {
								subMenuBtn += '<li style="display: inline-block;"class="text-capitalize"><input type="checkbox" name="parentHeader"checked=true disabled/>&nbsp;'
									+ '<label>' + subMenuBtns.split('~')[0] + '&nbsp;</label></li>';
							});
						}
						subMenuBtn += '</ul>';
						if (subMenu.checkFlg == 'true') {
							subMenuli += '<li><input type="checkbox" name="parentHeader" checked=' + subMenu.checkFlg + ' disabled/> &nbsp;'
								+ '<label>' + subMenu.subMenuName + '</label>' + subMenuBtn + '</li>';
						}
					});
				} else {
					if (item.menuAction != null) {
						item.menuAction.forEach(function(menuBtns) {
							menuBtn += '<li style="display: inline-block;"class="text-capitalize"><input type="checkbox" name="parentHeader"checked="true" disabled/>&nbsp;'
								+ '<label>' + menuBtns.split('~')[0] + '&nbsp;</label></li>';
						});
					}
				}
				menuBtn += '</ul>';
				subMenuli += '</ul>';
				if (item.checkFlg == 'true') {
					liTag += '<li><input type="checkbox" name="parentHeader"checked=' + true + ' disabled/>&nbsp;'
						+ '<label>' + item.menuName + '</label>' + menuBtn + subMenuli + '</li>';
				}
			});
			$('#viewMenuDiv ul li:last').append(liTag);
			$('#viewRolemodal').modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.success('Some Error Occured');
		}
	});
}

function veiwUserDetails(userId){
	var userId = $(this).attr('id');
				var sourceName="createVerify";

				var pageValJson = "{\"userId\":" + "\""
						+ userId + "\"}";
						
				document.getElementById('load').style.visibility = "visible";

				// ajax call
				$
						.ajax({
							url : 'viewUserModel',
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
								console.log("json Response "+jsonResponse)
								var obj = JSON.parse(jsonResponse);
								console.log("obj "+obj);
								var i=0;
								  $("#userIdLabel").text(obj.userId);
								  $("#mUserName").val(obj.username);
								  $("#mUserMobile").val(obj.userMobile);
								  $("#mUserEmail").val(obj.userEmail);
								  $("#mOfficeType").val(obj.userOfficeType);
								  $("#mDepartment").val(obj.userDeptName);
								  $("#mUserRoleShortName").val(obj.userShortName);
								  
							/* 	Object.keys(obj).forEach(function(items) {
									
									 var data = obj[items];
									  console.log((++i)+' '+data);
									  //alert(data[0]);
									 // $("#userIdLabel").text(data[0]);
									//alert("items "+arr);
											}); */
								},
							error : function(xhr, status, error) {
								toastr.error('Some Error Occured');
							}
						});
				$('#viewUserModel').modal('show');
	
}

function veiwAppParameterDetails(recordId){
	
	var recordId = $(this).attr('id');
				var sourceName="createVerify";
				

				var pageValJson = "{\"recordId\":" + "\""
						+ recordId +"\"}";
						 
						
						
						
				document.getElementById('load').style.visibility = "visible";

				// ajax call
				$
						.ajax({
							url : 'viewParameterModel',
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
								console.log("json Response "+jsonResponse)
								var obj = JSON.parse(jsonResponse);
								console.log("obj "+obj);
								  $("#paramIdLabel").text(obj.recordId);
								  $("#mParameterName").val(obj.paramKey);
								  $("#mParameterDescription").text(obj.paramDesc);
								  $("#mParameterCategory").val(obj.paramCategory);
								  $(".timeline-parameter").empty();
								  $.each( obj.parameterValues, function(index,value){
									  console.log("Index = " + index + " value = " + value); 
									  $(
												"<div class='row pb-2'><div class='col-sm-3' id='div_1'><input type='text' placeholder='Parameter Key' name='paramkey[]' class='form-group form-control form-control-sm' id='parameterkey_1' value='"+index+"' readonly></div>"
												+ "<div class='col-sm-3' id='div_1'><textarea class='form-control form-control-sm paramVal' id='parameterval_1' readonly>"+value+"</textarea></div></div>"
												
												
									  )
												.appendTo(
														".timeline-parameter");
									 })
								 
							/* 	Object.keys(obj).forEach(function(items) {
									
									 var data = obj[items];
									  console.log((++i)+' '+data);
									  //alert(data[0]);
									 // $("#userIdLabel").text(data[0]);
									//alert("items "+arr);
											}); */
								},
							error : function(xhr, status, error) {
								toastr.error('Some Error Occured');
							}
						});
				$('#viewParameterModel').modal('show');
	
}

function viewMenuDetails(menuId){
var pageValJson = "{\"menuId\":" + "\""
						+ menuId + "\"}";
						
					
					document.getElementById('load').style.visibility = "visible";
					// ajax call
					$
						.ajax({
							url: 'viewMenuModel',
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
							success: function (response) {
								setTimeout(
									function () {
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
								
							
								$('#capturetbl tr:gt(0)').remove();
								if (obj.subMenus != null
									&& obj.subMenus.length > 0) {
									obj.subMenus
										.forEach(function (item) {
											//subMenuType
											$(
												'#capturetbl tr:last')
												.after(
													'<tr><td class="text-capitalize">'
													+ item.subMenuName
													+ '</td><td>'
													+ item.subMenuStatus
													+ '</td><td class="text-capitalize">'
													+ item.subMenuType
													+ '</td><td>'
													+ item.subMenuPath
													+ '</td>'
													+ '<td class="text-capitalize">'
													+ item.subMenuOrder
													+ '</td>'
													+ '</tr>');
										});
									
								}

								var rowCount = $('#capturetbl tr').length;
								if (rowCount == 1) {
									$('#menuDiv').hide();
								} else {
									$('#menuDiv').show();
								}
								$('#modalFileId tr:gt(0)').remove();
								$('#menumodal').modal('show');
							},
							error: function (xhr, status, error) {
								toastr
									.success('Some Error Occured');
							}
						});
						

}


function viewIncidentDetails(incidentId){
	
var value = "{\"incidentId\":" + "\"" + incidentId
		+ "\"}";	
	
var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), value);
	var pageValJson = ciphertext + ':~:' + passphrase;
	document.getElementById('load').style.visibility = "visible";	
	
	
	$.ajax({
		url: 'viewIncident',
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
		success: function(response) {
			setTimeout(function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			
			
	if(obj.assessedImpactValue != null){
	var x=obj.assessedImpactValue;
    x=x.toString();
    var afterPoint = '';
    if(x.indexOf('.') > 0)
    afterPoint = x.substring(x.indexOf('.'),x.length);
    x = Math.floor(x);
    x=x.toString();
    var lastThree = x.substring(x.length-3);
    var otherNumbers = x.substring(0,x.length-3);
    if(otherNumbers != '')
    lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;
}

	//recovery amount
	
	if(obj.recoverableValue != null){
	var a=obj.recoverableValue;
    a=a.toString();
    var afterPoint = '';
    if(x.indexOf('.') > 0)
    afterPoint = x.substring(a.indexOf('.'),a.length);
    a = Math.floor(a);
    a=a.toString();
    var lastThree = a.substring(a.length-3);
    var otherNumbers = a.substring(0,a.length-3);
    if(otherNumbers != '')
    lastThree = ',' + lastThree;
    var resRecovery = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;
}

	//remediation gross loss
	/*var b=remDto.grossLossRemediation;
			    b=b.toString();
			    var afterPoint = '';
			    if(b.indexOf('.') > 0)
			    afterPoint = b.substring(b.indexOf('.'),b.length);
			    b = Math.floor(b);
			    b=b.toString();
			    var lastThree = b.substring(b.length-3);
			    var otherNumbers = b.substring(0,b.length-3);
			    if(otherNumbers != '')
			    lastThree = ',' + lastThree;
			    var resgrossloss = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;*/
	
	
	if(obj.assessedImpactValue!=null){
		
		var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	inWords(obj.assessedImpactValue);
			function inWords(num) {
		if ((num = num.toString()).length > 15) return 'overflow';
	n = ('000000000000000' + num).substr(-15).match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return;
		var str = '';
		str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Lakh ' : '';
	str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Thousand ' : '';
	str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Hundred ' : '';
	str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Crore ' : '';
	str += (n[5] != 0) ? (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Lakh ' : '';
	str += (n[6] != 0) ? (a[Number(n[6])] || b[n[6][0]] + ' ' + a[n[6][1]]) + 'Thousand ' : '';
	str += (n[7] != 0) ? (a[Number(n[7])] || b[n[7][0]] + ' ' + a[n[7][1]]) + 'Hundred ' : '';
	str += (n[8] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[8])] || b[n[8][0]] + ' ' + a[n[8][1]]) + '' : '';
		$('#showWordAmt').text(str)
	}
}
	
	/*var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];*/
	/*inWords(obj.recoverableValue);
	
	function inWords(num1) {
		if ((num1 = num1.toString()).length > 9) return 'overflow';
		n = ('000000000' + num1).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return;
		var str1 = '';
		str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
		str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
		str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
		str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
		str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
		$('#showRecvrAmt').text(str1)
	}*/
	
	
			if(obj != null ){
				
			$('#incidentIdM').val(obj.incidentId);
			$('#incidentStatusM').val(obj.incidentStatus);
			$('#incidentNameM').val(obj.incidentName);
			$('#incidentReportingPersonM').val(obj.incidentReportingPerson);
			$('#incidentDescriptionM').val(obj.incidentDescription);
			$('#operatingOfcLocationM').val(obj.operatingOfcLocation);
			$('#incidentReportingPersonM').val(obj.incidentReportingPerson);
			$('#assessedImpactValueM').val(res);
			$('#departmentM').val(obj.department);
			$('#incidentIdentificationDateM').val(obj.incidentIdentificationDate);
			$('#incidentRecordDateM').val(obj.incidentRecordDate);
			$('#caseReportedM').val(obj.casesReportedTo);
			if(obj.incidentType != null || obj.incidentType !=''){
				$('#incidentTypeM').val(obj.incidentType);	
				$('#incidentTypeDiv').show();
			}else{
				$('#incidentTypeDiv').hide();	
			}
			if(obj.incidentImpactLevel != null){
				$('#incidentImpactLevelM').val(obj.incidentImpactLevel);
				$('#incidentImpactLevelDiv').show();
			}else{
				$('#incidentImpactLevelDiv').hide();
			}
			
			if(obj.primaryLossEvent != null){
				$('#primaryLossEventM').val(obj.primaryLossEvent.replaceAll('~',', '));
				$('#primaryLossEventDiv').show();
			}else{
				$('#primaryLossEventDiv').hide();
			}
			
			if(obj.secondaryLossEvent != null){	
				$('#secondaryLossEventM').val(obj.secondaryLossEvent.replaceAll('~',', '));
				$('#secondaryLossEventDiv').show();
			}else{
				$('#secondaryLossEventDiv').hide();
			}
			if(obj.recoverableValue != null){
				$('#recoverableValueM').val(resRecovery);
				$('#recoverableValueDiv').show();
			}else{
				$('#recoverableValueDiv').hide();
			}
			if(obj.recoveryStatus != null){
				$('#recoveryStatusM').val(obj.recoveryStatus);
				$('#recoveryStatusDiv').show();
			}else{
				$('#recoveryStatusDiv').hide();
			}
			
			if(obj.additionalBusinessUnit != null){
				$('#additionalBusinessUnitM').val(obj.additionalBusinessUnit);
				$('#additionalBusinessUnitDiv').show();
			}else{
				$('#additionalBusinessUnitDiv').hide();
			}
		}
			
			/*$('#whetherInsuredM').val(obj.whetherInsured);
			$('#customerImpactedM').val(obj.customerImpacted);
			$('#regulatoryImpactM').val(obj.regulatoryImpact);*/
			if(obj.incidentRemediationLinkDto != null && obj.incidentStatus == 'Pending Closure' ||  obj.incidentStatus == 'Closed' ){
				
			var remDto = obj.incidentRemediationLinkDto;
			$('#rootCauseIncidentM').val(remDto.rootCauseIncident);
			$('#rootCauseTypeM').val(remDto.rootCauseType);
			$('#rootCauseDescriptionM').val(remDto.rootCauseDescription);
			$('#grossLossRemediationM').val(remDto.grossLossRemediation);
			$('#netLossRemediationM').val(remDto.netLossRemediation);
			
			$('#remediateDiv').show();
			
			}else if(obj.incidentRemediationLinkDto == null && obj.incidentStatus != 'Pending Closure'){
				
				$('#remediateDiv').hide();
			}
			
			//console.log(obj.incidentFinanceList);
			if(obj.incidentFinanceList != null){
			var financeDto = obj.incidentFinanceList;
			if(financeDto.length > 0){
			$(".grossLossTable > #tbodyR").empty();
			$(".recoveryLossTable > #tbodyT").empty();	
			financeDto.forEach(function(items) {
				/*alert(items.type);
				alert(items.incidentId);
				alert(items.amount);
				alert(items.category);*/
				if(items.category=='GL'){
				$('<tr><td>'
					+ items.date
					+ '</td><td>'
					+ items.type
					+ '</td><td>'
					+ items.amount
					+ '</td>'
				+'</tr>').appendTo(".grossLossTable > #tbodyR");
			
			} if(items.category=='RL'){
				$('<tr><td>'
					+ items.date
					+ '</td><td>'
					+ items.type
					+ '</td><td>'
					+ items.amount
					+ '</td>'
				+'</tr>').appendTo(".recoveryLossTable > #tbodyT");
			}
			
			
			});
			}
			}
			
			if(obj.incidentClosureLinkDto!=null && obj.incidentStatus == 'Closed'){
				
				var closureList = obj.incidentClosureLinkDto;
				$('#businessSegmentM').val(closureList.businessSegment);
				$('#riskInRiskRegisterM').val(closureList.riskInRiskRegister);
				$('#controlInRiskRegisterM').val(closureList.controlInRiskRegister);
				$('#closureReasonM').val(closureList.closureReason);
				
				if(obj.incidentClosureLinkDto.checkList.length>0){
				obj.incidentClosureLinkDto.checkList.forEach(function(items) {
				if(items.checkListResponse != null){
					$('<tr><td>'
					+ items.checkListId
					+ '</td><td>'
					+ items.checkListDescription
					+ '</td><td>'
					+ items.checkListResponse
					+ '</td>'
				+'</tr>').appendTo(".checklistView > #tbodyC");
				}else if(items.checkListResponse == null){
					
					$('<tr><td>'
					+ items.checkListId
					+ '</td><td>'
					+ items.checkListDescription
					+ '</td><td>'
					+ "No Value"
					+ '</td>'
				+'</tr>').appendTo(".checklistView > #tbodyC");
					
				}
				});
				}	
				$('#closureDiv').show();
			} else if(obj.incidentClosureLinkDto == null){
				

				$('#closureDiv').hide();
			}
			
			if(obj.filedetails!=null){
			var fileFlg = true;
			obj.filedetails.forEach(function(item) {
				fileFlg = false;
				$('#filedetails tr:last').after(
					'<tr><td>'
					+ item.fileName
					+ '</td>'
					+ '<td>'
					+ item.fileSize
					+ '</td>'
					+ '<td>'
					+ item.uploadTimestamp
					+ '</td>'
					+ '<td class="text-capitalize">'
					+ item.uploadedBy
					+ '</td>'
					+ '<td><a name=' + item.fileName + ' href="#"'
					+ ' class="btn btn-info downloadfile"><i'
					+ ' class="fas fa-download"></i></a></td></tr>');
			});
		}	
		
		
		
			
			
			if (fileFlg) {
				$('#filedetails').hide();
			} else {
				var seen = {};
				$('#filedetails tr').each(function() {
					var txt = $(
						this)
						.text();
					if (seen[txt])
						$(this)
							.remove();
					else
						seen[txt] = true;
				});
				$('#filedetails').show();
			}
			$('#viewIncidentmodal').modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.success('Some Error Occured');
		}
	});
	
	
	
	
}














