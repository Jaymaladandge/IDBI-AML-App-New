
function formatDateToCustomFormat(date) {

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function getPrimaryKey(recordId) {
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

	console.log("RQE" + "/" + year + "/" + date + "/" + randNumFirst + randNumSecond);
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

let date1=null;
let date2=null;

	var fdt = $("#fdt").val();
	
	//alert(fdt);
	
	if(fdt==null){
		
		 date1=fdt;
		
	}else{
		
		const fromDate = new Date(fdt);
	 date1 = formatDateToCustomFormat(fromDate);
	$("#date1New").val(date1);
	//alert('date1: '+date1);
		
	}
	


	var fdt1 = $("#fdt1").val();
	//alert(fdt1);
	if(fdt1==null){
		
		 date2=fdt1;
		
	}else{
		
		const toDate = new Date(fdt1);
	//alert(toDate);
	 date2 = formatDateToCustomFormat(toDate);
	//alert('date2: '+date2);
	$("#date2New").val(date2);
	}
	


	var accOrCustList = $("#ListValue").val();
	//alert('accOrCustList: '+accOrCustList);

	var setTimeOut = $("#setTimeOutHidden").val();
	//alert(setTimeOut);

	var userIdHidden = $("#useridHidden").val();

	var userIdRole = $("#userRoleHidden").val();

	var username = $("#usernameHidden").val();

	var requestId = getPrimaryKey(reqId);

	var fileName = 'No_File_Available';


	if (accOrCustList == "") {

		toastr.info('Please select Account No or Customer List');
		document.getElementById("getReport").disabled = false;
		validationFlag = false;

	}/*else if(accOrCustList != "" && fdt != "" && fdt1== ""){
		
		toastr.info('Please select End Date');
		document.getElementById("getReport").disabled = false;
		validationFlag = false;
		
		
	}
	else if(accOrCustList != "" && fdt == "" && fdt1 != ""){
		
		toastr.info('Please select Start Date');
		document.getElementById("getReport").disabled = false;
		validationFlag = false;
		
		
	}
	else if(accOrCustList != "" && fdt != "" && fdt1 != ""){
		
		toastr.info('Please select Start Date both are selected for testing');
		document.getElementById("getReport").disabled = false;
		validationFlag = false;
		
		
	}*/
	
	/*&& fdt == "" && fdt1== ""*/
	else if (accOrCustList != "" ) {
				$('#tbodyTable').append('<tr><td width="" style="text-align: center;">' + userIdHidden + '</td>'
					+ '<td width="" style="text-align: center;">' + userIdRole + '</td>' + '<td width="" style="text-align: center;"><font class="text-capitalize">' + username + '</font></td>'
					+ '<td style="text-align: center;"><span class="badge bg-primary status" ><a data-requestId ="' + requestId + '" >' + "Requested" + '</a></span></td>'
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
				//button.setAttribute("title", "Wait");

				/*var refresh = document.getElementById("getRefresh");
				refresh.classList.add("disabled");*/
		
	}

	var pageValJson;
	var selectElement = document.getElementById("status");

	var selectedOption = selectElement.options[selectElement.selectedIndex];
	if (selectedOption.id == 'Customers') {



		pageValJson = "{"
			+ "\"alertStartDate\": \"" + date1 + "\",\n"
			+ "\"alertEndDate\": \"" + date2 + "\",\n"
			+ "\"requestedTime\": \"" + requestDt + "\",\n"
			+ "\"requestId\": \"" + requestId + "\",\n"
			+ "\"filterList\": \"" + accOrCustList + "\",\n"
			+ "\"searchList\": \"" + "Customers" + "\",\n"
			+ "\"userId\": \"" + userIdHidden + "\",\n"
			+ "\"userPosition\": \"" + userIdRole + "\",\n"
			+ "\"requestedBy\": \"" + username + "\"}";

	} else {



		pageValJson = "{"
			+ "\"alertStartDate\": \"" + date1 + "\",\n"
			+ "\"alertEndDate\": \"" + date2 + "\",\n"
			+ "\"requestedTime\": \"" + requestDt + "\",\n"
			+ "\"requestId\": \"" + requestId + "\",\n"
			+ "\"searchList\": \"" + "Accounts" + "\",\n"
			+ "\"filterList\": \"" + accOrCustList + "\",\n"
			+ "\"userId\": \"" + userIdHidden + "\",\n"
			+ "\"userPosition\": \"" + userIdRole + "\",\n"
			+ "\"requestedBy\": \"" + username + "\"}";

	}

//alert('pageValJson: '+pageValJson);
	//document.getElementById('load').style.visibility = "visible";


	if (validationFlag) {
		//alert("till here correct");
		$.ajax({
			url: 'insertRegulatoryRequest',
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
					$(".getCancelClass").prop("disabled", true);

					//alert("icon is now disabled")


					//$('[data-requestId="' + requestId + '"]').addClass("disabled");
					$('#getProceed').addClass("disabled");
					//	$('#getCancel').addClass("disabled");
				}, setTimeOut);


			},
			error: function(xhr, status, error) {

				toastr
					.danger('Some Error Occured');
			}


		});
	}




});

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
				url: 'RegulatoryRequestCancel',
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
		url: 'fetchRegulatoryStatus',
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
			//console.log("status and req:=" + jsonResponse)
			var obj = JSON.parse(jsonResponse);

			//alert(obj.status);

			// var statusCell = document.querySelector('td span.badge.bg-primary');
			// var refreshCell = document.querySelector('td span a[data-requestId="' + requestId + '"]');
			var statusElement = document.querySelector('span a[data-requestId="' + requestId + '"]');

			if (obj.status == 'C') {

				document.getElementById("getProceed").disabled = true;
				//document.getElementsByClassName("getCancel").disabled = true;
				$(".getProceedClass").removeClass("disabled");
				$(".getProceedClass").prop("disabled", true);

				document.getElementById("getCancel").disabled = false;
				//document.getElementsByClassName("getCancel").disabled = true;
				$(".getCancelClass").addClass("disabled");

				statusElement.classList.remove('badge');

				statusElement.textContent = 'Completed';
				statusElement.className = 'badge btn-sm bg-success ';


			} else if (obj.status == 'R') {

				document.getElementById("getProceed").disabled = false;
				//document.getElementsByClassName("getCancel").disabled = true;
				$(".getProceedClass").addClass("disabled");
				$(".getProceedClass").prop("disabled", false);

				document.getElementById("getCancel").disabled = false;
				//document.getElementsByClassName("getCancel").disabled = true;
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

	//var requestId = document.getElementById("getRefresh").getAttribute("data-requestId");
	//var requestId = document.getElementById("getProceed").getAttribute("id");


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
	$('#searchAlertId').attr("action", "fetchRegulatoryStatusReport");
	$("#searchAlertId").submit();

}



