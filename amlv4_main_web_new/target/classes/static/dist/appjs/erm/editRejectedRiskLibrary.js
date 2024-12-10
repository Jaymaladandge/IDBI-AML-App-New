$(document).ready(function() {
	var getDate = $("#assessmentDate").val();
	$("#showAsseDate").text(moment(getDate).format('DD-MMM-yyyy'));
	
	
	$("#filedetails").DataTable({
	
	"ordering": false,
	"responsive": false,
	"autoWidth": false,
	"searching": false,
	"fixedHeader": false,
	"language": {
		"emptyTable": "No Data Available"
	},
	}).buttons().container().appendTo(
		'#filedetails_wrapper .col-md-6:eq(0)');
	
	var table = $('#filedetails').DataTable();
	table.column( 5 ).visible( false );
	
	
	if ($("#customSwitch3").is(':checked')) {
		switchStatus = $("#customSwitch3").is(':checked');
		$("#valueCaptureDiv").hide();
		//cntrlAssessmentDiv
		$("#cntrlAssessmentDiv").hide();

	}
	else {
		switchStatus = $("#customSwitch3").is(':checked');
		$("#valueCaptureDiv").show();
		//$("#subMenu").hide();
		$("#cntrlAssessmentDiv").show();
	}
	
	// Notification Switch
	var switchStatus = false;
	$("#customSwitch3").on('change', function() {

		if ($(this).is(':checked')) {
			switchStatus = $(this).is(':checked');
			$("#valueCaptureDiv").hide();
			//cntrlAssessmentDiv
			$("#cntrlAssessmentDiv").hide();

		}
		else {
			switchStatus = $(this).is(':checked');
			$("#valueCaptureDiv").show();
			//$("#subMenu").hide();
			$("#cntrlAssessmentDiv").show();
		}
	});
});


$(document).ready(function() {
		
$('option').each(function() {
    t = $(this).text();
    $(this).text(t.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }))
});



//$('#raStmtDescription').on('change keyup keydown paste cut load', 'textarea', function () {
//        $(this).height(0).height(this.scrollHeight);
//    }).find('textarea').change();
//
//
//$('#rootCause').on('change keyup keydown paste cut load', 'textarea', function () {
//        $(this).height(0).height(this.scrollHeight);
//    }).find('textarea').change();


});

/*Text Area expansion based on Data input */
$(document).one('focus.form-control', 'textarea.form-control', function() {
var savedValue = this.value;
this.value = '';
this.baseScrollHeight = this.scrollHeight;
this.value = savedValue;
}).on('input.form-control', 'textarea.form-control', function() {
var minRows = this.getAttribute('data-min-rows') | 0, rows;
this.rows = minRows;
rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
this.rows = minRows + rows;
});
/*Text Area expansion based on Data input */

//checkbox change action to enable disable office description based on check box selection
$(document).on("change","input:checkbox[name=checkboxOffice]",  function() {
	var id = $(this).attr('id');
	var splitId = id.split("-");
	var descId = splitId[1];
	if ($("#" + id).is(':checked')) {
	
		$('#' + descId).prop('required',true);
		$('#' + descId).attr('disabled', false);
		$('#' + descId).css('display', '');
		$('#temp-' + descId).css('display', '');
		$('#'+descId).empty();
		$('#'+descId).val("");
		
		$('#'+descId).addClass('is-invalid');	
		$('#'+descId).after('<span id="reason-error" class="error invalid-feedback" style="display: inline;">This field is required.</span>');
		
		
		$('#riskId-'+ descId).prop('checked', true); 
	}
	else {
		$('#' + descId).prop('required',false);
		$('#' + descId).attr('disabled', true);
		$('#' + descId).css('display', 'none');
		$('#temp-' + descId).css('display', 'none');
		//BO-error
		$('span[id^=reason-error]').remove();
		$('span[id^="'+descId+'-error"]').remove();
		$("#"+descId).removeClass('is-invalid');	
		
		
		$('#'+descId).val("NA");
		//$('#'+descId).removeAttr('required');
		$('#riskId-'+ descId).prop('checked', false); 
		
	}
	
});  



$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
})

$("#create").click(function() {
	
	if(!$("#commentControl").val())
		{
			 $('span[id^="reason-error"]').remove();
				 $("#commentControl").addClass('is-invalid');	
				 $('#commentControl')
										.after(
												'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Comment</span>');
		}
	else{
		
//		if($("input[name='controlid']:checked").length == 0)
//		{
//		    toastr.error('Please select Control for Link');
//		}
//		else if($("input[name='controlid']:checked").length > 1)
//		{
//			toastr.error('User can select one control at time for Link');
//		}
//		else
//		{
//			$('#confirmmodal').modal('show');
//		}
		
		//$('#confirmmodal').modal('show');
	//}
	
	

	//	var impactRating = $('#impactRating').val();
	//	var likelihood = $('#likelihood').val().toString().toLowerCase();

	//var residualDrop =  $(".controlAssessmentDrop").find(":selected").text().trim().toUpperCase();
	//var residualDrop =  $(".controlAssessmentDrop").find(":selected").text().trim().toUpperCase();
	var residualDrop = $("#controlAssessmentDrop").val();
	//alert("Residual Dropdown Value "+ residualDrop);

	//if(residualDrop !== null || residualDrop !== "")
	
	if(residualDrop !='')
	{
		if($('#justification').val() =='')
		{
			
				$('span[id^="reason-error"]').remove();
				$('#justification').addClass('is-invalid');
				$('#justification')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Justification for Rating</span>');
		
		}
		else if($('#compensating').val() =='')
		{
				$('span[id^="reason-error"]').remove();
				$('#compensating').addClass('is-invalid');
				$('#compensating')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Compensating Controls</span>');
		
		}
		else if($('#improvementAreas').val() =='')
		{
				$('span[id^="reason-error"]').remove();
				$('#improvementAreas').addClass('is-invalid');
				$('#improvementAreas')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Improvement Areas</span>');
		
		}
		else{
			$('span[id^="reason-error"]').remove();
			$('#confirmmodal').modal('show');
		}
	}
	else
	{
		$('span[id^="reason-error"]').remove();
		$('#confirmmodal').modal('show');
	}


//	$('span[id^="reason-error"]').remove();
//	$('#confirmmodal').modal('show');	
	}
});


 




