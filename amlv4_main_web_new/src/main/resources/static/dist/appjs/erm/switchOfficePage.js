
	document.onreadystatechange = function() {
		var state = document.readyState
		setTimeout(function() {
			document.getElementById('load').style.visibility = "hidden";
		}, 1000);
		$('.select2').select2();

		bsCustomFileInput.init();

	}


	$('#officeType').on('change', function() {

		var officeType = $("#officeType").val()
		var pageValJson = "{\"officeType\":"
			+ "\"" + officeType + "\"}";

		document.getElementById('load').style.visibility = "visible";

		// ajax call
		$
			.ajax({
				url: 'getOfficeCodeByOfficeType',
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
						}, 1000);

					var jsonResponse = JSON
						.stringify(response);
					var obj = JSON
						.parse(jsonResponse);



					//clear Drop-Down List of 

					$("#officeCode").empty();
					$("<option />", {
							val: "",
							text: "Select Office Type"
						}).appendTo($("#officeCode"));
					obj.officeCodeList.forEach(function(items) {
						console.log(items);

						$("<option />", {
							val: items,
							text: items
						}).appendTo($("#officeCode"));


					});
					
					$("#department").empty();
					$("<option />", {
							val: "",
							text: "Select Department Type"
						}).appendTo($("#department"));
					obj.deptList.forEach(function(items) {
						console.log(items);

						$("<option />", {
							val: items.split('~')[0],
							text: items.split('~')[1]
						}).appendTo($("#department"));


					});

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


		$("#submitBtn")
				.click(

						function(e) {
							
								if ($('#switchOfcFrm').valid()) {
								document.getElementById('load').style.visibility = "visible";
								//Check table data
								

								var apString = "{\"officeType\":\""
										+ $("#officeType").val()
										+ "\",\n" + "\"officeCode\":\""
										+ $("#officeCode").val()
										+ "\",\n" + "\"roleName\":\""
										+ $("#roleName").val() + "\",\n"
										+ "\"department\":\""
										+ $("#department").val() + "\"}"
										

								//var apString=""
								

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
								
								
									$("#switchOfcFrm").submit();
								

							}
						});
		jQuery(document)
				.ready(
						function() {
							$(function() {
								$('#switchOfcFrm')
										.validate(
												{
													rules : {

														department : {
															required : true,
														},
														officeType : {
															required : true,

														},
														officeCode : {
															required : true,
														},

													

													},

													messages : {

														department : {
															required : "Please Select Department"
														},

														officeType : {
															required : "Please Select Office Type"
														},

														officeCode : {
															required : "Please Select Office Code"
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

