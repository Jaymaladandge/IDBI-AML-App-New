//search method
function formatDateToCustomFormat(date) {

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
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

$("#getReport").click(function() {

	var validationFlag = false;
	var reqId;

	var genDate = new Date();
	const reqDate = new Date(genDate);
	const requestDt = formatDateToCustomFormat(reqDate);


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
	//var requestIdLast=$("#requestIdHidden").val();

	var requestId = getModulePrimaryKey(reqId); // Call Random Funtion
	
	var fileName = 'No_File_Available';

	if (fdt1 == "" && fdt == "") {
		//alert("no start date end date");
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
			+ '<td style="text-align: center;">' + requestDt + '</td>'
			+ '<td style="text-align: center;">' + fileName + '</td>'
			+ '<td style="text-align: center;"><span><a id="getDownload"  data-requestId ="' + requestId + '" onclick="getDownload(this)" class="btn btn-sm bg-gray getDownloadClass disabled" title="Download"><i class="fas fa-download"></i></a></span></td>'

			+ '<td style="text-align: center;"><span><a id="getProceed" data-requestId ="' + requestId + '" onclick="getProceed(this.getAttribute(\'data-requestId\'))" class="btn btn-sm bg-gray getProceedClass disabled" title="Proceed"><i class="fas fa-solid fa-glasses"></i></a></span></td>'

			+ '<td style="text-align: center;"><span><a id="getRefresh" data-requestId ="' + requestId + '" onclick="getRefresh(this.getAttribute(\'data-requestId\'))"  class="btn btn-sm bg-success " title="Refresh"><i class="fas fa-sync-alt"></i></a></span></td>'

			+ '<td style="text-align: center;"><span><a id="getCancel"  data-requestId ="' + requestId + '" onclick="getCancel(this)" class="btn btn-sm bg-warning getCancelClass" title="Cancel"><i class="fas fa-times"></i></a></span></td>'


			+ '</tr>');


		document.getElementById("getReport").disabled = true;
		validationFlag = true;

		var button = document.getElementById("getProceed");
		button.classList.add("disabled");

		/*var refresh = document.getElementById("getRefresh");
		refresh.classList.add("disabled");*/

	}


	var pageValJson = "{"
		+ "\"alertStartDate\": \"" + date1 + "\",\n"
		+ "\"requestId\": \"" + requestId + "\",\n"
		+ "\"alertEndDate\": \"" + date2 + "\",\n"
		+ "\"requestedTime\": \"" + requestDt + "\",\n"
		+ "\"userId\": \"" + userIdHidden + "\",\n"
		+ "\"userPosition\": \"" + userIdRole + "\",\n"
		+ "\"requestedBy\": \"" + username + "\"}";

	//document.getElementById('load').style.visibility = "visible";


	if (validationFlag) {
		//alert("till here correct");
		$.ajax({
			url: 'fetchUserReportN',
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
			// async:true,
			success: function(response) {
				setTimeout(function() {

					//var refresh1 = document.getElementById("getRefresh");
					//refresh1.classList.remove("disabled");
					//alert("this method is called");

					document.getElementById("getCancel").disabled = true;
					//document.getElementsByClassName("getCancel").disabled = true;
					$(".getCancelClass").addClass("disabled");
					//alert("icon is now disabled")


					//$('[data-requestId="' + requestId + '"]').addClass("disabled");
					$('#getProceed').addClass("disabled");
					//	$('#getCancel').addClass("disabled");
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
	//alert("Request ID: " + requestId);
	var pageVal = "{" + "\"requestId\": \"" + requestId + "\"}";
	//alert("pageVal :" + pageVal);

	$.ajax({
		url: 'fetchReportCount',
		type: "POST",
		data: {
			pageValJson: pageVal
		},// important line for thymeleaf http security
		headers: {
			"X-CSRF-TOKEN": $(
				"input[name='_csrf']")
				.val()
		},
		cache: false,
		// async:true,
		success: function(response) {
			//alert("countjs");

			var jsonResponse = JSON.stringify(response);
			//alert(jsonResponse);
			console.log("status and req:=" + jsonResponse)
			var obj = JSON.parse(jsonResponse);

			//alert(obj.status);

			if (obj.status == 'C') {
				//var refresh1 = document.getElementById("getProceed");

				//th:data-requestId="${'getProceed~'+form.requestId}"
				//$('#getProceed' + requestId).removeClass("disabled");
				//$('[data-requestId="' + requestId + '"]').removeClass("disabled");
				document.getElementById("getProceed").disabled = true;
				//document.getElementsByClassName("getCancel").disabled = true;
				$(".getProceedClass").removeClass("disabled");

				document.getElementById("getCancel").disabled = false;
				//document.getElementsByClassName("getCancel").disabled = true;
				$(".getCancelClass").addClass("disabled");

				//refresh1.classList.remove("disabled");
				//refresh1.disabled = false;

				//				var icon = document.getElementById("getProceed");
				//				icon.classList.remove("btn btn-sm bg-primary");
				//
				//				icon.classList.add("btn btn-sm bg-secondary");
			}
			else {
				toastr.success('Request is Processing');
			}



		}

	});

}

function getProceed(id) {

	//var requestId = document.getElementById("getRefresh").getAttribute("data-requestId");
	//var requestId = document.getElementById("getProceed").getAttribute("id");

	var requestId = id;

	//\alert("Request ID: " + requestId);
	var pageVal = "{" + "\"requestId\": \"" + requestId + "\"}";
	//alert(pageVal);

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

	$("#encryptedJsonSearch").val(
		ciphertext + ':~:' + passphrase);
	//alert(pageVal);

$('#searchAlertId').attr("method", "post");
	$('#searchAlertId').attr("action", "fetchReportCountList");
	$("#searchAlertId").submit();

}

//cancel
function getCancel(clickedElement) {
	// Find the parent row of the clicked "Cancel" icon

	var requestId = clickedElement.getAttribute('data-requestId');

	//var requestId = id;

	//console.log("requestId: " + requestId);
	//alert(requestId);

	//alert("Request cancel");

	var row = clickedElement.closest('tr');


	// Remove the row from the table
	row.remove();


	//$("#id").remove(); 

	document.getElementById("getReport").disabled = false;


	var pageValJson = "{" + "\"requestId\": \"" + requestId + "\"}";
	//alert(pageValJson);

	setTimeout(

		function() {
			$.ajax({
				url: 'cancleRequest',
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
				// async:true,
				success: function(response) {


				}

			});

		}, 1000);
}

// export
$('.export')
	.click(
		function() {

			//alert("Function Called");
			var jsonVariable = $("#exportActivityReportGson").val();
			//alert("jsonVariable " + jsonVariable);
			//document.getElementById('load').style.visibility = "visible";

			//console.log("jsonVariable " + jsonVariable);
			var pageValJson = jsonVariable;
			//alert("pageValJson " + pageValJson);

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


function getDownload(id) {


	var requestId = id;

	$("#requestId").val(requestId);

	//alert("Request ID: " + requestId);
	var pageVal = "{" + "\"requestId\": \"" + requestId + "\"}";
	//alert(pageVal);

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

	$("#encryptedJsonSearch").val(
		ciphertext + ':~:' + passphrase);
	//alert(pageVal);

	$('#searchAlertId').attr("method", "post");
	$('#searchAlertId').attr("action", "exportOfflineAlertActivity");
	$("#searchAlertId").submit();

}




















