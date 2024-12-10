
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
	$("#testSummarytable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [0, 1, 4, 5, 6]
		}],
		"order": [3, "desc"],
		"responsive": false,
		"lengthMenu": [10, 25, 50, 75, 100],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"buttons": ["csv", "excel", "pdf", "print"],
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#testSummarytable_wrapper .col-md-6:eq(0)');
});

$(document).ready(function() {
	var message = $('#message').val();
	if (message == "ERROR") {
		toastr.error("Some Error Occurred");
	} else if (message != '' && message != undefined) {
		toastr.success(message);
	}
});
//

$(".verifyEdd").click(
	function() {
		var eddId = $(this).attr('id');
		var pageValJson = "{\"testId\":" + "\"" + eddId + "\"}"; 
		$("#encryptedJsonEdit").val(pageValJson);
		$("#eddForm").submit();
	});

$(".editEdd").click(
	function() {
		var eddId = $(this).attr('id');
		var pageValJson = "{\"testId\":" + "\"" + eddId + "\"}"; 
		$("#eddForm").attr('action', 'editEdd');
		$("#encryptedJsonEdit").val(pageValJson);
		$("#eddForm").submit();
	});

function searchData() {
	var searchParam = $('#searchParam').find(":selected").val().replace(
		/(\r\n|\n|\r)/gm, "");
	var searchValue = $('#searchcriteria').val().toUpperCase().replace(
		/(\r\n|\n|\r)/gm, "");
	if (searchParam == '') {
		toastr.info('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.info('Please Add Some Value For Search');
	} else {
		if (searchParam == 'testStatus') {
			if (searchValue.includes('CREATE')) {
				searchValue = 'C';
			} else if (searchValue.includes('EDIT')) {
				searchValue = 'E';
			} else {
				searchValue = searchValue.charAt(0);
				if (searchValue == 'D') {
					searchValue = 'X';
				} else if (searchValue == 'P') {
					searchValue = 'D';
				}
			}
		}
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam
			+ "\",\"searchValue\":\"" + searchValue + "\"}";
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
$('#searchcriteria').keypress(function(event) {
	if (event.keyCode === 10 || event.keyCode === 13) {
		event.preventDefault();
	}
});