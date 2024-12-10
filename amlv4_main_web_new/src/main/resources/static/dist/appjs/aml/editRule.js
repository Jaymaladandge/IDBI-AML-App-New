document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	//	bsCustomFileInput.init();
})
$("#saveEdit").click(function() {
	if ($('#editRuleForm').valid()) {
		let flg = true;
		var ruleThreshold = "[\n";
		if ($('#ruleThreshTab tr').length > 0) {
			$('#ruleThreshTab > tbody  > tr')
				.each(
					function() {
						ruleThreshold = ruleThreshold
							+ "  {  \"ruleId\": \"" + $(this).find('td:eq(0)').find('input').val() + "\","
							+ "    \"ruleParameter\": \"" + $(this).find('td:eq(1)').find('input').attr('data-id') + "\",\n"
							+ "    \"ruleKey\": \""
							+ $(this).find('td:eq(2)').find('input').val()
							+ "\" },";

					});
			ruleThreshold = ruleThreshold.substring(0,
				ruleThreshold.length - 1);
		}
		ruleThreshold = ruleThreshold + "]";
		var ruleRiskThreshold = "[\n";
		let riskValue;
		$('.ruleRiskTabClass tbody tr').each(function(index) {
			var trClass = $(this).attr('class');
			if (trClass = 'main') {
				// Read content of tbody
				riskValue = $(this).attr('color');
			}
			var ruleRiskParameter;
			var startType = '';
			var startValue = '';
			var endType = '';
			var endValue = '';
			var ruleRiskType = '';
			var groupCondition = '';
			if (trClass == 'main') {
				// Read content of tbody
				ruleRiskType = $(this).find('td:eq(0)').find('select').val();
				startType = $(this).find('td:eq(2)').find('select').val();
				ruleRiskParameter = $(this).find('td:eq(1)').find('select').val();
				startValue = $(this).find('td:eq(3)').find('input').val();
				endType = $(this).find('td:eq(4)').find('select').val();
				endValue = $(this).find('td:eq(5)').find('input').val();
				groupCondition = $(this).find('td:eq(6)').find('select').val();
				if (groupCondition == 'undefined' || groupCondition == undefined) {
					groupCondition = 'NA';
				}
				if (ruleRiskParameter == '' || (ruleRiskParameter != 'BT' && startValue == '')) {
					flg = false;
				} else if (ruleRiskParameter == 'BT' && (endType == '' || endValue == '') || startType == '') {
					flg = false;
				}
				if (!$(this).find('td:eq(6)').find('select').is(':disabled') && groupCondition == 'NA') {
					flg = false;
				}
				ruleRiskThreshold = ruleRiskThreshold
					+ "  {  \"ruleId\": \"" + $("#ruleId").val() + "\",\"riskValue\": \"" + riskValue + "\",\"ruleRiskType\": \"" + ruleRiskType.trim()
					+ " \",\"ruleRiskParameter\": \"" + ruleRiskParameter + "\",\"startType\": \"" + startType + "\",\"startValue\": \"" + startValue
					+ "\",\"endType\": \"" + endType + "\",\"endValue\": \"" + endValue + "\",\"groupCondition\": \"" + groupCondition + "\" },";
			}
		});
		ruleRiskThreshold = ruleRiskThreshold.substring(0, ruleRiskThreshold.length - 1);
		ruleRiskThreshold = ruleRiskThreshold + "]";
		if (flg) {
			var pageValJson = "{\"ruleId\": \"" + $("#ruleId").val() + "\",\"recordStatus\": \"" + $("#recordStatus").val() + "\","
				+ " \"ruleDesc\": \"" + $("#ruleDesc").val() + "\"," + " \"ruleRiskDefDtoList\": " + ruleRiskThreshold + "," +
				"   \"ruleThresholdDtoList\": " + ruleThreshold + "}";
			console.log(pageValJson);
 			$("#encryptedJson").val(pageValJson);
				$("#editRuleForm").submit();
		} else {
			toastr.error('Please Select All Values');
		}
	};
});

function removeTr(id) {
	$('#tr' + id).remove();
}

var rowCount = $('#eddQueTab >tbody >tr').length;
$("#addrow")
	.click(
		function() {

			$('#eddQueTab tr:last')
				.after(
					'<tr color="${scaleObj.name}" id="tr' + rowCount
					+ '"><td><input type="text" style="width: 100%" /></td>'
					+ '<td><input type="text" style="width: 100%" /></td>'
					+ '<td><input type="text" style="width: 100%" /></td>'
					+ '<td><a class="btn btn-danger btn-sm" title="Remove" id="'
					+ rowCount
					+ '"'
					+ 'onclick="removeTr(this.id)"><em class="fa fa-window-close"></em></a></td></tr> ');
		});

