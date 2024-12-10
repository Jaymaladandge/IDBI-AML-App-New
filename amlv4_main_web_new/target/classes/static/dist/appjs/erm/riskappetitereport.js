$(function() {
	$("#riskstmttable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [8, 9]
		}],
		"order": [0, "desc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"buttons": ["csv", "excel", "pdf", "print"],
		"language": {
			"emptyTable": "No Data Available"
		},

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

//loader
document.onreadystatechange = function() {
	alert("LOAD");
	var state = document.readyState
	if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
}

//Button Click
$(document).ready(function() {

	alert("LOAD 2");
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

	//download
	$(document).on('click', '.downloadfile', function() {

		var fileName = $(this).attr('name');
		var pageValJson = "{\"fileName\":" + "\"" + fileName + "\"}";

		// ajax call
		$.ajax({
			url: 'download',
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

				var blob = new Blob([response], {
					type: "application/octetstream"
				});

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
				toastr.success('Some Error Occured');
			}
		});
	});

});


$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
})
$('a.closemodal').click(function() {
	$('#stmtId').text($(this).attr('id'));
	$('#closemodal').modal('show');
});
$('a.viewRaModal')
	.click(
		function() {
			var raStmtId = $(this).attr('id');
			var toleranceValue;
			var pageValJson = "{\"raStmtId\":" + "\""
				+ raStmtId + "\"}";
			document.getElementById('load').style.visibility = "visible";
			// ajax call
			$
				.ajax({
					url: 'viewRaModal',
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
						$('#parameterId').val(obj.raStmtId);
						$('#recordstatus').val(
							obj.raRecordStatus);
						$('#riskcate').val(obj.raRiskCate);
						$('#risksubcate')
							.val(obj.raSubCate);
						$('#riskstmtname').val(
							obj.raStmtName);
						$('#riskdescription').val(
							obj.raStmtDescription);
						$('#datapoints').val(
							obj.raStmtDataPts);
						$('#datatype')
							.val(
								obj.raToleranceValueDatatype);
						$('#datadept').val(
							obj.raResponsibleDept);
						$('#datapdept').val(
							obj.raDeptProvidingData);
						$('#capturedept').val(
							obj.raCaptureValueDept);

						$('#frequency')
							.val(
								obj.raCaptureValueFrequency);
						$('#criteria').val(
							obj.raAssessmentCriteria);
						$('#threshold').val(
							obj.raToleranceThreshold);
						$('#capturetbl tr:gt(0)').remove();
						if (obj.mvcDtoList != null
							&& obj.mvcDtoList.length > 0) {
							obj.mvcDtoList
								.forEach(function(item) {
									if (item.assessmentStatus == 'Above Tolerance') {
										tolerance = '<td><span class="badge bg-danger">Above Tolerance</span></td>';
									} else if (item.assessmentStatus == 'Within Tolerance') {
										tolerance = '<td><span class="badge bg-success">Within Tolerance</span></td>';
									}
									$(
										'#capturetbl tr:last')
										.after(
											'<tr><td class="text-capitalize">'
											+ item.deptName
											+ '</td><td>'
											+ item.toleranceValue
											+ '</td><td>'
											+ item.assessmentValue
											+ '</td>'
											+ tolerance
											+ '<td class="text-capitalize">'
											+ item.captureUserName
											+ '</td><td>'
											+ moment(
												item.captureTime)
												.format(
													'DD/MM/YYYY')
											+ '</td></tr>');
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
							$('#asrDiv').hide();
						} else {
							$('#asrDiv').show();
						}
						$('#modalFileId tr:gt(0)').remove();
						if (obj.filedetails.length > 0) {
							obj.filedetails
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

//edit RA
$(".editRa").click(
	function() {
		var raStmtId = $(this).attr('id');
		var pageValJson = "{\"raStmtId\":" + "\"" + raStmtId
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
			var actionName = $(this).attr("name");
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
					+ "\","
					+ "    \"raActionName\":\"" + actionName + "\",\n"
					+ "  \"commentDto\":{\"comment\":\""
					+ reason + "\"}}";
				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), pageValJson);
				$("#encryptedJsonClose").val(
					ciphertext + ':~:' + passphrase);
				$("#raForm").submit();
			}
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
						document
							.getElementById('interactive');
						document
							.getElementById('load').style.visibility = "hidden";

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
						toastr
							.success('Some Error Occured');
					}
				});
		});

// Fetch Action Plan Ajax Started
$('a.fetchActionPlan')
	.click(
		function() {
			var moduleId = $(this).attr('id');
			var pageValJson = "{\"moduleId\":" + "\""
				+ moduleId + "\"}";

			$("#actionLabelId").text(moduleId);

			$("#sourceId").val(moduleId);
			$("#moduleId").val(moduleId);

			document.getElementById('load').style.visibility = "visible";

			var userRole = $("#userRole").val();
			var rowCount = 0;

			rowCount = $('#actionplantable tr').length;

			if (rowCount > 1) {

				var i = 1;
				while (i < rowCount) {
					$('#row_id').remove();
					i++;
				}

			}

			// ajax call
			$
				.ajax({
					url: 'fetchActionPlan',
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
						document
							.getElementById('interactive');
						document
							.getElementById('load').style.visibility = "hidden";

						var jsonResponse = JSON
							.stringify(response);
						obj = JSON.parse(jsonResponse);

						$('#actionplantable').dataTable()
							.fnClearTable();
						$('#actionplantable').DataTable()
							.destroy();

						var NewRowsCount = 0;

						obj
							.forEach(function(items) {

								//$('#actionplantable tr:last').after(

								if (items.actionPlanId)
									$(
										"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
										+ items.actionPlanId
										+ "</td><td><span class='textCapitalize'>"
										+ items.actionPlanName
										+ "</span></td><td><span class='textCapitalize'>"
										+ items.actionOwner
										+ "</span></td><td><span class='badge bg-success'>"
										+ items.actionStatus
										+ "</span></td><td><span class='textCapitalize'>"
										+ items.actionComFreq
										+ "</span></td><td>"
										+ items.actionComPer
										+ "</td><td>"
										+ items.comDate
										+ "</td><td class='project-actions text-center'><span><a class='btn btn-sm bg-orange unlinkbtn' id='unlinkid' href='#' data-toggle='modal' data-target='#unlinkmodal'"
										+ "data-whatever=' "
										+ items.actionLinkId
										+ " ' "
										+ "title='Unlink'> <i "
										+ "class='fas fa-unlink text-white'></i></a>"
										+ "	</span></td>"
										+ "</tr>")
										.appendTo(
											".actPlanBody");

							});

						if (userRole != "Risk Owner") {
							$(".unlinkbtn").addClass(
								"disabled");
						}

						$("#actionplantable")
							.DataTable({
								"columnDefs": [{
									orderable: false,
									targets: [7]
								}],
								"responsive": false,
								"autoWidth": true,
								"searching": false,
								"fixedHeader": true
							})
							.buttons()
							.container()
							.appendTo(
								'#actionplantable_wrapper .col-md-12:eq(0)');

						//.clear().rows.add()
						$('#actionplantable').DataTable()
							.draw();

					},
					error: function(xhr, status, error) {
						toastr
							.success('Some Error Occured');
					}
				});
		});

