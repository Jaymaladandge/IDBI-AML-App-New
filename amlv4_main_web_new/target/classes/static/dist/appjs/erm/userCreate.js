$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();

	//Date range picker
	$('#completionDate').datetimepicker({
		format: 'DD-MM-YYYY'
		//format : 'YYYY-MM-DD'
	});
})

$("#emailid").keyup(function(e) {
	var str = $(this).val();
	$("#emailid").val(str.toUpperCase());
	var emailId = $("#emailid").val();

	const userId = emailId.split("@");
	/* if (userId[0] != "") {
		//("username "+userName[0]);
		$("#userId").val(userId[0].toUpperCase());
	} */
})

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

$(document).ready(function() {
	$("#username").keyup(function(e) {
		var strUserName = $(this).val();
		$("#username").val(strUserName.toUpperCase());
		var emailIdFlg = false;
	});

	$("#userId").keyup(function(e) {
		$("#userId").val($("#userId").val().toUpperCase());
	});
});


/*FILE UPLOAD*/
var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	
	console.log('----------getFileData------------'+input.files.length);
	
	var select = $('.uploadTable');
	
	
	var flg = true;

	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
		var userName = $("#username1").val();
		//var flg = true;
		
	
		
		$('#filedetails tr').each(function() {
			var fName = $(this).find('td:eq(0)').text();
			console.log('fName : '+fName+' filename : '+filename);
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
					+ ' kb</td><td id=fileusertd' + i + ' class="text-capitalize">'
					+ userName
					+ '</td><td id=filedatetd' + i + '>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td class="project-actions text-right"><a class="btn btn-danger btn-sm"  id="closerow"><i class="fas fa-window-close"></i></a></td></tr>'));

			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}

		$('#filedetails').show();

	}

	$(".uploadTable").on("click", "#closerow", function() {

		$(this).closest("tr").remove();

		var rowCount = $('#filedetails tr').length;
		console.log('----------rowCount------------'+rowCount);

		if (rowCount == 1) {
			$('#filedetails tbody').empty();
			$('#filedetails').hide();
			flg = true;
			$('#customFile').val('');
			console.log('----------input.files.length------------'+input.files.length);
		}
	});

}

/*FILE UPLOAD*/



/*SUBMIT FUNCTION*/
$("#create_btn")
	.click(

		function(e) {
			
			//alert("enter in")
			var emailIdVal = $("#emailid").val();
			var flag = false;
		 /*	var userOfficeType = $("#officetype").val();
			var sessionOfficeType = $("#sessionOfficeType")
				.val();
			var level1 = $("#level1").val();
			var level2 = $("#level2").val();
			var level3 = $("#level3").val();
			var level4 = $("#level4").val();
			var flag = false;
			var emailflag = "false";
			var ofcFlag = false;
			//alert(sessionOfficeType.toUpperCase() === level3);
			//alert(sessionOfficeType.toUpperCase())
			if (sessionOfficeType.toUpperCase() === level2) {

				if (userOfficeType === level1) {

					ofcFlag = true;

				}
			} else if (sessionOfficeType.toUpperCase() === level3) {
				if (userOfficeType === level1
					|| userOfficeType === level2) {
					ofcFlag = true;
				}
			} else if (sessionOfficeType.toUpperCase() === level4) {
				if (userOfficeType != level4) {
					ofcFlag = true;
				}
			}
			if (ofcFlag == true) {

				toastr.error(userOfficeType.toLowerCase()
					+ ' user Cannot be Created by '
					+ sessionOfficeType);
			}
			//alert(ofcFlag);  */
			emailflag = $("#emailFlgTemp").val();
			if (emailflag === "true") {
				flag = true;
				toastr.error('Email Already Exists');
			}

			if ($('#frmUser').valid()) {
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
									+ "    \"fileType\": \""
									+ splitvalue[1]
									+ "\",\n"
									+ "    \"uploadedBy\": \""
									+ $(this)
										.find(
											'td:eq(2)')
										.text()
									+ "\"\n"
									+ " },";

							});
					//filedetails = filedetails.slice(0,-1);
					filedetails = filedetails.substring(0,
						filedetails.length - 1);
				}
				filedetails = filedetails + "]";

				var apString = "{\"userId\":\""
					+ $("#userId").val() + "\",\n"
					+ "\"userActiveStatus\":\""
					+ $("#recordStatus").val() + "\",\n"
					+ "\"channelId\":\""
					+ $("#channelId").val() + "\",\n"
					+ "\"username\":\""
					+ $("#username").val() + "\",\n"
					+ "\"userEmail\":\""
					+ $("#emailid").val() + "\",\n"
					+ "\"userMobile\":\""
					+ $("#mobileno").val() + "\",\n"
					+ "\"userPosition\":\""
					+ $("#userPosition").val() + "\",\n"
					+ "\"filedetails\":"
					+ filedetails + ",\n"
					+ "\"userRole\":\""
					+ $("#userRole").val() + "\"}";

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

				if (flag) {

					document.getElementById('load').style.visibility = "hidden";
					e.preventDefault();

				}
				/* if (ofcFlag) {

					document.getElementById('load').style.visibility = "hidden";
					e.preventDefault();
				} 

				if (flag === false && ofcFlag === false) {
					$("#frmUser").submit();
				}*/
				
				$("#frmUser").submit();

			}
		});