$('#editRuleForm')
	.validate(
		{
			rules: {
				ruleDesc: {
					required: true,
					minlength: 10,
					maxlength: 3000,
				},
			},
			messages: {
				ruleDesc: {
					required: "Please enter the Rule description",
					minlength: "Description must be at least 10 characters long",
					maxlength: "Description cannot exceed 3000 characters",
				},
			},
			errorElement: 'span',
			errorPlacement: function(error, element) {
				error.addClass('invalid-feedback');
				element.closest('.form-group').append(error);
			},
			highlight: function(element, errorClass,
				validClass) {
				$(element).addClass('is-invalid');
			},
			unhighlight: function(element, errorClass,
				validClass) {
				$(element).removeClass('is-invalid');
			},
		});

function checkDiv(element) {
	var $tr = $(element).closest('tr');
	var selectedVal = $(element).val();
	if (selectedVal != 'BT') {
		$tr.find('td:eq(5)').find('input').attr('disabled', 'true');
		$tr.find('td:eq(4)').find('select').attr('disabled', 'true');
		$tr.find('td:eq(2)').find('select option[value="' + selectedVal + '"]').prop('selected', true);
		$tr.find('td:eq(2)').find('select').attr('disabled', 'true');
	} else {
		$tr.find('td:eq(5)').find('input').removeAttr('disabled');
		$tr.find('td:eq(4)').find('select').removeAttr('disabled');
		$tr.find('td:eq(2)').find('select').removeAttr('disabled');
	}
}

function addCondition(id) {
	var existingTr = $(id).attr('trid') + '0';
	var $tr = $(id).closest('tr');
	var condn = $('#' + existingTr).find('td:eq(0)').find('select option:selected').val();
	var newCondn;
	if (condn == 'SUM') {
		newCondn = 'COUNT';
	} else {
		newCondn = 'SUM';
	}
	$('#' + existingTr).find('td:eq(6)').find('select').removeAttr('disabled');
	$(id).addClass('disabled');
	var pageValJson = "{\"ruleId\":" + "\"" + condn + "\"}";
	document.getElementById('load').style.visibility = "visible";
	var selectHtml = '<td><div class="input-group"><select class="form-control form-control-sm select2 text-capitalize" data-placeholder="Select Parameter" style="width: 100%;"  ><option value="">Select</option>';
	var selectBtHtml = '<td><div class="input-group"><select class="form-control form-control-sm select2 text-capitalize" data-placeholder="Select Parameter" style="width: 100%;" onchange="checkDiv(this)"><option value="">Select</option>';
	$
		.ajax({
			url: 'fetchRuleRiskParam',
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
				$.each(obj.asstTypeDtosBt, function(index, asstDto) {
					selectBtHtml += '<option value="' + asstDto.asstType + '">' + asstDto.asstTypeDesc + '</option>';
				});
				selectBtHtml += '</select></div></td>';

				$.each(obj.asstTypeDtos, function(index, asstDto) {
					selectHtml += '<option value="' + asstDto.asstType + '">' + asstDto.asstTypeDesc + '</option>';
				});
				selectHtml += '</select></div></td>';
				var inputTd = '<td><input type="Number" class="form-control form-control-sm" style="width: 100%" /></td>';
				var newTr = $(id).attr('trid') + '1';
				var color=$(id).attr('trid').substr(2);
				var trData = "<tr id=" + newTr + " color="+color+" class='main'>" + "<td><div class='input-group'><select class='form-control form-control-sm select2 text-capitalize'  data-placeholder='Select Condition' style='width: 100%;'><option value=''>Select</option><option value=" + newCondn + " selected>" + newCondn + "</option></select></div></td>"
					+ selectBtHtml + selectHtml + inputTd + selectHtml + inputTd + '<td><div class="input-group"> <select class="form-control form-control-sm select2 text-capitalize disabled" name="recordStatus"   style="width: 100%;" disabled="true"> <option value="NA" selected>NA</option></select></div></td>'
					+ "</tr>";
				$('#' + existingTr).after(trData);
				$('.select2').select2();
			},
			error: function() {
				toastr.error('Some Error Occured');
			}
		});

}