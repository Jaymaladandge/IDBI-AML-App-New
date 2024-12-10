$(function() {
			//Initialize Select2 Elements
			$('.select2').select2();

			bsCustomFileInput.init();

			//Date range picker
			$('#completionDate').datetimepicker({
				format : 'DD-MM-YYYY'
			//format : 'YYYY-MM-DD'
			});
		})
		
	var totalsizeOfUploadFiles = 0;
		function getFileData(input) {
			var select = $('.uploadTable');

			for (var i = 0; i < input.files.length; i++) {
				var filesizeInBytes = input.files[i].size;
				var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
				var filename = input.files[i].name;
				var userName = $("#username1").val();
				var flg = true;
				$('.uploadTable tr').each(function() {
					var fName = $(this).find('td:eq(0)').text();
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
									+ ' kb</td><td class="text-capitalize">'
									+ userName
									+ '</td><td>'
									+ moment(new Date()).format('DD/MM/YYYY')
									+ '</td><td class="project-actions text-right"><a class="btn btn-danger btn-sm"  id="closerow"><i class="fas fa-window-close"></i></a></td></tr>'));

					totalsizeOfUploadFiles += parseFloat(filesizeInMB);
				}

				$('#filedetails').show();

			}

			$(".uploadTable").on("click", "#closerow", function() {

				$(this).closest("tr").remove();

				var rowCount = $('.uploadTable tr').length;

				if (rowCount == 1) {
					$('#filedetails').hide();
				}
			});

		}
document.onreadystatechange = function() {
			var state = document.readyState
			setTimeout(function() {
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
		}
		
	$('#cancelmodel').on('show.bs.modal', function(event) {
			var button = $(event.relatedTarget)
			var recipient = button.data('whatever')
			//var recipient = $('#datasource').val()
			var modal = $(this)
			$('a.target').attr('href', recipient);

		})
		
		 $(function() {
		
		 
		 $("#officeType").change(function () {
			 var userOffice=$("#officeType").val();
			 var pageValJson = "{\"selectedOfficeType\":" + "\""+ userOffice + "\"}";
		
			document.getElementById('load').style.visibility = "visible";
				
				// ajax call
				$
					.ajax({
						url: 'DeptOfficeWiseFilterFeedback',
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
							/*$("<option />", {
									val: "",
									text: "Select Department"
								}).appendTo($("#officeCode"));*/
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
	 
	 }); 
$("#create_btn")
	.click(

			function(e) {
				
				var officeType=$("#officeType").val();
				var deptId=$("#riskDept").val();
				var officeCode=$("#officeCode").val();
				var feedbackSubject=$("#feedbackSubject").val();
				var feedbackDescription=$("#feedbackDescription").val();
			if ($('#feedbackForm').valid()) {
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

					var apString = "{\"feedbackId\":\""
							+ $("#feedbackId").val()
							+ "\",\n" + "\"selectedOfficeType\":\""
							+ officeType + "\",\n"
							+ "\"deptId\":\""
							+ deptId + "\",\n"
							+ "\"officeCode\":\""
							+ officeCode + "\",\n"
							+ "\"feedbackSubject\":\""
							+ feedbackSubject + "\",\n"
							+ "\"filedetails\":" + filedetails
							+ ",\n" + "\"feedbackDescription\":\""
							+ feedbackDescription + "\"}"
							
							
							

					//var apString=""
					//switchAccessFlg
					var iterationCount = 1000;
					var keySize = 128;
					//passPhrase is the key
					var passphrase = CryptoJS.lib.WordArray.random(
							128 / 8).toString(CryptoJS.enc.Hex);

					var aesUtil = new AesUtil(keySize,
							iterationCount);

					var ciphertext = aesUtil.encrypt(
							reverseText(passphrase), apString);

					$("#encryptedJson").val(
							ciphertext + ':~:' + passphrase);

					

					
						$("#feedbackForm").submit();
					

				}
			});
jQuery(document)
	.ready(
			function() {
				$(function() {
					$('#feedbackForm')
							.validate(
									{
										rules : {

											officeType : {
												required : true,
											},
											Department : {
												required : true,

											},
											officeCode : {
												required : true,
											},

											feedbackSubject : {
												required : true,
											},
											feedbackDescription : {
												required : true,
											},
											
										},

										messages : {

											officeType : {
												required : "Please select Office Type"
											},

											Department : {
												required : "Please select department"
											},

											officeCode : {
												required : "Please select Office Code"
											},

											feedbackSubject : {
												required : "Please select feedback subject"
											},

											feedbackDescription : {
												required : "Please select feedback Description"
											},
									},
										errorElement : 'span',
										errorPlacement : function(
												error, element) {
											error
													.addClass('invalid-feedback');
											element.closest(
													'.form-group')
													.append(error);
										},
										highlight : function(
												element,
												errorClass,
												validClass) {
											$(element).addClass(
													'is-invalid');
										},
										unhighlight : function(
												element,
												errorClass,
												validClass) {
											$(element).removeClass(
													'is-invalid');
										},
										submitHandler : function(
												form) {

											document
													.getElementById('load').style.visibility = "visible";
											form.submit();

										}
									});
				});
			});
