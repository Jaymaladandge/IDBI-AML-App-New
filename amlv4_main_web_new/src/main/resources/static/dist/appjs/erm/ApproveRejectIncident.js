
/*Approve function*/
$("#approve").click(function() {
	
	var actionName = $(this).attr("name");
	
		var actionString = "{\n" +
						 " \"sourceId\": \""+ $("#sourceId").val() + "\",\n"+
						 " \"actionLinkStatus\": \""+ "L" + "\",\n"+ 
						" \"actionName\": \""+ actionName + "\",\n"+ 
						"\"sourceName\": \""+ $("#sourceName").val() + "\"\n"
		 				+ "}";

		
	console.log(actionString);

		var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(
				128 / 8).toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(
				reverseText(passphrase), actionString);
			$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
			$('#incidentActionForm').submit();
	});
/*Approve function*/


/*Reject function*/
$("#reject").click(function() {
	
	var actionName = $(this).attr("name");
	
		var actionString = "{\n" +
						 " \"sourceId\": \""+ $("#sourceId").val() + "\",\n"+
						 " \"actionLinkStatus\": \""+ "C" + "\",\n"+ 
						" \"actionName\": \""+ actionName + "\",\n"+ 
						"\"sourceName\": \""+ $("#sourceName").val() + "\"\n"
		 				+ "}";

		
	console.log(actionString);

		var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(
				128 / 8).toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(
				reverseText(passphrase), actionString);
			$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
			$('#incidentActionForm').submit();
	});
/*Reject function*/


