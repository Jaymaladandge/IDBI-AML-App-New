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
	var actionName = $(this).attr("name");
	var ruleRecordStatus = '';
	if ($("#recordStatus").val() == 'Pending Verification For Create') {
		ruleRecordStatus = 'VR';
	} else if ($("#recordStatus").val() == 'Pending Approval For Create') {
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

	var pageValJson = "{\"testId\": \"" + $("#eddId").val() + "\", " + " \"comment\": \"Verify Edd\","
		+ " \"currentAction\": \"" + ruleRecordStatus + "\"}";
	$("#encryptedJson").val(pageValJson);
	console.log(pageValJson);
	 $("#verifyEdd").submit();
});