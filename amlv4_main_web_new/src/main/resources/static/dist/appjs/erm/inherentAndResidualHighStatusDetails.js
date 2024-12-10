/**
 * 
 */$(document).ready(function() {
	$('select option').each(function() {
	    t = $(this).text();
	    $(this).text(t.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }))
	});
	
	$('select option').filter(function(){
		return ($(this).val().trim()=="" && $(this).text().trim()=="");
	}).remove();
	
	$("select option").each(function() {
	  $(this).siblings('[value="'+ this.value +'"]').remove();
	});
	
});


$(document).ready(function() {
	var searchParam = $("#searchParam").val();
	
	if(searchParam == 'searchFilterWise'){
		$("#curHigh").text($("#assessmentPeriod1").val());
		$("#prevHigh").text($("#assessmentPeriod2").val());
		$("#curMedium").text($("#assessmentPeriod1").val());
		$("#prevMedium").text($("#assessmentPeriod2").val());
		$("#curLow").text($("#assessmentPeriod1").val());
		$("#prevLow").text($("#assessmentPeriod2").val());
	}
	
});

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
	var deptNameTemp = $('#userDeptName').val();
	//if (deptNameTemp != 'ERM') {
	//	$("#fetchDataBtn").prop("disabled", true);
	//	$("#status").prop("disabled", true);
	//	$("#officeType").prop("disabled", true);
	//}
	
});

$("#getReport").click(function() {
	
});


