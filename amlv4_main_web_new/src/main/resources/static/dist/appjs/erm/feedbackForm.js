	$(function() {
			$("#feedbacktable").DataTable({
				"columnDefs" : [ {
					orderable : false,
					targets : [7]
				} ],
				"order" : [ 0, "desc" ],
				"responsive" : false,
				"lengthMenu" : [ 10,25, 50, 75, 100 ],
				"autoWidth" : true,
				"searching" : true,
				"fixedHeader" : true,
				 "buttons": ["csv", "excel", "pdf", "print"],
				"language" : {
					"emptyTable" : "No Data Available"
				}
			}).buttons().container().appendTo(
					'#feedbacktable_wrapper .col-md-6:eq(0)');
		});
		
		//loader
		document.onreadystatechange = function() {
			var state = document.readyState
			if (state == 'interactive') {
			} else if (state == 'complete') {
				setTimeout(
						function() {
							document.getElementById('interactive');
							document.getElementById('load').style.visibility = "hidden";
						}, 1000);
			}
		}
		$(function() {
			//Initialize Select2 Elements
			$('.select2').select2();

			bsCustomFileInput.init();
		})
		
		
		
$('a.viewAuditTrail')
				.click(
						function() {
							var feedbackId = $(this).attr('id');
							var pageValJson = "{\"activityImpactTblKey\":"
									+ "\"" + feedbackId + "\"}";
									
							document.getElementById('load').style.visibility = "visible";

							$("#auditLabelId").text(feedbackId);

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
														
													}, 1000);

											var jsonResponse = JSON
													.stringify(response);
											var obj = JSON.parse(jsonResponse);
											$(".timeline-inverse").empty();
											obj.forEach(function(items) {
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
										error : function(xhr, status, error) {
											console.log(xhr);
											console.log(status);
											console.log(error);
											toastr
													.success('Some Error Occured');
										}
									});
						});
	$(document).ready(function() {
			var message = $('#message').val();
			if (message != "") {
				toastr.success(message);
			}

			$("a .fa-tools").click(function() {
				$('#actionplanlink').css('class', 'border');
				$('#actionplanlink').css('display', '');
				$('#actionplanlink').click();
			});

			$("a .fa-twitch").click(function() {
				$('#timelinelink').css('class', 'border');
				$('#timelinelink').css('display', '');
				$('#timelinelink').click();
			});

			$("#summarylink").click(function() {
				$('#actionplanlink').css('display', 'none');
				$('#timelinelink').css('display', 'none');
			});

			$("#actionplanlink").click(function() {
				$('#timelinelink').css('display', 'none');
			});

			//download


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
				if (searchParam == 'recordStatus') {
					
						searchValue = searchValue.charAt(0);
					
				}
				
				var sortValue = $('#sorting').find(":selected").val();
				var pageValJson = "{\"searchParam\":" + "\"" + searchParam
						+ "\",\"searchValue\":\"" + searchValue.replace(/(\r\n|\n|\r)/gm, "")+ "\"}";
						
												
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