$("#createRA").click(function() {
	

	var actionName = $(this).attr("name");
	
		if($(":checkbox:checked").length > 0){
		
			//Get Value
			var officeDescValue = "[\n";
			$('.officeDesc').each(
		    function(index){  
		        var input = $(this);
				officeDescValue=officeDescValue +
				"  {  \"officeType\": \""+ input.attr('name')+ "\",\n"+ 
				"    \"officeDesc\": \""+ input.val().replace(/(\r\n|\n|\r)/gm, "")+ "\"\n"+
				" },";
		    }
		);
		officeDescValue = officeDescValue.substring(0,officeDescValue.length - 1);
		officeDescValue = officeDescValue +
		"]";
		
		document.getElementById('load').style.visibility="visible";
	
//		//Check table data
//		var filedetails = "[\n";
//		if($('#filedetails tr').length > 0){
//		$( '#filedetails > tbody  > tr').each(function( index, value ) {
//			var splitvalue = $(this).find('td:eq(0)').text().split('.');
//			var sizesplit=$(this).find('td:eq(1)').text().split(' ');
//			filedetails=filedetails +
//			"  {  \"fileName\": \""+ $(this).find('td:eq(0)').text()+ "\",\n"+ 
//			"    \"fileSize\": \""+ sizesplit[0]+ "\",\n"+ 
//			
//			"    \"fileType\": \""+ splitvalue[1]+ "\"\n"+
//			" },";
//			
//	
//		});
//		//filedetails = filedetails.slice(0,-1);
//		filedetails = filedetails.substring(0,filedetails.length - 1);
//		}
//		filedetails = filedetails +
//				"]";
				
		var controlString = "{\n" + 
						"    \"controlId\": \""+ $("#controlId").val()+ "\",\n"+ 
						"    \"controlDept\": \""+ $("#controlDept").val()+ "\",\n"+ 
						"    \"controlFunction\": \""+ $("#controlFunctionIs").val()+ "\",\n"+ 
						"    \"controlName\":\""+ $("#controlName").val()+ "\",\n"+ 
						"    \"controlAssessmentFreq\":\""+ $("#controlAssessmentFreq").val().replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+ 
						"    \"controlActionStatus\":\"NA\",\n" + 
						"    \"controlStatus\":\"ER\",\n" + 
						"    \"controlOwner\":\""+ $("#controlDept").val()+ "\",\n"+ 
						"    \"controlGaps\":\""+ $("#controlGaps").val()+ "\",\n"+ 
						"    \"indeparmentDependencies\":\""+ $("#controlDept").val()+ "\",\n"+ 
						"    \"actionName\":\""+actionName+ "\",\n"+ 
						"    \"officeDescValue\":"+officeDescValue+ ",\n"+  
						"   \"commentDto\": {\n"+
					    "      \"comment\": \""+ $("#commentControl").val().replace(/(\r\n|\n|\r)/gm, "")+"\"}}";
			
		
		}
	
	// code for between threshold value
	
	var officeidlist = $("input[name='checkboxOffice']:checked").map(function() {
                return this.value;
            }).get().join(', ');

	console.log("Office Id List "+ officeidlist);
//	var controlidlist = $("input[name='controlid']:checked").map(function() {
//                return this.value;
//            }).get().join(', ');

	var controlidlist = $("#controlId").val();

	
	document.getElementById('load').style.visibility = "visible";
	
		if(!$("#commentControl").val())
		{
			 $('span[id^="reason-error"]').remove();
				 $("#commentControl").addClass('is-invalid');	
				 $('#commentControl')
										.after(
												'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Action Path</span>');
		}
		
		var assessmentValue = $("#assessmentValue").val();
		var assessmentRating = $("#matrixTable").find('td:eq(3)').text();
		var assessmentDate = $("#matrixTable").find('td:eq(4)').text();
		
		if($("#assessmentValue").val() != null || $("#assessmentValue").val() != '')
		{
			var matrixString = "{\n" + "  \"riskId\": \""
							+ $("#raStmtId").val() + "\",\n"
							+ " \"impactRatingScale\": \""
							+ $('#impactRating').find(":selected").text().trim() + "\",\n"
							+ " \"impactValue\": \""
							+ $('#impactRating').val().trim() + "\",\n"
							+ " \"likelihoodRatingScale\":\""
							+ $('#likelihood').find(":selected").text().trim() + "\",\n"
							+ " \"likelihoodValue\": \""
							+ $('#likelihood').val().trim() + "\",\n"
							+ " \"assessmentValue\": \"" + assessmentValue + "\",\n"
							+ " \"assessmentDate\": \""
							+ assessmentDate + "\",\n"
							+ " \"assessmentRatingScale\":\"" + assessmentRating + "\"\n"
							+ "}";	
		}
		else{
			matrixString = null;
		}
		
		if(residualString != null || residualString != "")
		{
		
			var residualString = "{\n" +
							"    \"controlId\": \"" + $("#controlId").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
							"    \"controlAssessmentValue\":\"" + $(".controlAssessmentDrop").find(":selected").text().trim().toUpperCase() + "\",\n" +
	//						"    \"justifyForOverRidding\":\"" + overRide + "\",\n" +
	//						"    \"justificationForRating\":\"" + $('#justification').val().trim() + "\",\n" +
	//						"    \"compensatingControl\":\"" + $('#compensating').val().trim() + "\",\n" +
	//						"    \"improvementAreas\":\"" + $('#improvementAreas').val().trim() + "\",\n" +
							"    \"listRiskId\":\"" + $("#raStmtId").val() + "\",\n" +
							"    \"officeId\":\"" + $('#officeId').val() + "\"\n" +
							"}";
		}
		else
		{
			residualString= null;
		}
		
		var actionStatus="edit";
		var submenuDetails = "[\n";
			if($('#submenuDetails tr').length > 0){
			$( '#submenuDetails > tbody  > tr').each(function( index, value ) {
				
				submenuDetails=submenuDetails +
				"  {  \"keyMitigationDesc\": \""+ $(this).find('td:eq(0) textarea').val()+ "\",\n"+ 
				"    \"riskId\": \""+ $("#raStmtId").val()+ "\",\n"+ 
				"    \"keyMitigationId\": \""+ $(this).find('td:eq(2) input[type=hidden]').val()+ "\",\n"+ 
				"    \"actionStatus\": \""+ actionStatus+ "\"\n"+
				" },";
			});
			
			submenuDetails = submenuDetails.substring(0,submenuDetails.length - 1);
			}
			submenuDetails = submenuDetails +
						"]";
						
		
		
		//Check table data
		var filedetails = "[\n";
		if ($('#filedetails tr').length > 0) {
			$('#filedetails > tbody  > tr').each(function(index, value) {
				
				var table = $('#filedetails').DataTable();
				table.column( 5 ).visible( true );
				
				//var dtTable = $('#filedetails').DataTable() ; 
				//selectedIndex = dtTable.row(this).data()[5];   
				//alert("selectedIndex "+ selectedIndex);
				//$("#filedetails th:nth-child(5)").show();
				//var dtTable = $('#filedetails').DataTable();
				//dtTable.columns([5]).visible(false);
				//if($(this).find('td:eq(0) .fa-pencil').html())
				//alert(" $(this).find('td:eq()').val() "+ $(this).find('td:eq(0) value').text());
			
				//var fileId = selectedIndex; 
				//alert("fileId "+ fileId);
				
				var fileId = $(this).find('td:eq(5)').text();
				var splitVariable = $(this).find('td:eq(1)').text().split(' ');
				var fileType = splitVariable[1];
				//alert("fileId "+ fileId);
				if(fileId == null || typeof fileId == 'undefined' || fileId == '' || fileId =="" || fileId =="undefined"){
					
					if(typeof fileType != 'undefined' || fileType !="undefined" || fileType !=""){
						//alert("New file Uploaded");
						var splitvalue = $(this).find('td:eq(0)').text().split('.');
						var sizesplit = $(this).find('td:eq(1)').text().split(' ');
						filedetails = filedetails +
							"  {  \"fileName\": \"" + $(this).find('td:eq(0)').text() + "\",\n" +
							"    \"fileSize\": \"" + sizesplit[0] + "\",\n" +
			
							"    \"fileType\": \"" + splitvalue[1] + "\"\n" +
							" },";
						
					}else{
						//alert("No File Uploaded");
					}
					
					/*alert("New Uploaded "+ $(this).find('td:eq(0)').text());*/
				//else{
				//	alert("Already Uploaded "+ $(this).find('td:eq(0)').text());
				//}
				
				
				}
			});
			//filedetails = filedetails.slice(0,-1);
			filedetails = filedetails.substring(0, filedetails.length - 1);
		}
		filedetails = filedetails +
			"]";
		
		
		
	var rasString = "{\n" +
		"    \"riskId\": \"" + $("#raStmtId").val() + "\",\n" +
		"    \"riskDept\": \"" + $("#controlDept").val() + "\",\n" +
		"    \"riskFunction\":\"" + $("#controlFunction").val() + "\",\n" +
		"    \"riskName\":\"" + $("#riskName").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
		"    \"riskDescription\":\"" + $("#raStmtDescription").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
		"    \"keyMitigationMeasures\":\"" + $("#keyMitigationMeasures").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
		"    \"rootCauseOrTrigger\":\"" + $("#rootCause").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
		"    \"riskImpact\":\"" + $("#impact").val() + "\",\n" +
		"    \"riskAssessmentFreq\":\"" + $("#controlAssessmentFreq").val() + "\",\n" +
		"    \"riskClassification\":\"" + $("#riskClassification").val() + "\",\n" +
		"    \"subRiskClassification\":\"" + $("#subRisk").val() + "\",\n" +
		"    \"riskStatus\":\"ER\",\n" +
		"    \"riskActionName\":\"" + actionName + "\",\n" +
		"    \"makerDept\":\"" +  $( "#currentLoginDept" ).val() + "\",\n" +
		"    \"officesIdList\":\"" + officeidlist.trim() + "\",\n" +
		"    \"controlIdList\":\"" + controlidlist.trim() + "\",\n" +
		"    \"filedetailsList\":"+ filedetails + "\, \n"+ 
		" 	\"cntrlLibraryDto\":" + controlString + "\, \n"+
		" 	 \"matrixCalcDto\":" + matrixString + "\, \n"+
		" 	\"keyMitigationList\":" + submenuDetails + "\, \n"+
		" 	\"residualAssDto\":" + residualString + "\, \n"+
		"   \"commentDto\": {\n"+
					    "      \"comment\": \""+ $("#commentControl").val().replace(/(\r\n|\n|\r)/gm, "")+"\"}}";
		
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize, iterationCount);

	var ciphertext = aesUtil.encrypt(reverseText(passphrase), rasString);
	$("#encryptedJson").val(ciphertext + ':~:' + passphrase);

	console.log("Ras Sting "+ rasString);
	$("#frmriskapptstmt").submit();
});