function getExport() {

	//alert("in export");

	var requestId = $("#requestId").val();

	//console.log(requestId);
	//alert(requestId);
	//var requestId = id;

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

$("#searchCustomer").click(function() {

	var accOrCustList = $("#ListValue").val();

	if (accOrCustList == "") {

		$('#exampleModalNew').modal('show');

	} else {

		toastr.info('File is Selected');
		document.getElementById("searchCustomer").disabled = false;
	}

});

$("#uploadFile").click(function() {

	//alert("in upload button");
	toastr.info('File is Uploaded Successfully');

});


var totalsizeOfUploadFiles = 0;
function getFileDetailsBI(input) {
	//alert("in getFileDetailsBI");


	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		//console.log(filesizeInBytes);
		var filesizeInMB = (filesizeInBytes / 1024).toFixed(2);
		//console.log(filesizeInMB);
		var originalFilename = input.files[i].name;
		//console.log("Original Filename: " + originalFilename); // Add this line to check the actual filename
		//var userName = $("#userName").val();
		var flg = true;

		const excel_file = document.getElementById('excel_file_BI');
		//console.log(excel_file);
		//console.log(excel_file.files.length);
		// Check if an Excel file is selected
		if (excel_file.files.length === 0) {
			toastr.error('Please select an Excel file');
			return false;
		}

		// Checking excel file type
		if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(excel_file.files[0].type)) {
			toastr.error('Only .xlsx or .xls file format is allowed');
			return false;
		}

		var reader = new FileReader();
		reader.readAsArrayBuffer(excel_file.files[0]);

		reader.onload = function(event) {
			var data = new Uint8Array(reader.result);
			var work_book = XLSX.read(data, { type: 'array' });
			var sheet_name = work_book.SheetNames[0];
			var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name], { header: 1 });

			// Exclude the header (first row) from sheet_data
			var dataWithoutHeader = sheet_data.slice(1);

			console.log(dataWithoutHeader);

			// Send the data without header to #ListValue
			$("#ListValue").val(dataWithoutHeader);

            




			// Define the expected headers
			/*const expectedHeaders = ["Sr.No", "Customer Category(Main/Association)", "Customer Type ((Individual-I)(NonIndividual-N))", "Main Customer ID", "Main Customer Reference ID", "Customer Name/ Association Name", "Relation Type", "Do You Want Alert Generation", "Response Mode", "Threshold", "Date Of Birth", "Country Type((R-Residence),(N-Nationality),(O-Other))-Country Name", "ID Type(Driving License(DL),Voter ID(VI),Pan Card(PC),Passport(PP),Aadhaar Card(AC),Other)-ID Value", "Gender"];
			console.log("expectedHeaders", expectedHeaders)
			const headers = sheet_data[0].map(header => header && header.trim());
			console.log("headers", headers)
	
			if (!expectedHeaders.every(header => headers.includes(header))) {
				toastr.error('Excel headers do not match');
				return false;
			}*/
			//			$("#ListValue").val(sheet_data);
			//console.log(ListValue);
		};


	}

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
	$('#searchAlertId').attr("action", "exportOfflineRegulatoryStatus");
	$("#searchAlertId").submit();

}





