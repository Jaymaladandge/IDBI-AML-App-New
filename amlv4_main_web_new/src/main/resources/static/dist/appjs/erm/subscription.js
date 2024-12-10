/**
 * 
 */
$(document).ready(
		function() {

			makeid();

			function pad2(n) {
				return (n < 10 ? '0' : '') + n;
			}

			$("#activationDate").change(
					function() {

						var amcFrequency = $('#amcFrequency').val();
						if (amcFrequency == "") {
							alert("Please Enter AMC Frequencye");
						} else {
							if ($("#amcFrequency").val() == "D") {
								var Num_of_days = 1;
							} else if ($("#amcFrequency").val() == "W") {
								var Num_of_days = 7;
							} else if ($("#amcFrequency").val() == "F") {
								var Num_of_days = 14;
							} else if ($("#amcFrequency").val() == "M") {
								var Num_of_days = 30;
							} else if ($("#amcFrequency").val() == "H") {
								var Num_of_days = 180;
							} else if ($("#amcFrequency").val() == "Y") {
								var Num_of_days = 365;
							}
							var activedate = $('#activationDate').val();
							var d = new Date(activedate);
							var StartDate = d.getFullYear() + '-'
									+ pad2(d.getMonth() + 1) + '-'
									+ pad2(d.getDate());
							$("#amcStartDate").val(StartDate);
							$("#amcStartDate").prop('disabled', true);

							var toDate = new Date();
							toDate.setDate(d.getDate() + Num_of_days);
							toDate.setMonth(d.getMonth() + 1);
							var amcStartDate = toDate.getFullYear() + '-'
									+ pad2(toDate.getMonth()) + '-'
									+ pad2(toDate.getDate() - 1);
							$("#amcExpDate").val(amcStartDate);
							$("#amcExpDate").prop('disabled', true);
						}
					});

			$("#amcFrequency").change(
					function() {
						var activedate = $('#activationDate').val();
						if (activedate == "") {
							alert("Please Enter Activation Date");
						} else {
							if ($("#amcFrequency").val() == "D") {
								var Num_of_days = 1;
							} else if ($("#amcFrequency").val() == "W") {
								var Num_of_days = 7;
							} else if ($("#amcFrequency").val() == "F") {
								var Num_of_days = 14;
							} else if ($("#amcFrequency").val() == "M") {
								var Num_of_days = 30;
							} else if ($("#amcFrequency").val() == "H") {
								var Num_of_days = 180;
							} else if ($("#amcFrequency").val() == "Y") {
								var Num_of_days = 365;
							}
							var activedate = $('#activationDate').val();
							var d = new Date(activedate);
							var StartDate = d.getFullYear() + '-'
									+ pad2(d.getMonth() + 1) + '-'
									+ pad2(d.getDate());
							$("#amcStartDate").val(StartDate);
							$("#amcStartDate").prop('disabled', true);

							var toDate = new Date();
							toDate.setDate(d.getDate() + Num_of_days);
							toDate.setMonth(d.getMonth() + 1);
							var amcStartDate = toDate.getFullYear() + '-'
									+ pad2(toDate.getMonth()) + '-'
									+ pad2(toDate.getDate() - 1);
							$("#amcExpDate").val(amcStartDate);
							$("#amcExpDate").prop('disabled', true);
						}
					});

		});

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

function makeid() {

	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var result = ""
	var charactersLength = characters.length;

	for (var i = 0; i < 12; i++) {

		result += characters.charAt(Math
				.floor(Math.random() * charactersLength));

	}
	$("#licenseid").val(result);
	return result;

}

var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
		var flg = true;
		$('.uploadTable tr').each(function() {
			var fName = $(this).find('td:eq(0)').text();
			console.log('fName ' + fName + ' filename ' + filename);
			if (fName == filename) {
				flg = false;
			}
		});
		if (flg) {
			select
					.append($('<tr id=tr'
							+ i
							+ '><td id=filetd'
							+ i
							+ '>'
							+ filename
							+ '</td><td id=filesizetd'
							+ i
							+ '>'
							+ filesizeInMB
							+ ' kb</td><td>'
							+ moment(new Date()).format('DD/MM/YYYY')
							+ '</td><td> Self </td><td class="project-actions text-right"><a class="btn btn-danger btn-sm" id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
		$('#filedetailsheader').show();
	}
}

$(".uploadTable").on("click", "#closerow", function() {
	var rowCount = $('.uploadTable tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#filedetails').hide();
		$('#filedetailsheader').hide();
	}
	$(this).closest("tr").remove();
});

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
});

