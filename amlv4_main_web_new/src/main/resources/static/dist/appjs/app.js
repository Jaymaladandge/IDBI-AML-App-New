function encrypt(plaintext) {

	/* encryption start */
	var iterationCount = 1000;
	var keySize = 128;

	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

	var four = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
	var salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize, iterationCount);

	var ciphertext = aesUtil.encrypt(salt, four, passphrase, plaintext);
	//var ciphertextpassword = aesUtil.encrypt(salt, four, passphrase, passwd);
	return ciphertext;

}

function reverseText(plaintext) {
	var reverseWord = plaintext.split("").reverse().join("");
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	today = yyyy+ '-' + mm + '-' + dd;
	//console.log(today);
	return reverseWord + today;
}