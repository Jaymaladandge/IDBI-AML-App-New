console.log('------------editUser.js--------------');
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

$("#emailid").keyup(function(e) {
	var str = $(this).val();
	$("#emailid").val(str.toUpperCase());
	var emailId = $("#emailid").val();

	const userId = emailId.split("@");
	if (userId[0] != "") {
		//alert("username "+userName[0]);
		$("#userId").val(userId[0].toUpperCase());
	}
})

$('#Department')
	.on(
		'change',
		function() {
			var dept = $('#Department').find(":selected").text();
			if (dept === 'ERM') {
				$("#switchOfcColumn").css("display", "");
			} else {
				$("#switchOfcColumn").css("display", "none");
			}


		});

// File upload //
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
				.append($('<tr id=tr' + i + '><td id=filetd' + i + '>'
					+ filename
					+ '</td><td id=filesizetd' + i + '>'
					+ filesizeInMB
					+ ' kb</td><td class="text-capitalize">'
					+ userName
					+ '</td><td>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td class="project-actions text-right"><a class="btn btn-danger btn-sm"  id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));

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


$("#edit_btn")
	.click(

		function() {

			var fileId = $(this).data("fileId"); 
    		console.log("---------", fileId);

			var emailIdVal = $("#emailid").val();
			var emailValTemp = $("#emailidtemp").val();
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
								if (splitvalue[1] !== null && splitvalue[1] !== undefined &&
									splitvalue[1] !== '') {
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
										+ "\",\n"
										+ "    \"uploadedBy\": \""
										+ $(this)
										.find(
											'td:eq(2)')
											.text()
										+ "\"\n"
										+ " },";
									}
								});
					//filedetails = filedetails.slice(0,-1);
					filedetails = filedetails.substring(0,
						filedetails.length - 1);
				}
				filedetails = filedetails + "]";

				var apString = "{\"userId\":\""
					+ $("#userId").val() + "\",\n"
					+ "\"channelId\":\""
					+ $("#channelId").val() + "\",\n"
					+ "\"username\":\""
					+ $("#username").val() + "\",\n"
					+ "\"userEmail\":\""
					+ $("#userEmail").val() + "\",\n"
					+ "\"userMobile\":\""
					+ $("#userMobile").val() + "\",\n"
					+ "\"userPosition\":\""
					+ $("#userPosition").val() + "\",\n"
					+ "\"filedetails\":"
					+ filedetails + ",\n"
					+ "\"fileName\":\"" 
					+ fileId + "\",\n" 
					+ "\"userRole\":\""
					+ $("#userRole").val() + "\"}";
				//alert(apString);

					console.log('-----apString------'+apString);
				//var apString=""
				//alert("apString " + apString);

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

				$("#frmUser").submit();

			}
		});
$(function() {
	$('#frmUser')
		.validate(
			{
				rules: {
					username: {
						required: true,
					},
					userEmail: {
						required: true,

					},
					userMobile: {
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
					commentUser: {
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

					userEmail: {
						required: "Please provide a Email ID"
					},

					userMobile: {
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

					commentUser: {
						required: "Please provide a Comment"
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
				errorPlacement: function(error, element) {
					error.addClass('invalid-feedback');
					element.closest('.form-group')
						.append(error);
				},
				highlight: function(element, errorClass,
					validClass) {
					$(element).addClass('is-invalid');
				},
				unhighlight: function(element, errorClass,
					validClass) {
					$(element).removeClass('is-invalid');
				},
				submitHandler: function(form) {

					document.getElementById('load').style.visibility = "visible";
					form.submit();

				}
			});
});



$('#officetype')
	.on(
		'change',
		function() {
			var userOfficeType = $("#officetype").val();
			var pageValJson = "{\"userOfficeType\":" + "\""
				+ userOfficeType + "\"}";
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'fetchDepartmentByOfcName',
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
								document
									.getElementById('contents').style.visibility = "visible";
							}, 1000);

						var jsonResponse = JSON
							.stringify(response);

						var obj = JSON.parse(jsonResponse);

						var s = '';
						s = '<option value="'
							+ $("#departmentSelected")
								.val()
							+ '">'
							+ $("#departmentSelected")
								.val()
							+ '</option>';

						obj.deptNameList
							.forEach(function(items) {
								if (items !== $(
									"#departmentSelected")
									.val()) {
									s += '<option value="' + items + '">'
										+ items
										+ '</option>';
									$('#Department')
										.html(s);
								}
							});

					},
					error: function(xhr, status, error) {

						toastr
							.success('Some Error Occured');
					}
				});
		});


$(document)
	.ready(
		function() {
			$(
				'#officetype option[value="'
				+ $("#officeTypeSelected").val()
				+ '"]')
				.attr("selected", "selected").change();
			var ermFlg = $("#ermDeptIdFlg").val();

			if (ermFlg === "true") {

				$(
					'#Department option[value="'
					+ $("#departmentSelected")
						.val() + '"]').attr(
							"selected", "selected").change();
				$('#switchAccessFlg option[value="' + $("#selectedSwitchOfcFlg").val() + '"]').attr("selected",
					"selected").change();
			}

			$(
				'#officeCode option[value="'
				+ $("#officeCodeSelected").val()
				+ '"]')
				.attr("selected", "selected").change();

		});

