function formatDateToCustomFormat(date) {

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${day}-${month}-${year} ${hours}:${minutes}`;
}
function getModulePrimaryKey(recordId) {
	const currentdate = new Date();
	let day = "", month = "";
	const currentDay = currentdate.getDate();
	const currentMonth = currentdate.getMonth() + 1;
	if (currentDay < 10) {
		day = "0" + currentDay;
	} else {
		day = String(currentDay);
	}
	if (currentMonth < 10) {
		month = "0" + currentMonth;
	} else {
		month = String(currentMonth);
	}
	const year = currentdate.getFullYear();
	const date = day + month;
	const randNumFirst = generateRandomDigits(4);
	const randNumSecond = generateRandomDigits(4);

	return "RQE" + "/" + year + "/" + date + "/" + randNumFirst + randNumSecond;
}

function generateRandomDigits(n) {
	var m = Math.pow(10, n - 1);
	return m + Math.floor(Math.random() * (9 * m));
}

// Get Report Functionality
$("#getReport").click(function() {

	var validationFlag = false;
	var reqId;
	var fdt = $("#fdt").val();
	const fromDate = new Date(fdt);
	const date1 = formatDateToCustomFormat(fromDate);

	var fdt1 = $("#fdt1").val();
	const toDate = new Date(fdt1);
	const date2 = formatDateToCustomFormat(toDate);

	var setTimeOut = $("#setTimeOutHidden").val();
	var userIdHidden = $("#useridHidden").val();
	var userIdRole = $("#userRoleHidden").val();
	var username = $("#usernameHidden").val();

	var requestId = getModulePrimaryKey(reqId)
	if (fdt1 == "" && fdt == "") {
		toastr.info('Please Select Date');
		document.getElementById("getReport").disabled = false;
		validationFlag = false;

	} else if (fdt1 == "") {
		toastr.info('Please Select End Date');
		document.getElementById("getReport").disabled = false;
		validationFlag = false;
	}
	else if (fdt == "") {
		toastr.info('Please Select Start Date');
		document.getElementById("getReport").disabled = false;
		validationFlag = false;
	}

	else if (fdt != "" && fdt1 != "") {

		$('#tbodyTable').append('<tr><td width="" style="text-align: center;">' + userIdHidden + '</td>'
			+ '<td width="" style="text-align: center;">' + userIdRole + '</td>' + '<td width="" style="text-align: center;"><font class="text-capitalize">' + username + '</font></td>'
			+ '<td style="text-align: center;"><span class="badge bg-primary" >' + "Requested" + '</span></td>'
			+ '<td style="text-align: center;">' + date1 + '</td><td style="text-align: center;">' + date2 + '</td>'
			+ '<td style="text-align: center;"><span><a id="getProceed" data-requestId ="' + requestId + '" onclick="getProceed(this.getAttribute(\'data-requestId\'))" class="btn btn-sm bg-primary getProceedClass disabled" title="Proceed"><i class="fas fa-solid fa-glasses"></i></a></span></td>'
			+ '<td style="text-align: center;"><span><a id="getRefresh" data-requestId ="' + requestId + '" onclick="getRefresh(this.getAttribute(\'data-requestId\'))"  class="btn btn-sm bg-success " title="Refresh"><i class="fas fa-sync-alt"></i></a></span></td>'
			+ '<td style="text-align: center;"><span><a id="getCancel"  data-requestId ="' + requestId + '" onclick="getCancel(this)" class="btn btn-sm bg-warning getCancelClass" title="Cancel"><i class="fas fa-times"></i></a></span></td>'
			+ '</tr>');

		document.getElementById("getReport").disabled = true;
		validationFlag = true;

		var button = document.getElementById("getProceed");
		button.classList.add("disabled");
	}
	var pageValJson = "{"
		+ "\"alertStartDate\": \"" + date1 + "\",\n"
		+ "\"requestId\": \"" + requestId + "\",\n"
		+ "\"alertEndDate\": \"" + date2 + "\",\n"
		+ "\"userId\": \"" + userIdHidden + "\",\n"
		+ "\"userPosition\": \"" + userIdRole + "\",\n"
		+ "\"requestedBy\": \"" + username + "\"}";

	alert("pageValJson " + pageValJson);

	if (validationFlag) {
		$.ajax({
			url: 'fetchUserReportList',
			type: "POST",
			data: {
				pageValJson: pageValJson
			},
			headers: {
				"X-CSRF-TOKEN": $(
					"input[name='_csrf']")
					.val()
			},
			cache: false,
			success: function(response) {
				setTimeout(function() {
					document.getElementById("getCancel").disabled = true;
					$(".getCancelClass").addClass("disabled");
					$('#getProceed').addClass("disabled");
				}, setTimeOut);
			},
			error: function(xhr, status, error) {

				toastr
					.success('Some Error Occured');
			}
		});
	}
});

function getRefresh(id) {

	var requestId = id;
	var pageVal = "{" + "\"requestId\": \"" + requestId + "\"}";
	$.ajax({
		url: 'fetchReportCount',
		type: "POST",
		data: {
			pageValJson: pageVal
		},
		headers: {
			"X-CSRF-TOKEN": $(
				"input[name='_csrf']")
				.val()
		},
		cache: false,
		success: function(response) {
			var jsonResponse = JSON.stringify(response);
			console.log("status and req:=" + jsonResponse)
			var obj = JSON.parse(jsonResponse);
			if (obj.status == 'C') {
				document.getElementById("getProceed").disabled = true;
				$(".getProceedClass").removeClass("disabled");
				document.getElementById("getCancel").disabled = false;
				$(".getCancelClass").addClass("disabled");
			}
			else {
				toastr.success('Request is Processing');
			}
		}
	});
}

function getProceed(id) {
	var requestId = id;
	var pageVal = "{" + "\"requestId\": \"" + requestId + "\"}";
	var iterationCount = 1000;
	var keySize = 128;
	var passphrase = CryptoJS.lib.WordArray
		.random(128 / 8).toString(
			CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize,
		iterationCount);

	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), pageVal);

	$("#encryptedJsonSearch").val(
		ciphertext + ':~:' + passphrase);
	$("#searchAlertId").submit();

}
//cancel
function getCancel(clickedElement) {

	var requestId = clickedElement.getAttribute('data-requestId');
	var row = clickedElement.closest('tr');
	row.remove();
	document.getElementById("getReport").disabled = false;
	var pageValJson = "{" + "\"requestId\": \"" + requestId + "\"}";

	setTimeout(

		function() {
			$.ajax({
				url: 'cancleRequest',
				type: "POST",
				data: {
					pageValJson: pageValJson
				},
				headers: {
					"X-CSRF-TOKEN": $(
						"input[name='_csrf']")
						.val()
				},
				cache: false,
				success: function(response) {
				}
			});

		}, 1000);
}
// export
$('.export2')
	.click(
		function() {
			var jsonVariable = $("#exportActivityReportGson").val();
			var pageValJson = jsonVariable;
			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
				.toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
				pageValJson);
			$("#encryptedJsonExport").val(ciphertext + ':~:' + passphrase);
			$("#export").submit();

			document.getElementById('load').style.visibility = "hidden";
		});

// export
$('.getExportClass')
	.click(
		function() {

			var requestId = $(this).attr("id");

			$("#requestId").val(requestId);
			var pageVal = "{" + "\"requestId\": \"" + requestId + "\"}";
			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray
				.random(128 / 8).toString(
					CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize,
				iterationCount);
			var ciphertext = aesUtil.encrypt(
				reverseText(passphrase), pageVal);
			$("#encryptedJson").val(
				ciphertext + ':~:' + passphrase);

			alert("pageVal " + pageVal);
			$('#getExport').attr("method", "post");
			$('#getExport').attr("action", "exportOfflineAlert");
			$("#getExport").submit();

		});

