/*loader*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
});

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
$(document).ready(function() {

	var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}

});
$("#today").text(moment(new Date()).format('DD/MM/YYYY'));
/*loader*/

/*Data Tables Declarations*/

$(function() {
	$("#imtable").DataTable({
		"columnDefs": [{
			orderable: false
		}],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo('#imtable_wrapper .col-md-6:eq(0)');

});
/*Data Tables Declarations End*/

/*Search method*/
function searchData() {
	var searchParam = $('#dimension').find(":selected").val().replace(
		/(\r\n|\n|\r)/gm, "");
	var searchValue = $('#searchcriteria').val().toUpperCase().replace(
		/(\r\n|\n|\r)/gm, "");
	if (searchParam == '') {
		toastr.info('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.info('Please Add Some Value For Search');
	} else {
		
		var sortValue = $('#sorting').find(":selected").val();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam+ "\",\"searchValue\":\"" + searchValue
			+ "\",\"sortValue\":\"" + sortValue + "\"}";
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$("#searchForm").submit();
	}
}

$('#searchcriteria').keypress(function(e){
if ( e.which == 13 ) return false;
if ( e.which == 13 ) e.preventDefault();
});
/*Search method End*/





