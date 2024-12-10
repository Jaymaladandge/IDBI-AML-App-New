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
	$("#requestDtNew").val(requestDt);


	var fdt = $("#fdt").val();
	const fromDate = new Date(fdt);
	const date1 = formatDateToCustomFormat(fromDate);
	$("#date1New").val(date1);


	var fdt1 = $("#fdt1").val();
	const toDate = new Date(fdt1);
	const date2 = formatDateToCustomFormat(toDate);
	$("#date2New").val(date2);

	var userIdHidden = $("#useridHidden").val();
	var userIdRole = $("#userRoleHidden").val();
	var username = $("#usernameHidden").val();
	//var requestIdLast=$("#requestIdHidden").val();

	var requestId = getModulePrimaryKey(reqId);
	$("#requestIdNew").val(requestId);


	var selectedOption = document.getElementById("states").value;
	$("#selectedOptionNew").val(selectedOption);
	//alert(selectedOption);

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
	else if (selectedOption == "") {

		toastr.info('Please select State');
		document.getElementById("getReport").disabled = false;
		validationFlag = false;

	} else {

		var pageValJson;


		pageValJson = "{"
			+ "\"userId\": \"" + userIdHidden + "\",\n"
			+ "\"alertStartDate\": \"" + date1 + "\",\n"
			+ "\"alertEndDate\": \"" + date2 + "\",\n"
			+ "\"requestedTime\": \"" + requestDt + "\",\n"
			+ "\"userPosition\": \"" + userIdRole + "\",\n"
			+ "\"requestedBy\": \"" + username + "\",\n"
			+ "\"requestId\": \"" + requestId + "\",\n"
			+ "\"branchState\": \"" + selectedOption + "\"}";

		//alert(pageValJson);
		document.getElementById("getReport").disabled = true;
		validationFlag = true;

		//alert(validationFlag);
	}


	//alert(validationFlag);
	if (validationFlag) {
		
		document.getElementById('load').style.visibility = "visible";


		$.ajax({
			url: 'fetchStateWiseCount',
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
					document.getElementById('load').style.visibility = "hidden";
				}, 1);

				//console.log(response); // Check the console for the raw response
				var jsonResponse = JSON.stringify(response);

				var obj = JSON.parse(jsonResponse);


				$('#alertCountBody').append('<tr>'
					+ '<td width="" style="text-align: center;">' + obj.alertCount + '</td>'
					+ '<td width="" style="text-align: center;">' + obj.strCount + '</td>'
					+ '<td width="" style="text-align: center;"><a title="fetchRequest" class="btn btn-sm bg-pink"><i class="fas fa-arrow-right" id="forwordRequest" onclick="forwordRequest(this.getAttribute(\'data-requestId\'))"></i></a></td>'
					+ '</tr>');



				$('#exampleModal').modal('show');

			},
			error: function(xhr, status, error) {

				hideLoader();

				toastr
					.info('Some Error Occured');
			}


		});


	}


});

