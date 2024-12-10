$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

$(document).ready(function() {
	var switchStatus = false;
	$("#customSwitch3").on('change', function() {

		if ($(this).is(':checked')) {
			switchStatus = $(this).is(':checked');
			$("#actionPath").hide();
			$("#subMenu").show();

		}
		else {
			switchStatus = $(this).is(':checked');
			$("#actionPath").show();
			$("#subMenu").hide();
		}
	});
});

/*cancel Modal*/
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})
/*cancel Modal*/


$(document).ready(function() {
	//$('#customSwitch3').attr('checked', false);
	if ($("#customSwitch3").is(':checked')) {
		$("#actionPath").hide();
		$("#subMenu").show();

	}
	else {
		$("#actionPath").show();
		$("#subMenu").hide();
	}
});


/*Form Validate*/
$(function() {
	$('#frmMenu').validate({
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


/*Approve function*/
$("#approve").click(function() {
	if ($('#filedetails tr').length > 0) {
		$('#filedetails > tbody  > tr')
			.each(function(index, value) {
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
		filedetails = filedetails.substring(0, filedetails.length - 1);
	}
	filedetails = filedetails + "]";

	var statusFlgOld = $("#statusFlg").val();
	if ($("#statusFlg").val() == 'Active') {
		statusFlgOld = 'A';
	} else if ($("#statusFlg").val() == 'Pending for Approval') {
		statusFlgOld = 'D';
	} else if ($("#statusFlg").val() == 'Rejected') {
		statusFlgOld = 'R';
	} else if ($("#statusFlg").val() == 'Closed') {
		statusFlgOld = 'C';
	} else if ($("#statusFlg").val() == 'Edited') {
		statusFlgOld = 'E';
	}
	else if ($("#statusFlg").val() == 'Deleted') {
		statusFlgOld = 'X';
	}

	var menuString = "{\n" + "\"menuId\": \"" + $("#menuId").val() + "\",\n"
		+ " \"sourceName\": \"" + $("#sourceName").val() + "\",\n"
		+ " \"menuStatusOld\": \"" + statusFlgOld + "\",\n"
		+ " \"menuStatus\": \"" + $("input[name='menuStatus']:checked").val() + "\",\n"
		+ " \"menuRecordStatus\": \"" + "A\"" + "}";

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize,
		iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), menuString);
	$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
	$("#frmMenu").submit();
});
/*Approve function*/

/*Reject function*/
$("#reject").click(function() {
	if ($('#frmMenu').valid()) {
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
			filedetails = filedetails.substring(0,
				filedetails.length - 1);
		}
		filedetails = filedetails + "]";
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

			var statusFlgOld = $("#statusFlg").val();
			if ($("#statusFlg").val() == 'Active') {
				statusFlgOld = 'A';
			} else if ($("#statusFlg").val() == 'Pending for Approval') {
				statusFlgOld = 'D';
			} else if ($("#statusFlg").val() == 'Rejected') {
				statusFlgOld = 'R';
			} else if ($("#statusFlg").val() == 'Closed') {
				statusFlgOld = 'C';
			} else if ($("#statusFlg").val() == 'Edited') {
				statusFlgOld = 'E';
			}
			else if ($("#statusFlg").val() == 'Deleted') {
				statusFlgOld = 'X';
			}

			//			var menuString = "{\n" + "\"menuId\": \"" + $("#menuId").val() + "\",\n"
			//				+ " \"sourceName\": \"" + $("#sourceName").val() + "\",\n"
			//				+ " \"menuStatusOld\": \"" + statusFlgOld + "\",\n"
			//				+ " \"menuStatus\": \"" + $("input[name='menuStatus']:checked").val() + "\",\n"
			//				+ " \"menuRecordStatus\": \"" + "A\"" + "}";


			var roleString = "{\n" + "  \"menuId\": \""
				+ $("#menuId").val() + "\",\n"
				+ " \"sourceName\": \""
				+ $("#sourceName").val() + "\",\n"
				+ " \"menuRecordStatus\":\""
				+ "R\",\n"
				+ " \"menuStatus\":\""
				+ $("input[name='menuStatus']:checked").val() + "\",\n"
				+ " \"menuStatusOld\": \""
				+ statusFlgOld + "\",\n"
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
				reverseText(passphrase), roleString);
			$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
			$("#frmMenu").submit();
		}
	}
});
/*Reject function*/

/*Audit trail */
$('.viewAuditTrail').click(function() {
	var menuId = $("#menuId").val();
	var pageValJson = "{\"activityImpactTblKey\":"
		+ "\"" + menuId + "\"}";

	document.getElementById('load').style.visibility = "visible";
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


var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
	$('.odd').closest("tr").remove();
	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
		var flg = true;

		var userName = $('#clientName').val();
		$('.uploadTable tr').each(function() {
			var fName = $(this).find('td:eq(0)').text();
			console.log('fName ' + fName + ' filename ' + filename);
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
					+ '</td><td class="text-right py-0 align-middle"> - </td><td class="project-actions text-right"><a class="btn btn-danger btn-sm" id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
	}
}
$(".uploadTable").on("click", "#closerow", function() {

	var rowCount = $('.uploadTable tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#filedetails').hide();
	}
	$(this).closest("tr").remove();
});


$(".two-decimals").change(function() {
	this.value = parseFloat(this.value).toFixed(2);
});

//document.querySelector("#raToleranceThreshold").addEventListener("keypress", function (evt) {
//    if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57)
//   {
//       evt.preventDefault();
//   }
//});

$(function() {
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
});
//download
$(document).ready(function() {
	$(document).on('click', '.downloadfile', function() {

		var fileName = $(this).attr('name');
		var pageValJson = "{\"fileName\":"
			+ "\"" + fileName + "\"}";
		//document.getElementById('load').style.visibility = "visible";

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

// 0 for null values
// 8 for backspace 
// 48-57 for 0-9 numbers
