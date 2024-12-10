/**
 * toprisk.mainpage.js
 */
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
})
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

$('#searchcriteria').keypress(function(e) {
	if (e.which == 13) return false;
	if (e.which == 13) e.preventDefault();
});

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

	$("a .fa-tools").click(function() {
		$('#actionplanlink').css('class', 'border');
		$('#actionplanlink').css('display', '');
		$('#actionplanlink').click();
	});
	$("#summarylink").click(function() {
		$('#actionplanlink').css('display', 'none');
		$('#timelinelink').css('display', 'none');
	});

	$("#actionplanlink").click(function() {
		$('#timelinelink').css('display', 'none');
	});

});
$("#today").text(moment(new Date()).format('DD/MM/YYYY'));

/*Data Tables Declarations*/
$(function() {
	$("#toprisktable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [4, 5, 6, 7]
		}],
		"order": [0, "desc"],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
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
/*Edit Top Risk*/

$(".editTopRisk").click(
	function() {
		var topRiskId = $(this).attr('id');
		var pageValJson = "{\"topRiskId\":" + "\"" + topRiskId
			+ "\"}";
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJsonEdit")
			.val(ciphertext + ':~:' + passphrase);
		$("#editTopRiskForm").submit();
	});
/*Edit Top Risk End*/
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
		if (searchParam == 'topRiskRecordStatus') {
			if (searchValue.includes('CREATE')) {
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
		//var sortValue = $('#sorting').find(":selected").val();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam
			+ "\",\"searchValue\":\"" + searchValue + "\"}";
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

$("#closeTopRisk")
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
				var pageValJson = "{\"topRiskId\":" + "\""
					+ stmtId
					+ "\",\"actionName\":\"" + actionName
					+ "\",\"topRiskActionStatus\":\""
					+ action
					+ "\",\"commentDto\":{\"comment\":\""
					+ reason + "\"}}";
				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), pageValJson);
				$("#encryptedJsonClose").val(
					ciphertext + ':~:' + passphrase);
				$("#clsTopRiskForm").submit();
			}
		});
/*Close method End*/
/*View Top Risk Modal*/
$('a.viewTopModal')
	.click(
		function() {
			var topRiskId = $(this).attr('id');
			$('#paramId').val(topRiskId);
			var toleranceValue;
			var value = "{\"topRiskId\":" + "\"" + topRiskId
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
			$
				.ajax({
					url: 'viewTopRisk',
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
									.getElementById('load').style.visibility = "hidden";
							}, 1000);
						var jsonResponse = JSON
							.stringify(response);
						var obj = JSON.parse(jsonResponse);
						$('#recordstatus').val(
							obj.topRiskRecordStatus);
						$('#theme').val(obj.topRiskTheme);
						$('#desc').val(
							obj.topRiskDescription);
						$('#assessmentPeriod').val(
							obj.asstPeriod);
						$('#assessmentStatus').val(
							obj.asstStatus);
						$('#assessmentStatus').css('color', obj.asstColor);
						$('#modalDeptDiv').empty();
						obj.deptMasterList
							.forEach(function(item) {
								var trDiv = "";
								item.topRiskKriList
									.forEach(function(
										listItems) {
										var kriId = listItems.kriId;
										var kriName = listItems.kriName;
										var kriWt = listItems.kriWeightage;
										var threshold = "";
										listItems.mdtlist
											.forEach(function(
												items) {
												threshold = threshold
													+ '<tr><td><span style="white-space:pre; color:'
													+ items.bgClass
													+ ';" class="text-capitalize text-bold">'
													+ items.deptThresholdType.toLowerCase()
													+ '</span></td><td>'
													+ items.asstTypeDesc
													+ '</td><td>'
													+ items.deptThresholdValue
													+ '</td></tr>';
											});
										var thresholdTab = '<table>'
											+ threshold
											+ '</table>';
										trDiv = trDiv
											+ ('<tr class="mainTab" id="tr' + kriId + '"><td>'
												+ kriId
												+ '</td><td> '
												+ kriName
												+ '</td><td>'
												+ thresholdTab
												+ '</td><td>'
												+ kriWt + '</td></tr>');

									});
								$('#modalDeptDiv')
									.prepend(
										$('<div class="row"><div class="card card-primary card-outline col-12">'
											+ '<div class="card-header table-responsive">'
											+ '	<div class="card-title text-capitalize text-bold row col-sm-12"> <div class="col-sm-6">'
											+ item.deptName
											+ '</div>'
											+ '	<div class="text-capitalize text-bold col-sm-6"  >Assessment Status - <label style="color:' + item.kriAsstColor + '">'
											+ item.kriAsstStatus
											+ '</label></div></div>'
											+ '</div>'
											+ '	<div class="card-body table-responsive">'
											+ '		<table class="table centraloffice table-head-fixed table-bordered table-striped">'
											+ '	<thead><tr>'
											+ '		<th>KRI ID</th>'
											+ '			<th>KRI Name</th>'
											+ '			<th>Threshold</th>'
											+ '			<th>KRI Weight</th>'
											+ '	</tr></thead>'
											+ '	<tbody>'
											+ '	</tbody>'
											+ trDiv
											+ '	</table>'
											+ '	</div>'
											+ '</div>'
											+ '</div>'));

							});
						var fileFlg = true;
						obj.filedetails
							.forEach(function(item) {
								fileFlg = false;
								$(
									'#filedetails tr:last')
									.after(
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
							$('#filedetails tr')
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
							$('#filedetails').show();
						}
						$('#viewTopRiskmodal')
							.modal('show');
					},
					error: function(xhr, status, error) {
						toastr
							.success('Some Error Occured');
					}
				});

		});
/*View Top Risk Modal End*/