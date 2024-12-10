/**
 * 
 */
 document.onreadystatechange = function() {
			var state = document.readyState
			if (state == 'interactive') {
				document.getElementById('contents').style.visibility="visible";
			} else if (state == 'complete') {
				setTimeout(
						function() {
							//document.getElementById('interactive');
							document.getElementById('load').style.visibility = "hidden";
							//document.getElementById('contents').style.visibility="visible";
						}, 1000);
			}
		}
		
		$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});
function GetAccountDate(startDate) {
	var day = ("0" + startDate.getDate()).slice(-2);
	var month = ("0" + (startDate.getMonth() + 1)).slice(-2);


	var today = (day) + "-" + (month) + "-" + startDate.getFullYear();

	return today;

}


$(function() {
	var startDate = "";
	//Date range picker
	$('#bbeDate').datetimepicker({
		format: 'DD-MM-YYYY',



	});

	$("#custAcctDtls").DataTable({
		"columnDefs": [{
			orderable: true
			//targets: [6]
		}],
		"responsive": true,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		},

	}).buttons().container().appendTo(
		'#custAcctDtls_wrapper .col-md-6:eq(0)');


	$("#customerDtls").DataTable({
		"columnDefs": [{
			orderable: false
			//targets: [6]
		}],
		"responsive": true,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		},

	}).buttons().container().appendTo(
		'#customerDtls_wrapper .col-md-6:eq(0)');
		$("#custAcctPersonDtls").DataTable({
		"columnDefs": [{
			orderable: false
			//targets: [6]
		}],
		"responsive": true,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		},

	}).buttons().container().appendTo(
		'#custAcctPersonDtls_wrapper .col-md-6:eq(0)');


});
function validateTextArea(textArea, data) {
	let msg = "success";
	if (data == '') {
		msg = textArea + " cannot be blank.";
	} else if (data.length < 10) {
		msg = textArea + " should be greater than 10 letters.";
	} else if (data.includes(",")) {
		msg = textArea + " cannot contain special characters.";
	}

	 /*else if (/[!@#$%\^&*'"{}[\]\<>?|]/.test(data)) {
		msg = textArea + " cannot contain special characters.";
	}*/ else if (data.indexOf('\'') >= 0) {
		msg = textArea + " should not contains single quote.";
	}
	return msg;
}
var approveBtn = false;
	//APPROVE ACTION	
	$("#approve")
			.click(
					function() {
						approveBtn = true;
						var	actionName = $(this).attr("name");
						document.getElementById('interactive');
						document.getElementById('load').style.visibility = "visible";

						var requesterId = $("#requestorIdHidden").val();
						var recordStatusOld = $("#recordStatusHidden").val();
						var actionStatusOld = $("#actionStatusHidden").val();;
						var recordStatus="A";
						var actionStatus="AR";

						

						var actionString = "{\n" + "    \"requestorId\": \""
								+ requesterId + "\",\n"
								+ "    \"recordStatus\": \""
								+ recordStatus + "\",\n"
								+ "    \"actionStatus\": \""
								+ actionStatus + "\",\n"
								+"    \"recordStatusOld\":\""+recordStatusOld+ "\",\n"
								+ "    \"actionStatusOld\":\""
								+ actionStatusOld + "\"\n" + "}";
						var iterationCount = 1000;
						var keySize = 128;
						//passPhrase is the key
						var passphrase = CryptoJS.lib.WordArray.random(
								128 / 8).toString(CryptoJS.enc.Hex);

						var aesUtil = new AesUtil(keySize, iterationCount);
						var ciphertext = aesUtil.encrypt(
								reverseText(passphrase), actionString);
						$("#encryptedJson").val(
								ciphertext + ':~:' + passphrase);

						$('#frmAction').submit();
					});

	 $("#reject")
			.click(
					function() {
						
						approveBtn = true;
						var	actionName = $(this).attr("name");
						document.getElementById('interactive');
						document.getElementById('load').style.visibility = "visible";

						var	actionName = $(this).attr("name");
						document.getElementById('interactive');
						document.getElementById('load').style.visibility = "visible";

						var requesterId = $("#requestorIdHidden").val();
						var recordStatusOld = $("#recordStatusHidden").val();
						var actionStatusOld = $("#actionStatusHidden").val();;
						var recordStatus="Z";
						var actionStatus="ZR";
						

						var actionString = "{\n" + "    \"requestorId\": \""
						+ requesterId + "\",\n"
						+ "    \"recordStatus\": \""
						+ recordStatus + "\",\n"
						+ "    \"actionStatus\": \""
						+ actionStatus + "\",\n"
						+"    \"recordStatusOld\":\""+recordStatusOld+ "\",\n"
						+ "    \"actionStatusOld\":\""
						+ actionStatusOld + "\"\n" + "}";
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(
						128 / 8).toString(CryptoJS.enc.Hex);

				var aesUtil = new AesUtil(keySize, iterationCount);
				var ciphertext = aesUtil.encrypt(
						reverseText(passphrase), actionString);
				$("#encryptedJson").val(
						ciphertext + ':~:' + passphrase);

				$('#frmAction').submit();
						

					}); 
						$('#cancelmodel').on('show.bs.modal', function (event) {
		  var button = $(event.relatedTarget) 
		  var recipient = button.data('whatever') 
		  var modal = $(this)
		  $('a.target').attr('href', recipient);
		  
		})