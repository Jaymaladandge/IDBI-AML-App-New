//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
	} else if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
	
	$('option').each(function() {
    t = $(this).text();
    $(this).text(t.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }))
});
}

$(function() {
							var dept = $("#controlDept").val();
							var pageValJson = "{\"dept\":"
									+ "\"" + dept + "\"}";
							document.getElementById('load').style.visibility = "visible";


							// ajax call
							$
									.ajax({
										url : 'fetchOfficeLevel',
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
											var obj = JSON.parse(jsonResponse);
											$(".office-set").empty();
											obj.officeCheckValue
													.forEach(function(items) {
													$(
															//"<div class='form-group text-capitalize'' id='officetypeCheck'>"+
													        "<div  class='form-check'>"+
															"<input  class='form-check-input checkboxOffice' name='checkboxOffice' type='checkbox' "+
															" id=check-"+
															items.officeCode +
															" checked >"+
                          								    "<label class='form-check-label' for=check-"+
															items.officeCode +
															" >"+
															items.officeValue+
															"</label>"+
                          									"</div>")
																.appendTo(
																		".office-set");

													});


											
															
											$(".office-desc").empty();
												obj.officeDescValue
													.forEach(function(items) {
														
													$(	
													"<div  class='row text-capitalize'>"+
													"<div class='col-sm-12'>"+
													"<div class='form-group'>"+
													"<label for='controlDescCO' id=temp-"+
													items.officeCode+
													"> "+
													 items.officeValue+
													" <code>*</code> </label>"+
													"<textarea class='form-control form-control-sm officeDesc' "+
													" name='"+
													items.officeCode +  
													"' id='"+
													items.officeCode+
													"' maxlength='3000' placeholder='Control Description' placeholder='Control Description'>"+
													"</textarea> </div></div></div>"
													)
																.appendTo(
																		".office-desc");
																		
													$("input[name=checkboxOffice]:checked").each(function() {
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
															}
															else {
																$('#' + descId).prop('required',false);
																$('#' + descId).attr('disabled', true);
																$('#' + descId).css('display', 'none');
																$('#temp-' + descId).css('display', 'none');
																$('#'+descId).val("NA");
																//$('#'+descId).removeAttr('required');
																
															}
										            });			   
														
											});

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
		
	}
	
	   });    

$(function() {

	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
})

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget);
	var recipient = button.data('whatever');
	var modal = $(this);
	$('a.target').attr('href', recipient);

})

//checkbox change action to enable disable office description based on check box selection

//$(".checkboxOffice").change(function() {


//File upload code
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

