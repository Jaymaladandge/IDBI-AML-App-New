$(document).ready(function () {
	var highLightId = $("#highLightId").val();
    $("#controlTable td:nth-child(2)").each(function () {
        if ($(this).text() == highLightId) {
            $(this).parent("tr").css("background-color", "#044383");
			$(this).parent("tr").css("color", "#fff");
			
        }
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
	$("#controlTable").DataTable({
		"columnDefs": [
			{
				targets: [0],
				width: "60%"
			},
			{
				targets: [8],
				width: "14%"
			},
			{
				targets: [9],
				width: "12%"
			},
			{
				targets: [13],
				width: "14%"
			},
			//			{
			//				visible: true,
			//				targets: [2, 3, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 20, 21, 22],
			//
			//			},
			{
				visible: false,
				targets: [0, 1, 2, 3, 5, 6, 7, 11, 12, 15, 16],

			},
			{
				orderable: false,
				targets: [17, 18, 19]

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

$('.export')
	.click(
		function() {

			//alert("Function Called");
			if($('#selectDept').find(":selected").val() =="" || $('#selectDept').find(":selected").val() == null)
			{	
				toastr
													.error('Please Select Department');
			}
			else{
				//alert($('#selectDept').find(":selected").val());
			var riskDept = $('#selectDept').find(":selected").val();
			
			//alert(riskDept);

			if (riskDept == null || riskDept == "") {
				searchParameter = "All";
				riskDept = $('userDeptId').val();
			}else
			{
				searchParameter = "searchDeptwise";
			}

			
			var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
				+ "\",\"searchValue\":\"" + riskDept + "\"}";

			//alert(" pageValJson "+ pageValJson);
			//document.getElementById('load').style.visibility = "visible";

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


// department select
// selectDept
$('#selectDept')
	.change(
		function() {
			var dept = $("#selectDept").find(":selected").val();
			//							var pageValJson = "{\"searchParam\":"
			//									+ "\"" + dept + "\"}";
			if(dept != "" || dept != null) {
			var searchParameter = "searchDeptwise";
			var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
				+ "\",\"searchValue\":\"" + dept + "\"}";

			document.getElementById('load').style.visibility = "visible";


			//alert("Dept "+ dept);

			// ajax call
			$
				.ajax({
					url: 'fetchRegisterDeptWise',
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


//										+ "<td>"
//										+ item.probRiskEvent
//										+ "</td>"

										+ "<td>"
										+ "<select class='form-control form-control-sm select2 text-capitalize' disabled>"
										+ "<option selected>"
										+ item.probRiskEvent
										+ "</option>"
										+ "</select>"
										+ "</td>"
										
										
										+ "<td>"
										+ "<select class='form-control form-control-sm select2 text-capitalize' disabled>"
										+ "<option selected>"
										+ item.financeImpact
										+ "</option>"
										+ "</select>"
										+ "</td>"

//										+ "<td>"
//										+ item.financeImpact
//										+ "</td>"

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


//										+ "<td><span class='badge text-white' style='background-color:"
//										+ item.controlEffectivenessCol
//										+ "'; >"
//										+ item.cntrlEffectiveness
//										+ "</span></td>"
										
										+ "<td>"
										+ "<select class='form-control form-control-sm select2 text-capitalize' disabled>"
										+ "<option selected>"
										+ item.cntrlEffectiveness
										+ "</option>"
										+ "</select>"
										+ "</td>"
										
										

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

										

										+ "</td><td class='project-actions text-center'><span><a data-pagename='verifyRegister' class='btn-sm bg-primary checkRiskData'" 
										+ "id='"
										+ item.riskId
										+ "' "
										+ "title='View'> <i "
										+ "class='fas fa-glasses text-white'></i></a>"
										+ "	</span></td>"


										+ "</td><td class='project-actions text-center'><span><a data-pagename='verifyRegister' class='btn-sm btn-secondary modifyData notSelected'" 
										+ "id='"
										+ item.riskId
										+ "' "
										+ "title='modify'> <i "
										+ "class='fas fa-pencil-alt fa-1x text-white'></i></a>"
										+ "	</span></td>"

										+ "<td><a class='btn-sm btn-secondary'><i class='fas fa-check-circle'></i></a></td>"

										+ "</tr>")
										.appendTo(
											".registerBody");

							});

						$("#controlTable").DataTable({
							"columnDefs": [
								{
									targets: [0],
									width: "60%"
								},
								{
									targets: [8],
									width: "14%"
								},
								{
									targets: [9],
									width: "12%"
								},
								{
									targets: [13],
									width: "14%"
								},
								//			{
								//				visible: true,
								//				targets: [2, 3, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 20, 21, 22],
								//
								//			},
								{
									visible: false,
									targets: [0, 1, 2, 3, 5, 6, 7, 11, 12, 15, 16],
					
								},
								{
									orderable: false,
									targets: [17, 18, 19]
					
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

// If User Selects row then those row will automatically Highlighted
$(document).ready(function() {
	var table = $('#controlTable').DataTable();		
			 $('#controlTable tbody').on( 'click', 'tr', function () {
		        if ( $(this).hasClass('selectedRow') ) {
					$(this).removeClass('selectedRow');
		        }
		        else {
		            table.$('tr.selectedRow').removeClass('selectedRow');
		            $(this).addClass('selectedRow');
					
		        }
		    } );
		 
		   
	
});

// view Risk Register By Id
$(".registerBody").on("click", "a.checkRiskData", function(){
   
//			alert("Function Called");
			var pageName = $(this).attr("data-pagename");
			var riskId = $(this).attr('id');
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
			console.log(pageValJson);
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


	// Dropdown change function
	// Syntax for [IMPACT - LIKELIHOOD]
	
	$(".ratingImpact").change(function() {
		
		var id = $(this).attr('id');
		var splitId = id.split("-");
		var riskId = splitId[1];
		
		// Make Unique Id for Impact & Likelihood Rating
		var impactUniqueId = $("#impactRating-"+riskId).val();
		var probalityUniqueId = $("#likelihood-"+riskId).val();
		
		if(typeof impactUniqueId !== "undefined" &&
			 typeof probalityUniqueId !== "undefined")
		{
			 if(impactUniqueId !='' && 
					probalityUniqueId != ''){
							// Code Block Start
							var pageValJson = "{\"impactRating\":" + "\"" + impactUniqueId
								+ "\",\"likelihoodRating\":\"" + probalityUniqueId + "\"}";
								console.log(pageValJson);
								document.getElementById('load').style.visibility = "visible";
								$("#controlAssessment-"+riskId).attr("disabled", true);
								$("#controlAssessment-"+riskId).prop('selectedIndex',0);
								$("#residualRating-"+riskId).text("NA");
								$("#residualRating-"+riskId).css("background-color", "#6c757d");

								// ajax call
				$
					.ajax({
						url : 'fetchMatrixTable',
						type: "POST",
						data: {
							pageValJson : pageValJson
						},// important line for thymeleaf http security

						headers : {
											"X-CSRF-TOKEN" : $(
													"input[name='_csrf']")
													.val()
										},
						cache: false,
						// async:true,

						success : function(response) {
								setTimeout(
										function() {
											document
													.getElementById('interactive');
											document
													.getElementById('load').style.visibility = "hidden";
											
										}, 1000);

					var jsonResponse = JSON
													.stringify(response);
											obj = JSON.parse(jsonResponse);

											
											$("#inherentRiskResult-"+riskId).text(obj.likeImpactMatrix.severityLevel);
											$("#inherentRiskResult-"+riskId).css("background-color", obj.likeImpactMatrix.colorCode);
											$("#inherentRiskResult-"+riskId).attr('data-assessmentDate', moment().format('DD-MMM-YYYY'));
											$("#inherentRiskResult-"+riskId).attr('data-assessmentValue', obj.likeImpactMatrix.calcValues );
											
											$("#controlAssessment-"+riskId).removeAttr('disabled');
											
											
											//$("#cntrlEffectiveness-"+riskId).attr('disabled', false);
											//$("#cntrlEffectiveness-"+riskId ).removeClass( "disabled" );
											//$("#cntrlEffectiveness-"+riskId).prop("disabled", false);  

										},
										error : function(xhr, status, error) {
											console.log(xhr);
											toastr
													.error('Some Error Occured');
										}
									});
			}
		}

	});
	
	
	// code for Control Assessment Dropdown
	$(".cntrlAssessment").change(function() {
		
		
		var id = $(this).attr('id');
		var dataId = $(this).attr("data-hiddenId");
		var splitId = id.split("-");
		var riskId = splitId[1];
		// Make Unique Id for Control Assessment 
		var controlAssessmentId = $("#controlAssessment-"+riskId).find(":selected").text().trim().toUpperCase();

		var inherentRiskAssessment = $("#inherentRiskResult-"+riskId).text().trim().toUpperCase();
		
	if(typeof controlAssessmentId !== "undefined")
		{
			 if(controlAssessmentId !=''){
							// Code Block Start
							var pageValJson = "{\"inherentRiskAssessment\":" + "\"" + inherentRiskAssessment
								+ "\",\"cntrlEffectiveness\":\"" + controlAssessmentId + "\"}";
								console.log(pageValJson);
								document.getElementById('load').style.visibility = "visible";

								// ajax call
				$
					.ajax({
						url : 'fetchResidualMatrix',
						type: "POST",
						data: {
							pageValJson : pageValJson
						},// important line for thymeleaf http security

						headers : {
											"X-CSRF-TOKEN" : $(
													"input[name='_csrf']")
													.val()
										},
						cache: false,
						// async:true,

						success : function(response) {
								setTimeout(
										function() {
											document
													.getElementById('interactive');
											document
													.getElementById('load').style.visibility = "hidden";
											
										}, 1000);

					var jsonResponse = JSON
													.stringify(response);
											obj = JSON.parse(jsonResponse);
											
											
											console.log(obj.residualAssDto.residualResult);
											$("#residualRating-"+riskId).text(obj.residualAssDto.residualResult);
											$("#residualRating-"+riskId).css("background-color", obj.residualAssDto.residualAssessmentValueCol);
											
											// hiddenRiskId
											 $('#hiddenRiskId').val('');
											 $("#overRidejustification").val('');
											 $("#justification").val('');
											 $("#compensating").val('');
											 $("#improvementAreas").val('');
										
											$('#hiddenRiskId').val(dataId);
											
											
											$('#assessmentRiskId').text(dataId);
											$('#assessmentLikelihood').text($('#likelihood-'+riskId).find(":selected").text());
											$('#assessmentImpact').text($('#impactRating-'+riskId).find(":selected").text());
											
											$('#assessmentInherentRisk').text($('#inherentRiskResult-'+riskId).text());
											var bColor = $('#inherentRiskResult-'+riskId).css("background-color");
											$('#assessmentInherentRisk').css("background-color", bColor);
											
											$('#assessmentCntrlEffectiveness').text($('#controlAssessment-'+riskId).find(":selected").text());
											
											$('#assessmentResidual').text($('#residualRating-'+riskId).text());
											//var bColor = $('#residualRating-'+riskId).css("background-color");
											//alert(bColor);
											$('#assessmentResidual').css("background-color",obj.residualAssDto.residualAssessmentValueCol);
											
											$('#assessmentDate').text(moment().format('DD-MMM-YYYY'));
											$('#capturedBy').text($('#userName').val());
											
											
											if($('#residualRating-'+riskId).text().toUpperCase() =="LOW")
											{
												$("#improvementAreas").css('display', 'none');
												$("#improvementAreas").val("NA");
												$("#improvementLbl").css('display', 'none');
												
//												$("#additionalActionPlan").css('display', 'none');
//												$("#additionalActionPlan").val("");
//												$("#additionalActionPlan").css('display', 'none');
//												$("#additionalActionPlan").prop('required',false);
//												$("#additionalActionPlan").removeClass('is-invalid');	
												
											}else{
												$("#improvementAreas").css('display', '');
												$("#improvementAreas").val("");
												$("#improvementLbl").css('display', '');
												
//												$("#additionalActionPlan").css('display', '');
//												$("#additionalActionPlan").val("");
//												$("#additionalActionPlan").css('display', '');
//												$("#additionalActionPlan").prop('required',true);
//												$('#additionalActionPlan').addClass('is-invalid');	
//												$('#additionalActionPlan').after('<span id="reason-error" class="error invalid-feedback" style="display: inline;">This field is required.</span>');
											}
											
											$('#controlAssessmentModal').modal('show');
											
//											$('#controlAssessmentModal').on('show.bs.modal', function (event) {
//											  var button = $(event.relatedTarget) // Button that triggered the modal
//											  var recipient = button.data('whatever') // Extract info from data-* attributes
//											  var modal = $(this)
//											   //modal.find('.modal-body input').val(riskId)
//											});
											
											
											
											
										},
										error : function(xhr, status, error) {
											console.log(xhr);
											toastr
													.error('Some Error Occured');
										}
									});
			}
		}
		

	});
	
	$(".saveAssessmentArrow").click(
			function() {
				
				var tempid = $(this).attr("id");
				var riskId = tempid.replaceAll("/", "");	
				//alert(riskId);
				
				if($("#Modify-"+riskId).hasClass("notSelected")){
					$('span[id^="reason-error"]').remove();
					$('#saveAssessmentRiskId').text(tempid);
					$('#saveconfirmmodal').modal('show');
				}
				else{
					
					if($("#likelihood-"+riskId).val() =="")
					{
						toastr.error("Please Select Correct Probablity Or Likelihood Rating");
					}
					else if($("#impactRating-"+riskId).val() =="")
					{
						toastr.error("Please Select Correct Impact Rating");
					}
					else if($("#controlAssessment-"+riskId).val() =="")
					{
						toastr.error("Please Select Correct Control Effectiveness Rating");
					}
					else
					{
						$('#assessmentRiskId').text(tempid);
						$('#assessmentLikelihood').text($('#likelihood-'+riskId).find(":selected").text());
						$('#assessmentImpact').text($('#impactRating-'+riskId).find(":selected").text());
						
						$('#assessmentInherentRisk').text($('#inherentRiskResult-'+riskId).text());
						var bColor = $('#inherentRiskResult-'+riskId).css("background-color");
						$('#assessmentInherentRisk').css("background-color", bColor);
						
						$('#assessmentCntrlEffectiveness').text($('#controlAssessment-'+riskId).find(":selected").text());
						
						$('#assessmentResidual').text($('#residualRating-'+riskId).text());
						var bgColor = $('#residualRating-'+riskId).css("background-color");
						//alert(bColor);
						$('#assessmentResidual').css("background-color", bgColor);
						
						$('#assessmentDate').text(moment().format('DD-MMM-YYYY'));
						$('#capturedBy').text($('#userName').val());
						
						if($('#residualRating-'+riskId).text().toUpperCase() =="LOW")
						{
							$("#improvementAreas").css('display', 'none');
							$("#improvementAreas").val("NA");
							$("#improvementLbl").css('display', 'none');
							
							//$("#additionalActionPlan").css('display', 'none');
							//$("#additionalActionPlan").val("");
							//$("#additionalActionPlan").css('display', 'none');
							//$("#additionalActionPlan").prop('required',false);
							//$("#additionalActionPlan").removeClass('is-invalid');	
						}else{
							$("#improvementAreas").css('display', '');
							$("#improvementAreas").val("");
							$("#improvementLbl").css('display', '');
							
							//$("#additionalActionPlan").css('display', '');
							//$("#additionalActionPlan").val("");
							//$("#additionalActionPlan").css('display', '');
							//$("#additionalActionPlan").prop('required',true);
							//$('#additionalActionPlan').addClass('is-invalid');	
							//$('#additionalActionPlan').after('<span id="reason-error" class="error invalid-feedback" style="display: inline;">This field is required.</span>');
						}
						
						$('#controlAssessmentModal').modal('show');
				 	}
				}
				
	});
	
	
	// Save Assessment
	$(".saveAssessment").click(
			function() {
		
					
			if($("#justification").val() =="")
			{
			
				$('span[id^="reason-error"]').remove();
				$('#justification').addClass('is-invalid');
				$('#justification')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Justification for Rating</span>');
				
			}
			else if($("#compensating").val() =="")
			{
					$('span[id^="reason-error"]').remove();
					$('span[id^="reason-error"]').removeClass('is-invalid');
					$('#compensating').addClass('is-invalid');
					$('#compensating')
						.after(
							'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Compensating Controls</span>');
				
			}
			else if($("#improvementAreas").val() =="")
			{
					$('span[id^="reason-error"]').remove();
					$('#improvementAreas').addClass('is-invalid');
					$('#improvementAreas')
						.after(
							'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Improvement Areas</span>');
				
			}
			else if($("#commentControl").val() =="")
			{
					$('span[id^="reason-error"]').remove();
					$('#commentControl').addClass('is-invalid');
					$('#commentControl')
						.after(
							'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Comments </span>');
				
			}
			
			else
			{
			
				document.getElementById('load').style.visibility = "visible";
				//Check table data
				var filedetails = "[\n";
				if ($('#filedetails tr').length > 0) {
					$('#filedetails > tbody  > tr').each(function(index, value) {
						var splitvalue = $(this).find('td:eq(0)').text().split('.');
						var sizesplit = $(this).find('td:eq(1)').text().split(' ');
						filedetails = filedetails +
							"  {  \"fileName\": \"" + $(this).find('td:eq(0)').text() + "\",\n" +
							"    \"fileSize\": \"" + sizesplit[0] + "\",\n" +
			
							"    \"fileType\": \"" + splitvalue[1] + "\"\n" +
							" },";
			
			
					});
					//filedetails = filedetails.slice(0,-1);
					filedetails = filedetails.substring(0, filedetails.length - 1);
				}
				filedetails = filedetails +
					"]";
					

				var hiddenRiskIdSlash = $("#hiddenRiskId").val();
				var hiddenRiskId = hiddenRiskIdSlash.replaceAll("/", "");		
						
//				alert("Risk id "+ hiddenRiskId);
				
				
				var matrixString = "{\n" + "  \"riskId\": \""
								+ $("#hiddenRiskId").val() + "\",\n"
								+ " \"impactRatingScale\": \""
								+ $('#impactRating-'+hiddenRiskId).find(":selected").text().trim().toUpperCase() + "\",\n"
								+ " \"impactValue\": \""
								+ $('#impactRating-'+hiddenRiskId).find(":selected").val().trim() + "\",\n"
								+ " \"likelihoodRatingScale\":\""
								+ $('#likelihood-'+hiddenRiskId).find(":selected").text().trim().toUpperCase() + "\",\n"
								+ " \"likelihoodValue\": \""
								+ $('#likelihood-'+hiddenRiskId).find(":selected").val().trim() + "\",\n"
								+ " \"assessmentValue\": \"" + $('#inherentRiskResult-'+hiddenRiskId).attr("data-assessmentValue").trim() + "\",\n"
								+ " \"assessmentDate\": \""
								+ $('#inherentRiskResult-'+hiddenRiskId).attr("data-assessmentDate").trim() + "\",\n"
								+ " \"assessmentRatingScale\":\"" + $('#inherentRiskResult-'+hiddenRiskId).text().trim().toUpperCase() + "\"\n"
								+ "}";	
								
				console.log("Matrix Rating Scale "+ matrixString);
//				alert("Matrix String "+ matrixString);
				
				var programming = $('#hiddenRiskId').val();
				var overRide = null;
				if($('#overRidejustification').val() == null)
				{
					overRide = null
				}
				else
				{
					overRide = $('#overRidejustification').val().trim();
				}
				var justificationForRidding = $('#justification').val().replace(/\"/g,''); //.replace(/[^\x00-\x7F]/g, "");
				justificationForRidding = justificationForRidding.replace(/[^\x00-\x7F]/g, "");
				
				var compensatingControls = $('#compensating').val().replace(/\"/g,''); //.replace(/[^\x00-\x7F]/g, "");
				compensatingControls = compensatingControls.replace(/[^\x00-\x7F]/g, "");
				
				var improvementAreas = $('#improvementAreas').val().replace(/\"/g,''); //.replace(/[^\x00-\x7F]/g, "");
				improvementAreas = improvementAreas.replace(/[^\x00-\x7F]/g, "");
			
			
				var controlString = "{\n" +
					"    \"controlId\": \"" + $("#controlId").val() + "\",\n" +
					"    \"controlAssessmentValue\":\"" + $('#controlAssessment-'+hiddenRiskId).find(":selected").text().toUpperCase().trim() + "\",\n" +
					"    \"justifyForOverRidding\":\"" + overRide + "\",\n" +
					"    \"justificationForRating\":\"" + justificationForRidding.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
					"    \"compensatingControl\":\"" + compensatingControls.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
					"    \"improvementAreas\":\"" + improvementAreas.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
					"    \"listRiskId\":\"" + programming + "\",\n" +
					"    \"officeId\":\"" + $('#officeId').val() + "\",\n" +
					"    \"reportingOfficeCode\":\"" + $('#reportingOfcId').val() + "\",\n" +
					"    \"filedetailsList\":" + filedetails + "\n" +
					"}";
			
			
				
				var rasString = "{\n" +
					"    \"riskId\": \"" + $("#hiddenRiskId").val() + "\",\n" +
					"    \"actionName\":\"modify\",\n" + 
					"    \"impactRating\":\"" +$('#impactRating-'+hiddenRiskId).find(":selected").text().trim() + "\",\n" +
					"    \"likelihoodRating\":\"" +$('#likelihood-'+hiddenRiskId).find(":selected").text().trim() + "\",\n" +
					" 	\"matrixCalcDto\":" + matrixString + "\, \n"+
					" 	\"residualAssDto\":" + controlString + "\, \n"+
					"   \"commentDto\": {\n"+
					    "      \"comment\": \""+ $("#commentControl").val().replace(/(\r\n|\n|\r)/gm, "")+"\"}}";
					"}";
					
//				
				var iterationCount = 1000;
					var keySize = 128;
					//passPhrase is the key
					var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
					var aesUtil = new AesUtil(keySize, iterationCount);
					var ciphertext = aesUtil.encrypt(reverseText(passphrase), rasString);
					$("#encryptedJsonVC").val(ciphertext + ':~:' + passphrase);
				
					//alert("Final json is " + rasString);
					console.log(rasString);
					//alert($("#riskAssessmentFrm").attr('action'));
					//alert($("#encryptedJsonVC").val());
					//alert($("#encryptedRequest").val());
					
					$("#riskAssessmentFrm").submit();
				
			}
				
		});
		
		
		// final submit without update
		$("#finalSave").click(
			function() {
				
				var controlString = null;
				var rasString = "{\n" +
					"    \"riskId\": \"" + $("#saveAssessmentRiskId").text().trim() + "\",\n" +
					"    \"officeId\":\"" + $('#officeId').val() + "\",\n" +
					"    \"riskStatus\":\"AR\",\n" + 
					"    \"actionName\":\"approve\",\n" + 
					//"    \"additionalActionPlan\":\"" + $('#additionalActionPlan').val() + "\",\n" +
					" 	\"residualAssDto\":" + controlString + "\n"+
					"}";
				
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
				var aesUtil = new AesUtil(keySize, iterationCount);
				var ciphertext = aesUtil.encrypt(reverseText(passphrase), rasString);
				$("#encryptedJsonVC").val(ciphertext + ':~:' + passphrase);
				//alert("Final json is " + rasString);
				console.log(rasString);
		
				$("#riskAssessmentFrm").submit();
		});
		
		
		// Modify Button Logic
		$(".modifyData").click(
			function() {
				 
			if($("#freezeValue").val() != "true"){
				
				if($(this).hasClass("notSelected")){
					var tempid = $(this).attr("id");
					var split = tempid.split("-");
					var riskId = split[1].replaceAll("/", "");	
					
					 $("#likelihood-"+riskId).prop("disabled", false);
					 $("#impactRating-"+riskId).prop("disabled", false);
					 $("#controlAssessment-"+riskId).prop("disabled", false);
					
					$(this).removeClass("bg-maroon").addClass("bg-navy");
					$(this).removeClass("notSelected").addClass("select");
					$("#pencil-"+ riskId).css('display', 'none');
					$("#cross-"+ riskId).css('display', '');
					$("#freezeValue").val("true");
					
				}
				else{
					var tempid = $(this).attr("id");
					var split = tempid.split("-");
					var riskId = split[1].replaceAll("/", "");	
					
					$("#hiddenId").val(riskId);
					$('#cancelmodel').modal('show');
				}
			}else{
				
				$('#cancelmodel').modal('show');
				//alert("Please Save previous records, if you continue then your previous changes might be loss");
			}
				//alert($('#Modify-'+split[1]).attr("data-modifyId"));
				//var classname= $(this).attr("class");
				//alert("Class Name "+ classname);
				
			});
			
			/*
			icon = $(this).find("i");
		  	if(icon.hasClass("fa-pencil-alt")){
				alert("Pencil");
		    	icon.removeClass("fas fa-pencil-alt fa-1x text-white");
				icon.addClass("far fa-window-close fa-1x text-white");
				$('this').find("i").toggleClass("fas fa-window-close");
				//<i class="fas fa-window-close"></i>
		  	}else{
				alert("Crossed");
		    	icon.addClass("fas fa-pencil-alt fa-1x text-white").removeClass("fas fa-window-close fa-1x text-white");
				$('this').find("i").toggleClass("fas fa-pencil-alt");
		  	}
			 */
		


$(".target").click(function(){
	document.getElementById('load').style.visibility = "visible";
	//var pagename = $(".target").attr("data-pagename");
	//$('a.target').attr('href', pagename);
	var tempid = $("#hiddenId").attr("id");
	
//	$("#likelihood-"+riskId).prop("disabled", true);
//	$("#impactRating-"+riskId).prop("disabled", true);
//	$("#controlAssessment-"+riskId).prop("disabled", true);
//	
//	$(this).removeClass("bg-navy").addClass("bg-maroon");
//	$(this).removeClass("select").addClass("notSelected");
//	$("#pencil").css('display', '');
//	$("#cross").css('display', 'none');
//					
});