function forwordRequest(id) {

	//alert(forwordRequest);
	$('#exampleModal').modal('hide');

	var requestId = $("#requestIdNew").val();
	var requestDt = $("#requestDtNew").val();
	var date1 = $("#date1New").val();
	var date2 = $("#date2New").val();
	var userIdHidden = $("#useridHidden").val();
	var userIdRole = $("#userRoleHidden").val();
	var username = $("#usernameHidden").val();
	var selectedOption = $("#selectedOptionNew").val();

	var fileName = 'No_File_Available';

	$('#tbodyTable').append('<tr><td width="" style="text-align: center;">' + userIdHidden + '</td>'
		+ '<td width="" style="text-align: center;">' + userIdRole + '</td>' + '<td width="" style="text-align: center;"><font class="text-capitalize">' + username + '</font></td>'
		+ '<td style="text-align: center;"><span class="badge bg-primary status" ><a data-requestId ="' + requestId + '" >' + "Requested" + '</a></span></td>'
		+ '<td style="text-align: center;">' + date1 + '</td><td style="text-align: center;">' + date2 + '</td>'
		+ '<td style="text-align: center;">' + requestDt + '</td>'
		+ '<td style="text-align: center;">' + fileName + '</td>'
		+ '<td style="text-align: center;"><span><a id="getDownload"  data-requestId ="' + requestId + '" onclick="getDownload(this)" class="btn btn-sm bg-gray getDownloadClass disabled" title="Download"><i class="fas fa-download"></i></a></span></td>'

		+ '<td style="text-align: center;"><span><a id="getProceed" data-requestId ="' + requestId + '" onclick="getProceed(this.getAttribute(\'data-requestId\'))" class="btn btn-sm bg-gray getProceedClass disabled" title="Proceed"><i class="fas fa-solid fa-glasses"></i></a></span></td>'

		+ '<td style="text-align: center;"><span><a id="getRefresh" data-requestId ="' + requestId + '" onclick="getRefresh(this.getAttribute(\'data-requestId\'))"  class="btn btn-sm bg-success " title="Refresh"><i class="fas fa-sync-alt"></i></a></span></td>'

		+ '<td style="text-align: center;"><span><a id="getCancel"  data-requestId ="' + requestId + '" onclick="getCancel(this)" class="btn btn-sm bg-warning getCancelClass" title="Cancel"><i class="fas fa-times"></i></a></span></td>'


		+ '</tr>');


	var pageValJson;


	pageValJson = "{"
		+ "\"userId\": \"" + userIdHidden + "\",\n"
		+ "\"alertStartDate\": \"" + date1 + "\",\n"
		+ "\"alertEndDate\": \"" + date2 + "\",\n"
		+ "\"requestedTime\": \"" + requestDt + "\",\n"
		+ "\"userPosition\": \"" + userIdRole + "\",\n"
		+ "\"requestedBy\": \"" + username + "\",\n"
		+ "\"requestId\": \"" + requestId + "\",\n"
		+ "\"branchState\": \"" + selectedOption + "\"}";


	$.ajax({
		url: 'insertStateWiseRequest',
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

			//console.log(response); // Check the console for the raw response
			
			setTimeout(function() {

					//var refresh1 = document.getElementById("getRefresh");
					//refresh1.classList.remove("disabled");
					//alert("this method is called");

					document.getElementById("getCancel").disabled = true;
					//document.getElementsByClassName("getCancel").disabled = true;
					$(".getCancelClass").addClass("disabled");
					$(".getCancelClass").prop("disabled", true);

					//alert("icon is now disabled")


					//$('[data-requestId="' + requestId + '"]').addClass("disabled");
					$('#getProceed').addClass("disabled");
					//	$('#getCancel').addClass("disabled");
				}, setTimeOut);
		

		},
		error: function(xhr, status, error) {

			hideLoader();

			toastr
				.info('Some Error Occured');
		}


	});


}

function getCancel(clickedElement) {
	// Find the parent row of the clicked "Cancel" icon

	var requestId = clickedElement.getAttribute('data-requestId');

	var row = clickedElement.closest('tr');


	row.remove();

	document.getElementById("getReport").disabled = false;


	var pageValJson = "{" + "\"requestId\": \"" + requestId + "\"}";
	//alert(pageValJson);

	setTimeout(

		function() {
			$.ajax({
				url: 'cancelStateRequest',
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

function getRefresh(id) {


	var requestId = id;
	//alert("Request ID: " + requestId);
	var pageVal = "{" + "\"requestId\": \"" + requestId + "\"}";
	//alert("pageVal :" + pageVal);

	$.ajax({
		url: 'fetchStateWiseStatus',
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
			var obj = JSON.parse(jsonResponse);
			var statusElement = document.querySelector('span a[data-requestId="' + requestId + '"]');

			if (obj.status == 'C') {

				document.getElementById("getProceed").disabled = true;

				$(".getProceedClass").removeClass("disabled");
				$(".getProceedClass").prop("disabled", true);

				document.getElementById("getCancel").disabled = false;

				$(".getCancelClass").addClass("disabled");

				statusElement.classList.remove('badge');

				statusElement.textContent = 'Completed';
				statusElement.className = 'badge btn-sm bg-success ';


			} else if (obj.status == 'R') {

				document.getElementById("getProceed").disabled = false;

				$(".getProceedClass").addClass("disabled");
				$(".getProceedClass").prop("disabled", false);

				document.getElementById("getCancel").disabled = false;

				$(".getCancelClass").addClass("disabled");

				statusElement.classList.remove('badge');

				statusElement.textContent = 'Pending';
				statusElement.className.add("badge", "bg-warning");

				toastr.danger('Request is Processing');

			}
			else {
				toastr.warning('Request is Processing');
			}

		}

	});

}

function getProceed(id) {

	var requestId = id;

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

	$("#encryptedJsonSearch").val(
		ciphertext + ':~:' + passphrase);
	//alert(pageVal);

	$('#searchAlertId').attr("method", "post");
	$('#searchAlertId').attr("action", "fetchStateWiseReportCount");
	$("#searchAlertId").submit();

}



function getExport() {

	//alert("in export");

	var requestId = $("#requestId").val();

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

	$("#encryptedJson").val(
		ciphertext + ':~:' + passphrase);
	//alert(pageVal);

	$("#getExport").submit();

}

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
	$('#searchAlertId').attr("action", "exportOfflineStateAlert");
	$("#searchAlertId").submit();

}

