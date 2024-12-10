/**
 * 
 */
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});
/* Loader */
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
};

$(function() {
	$("#filedetails").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [4, 5]
		}],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"lengthChange": false,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#filedetails_wrapper .col-md-12:eq(0)');
});

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
});

// Main Actions Approve or Reject
var approveBtn = false;
//APPROVE ACTION	
$("#approve").click(function() {
	approveBtn = true;
	document.getElementById('interactive');
	document.getElementById('load').style.visibility = "visible";
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
					if (oldfileFlg == '-') {
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
	var kriId = $("#kriId").val();
	var kriActionStatusOld = $(
		"#kriActionStatus").val();
	var kriActionStatus = "";

	if ($("#recordstatus").val() == 'Pending Verification For Creation') {
		kriActionStatus = 'VR';
	} else if ($("#recordstatus").val() == 'Pending Approval For Creation') {
		kriActionStatus = 'AR';
	} else if ($("#recordstatus").val() == 'Pending Verification For Edit') {
		kriActionStatus = 'EV';
	} else if ($("#recordstatus").val() == 'Pending Approval For Edit') {
		kriActionStatus = 'AR';
	} else if ($("#recordstatus").val() == 'Pending Verification For Closure') {
		kriActionStatus = 'XV';
	} else if ($("#recordstatus").val() == 'Pending Approval For Closure') {
		kriActionStatus = 'XX';
	}

	var actionString = "{\n" + "    \"kriId\": \""
		+ kriId + "\",\n"
		+ "    \"sourceName\": \""
		+ $("#sourceName").val() + "\",\n"
		+ "    \"kriActionStatusOld\": \""
		+ kriActionStatusOld + "\",\n"
		+ "  \"actionName\":\"" + actionName + "\",\n"
		+ "    \"kriActionStatus\":\""
		+ kriActionStatus
		+ "\",\"filedetailsList\":" + filedetails + "}";
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
	$('#frmkri').attr("action", "reviewKri");
	$('#frmkri').submit();
});


var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var username = $('#userName').val();
	var select = $('.uploadTable');
	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
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
					+ '</td><td>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td class="text-capitalize">'
					+ username
					+ '</td><td>-</td><td class="project-actions text-right" ><a class="btn btn-danger btn-sm" id="closerow"><i class="fas fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
	}
}
$(".uploadTable").on("click", "#closerow", function() {
	$(this).closest("tr").remove();
});


$("#reject")
	.click(
		function() {
			approveBtn = true;
			document.getElementById('interactive');
			document.getElementById('load').style.visibility = "visible";
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
							if (oldfileFlg == '-') {
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
			var kriId = $("#kriId").val();
			var kriActionStatusOld = $(
				"#kriActionStatus").val();
			var kriActionStatus = "";

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

				if ($("#recordstatus").val() == 'Pending Verification For Creation') {
					kriActionStatusOld = $(
						"#kriActionStatus").val();
					kriActionStatus = 'ZR';
				} else if ($("#recordstatus").val() == 'Pending Approval For Creation') {
					kriActionStatusOld = $(
						"#kriActionStatus").val();
					kriActionStatus = 'ZR';
				} else if ($("#recordstatus").val() == 'Pending Verification For Edit') {
					kriActionStatus = 'EZ';
					kriActionStatusOld = 'ER';
				} else if ($("#recordstatus").val() == 'Pending Approval For Edit') {
					kriActionStatus = 'EZ';
					kriActionStatusOld = 'EV';
				} else if ($("#recordstatus").val() == 'Pending Verification For Closure') {
					kriActionStatus = 'XZ';
				} else if ($("#recordstatus").val() == 'Pending Approval For Closure') {
					kriActionStatus = 'XZ';
				}
				var actionString = "{\n"
					+ "  \"kriId\": \"" + kriId
					+ "\",\n" + "    \"sourceName\": \""
					+ $("#sourceName").val() + "\",\n"
					+ " \"kriActionStatus\":\""
					+ kriActionStatus + "\",\n"
					+ " \"kriActionStatusOld\": \""
					+ kriActionStatusOld + "\",\n"
					+ "  \"actionName\":\"" + actionName + "\",\n"
					+ "\"commentDto\":{\"comment\":\""
					+ reason + "\"}," + "\"filedetailsList\":"
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
				$('#frmkri').attr("action", "reviewKri");
				$('#frmkri').submit();
			}

		});

$(".myDIV").hover(function() {
	var id = $(this).attr('id');
	$('.' + id + 'viewThreshold').show();
}, function() {
	var id = $(this).attr('id');
	$('.' + id + 'viewThreshold').hide();
});

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
	$("#encryptedJson").val(
		ciphertext + ':~:' + passphrase);
	$('#frmkri').attr("method", "post");
	$('#frmkri').attr("action", "fileDownload");
	$('#frmkri').submit();
});