$(document).ready(
	function() {
		var activeStatusOld = $("#userActiveStatusOld").val();
		$(
			"input[name=activeStatus][value='"
			+ activeStatusOld + "']").prop("checked",
				true);

		/*$("#filedetails").DataTable({
			"columnDefs": [{
				orderable: false,
				targets: [4, 5]
			}],
			"lengthMenu": [5, 10, 25, 50, 75, 100],
			"responsive": false,
			"autoWidth": true,
			"searching": false,
			"fixedHeader": true,
			"language": {
				"emptyTable": "No Data Available"
			}
		}).buttons().container().appendTo(
			'#filedetails_wrapper .col-md-12:eq(0)');*/
	});

/*UPDATE DEFAULT USER*/
$("#update_data_btn")
	.click(
		function() {

			var srno = $("#srNo").val();

			var pageValJson = "{\"srno\":" + "\"" + srno
				+ "\"}";
			document.getElementById('load').style.visibility = "visible";
			$
				.ajax({
					url: 'fetchHrmsDataBySrno',
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

						var obj = JSON.parse(jsonResponse);

						Object
							.keys(obj)
							.forEach(
								function(items) {

									if (items == 'userOfficeType') {
										var officeTypeExisting = $(
											'#officetype')
											.val();

										/* $('#officetype option[value="'+obj[items]+'"]').attr("selected",
										"selected").change(); */
										if (officeTypeExisting === obj[items]) {
											toastr
												.info('Office Type not changed');
										} else {
											$(
												'#officetype')
												.val(
													obj[items]);
											$("#Department").empty();
											if (obj.deptNameList != null) {
												$("<option />", {
													val: "",
													text: "Select Department Type"
												}).appendTo($("#Department"));
												obj.deptNameList.forEach(function(items) {


													$("<option />", {
														val: items.split('~')[0],
														text: items.split('~')[1]
													}).appendTo($("#Department"));


												});
											}
											//role added as per office
											$("#userRole").empty();
											if (obj.roleNameList != null) {
												$(
													"<option />",
													{
														val: "",
														text: "Select Roles"
													}).appendTo(
														$("#userRole"));
												obj.roleNameList
													.forEach(function(items) {
														console.log(items);

														$(
															"<option />",
															{
																val: items
																	.split('~')[0],
																text: items
																	.split('~')[1]
															})
															.appendTo(
																$("#userRole"));

													});
											}
										}

									}
									if (items == 'officeCode') {
										var officeCodeExisting = $(
											"#officeCode")
											.val();
										if (officeCodeExisting === obj[items]) {
											toastr
												.info('Office Code not changed');
										} else {
											$(
												"#officeCode")
												.val(
													obj[items]);
										}

									}

								});

						$("#emailid")
							.keyup(
								function(e) {
									var str = $(
										this)
										.val();
									$("#emailid")
										.val(
											str
												.toUpperCase());
									var emailId = $(
										"#emailid")
										.val();

									const userId = emailId
										.split("@");
									if (userId[0] != "") {
										//("username "+userName[0]);
										$("#userId")
											.val(
												userId[0]
													.toUpperCase());
									}
								})

						$(document)
							.ready(
								function() {
									
									$("#username")
										.keyup(
											function(
												e) {
												var strUserName = $(
													this)
													.val();
												$(
													"#username")
													.val(
														strUserName
															.toUpperCase());
											});

								});

					},
					error: function(xhr, status, error) {

						toastr
							.success('Some Error Occured');
					}
				});

		})
		
		
$(document).ready(function(){
	
	$('#username').keyup(function(e){
		$('#username').val($('#username').val().toUpperCase());
	})
	
	
	$('#userId').keyup(function(e){
		$('#userId').val($('#userId').val().toUpperCase());
	})
	
	
	$('#userEmail').keyup(function(e){
		$('#userEmail').val($('#userEmail').val().toUpperCase());
	})
	
	
	
});		
		
/*UPDATE DEFAULT USER*/




//----------------------------------------------- Fetch positions -----------------------------------------


$(document).ready(function(){




$('#userPosition').change(function(){

	var positionVal = $('#userPosition').val();
	console.log('--------positionVal---------'+positionVal);
	document.getElementById('load').style.visibility = "visible";

	 $.ajax({
		
		url : 'fetchRolesForPosition',
		type : 'post',
		data : { positionVal: positionVal },
		headers : {"X-CSRF-TOKEN" :  $("input[name='_csrf']").val()},
		success : function(response){
		
		setTimeout(function() {
				document.getElementById('load').style.visibility = "hidden";
		}, 1000);
		
		
		if(response != null && Array.isArray(response) && response.length > 0){
		
		var userRoleSelect = $('#userRole');
		userRoleSelect.empty();
		
		response.forEach(data => {
			console.log(data.roleId+'='+data.roleName);
			
			
			var option = $('<option>',{
					value: data.roleId,  
                    text: data.roleName.toUpperCase()
			});
			
			option.prop('selected', true);
			userRoleSelect.append(option);
			
			userRoleSelect.prop('disabled', true);
			
		});
		
		userRoleSelect.select2();
		
		}
		else{
			console.log("-----------response is null or undefined or empty------------"+response);
		}
		
		},
		error : function(xhr, status, error){
			toastr.error('Some error occured');
		}

	}); 


});


//Manually trigger to poulate Role Name
var userPosition = $('#userPosition').val();
if(userPosition !=null && userPosition !=undefined ){
	$('#userPosition').trigger('change');
}



$(".uploadTable").on("click", "#closerow", function() {


		var fileId = $(this).data("id");
		console.log("File ID:", fileId); 
		$("#edit_btn").data("fileId", fileId); 

		$(this).closest("tr").remove();

		var rowCount = $('#filedetails tr').length;

		if (rowCount == 1) {
			$('#filedetails tbody').empty();
			$('#filedetails').hide();
			flg = true;
			$('#customFile').val('');
		}
});



});	











