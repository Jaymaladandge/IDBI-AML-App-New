$(document).ready(function() {
	$(".anchor-link").on("click", function() {
		$(this).addClass("active");
		$(this).siblings().removeClass("active");
		var href = $("a", this).attr('href');
		$(href).html("You clicked " + href + " !");
	});
	$("#createdate").val(moment(new Date()).format('DD/MM/YYYY'));

});
// BS-Stepper Init
$(document).ready(function() {
	var stepper = new Stepper($('.bs-stepper')[0])
})
// BS-Stepper Init
document.addEventListener('DOMContentLoaded', function() {
	window.stepper = new Stepper(document.querySelector('.bs-stepper'))
})

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
$('#department')
	.on(
		'change',
		function(e) {
			var optionSelected = $("option:selected", this);
			var valueSelected = this.value;
			var valueSelectedName = $(
				"#department option:selected").text()
				.toLowerCase();
			var id;
			var kriFlg = addDepartment(valueSelected,
				valueSelectedName);
			if (kriFlg) {
				$('span[id^="department-error"]').remove();
				$('option:selected', this).remove();
				$('#departTable tr:last')
					.after(
						'<tr id="tr' + valueSelected + '" class="text-capitalize"><td id="' + valueSelected + '"> '
						+ valueSelectedName
						+ '</td><td ><div class="form-group"><input type="number" '
						+ 'name="'
						+ valueSelected
						+ '" class="form-control form-control-sm weight" '
						+ 'id="'
						+ valueSelected
						+ '" min="0" max="100" onblur="updateCummWt(\'weight\',\'cummWt\',\'wt\');"></div></td>'
						+ '<td class="project-actions text-center"><a '
						+ 'class="btn btn-danger btn-sm" title="Remove" id="'
						+ valueSelected
						+ '" onclick="removeTr(\''
						+ valueSelected
						+ '\',\''
						+ valueSelectedName
						+ '\');"> <i class="fas fa-window-close"> </i></a></td> </tr>');
				updateCummWt('weight', 'cummWt', 'wt');
			} else {
				toastr
					.warning('No Kri Linked To Selected Department');
			}

		});

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
})
var max_chars = 3;
function removeTr(id, Name) {
	$('#tr' + id).remove();
	$('#div' + id).remove();
	$('#cummWt').text('0');
	$('#department').append(
		'<option value="' + id + '">' + Name + ' </option>');
}
function removeTag(id, deptId) {

	$('#tr' + id + deptId).remove();
	updateCummWt(deptId);
}
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
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

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);

})
function validateForm(actionName) {
	var flg = true;
	var desc = $('#topRiskDescription').val();
	if (desc == '') {
		toastr.error('Please Add Proper Top Risk Description');
		flg = false;
	}
	/* var comments = $('#comments').val().replace(/[\t\n]+/g, ' ');
	if (comments == '') {
		toastr.error('Please Add Your Comments');
		flg = false;
	} */
	var tabList = [];
	$('.deptclass table').each(function() {
		if (this.id != '')
			tabList.push(this.id);
	});
	tabList
		.forEach(function(item) {
			if ($('#' + item + ' tr').length == 2) {
				flg = false;
				toastr
					.error('Please Add Proper KRI Weight Selected Department');
			} else {
				if ($('#' + item.slice(0, -7) + 'cummWt').text() == 0) {
					toastr
						.error('Please Add Proper KRI Weight Selected Department');
					flg = false;
				} else {
					$('#' + item + ' tr')
						.each(
							function() {
								if ($(this).find("td")
									.eq(5)
									.find("input")
									.val() == '') {
									flg = false;
									toastr
										.error('Please Add Proper KRI Weight Selected Department');
								} else {
									flg = true;
								}
							});
					if (($('#' + item.slice(0, -7) + 'cummWt')
						.text() == 0)
						|| ($(
							'#' + item.slice(0, -7)
							+ 'cummWt').text() < 100)
						|| ($(
							'#' + item.slice(0, -7)
							+ 'cummWt').text() > 100)) {
						toastr
							.error('Please Add Proper KRI Weight For Selected Department');
						flg = false;
					}
				}
			}
		});
	var deptJson = [];
	$('#departTable tr:gt(0)')
		.each(
			function() {
				var deptId = $(this).find("td").eq(0)
					.attr('id');
				var deptName = $(this).find("td").eq(0).html();
				var deptWeightage = $(this).find("td").find(
					"input").val();
				var topRiskKriJson = [];
				$('.deptclass table')
					.each(

						function() {
							var finalTab = this.id;
							if (!finalTab == '') {
								if (finalTab.slice(0,
									-7) == deptId) {
									$(
										'#'
										+ finalTab
										+ ' tr:gt(0)')
										.each(
											function() {
												if ($(
													this)
													.find(
														"td")
													.eq(
														0)
													.text().length > 6) {
													var kriId = $(
														this)
														.find(
															"td")
														.eq(
															0)
														.text();
													var kriName = $(
														this)
														.find(
															"td")
														.eq(
															1)
														.text();
													var kriTab = []
													$(
														this)
														.find(
															"td")
														.eq(
															2)
														.find(
															'tr')
														.each(
															function() {
																var deptThresholdValue = $(
																	this)
																	.find(
																		"td")
																	.eq(
																		1)
																	.text();
																var deptThresholdType = $(
																	this)
																	.find(
																		"td")
																	.eq(
																		0)
																	.text();
																if (deptThresholdType == 'AMBER') {
																	bgClass = "bg-warning";
																} else {
																	bgClass = "bg-"
																		+ deptThresholdType
																			.toLowerCase();
																}
																var kriThreshold = "{\"deptThresholdType\":"
																	+ "\""
																	+ deptThresholdType
																	+ "\",\"deptThresholdValue\":\""
																	+ deptThresholdValue
																	+ "\",\"bgClass\":\""
																	+ bgClass
																	+ "\"}";
																kriTab
																	.push(kriThreshold);
															});
													var kriWeightage = $(
														this)
														.find(
															"td")
														.find(
															"input")
														.val();
													var kriJson = "{\"kriId\":"
														+ "\""
														+ kriId
														+ "\",\"kriName\":"
														+ "\""
														+ kriName
														+ "\",\"kriWeightage\":\""
														+ kriWeightage
														+ "\",\"mdtlist\":"
														+ "["
														+ kriTab
														+ "]}";
													topRiskKriJson
														.push(kriJson);
												}
											});
								}

							}
						});
				deptJson.push("{\"deptId\":" + "\""
					+ deptId.trim()
					+ "\",\"deptWeightage\":\""
					+ deptWeightage.trim()
					+ "\",\"deptName\":\""
					+ deptName.trim()
					+ "\",\"topRiskKriList\":["
					+ topRiskKriJson + "]}");
			});

	if (flg) {
		//	var comments = $('#comments').val().replace(/[\t\n]+/g, ' ');
		var filedetails = "[\n";
		if ($('#filedetails tr').length > 0) {
			$('#filedetails > tbody  > tr').each(
				function(index, value) {
					var splitvalue = $(this).find('td:eq(0)')
						.text().split('.');
					var sizesplit = $(this).find('td:eq(1)').text()
						.split(' ');
					var oldfileFlg = $(this).find('td:eq(4)')
						.text();
					if (oldfileFlg == '-') {
						filedetails = filedetails
							+ "  {  \"fileName\": \""
							+ $(this).find('td:eq(0)').text()
							+ "\",\n" + "    \"fileSize\": \""
							+ sizesplit[0] + "\",\n"
							+ "    \"fileType\": \""
							+ splitvalue[1] + "\"\n" + " },";

					}
				});
			filedetails = filedetails.substring(0,
				filedetails.length - 1);
		}
		filedetails = filedetails + "]";
		var topRiskId = $('#topRiskId').val();
		var desc = $('#topRiskDescription').val().replace(/[\t\n]+/g,
			' ');
		var topRiskTheme = $('#topRiskTheme').val();
		var pageValJson = "{\"topRiskId\":" + "\"" + topRiskId.trim()
			+ "\",\"topRiskTheme\":\"" + topRiskTheme.trim()
			+ "\",\"actionName\":\"" + actionName
			+ "\",\"topRiskDescription\":\"" + desc.trim()
			+ "\",\"deptMasterList\":[" + deptJson
			+ "],\"filedetails\":" + filedetails + "}";
		//alert(pageValJson);
		console.log(pageValJson);
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);

		var aesUtil = new AesUtil(keySize, iterationCount);

		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$("#edittopriskform").submit();
	}
}