$(function() {

	$('#frmriskapptstmt').validate({
		rules: {
			controlDept: {
				required: true
			},
			controlFunction: {
				required: true,
				maxlength : 1000
			},
			riskName: {
				required: true,
				maxlength : 100
			},

			checkboxOfficeRisk: {
				required: true
			},

			raStmtDescription: {
				required: true,
				minlength : 10,
				maxlength : 3000
			},

			rootCause: {
				required: true,
				minlength : 10,
				maxlength : 3000
			},

			impact: {
				required: true
			},

			controlAssessmentFreq: {
				required: true
			},
			riskClassification: {
				required: true
			},


			raAssessmentCriteria: {
				required: true
			},

			riskClassification: {
				required: true
			},

			subRisk: {
				required: true
			},
			
		},
		messages: {
			controlDept: {
				required: "Please Select a Control Department",
			},


			controlFunction: {
				required: "Please Provide the Control Function Name",
			},

			riskName: {
				required: "Please provide the Risk Name",
			},

			checkboxOfficeRisk: {
				required: "Please Select at least One Office",
			},

			raStmtDescription: {
				required: "Please Provide a Risk Description",
			},

			rootCause: {
				required: "Please Select a Department",
			},

			impact: {
				required: "Please Select a impact Value for Risk",
			},

			controlAssessmentFreq: {
				required: "Please Select a Assessment Frequency",
			},

			riskClassification: {
				required: "Please Select a Risk Classification",
			},

			subRisk: {
				required: "Please Select an Sub Risk",
			},
			
			


		
		},
		errorElement: 'span',
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback');
			element.closest('.form-group').append(error);
		},
		highlight: function(element, errorClass, validClass) {
			$(element).addClass('is-invalid');
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).removeClass('is-invalid');
		},
		submitHandler: function(form) {
			form.submit();
		}
	});
});

