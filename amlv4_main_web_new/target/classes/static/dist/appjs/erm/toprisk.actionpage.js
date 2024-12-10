/**
 * 
 */
$(function() {
	$("#toprisktable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [6]
		}],
		"responsive": true,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"buttons": ["csv", "excel", "pdf", "print"]
	}).buttons().container().appendTo(
		'#toprisktable_wrapper .col-md-6:eq(0)');
});
$(function() {
	$("#topriskaudittable").DataTable({
		"responsive": true,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"buttons": ["csv", "excel", "pdf", "print"]
	}).buttons().container().appendTo(
		'#topriskaudittable_wrapper .col-md-6:eq(0)');
});
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
//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
		document.getElementById('contents').style.visibility = "hidden";
	} else if (state == 'complete') {
		setTimeout(
			function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
				document.getElementById('contents').style.visibility = "visible";
			}, 1000);
	}
}
$(function() {
	$.validator.setDefaults({
		submitHandler: function() {
			toastr.success('Details submitted sucessfully...')
		}
	});

	$('#edittopriskform').validate({
		rules: {
			comments: {
				required: true,
				minlength: 10,
				maxlength: 3000
			},

		},
		messages: {
			comments: {
				required: "Please provide your comments",
			},
		},
		errorElement: 'span',
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback');
			element.closest('.form-group').append(error);
		},
		highlight: function(element, errorClass, validClass) {
			$(element).addClass('is-invalid');
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).removeClass('is-invalid');
		}
	});
});
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
})

$(document).ready(function() {
	$(".anchor-link").on("click", function() {
		$(this).addClass("active");
		$(this).siblings().removeClass("active");
		var href = $("a", this).attr('href');
		$(href).html("You clicked " + href + " !");
	});
	$("#createdate").val(moment(new Date()).format('DD/MM/YYYY'));

});
var max_chars = 3;
function openmodal(dept) {
	$("#kriDept").text(dept);
	$('#krilistmodal').modal('show');

}

// Main Actions Approve or Reject
var approveBtn = false;
//APPROVE ACTION	
$("#approve")
	.click(
		function() {
			approveBtn = true;
			var actionName = $(this).attr("name");
			document.getElementById('interactive');
			document.getElementById('load').style.visibility = "visible";
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
			var topRiskId = $("#topRiskId").val();
			var topRiskActionStatusOld = $(
				"#topRiskActionStatus").val();
			var topRiskActionStatus = "";

			if ($("#recordstatus").val() == 'Pending Verification For Creation') {
				topRiskActionStatus = 'VR';
			} else if ($("#recordstatus").val() == 'Pending Approval For Creation') {
				topRiskActionStatus = 'AR';
			} else if ($("#recordstatus").val() == 'Pending Verification For Edit') {
				topRiskActionStatus = 'EV';
			} else if ($("#recordstatus").val() == 'Pending Approval For Edit') {
				topRiskActionStatus = 'AR';
			} else if ($("#recordstatus").val() == 'Pending Verification For Closure') {
				topRiskActionStatus = 'XV';
			} else if ($("#recordstatus").val() == 'Pending Approval For Closure') {
				topRiskActionStatus = 'XX';
			}

			var actionString = "{\n" + "    \"topRiskId\": \""
				+ topRiskId + "\",\n"
				+ "    \"sourceName\": \""
				+ $("#sourceName").val() + "\",\"actionName\":\"" + actionName + "\",\n"
				+ "\"topRiskActionStatusOld\": \""
				+ topRiskActionStatusOld + "\",\n"
				+ "    \"topRiskActionStatus\":\""
				+ topRiskActionStatus
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

			$('#frmtoprisk').submit();
		});

$("#reject")
	.click(
		function() {
			approveBtn = true;
			var actionName = $(this).attr("name");
			document.getElementById('interactive');
			document.getElementById('load').style.visibility = "visible";
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
			var topRiskId = $("#topRiskId").val();
			var topRiskActionStatusOld = $(
				"#topRiskActionStatus").val();
			var topRiskActionStatus = "";

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
					topRiskActionStatusOld = $(
						"#topRiskActionStatus").val();
					topRiskActionStatus = 'ZR';
				} else if ($("#recordstatus").val() == 'Pending Approval For Creation') {
					topRiskActionStatusOld = $(
						"#topRiskActionStatus").val();
					topRiskActionStatus = 'ZR';
				} else if ($("#recordstatus").val() == 'Pending Verification For Edit') {
					topRiskActionStatus = 'EZ';
					topRiskActionStatusOld = 'ER';
				} else if ($("#recordstatus").val() == 'Pending Approval For Edit') {
					topRiskActionStatus = 'EZ';
					topRiskActionStatusOld = 'EV';
				} else if ($("#recordstatus").val() == 'Pending Verification For Closure') {
					topRiskActionStatus = 'XZ';
				} else if ($("#recordstatus").val() == 'Pending Approval For Closure') {
					topRiskActionStatus = 'XZ';
				}

				var actionString = "{\n"
					+ "  \"topRiskId\": \"" + topRiskId
					+ "\",\n" + "    \"sourceName\": \""
					+ $("#sourceName").val() + "\",\n"
					+ " \"topRiskActionStatus\":\""
					+ topRiskActionStatus + "\",\"actionName\":\"" + actionName + "\",\n"
					+ " \"topRiskActionStatusOld\": \""
					+ topRiskActionStatusOld + "\",\n"
					+ "\"commentDto\":{\"comment\":\""
					+ reason + "\"}," + "\"filedetails\":"
					+ filedetails + "}";

				//alert(actionString);
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

				$('#frmtoprisk').submit();
			}

		});
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);

})


var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var username = $('#userName').val();
	var select = $('.uploadTable');
	$('.odd').closest("tr").remove();
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