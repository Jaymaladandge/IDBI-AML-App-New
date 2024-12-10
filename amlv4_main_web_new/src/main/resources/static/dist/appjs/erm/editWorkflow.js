//loader
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
	
	$(function() {
		//Initialize Select2 Elements
		$('.select2').select2();
	})
	


	//Validation
	$(function() {
		$('#frmWorkflow').validate({
			rules: {
				workflowmodule: {
					required: true
				},


				WorkflowName: {
					maxlength: 200,
					required: true
				},

				SourceRoleId: {
					required: true
				},

				workflowDept: {
					required: true
				},
				Officetype : {
					required: true
				},
				DestRoleId : {
					required: true
				},
				
				
			},
			messages: {
				workflowmodule: {
					required: "Please Select a Workflow module",
				},


				WorkflowName: {
					required: "Please Fill the Workflow Description",
					maxlength: "Please Enter No More Than {200} Characters.",
				},

				SourceRoleId: {
					required: "Please Select a Source Role",
					
				},

				workflowDept: {
					required: "Please Select the Department",
				},
				Officetype : {
					required: "Please Select the Office Type",
				},
				DestRoleId : {
					required: "Please Select a Destination Role",
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

	$('#cancelmodel').on('show.bs.modal', function(event) {
		var button = $(event.relatedTarget);
		var recipient = button.data('whatever');
		var modal = $(this);
		$('a.target').attr('href', recipient);

	});


	$("#submitworkflow") 
			.click(
					function() {
						
						
						var WorkflowTable;
						
						WorkflowTable = "[\n";
						if ($('#WorkflowTable tr').length > 0) {
						$( '#WorkflowTable > tbody  > tr').each(function( index, value ) {
							
							WorkflowTable =WorkflowTable + 
							"  {  \"wfActionSource\": \""+ $(this).find('td:eq(0) select').val()+ "\",\n"+ 
							"    \"wfCurrentAction\": \""+ $(this).find('td:eq(1) select').val()+ "\",\n"+
							"    \"wfTitle\": \""+ $(this).find('td:eq(1) option:selected').text()+ "\",\n"+
							"    \"wfDeptName\": \""+ $(this).find('td:eq(2) select').val()+ "\",\n"+
							"    \"wfOfficeType\": \""+ $(this).find('td:eq(3) select').val()+ "\",\n"+
							"    \"wfOfcDest\": \""+ $(this).find('td:eq(4) select').val()+ "\",\n"+
							"    \"wfActionDest\": \""+ $(this).find('td:eq(5) select').val()+ "\",\n"+
							"    \"wfActionId\": \""+ $(this).find('td:eq(6) label').text()+ "\"\n"+
							" },";
							
						});
						WorkflowTable = WorkflowTable.substring(0, WorkflowTable.length - 1);

					}
						WorkflowTable += "]";
						
						console.log("Action String "+ WorkflowTable);
						
						
					var WorkflowEditString = "{\n" + 
							"    \"wfGroupId\": \""+ $("#wfGroupId").val().replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+ 
							"    \"wfStatus\": \"A\",\n"+ 
							"    \"wfModule\": \""+ $("#workflowmodule").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
							"    \"wfDescription\": \""+ $("textarea#WorkflowName").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
							"    \"actionList\":" + WorkflowTable + "\n" +
							"}";
							
							
				
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
		
				var aesUtil = new AesUtil(keySize, iterationCount);
				
				var ciphertext = aesUtil.encrypt(reverseText(passphrase), WorkflowEditString);
				$("#encryptedJson").val(ciphertext+':~:'+passphrase);
				
				console.log("Workflow String "+ WorkflowEditString);
				$("#frmWorkflow").submit();
				
											
				
	});

	/*$(document).ready(function(){  
  $("select").change(function() {   
    $("select").not(this).find("option[value="+ $(this).val() + "]").attr('disabled', true);
  }); 
}); */					

	
	$("#create").click(function() {
	var wfActiondest;

	if ($('#frmWorkflow').valid()) {
	i = 0;
	$( '#WorkflowTable > tbody  > tr').each(function( index, value ) {
	
	var wfActionSource = $(this).find('td:eq(0) select').val();
	wfActiondest = $(this).find('td:eq(5) select').val();

	var wfActionSource2=(typeof $(this).prev().find('td:eq(5) select').val() != "undefined") ? $(this).prev().find('td:eq(5) select').val() :0;
	if(wfActionSource != wfActiondest )
		{
		if(wfActionSource2 != 0){
		
		if(wfActionSource == wfActionSource2)
		{
		
		}
		else
		{
		i++;
		
		toastr.error('Please select Same SourceRole As Previous DestinationRole');
		}
		}
		
		}
		else
		{
		i++;
		toastr.error('Please Select Unique Source And Destination Role');
		}
	
	
	});
	if (i == 0){
		$('#confirmmodal').modal('show');	
			}
	}
	});
		