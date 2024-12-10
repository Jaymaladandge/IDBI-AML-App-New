
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}


$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
})
$(function() {
	$("#ruleTable").DataTable({
		"ordering": false,
		"responsive": false,
		"lengthMenu": [10, 25, 50, 75, 100],
		"autoWidth": true,
		"searching": true,
		"fixedHeader": true,
		"buttons": ["csv", "excel", "pdf", "print"],
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#ruleTable_wrapper .col-md-6:eq(0)');
});

$(document).ready(function() {
	var message = $('#message').val();
	if (message == "ERROR") {
		toastr.error("Some Error Occurred");
	} else if (message != '' && message != undefined) {
		toastr.success(message);
	}

	var message = $('#source').val();
	if (message == "ERROR") {
		toastr.error("Some Error Occurred");
	} else if (message != '' && message != undefined && message != "NA") {
		toastr.success(message);
	}
});
// 
$('#searchcriteria').keypress(function(event) {
	if (event.keyCode === 10 || event.keyCode === 13) {
		event.preventDefault();
	}
});


$('a.ruleModel')
	.click(
		function() {
			var ruleId = $(this).attr('id');
			var pageValJson = "{\"ruleId\":" + "\""
				+ ruleId + "\"}";

			console.log(pageValJson);
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'RuleViewModel',
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
						console.log("json Response "
							+ jsonResponse)
						var obj = JSON.parse(jsonResponse);
						console.log("obj " + obj);
						var i = 0;
						$("#ruleIdLabel").text(
							obj.ruleId);
						$("#ruleDesc").text(
							obj.ruleDesc);
						$("#ruleFrequency")
							.val(obj.ruleFrequency);
						$("#ruleClassification").val(
							obj.ruleClassification);
						$("#ruleIndicator").val(
							obj.ruleIndicator);
						$("#ruleCategory").val(
							obj.ruleCategory);
						$("#ruleImpact").val(
							obj.ruleImpact);
						$("#ruleLikelihood")
							.val(obj.ruleLikelihood);
						$("#inherentRisk").val(
							obj.inherentRisk);
						$("#ruleExeFlg").val(
							obj.ruleExeFlg);
						$("#nextExeFlg").val(
							obj.nextExeFlg);
						$("#lastExeFlg").val(
							obj.lastExeFlg);
						$("#ruleExpiryDate")
							.val(obj.ruleExpiryDate);
						$("#ruleConstitution").val(
							obj.ruleConstitution);
						$("#ruleTrnChannel").val(
							obj.ruleTrnChannel);
						$("#ruleTrnSubChannel").val(
							obj.ruleTrnSubChannel);
						$("#makerId").val(
							obj.makerId);
						$("#makerTimeStamp")
							.val(obj.makerTimeStamp);
						$("#lastUserId").val(
							obj.lastUserId);
						$("#lastUpdateTime").val(
							obj.lastUpdateTime);
						$("#actionStatus").val(
							obj.actionStatus);
						$("#recordStatus").val(
							obj.recordStatus);
						$("#ruleAggType")
							.val(obj.ruleAggType);
						var thresholdData = obj.ruleThresholdDtoList;
						$(".ruleThresDtls > #tbodyR").empty();

						// alert('thresholdData '+thresholdData);
						thresholdData.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td><span name='incidentName' value='" + items.ruleDesc + "' class='text-capitalize'>"
								+ items.ruleParameter
								+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleClassification + "' class='text-capitalize'>"
								+ items.ruleKey
								+ "</td></tr>").appendTo("#tbodyR");
						});
						var riskData = obj.ruleRiskDefinationDtoList;
						$(".ruleRiskDtls > #tbodyRiskR").empty();

						if (riskData != null)
							riskData.forEach(function(items) {
								$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
									+ items.ruleRiskId
									+ "</td><td><span name='incidentName' value='" + items.ruleRiskParameter + "' class='text-capitalize'>"
									+ items.ruleRiskParameter
									+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleRiskValue + "' class='text-capitalize'>"
									+ items.ruleRiskValue
									+ "</td></tr>").appendTo("#tbodyRiskR");
							});
						//	$("#ruleThresRow").css("display", "block");

					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});
			$('#viewRuleModel').modal('show');
		});

$(".editRule").click(
	function() {
		var ruleId = $(this).attr('id');
		var pageValJson = "{\"ruleId\":" + "\"" + ruleId + "\"}";
		$("#ruleForm").attr('action', 'editRulePage');
		$("#encryptedJsonEdit").val(pageValJson);
		$("#ruleForm").submit();
	});

$(".verifyRule").click(
	function() {
		var ruleId = $(this).attr('id');
		var pageValJson = "{\"ruleId\":" + "\"" + ruleId + "\"}";
		$("#ruleForm").attr('action', 'verifyRulePage');
		$("#encryptedJsonEdit").val(pageValJson);
		$("#ruleForm").submit();
	});
