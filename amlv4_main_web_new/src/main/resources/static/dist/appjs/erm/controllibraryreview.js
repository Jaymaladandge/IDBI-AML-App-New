		$(function() {
			//Initialize Select2 Elements
			$('.select2').select2();

			bsCustomFileInput.init();
		})

$(document).ready(function() {
			 $(document).on('click', '.downloadfile', function(){
			
			 var fileName = $(this).attr('name');
							var pageValJson = "{\"fileName\":"
									+ "\"" + fileName + "\"}";
							//document.getElementById('load').style.visibility = "visible";

							// ajax call
							$
									.ajax({
										url : 'download',
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
										
							
												var blob = new Blob([response], { type: "application/octetstream" });
 
                    //Check the Browser type and download the File.
                    var isIE = false || !!document.documentMode;
                    if (isIE) {
                        window.navigator.msSaveBlob(blob, fileName);
                    } else {
                        var url = window.URL || window.webkitURL;
                        link = url.createObjectURL(blob);
                        var a = $("<a />");
                        a.attr("download", fileName);
                        a.attr("href", link);
                        $("body").append(a);
                        a[0].click();
                        $("body").remove(a);
                    }

										},
										error : function(xhr, status, error) {
											toastr
													.success('Some Error Occured');
										}
									});
    			});

		});
		$(function() {
			$("#capturetbl").DataTable({
				"responsive" : false,
				"autoWidth" : false,
				"searching" : false,
				"fixedHeader" : true
			}).buttons().container().appendTo(
					'#actionplantable_wrapper .col-md-12:eq(0)');
		});

		$(function() {
			$("#actionplantable").DataTable({
				"responsive" : true,
				"autoWidth" : true,
				"searching" : false,
				"fixedHeader" : true
			}).buttons().container().appendTo(
					'#actionplantable_wrapper .col-md-12:eq(0)');
		});

		var approveBtn = false;
		//APPROVE ACTION	
		$("#approve")
				.click(
						function() {
							approveBtn = true;
							var	actionName = $(this).attr("name");
							document.getElementById('interactive');
							document.getElementById('load').style.visibility = "visible";

							var controlId = $("#controlId").val();
							var controlActionStatusOld = $("#controlActionStatus").val();
							var controlActionStatus = "";
							if ($("#recordstatus").val() == 'Pending Verification For Creation') {
								controlActionStatus = 'VR';
							} else if ($("#recordstatus").val() == 'Pending Approval For Creation') {
								controlActionStatus = 'AR';
							} else if ($("#recordstatus").val() == 'Pending Verification For Edit') {
								controlActionStatus = 'EV';
							} else if ($("#recordstatus").val() == 'Pending Approval For Edit') {
								controlActionStatus = 'EA';
							} else if ($("#recordstatus").val() == 'Pending Approval For Value Captured') {
								controlActionStatus = 'AR';
							}
							 else if ($("#recordstatus").val() == 'Pending Verification For Closure') {
								controlActionStatus = 'XQ';
							}

							var actionString = "{\n" + "    \"controlId\": \""
									+ $("#controlId").val() + "\",\n"
									+ "    \"sourceName\": \""
									+ $("#sourceName").val() + "\",\n"
									+ "    \"controlActionStatusOld\": \""
									+ controlActionStatusOld + "\",\n"
									+"    \"actionName\":\""+actionName+ "\",\n"
									+ "    \"controlActionStatus\":\""
									+ controlActionStatus + "\"\n" + "}";
							var iterationCount = 1000;
							var keySize = 128;
							//passPhrase is the key
							var passphrase = CryptoJS.lib.WordArray.random(
									128 / 8).toString(CryptoJS.enc.Hex);

							var aesUtil = new AesUtil(keySize, iterationCount);
							var ciphertext = aesUtil.encrypt(
									reverseText(passphrase), actionString);
							$("#encryptedJson").val(
									ciphertext + ':~:' + passphrase);

							console.log(actionString);
						   $('#frmcontrollib').submit();
						});

		$("#reject")
				.click(
						function() {
							if ($('#frmcontrollib').valid()) {
							approveBtn = true;
							var	actionName = $(this).attr("name");
							document.getElementById('interactive');
							document.getElementById('load').style.visibility = "visible";

							var controlId = $("#controlId").val();
							var controlActionStatusOld = "";
							var controlActionStatus = "";
							var reasonCheck = $('#reason').val();
							if (reasonCheck == '') {
								$('span[id^="reason-error"]').remove();
								$('#reason').addClass('is-invalid');
								$('#reason')
										.after(
												'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
							} else if (reasonCheck.length < 10) {
								$('span[id^="reason-error"]').remove();
								$('#reason').addClass('is-invalid');
								$('#reason')
										.after(
												'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
							} else {
								var reason = $('#reason').val().replace(/(\r\n|\n|\r)/gm, "");

								if ($("#recordstatus").val() == 'Pending Verification For Creation') {
									controlActionStatusOld = $("#controlActionStatus")
											.val();
									controlActionStatus = 'ZR';
								} else if ($("#recordstatus").val() == 'Pending Approval For Creation') {
									controlActionStatusOld = $("#controlActionStatus")
											.val();
									controlActionStatus = 'ZR';
								} else if ($("#recordstatus").val() == 'Pending Verification For Edit') {
									controlActionStatus = 'EZ';
									controlActionStatusOld = 'ER';
								} else if ($("#recordstatus").val() == 'Pending Approval For Edit') {
									controlActionStatus = 'EZ';
									controlActionStatusOld = 'EV';
								} else if ($("#recordstatus").val() == 'Pending Approval For Value Captured') {
									controlActionStatus = 'ZR';
								}
								else if ($("#recordstatus").val() == 'Pending Verification For Closure') {
									controlActionStatus = 'XZ';
								}

								var actionString = "{\n" + "  \"controlId\": \""
										+ $("#controlId").val() + "\",\n"
										+ "    \"sourceName\": \""
										+ $("#sourceName").val() + "\",\n"
										+ " \"controlActionStatus\":\""
										+ controlActionStatus + "\",\n"
										+ " \"controlActionStatusOld\": \""
										+ controlActionStatusOld + "\",\n"
										+"    \"actionName\":\""+actionName+ "\",\n"
										+ "\"commentDto\":{\"comment\":\""
										+ reason + "\"}}";

								var iterationCount = 1000;
								var keySize = 128;
								//passPhrase is the key
								var passphrase = CryptoJS.lib.WordArray.random(
										128 / 8).toString(CryptoJS.enc.Hex);

								var aesUtil = new AesUtil(keySize,
										iterationCount);
								var ciphertext = aesUtil.encrypt(
										reverseText(passphrase), actionString);
								$("#encryptedJson").val(
										ciphertext + ':~:' + passphrase);
								$('#frmcontrollib').submit();
							}
							}

						});

		//VALIDATE	

		$(function() {

			$('#frmcontrollib')
					.validate(
							{
								rules : {
									reason : {
										required : true,
										minlength : 10,
										maxlength : 400
									},

								},
								messages : {
									reason : {
										required : "Please Provide Reason For Rejection",
									},
								},

								errorElement : 'span',
								errorPlacement : function(error, element) {
									error.addClass('invalid-feedback');
									element.closest('.form-group')
											.append(error);
								},
								highlight : function(element, errorClass,
										validClass) {
									$(element).addClass('is-invalid');
								},
								unhighlight : function(element, errorClass,
										validClass) {
									$(element).removeClass('is-invalid');
								},

								submitHandler : function(form) {
									if (!approveBtn) {
										toastr
												.success('Risk Appetite Statement Rejected');
										document.getElementById('interactive');
										document.getElementById('load').style.visibility = "visible";
									}
									setTimeout(function() {
										form.submit();
									}, 2000);

								}
							});
		});

		//loader
		document.onreadystatechange = function() {
			var state = document.readyState
			if (state == 'interactive') {
				document.getElementById('contents').style.visibility = "hidden";
			} else if (state == 'complete') {
				setTimeout(
						function() {
							document.getElementById('interactive');
							document.getElementById('load').style.visibility = "hidden";
							document.getElementById('contents').style.visibility = "visible";
						}, 1000);
			}
		}

		$("#today").text(moment(new Date()).format('DD/MM/YYYY'));


var totalsizeOfUploadFiles = 0;
function getFileData(input) {
    var select = $('.uploadTable');
    for (var i = 0; i < input.files.length; i++) {
        var filesizeInBytes = input.files[i].size;
        var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
        var filename = input.files[i].name;
        var flg = true;
        
        var userName = $('#username').val();
        $('.uploadTable tr').each(function() {
            var fName = $(this).find('td:eq(0)').text();
            console.log('fName '+fName+' filename '+filename);
            if (fName == filename) {
                flg = false;
            }
        });
        if (flg) {
            select
                    .append($('<tr id=tr'+i+'><td id=filetd'+i+'>'
                            + filename
                            + '</td><td id=filesizetd'+i+'>'
                            + filesizeInMB
                            + ' kb</td><td>'
                            + moment(new Date()).format('DD/MM/YYYY')
                            + '</td><td class="text-capitalize">'
                            + userName
                            + '</td><td class="text-right py-0 align-middle"> - </td><td class="project-actions text-right"><a class="btn btn-danger btn-sm" id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));
            totalsizeOfUploadFiles += parseFloat(filesizeInMB);
        }
        $('#filedetails').show();
    }
}

$(".uploadTable").on("click", "#closerow", function() {
   
    var rowCount = $('.uploadTable tr').length;
    console.log('row count '+rowCount);
    if (rowCount == 2) {
        $('#filedetails').hide();
    }
    $(this).closest("tr").remove();
});



			$(function() {
				$("#filedetails").DataTable({
					"columnDefs" : [ {
						orderable : false,
						targets : [ 4, 5 ]
					} ],
					"lengthMenu" : [ 5, 10, 25, 50, 75, 100 ],
					"responsive" : false,
					"autoWidth" : true,
					"searching" : false,
					"fixedHeader" : true,
					 "language": {
					      "emptyTable": "No Data Available"
					    }
				}).buttons().container().appendTo(
						'#filedetails_wrapper .col-md-12:eq(0)');
			});
//download
$(document).ready(function() {
			 $(document).on('click', '.downloadfile', function(){
			
			 var fileName = $(this).attr('name');
							var pageValJson = "{\"fileName\":"
									+ "\"" + fileName + "\"}";
							//document.getElementById('load').style.visibility = "visible";

							// ajax call
							$
									.ajax({
										url : 'download',
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
										
							
												var blob = new Blob([response], { type: "application/octetstream" });
 
                    //Check the Browser type and download the File.
                    var isIE = false || !!document.documentMode;
                    if (isIE) {
                        window.navigator.msSaveBlob(blob, fileName);
                    } else {
                        var url = window.URL || window.webkitURL;
                        link = url.createObjectURL(blob);
                        var a = $("<a />");
                        a.attr("download", fileName);
                        a.attr("href", link);
                        $("body").append(a);
                        a[0].click();
                        $("body").remove(a);
                    }

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

		});



		// Audit trail   
		$('.viewAuditTrail')
				.click(
						function() {

							var controlId = $("#controlId").val();
							var pageValJson = "{\"activityImpactTblKey\":"
									+ "\"" + controlId + "\"}";

							document.getElementById('load').style.visibility = "visible";
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

											if (obj.length > 0) {
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
											
											}
											$('#timelinemodal').modal('show');
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
	
	$('#cancelmodel').on('show.bs.modal', function (event) {
		  var button = $(event.relatedTarget) 
		  var recipient = button.data('whatever') 
		  var modal = $(this)
		  $('a.target').attr('href', recipient);
		  
		})