$("#getReport1").click(function() {
	var selectedValue = "";
	var officeType = "";
	var pageValJson = "";
	var assessmentDate1 = $('#assessmentDate').find(":selected").val();
	
//	
//	if(assessmentDate1 == ''){
//			toastr.error('Please Select First Assessment Period for Compare');
//	  }
//	else{
//		var assessmentDate1 = $('#assessmentDate').find(":selected").val();
//	}
//	
//	if($('#selectDept').val() == ''){
//		 	toastr.error('Please Select Department');
//	   }else
//			{	
//		 var deptId = $('#selectDept').val()
//	}
//	
//	if ($("#officeType").val() == "") {
//		toastr.error("Please Select Office Type");
//	} else {
//		var officeType = $('#officeType :selected').val();
//	}
//	
//
//	//var officeCode = $('#officeCode').find(":selected").val();
//	if($('#officeCode').val() == ''){
//		 	toastr.error('Please Select Office Code');
//	   }else
//			{	
//		 var officeCode = $('#selectDept').val()
//	}
	
	 //var assessmentDate1 = $('#assessmentDate').val();
	 //var assessmentDate2 = $('#assessmentDate2').val();
	 var deptId = $('#selectDept').val();
	 var officeType = $('#officeType').val();
	 var officeCode = $('#officeCode').val();

	 if(assessmentDate1 == ''){
										toastr.error('Please Select First Assessment Period for Compare');
								  }
						
								  else if(deptId == ''){
										toastr.error('Please Select Department');
								  }
								 else if(officeType == ''){
										toastr.error('Please Select Office Type');
								  }else if(officeCode == ''){
									 	toastr.error('Please Select Office Code');
								   }else
										{	
	
									var searchParameter = "searchFilterWise";
									var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
										+ "\",\"selectedDept\":\"" + deptId
										+ "\",\"selectedAssessmentPeriod\":\"" +  assessmentDate1
										+ "\",\"selectedOfcCode\":\"" +  officeCode
										+ "\",\"selectOfficeType\":\"" +  officeType
										+ "\"}";
												

									//alert(pageValJson);
									// riskClassificationReport
									document.getElementById('load').style.visibility = "visible";
									var iterationCount = 1000;
									var keySize = 128;
									//passPhrase is the key
									var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
									var aesUtil = new AesUtil(keySize, iterationCount);
									var ciphertext = aesUtil.encrypt(reverseText(passphrase),
										pageValJson);
									$("#encryptedJsonReg").val(ciphertext + ':~:' + passphrase);
									$("#fetchinherentResidualReport").submit();
			
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



// export
//$('.export')
//	.click(
//		function() {
//
//			//alert("Function Called");
//			var searchParameter  = "searchDeptwise";
//			var riskDept = "LICDEPT0000000000016";
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
//
//		});
			
// export


		
$(document).ready(function () {
    $('#controlTable').DataTable({
       responsive: true,
        columns: [
        {
            name: 'SRNO',
            title: 'Sr No.',
        },
        {
            name: 'department',
            title: 'Department',
        },
        {
            title: 'Total No of Risk',
        }, 
        {
            title: 'Classification',
        },
         {
            title: 'Count',
        },
    ],
       
       'rowsGroup': [1],
       
 //      rowsGroup: [
 //     'SRNO:name',
 //     'department:name'
 //   ],
	}); 
  // MergeGridCells();
});



function MergeGridCells() {
    var dimension_cells = new Array();
    var dimension_col = null;
    var columnCount = $("#controlTable tr:first th").length;
    for (dimension_col = 0; dimension_col < columnCount; dimension_col++) {
        // first_instance holds the first instance of identical td
        var first_instance = null;
        var rowspan = 1;
        // iterate through rows
        $("#controlTable").find('tr').each(function () {

            // find the td of the correct column (determined by the dimension_col set above)
            var dimension_td = $(this).find('td:nth-child(' + dimension_col + ')');

            if (first_instance == null) {
                // must be the first row
                first_instance = dimension_td;
            } else if (dimension_td.text() == first_instance.text()) {
                // the current td is identical to the previous
                // remove the current td
                dimension_td.remove();
                ++rowspan;
                // increment the rowspan attribute of the first instance
                first_instance.attr('rowspan', rowspan);
            } else {
                // this cell is different from the last
                first_instance = dimension_td;
                rowspan = 1;
            }
        });
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
// viewRisk
		$('a.viewRisk')
				.click(
						function() {
							var deptId = $(this).attr('id');
							
							var pageValJson = "{\"selectedDept\":" + "\""
									+ deptId + "\"}";
							document.getElementById('load').style.visibility = "visible";
							// ajax call
							$
									.ajax({
										url : 'viewRiskList',
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
											
											if (obj.listRiskLibDto.length > 0) {
												obj.listRiskLibDto
														.forEach(function(items) {
															$(
																	'#previousMatrix tr:last')
																	.after(
																			'<tr><td>'
																			+ items.srNo
																			+ '</td><td>'
																			+ items.riskDescription
																			+ '</td><td>'
																			+ items.riskClassification
																			+ '</td><td class="text-capitalize"> <span class="badge text-white" style="background-color:'
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

		// export
$('.export')
	.click(
		function() {
			
			var selectedValue = "";
	var officeType = "";
	var pageValJson = "";
	var assessmentDate1 = $('#selectedAssessmentPeriodHidden').val();
	

	 var deptId = $('#selectedDeptHidden').val();
	 var officeType = $('#selectOfficeTypeHidden').val();
	 var officeCode = $('#selectedOfcCodeHidden').val();

	 if(assessmentDate1 == ''){
										toastr.error('Please Select First Assessment Period for Compare');
								  }
						
								  else if(deptId == ''){
										toastr.error('Please Select Department');
								  }
								 else if(officeType == ''){
										toastr.error('Please Select Office Type');
								  }else if(officeCode == ''){
									 	toastr.error('Please Select Office Code');
								   }else
										{	
	
									var searchParameter = "searchFilterWise";
									var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
										+ "\",\"selectedDept\":\"" + deptId
										+ "\",\"selectedAssessmentPeriod\":\"" +  assessmentDate1
										+ "\",\"selectedOfcCode\":\"" +  officeCode
										+ "\",\"selectOfficeType\":\"" +  officeType
										+ "\"}";
												

									//alert(pageValJson);
									// riskClassificationReport
									document.getElementById('load').style.visibility = "disable";
		
									var iterationCount = 1000;
									var keySize = 128;
									//passPhrase is the key
									var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
									var aesUtil = new AesUtil(keySize, iterationCount);
									var ciphertext = aesUtil.encrypt(reverseText(passphrase),
										pageValJson);
									$("#encryptedJsonExport").val(ciphertext + ':~:' + passphrase);
									$("#exportRiskReport").submit();
			
								}			

		});

		