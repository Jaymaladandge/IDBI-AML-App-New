$(function() {
	$(function() {
			//Initialize Select2 Elements
			$('.select2').select2();

			bsCustomFileInput.init();
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

});




//loader


document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
		//document.getElementById('contents').style.visibility = "hidden";
	} else if (state == 'complete') {
		setTimeout(
				function() {
					document.getElementById('interactive');
					document.getElementById('load').style.visibility = "hidden";
					//document.getElementById('contents').style.visibility = "visible";
				}, 1000);
	}
}


// export
$('.export')
	.click(
		function() {

	//var jsonVariable = $("#highInherentAndResidual").val();
	
	var submenuDetails = "[\n";
	if($('#reporttable tr').length > 0){
	
	$( '#reporttable > tbody  > tr').each(function( index, value ) {
		
		submenuDetails=submenuDetails +
		"  {  \"riskId\": \""+ $(this).find('td:eq(0)').text()+ "\",\n"+ 
		"    \"riskName\": \""+ $(this).find('td:eq(1)').text()+ "\",\n"+
		"    \"riskDescription\": \""+ $(this).find('td:eq(2)').text()+ "\",\n"+
		"    \"deptName\": \""+ $(this).find('td:eq(3)').text()+ "\",\n"+
		"    \"riskAssessmentValue\": \""+ $(this).find('td:eq(4)').text()+ "\",\n"+
		"    \"residualAssessmentValue\": \""+ $(this).find('td:eq(5)').text()+ "\"\n"+
		" },";
	});
	
		submenuDetails = submenuDetails.substring(0,submenuDetails.length - 1);
	}
	submenuDetails = submenuDetails +
	"]";
	
	
	var pageValJson = "{\n" + 
					"    \"selectedAssessmentPeriod\": \""+ $('#creationPeriod').find(":selected").text() + "\",\n"+
					"    \"officeName\": \""+ $('#officeType').find(":selected").text()+' - '+$('#officeCode').find(":selected").text() + "\",\n"+ 
					"    \"riskLibDtoList\":"+ submenuDetails+"\n"+ 
					"}";
	document.getElementById('load').style.visibility = "visible";
	
	//console.log("jsonVariable "+ jsonVariable);
	//var pageValJson = jsonVariable;

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
	
	document.getElementById('load').style.visibility = "hidden";

});


// Office Type Drop down change
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
									text: items.officeCode
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
	 $("#officeCode").prop("selectedIndex", 0).val();
 }); 





// view Control Modal
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


	
		
// dril down 
  
$('.inherent').click(function(){
	var id = this.id;
	var valuesArr = id.split("~");
	var assessmentCategory = valuesArr[0];
	var selectedAssessmentStatus = valuesArr[1];
	var deptId = valuesArr[2];
	
	var duration = $("#assessmentDate").find(":selected").val().trim().toUpperCase();
	var officeType = $("#officeType").val();
	
	
			var dept = $(this).val();
			//							var pageValJson = "{\"searchParam\":"
			//									+ "\"" + dept + "\"}";
	
			var searchParameter = "assessmentStatuswise";
			var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
				+ "\",\"searchValue\":\"" + deptId
				+ "\",\"assessmentPeriod\":\"" +  duration
				+ "\",\"assessmentCategory\":\"" +  assessmentCategory
				+ "\",\"selectedAssessmentStatus\":\"" +  selectedAssessmentStatus
				+ "\",\"officeType\":\"" +  officeType
				+ "\"}";


			console.log("pageValJson "+ pageValJson);
			
			document.getElementById('load').style.visibility = "visible";


			// ajax call
			$
				.ajax({
					url: 'fetchRegisterFilterWise',
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

						$(".registerBody").empty();

						$('#controlTable').dataTable()
							.fnClearTable();
						$('#controlTable').DataTable()
							.destroy();
					
					
						
						obj.registerList
							.forEach(function(item) {

								
								//$('#actionplantable tr:last').after(

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
										
										+ "<td>"
										+ item.centralOfc
										+ "</td>"
										
										+ "<td>"
										+ item.zonalOfc
										+ "</td>"
										
										+ "<td>"
										+ item.divisionalOfc
										+ "</td>"
										
										+ "<td>"
										+ item.branchOfc
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


										+ "<td>"
										+ item.controlGaps
										+ "</td>"
										

										+ "<td>"
										+ item.keyMitigationMeasures
										+ "</td>"
										
										+ "<td><span class='badge text-white' style='background-color:"
										+ item.recordStatusCol
										+ "'; >"
										+ "Open"
										+ "</span></td>"

										+ "</td>"
//										+ "<td class='project-actions text-center'><span><a data-pagename='riskRegister' class='btn-sm bg-primary checkRiskData'"
//										+ "id='"
//										+ item.riskId
//										+ "' "
//										+ "title='Detailed View'> <i "
//										+ "class='fas fa-glasses text-white'></i></a>"
//										+ "	</span></td>"

//										+"<td><span><a class='btn btn-sm bg-navy closemodal disabled' title='Close'> <i class='fas fa-times-circle'></i></a></span> </td>"


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
									visible: true,
									targets: [2, 5, 6, 7, 11, 12, 16],
					
								},
//								{
//									orderable: false,
//									targets: [22, 23]
//					
//								}
							],

							"order": [0, "asc"],
							"responsive": false,
							"lengthMenu": [25, 50, 75, 100],
							"autoWidth": false,
							"searching": true,
							"fixedHeader": true,
							"buttons": ["csv", "excel"],
							"language": {
								"emptyTable": "No Data Available",
								"search": "Search:"
							},

						}).buttons().container().appendTo(
							'#controlTable_wrapper .col-md-6:eq(0)');


						console.log(obj);
						$('#hiddenDept').val(deptId);
						$('#registerContainer').show();
						// registerContainer
						$("#registerContainer").focus();

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
