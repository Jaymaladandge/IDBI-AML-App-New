/*loader*/
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

	var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}

	$("a .fa-twitch").click(function() {
		$('#timelinelink').css('class', 'border');
		$('#timelinelink').css('display', '');
		$('#timelinelink').click();
	});
	$("#summarylink").click(function() {
		$('#timelinelink').css('display', 'none');
	});
});
$("#today").text(moment(new Date()).format('DD/MM/YYYY'));
/*loader*/

/*Data Tables Declarations*/
$(function() {
	$("#benchmarktable").DataTable({
		"columnDefs": [{
			orderable: true,
			targets: [6, 7, 8]
		}],
		"responsive": false,
		"autoWidth": true,
		"searching": true,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#toprisktable_wrapper .col-md-6:eq(0)');

	$("#audittrailTab").DataTable({
		"responsive": true,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		},
	}).buttons().container().appendTo(
		'#audittrailTab_wrapper .col-md-6:eq(0)');
});
/*Data Tables Declarations End*/

/*Edit Benchmark*/
$(".editBm").click(function() {
	var bmId = $(this).attr('id');
	var pageValJson = "{\"bmId\":" + "\"" + bmId + "\"}";
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase), pageValJson);
	$("#encryptedJsonEdit").val(ciphertext + ':~:' + passphrase);
	$("#editBenchmarkForm").submit();
});
/*Edit Benchmark End*/

/*Search method*/
function searchData() {
	var searchParam = $('#dimension').find(":selected").val().replace(
		/(\r\n|\n|\r)/gm, "");
	var searchValue = $('#searchcriteria').val().toUpperCase().replace(
		/(\r\n|\n|\r)/gm, "");
	if (searchParam == '') {
		toastr.info('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.info('Please Add Some Value For Search');
	} else {
		if (searchParam == 'bmRecordStatus') {
			if (searchValue.includes('PENDING APPROVAL')) {
				searchValue = 'D';
			} else {
				searchValue = searchValue.charAt(0);
				if (searchValue == 'D') {
					searchValue = 'X';
				} else if (searchValue == 'P') {
					searchValue = 'D';
				}
			}
		}
		var sortValue = $('#sorting').find(":selected").val();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam
			+ "\",\"searchValue\":\"" + searchValue
			+ "\",\"sortValue\":\"" + sortValue + "\"}";
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$("#searchForm").submit();
	}
}
$('#searchcriteria').keypress(function(event) {
	if (event.keyCode === 10 || event.keyCode === 13) {
		event.preventDefault();
	}
});
/*Search method End*/

/*Close method*/
$('a.closemodal').click(function() {
	$('#stmtId').text($(this).attr('id'));
	$('#closemodal').modal('show');
});
$("#closeBenchmark")
	.click(
		function() {
			var stmtId = $("#stmtId").html();
			var actionName = $(this).attr("name");

			var reason = $('#reason').val();
			reason = reason.replace(/[\t\n]+/g, ' ');
			var action = "XQ";
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
				$('span[id^="reason-error"]').remove();
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(
					128 / 8).toString(CryptoJS.enc.Hex);
				var aesUtil = new AesUtil(keySize,
					iterationCount);
				var pageValJson = "{\"bmId\":" + "\""
					+ stmtId
					+ "\",\"bmActionName\":\"" + actionName
					+ "\",\"bmActionStatus\":\""
					+ action
					+ "\",\"commentDto\":{\"comment\":\""
					+ reason + "\"}}";


				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), pageValJson);
				$("#encryptedJsonClose").val(
					ciphertext + ':~:' + passphrase);
				$("#clsbenchmarkForm").submit();
			}
		});
/*Close method End*/

/*View Benchmark Modal*/
$('a.viewBenchmark').click(function() {
	var bmId = $(this).attr('id');
	$('#paramId').val(bmId);
	var value = "{\"bmId\":" + "\"" + bmId
		+ "\"}";
	var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), value);
	var pageValJson = ciphertext + ':~:' + passphrase;
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$.ajax({
		url: 'viewBenchmark',
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
		success: function(response) {
			setTimeout(function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);

			$('#recordStatus').val(obj.bmRecordStatus);
			$('#bmNameM').val(obj.bmName);
			$('#bmDescriptionM').val(obj.bmDescription);
			$('#bmApplicableOfficeM').val(obj.applicableOffice);
			$('#bmDatatypeM').val(obj.bmDatatype);
			$('#bmValueM').val(obj.bmValue);
			$('#bmAssessmentPeriodM').val(obj.bmAssessmentPeriod);

			//const ofc = obj.applicableOffice.split(",");
			const ofc = obj.applicableOffice;
			Object.keys(ofc).forEach(function(key) {

				$("<input  class='form-check-input' type='checkbox' name='applicableOffice' checked=true disabled/>"
					+ "<label class='font-weight-normal'>"
					+ ofc[key]
					+ "&nbsp;</label><br/>").appendTo(".ofcName");

			});


			var fileFlg = true;
			obj.filedetails.forEach(function(item) {
				fileFlg = false;
				$('#filedetails tr:last').after(
					'<tr><td>'
					+ item.fileName
					+ '</td>'
					+ '<td>'
					+ item.fileSize
					+ '</td>'
					+ '<td>'
					+ item.uploadTimestamp
					+ '</td>'
					+ '<td class="text-capitalize">'
					+ item.uploadedBy
					+ '</td>'
					+ '<td><a name=' + item.fileName + ' href="#"'
					+ ' class="btn btn-info downloadfile"><i'
					+ ' class="fas fa-download"></i></a></td></tr>');
			});
			if (fileFlg) {
				$('#filedetails').hide();
			} else {
				var seen = {};
				$('#filedetails tr').each(function() {
					var txt = $(
						this)
						.text();
					if (seen[txt])
						$(this)
							.remove();
					else
						seen[txt] = true;
				});
				$('#filedetails').show();
			}
			$('#viewBenchmarkmodal').modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.success('Some Error Occured');
		}
	});
});
/*View Benchmark Modal*/

/*Audit trail*/
$('a.viewAuditTrail').click(function() {
	var bmId = $(this).attr('id');
	var pageValJson = "{\"activityImpactTblKey\":"
		+ "\"" + bmId + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$("#auditLabelId").text(bmId);
	// ajax call
	$.ajax({
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
			setTimeout(function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
				document.getElementById('contents').style.visibility = "visible";
			}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			$(".timeline-inverse").empty();
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
			console.log(obj);
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr.success('Some Error Occured');
		}
	});
});
	/*Audit trail*/























