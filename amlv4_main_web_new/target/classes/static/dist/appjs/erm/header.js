
var rolename = "";


function addSessionFunction() {

	var rolenames = sessionStorage.getItem('rolename');
	var moduleCode = sessionStorage.getItem('moduleCode');
	/*var pageValJson = "{\"roleName\":"
		+ "\"" + rolenames + "\"}";*/
	var pageValJson = "{\"roleName\":\"" + rolenames
		+ "\",\n" + "\"moduleCode\":\"" + moduleCode + "\"}";


	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$
		.ajax({
			url: 'addSessionFunction',
			type: "POST",
			data: {
				pageValJson: pageValJson
			},
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
						//document.getElementById('contents').style.visibility = "visible";
					}, 300);

				var jsonResponse = JSON
					.stringify(response);

				var obj = JSON.parse(jsonResponse);






			},
			error: function(xhr, status, error) {

				toastr
					.success('Some Error Occured');
			}
		});

}

function removeSessionFunction() {

	var rolenames = sessionStorage.getItem('rolename');
	var moduleCode = sessionStorage.getItem('moduleCode');
	/*var pageValJson = "{\"roleName\":"
		+ "\"" + rolenames + "\"}";*/

	var pageValJson = "{\"roleName\":\"" + rolenames
		+ "\",\n" + "\"moduleCode\":\"" + moduleCode + "\"}";

	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$
		.ajax({
			url: 'removeSessionFunction',
			type: "POST",
			data: {
				pageValJson: pageValJson
			},
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
						//document.getElementById('contents').style.visibility = "visible";
					}, 300);

				var jsonResponse = JSON
					.stringify(response);

				var obj = JSON.parse(jsonResponse);






			},
			error: function(xhr, status, error) {

				toastr
					.success('Some Error Occured');
			}
		});

}

