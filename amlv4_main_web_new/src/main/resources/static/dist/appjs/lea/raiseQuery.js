/**
 * 
 */
 document.onreadystatechange = function() {
			var state = document.readyState
			if (state == 'interactive') {
				//document.getElementById('contents').style.visibility="hidden";
			} else if (state == 'complete') {
				setTimeout(
						function() {
							//document.getElementById('interactive');
							document.getElementById('load').style.visibility = "hidden";
							//document.getElementById('contents').style.visibility="visible";
						}, 1000);
			}
		}
		
			$(function() {
			//Initialize Select2 Elements
			$('.select2').select2();
			bsCustomFileInput.init();
		})
		$(function() {
			//Initialize Select2 Elements

			//Date range picker
			$('#noticeReceivedDate').datetimepicker({
				format : 'DD-MM-YYYY'
			//format : 'YYYY-MM-DD'
			});
			$('#tatMentionedInQuery').datetimepicker({
				format : 'DD-MM-YYYY'
			//format : 'YYYY-MM-DD'
			});
			$('#tatAssignByRequestor').datetimepicker({
				format : 'DD-MM-YYYY'
			//format : 'YYYY-MM-DD'
			});
		})
		$(function() {

			$('#frmRaiseQuery')
					.validate(
							{
								rules : {
									selectionOfEnricher : {
										required : true
									},

									sourceOfQuery : {
										required : true
									},

									subjectLine : {
										maxlength : 100,
										required : true
									},

									locationOfLea : {
										maxlength : 100,
										required : true
									},

									infoNeededOpt : {
										maxlength : 250,
										required : true
									},

									infoNeededInput : {
										required : true
									},

									noticeReceivedDate : {
										required : true
									},

									tatMentionedInQuery : {
										required : true
									},
									raCaptureValueFrequency : {
										required : true
									},

									tatAssignByRequestor : {
										required : true
									},
								},
								messages : {
									selectionOfEnricher : {
										required : "please select Enricher",
									},

									sourceOfQuery : {
										required : "please select source of query",
									},

									subjectLine : {
										required : "Please provide the Subject Line",
										maxlength : "Please enter no more than {0} characters.",
									},

									locationOfLea : {
										required : "Please provide Location Of LEA",
										maxlength : "Please enter no more than {0} characters.",
									},

									infoNeededOpt : {
										required : "Please select needed information parameter",

									},

									infoNeededInput : {
										required : "Please provide needed information",
										maxlength : "Please enter no more than {0} characters.",
									},

									noticeReceivedDate : {
										required : "Please Select Notice Received Date",
									},

									tatMentionedInQuery : {
										required : "Please Select TAT Mentioned in Query",
									},

									tatAssignByRequestor : {
										required : "Please Select TAT Assigned by Requestor",
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
									form.submit();
								}
							});
		});
			$("#raiseQuery").click(function() {
			if ($('#frmRaiseQuery').valid()) {
				$('#confirmmodal').modal('show');
			}

		});
			$("#create")
				.click(
						function() {

							// var	actionName = $(this).attr("name");

							if ($('#frmRaiseQuery').valid()) {
								document.getElementById('load').style.visibility = "visible";
								//Check table data
								var filedetails = "[\n";
								if ($('#filedetails tr').length > 0) {
									$('#filedetails > tbody  > tr')
											.each(
													function(index, value) {
														var splitvalue = $(this)
																.find(
																		'td:eq(0)')
																.text().split(
																		'.');
														var sizesplit = $(this)
																.find(
																		'td:eq(1)')
																.text().split(
																		' ');
														filedetails = filedetails
																+ "  {  \"fileName\": \""
																+ $(this)
																		.find(
																				'td:eq(0)')
																		.text()
																+ "\",\n"
																+ "    \"fileSize\": \""
																+ sizesplit[0]
																+ "\",\n"
																+

																"    \"fileType\": \""
																+ splitvalue[1]
																+ "\"\n"
																+ " },";

													});
									//filedetails = filedetails.slice(0,-1);
									filedetails = filedetails.substring(0,
											filedetails.length - 1);
								}
								filedetails = filedetails + "]";
								$("#infoNeeded").val(
										$("#infoNeededOpt").val() + '~'
												+ $("#infoNeededInput").val());
								var leaString = "{\n"
										+ "    \"requestorId\": \""
										+ $("#requestorId").val()
										+ "\",\n"
										+ "    \"selectionOfEnricher\": \""
										+ $("#selectionOfEnricher").val()
										+ "\",\n"
										+ "    \"sourceOfQuery\": \""
										+ $("#sourceOfQuery").val()
										+ "\",\n"
										+ "    \"subjectLine\":\""
										+ $("#subjectLine").val().replace(
												/(\r\n|\n|\r)/gm, "")
										+ "\",\n"
										+ "    \"locationOfLea\":\""
										+ $("#locationOfLea").val().replace(
												/(\r\n|\n|\r)/gm, "")
										+ "\",\n"
										+ "    \"infoNeeded\":\""
										+ $("#infoNeeded").val().replace(
												/(\r\n|\n|\r)/gm, "")
										+ "\",\n"
										+ "    \"noticeReceivedDate\":\""
										+ $("#noticeReceivedDate").val()
										+ "\",\n"
										+ "    \"tatMentionedInQuery\":\""
										+ $("#tatMentionedInQuery").val()
										+ "\",\n"
										+ "    \"tatAssignByRequestor\":\""
										+ $("#tatAssignByRequestor").val()
										+ "\",\n"
										+ "    \"bbeRequirement\":\""
										+ $('input[name="bbeRequirement"]:checked').val()
										+ "\",\n"
										+ "    \"actionStatus\":\"CR\",\n"
										+ "    \"recordStatus\":\"R\",\n"
										+ "    \"filedetails\":"
										+ filedetails
										+ "\n" + "}";

								var iterationCount = 1000;
								var keySize = 128;
								//passPhrase is the key
								var passphrase = CryptoJS.lib.WordArray.random(
										128 / 8).toString(CryptoJS.enc.Hex);

								var aesUtil = new AesUtil(keySize,
										iterationCount);

								var ciphertext = aesUtil.encrypt(
										reverseText(passphrase), leaString);
								$("#encryptedJson").val(
										ciphertext + ':~:' + passphrase);

								//alert(leaString);
								$("#frmRaiseQuery").submit();

							}
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
							.append($('<tr id=tr'+i+'><td id=filetd'+i+'>'
									+ filename
									+ '</td><td id=filesizetd'+i+'>'
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
			$(document).ready(function() {
			var message = $('#message').val();
			if (message != "") {
				toastr.success(message);
			}
		});
		$('#cancelmodel').on('show.bs.modal', function (event) {
		  var button = $(event.relatedTarget) 
		  var recipient = button.data('whatever') 
		  var modal = $(this)
		  $('a.target').attr('href', recipient);
		  
		})
	