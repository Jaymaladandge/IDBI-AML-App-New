$(function() {
	$("#riskstmttable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [5, 6]
		}],
		"order": [0, "desc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": true,
		"searching": true,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#riskstmttable_wrapper .col-md-6:eq(0)');

});

$(function() {
	$("#actionplantable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [7]
		}],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#actionplantable_wrapper .col-md-12:eq(0)');
});

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
})

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

//Button Click
$(document).ready(function() {
	var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}

	$("a .fa-tools").click(function() {
		$('#actionplanlink').css('class', 'border');
		$('#actionplanlink').css('display', '');
		$('#actionplanlink').click();
	});

	$("a .fa-twitch").click(function() {
		$('#timelinelink').css('class', 'border');
		$('#timelinelink').css('display', '');
		$('#timelinelink').click();
	});

	$("#summarylink").click(function() {
		$('#actionplanlink').css('display', 'none');
		$('#timelinelink').css('display', 'none');
	});

	$("#actionplanlink").click(function() {
		$('#timelinelink').css('display', 'none');
	});

});


//edit RA
$(".editRa").click(
	function() {
		var raStmtId = $(this).attr('id');
		var pageValJson = "{\"menuId\":" + "\"" + raStmtId
			+ "\"}";

		document.getElementById('load').style.visibility = "visible";
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
		$("#editRaForm").submit();
	});

//search method
function searchData() {
	var searchParam = $('#dimension').find(":selected").val();
	var searchValue = $('#searchcriteria').val().toUpperCase();
	if (searchParam == '') {
		toastr.info('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.info('Please Add Some Value For Search');
	} else {
		if (searchParam == 'raRecordStatus') {
			if (searchValue.includes('PENDING APPROVAL')) {
				searchValue = 'D';
			} else {
				searchValue = searchValue.charAt(0);
			}
		}
		var sortValue = $('#sorting').find(":selected").val();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam
			+ "\",\"searchValue\":\"" + searchValue
			+ "\",\"sortValue\":\"" + reason + "\"}";
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
// Validating the form before submit
$("#closeRa")
	.click(
		function() {
			var stmtId = $("#stmtId").html();
			var reason = $('#reason').val();
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
				var pageValJson = "{\"raStmtId\":" + "\""
					+ stmtId + "\",\"raActionStatus\":\""
					+ action
					+ "\",\"commentDto\":{\"comment\":\""
					+ reason + "\"}}";
				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), pageValJson);
				$("#encryptedJsonClose").val(
					ciphertext + ':~:' + passphrase);
				$("#raForm").submit();
			}
		});



$('a.closemodal').click(function() {
	$('#stmtId').text($(this).attr('id'));
	$('#closemodal').modal('show');
});
$('a.viewRaModal')
	.click(
		function() {
			var menuId = $(this).attr('id');

			var pageValJson = "{\"menuId\":" + "\""
				+ menuId + "\"}";


			document.getElementById('load').style.visibility = "visible";
			// ajax call
			$
				.ajax({
					url: 'viewMenuModel',
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

						console.log(obj);

						$('#menuId').val(obj.menuId);
						$('#recordstatus').val(obj.menuRecordStatus);
						$('#menuName').val(obj.menuName);
						$('#menuOrder').val(obj.menuOrder);
						$('#menuType').val(obj.menuType);
						$('#moduleName').val(obj.moduleName);

						//						$('#capturetbl').DataTable().clear().draw();
						//						$('#capturetbl').dataTable().fnClearTable();
						//						$('#capturetbl').DataTable().destroy();


						$('#capturetbl tr:gt(0)').remove();


						if (obj.subMenus != null
							&& obj.subMenus.length > 0) {
							obj.subMenus
								.forEach(function(item) {
									//subMenuType
									$(
										'#capturetbl tr:last')
										.after(
											'<tr><td class="text-capitalize">'
											+ item.subMenuName
											+ '</td><td>'
											+ item.subMenuStatus
											+ '</td><td class="text-capitalize">'
											+ item.subMenuType
											+ '</td><td>'
											+ item.subMenuPath
											+ '</td>'
											+ '<td class="text-capitalize">'
											+ item.subMenuOrder
											+ '</td>'
											+ '</tr>');
								});
							var seen = {};
							$('#capturetbl tr')
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
						}

						var rowCount = $('#capturetbl tr').length;
						if (rowCount == 1) {
							$('#menuDiv').hide();
						} else {
							$('#menuDiv').show();
						}

						$('#modalFileId tr:gt(0)').remove();
						if (obj.filedetailsList != null
							&& obj.filedetailsList.length > 0) {
							obj.filedetailsList
								.forEach(function(item) {
									$(
										'#modalFileId tr:last')
										.after(
											'<tr><td>'
											+ item.fileName
											+ '</td><td>'
											+ item.fileSize
											+ '</td><td class="text-capitalize">'
											+ item.uploadedBy
											+ '</td><td>'
											+ item.uploadTimestamp
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



						$('#riskmodal').modal('show');
					},
					error: function(xhr, status, error) {
						toastr
							.success('Some Error Occured');
					}
				});
		});


// Audit trail   
$('a.viewAuditTrail')
	.click(
		function() {
			var userId = $(this).attr('id');
			var pageValJson = "{\"activityImpactTblKey\":"
				+ "\"" + userId + "\"}";
			document.getElementById('load').style.visibility = "visible";

			$("#auditLabelId").text(userId);

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
						obj
							.forEach(function(items) {
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


						$(
							"<div> <i class='far fa-clock bg-gray'></i> </div>")
							.appendTo(
								".timeline-inverse");
						$('#timelinelink').css('class',
							'border');
						$('#timelinelink').css('display',
							'');
						$('#timelinelink').click();

						console.log(obj);

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