$('#fetchLicense').click(function() {
	document.getElementById('licenseid').value = "";
});

$("#create").click(function() {
	// alert("create ...");
	if ($("#licenseid").val() == "") {
		alert("Please Enter License Id");
	} else if ($("#productname").val() == "") {
		alert("Please Enter Product Name");
	} else if ($("#licenseUploadDate").val() == "") {
		alert("Please Enter License Upload Date");
	} else if ($("#activationDate").val() == "") {
		alert("Please Enter Activation Date");
	} else if ($("#warrenty").val() == "") {
		alert("Please Enter Warrenty");
	} else if ($("#amcStartDate").val() == "") {
		alert("Please Enter AMC Start Date");
	} else if ($("#amcFrequency").val() == "") {
		alert("Please select AMC Frequency");
	} else if ($("#amcExpDate").val() == "") {
		alert("Please Enter AMC Expiry Date");
	} else if ($("#licenseStatus").val() == "") {
		alert("Please select License Status");
	} else if ($("#customFile").val() == "") {
		alert("Please upload License");
	} else {
		$('#confirmmodal').modal('show');
	}
});

// submitLicense

$("#submitLicense").click(
		function() {

			// alert("okay");
			document.getElementById('load').style.visibility = "visible";

			// Check table data
			var filedetails = "[\n";
			if ($('#filedetails tr').length > 0) {
				$('#filedetails > tbody  > tr').each(
						function(index, value) {
							var splitvalue = $(this).find('td:eq(0)').text()
									.split('.');
							var sizesplit = $(this).find('td:eq(1)').text()
									.split(' ');
							filedetails = filedetails + "  {  \"fileName\": \""
									+ $(this).find('td:eq(0)').text() + "\",\n"
									+ "    \"fileSize\": \"" + sizesplit[0]
									+ "\",\n" +

									"    \"fileType\": \"" + splitvalue[1]
									+ "\"\n" + " },";

						});
				// filedetails = filedetails.slice(0,-1);
				filedetails = filedetails.substring(0, filedetails.length - 1);
			}
			filedetails = filedetails + "]";

			var licenseString = "{\n" + "    \"licenseid\": \""
					+ $("#licenseid").val() + "\",\n"
					+ "    \"productname\": \"" + $("#productname").val()
					+ "\",\n" + "    \"licenseuploaddate\":\""
					+ $("#licenseUploadDate").val() + "\",\n"
					+ "    \"activationdate\":\"" + $("#activationDate").val()
					+ "\",\n" + "    \"warrenty\":\"" + $("#warrenty").val()
					+ "\",\n" + "    \"amcstartdate\":\""
					+ $("#amcStartDate").val() + "\",\n" + "    \"amcfreq\":\""
					+ $("#amcFrequency").val() + "\",\n"
					+ "    \"amcexpdate\":\"" + $("#amcExpDate").val()
					+ "\",\n" + "    \"licensestatus\":\""
					+ $("#licenseStatus").val() + "\",\n"
					+ " \"filedetailsList\":" + filedetails + "\n" + "}";

			// console.log(licenseString)
			// alert("kriString :" + licenseString);
			var iterationCount = 1000;
			var keySize = 128;
			// passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(
					CryptoJS.enc.Hex);

			var aesUtil = new AesUtil(keySize, iterationCount);

			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
					licenseString);

			$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
			// console.log($("#encryptedJson").val());
			$("#frmlicense").submit();

		});

$("#warrenty")
		.keypress(
				function(e) {
					// if the letter is not digit then display error and don't
					// type
					// anything
					$("#errmsg").hide();

					if (e.which != 8 && e.which != 0 && e.which != 13
							&& (e.which < 48 || e.which > 57)) {
						// display error message
						$("#errmsgwarrenty").html("Digits Only").show()
								.fadeOut("slow");
						return false;
					}
				});