var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
	$('.odd').closest("tr").remove();
	var username = $('#userName').val();
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
				.append($('<tr id=tr' + + '><td id=filetd' + i + '>'
					+ filename
					+ '</td><td id=filesizetd' + i + '>'
					+ filesizeInMB
					+ '</td><td>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td class="text-capitalize">'
					+ username
					+ '</td><td>-</td><td class="project-actions text-right" ><a class="btn btn-danger btn-sm" id="closerow"><i class="fas fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
			$('#filedetails').show();
		}
		$('#filedetails').show();
	}
}
$(".uploadTable").on("click", "#closerow", function() {
	$(this).closest("tr").remove();
	var rowCount = $('.uploadTable tbody tr').length;
	if (rowCount == 0) {
		$('#filedetails').hide();
	}
});

function validateNext() {
	var flg = false;
	if ($("#departTable tr:last").find("td:eq(0)").text() == 0) {
		$('span[id^="department-error"]').remove();
		$('#departmenterror')
			.after(
				'<span id="department-error" class="error invalid-feedback" style="display: inline;">Please select a department to proceed</span>');
	} else {
		$('span[id^="department-error"]').remove();
		var wt = $('#cummWt').text();
		if ((wt < 100) || (wt > 100)) {
			$('span[id^="cummWt-error"]').remove();
			$('.weight').addClass('is-invalid');
			$('#wt')
				.append(
					'<span id="cummWt-error" class="error invalid-feedback" style="display: inline;">&nbsp;Cummulative weight must be 100</span>');
		} else {
			flg = true;
			$('span[id^="cummWt-error"]').remove();
			$('.weight').removeClass('is-invalid');
		}
	}
	if (flg) {
		stepper.next();
	}
}
function validateFirst() {
	var flg = true;
	var desc = $('#topRiskDescription').val();
	if (desc == '') {
		flg = false;
		$('span[id^="description-error"]').remove();
		$('#topRiskDescription').addClass('is-invalid');
		$('#topRiskDescription')
			.after(
				'<span id="description-error" class="error invalid-feedback" style="display: inline;">Please provide a Description</span>');
	} else {
		$('span[id^="description-error"]').remove();
		$('#topRiskDescription').removeClass('is-invalid');
		flg = true;
	}
	if (flg) {
		stepper.next();
	}
}
function addTag(id, deptId) {
	var tabName;
	var dept = $('#kriDept').text();
	tabName = deptId + 'editTab';
	var kriId, kriName, threshold;
	$('#' + id).each(function() {
		kriId = $(this).find("td").eq(0).html();
		kriName = $(this).find("td").eq(1).html();
		threshold = $(this).find("td").eq(2).html();
	});
	var addFlg = true;
	$('#' + tabName)
		.each(
			function() {
				$('#' + tabName + ' tr')
					.each(
						function() {
							var rowid = $(this).find(
								'td:eq(0)').text();
							if (rowid == kriId) {
								addFlg = false;
								toastr
									.info('Kri Already Added');
							}
						});
				if (addFlg) {
					$('#' + tabName + ' tr[class*=kriTab]:last')
						.after(
							'<tr id="tr' + kriId.replaceAll('/', '') + deptId + '"><td>'
							+ kriId
							+ '</td><td> '
							+ kriName
							+ '</td><td>'
							+ threshold
							+ '</td><td><input  type="number" class="form-control form-control-sm '
							+ deptId
							+ 'weight"  onblur="updateCummWt(\''
							+ deptId
							+ '\');" '
							+ '></td> <td class="project-actions text-center">'
							+ '<a class="btn btn-danger btn-sm" onclick="removeTag(\''
							+ kriId.replaceAll('/', '')
							+ '\');"> <i class="fas fa-window-close"></i></a></td></tr>');
				}
			});
}
function updateCummWt(className, divName, errorTag) {
	var sum = 0;
	var flg = true;
	$('.' + className).each(function() {
		if (Number($(this).val()) == 0) {
			flg = false;
		} else {
			flg = true;
			sum += Number($(this).val());
		}
	});
	if (flg) {
		if (sum == 100) {
			$('span[id^="cummWt-error"]').remove();
			$('.' + className).removeClass('is-invalid');
		} else if (sum > 100) {
			$('span[id^="cummWt-error"]').remove();
			$('.' + className).addClass('is-invalid');
			$('#' + errorTag)
				.append(
					'<span id="cummWt-error" class="error invalid-feedback" style="display: inline;">&nbsp;Cummulative weight must be 100</span>');
		}
	} else {
		$('span[id^="cummWt-error"]').remove();
		$('.' + className).addClass('is-invalid');
		$('#' + errorTag)
			.append(
				'<span id="cummWt-error" class="error invalid-feedback" style="display: inline;">&nbsp;Weight can not be blank</span>');
	}
	$('#' + divName).text(sum);
}

