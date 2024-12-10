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

var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
		var flg = true;
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
					+ '</td><td> Self </td><td class="project-actions text-right"><a class="btn btn-danger btn-sm" id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
		$('#filedetailsheader').show();
	}
}
$(".uploadTable").on("click", "#closerow", function() {
	var rowCount = $('.uploadTable tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#filedetails').hide();
		$('#filedetailsheader').hide();
	}
	$(this).closest("tr").remove();
});

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
});

$(function() {
	$("#kriDataType").change(function() {
		var dataTypeVal = $("#kriDataType option:selected").val();
		if (dataTypeVal != 'R') {
			$('.thresholdTable tbody').empty();
			$("#kriDepartmentData").select2({
				placeholder: "Select departments for KRI"
			});
		}
	});
});

function changeThreshold(id, deptId) {
	var divId = 'ToleranceThresholdBetweenValueDiv' + id + deptId;
	var selectId = 'asstDiv' + id + deptId;
	if ($('#' + selectId).val() == "BT" || $('#' + selectId).val() == "NB") {
		$('#' + divId).show();
	} else {
		$('#' + divId).hide();
	}
}
$(function() {
	$("#kriDepartmentData").change(function() {
		var threshldTbl = $('.thresholdTable');
		var scale = $('#scale').val().split(',');
		$('.thresholdTable tbody').empty();
		var data = $("#kriDepartmentData").select2("data");
		var mdtValue = "";
		for (var i = 0; i < data.length; i++) {
			$(scale).each(function(index, value) {
				mdtValue += '<tr><td style="width:5%;"><span class="text-capitalize text-bold"style="white-space:pre; color:' + value.split('~')[1] + ';">'
					+ value.split('~')[2].toLowerCase() + '</span></td><td style="width:35%;">' + ' <select class="form-control form-control-sm select2" name="assessmentCriteria"'
					+ 'onchange=changeThreshold("' + value.split('~')[2] + '","' + data[i].id + '") '
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
			threshldTbl.append($('<tr><td id="' + data[i].id + '">'
				+ data[i].text
				+ '</td><td><textarea class="form-control form-control-sm" name="remarks" id="' + data[i].id + 'remarks" rows="4"'
				+ '"maxlength="3000" placeholder="KRI Description"></textarea></td><td><table class="' + data[i].id + '">'
				+ mdtValue
				+ '<table></td>'
				+ '</tr>'));

			mdtValue = "";
			ragText = "";

		}
	});
});

$("#create").click(function() {
	if ($('#frmkri').valid()) {
		if ($("#kriDepartmentData").val() == "") {
			alert("Please select atleast one department for the KRI");
		} else {
			if ($(".thresholdTable tbody").children().length == 0) {
				alert("Please provide the thresholds values for the selected department");
			} else {
				$('#confirmmodal').modal('show');
			}

		}
	}

});

$(function() {
	$('#frmkri').validate({
		rules: {
			kriName: {
				required: true,
				minlength: 5,
				maxlength: 100,
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
			kriFormula: {
				required: true
			},/*
			kriBenchmark: {
				required: true
			},*/

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
			/*kriFormula: {
				required: "Please Select a Formula for KRI",
			},
			kriBenchmark: {
				required: "Please Select a Benchmark for KRI",
			},*/
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
		var flg = true;
		document.getElementById('load').style.visibility = "visible";
		//var dataTypeFlg = $('#kriDataType').val();
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
					var endValue = ($(this).find('td:eq(3)').find(
						"input").val().trim()) == '' ? 0 : $(this).find('td:eq(3)').find(
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
				thresholdJsonList.push(thresholdJson);

			});
			if (deptId !== undefined) {
				var mdmJson = "{\"deptId\":" + "\""
					+ deptId
					+ "\",\"remarks\":\""
					+ remarks.replace(/(\r\n|\n|\r)/gm, "")
					+ "\"}";
				mdmDtoList.push(mdmJson);
			}
		});
		console.log(mdmDtoList);
		//Check table data
		var filedetails = "[\n";
		if ($('#filedetails tr').length > 0) {
			$('#filedetails > tbody  > tr').each(function(index, value) {
				var splitvalue = $(this).find('td:eq(0)').text().split('.');
				var sizesplit = $(this).find('td:eq(1)').text().split(' ');
				filedetails = filedetails +
					"  {  \"fileName\": \"" + $(this).find('td:eq(0)').text() + "\",\n" +
					"    \"fileSize\": \"" + sizesplit[0] + "\",\n" +

					"    \"fileType\": \"" + splitvalue[1] + "\"\n" +
					" },";


			});
			//filedetails = filedetails.slice(0,-1);
			filedetails = filedetails.substring(0, filedetails.length - 1);
		}
		filedetails = filedetails +
			"]";
		var kriString = "{\n" +
			"    \"kriId\": \"" + $("#kriId").val() + "\",\n" +
			"    \"kriName\": \"" + $("#kriName").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
			"    \"kriThresholdDescription\":\"" + $("#kriThresholdDescription").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
			"    \"kriDataType\":\"" + $("#kriDataType").val() + "\",\n" +
			"    \"kriDataSource\":\"" + $("#kriDataSource").val() + "\",\n" +
			"    \"kriUpdateFrequency\":\"" + $("#kriUpdateFrequency").val() + "\",\n" +
			"    \"kriLinkedDept\":\"" + $("#kriDepartmentData").val() + "\",\n" +
			"    \"kriFormula\":\"" + $("#kriFormula").val() + "\",\n" +
			"    \"kriBenchmark\":\"" + $("#kriBenchmark").val() + "\",\n" +
			"    \"kriActionStatus\":\"NA\",\n" +
			"    \"kriRecordStatus\":\"CR\",\n" +
			"    \"actionName\":\"" + actionName + "\",\n" +
			"    \"filedetailsList\":" + filedetails + ",\n" +
			"    \"mdtDtoList\":[" + thresholdJsonList + "],\n" +
			"    \"kriValueDesc\":\"" + $("#assessmentValueDesc").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
			"    \"mdmDtoList\":[" + mdmDtoList + "]\n" +
			"}";

		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

		var aesUtil = new AesUtil(keySize, iterationCount);

		var ciphertext = aesUtil.encrypt(reverseText(passphrase), kriString);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		console.log()
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

