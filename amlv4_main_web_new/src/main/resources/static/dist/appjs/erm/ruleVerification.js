document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	//var recipient = button.data('whatever') 
	var recipient = $('#datasource').val()
	var modal = $(this)
	$('a.target').attr('href', 'mainActionPlan');
	// window.history.back();

})

//$("#ruleThresholdTable").dataTable();
$(function() {
	$("#ruleThresholdTable").DataTable({
		"order": [0, "desc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		},

	})
});

$(function() {
	$("#ruleParameterTable").DataTable({
		"order": [0, "desc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		},

	})
});

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

})

var role=$("#userRole").val();
var btnId='';
if(role == 'Branch Head'){
	btnId=$("#Verify");
	
}else if(role == 'Rule Approver'){
	btnId=$("#Approve");
}

btnId.click(function() {
	
	var	actionName = $(this).attr("name");
	var riskActionStatusOld = $('#oldActionStatus').val();
	
	if ($("#ruleRecordStatus").val() == 'Pending Verification For Creation') {
		ruleRecordStatus = 'VR';
	} else if ($("#ruleRecordStatus").val() == 'Pending Approval For Creation') {
		ruleRecordStatus = 'AR';
	} else if ($("#ruleRecordStatus").val() == 'Pending Verification For Edit') {
		ruleRecordStatus = 'EV';
	} else if ($("#ruleRecordStatus").val() == 'Pending Approval For Edit') {
		ruleRecordStatus = 'EA';
	} else if ($("#ruleRecordStatus").val() == 'Pending Approval For Value Captured') {
		ruleRecordStatus = 'AR';
	}
	else if ($("#ruleRecordStatus").val() == 'Pending Verification For Closure') {
		ruleRecordStatus = 'XV';
	}
	// code for between threshold value

	document.getElementById('load').style.visibility = "visible";
	//Check table data
	
	var statusFlgOld = $("#statusFlg").val();
	if ($("#statusFlg").val() == 'Active') {
		statusFlgOld = 'A';
	} else if ($("#statusFlg").val() == 'Pending for Approval') {
		statusFlgOld = 'D';
	} else if ($("#statusFlg").val() == 'Rejected') {
		statusFlgOld = 'R';
	} else if ($("#statusFlg").val() == 'Closed') {
		statusFlgOld = 'C';
	} else if ($("#statusFlg").val() == 'Edited') {
		statusFlgOld = 'E';
	}
	else if ($("#statusFlg").val() == 'Deleted') {
		statusFlgOld = 'X';
	}
	
	
	
	var rasString = "{\n" + "\"ruleId\": \"" + $("#ruleId").val() + "\",\n"
		+ " \"sourceName\": \"" + $("#sourceName").val() + "\",\n"
		+ " \"ruleActionStatusOld\": \"" + riskActionStatusOld + "\",\n"
		+ " \"ruleActionStatus\": \"" + ruleRecordStatus + "\",\n"
		+ " \"actionName\": \"" + actionName +  "\"\n"
		+ "}";

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize, iterationCount);

	var ciphertext = aesUtil.encrypt(reverseText(passphrase), rasString);
	$("#encryptedJson").val(ciphertext + ':~:' + passphrase);

	//alert("Final json is " + rasString);
	console.log(rasString);
	$("#verifyRule").submit();
});

/*Reject function*/
$("#reject").click(function() {
	
	var reasonCheck = $('#rejectReason').val();
		if (reasonCheck == '') {
			$('span[id^="reason-error"]').remove();
			$('#rejectReason').addClass('is-invalid');
			$('#rejectReason')
				.after(
					'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
		} else if (reasonCheck.length < 10) {
			$('span[id^="reason-error"]').remove();
			$('#rejectReason').addClass('is-invalid');
			$('#rejectReason')
				.after(
					'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
		} else {
			var reason = $('#rejectReason').val().replace(/(\r\n|\n|\r)/gm, "");
		
			var	actionName = $(this).attr("name");
			//alert("Action Name "+ actionName);
			var riskActionStatusOld = $('#oldActionStatus').val();
			document.getElementById('load').style.visibility = "visible";
			//Check table data
	
			
			if ($("#ruleRecordStatus").val() == 'Pending Verification For Creation') {
			
				ruleRecordStatus = 'ZR';
			} else if ($("#ruleRecordStatus").val() == 'Pending Approval For Creation') {
				
				ruleRecordStatus = 'ZR';
			} else if ($("#ruleRecordStatus").val() == 'Pending Verification For Edit') {
				ruleRecordStatus = 'EZ';
				
			} else if ($("#ruleRecordStatus").val() == 'Pending Approval For Edit') {
				ruleRecordStatus = 'EZ';
				
			} else if ($("#ruleRecordStatus").val() == 'Pending Approval For Value Captured') {
				ruleRecordStatus = 'ZR';
			}
			else if ($("#ruleRecordStatus").val() == 'Pending Verification For Closure') {
				ruleRecordStatus = 'XZ';
			}
			
			
			
				var statusFlgOld = $("#statusFlg").val();
				if ($("#statusFlg").val() == 'Active') {
					statusFlgOld = 'A';
				} else if ($("#statusFlg").val() == 'Pending for Approval') {
					statusFlgOld = 'D';
				} else if ($("#statusFlg").val() == 'Rejected') {
					statusFlgOld = 'R';
				} else if ($("#statusFlg").val() == 'Closed') {
					statusFlgOld = 'C';
				} else if ($("#statusFlg").val() == 'Edited') {
					statusFlgOld = 'E';
				}
				else if ($("#statusFlg").val() == 'Deleted') {
					statusFlgOld = 'X';
				}
	
				
				var ruleString = "{\n" + "  \"ruleId\": \""
					+ $("#ruleId").val() + "\",\n"
					+ " \"sourceName\": \""
					+ $("#sourceName").val() + "\",\n"
					+ " \"ruleActionStatusOld\":\""
					+ riskActionStatusOld + "\",\n"
					+ " \"ruleActionStatus\": \"" + ruleRecordStatus + "\",\n"
					+ " \"actionName\": \""
					+ actionName + "\",\n"
					+ "\"commentDto\":{\"comment\":\""
					+ reason + "\"}}";
	
				//alert("Json is "+ roleString);
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(
					128 / 8).toString(CryptoJS.enc.Hex);
				var aesUtil = new AesUtil(keySize,
					iterationCount);
				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), ruleString);
				$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
				
				console.log(ruleString);
				$("#verifyRule").submit();
		}
	
});
/*Reject function*/