function updateCummWt(deptId) {
	var className = deptId + 'weight';
	var divName = deptId + 'cummWt';
	var errorTag = deptId + 'wt';
	var sum = 0;
	var flg = true;
	$('.' + className).each(function() {
		if (Number($(this).val()) == 0) {
			flg = false;
		} else {
			flg = true;
			sum += Number($(this).val());
		}
	});
	if (flg) {
		if (sum == 100) {
			$('span[id^="cummWt-error' + deptId + '"]').remove();
			$('.' + className).removeClass('is-invalid');
		} else if ((sum > 100) || (sum < 100)) {
			$('span[id^="cummWt-error' + deptId + '"]').remove();
			$('.' + className).addClass('is-invalid');
			$('#' + errorTag)
				.append(
					'<span id="cummWt-error' + deptId + '" class="error invalid-feedback" style="display: inline;">&nbsp;Cummulative weight must be 100</span>');
		}
	} else {
		$('span[id^="cummWt-error' + deptId + '"]').remove();
		$('.' + className).addClass('is-invalid');
		$('#' + errorTag)
			.append(
				'<span id="cummWt-error' + deptId + '" class="error invalid-feedback" style="display: inline;">&nbsp;Weight can not be blank</span>');
	}
	$('#' + divName).text(sum);
}

