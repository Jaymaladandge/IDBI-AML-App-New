/*Loader*/
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
/*Loader*/

/*Initialize Select2 Elements*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});
/*Initialize Select2 Elements*/



$(document).ready(function() {
	
	
	var message = $('#message').val();
	if (message != "NA" ) {
		toastr.success(message);
	}

});

/*fetchDataBtn click function*/

$("#fetchDataBtn").click(function() {

	var userId = $("#userId").val();
	var pageValJson = "{\"userId\":" + "\"" + userId + "\"\n" + "}"
	document.getElementById('load').style.visibility = "visible";
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize,
		iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), pageValJson);
	$("#encryptedJson").val(
		ciphertext + ':~:' + passphrase);
	$("#frmUser").submit();
});

/*fetchDataBtn click function*/


/*EDIT USER*/

$(".editUser").click(
	function() {
		var userId = $(this).attr('id');
		var searchParam = "MODIFY";
		var pageValJson = "{\"userId\":" + "\"" + userId + "\",\n"
			+ "    \"searchParam\":\"" + searchParam + "\"\n" + "}";

		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJsonEdit")
			.val(ciphertext + ':~:' + passphrase);
		$("#editUserForm").submit();
	});
/*EDIT USER*/