//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
		//document.getElementById('contents').style.visibility="hidden";
	} else if (state == 'complete') {
		setTimeout(function() {
			//document.getElementById('interactive');
			document.getElementById('load').style.visibility = "hidden";
			//document.getElementById('contents').style.visibility="visible";
		}, 1000);
	}
}

$("#today").text(moment(new Date()).format('DD/MM/YYYY'));



// Add Submenu 
var rowIdx = 0;
var count = 0;
var modCount = 0;

$('#addBtn')
			.click(
				function () {
				
					
//					var pageValJson = "{\n" + 
//					"    \"wfModule\": \""+ $("#workflowmodule").val()+ "\",\n"+ 
//					" \"wfActionSource\":" 
//							+ "\"" + $("#SourceRoleId").val() + "\",\n"+ 
//					" \"wfOfficeType\":" 
//							+ "\"" + $("#OfficeSource").val() + "\",\n"+ 
//					" \"wfCurrentAction\":" 
//							+ "\"" + $("#ActionName").val() + "\"}";
							
							
					
//					console.log(pageValJson)
//					document.getElementById('load').style.visibility = "visible";

					// ajax call
//					$
//						.ajax({
//							url: 'verifyWorkflowExist',
//							type: "POST",
//							data: {
//								pageValJson: pageValJson
//							},// important line for thymeleaf http security
//							headers: {
//								"X-CSRF-TOKEN": $(
//									"input[name='_csrf']")
//									.val()
//							},
//							cache: false,
//							// async:true,
//							success: function (response) {
//								setTimeout(
//									function () {
//										document
//											.getElementById('interactive');
//										document
//											.getElementById('load').style.visibility = "hidden";
//										document
//											.getElementById('contents').style.visibility = "visible";
//									}, 1000);
//
//								var jsonResponse = JSON
//									.stringify(response);
//								var obj = JSON.parse(jsonResponse);
								
//								console.log(obj);
//								if(obj.wfExist == 'SUCCESS')
//								{
//									toastr
//									.success('Workflow Exist');
//									$('#create').attr("disabled", true);
//								}
//								else
//								{
//								$('#create').attr("disabled", false);
									count = count + 1;
									modCount = modCount + 1;
									
									// Adding a row inside the tbody.
									
									$('#tbody').append(`
									<tr id="R${++rowIdx}">
										<td  id=R ${++rowIdx} class="row-index text-center">
											<textarea class="form-control form-control-sm" id="keyMitigationDesc" rows="3" data-placeholder="Key Mitigation Measure Description" name="text[]" maxlength="3000" style="overflow: auto;"> </textarea>
											
										</td>
										
										<td class="text-center">
											
											<button class="btn btn-danger btn-sm remove"
															type="button"><i class="fas fa-window-close"></i></button>
										</td>
										
										
									
									</tr>`);
									
									
									
									
//									$(".office").append($('#OfficeSource').html());
//									$(".officedest").append($('#Officedest').html());
//									$(".department").append($('#workflowDept').html());
//									$(".Action").append($('#ActionName').html());
//									$(".Action2").append($('#DestActionName').html());
									$('.select2').select2();
									
									
									
									$(document).ready(function () {
										$('select option').filter(function(){
												return ($(this).val().trim()=="" && $(this).text().trim()=="");
											}).remove();
											
											$("select option").each(function() {
											  $(this).siblings('[value="'+ this.value +'"]').remove();
											});
										});
								
										
//								}

//							},
//							error: function (xhr, status, error) {
//								console.log(xhr);
//								console.log(status);
//								console.log(error);
//								toastr
//									.error('Some Error Occured');
//							}
//						});
						
						
				});


// closeRow
	// jQuery button click event to remove a row.
$('#tbody').on('click', '.remove', function() {

	// Getting all the rows next to the row
	// containing the clicked button
	var child = $(this).closest('tr').nextAll();

	// Iterating across all the rows
	// obtained to change the index
	child.each(function() {

		// Getting <tr> id.
		var id = $(this).attr('id');

		// Getting the <p> inside the .row-index class.
		var idx = $(this).children('.row-index').children('p');

		// Gets the row number from <tr> id.
		var dig = parseInt(id.substring(1));

		// Modifying row index.
		idx.html(`Row ${dig - 1}`);

		// Modifying row id.
		$(this).attr('id', `R${dig - 1}`);
	});

	// Removing the current row.
	$(this).closest('tr').remove();

	// Decreasing total number of rows by 1.
	rowIdx--;
});



var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
	var username = $('#userName').val();
	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
		var flg = true;
		$('.uploadTable tr').each(function() {
			var fName = $(this).find('td:eq(0)').text();
			console.log('fName ' + fName + ' filename ' + filename);
			if (fName == filename) {
				flg = false;
			}
		});
		if (flg) {
			select
				.append($('<tr id=tr' + i + '><td id=filetd' + i + '>'
					+ filename
					+ '</td><td id=filesizetd' + i + '>'
					+ filesizeInMB
					+ ' kb</td><td>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td class="text-capitalize">'
					+ username
					+ '</td><td ><a class="btn btn-danger btn-sm" id="closerow"><i class="fas fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
		$('#filedetailsheader').show();
	}
}
$(".uploadTable").on("click", "#closerow", function() {

	var rowCount = $('.uploadTable tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#filedetails').hide();
		$('#filedetailsheader').hide();
	}
	$(this).closest("tr").remove();
});

$(".two-decimals").change(function() {
	this.value = parseFloat(this.value).toFixed(2);
});


// 0 for null values
// 8 for backspace 
// 48-57 for 0-9 numbers



/*]]>*/




