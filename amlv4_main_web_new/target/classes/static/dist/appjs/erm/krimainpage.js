/*Data Tables Declarations*/
$(function() {
	$("#krilisttable").DataTable({
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
		'#krilisttable_wrapper .col-md-6:eq(0)');

});
$('#searchcriteria').keypress(function(e) {
	if (e.which == 13) return false;
	if (e.which == 13) e.preventDefault();
});

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();

	$.validator.setDefaults({
		submitHandler: function() {
			toastr.success('Details submitted sucessfully...')
			$('#editmodal').modal('hide');
		}
	});

	$(document).ready(function() {
		var message = $('#message').val();
		if (message != "") {
			toastr.success(message);
		}
		//$(".kriBody").on("click", "a.fa-tools", function() {
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

})
/*Loader*/
document.onreadystatechange = function() {
	document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

/*View KRI Modal*/
//$('a.kriModalView')
//	.click(
//		function() {

$(".kriBody").on("click", "a.kriModalView", function() {
	var kriId = $(this).attr('id');
	var value = "{\"kriId\":" + "\"" + kriId
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
	//console.log(pageValJson);
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$.ajax({
		url: 'viewKriModal',
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

			$('#parameterId').val(obj.kriId);
			$('#recordstatus').val(obj.kriRecordStatus);
			$('#kriName').val(obj.kriName);
			$('#kriBenchmark').val(obj.kriBenchmark);
			$('#kriDataType').val(obj.kriDataType);
			$('#thresholddescription').val(obj.kriThresholdDescription);
			$('#datasourcedef').val(obj.kriDataSource);
			$('#frequency').val(obj.kriUpdateFrequency);
			$('#kriFormula').val(obj.kriFormula);
			$('#deptThresholdDetails tr:gt(0)').remove();

			if (obj.mdmDtoList.length > 0) {
				obj.mdmDtoList.forEach(function(mdmItem) {
					var mdtValue = "";
					mdmItem.mdtDtoList.forEach(function(mdtItem) {
						mdtValue += '<td><span class="text-capitalize text-bold" style="white-space:pre;color:' + mdtItem.bgClass + ';">' + mdtItem.deptThresholdType + '</span></td><td>' + mdtItem.asstTypeDesc + '</td><td>' + mdtItem.deptThresholdValue + '</td></tr>';
					});
					//console.log(mdtValue);
					$('#deptThresholdDetails tr:last')
						.after(
							'<tr><td class="text-uppercase text-bold" rowspan="' + mdmItem.mdtDtoList.length + '">'
							+ mdmItem.deptName.toLowerCase()
							+ '</td>'
							+ '<td rowspan="' + mdmItem.mdtDtoList.length + '">'
							+ mdmItem.remarks
							+ '</td>'
							+ '<td rowspan="' + mdmItem.mdtDtoList.length + '">' + mdmItem.kriAsstPeriod + '</td>'
							+ '<td rowspan="' + mdmItem.mdtDtoList.length + '">' + mdmItem.kriAsstValue + '</td>'
							+ '<td rowspan="' + mdmItem.mdtDtoList.length + '" class="text-bold text-capitalize"style="white-space:pre;color:' + mdmItem.kriAsstColor + ';">' + mdmItem.kriAsstStatus + '</td>'
							+ mdtValue + '<tr>');
				});

				$('#modalDeptThresDiv').show();

			}

			$('#modalFileId tr:gt(0)').remove();
			if (obj.filedetailsList.length > 0) {
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

			$('#kriModal')
				.modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.success('Some Error Occured');
		}
	});

});
/*View KRI Modal End*/

/*Edit KRI*/
/*$(".editKri").click(
	function() {*/
$(".kriBody").on("click", "a.editKri", function() {
	console.log("in edit");
	var kriId = $(this).attr('id');
	var pageValJson = "{\"kriId\":" + "\"" + kriId
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
	$("#editKriForm").submit();
});
/*Edit KRI End*/

/*Close Kri*/
$(".kriBody").on("click", "a.closemodal", function() {
	$('#stmtId').text($(this).attr('id'));
	$('#closemodal').modal('show');
});

/*Close Kri End*/

$("#closeKri")
	.click(
		function() {
			var stmtId = $("#stmtId").html();
			var reason = $('#reason').val();
			reason = reason.replace(/[\t\n]+/g, ' ');
			var actionName = $(this).attr("name");
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
				var pageValJson = "{\"kriId\":" + "\"" + stmtId
					+ "\",\"kriActionStatus\":\"" + action + "\","
					+ " \"actionName\":\"" + actionName + "\",\n"
					+ "\"commentDto\":{\"comment\":\""
					+ reason + "\"}}";
				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), pageValJson);
				$("#encryptedJsonClose").val(
					ciphertext + ':~:' + passphrase);
				$("#closeKriForm").submit();
			}
		});


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
		if (searchParam == 'kriRecordStatus') {
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
function statusCode(code) {
	switch (code) {
		case "O": return '<span class="badge bg-success">Open</span>';
		case "E": return '<span class="badge bg-info">Edited</span>';
		case "D": return '<span class="badge bg-purple">Created</span>';
		case "X": return '<span class="badge bg-danger">Deleted</span>';
		case "C": return '<span class="badge bg-danger">Close</span>';
		default: return code;
	}
}
function updateFreq(freq) {
	switch (freq) {
		case "D": return '<span >Daily</span>';
		case "W": return '<span >Weekly</span>';
		case "F": return '<span >Fortnightly</span>';
		case "M": return '<span >Monthly</span>';
		case "Q": return '<span >Quarterly</span>';
		case "H": return '<span >Half Yearly</span>';
		case "Y": return '<span >Yearly</span>';
		default: return code;
	}
}
//Search Ajax
$("#search")
	.click(
		function() {
			var searchParam = $('#dimension').find(":selected").val().replace(
				/(\r\n|\n|\r)/gm, "");
			var searchValue = $('#searchcriteria').val().trim().toUpperCase().replace(
				/(\r\n|\n|\r)/gm, "");
			if (searchParam == '') {
				toastr.info('Please Select Search Parameter For Search');
			} else if (searchValue == '') {
				toastr.info('Please Add Some Value For Search');
			} else {
				if (searchParam == 'kriRecordStatus') {
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
				var pageValJson = "{\"searchParam\":" + "\"" + searchParam + "\",\"searchValue\":\"" + searchValue + "\"}";
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
					.toString(CryptoJS.enc.Hex);
				var aesUtil = new AesUtil(keySize, iterationCount);
				var ciphertext = aesUtil.encrypt(reverseText(passphrase),
					pageValJson);
				var pageValJson = ciphertext + ':~:' + passphrase;
				document.getElementById('load').style.visibility = "visible";
				// ajax call
				$
					.ajax({
						url: 'searchKriList',
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
							//
							var $tr = $('.kriData').closest('tr');
							if ($tr.attr('class') == 'kriData') {
								$tr.nextUntil('tr[class=itemRow]').andSelf().remove();
							}
							//$('#krilisttable tr:gt(0)').remove();
							$('#krilisttable').dataTable()
								.fnClearTable();
							$('#krilisttable').DataTable()
								.destroy();
							obj.kriList
								.forEach(function(item) {
									var statusTd = statusCode(item.kriRecordStatus);
									if (item.kriRecordStatus == 'O' && (obj.btnList.indexOf('edit') >= 0)) {
										var editTd = '<span><a class="btn btn-sm bg-purple editKri" id="' + item.kriId + '" href="#" title="Edit"> <i class="fa fa-edit fa-1x text-black"></i></a></span>';
									} else {
										var editTd = '<span><a class="btn btn-sm bg-purple disabled" id="' + item.kriId + '" href="#" title="Edit"> <i class="fa fa-edit fa-1x text-black"></i></a></span>';
									}
									if (item.kriRecordStatus == 'O') {
										var closeTd = '<span><a class="btn btn-sm bg-navy closemodal" href="#" id="' + item.kriId + '" title="Close KRI"> <i class="fas fa-times-circle"></i></a></span>';
										var actionTd = '<span><a class="btn btn-sm bg-green fetchActionPlan" id="' + item.kriId + '" href="#" title="Action Plan"> <i class="fas fa-tools fa-1x text-white"></i></a></span>';
									} else {
										var actionTd = '<span><a class="btn btn-sm bg-green disabled" href="#" title="Action Plan"> <i class="fas fa-tools fa-1x text-white"></i></a></span>';
										var closeTd = '<span><a class="btn btn-sm bg-navy disabled" href="#" title="Close KRI"> <i class="fas fa-times-circle"></i></a></span>';
									}
									$(
										'#krilisttable tbody')
										.append(
											'<tr><td> <a class="text-blue kriModalView" data-toggle="modal" href="#" '
											+ 'id="' + item.kriId + '"  >' + item.kriId
											+ '</a></td>'
											+ '<td>'
											+ item.kriName
											+ '</td>'
											+ '<td>'
											+ statusTd
											+ '</td>'
											+ '<td class="text-capitalize">'
											+ updateFreq(item.kriUpdateFrequency)
											+ '</td>'
											+ '<td class="project-actions text-center" >'
											+ editTd
											+ '</td>'
											+ '<td class="project-actions text-center">'
											+ actionTd
											+ '</td>'
											+ '<td class="project-actions text-center">'
											+ '<span><a class="btn btn-sm bg-maroon viewAuditTrail" href="#" id="' + item.kriId + '" title="Audit Trail"><i class="fab fa-twitch"></i>'
											+ '</td>'
											+ '<td class="project-actions text-center">'
											+ closeTd
											+ '</td></tr>');
								});
							$("#krilisttable").DataTable({
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
								'#krilisttable_wrapper .col-md-6:eq(0)');
						},
						error: function(xhr, status, error) {
							toastr
								.success('Some Error Occured');
						}
					});
			}
		});

/**
 * Audit Trail on Main Page
 */
/*$('a.viewAuditTrail')
	.click(
		function() {*/
$(".kriBody").on("click", "a.viewAuditTrail", function() {
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
// Fetch Action Plan Ajax Started
/*$('a.fetchActionPlan')
	.click(
		function() {*/
$(".kriBody").on("click", "a.fetchActionPlan", function() {
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
				setTimeout(
					function() {
						document
							.getElementById('interactive');
						document
							.getElementById('load').style.visibility = "hidden";
					}, 1000);
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
						if (items.actionPlanId)
							$(
								"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.actionPlanId
								+ "</td><td><span class='text-capitalize'>"
								+ items.actionPlanName
								+ "</span></td><td><span class='text-capitalize'>"
								+ items.actionOwner
								+ "</span></td><td><span class='badge bg-success'>"
								+ items.actionStatus
								+ "</span></td><td><span class='text-capitalize'>"
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
				console.log(xhr);
				toastr
					.error('Some Error Occured');
			}
		});
	$('#actionplanlink').css('class', 'border');
	$('#actionplanlink').css('display', '');
	$('#actionplanlink').click();
});


$('#unlinkmodal').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('.actionPlanLinkId').attr('value', recipient);
})

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

$("#createActionPlanBtn").click(function() {

	$("#createAPForm").submit();
});
$("#mainActionPlanBtn").click(function() {

	$("#linkAPForm").submit();
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
	$("#encryptedJsonFile").val(ciphertext + ':~:' + passphrase);
	$('#fileForm').attr("method", "post");
	$('#fileForm').attr("action", "fileDownload");
	$('#fileForm').submit();
});
