/**
 * 
 */
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

$(function() {
	$("#kriVcVerificationtable").DataTable({
		"columnDefs": [{
			orderable: false,

		}],
		"order": [5, "desc"],
		"responsive": false,
		"autoWidth": true,
		"pagging":"false",
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#usertable_wrapper .col-md-6:eq(0)');
});
$(document).ready(function() {
	var inputDisableFlg = true;
	$(document).on('click', '.editBtn', function() {
		var assmentId = $(this).attr("data-custom-value");


		if (inputDisableFlg) {
			$('#' + assmentId).attr("disabled", false);
			$('#' + assmentId).prop('disabled', false);
			inputDisableFlg = false;
		} else {
			$('#' + assmentId).attr("disabled", true);
			$('#' + assmentId).prop('disabled', true);
			inputDisableFlg = true;
		}

	});
});
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	//var recipient = $('#datasource').val()
	var modal = $(this)
	$('a.target').attr('href', recipient);

})
$("#update_btn")
	.click(
		function(e) {
			//if ($("#frmKriVcVerification").valid()) {
			//document.getElementById('load').style.visibility = "visible";
			var moduleData = "";
			var assessmentValue = "";
			var checkboxSelectValidation = false;
			var validationFlg = false;
			var moduleId = "";
			$('input:checkbox[name=moduleValueId]')
				.each(
					function() {
						if ($(this).is(':checked')) {
							var assessmentValueTemp = $(this).val().split("~")[0];
							moduleId = $(this).attr("moduleId");
							moduleData = moduleData + $(this).val() + "~" + $('#' + assessmentValueTemp).val() + ","
							if ($('#' + assessmentValueTemp).val() === '' || $('#' + assessmentValueTemp).val() === null || typeof $('#' + assessmentValueTemp).val() === "undefined") {
								validationFlg = true;
								toastr.error("Assessment value cannot be blank");

							}
						}

					});
			moduleData = moduleData.substring(0, moduleData.length - 1);
	
			//}
			//console.log(moduleData);
			//var apString = "{\"moduleValueId\":\"" + moduleData+ "\"}";
			var apString = "{\"moduleValueId\":\"" + moduleData + "\",\n"
				+ "\"moduleId\":\"" + moduleId + "\",\n"
				+ "\"sourceId\":\"" + $("#sourceId").val() + "\"}";
//alert(apString);
			//var apString=""
			if ($('input[name=moduleValueId]:checked').length <= 0) {
				checkboxSelectValidation = true;
				toastr.error("Select atleast one Checkbox");
			}
			if (checkboxSelectValidation) {
				document.getElementById('load').style.visibility = "hidden";
				e.preventDefault();
			}
			if (validationFlg) {
				document.getElementById('load').style.visibility = "hidden";
				e.preventDefault();
			}
			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(
				128 / 8).toString(CryptoJS.enc.Hex);

			var aesUtil = new AesUtil(keySize, iterationCount);

			var ciphertext = aesUtil.encrypt(
				reverseText(passphrase), apString);

			$("#encryptedJson").val(
				ciphertext + ':~:' + passphrase);
			if (checkboxSelectValidation === false && validationFlg === false) {
				$("#frmKriVcVerification").submit();
			}

		});
	$("#checkAll").click(function() {
		
			$('input:checkbox').not(this).prop('checked', this.checked);
		});
		
		
$("#exportDataBtn").click(function() {
	
	
	var pageValJson = "";
	var moduleData = "";
			var assessmentValue = "";
			var checkboxSelectValidation = false;
			var validationFlg = false;
			var moduleId = "";
			$('input:checkbox[name=moduleValueId]')
				.each(
					function() {
						if ($(this).is(':checked')) {
							var assessmentValueTemp = $(this).val().split("~")[0];
							moduleId = $(this).attr("moduleId");
							moduleData = moduleData + $(this).val() + "~" + $('#' + assessmentValueTemp).val() + ","
							if ($('#' + assessmentValueTemp).val() === '' || $('#' + assessmentValueTemp).val() === null || typeof $('#' + assessmentValueTemp).val() === "undefined") {
								validationFlg = true;
								toastr.error("Assessment value cannot be blank");

							}
						}

					});
			moduleData = moduleData.substring(0, moduleData.length - 1);
	
		
			
			var pageValJson =  "{\"moduleId\":\"" + moduleId + "\",\n"
				+ "\"sourceId\":\"" + $("#sourceId").val() + "\"}";
				

	
			
				

			document.getElementById('load').style.visibility = "disable";
var iterationCount = 1000;
								var keySize = 128;
								//passPhrase is the key
								var passphrase = CryptoJS.lib.WordArray.random(
										128 / 8).toString(CryptoJS.enc.Hex);

								var aesUtil = new AesUtil(keySize,
										iterationCount);

								var ciphertext = aesUtil.encrypt(
										reverseText(passphrase), pageValJson);

								$("#encryptedJsonEdit").val(
										ciphertext + ':~:' + passphrase);
										$("#frmpendingKRIVCReport").submit();
										document.getElementById('load').style.visibility = "disable";

	
});