// Department list 
$('#controlDept')
	.change(
		function() {
			var dept = $(this).val();
			var departmentName = $('#controlDept').find(":selected").text().trim().toUpperCase();
			var pageValJson = "{\"dept\":"
				+ "\"" + dept + "\"}";
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'fetchOfficeLevel',
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
						
						$(".risk-office-set").empty();
						obj.officeCheckValue
							.forEach(function(items) {
								$(
									//"<div class='form-group text-capitalize'' id='officetypeCheck'>"+
									"<div  class='form-check'>" +
									"<input  class='form-check-input checkboxOffice' value=' "+ items.officeValue +" ' name='checkboxOfficeRisk' type='checkbox' " +
									" id=riskId-" +
									items.officeCode +
									"  >" +
									"<label class='form-check-label' for=check-" +
									items.officeCode +
									" >" +
									items.officeValue +
									"</label>" +
									"</div>")
									.appendTo(
										".risk-office-set");

							});
						
						
						
						
						
						$(".office-set").empty();
						obj.officeCheckValue
							.forEach(function(items) {
								$(
									//"<div class='form-group text-capitalize'' id='officetypeCheck'>"+
									"<div  class='form-check'>" +
									"<input  class='form-check-input checkboxOffice' value=' "+ items.officeValue +" ' name='checkboxOffice' type='checkbox' " +
									" id=check-" +
									items.officeCode +
									"  >" +
									"<label class='form-check-label' for=check-" +
									items.officeCode +
									" >" +
									items.officeValue +
									"</label>" +
									"</div>")
									.appendTo(
										".office-set");

							});




						$(".office-desc").empty();
						obj.officeDescValue
							.forEach(function(items) {

								$(
									"<div  class='row text-capitalize '>" +
									"<div class='col-sm-12'>" +
									"<div class='form-group'>" +
									"<label for='controlDescCO' id=temp-"+
									items.officeCode +								
									"> " +
									items.officeValue +
									"</label>" +
									"<textarea class='form-control form-control-sm officeDesc' " +
									" name='" +
									items.officeCode +
									"' id='" +
									items.officeCode +
									"' maxlength='3000' placeholder='Control Description' placeholder='Control Description' disabled>" +
									"</textarea> </div></div></div>"
								)
									.appendTo(
										".office-desc");

							});
							
							console.log(obj);
						$("#controlOwner").val(departmentName);
						$("#interDepartment").val(departmentName);
						$("#controlDeptName").val(departmentName);
						$("#controlDept").val(dept);
						
						$("#departmentName").val(departmentName);

						

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

// Top risk jquery


$(function() {
	$("#controlTable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [0]
		}],
		"order": [1, "desc"],
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

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);

})

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
})
// BS-Stepper Init
$(document).ready(function() {
	var stepper = new Stepper($('.bs-stepper')[0])
})
// BS-Stepper Init
document.addEventListener('DOMContentLoaded', function() {
	window.stepper = new Stepper(document.querySelector('.bs-stepper'))
})

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

function validateFirst() {
	
	if ($('#frmriskapptstmt').valid()) {
		
		
		$("input[name=checkboxOfficeRisk]").each(function() {
			
			if ($(this).is(':checked')) {
				//alert("Checked Office "+ $(this).attr('id'));
				var id = $(this).attr('id');
				var splitId = id.split("-");
				var ofcId = splitId[1];
				//alert(ofcId);
				
				$('#check-'+ ofcId).prop('checked', true); // Checks it
				$('#temp-' + ofcId).css('display', '');
				$('#' + ofcId).prop('required',true);
				$('#' + ofcId).attr('disabled', false);
				$('#' + ofcId).css('display', '');
				//$('#'+ofcId).empty();
				
				//$('#'+ofcId).val("");
				$('span[id^="'+ofcId+'-error"]').remove();
				
				if($('#'+ofcId).val() == null || $('#'+ofcId).val() ==''){
					$('#'+ofcId).addClass('is-invalid');	
					$('#'+ofcId).after('<span id="'+ofcId+'-error" class="error invalid-feedback" style="display: inline;">This field is required.</span>');
				}
				
			 }
			else{
				//alert("Unchecked Office "+ $(this).attr('id'));
				var id =  $(this).attr('id');
				var splitId = id.split("-");
				var ofcId = splitId[1];
				//alert(ofcId);
				
				$('#check-'+ofcId).prop('checked', false); // Uncheck it
				$('#temp-' + ofcId).css('display', 'none');
				$('#' + ofcId).prop('required',false);
				$('#' + ofcId).attr('disabled', true);
				$('#' + ofcId).css('display', 'none');
				$('#temp-' + ofcId).css('display', 'none');
				
				//BO-error
				$('span[id^=reason-error]').remove();
				$('span[id^="'+ofcId+'-error"]').remove();
				$("#"+ofcId).removeClass('is-invalid');	
		
				$('#'+ofcId).val("");
				//$('#'+descId).removeAttr('required');
			}
		});
		
//		 var checkDept = $('#checkDept').val();  // already selected departments
//		 var checkOffice = $('#checkofc').val(); // already Linked Controls
//		 var controlDept = $('#controlDept').find(":selected").text();
//	
//		var programming = $("input[name='checkboxOffice']:checked").map(function() {
//                return this.value;
//            }).get().join(', ');
//	
//		
//			var searchParam = "ALL";
//			var searchValue = "EDITCONTROLSEARCH";
//			var controlDept = $('#controlDept').find(":selected").val();
//			
//			$("#riskID").val($('#controlDept').find(":selected").text());
//			
//			$("#operating").val(programming);
//								
//			var sortValue = "";
//			
//			var pageValJson = "{\"searchParam\":" + "\"" + searchParam
//				+ "\",\"searchValue\":\"" + searchValue
//				+ "\",\"userDept\":\"" + controlDept
//				+ "\",\"officeType\":\"" + programming.trim()
//				+ "\",\"riskId\":\"" + $("#raStmtId").val()
//				+ "\",\"sortValue\":\"" + sortValue + "\"}";
//			
//			console.log(pageValJson);
//			
//			document.getElementById('load').style.visibility = "visible";
//
//				var rowCount = 0;
//
//				rowCount = $('#controlTable tr').length;
//
//				if (rowCount > 1) {
//
//					var i = 1;
//					while (i < rowCount) {
//						$('#row_id').remove();
//						i++;
//					}
//
//				}
//				
//				
//				// ajax call
//				$
//					.ajax({
//						url : 'checkRiskContolLinks',
//						type: "POST",
//						data: {
//							pageValJson : pageValJson
//						},// important line for thymeleaf http security
//
//						headers : {
//											"X-CSRF-TOKEN" : $(
//													"input[name='_csrf']")
//													.val()
//										},
//						cache: false,
//						// async:true,
//
//						success : function(response) {
//								setTimeout(
//										function() {
//											document
//													.getElementById('interactive');
//											document
//													.getElementById('load').style.visibility = "hidden";
//											document
//													.getElementById('contents').style.visibility = "visible";
//										}, 1000);
//
//					var jsonResponse = JSON
//													.stringify(response);
//											obj = JSON.parse(jsonResponse);
//
//											$('#controlTable').dataTable()
//													.fnClearTable();
//											$('#controlTable').DataTable()
//													.destroy();
//
//											var NewRowsCount = 0;
//
//																obj
//													.forEach(function(items) {
//														
//
//														//$('#actionplantable tr:last').after(
//															
//														if (items.linked)
//														{
//															$(
//																	"<tr role='row' class='odd' id='row_id'><td><input type='checkbox' class='controlChk' name='controlid' value=' "+  items.controlId +" ' id='control_"+ items.controlId +"' checked></td><td class='sorting_1'>"
//																			+ items.controlId
//																			+ "</td><td><span class='textCapitalize'>"
//																			+ items.controlFunction
//																			+ "</span></td><td><span class='textCapitalize'>"
//																			+ items.controlName
//																			+ "</span></td>"
//																			+ "<td><span class='textCapitalize'>"
//																			+ items.controlAssessmentFreq
//																			+ "</span></td>"
//																			+ "</tr>")
//																	.appendTo(
//																			".actPlanBody");
//														}
//														else
//														{
//															$(
//																	"<tr role='row' class='odd' id='row_id'><td><input type='checkbox' class='controlChk' name='controlid' value=' "+  items.controlId +" ' id='control_"+ items.controlId +"'></td><td class='sorting_1'>"
//																			+ items.controlId
//																			+ "</td><td><span class='textCapitalize'>"
//																			+ items.controlFunction
//																			+ "</span></td><td><span class='textCapitalize'>"
//																			+ items.controlName
//																			+ "</span></td>"
//																			+ "<td><span class='textCapitalize'>"
//																			+ items.controlAssessmentFreq
//																			+ "</span></td>"
//																			+ "</tr>")
//																	.appendTo(
//																			".actPlanBody");
//															
//														}
//
//													});
//
//											if (userRole != "Risk Owner") {
//												$(".unlinkbtn").addClass(
//														"disabled");
//											}
//											
//											if ($('#controlTable tr').length == 2) {
//												$(".unlinkbtn").addClass(
//														"disabled");
//											}
//
//											$("#controlTable").DataTable({
//													"columnDefs": [{
//														orderable: false,
//														targets: [0],
//														width: "2%"
//													},
//													{
//														targets: [1],
//														width: "7%"
//													}
//													],
//													"order": [1, "desc"],
//													"responsive": false,
//													"lengthMenu": [25, 50, 75, 100],
//													"autoWidth": false,
//													"searching": false,
//													"fixedHeader": true,
//													//"buttons": ["csv", "excel", "pdf", "print"],
//													"language": {
//														"emptyTable": "No Data Available"
//													},
//											
//												}).buttons().container().appendTo(
//													'#controlTable_wrapper .col-md-6:eq(0)');
//
//											//.clear().rows.add()
//											$('#controlTable').DataTable()
//													.draw();
//											
//											var flg = true;
//											stepper.next();
//											$(window).scrollTop(1);
//										},
//										error : function(xhr, status, error) {
//											console.log(xhr);
//											toastr
//													.error('Some Error Occured');
//										}
//									});

			$("#controlFunctionIs").val($("#controlFunction").val());
			$("#controlFunctionIs").attr('disabled', true);
			stepper.next();
			$(window).scrollTop(1);
				
	}
}

