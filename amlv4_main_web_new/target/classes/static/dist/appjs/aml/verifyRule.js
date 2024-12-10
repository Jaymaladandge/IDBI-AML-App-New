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

$("#verify").click(function() {
	var ruleRecordStatus = '';
	if ($("#recordStatus").val() == 'Pending Verification For Creation') {
		ruleRecordStatus = 'VR';
	} else if ($("#recordStatus").val() == 'Pending Approval For Creation') {
		ruleRecordStatus = 'AR';
	} else if ($("#recordStatus").val() == 'Pending Verification For Edit') {
		ruleRecordStatus = 'EV';
	} else if ($("#recordStatus").val() == 'Pending Approval For Edit') {
		ruleRecordStatus = 'EA';
	}
	else if ($("#ruleRecordStatus").val() == 'Pending Verification For Closure') {
		ruleRecordStatus = 'XV';
	}
	// code for between threshold value
	document.getElementById('load').style.visibility = "visible";

	var pageValJson = "{\"ruleId\": \"" + $("#ruleId").val() + "\", " + " \"comment\": \"Verify Rule\","
		+ " \"actionStatus\": \"" + ruleRecordStatus + "\"}";
	$("#encryptedJson").val(pageValJson);
	console.log(pageValJson);
	 $("#verifyRuleForm").submit();
});