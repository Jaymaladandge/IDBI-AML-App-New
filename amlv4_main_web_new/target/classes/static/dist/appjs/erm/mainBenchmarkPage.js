
/*loader*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
});

document.onreadystatechange = function() {
	document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}


/*Data Tables Declarations*/
$(function() {
	$("#bmNtftable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [8]
		}],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#bmNtftable_wrapper .col-md-6:eq(0)');

});
/*Data Tables Declarations End*/


$(document).ready(function() {
	var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}
});
/*Edit Role*/
$(".captureBm").click(function() {
	var ofcCode = $(this).attr('octyp');
			var asstId = 'assessmentValue'+$(this).attr('id')+ofcCode;
			
			if ($('#' + asstId).val() == null || $('#' + asstId).val() == '') {
				toastr.error("Assessment Value cannot be empty");
			} else {
		
	var bmId = $(this).attr('id');
	var deptId = $(this).attr('dtyp');
	var ofcType = $(this).attr('otyp');
	var ofcCode = $(this).attr('octyp');
	var fiscalyear = "";
	var today = new Date();
	if ((today.getMonth() + 1) <= 3) {
		var year = today.getFullYear();
		year = year.toString().trim().substring(2, 4);
		fiscalyear = (today.getFullYear() - 1) + "-" + year
	} else {
		var fullyear = today.getFullYear() + 1;
		fullyear = fullyear.toString().trim().substring(2, 4);
		fiscalyear = today.getFullYear() + "-" + fullyear.toString().slice(2);
	}
	 
	//var assessmentValue = $('#assessmentValue').val();

	var pageValJson = "{\n" +
		"    \"bmId\": \"" + bmId + "\",\n" +
		"    \"deptId\":\"" + deptId + "\",\n" +
		"    \"officeType\":\"" + ofcType + "\",\n" +
		"    \"officeCode\":\"" + ofcCode + "\",\n" +
		"    \"financialYear\":\"" + fiscalyear + "\",\n" +
		"    \"assessmentValue\":\"" + $('#' + asstId).val() + "\"}";

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase), pageValJson);
	$("#encryptedJsonEdit").val(ciphertext + ':~:' + passphrase);
	$("#vcBmForm").submit();
		
	}
	
	
});
/*Edit Role End*/


/*View Benchmark Modal*/
$('a.viewBenchmark').click(function() {
	var bmId = $(this).attr('id');
	$('#paramId').val(bmId);
	var value = "{\"bmId\":" + "\"" + bmId
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
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$.ajax({
		url: 'viewBenchmark',
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
		success: function(response) {
			setTimeout(function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);

			$('#recordStatus').val(obj.bmRecordStatus);
			$('#bmNameM').val(obj.bmName);
			$('#bmDescriptionM').val(obj.bmDescription);
			$('#bmApplicableOfficeM').val(obj.applicableOffice);
			$('#bmDatatypeM').val(obj.bmDatatype);
			$('#bmValueM').val(obj.bmValue);
			$('#bmAssessmentPeriodM').val(obj.bmAssessmentPeriod);

			//const ofc = obj.applicableOffice.split(",");
			var ofc = obj.applicableOffice.split(",");
			Object.keys(ofc).forEach(function(key) {
				$("<input  class='form-check-input' type='checkbox' name='applicableOffice' checked=true disabled/>"
					+ "<label class='font-weight-normal'>"
					+ ofc[key]
					+ "&nbsp;</label><br/>").appendTo(".ofcName");
			});


			var fileFlg = true;
			obj.filedetails.forEach(function(item) {
				fileFlg = false;
				$('#filedetails tr:last').after(
					'<tr><td>'
					+ item.fileName
					+ '</td>'
					+ '<td>'
					+ item.fileSize
					+ '</td>'
					+ '<td>'
					+ item.uploadTimestamp
					+ '</td>'
					+ '<td class="text-capitalize">'
					+ item.uploadedBy
					+ '</td>'
					+ '<td><a name=' + item.fileName + ' href="#"'
					+ ' class="btn btn-info downloadfile"><i'
					+ ' class="fas fa-download"></i></a></td></tr>');
			});
			if (fileFlg) {
				$('#filedetails').hide();
			} else {
				var seen = {};
				$('#filedetails tr').each(function() {
					var txt = $(
						this)
						.text();
					if (seen[txt])
						$(this)
							.remove();
					else
						seen[txt] = true;
				});
				$('#filedetails').show();
			}
			$('#viewBenchmarkmodal').modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.success('Some Error Occured');
		}
	});
});
/*View Benchmark Modal*/