function addDepartment(deptId, depName) {
	//Ajax call for Kri List of selected Department
	var pageValJson = "{\"userDept\":" + "\"" + deptId + "\"}";
	var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	var flg = false;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(
		CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	var value = ciphertext + ':~:' + passphrase;
	document.getElementById('load').style.visibility = "visible";
	$
		.ajax({
			url: 'fetchDeptKriList',
			type: "POST",
			data: {
				pageValJson: value
			},// important line for thymeleaf http security
			headers: {
				"X-CSRF-TOKEN": $("input[name='_csrf']").val()
			},
			async: false,
			cache: false,
			success: function(response) {
				setTimeout(
					function() {
						document.getElementById('interactive');
						document.getElementById('load').style.visibility = "hidden";
					}, 1000);
				var jsonResponse = JSON.stringify(response);
				obj = JSON.parse(jsonResponse);
				var tbnm = $('#tabname').val() + deptId
					+ 'edittab~';
				$('#tabname').val(tbnm);
				var tabId = deptId + 'editTab';
				var trTab = "";
				obj.deptKriList
					.forEach(function(listItems) {
						flg = true;
						var kriId = listItems.kriId;
						var kriName = listItems.kriName;
						var threshold = "";
						listItems.mdtDtoList
							.forEach(function(items) {
								if (items.deptThresholdType == 'AMBER') {
									var bg = 'warning';
								} else {
									var bg = items.deptThresholdType
										.trim()
										.toLowerCase();
								}
								threshold = threshold
									+ '<tr><td><span style="white-space:pre;" class="badge bg-'
									+ bg
									+ '">'
									+ items.deptThresholdType
									+ '</span></td><td>'
									+ items.deptThresholdValue
									+ '</td></tr>';
							});
						var thresholdTab = '<table>'
							+ threshold + '</table>';
						trTab = trTab
							+ '<tr id="tr' + kriId.replaceAll('/', '') + deptId + '"><td>'
							+ kriId
							+ '</td><td> '
							+ kriName
							+ '</td><td>'
							+ thresholdTab
							+ '</td><td><input type="text" class="form-control form-control-sm '
							+ deptId
							+ 'weight"  onblur="updateCummWt(\''
							+ deptId
							+ 'weight\',\''
							+ deptId
							+ 'cummWt\',\''
							+ deptId
							+ 'wt\');" '
							+ '></td> <td class="project-actions text-center">'
							+ '<a class="btn btn-danger btn-sm" title="Remove"  onclick="removeTag(\''
							+ kriId.replaceAll('/', '')
							+ deptId
							+ '\');"> <i class="fas fa-window-close"></i></a></td></tr>';
					});

				var deptDiv = '<div class="card card-primary card-outline" id="div'
					+ deptId
					+ '">'
					+ '<div class="card-header">'
					+ '<h5 class="card-title text-capitalize">'
					+ depName
					+ '</h5>'
					+ '<div class="card-tools">'
					+ '<a onclick="openmodal(\''
					+ deptId
					+ '\',\''
					+ depName
					+ '\')" data-toggle="modal" '
					+ ' class="btn btn-tool krilistmodal"><button'
					+ ' type="button" class="btn bg-olive">'
					+ '<i class="far fa-list-alt">&nbsp;KRI List</i>'
					+ '</button> </a> </div>'
					+ '</div>'
					+ '<div class="card-body">'
					+ '<div class="row table-responsive">'
					+ '<table id="'
					+ tabId
					+ '"'
					+ 'class="table table-head-fixed table-bordered table-striped depttabclass">'
					+ '<thead>'
					+ '<tr>'
					+ '<th>KRI ID</th>'
					+ '<th>KRI Name</th>'
					+ '<th>Threshold</th>'
					+ '<th>KRI Weight</th>'
					+ '<th></th>'
					+ '</tr>'
					+ '</thead><tbody>'
					+ trTab
					+ '<tr class="kriTab"></tr></tbody>'
					+ '	</table>'
					+ '	<div class="card-footer text-green col-12">'
					+ '	<label><i class="fas fa-dumbbell text-green"></i>&nbsp;Cumulative KRI Weight -'
					+ '	</label> <label id="' + deptId + 'cummWt">0</label><label id="' + deptId + 'wt">%</label>'
					+ '	</div>' + '</div>';

				$('#' + tabId).DataTable({
					"columnDefs": [{
						orderable: false,
						targets: [3, 4]
					}],
					"responsive": false,
					"autoWidth": true,
					"searching": false,
					"fixedHeader": true
				}).buttons().container().appendTo(
					'#' + tabId + '_wrapper .col-md-12:eq(0)');
				if (flg) {
					$(".deptclass").prepend(deptDiv);
				}
			},
			error: function(xhr, status, error) {
				console.log(xhr);
				toastr.error('Some Error Occured');
			}

		});
	return flg;
}

function openmodal(deptId, deptName) {
	//Ajax call for Kri List of selected Department
	var pageValJson = "{\"userDept\":" + "\"" + deptId + "\"}";
	var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(
		CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	var value = ciphertext + ':~:' + passphrase;
	$
		.ajax({
			url: 'fetchDeptKriList',
			type: "POST",
			data: {
				pageValJson: value
			},// important line for thymeleaf http security
			headers: {
				"X-CSRF-TOKEN": $("input[name='_csrf']").val()
			},
			cache: false,
			success: function(response) {
				var jsonResponse = JSON.stringify(response);
				obj = JSON.parse(jsonResponse);
				var trDiv;
				$('#kriTable tr:gt(1)').remove();
				obj.deptKriList
					.forEach(function(listItems) {
						var kriId = listItems.kriId;
						var kriName = listItems.kriName;
						var threshold = "";
						listItems.mdtDtoList
							.forEach(function(items) {
								if (items.deptThresholdType == 'AMBER') {
									var bg = 'warning';
								} else {
									var bg = items.deptThresholdType
										.trim()
										.toLowerCase();
								}
								threshold = threshold
									+ '<tr><td><span style="white-space:pre;" class="badge bg-'
									+ bg
									+ '">'
									+ items.deptThresholdType
									+ '</span></td><td>'
									+ items.deptThresholdValue
									+ '</td></tr>';
							});
						var thresholdTab = '<table>'
							+ threshold + '</table>';
						trDiv = ('<tr class="mainTab" id="tr' +kriId.replaceAll('/', '') + deptId + '"><td>'
							+ kriId
							+ '</td><td> '
							+ kriName
							+ '</td><td>'
							+ thresholdTab
							+ '</td><td class="project-actions text-right"><a '
							+ ' name="'
							+ deptId
							+ '" '
							+ 'class="btn btn-info btn-sm" id="tr'
							+ kriId.replaceAll('/', '')
							+ deptId
							+ '" onclick="addTag(this.id,this.name);"> <i '
							+ '	class="fas fa-tag"> </i> Tag' + '</a></td></tr>');
						$('#kriTable tr[class*=mainTab]:last')
							.after(trDiv);
					});

				$("#kriDept").text(deptId);
				$('#krilistmodal').modal('show');
			},
			error: function(xhr, status, error) {
				console.log(xhr);
				toastr.error('Some Error Occured');
			}
		});
}
