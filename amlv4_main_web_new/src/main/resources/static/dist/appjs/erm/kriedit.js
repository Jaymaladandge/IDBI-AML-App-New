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

function changeThresholds(id, deptId) {
	var divId = 'ToleranceThresholdBetweenValueDiv' + id + deptId;
	var selectId = 'asstDiv' + id + deptId;
	if ($('#' + selectId).val() == "BT" || $('#' + selectId).val() == "NB") {
		$('#' + divId).show();
	} else {
		$('#' + divId).hide();
	}
}
function changeThreshold(id, name) {
	var oldId = id + 'oldThresh';
	var singleThreshId = id + 'singleNewThresh';
	var doubleThreshId = id + 'doubleNewThresh';

	if ($('#' + id).val() == name) {
		$('.' + oldId).show();
		$('.' + singleThreshId).hide();
		$('.' + doubleThreshId).hide();
	} else {
		if ($('#' + id).val() == "BT" || $('#' + id).val() == "NB") {
			$('.' + doubleThreshId).show();
			$('.' + oldId).hide();
			$('.' + singleThreshId).hide();
		} else {
			$('.' + singleThreshId).show();
			$('.' + oldId).hide();
			$('.' + doubleThreshId).hide();
		}
	}
}
$(function() {
	$("#kriDepartmentData").change(function() {
		var threshldTbl = $('.thresholdTable');
		var dataTypeFlg = $('#kriDataType').val();
		$('.thresholdTable tbody').empty();
		var data = $("#kriDepartmentData").select2("data");

		var mdtValue = "";
		if (data.length > 0) {
			var kriId = $("#kriId").val();
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
					var scale = obj.cmdDtoList.toString().split(',');
					threshldTbl.append($('<tr><th style="width: 5%;">Department</th><th style="width: 35%;" class="text-center">Description</th><th style="width: 60%;" class="text-center">ThresholdDetails</th></tr>'));
					for (var i = 0; i < data.length; i++) {
						var flg = true;
						var deptKriDesc = '';
						if (obj.mdmDtoList.length > 0) {
							obj.mdmDtoList.forEach(function(mdmItem) {
								if (data[i].id == mdmItem.deptId) {
									flg = false;
									deptKriDesc = mdmItem.remarks;
									mdmItem.mdtDtoList.forEach(function(mdtItem) {
										var optionTag = '';
										mdtItem.asstTypeDtos.forEach(function(asstTypeDto) {
											if (asstTypeDto.selectFlg == 'true') {
												optionTag += '<option value="' + asstTypeDto.asstType + '" selected>' + asstTypeDto.asstTypeDesc + '</option>';
											} else {
												optionTag += '<option value="' + asstTypeDto.asstType + '" >' + asstTypeDto.asstTypeDesc + '</option>';
											}

										});
										var selectTag = '<td style="width: 35%;"><div class="form-group"></div><select style="width: 80%;" class="form-control from-control-sm select2" name="' + mdtItem.asstType + '" id="' + mdmItem.deptId + '' + mdtItem.deptThresholdType + '" onchange="changeThreshold(this.id,this.name)">'
											+ '' + optionTag + '</select></td>';
										if (mdtItem.asstType == 'BT' || mdtItem.asstType == 'NB') {
											var inputValue = mdtItem.deptThreshValue.split('~');
											mdtValue += '<tr><td ><span class="text-capitalize text-bold" style="white-space:pre;color:' + mdtItem.bgClass + ';" >' + mdtItem.deptThresholdType + '</span></td>' + selectTag + '<td style="width:30%;" class="' + mdmItem.deptId + '' + mdtItem.deptThresholdType + 'oldThresh"><input type="number" class="form-control form-control-sm col-12" id=' + data[i].id + '~' + mdtItem.deptThresholdType + ' name=' + data[i].id + '~' + mdtItem.deptThresholdType + ' value=' + inputValue[0] + ' maxlength="100"></td><td style="width:30%;" class="' + mdmItem.deptId + '' + mdtItem.deptThresholdType + 'oldThresh"><input type="number" class="form-control form-control-sm col-12" id=' + data[i].id + '~' + mdtItem.deptThresholdType + 'R name=' + data[i].id + '~' + mdtItem.deptThresholdType + 'R value=' + inputValue[1] + '  maxlength="100"></td>'
												+ '<td colspan="2" style="width: 60%; display: none" class="' + mdmItem.deptId + '' + mdtItem.deptThresholdType + 'singleNewThresh"><input type="number" class="form-control form-control-sm col-12" maxlength="100"></td>'
												+ '<td style="width: 30%; display: none" class="' + mdmItem.deptId + '' + mdtItem.deptThresholdType + 'doubleNewThresh"><input type="number" class="form-control form-control-sm col-12" maxlength="100"></td>'
												+ '<td style="width: 30%; display: none" class="' + mdmItem.deptId + '' + mdtItem.deptThresholdType + 'doubleNewThresh"><input type="number" class="form-control form-control-sm col-12" maxlength="100"></td></tr>';
										} else {
											mdtValue += '<tr><td style="width:5%;"><span style="white-space:pre;color:' + mdtItem.bgClass + ';" class="text-capitalize text-bold">' + mdtItem.deptThresholdType + '</span></td>' + selectTag + '<td class="' + mdmItem.deptId + '' + mdtItem.deptThresholdType + 'oldThresh" ><input type="number" class="form-control form-control-sm col-12" id=' + data[i].id + '~' + mdtItem.deptThresholdType + ' name=' + data[i].id + '~' + mdtItem.deptThresholdType + ' value=' + mdtItem.deptThreshValue + ' maxlength="100"></td></tr>';
										}
									});
								}
							});

						}
						if (flg) {
							if (dataTypeFlg == 'Range') {
								$(scale).each(function(index, value) {
									mdtValue += '<tr><td  style="width:5%;"><span class="text-capitalize text-bold" style="white-space:pre;color:' + value.split('~')[1] + ';">'
										+ value.split('~')[2].toLowerCase() + '</span></td><td><input type="number" class="form-control form-control-sm col-12" id='
										+ data[i].id + '~' + value.split('~')[2] + ' name=' + data[i].id + '~' + value.split('~')[2]
										+ ' placeholder="0" maxlength="100"></td><td><input type="number" class="form-control form-control-sm col-12" id='
										+ data[i].id + '~' + value.split('~')[2] + ' name=' + data[i].id + '~' + value.split('~')[2]
										+ ' placeholder="0" maxlength="100"></td></tr>';
								});
							} else {
								$(scale).each(function(index, value) {
									mdtValue += '<tr><td style="width:5%;"><span class="text-capitalize text-bold"style="white-space:pre; color:' + value.split('~')[1] + ';">'
										+ value.split('~')[2].toLowerCase() + '</span></td><td style="width:35%;">' + ' <select class="form-control form-control-sm select2" name="assessmentCriteria"'
										+ 'onchange=changeThresholds("' + value.split('~')[2] + '","' + data[i].id + '") '
										+ 'data-placeholder="Assessment Criteria"'
										+ ' id ="asstDiv' + value.split('~')[2] + '' + data[i].id + '"'
										+ '>'
										+ '<option value="NA">Not Applicable</option>'
										+ '<option value="ET">Equal to Threshold</option>'
										+ '<option value="LT">Less Than Threshold</option>'
										+ '<option value="GT">Greater Than Threshold</option>'
										+ '<option value="LE">Less Than Or Equal To Threshold</option>'
										+ '<option value="GE">Greater Than Or Equal To Threshold</option>'
										+ '<option value="NE">Not Equal to Threshold</option>'
										+ '<option value="BT">Between Threshold</option>'
										+ '<option value="NB">Not Between Threshold</option>'
										+ '</select> ' + '</td><td style="width:30%;"><input type="number" class="form-control form-control-sm col-12" id='
										+ data[i].id + '~' + value.split('~')[2] + ' name=' + data[i].id + '~' + value.split('~')[2]
										+ ' placeholder="0" maxlength="100"></td><td id="ToleranceThresholdBetweenValueDiv' + value.split('~')[2] + '' + data[i].id + '" style="display:none;width:30%;"><input type="number" class="form-control form-control-sm col-12" id='
										+ data[i].id + '~' + value.split('~')[2] + ' name=' + data[i].id + '~' + value.split('~')[2]
										+ ' placeholder="0" maxlength="100"></td></tr>';
								});
							}
						}
						threshldTbl.append($('<tr><td id="' + data[i].id + '">'
							+ data[i].text
							+ '</td><td><textarea class="form-control form-control-sm" name="remarks" id="' + data[i].id + 'remarks" rows="6"'
							+ '"maxlength="3000" placeholder="KRI Description">' + deptKriDesc + '</textarea></td><td><table class="table table-bordered table-striped ' + data[i].id + '">'
							+ mdtValue
							+ '<table></td></tr>'));

						mdtValue = "";
					}

				},
				error: function(xhr, status, error) {
					toastr
						.success('Some Error Occured');
				}
			});
		}
	});
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