jQuery(document).ready(function() {

	$(function() {
		$('#frmUser').validate(
			{
				rules: {

					username: {
						required: true,
					},
					emailid: {
						required: true,

					},
					mobileno: {
						required: true,
					},

					officetype: {
						required: true,
					},
					Department: {
						required: true,
					},
					userRole: {
						required: true,

					},

					officeCode: {
						required: true,

					},
					srNo: {
						required: true,
					},
					userId: {
						required: true,
					},
					channelId: {
						required: true,
					},
					userPosition: {
						required: true,
					}


				},

				messages: {

					username: {
						required: "Please provide a User Name"
					},

					emailid: {
						required: "Please provide a Email ID"
					},

					mobileno: {
						required: "Please provide a Mobile No"
					},

					officetype: {
						required: "Please provide a Office Type"
					},

					Department: {
						required: "Please provide a Department"
					},

					userRole: {
						required: "Please provide a User Role"
					},

					officeCode: {
						required: "Please provide a Office Code"
					},
					srNo: {
						required: "Please provide a Sr No"
					},
					userId: {
						required: "Please provide a User Id"
					},
					channelId: {
						required: "Please select a Channel Id"
					},
					userPosition: {
						required: "Please select a Position"
					}

				},
				errorElement: 'span',
				errorPlacement: function(
					error, element) {
					error
						.addClass('invalid-feedback');
					element.closest(
						'.form-group')
						.append(error);
				},
				highlight: function(
					element,
					errorClass,
					validClass) {
					/*$(element).addClass(
						'is-invalid');*/
				},
				unhighlight: function(
					element,
					errorClass,
					validClass) {
					$(element).removeClass(
						'is-invalid');
				},
				submitHandler: function(
					form) {

					document
						.getElementById('load').style.visibility = "visible";
					form.submit();

				}
			});
	});
});

/*SUBMIT FUNCTION*/


/*FETCH FROM HRMS*/



/*FETCH FROM HRMS*/


/*VALIDATE EMAIL ADDRESS*/

function validateEmailFunction() {
	var emailId = $("#emailid").val().toUpperCase();

	var pageValJson = "{\"userEmail\":" + "\"" + emailId + "\"}";
	//alert(pageValJson);
	emailIdFlg = false;
	//document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'validateEmail',
		type: "POST",
		data: {
			pageValJson: pageValJson
		},// important line for thymeleaf http security
		headers: {
			"X-CSRF-TOKEN": $("input[name='_csrf']").val()
		},
		cache: false,
		// async:true,
		success: function(response) {

			setTimeout(
				function() {
					document.getElementById('interactive');
					document.getElementById('load').style.visibility = "hidden";

				}, 1000);

			var jsonResponse = JSON.stringify(response);

			var obj = JSON.parse(jsonResponse);

			Object
				.keys(obj)
				.forEach(
					function(items) {
						console.log("test" + items);

						if (items == 'emailFlg') {
							if (obj[items]) {
								emailIdFlg = true;
								$("#emailFlgTemp").val(
									"true");
								toastr
									.error('Email Id Already Exists');

							} else {
								$("#emailFlgTemp").val(
									"false");
							}

						}

					})

		},
		error: function(xhr, status, error) {

			toastr.success('Some Error Occured');

		}
	});

}

/*VALIDATE EMAIL ADDRESS*/
