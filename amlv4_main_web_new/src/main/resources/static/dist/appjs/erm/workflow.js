	// WORKFLOW API 
	$('.createbtn')
			.click(
				function () {
					
					var title = $(this).attr('id');
					var pageValJson = "{\n" + 
					"    \"wfModule\": \""+ $("#modulename").val()+ "\",\n"+ 
					" \"wfAction\":" 
							+ "\"" + title + "\"}";
					
					document.getElementById('load').style.visibility = "visible";

					// ajax call
					$
						.ajax({
							url: 'checkWorkFlowExist',
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
								
								
								if(obj.isExistStatus == 'SUCCESS')
								{
									toastr
									.success('Success');
									$('.createForm').submit();
									
								}
								else
								{
									toastr
									.error(obj.isExistMsg);
								}

								console.log(obj);

							},
							error: function (xhr, status, error) {
								console.log(xhr);
								console.log(status);
								console.log(error);
								toastr
									.success('Some Error Occured');
							}
						});
				});
		