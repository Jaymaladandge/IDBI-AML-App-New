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
	
   


	var rowIdx = 0;
	var count = 0;
	var modCount = 0;
	
	
	$('#additem')
			.click(
				function () {
				
					
					var pageValJson = "{\n" + 
					"    \"wfModule\": \""+ $("#workflowmodule").val()+ "\",\n"+ 
					" \"wfActionSource\":" 
							+ "\"" + $("#SourceRoleId").val() + "\",\n"+ 
					" \"wfOfficeType\":" 
							+ "\"" + $("#OfficeSource").val() + "\",\n"+ 
					" \"wfCurrentAction\":" 
							+ "\"" + $("#ActionName").val() + "\"}";
							
							
					
					console.log(pageValJson)
					document.getElementById('load').style.visibility = "visible";

					// ajax call
					$
						.ajax({
							url: 'verifyWorkflowExist',
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
								
								console.log(obj);
								if(obj.wfExist == 'SUCCESS')
								{
									toastr
									.success('Workflow Exist');
									$('#create').attr("disabled", true);
								}
								else
								{
								$('#create').attr("disabled", false);
									count = count + 1;
									modCount = modCount + 1;
									
									// Adding a row inside the tbody.
									
									$('#divadd').append(`
									<div class="row boxadder" id="R${++rowIdx}" >
									
										<div class="col-sm-3 row-index" id="Row ${rowIdx}">
										<div class="form-group">
										<label for="ModuleName">Source Role <code>*</code></label>
											<select
											class="select2 text-capitalize SourceId"
											name="SourceId" data-placeholder="Select Role"
											id=Role_${count} style="width: 100%;">
											<option value="">NA</option></select>
										</div>
										</div>
										
										<div class="col-sm-3 row-index" id="Row ${rowIdx}">
										<div class="form-group">
										<label for="ActionName">Action Source<code>*</code></label>
											<select
											class="select2 text-capitalize Action"
											name="ActionName" data-placeholder="Select Action Source"
											id=Action_${count} style="width: 100%;">
											<option value="">NA</option></select>
										</div>
										</div>
										
										<div class="col-sm-3 row-index" id="Row ${rowIdx}">
										<div class="form-group">
										<label for="workflowDept">Department <code>*</code></label>
											<select
											class="select2 text-capitalize department"
											name="Department" 
											id=Dept_${count} style="width: 100%;">
											</select>
										</div>
										</div>
										
										
										<div class="col-sm-2 row-index" id="Row ${rowIdx}">
										<div class="form-group">
										<label for="OfficeSource">Office Source <code>*</code></label>
											<select
											class="select2 text-capitalize office"
											name="office" data-placeholder="Office Source"
											id=Office_${count} style="width: 100%;">
											<option  value="">NA</option></select>
										</div>
										</div>
										
										<div class="col-sm-3 row-index" id="Row ${rowIdx}">
										<div class="form-group">
										<label for="DestActionName">Action Destination<code>*</code></label>
											<select
											class="select2 text-capitalize Action2"
											name="DestActionName" data-placeholder="Select Destination Action"
											id=DestAction_${count} style="width: 100%;">
											<option value="">NA</option></select>
										</div>
										</div>
										
										<div class="col-sm-3 row-index" id="Row ${rowIdx}">
										<div class="form-group">
										<label for="Officedest">Office Destination<code>*</code></label>
											<select
											class="select2 text-capitalize officedest"
											name="office" data-placeholder="Office Destination"
											id=Officedest_${count} style="width: 100%;">
											<option  value="">NA</option></select>
										</div>
										</div>
										
										<div class="col-sm-3 row-index"  id="Row ${rowIdx}">
										<div class="form-group">
										<label for="DestRoleId">Destination Role <code>*</code></label>
										<select
											class="select2 text-capitalize destId"
											name="DestRoleId"
											id=DestinationRole_${count} style="width: 100%;">
											</select>
										</div>
										</div>
										
										<div class="col-sm-1 row-index" >
										<label for="Officedest" style="color: white">Remove</label>
										<a class="btn btn-danger btn-sm remove" id="deleteRow_${count}"> 
										<i class='fas fa-window-close'></i></a>
										</div>
										
										
									</div>
									
									
									`);
									
									
									$(".SourceId").append($('#SourceRoleId').html());
									$(".destId").append($('#DestRoleId').html());
									$(".office").append($('#OfficeSource').html());
									$(".officedest").append($('#Officedest').html());
									$(".department").append($('#workflowDept').html());
									$(".Action").append($('#ActionName').html());
									$(".Action2").append($('#DestActionName').html());
									$('.select2').select2();
									
									
									
									$(document).ready(function () {
										$('select option').filter(function(){
												return ($(this).val().trim()=="" && $(this).text().trim()=="");
											}).remove();
										});
								
										
								}

							},
							error: function (xhr, status, error) {
								console.log(xhr);
								console.log(status);
								console.log(error);
								toastr
									.error('Some Error Occured');
							}
						});
						
						
				});
				
	
	// jQuery button click event to remove a row.
	$('#divadd').on('click','.remove', function () {
	


		// Getting all the rows next to the row
		// containing the clicked button
		var child = $(this).closest('div').nextAll();

		// Iterating across all the rows
		// obtained to change the index
		child.each(function () {

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
		$(this).closest('.row').remove();
		
		// Decreasing total number of rows by 1.
		rowIdx--;
		
		
		
	});
	
	


	//Validation
	$(function() {
		$('#frmWorkflow').validate({
		
		
			rules: {
				workflowmodule: {
					required: true
				},
				
				SourceId: {
					required: true
				},
				
				ActionName2: {
					required: true
				},
				
				ActionName: {
					required: true
				},
				
				department: {
					required: true
				},
				
				office: {
					required: true
				},
				
				destId: {
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
				

				SourceId: {
					required: "Please Select a Source Role",
					
				},
				
				ActionName2: {
					required: "Please Select Action",
					
				},
				
				ActionName: {
					required: "Please Select Action",
					
				},

				workflowDept: {
					required: "Please Select the Department",
				},
				
				department: {
					required: "Please Select the Department",
				},
				
				Officetype : {
					required: "Please Select the Office Type",
				},
				
				office : {
					required: "Please Select the Office Type",
				},
				
				DestRoleId : {
					required: "Please Select a Destination Role",
				},
				
				destId : {
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
					
						
						var divadd;
							divadd = "[\n";
						if ($('#divadd div').length > 1) {
						$( '#divadd  > div').each(function( index, value ) {
							
							divadd =divadd + 
							"  {  \"wfActionSource\": \""+ $(this).find('div:eq(0) select').val()+ "\",\n"+ 
							"    \"wfPreviousAction\": \""+ $(this).find('div:eq(2) select').val()+ "\",\n"+
							"    \"wfDeptName\": \""+ $(this).find('div:eq(4) select').val()+ "\",\n"+
							"    \"wfOfficeType\": \""+ $(this).find('div:eq(6) select').val()+ "\",\n"+
							"    \"wfCurrentAction\": \""+ $(this).find('div:eq(8) select').val()+ "\",\n"+
							"    \"wfOfcDest\": \""+ $(this).find('div:eq(10) select').val()+ "\",\n"+
							"    \"wfTitle\": \""+ $(this).find('div:eq(8) option:selected').text()+ "\",\n"+
							"    \"wfActionDest\": \""+ $(this).find('div:eq(12) select').val()+ "\"\n"+
							" },";
							
							
						});
						divadd = divadd.substring(0, divadd.length - 1);

					}
						divadd += "]";
						
						console.log("Action String "+ divadd);
						
					var WorkflowString = "{\n" + 
							"    \"wfGroupId\": \""+ $("#wfGroupId").val().replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+ 
							"    \"wfStatus\": \"A\",\n"+ 
							"    \"wfModule\": \""+ $("#workflowmodule").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
							"    \"wfTitle\": \""+ $("#DestActionName option:selected").text().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
							"    \"wfDeptName\": \""+ $("#workflowDept").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
							"    \"wfDescription\": \""+ $("textarea#WorkflowName").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
							"    \"wfOfficeType\":\""+ $("#OfficeSource").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n"+ 
							"    \"wfActionSource\":\""+ $("#SourceRoleId").val().replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+ 
							"    \"wfCurrentAction\":\""+ $("#DestActionName").val().replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+ 
							"    \"wfActionDest\": \""+ $("#DestRoleId").val().replace(/(\r\n|\n|\r)/gm, "")+"\",\n"+
							"    \"wfPreviousAction\": \""+ $("#ActionName").val().replace(/(\r\n|\n|\r)/gm, "")+"\",\n"+
							"    \"actionList\":" + divadd + "\n" +
							"}";
							
							
				
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
		
				var aesUtil = new AesUtil(keySize, iterationCount);
				
				var ciphertext = aesUtil.encrypt(reverseText(passphrase), WorkflowString);
				$("#encryptedJson").val(ciphertext+':~:'+passphrase);
				
				console.log("Workflow String "+ WorkflowString);
				$("#frmWorkflow").submit();
				
								
				
	});

	$("#create").click(function() {
	
	if ($('#frmWorkflow').valid()) {
	
	var SourceID = $("#SourceRoleId").val();
	var DestID = $("#DestRoleId").val();
	var CurrentAction = $("#DestActionName").val();
	var PreviousAction = $("#ActionName").val();
	var SourceID1;
	var SourceID2;

	i = 0;
	if(SourceID != DestID ){
	
	if(CurrentAction != PreviousAction){
	
	}else
	{
	
		i++;
		toastr.error('Please Select Unique Source And Destination Action');
	}
	
	
	}else
	{
		i++;
		toastr.error('Please Select Unique Source And Destination Role');
	}
	
	
	$('#divadd > div').each(function( index, value ) {
	
		
		SourceID1 = $(this).find('div:eq(0) select').val();
		PreviousAction = $(this).find('div:eq(2) select').val();
		CurrentAction = $(this).find('div:eq(8) select').val();
		SourceID2 = $(this).find('div:eq(12) select').val();
		var prevSource=(typeof $(this).prev().find('div:eq(12) select').val() != "undefined") ? $(this).prev().find('div:eq(12) select').val() : DestID;
		
		if(SourceID1 != SourceID2)
		{
				/*if(PreviousAction != CurrentAction)
				{*/
		
								if(prevSource.length > 0)
								{
		
									if(SourceID1 == prevSource)
									{
									
									}
									else
									{
									i++;
									toastr.error('Please select Same SourceRole As Previous DestinationRole');
									}
								}
		
				/*}else
				{
				
				i++;
				toastr.error('Please Select Unique Source And Destination Action');
				}*/
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
 
        