$('#officeTypeSwitchOffice').on('change', function() {

	var officeType = $("#officeTypeSwitchOffice").val()
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

				$("#officeCodeSo").empty();
				$("<option />", {
					val: "",
					text: "Select Office Code"
				}).appendTo($("#officeCodeSo"));
				obj.officeCodeList.forEach(function(items) {


					$("<option />", {
						val: items,
						text: items
					}).appendTo($("#officeCodeSo"));


				});

				$("#departmentSo").empty();
				$("<option />", {
					val: "",
					text: "Select Department Type"
				}).appendTo($("#departmentSo"));
				obj.deptList.forEach(function(items) {


					$("<option />", {
						val: items.split('~')[0],
						text: items.split('~')[1]
					}).appendTo($("#departmentSo"));


				});
				$("#roleNameSo").empty();
				$("<option />", {
					val: "",
					text: "Select Role Name"
				}).appendTo($("#roleNameSo"));

				obj.roleList.forEach(function(items) {

					$("<option />", {
						val: items.split('~')[0],
						text: items.split('~')[1]
					}).appendTo($("#roleNameSo"));


				});
				$("#deptModel").css('display', '');
				$("#officeCodeModel").css('display', '');
				$("#roleModel").css('display', '');
				$("#submitBtnSwitchOfc2").css('display', '');

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

$("#submitBtnSwitchOfc")
	.click(

		function(e) {

			if ($('#switchOfcFrm').valid()) {
				document.getElementById('load').style.visibility = "visible";
				//Check table data


				var apString = "{\"officeType\":\""
					+ $("#officeTypeSwitchOffice").val()
					+ "\",\n" + "\"officeCode\":\""
					+ $("#officeCodeSo").val()
					+ "\",\n" + "\"roleName\":\""
					+ $("#roleNameSo").val() + "\",\n"
					+ "\"department\":\""
					+ $("#departmentSo").val() + "\"}"


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

				$("#encryptedJsonModel").val(
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
							rules: {

								departmentSo: {
									required: true,
								},
								officeTypeSwitchOffice: {
									required: true,

								},
								officeCodeSo: {
									required: true,
								},
								roleNameSo: {
									required: true,
								},



							},

							messages: {

								departmentSo: {
									required: "Please Select Department"
								},

								officeTypeSwitchOffice: {
									required: "Please Select Office Type"
								},

								officeCodeSo: {
									required: "Please Select Office Code"
								},
								roleNameSo: {
									required: "Please Select Role Name"
								},


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
								$(element).addClass(
									'is-invalid');
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



$('#changeOffice').on('click', function() {
	document.getElementById('load').style.visibility = "visible";

	// ajax call
	$
		.ajax({
			url: 'switchOfficeDetail',
			type: "POST",
			data: {
				//pageValJson: pageValJson
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

				$("#officeTypeSwitchOffice").empty();
				$("<option />", {
					val: "",
					text: "Select Office Type"
				}).appendTo($("#officeTypeSwitchOffice"));
				obj.officeTypeList.forEach(function(items) {


					$("<option />", {
						val: items.split('~')[1],
						text: items.split('~')[0]
					}).appendTo($("#officeTypeSwitchOffice"));


				});

				$('#switchOfcModel').modal('show');
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




/* $(document).ready(function(){
			$('.select2Temp').select2();
			
});*/

$('#documentMgmt').on('click', function() {
	document.getElementById('load').style.visibility = "visible";
	var pageValJson = "";
	// ajax call
	$
		.ajax({
			url: 'viewDocumentListOfcWise',
			type: "POST",
			data: {
				//pageValJson: pageValJson
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

				$(".fileBody").empty();
				$('#modalFileId').dataTable()
					.fnClearTable();
				$('#modalFileId').DataTable()
					.destroy();

				if (obj.fileDetailsList != null) {
					if (obj.fileDetailsList.length > 0) {
						obj.fileDetailsList
							.forEach(function(item) {
								$(
									'#modalFileId tr:last')
									.after(
										'<tr><td>'
										+ item.fileName
										+ '</td><td>'
										+ item.fileSize
										+ '</td><td class="text-capitalize">'
										+ item.uploadTimestamp
										+ '</td><td>'
										+ item.uploadedBy
										+ '</td><td><div class="btn-group btn-group-sm">'
										+ '<a name=' + item.fileName + ' href="#" class="btn btn-info downloadfile"><i '
										+ ' class="fas fa-download"></i></a>'
										+ '</div></td></tr>');
							});
						var seen = {};
						$('#modalFileId tr')
							.each(
								function() {
									var txt = $(
										this)
										.text();
									if (seen[txt])
										$(this)
											.remove();
									else
										seen[txt] = true;
								});
						$('#fileDiv').show();
					}
				} else {
					// Datatable start

					$("#modalFileId").DataTable({
						"responsive": false,
						"lengthMenu": [25, 50, 75, 100],
						"autoWidth": false,
						"searching": true,
						"fixedHeader": true,
						"language": {
							"emptyTable": "No Data Available",
							"search": "Search:"
						},

					}).buttons().container().appendTo(
						'#modalFileId_wrapper .col-md-6:eq(0)');

					// Datatable End
				}




				$('#viewDocumentModal').modal('show');
			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.success('Some Error Occured');
			}
		});

})

/**
	 * File Download
	 */



// Download file
$(document).on('click', '.downloadfile', function() {
	//var fileName = $(this).attr('name');
	var fileName = $(this).closest('tr').find("td").eq(0).text().trim();
	var pageValJson = "{\"fileName\":" + "\"" + fileName + "\"}";

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize,
		iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), pageValJson);
	$("#encryptedJsonFile").val(ciphertext + ':~:' + passphrase);
	$('#fileForm').attr("method", "post");
	$('#fileForm').attr("action", "fileDownload");
	$('#fileForm').submit();
});

$("#tatReport123").click(
	function() {
		var moduleCode = 'TM';

		var pageValJson = "{\"moduleCode\":" + "\"" + moduleCode
			+ "\"}";

		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJsonEdit").val(ciphertext + ':~:' + passphrase);
		$("#getTatReport").submit();
	});