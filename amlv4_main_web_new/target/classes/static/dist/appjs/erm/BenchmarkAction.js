
/*loader*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
})

document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
	} else if (state == 'complete') {
		setTimeout(
			function() {
				document.getElementById('interactive');
			}, 1000);
	}
}
/*loader*/

/*cancel Modal*/
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})
/*cancel Modal*/

/*Form Validate*/
$(function() {
	$('#frmBenchmark').validate({
		rules: {
			reason: {
				required: true,
				minlength: 10,
				maxlength: 400
			},
		},
		messages: {
			reason: {
				required: "Please Provide Reason For Rejection",
			},
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

			setTimeout(function() {
				form.submit();
			}, 2000);
		}
	});
});
/*Form Validate*/

/*File Upload*/
$(".uploadTable").on("click", "#closerow", function() {
	var rowCount = $('.uploadTable tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#filedetails').hide();
	}
	$(this).closest("tr").remove();
});

var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
		
		var flg = false;
		var userName = $('#clientName').val();
		$('.uploadTable tr').each(function() {
			var fName = $(this).find('td:eq(0)').text();
			console.log('fName ' + fName + ' filename ' + filename);
			if(fName==="No Data Available" || fName==="No data available in table"){
				flg = false;
			}
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
					+ ' kb</td><td>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td class="text-capitalize">'
					+ userName
					+ '</td><td class="text-right py-0 align-middle"></td><td class="project-actions text-right"><a class="btn btn-danger btn-sm" id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
	}
}
/*File Upload*/

/*File Download*/
/*$(function() {
	$("#filedetails").DataTable({
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
		'#filedetails_wrapper .col-md-12:eq(0)');
});*/
//download
$(document).ready(function() {
	$(document).on('click', '.downloadfile', function() {

		var fileName = $(this).attr('name');
	
		
		var pageValJson = "{\"fileName\":"
			+ "\"" + fileName + "\"}";
		// ajax call
		$
			.ajax({
				url: 'download',
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
				error: function(xhr, status, error) {
					console.log(xhr);
					console.log(status);
					console.log(error);
					toastr
						.success('Some Error Occured');
				}
			});
			
	});
});

/*File Download*/

/*Approve function*/
$("#approve").click(function() {
	
	var filedetails = "[\n";
			if ($('#filedetails tr').length > 0) {
				$('#filedetails > tbody  > tr')
					.each(
						function(index, value) {
							var splitvalue = $(this)
								.find('td:eq(0)')
								.text().split('.');
							var sizesplit = $(this)
								.find('td:eq(1)')
								.text().split(' ');
							var oldfileFlg = $(this)
								.find('td:eq(4)')
								.text();
							if (oldfileFlg == '') {
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
									+ "\"\n"
									+ " },";

							}
						});
				filedetails = filedetails.substring(0,
					filedetails.length - 1);
			}
			filedetails = filedetails + "]";
			//alert(filedetails);

	var actionName = $(this).attr("name");
	var bmId = $("#bmId").val();
	var bmActionStatusOld = $("#bmActionStatus").val();
	var bmActionStatus = "";

	if ($("#recordstatus").val() == 'Pending Approval For Creation') {
		bmActionStatus = 'AR';
	}else if ($("#recordstatus").val() == 'Pending Approval For Edit') {
				bmActionStatus = 'EA';
	}else if ($("#recordstatus").val() == 'Pending Approval For Closure') {
				bmActionStatus = 'XX';
			}

		var actionString = "{\n" 
			+ " \"bmId\": \"" + bmId + "\",\n"
			+ "    \"sourceName\": \"" + $("#sourceName").val()
			+ "\",\"bmActionName\":\"" + actionName + "\",\n"
			+ "\"bmActionStatusOld\": \"" + bmActionStatusOld + "\",\n"
			+ "    \"bmActionStatus\":\"" + bmActionStatus 
			+ "\",\"filedetails\":" + filedetails + "}";


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
			$('#frmBenchmark').submit();
	});
/*Approve function*/

/*Reject function*/
$("#reject")
	.click(
		function() {
			var actionName = $(this).attr("name");
			var filedetails = "[\n";
			if ($('#filedetails tr').length > 0) {
				$('#filedetails > tbody  > tr')
					.each(
						function(index, value) {
							var splitvalue = $(this)
								.find('td:eq(0)')
								.text().split('.');
							var sizesplit = $(this)
								.find('td:eq(1)')
								.text().split(' ');
							var oldfileFlg = $(this)
								.find('td:eq(4)')
								.text();
							if (oldfileFlg == '') {
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
									+ "\"\n"
									+ " },";
							}
						});
				filedetails = filedetails.substring(0,
					filedetails.length - 1);
			}
			filedetails = filedetails + "]";
			var bmId = $("#bmId").val();
			var bmActionStatusOld = $("#bmActionStatusOld").val();
			var bmActionStatus = "";
			var reason = $('#reason').val();
			reason = reason.replace(/[\t\n]+/g, ' ');
			if (reason == '') {
				$('span[id^="reason-error"]').remove();
				$('#reason').addClass('is-invalid');
				$('#reason')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
			} else if (reason.length < 10) {
				$('span[id^="reason-error"]').remove();
				$('#reason').addClass('is-invalid');
				$('#reason')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
			} else {

				 if ($("#recordstatus").val() == 'Pending Approval For Creation') {
					bmActionStatusOld = $("#bmActionStatus").val();
					bmActionStatus = 'ZR';
				}  else if ($("#recordstatus").val() == 'Pending Approval For Edit') {
					bmActionStatus = 'EZ';
					bmActionStatusOld = 'ER';
				}
				else if ($("#recordstatus").val() == 'Pending Approval For Closure') {
					bmActionStatus = 'XZ';
					bmActionStatusOld = 'XQ';
				}

				var actionString = "{\n"
					+ "  \"bmId\": \"" + bmId
					+ "\",\n" + "    \"sourceName\": \""
					+ $("#sourceName").val() + "\",\n"
					+ " \"bmActionStatus\":\""
					+ bmActionStatus + "\",\"bmActionName\":\"" + actionName + "\",\n"
					+ " \"bmActionStatusOld\": \""
					+ bmActionStatusOld + "\",\n"
					+ "\"commentDto\":{\"comment\":\""
					+ reason + "\"}," + "\"filedetails\":"
					+ filedetails + "}";
					
				
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
				$('#frmBenchmark').submit();
			}
		});
/*Reject function*/		
		
/*Audit trail */
$('.viewAuditTrail').click(function() {

	var bmId = $("#bmId").val();
	var pageValJson = "{\"activityImpactTblKey\":"
		+ "\"" + bmId + "\"}";
	// ajax call
	$
		.ajax({
			url: 'viewAuditTrail',
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
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);
				$(".timeline-inverse").empty();
				if (obj.length > 0) {
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
					$("<div> <i class='far fa-clock bg-gray'></i> </div>").appendTo(".timeline-inverse");
					$('#timelinelink').css('class', 'border');
					$('#timelinelink').css('display', '');
					$('#timelinelink').click();
				}
				$('#timelinemodal').modal('show');
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
/*Audit trail */
