// Validate Second
function validate2() {
//	var flg = false;
//	
//	if($("input[name='controlid']:checked").length == 0)
//	{
//		toastr.error('Please select Control for Link');
//	}
//	else if($("input[name='controlid']:checked").length > 1)
//	{
//		toastr.error('User can select one control at time for Link');
//	}
//	else
//	{
//		flg = true;
//		if (flg) {
//		stepper.next();
//		}
//	}
	stepper.next();
}

function validate3() {
	stepper.next();
}

// File upload //
var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
	var username = $('#userName').val();
	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
		var flg = true;
		$('.uploadTable tr').each(function() {
			var fName = $(this).find('td:eq(0)').text();
			if (fName == filename) {
				flg = false;
			}
		});
		if (flg) {
			select
				.append($('<tr id=tr' + i + '><td id=filetd' + i + '>'
					+ filename
					+ '</td><td id=filesizetd' + i + '>'
					+ filesizeInMB
					+ ' kb</td><td>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td class="text-capitalize">'
					+ username
					+ '</td><td ><a class="btn btn-danger btn-sm" id="closerow"><i class="fas fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
	}
}
$(".uploadTable").on("click", "#closerow", function() {
	$(this).closest("tr").remove();
	var rowCount = $('.uploadTable tbody tr').length;
	if (rowCount == 0) {
		$('#filedetails').hide();
	}
});




// Search method by AJax

// Set Control Table Based on Department Dropdown



// Fetch Action Plan Ajax Started
//$('a.fetchControl')
//	.click(
//		function() {
//			
//			var controlDept = $('#controlDept').find(":selected").val();
//			var searchParam = $('#dimension').find(":selected").val();
//			var searchValue = $('#searchcriteria').val().toUpperCase();
//			if (searchParam == '') {
//				toastr.info('Please Select Search Parameter For Search');
//			} else if (searchValue == '') {
//				toastr.info('Please Add Some Value For Search');
//			} else {
//				if (searchParam == 'controlStatus') {
//					if (searchValue.includes('PENDING APPROVAL')) {
//						searchValue = 'D';
//					} else {
//						searchValue = searchValue.charAt(0);
//					}
//				}
//				var sortValue = $('#sorting').find(":selected").val();
//
//
//				var pageValJson = "{\"searchParam\":" + "\"" + searchParam
//					+ "\",\"searchValue\":\"" + searchValue
//					+ "\",\"userDept\":\"" + controlDept
//					+ "\",\"sortValue\":\"" + sortValue + "\"}";
//			}
//			
//			console.log(pageValJson);
//			
//			document.getElementById('load').style.visibility = "visible";
//
//				var rowCount = 0;
//
//				rowCount = $('#controlTable tr').length;
//
//				if (rowCount > 1) {
//
//					var i = 1;
//					while (i < rowCount) {
//						$('#row_id').remove();
//						i++;
//					}
//
//				}
//				
//			// ajax call
//				$
//					.ajax({
//						url : 'searchRiskControlList',
//						type: "POST",
//						data: {
//							pageValJson : pageValJson
//						},// important line for thymeleaf http security
//
//						headers : {
//											"X-CSRF-TOKEN" : $(
//													"input[name='_csrf']")
//													.val()
//										},
//						cache: false,
//						// async:true,
//
//						success : function(response) {
//								setTimeout(
//										function() {
//											document
//													.getElementById('interactive');
//											document
//													.getElementById('load').style.visibility = "hidden";
//											document
//													.getElementById('contents').style.visibility = "visible";
//										}, 1000);
//
//					var jsonResponse = JSON
//													.stringify(response);
//											obj = JSON.parse(jsonResponse);
//
//											$('#controlTable').dataTable()
//													.fnClearTable();
//											$('#controlTable').DataTable()
//													.destroy();
//
//											var NewRowsCount = 0;
//
//																obj
//													.forEach(function(items) {
//
//														//$('#actionplantable tr:last').after(
//
//														if (items.controlId)
//															$(
//																	"<tr role='row' class='odd' id='row_id'><td><input type='checkbox'	name='controlid' value=' "+  items.controlId +" ' id=' "+  items.controlId +" '></td><td class='sorting_1'>"
//																			+ items.controlId
//																			+ "</td><td><span class='textCapitalize'>"
//																			+ items.controlFunction
//																			+ "</span></td><td><span class='textCapitalize'>"
//																			+ items.controlName
//																			+ "</span></td>" //<td><span class='badge bg-success'>"
//																			//+ items.controlStatus
//																			//+ "</span></td>
//																			+ "<td><span class='textCapitalize'>"
//																			+ items.controlAssessmentFreq
//																			+ "</span></td>"
//																			+ "</tr>")
//																	.appendTo(
//																			".actPlanBody");
//
//													});
//
//											if (userRole != "Risk Owner") {
//												$(".unlinkbtn").addClass(
//														"disabled");
//											}
//											
//											if ($('#controlTable tr').length == 2) {
//												$(".unlinkbtn").addClass(
//														"disabled");
//											}
//
//											$("#controlTable").DataTable({
//													"columnDefs": [{
//														orderable: false,
//														targets: [0]
//													}],
//													"order": [1, "desc"],
//													"responsive": false,
//													"lengthMenu": [25, 50, 75, 100],
//													"autoWidth": true,
//													"searching": false,
//													"fixedHeader": true,
//													//"buttons": ["csv", "excel", "pdf", "print"],
//													"language": {
//														"emptyTable": "No Data Available"
//													},
//											
//												}).buttons().container().appendTo(
//													'#controlTable_wrapper .col-md-6:eq(0)');
//
//											//.clear().rows.add()
//											$('#controlTable').DataTable()
//													.draw();
//
//										},
//										error : function(xhr, status, error) {
//											console.log(xhr);
//											toastr
//													.error('Some Error Occured');
//										}
//									});
//	});
	
	
	
		// Dropdown change function
	// Syntax for [IMPACT - LIKELIHOOD]
	
	$(".ratingImpact").change(function() {
		
		var impactRating = $('#impactRating').val();
		var likelihood = $('#likelihood').val().toString().toLowerCase();
		
		if(impactRating !='' && likelihood !='')
		{
			var pageValJson = "{\"impactRating\":" + "\"" + impactRating
				+ "\",\"likelihoodRating\":\"" + likelihood + "\"}";
			
			console.log(pageValJson);
			
			var riskName = $("#riskName").val();
			$("#controlAssessmentDrop").attr("disabled", true);
			
			$('#justificationDiv').css('display','none');
			
			$('#justification').prop('required',false);
			$('#compensating').prop('required',false);
			$('#improvementAreas').prop('required',false);
			
			document.getElementById('load').style.visibility = "visible";
			
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
											document
													.getElementById('contents').style.visibility = "visible";
										}, 1000);

					var jsonResponse = JSON
													.stringify(response);
											obj = JSON.parse(jsonResponse);

											$('#matrixTable').dataTable()
													.fnClearTable();
											$('#matrixTable').DataTable()
													.destroy();
											
											$("#assessmentValue").val(obj.likeImpactMatrix.calcValues);
										//	alert(obj.likeImpactMatrix.colorCode);
										//	obj.likeImpactMatrixList.forEach(function(items) {

														//$('#actionplantable tr:last').after(

														if (obj.likeImpactMatrix.severityLevel)
															$(
																	"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
																			+ riskName
																			+ "</td><td><span class='textCapitalize'>"
																			+ $('#impactRating').find(":selected").text().toString().toLowerCase()
																			+ "</span></td><td><span class='textCapitalize'>"
																			+ $('#likelihood').find(":selected").text().toString().toLowerCase()
																			+ "</span></td>"
																			+ "<td><span class='badge text-white' id='inherentRiskRatingId' style='background-color:"
																			+ obj.likeImpactMatrix.colorCode
																			+ "'; >"
																			+ obj.likeImpactMatrix.severityLevel
																			+ "</span></td>"
																			+ "<td><span class='textCapitalize'>"
																			+ moment().format('DD-MMM-YYYY')
																			+ "</span></td>"
																			+ "<td><span class='textCapitalize'>"
																			+ $('#userName').val()
																			+ "</span></td>"
																			+ "</tr>")
																	.appendTo(
																			".matrixBody");

										//		});
											
											$("#matrixTable").DataTable({
													"columnDefs": [{
														orderable: false,
														targets: [0, 1, 2, 3, 4, 5 ]
													}],
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

											//.clear().rows.add()
											$('span[id^="reason-error"]').remove();
											$('#hiddenMatrix').show();
											$('#matrixTable').DataTable()
													.draw();
													
											//controlAssessmentDrop
//											$(".controlAssessmentDrop").prop('selectedIndex',0);
//											$("#controlAssessmentDrop").removeAttr('selected');
											$("#controlAssessmentDrop").removeAttr('disabled');
											
											$('#ResidualhiddenMatrix').hide();
											
											// callbackSecond function.
											
//											alert($(".controlAssessmentDrop").find(":selected").text().trim().toUpperCase());
											if($(".controlAssessmentDrop").find(":selected").text().trim().toUpperCase() == "SELECT"){
												
											}else{
												changeResidualMatrix();
											}
											
									
										},
										error : function(xhr, status, error) {
											console.log(xhr);
											toastr
													.error('Some Error Occured');
										}
									});
			
			
//			var obj = $("#hdnDto").val();
//			alert(obj.likeImpactMatrixList);
//			console.log(obj.likeImpactMatrixList);
//			obj.likeImpactMatrixList.forEach(function(items){
//				alert("Items "+ items);
//				var jsonResponse = JSON.stringify(items.calcValues);
//				var obj2 = JSON.parse(jsonResponse);
//				alert(obj2);
//			});
//			
//			var jsonResponse = JSON
//													.stringify(hiddenList);
//													
//											var obj = JSON.parse(jsonResponse);
//											obj
//													.forEach(function(items) {
//														alert("Impact Rating "+ items.calcValues);
//													});
//			console.log("Object Is "+ obj);
//			alert(hiddenList);
//			var jsonResponse = JSON.stringify(hiddenList);
//			var	obj = JSON.parse(jsonResponse);
//			
//			alert("oBJECT IS" + obj);
//			console.log("Object Is "+ obj);
//			
//			obj
//													.each(function(items) {
//					
//					alert("Keys "+ items.impactLikeConcatVal);
//				
//				});
			
			
		}

	});



	// code for Control Assessment Dropdown
	$(".controlAssessmentDrop").change(function() {
	
		var riskId = $("#raStmtId").val();
		// Make Unique Id for Control Assessment 
		var controlAssessment = $(".controlAssessmentDrop").find(":selected").text().trim().toUpperCase();
		var inherentRiskAssessment = $("#inherentRiskRatingId").text().toUpperCase();
		
	if(typeof controlAssessment !== "undefined")
		{
			 if(controlAssessment !=''){
							// Code Block Start
							var pageValJson = "{\"inherentRiskAssessment\":" + "\"" + inherentRiskAssessment
								+ "\",\"cntrlEffectiveness\":\"" + controlAssessment + "\"}";
								console.log(pageValJson);
								document.getElementById('load').style.visibility = "visible";
					
				$('#justificationDiv').css('display','none');
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
											
											$('#assessmentRiskId').text(riskId);
											$('#assessmentLikelihood').text($('#likelihood').find(":selected").text().trim());
											$('#assessmentImpact').text($('#impactRating').find(":selected").text().trim());
											$('#assessmentInherentRisk').text($("#inherentRiskRatingId").text());
											var bColor = $('#inherentRiskRatingId').css("background-color");
											$('#assessmentInherentRisk').css("background-color", bColor);
											//assessmentCntrlEffectiveness
											$('#assessmentCntrlEffectiveness').text($('.controlAssessmentDrop').find(":selected").text());
											
											$('#assessmentResidual').text(obj.residualAssDto.residualResult);
											$('#assessmentResidual').css("background-color", obj.residualAssDto.residualAssessmentValueCol);
											
											$('#assessmentDate').text(moment().format('DD-MMM-YYYY'));
											$('#capturedBy').text($('#userName').val());
								
											//ResidualhiddenMatrix
											//$('#ResidualhiddenMatrixOld').css('display','none');
											$('#ResidualhiddenMatrix').css('display','');
											
											$('#justificationDiv').css('display','');
										 	$("#justification").val('');
										 	$("#compensating").val('');
										 	$("#improvementAreas").val('');
										
											$('#justification').prop('required',true);
											$('#compensating').prop('required',true);
											$('#improvementAreas').prop('required',true);
											
											if($("#assessmentResidual").text().toUpperCase() == "LOW"){
												$('#improvementAreas').css('display','none');
												$('#improvementAreas').val('NA');
												$('#improvementLbl').css('display','none');
											}
											else{
												$('#improvementAreas').css('display','');
												$('#improvementAreas').val('');
												$('#improvementLbl').css('display','');
											}
											
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
	
	
	// Change Residual Matrix
	 function changeResidualMatrix () {
	
		//alert("Second Function called");
		
			var riskId = $("#raStmtId").val();
		// Make Unique Id for Control Assessment 
		var controlAssessment = $(".controlAssessmentDrop").find(":selected").text().trim().toUpperCase();
		var inherentRiskAssessment = $("#inherentRiskRatingId").text().toUpperCase();
		
	if(typeof controlAssessment !== "undefined")
		{
			 if(controlAssessment !=''){
							// Code Block Start
							var pageValJson = "{\"inherentRiskAssessment\":" + "\"" + inherentRiskAssessment
								+ "\",\"cntrlEffectiveness\":\"" + controlAssessment + "\"}";
								console.log(pageValJson);
								document.getElementById('load').style.visibility = "visible";
					
				$('#justificationDiv').css('display','none');
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
											
											$('#assessmentRiskId').text(riskId);
											$('#assessmentLikelihood').text($('#likelihood').find(":selected").text().trim());
											$('#assessmentImpact').text($('#impactRating').find(":selected").text().trim());
											$('#assessmentInherentRisk').text($("#inherentRiskRatingId").text());
											var bColor = $('#inherentRiskRatingId').css("background-color");
											$('#assessmentInherentRisk').css("background-color", bColor);
											//assessmentCntrlEffectiveness
											$('#assessmentCntrlEffectiveness').text($('.controlAssessmentDrop').find(":selected").text());
											
											$('#assessmentResidual').text(obj.residualAssDto.residualResult);
											$('#assessmentResidual').css("background-color", obj.residualAssDto.residualAssessmentValueCol);
											
											$('#assessmentDate').text(moment().format('DD-MMM-YYYY'));
											$('#capturedBy').text($('#userName').val());
								
											
											$('#ResidualhiddenMatrix').css('display','');
											//$('#ResidualhiddenMatrixold').css('display','none');
											
											$('#justificationDiv').css('display','');
										 	$("#justification").val('');
										 	$("#compensating").val('');
										 	$("#improvementAreas").val('');
										
											$('#justification').prop('required',true);
											$('#compensating').prop('required',true);
											$('#improvementAreas').prop('required',true);
											
											
											if($("#assessmentResidual").text().toUpperCase() == "LOW"){
												$('#improvementAreas').css('display','none');
												$('#improvementAreas').val('NA');
												$('#improvementLbl').css('display','none');
											}
											else{
												$('#improvementAreas').css('display','');
												$('#improvementAreas').val('');
												$('#improvementLbl').css('display','');
											}
											
											
										},
										error : function(xhr, status, error) {
											console.log(xhr);
											toastr
													.error('Some Error Occured');
										}
									});
			}
		}
	
	};		