$('#unlinkmodal').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('.actionPlanLinkId').attr('value', recipient);
});
// unlink code
$("#unlinkForm")
	.click(
		function(e) {

			var reason = $("#UnLinkReason").val();

			if (reason == '') {
				$('span[id^="reason-error"]').remove();
				$('#UnLinkReason').addClass('is-invalid');
				$('#UnLinkReason')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
				e.preventDefault();
			} else if (reason.length < 10) {
				$('span[id^="reason-error"]').remove();
				$('#UnLinkReason').addClass('is-invalid');
				$('#UnLinkReason')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
				e.preventDefault();
			} else {
				$('span[id^="reason-error"]').remove();

				var pageValJson = "{\"actionLinkId\": \""
					+ $("#actionPlanLinkId").val().trim()
					+ "\",\n" + "   \"commentDto\": {\n"
					+ "      \"comment\": \""
					+ $("#UnLinkReason").val() + "\"}}";

				var ciphertext = null;
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(
					128 / 8).toString(CryptoJS.enc.Hex);
				var aesUtil = new AesUtil(keySize,
					iterationCount);
				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), pageValJson);
				$("#encryptedJsonReason").val(
					ciphertext + ':~:' + passphrase);
				toastr
					.success('Action Plan Delinked Successfully');
				$("#formUnlink").submit();

			}
		});
	