$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
});


$(function() {
	$('#frmkri').validate({
		rules: {
			kriName: {
				required: true,
				minlength: 5,
				maxlength: 100,
			},

			kriDescription: {
				required: true,
				minlength: 10,
				maxlength: 3000,
			},

			kriDataType: {
				required: true
			},

			kriDepartmentData: {
				required: true
			},

			kriThresholdDescription: {
				required: true,
				minlength: 10,
				maxlength: 3000,
			},

			kriDataSource: {
				required: true,
			},

			kriUpdateFrequency: {
				required: true
			},
			commentKri: {
				required: true
			},
			kriFormula: {
				required: true
			},
		},
		messages: {
			kriName: {
				required: "Please provide the KRI Name",
			},

			kriDataType: {
				required: "Please select a Data Type",
			},

			kriDepartmentData: {
				required: "Please select a Department to be linked for KRI",
			},

			kriThresholdDescription: {
				required: "Please provide the Threshold Description for KRI",
			},

			kriDataSource: {
				required: "Please select a Data Source for KRI",
			},

			kriUpdateFrequency: {
				required: "Please Select a Frequency",
			},

			commentKri: {
				required: "Please provide your comments",
			},
			kriFormula: {
				required: "Please Select a Formula for KRI",
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
		},
		submitHandler: function(form) {
			form.submit();
		}
	});
});

$("#submitKri").click(function() {
	if ($('#frmkri').valid()) {
		document.getElementById('load').style.visibility = "visible";
		var dataTypeFlg = $('#kriDataType').val();
		var thresholdJsonList = [];
		var mdmDtoList = [];
		var actionName = $(this).attr("name");
		$('.thresholdTable tbody tr').each(function(index, value) {
			var deptId = '';
			deptId = $(this).find("td").eq(0)
				.attr('id');
			var remarks = $(this).find("td").eq(1).find("textarea").val();
			$('.' + deptId + ' tbody tr').each(function(index, value) {
				var deptThresType = $(this).find("td").eq(0).text();
				var tdObject = $(this).find('td:eq(1)');
				var selectObject = tdObject.find("select");
				var asstValueType = selectObject.val();
				var thresValue;
				if (asstValueType == 'BT' || asstValueType == 'NB') {
					var temp = 0;
					var startValue = ($(this).find('td:eq(2)').find(
						"input").val().trim()) == '' ? 0 : $(this).find('td:eq(2)').find(
							"input").val().trim();
					var endValue = $(this).find('td:eq(3)').find(
						"input").val().trim() == '' ? 0 : $(this).find('td:eq(3)').find(
							"input").val().trim();
					if (Number(startValue) > Number(endValue)) {
						temp = startValue;
						startValue = endValue;
						endValue = temp;
					}
					thresValue = startValue + '~' + endValue;

				} else {
					thresValue = $(this).find('td:eq(2)').find(
						"input").val();
				}
				var thresholdJson = "{\"deptLinkId\":" + "\""
					+ deptId
					+ "\",\"deptThresholdType\":\""
					+ deptThresType + "\",\"asstType\":\""
					+ asstValueType + "\",\"deptThresholdValue\":\""
					+ thresValue
					+ "\"}";
				if (deptThresType != '') {
					thresholdJsonList.push(thresholdJson);
				}
			});
			if (deptId !== undefined) {
				var mdmJson = "{\"deptId\":" + "\""
					+ deptId
					+ "\",\"remarks\":\""
					+ remarks
					+ "\"}";
				mdmDtoList.push(mdmJson);
			}
		});

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
		var recordStat = $("#kriRecordStatus").val();
		var kriRecordStatus;
		if (recordStat == 'Rejected Create Request') {
			kriRecordStatus = 'CR';
			actionName = 'create';
		} else {
			kriRecordStatus = 'ER';

		}
		//deptProvidingData
		var kriString = "{\n" +
			"    \"kriId\": \"" + $("#kriId").val() + "\",\n" +
			"    \"kriName\": \"" + $("#kriName").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
			"    \"kriThresholdDescription\":\"" + $("#kriThresholdDescription").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
			"    \"kriDataType\":\"" + $("#kriDataType").val() + "\",\n" +
			"    \"kriDataSource\":\"" + $("#kriDataSource").val() + "\",\n" +
			//"    \"deptProvidingData\":\"" + $("#deptProvidingData").val() + "\",\n" +
			"    \"kriUpdateFrequency\":\"" + $("#kriUpdateFrequency").val() + "\",\n" +
			"    \"kriLinkedDept\":\"" + $("#kriDepartmentData").val() + "\",\n" +
			//"    \"kriOfficeData\":\"" + $("#kriOfficeData").val() + "\",\n" +
			"    \"kriActionStatus\":\"NA\",\n" +
			"    \"kriFormula\":\"" + $("#kriFormula").val() + "\",\n" +
			"    \"kriRecordStatus\":\"" + kriRecordStatus + "\",\n" +
			"    \"actionName\":\"" + actionName + "\",\n" +
			"    \"kriBenchmark\":\"" + $("#kriBenchmark").val() + "\",\n" +
			"    \"filedetailsList\":" + filedetails + ",\n" +
			"    \"mdtDtoList\":[" + thresholdJsonList + "],\n" +
			"    \"kriValueDesc\":\"" + $("#assessmentValueDesc").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
			"    \"mdmDtoList\":[" + mdmDtoList + "],\n" +
			"   \"commentDto\": {\"comment\": \"" + $("#commentKri").val().replace(/(\r\n|\n|\r)/gm, "") + "\"}}";

		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

		var aesUtil = new AesUtil(keySize, iterationCount);

		var ciphertext = aesUtil.encrypt(reverseText(passphrase), kriString);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$("#frmkri").submit();
	}
});
$(function() {
	$("#kriBenchmark").change(function() {
		var data = $("#kriBenchmark").val();
		//alert(data);
		if (data == 'FIXED' || data == 'NA') {
			$('#kriFormula')
				.append($("<option></option>")
					.attr("value", 'NA').attr("selected", 'selected')
					.text('NA'));
			$('#kriFormula').attr('disabled', 'disabled');
		} else {
			$("#kriFormula option[value='NA']").remove();
			$('#kriFormula')
				.append($("<option></option>")
					.attr("value", 'NA').attr("selected", 'selected')
					.text('NA'));
			$('#kriFormula').removeAttr('disabled');
		}
	});
});