//Validation
$(function() {
	$('#frmcontrollibrary').validate({
		rules: {
			controlDept: {
				required: true
			},


			controlFunction: {
				maxlength: 100,
				required: true
			},

			controlName: {
				maxlength: 100,
				required: true
			},

			controlAssessmentFreq: {
				required: true
			},
			controlOwner : {
				required: true
			},
			controlGaps : {
				required: true
			},
			
			
		},
		messages: {
			controlDept: {
				required: "Please Select a Department",
			},


			controlFunction: {
				required: "Please Provide The Function",
				maxlength: "Please Enter No More Than {0} Characters.",
			},

			controlName: {
				required: "Please provide the Control Name",
				maxlength: "Please Enter No More Than {0} Characters.",
			},

			controlAssessmentFreq: {
				required: "Please Select Assessment Frequency",
			},
			controlOwner : {
				required: "Please Provide Control Owner",
			},
			controlGaps : {
				required: "Please Provide Control Gaps",
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

//if form valid true, show confirmation pop up
$("#createControl").click(function() {
	
		if ($('#frmcontrollibrary').valid()) {
			
			if($("input[name='checkboxOffice']:checked").length == 0)
			{
				toastr.error('Please select at least One Office for Control');
			}
			else{
				$('#confirmmodal').modal('show');
			}
		}

});

//Submit form
$("#create").click(function(){
	
 var actionName = $(this).attr("name");

if ($('#frmcontrollibrary').valid()) {
	
	if($(":checkbox:checked").length > 0){
		
	//Get Value
	var officeDescValue = "[\n";
	$('.officeDesc').each(
		
		
    function(index){  
        var input = $(this);
		
		$('.checkboxOffice').each(function(checkBoxIndex){ 
			
		});

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
	//Check table data
	var filedetails = "[\n";
	if($('#filedetails tr').length > 0){
	$( '#filedetails > tbody  > tr').each(function( index, value ) {
		var splitvalue = $(this).find('td:eq(0)').text().split('.');
		var sizesplit=$(this).find('td:eq(1)').text().split(' ');
		filedetails=filedetails +
		"  {  \"fileName\": \""+ $(this).find('td:eq(0)').text()+ "\",\n"+ 
		"    \"fileSize\": \""+ sizesplit[0]+ "\",\n"+ 
		
		"    \"fileType\": \""+ splitvalue[1]+ "\"\n"+
		" },";
		

	});
	//filedetails = filedetails.slice(0,-1);
	filedetails = filedetails.substring(0,filedetails.length - 1);
	}
		filedetails = filedetails +
				"]";
				
	var interDepartment;
	if($("#interDepartment").val() =="" || $("#interDepartment").val() == null){
		interDepartment = "Not Available";
	}else{
		interDepartment = $("#interDepartment").val();
	}
				
	var controlString = "{\n" + 
					"    \"controlId\": \""+ $("#controlId").val().replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+ 
					"    \"controlDept\": \""+ $("#controlDept").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
					"    \"controlFunction\": \""+ $("#controlFunction").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
					"    \"controlName\":\""+ $("#controlName").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
					"    \"controlAssessmentFreq\":\""+ $("#controlAssessmentFreq").val().replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+ 
					"    \"controlActionStatus\":\"NA\",\n" + 
					"    \"controlOwner\":\""+ $("#controlDept").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
					"    \"controlGaps\":\""+ $("#controlGaps").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
					"    \"indeparmentDependencies\":\""+ $("#controlDept").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
					"    \"controlStatus\":\"CR\",\n" + 
					"    \"actionName\":\""+actionName.replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+ 
					"    \"officeDescValue\":"+officeDescValue+ ",\n"+   
					"    \"filedetails\":"+ filedetails+"\n"+ 
					"}";
		
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);

		var aesUtil = new AesUtil(keySize, iterationCount);
		
		var ciphertext = aesUtil.encrypt(reverseText(passphrase), controlString);
		$("#encryptedJson").val(ciphertext+':~:'+passphrase);
		
		console.log("Control String "+ controlString);
		$("#frmcontrollibrary").submit();
		}
		
	else
	{
		$('#confirmmodal').modal('hide');
		toastr.error('Please Select Atleast One Office Type');
	}
			
		}
	});
	
	// Department list 
		$('#controlDept')
				.change(
						function() {
							var dept = $(this).val();
							var pageValJson = "{\"dept\":"
									+ "\"" + dept + "\"}";
							document.getElementById('load').style.visibility = "visible";


							// ajax call
							$
									.ajax({
										url : 'fetchOfficeLevel',
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
											var obj = JSON.parse(jsonResponse);
											$(".office-set").empty();
											obj.officeCheckValue
													.forEach(function(items) {
													$(
															//"<div class='form-group text-capitalize'' id='officetypeCheck'>"+
													        "<div  class='form-check'>"+
															"<input  class='form-check-input checkboxOffice' name='checkboxOffice' type='checkbox' "+
															" id=check-"+
															items.officeCode +
															" checked >"+
                          								    "<label class='form-check-label' for=check-"+
															items.officeCode +
															" >"+
															items.officeValue+
															"</label>"+
                          									"</div>")
																.appendTo(
																		".office-set");

													});


											
															
											$(".office-desc").empty();
												obj.officeDescValue
													.forEach(function(items) {
														
													$(	
													"<div  class='row text-capitalize'>"+
													"<div class='col-sm-12'>"+
													"<div class='form-group'>"+
													"<label for='controlDescCO' id=temp-"+
													items.officeCode+
													"> "+
													 items.officeValue+
													" <code>*</code> </label>"+
													"<textarea class='form-control form-control-sm officeDesc' "+
													" name='"+
													items.officeCode +  
													"' id='"+
													items.officeCode+
													"' maxlength='3000' placeholder='Control Description' placeholder='Control Description'>"+
													"</textarea> </div></div></div>"
													)
																.appendTo(
																		".office-desc");
																		
													$("input[name=checkboxOffice]:checked").each(function() {
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
															}
															else {
																$('#' + descId).prop('required',false);
																$('#' + descId).attr('disabled', true);
																$('#' + descId).css('display', 'none');
																$('#temp-' + descId).css('display', 'none');
																$('#'+descId).val("NA");
																//$('#'+descId).removeAttr('required');
																
															}
										            });			   
														
											});

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
