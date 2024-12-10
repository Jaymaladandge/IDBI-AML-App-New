document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}


var storeYear;
$('#reportType').change(function() {
	

	var reportValue = $('#reportType').val();
	var pageValJson = "{\"reportType\":" + "\"" + reportValue + "\"\n" + "}"
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetch',
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
			setTimeout(
				function() {
					document
						.getElementById('load').style.visibility = "hidden";
				}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			//clear Drop-Down List of 
			$("#yeardropdown").empty();
			$("<option />", {
				val: "",
				text: "Select Year"
			}).appendTo($("#yeardropdown"));
			obj.yearList.forEach(function(items) {
				$("<option />", {
					val: reportType,
					text: items
				}).appendTo($("#yeardropdown"));
			});
			$("#yeardropdown").show();
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.success('Some Error Occured');
		}
	});
	console.log("at end of  js");
});


$('#yeardropdown').change(function() {
	/*var yearValue = $('#yeardropdown').val();*/
	var yearValue = $('#yeardropdown option:selected').text();
	
	var reportType = $('#reportType').val();
	console.log(yearValue);
	console.log("in month");
	/*var pageValJson = "{\"year\":" + "\"" + yearValue + "\"\n"+ "    \"reportType\": \"" + reportType + "\",\n" + "}"*/
	var pageValJson = JSON.stringify({
		year: yearValue,
		reportType: reportType
	});
	console.log(pageValJson);
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchMonth',
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
			console.log("sucess request")
			setTimeout(
				function() {
					document
						.getElementById('load').style.visibility = "hidden";
				}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			//clear Drop-Down List of 
			$("#monthdropdown").empty();
			$("<option />", {
				val: "",
				text: "Select Month"
			}).appendTo($("#monthdropdown"));
			obj.monthList.forEach(function(items) {
				$("<option />", {
					val: yearValue,
					text: items
				}).appendTo($("#monthdropdown"));
			});
			$("#monthdropdown").show();
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			console.log(xhr.responseText);
			toastr
				.success('Some Error Occured');
		}
	});
});



$("#fetchDataButton").click(function() {
	var reportType = $('#reportType').val();
	var year = $('#yeardropdown option:selected').text().trim();
	var month = $('#monthdropdown option:selected').text().trim();
	
	
	/*	var riskType = $('#riskTypeDropdown').val();
		var riskTypeDropdown = $('#riskTypeDropdown').val();*/
	var validFlg = true;
	var reqId;

	/*var date1 = $("#startDate").val();
	var date2 = $("#endDate").val();
	var startDate1 = new Date(date1);
	var endDate1 = new Date(date2);
*/

	/*if (startDate1 > endDate1) {
		toastr
			.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (date1 === '' || date1 == null) {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (date2 === '' || date2 == null) {
		toastr.error("end date cannot be blank");
		validFlg = false;
	}*/

	if (reportType == '') {
		toastr.error("reportType cannot be blank");
		validFlg = false;
	}

	if (year === ''|| year.toLowerCase() === 'select year') {
	
		toastr.error("year cannot be blank");
		validFlg = false;
	}

	if (month === ''|| month.toLowerCase() === 'select month') {
	
		toastr.error("month cannot be blank");
		validFlg = false;
	}

	/*if (riskTypeDropdown == '') {
		toastr.error("Rule Category cannot be blank");
		validFlg = false;
	}
*/
	if (validFlg) {

		/*var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();*/

		var requestId = getModulePrimaryKey(reqId); // Call Random Funtion
		

		var pageValJson = "{\"reportType\":" + "\"" + reportType + "\",\n"
			+ "    \"year\": \"" + year + "\",\n"
			+ "    \"month\": \"" + month + "\",\n"
			+ "\"requestId\": \"" + requestId + "\"}";

		
		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchReports',
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
				setTimeout(
					function() {
						document
							.getElementById('interactive');
						document
							.getElementById('load').style.visibility = "hidden";
					}, 1000);

				if (response.reportExists) {
					toastr.error('Report already requested for the specified type, year, and month.');
					return;
				}

				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);
				var dataList = obj.dtoList;
				

				$(".ruleWiseReportTable > #tbodyR").empty();
				/*	$('#ruleWiseReportTable').dataTable().fnClearTable();
					$('#ruleWiseReportTable').DataTable().destroy();
	*/

				$('#ruleWiseReportTable thead th:nth-child(2), #ruleWiseReportTable thead th:nth-child(4), #ruleWiseReportTable thead th:nth-child(7)').css({
					'text-align': 'center',
					'width': '125px' // Add any other styles you need for these specific columns
					// Add more styles as needed
				});

				dataList.forEach(function(dto) {
					var row = $("<tr role='row' id='row_id'></tr>");

					// Access properties of RequestReportDto and create cells
					var properties = ['requestId', 'user', 'role', 'reportType', 'year', 'month', 'request_Date', 'status'];
					properties.forEach(function(property, index) {
						let requestId, reportType, month, year;
						var cell = $("<td  style='text-align: center;'><font class='text-capitalize'></font></td>");
						if (property === 'status') {
							// Check the status property
							if (dto[property] === 'C') {
							console.log('dto'+dto);
							var glassesCell = $("<td'></td>");	
							 glassesCell.html('<span class="badge bg-success mt-2" style="text-align: center;" >Completed</span>');
							 row.append(glassesCell);
							
								requestId = dto.requestId;
								reportType = dto.reportType;
								month = dto.month;
								year = dto.year;

								// Add a td with a glasses logo and disabled click
								var glassesCell = $("<td></td>");
                glassesCell.html('<a style="font-size:12px" class="btn btn-sm bg-primary " data-requestId="' + requestId + '" data-reportType="' + reportType + '" data-month="' + month + '" data-year="' + year + '" onclick="viewButtonClick(this.getAttribute(\'data-requestId\'),this.getAttribute(\'data-reportType\'),this.getAttribute(\'data-month\'),this.getAttribute(\'data-year\'))"><i class="fas fa-solid fa-glasses" data-requestId="' + requestId + '" data-reportType="' + reportType + '" data-month="' + month + '" data-year="' + year + '"></i></a>');
								row.append(glassesCell);
							} else if (dto[property] === 'I') {

								// Add a td with a glasses logo and enabled click
								var glassesCell = $("<td ></td>");	
glassesCell.html('<span class="badge bg-primary" style="text-align: center;">Requested</span>');
row.append(glassesCell);

								var glassesCell = $("<td class='sorting_1'></td>");
								glassesCell.html('<a style="font-size:12px" class="btn btn-sm bg-primary disabled"><i class="fas fa-solid fa-glasses"></i></a>');
								row.append(glassesCell);
							}
						} else if (property === 'user') {
							var cell = $('<td width="" style="text-align: center;"><font class="text-capitalize"></font></td>');
							var capitalizedText = capitalizeFirstLetterOfEachWord(dto[property]); // Capitalize the text
							cell.text(capitalizedText);
							row.append(cell);
						}
						else {
							// For other properties, add the text normally
							cell.text(dto[property]);
							row.append(cell);
						}

					});

					// Add the row to the table body
					row.appendTo(".ruleWiseReportTable");
				});


				
				var dataTable = jQuery("#ruleWiseReportTable").DataTable({
					"columnDefs": [{
                orderable: true
            }],
            "responsive": false,
            "autoWidth": true,
            "searching": true,
            "fixedHeader": true,
            "language": {
                "emptyTable": "No Data Available"
            },
            "paging": true,  // Enable pagination
            "lengthChange": false,  // Disable length change dropdown
            "pageLength": 10,
                 "hover": true           // Set the default page length
				});

				
				var viewColumnIndex = 8 /* index of the "View" column */; // Change this with the actual index




				$('#reportTable').show();

			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.success('Some Error Occured');
			}
		});
	}
});


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

function capitalizeFirstLetterOfEachWord(text) {
	return text.replace(/\b\w/g, function(char) {
		return char.toUpperCase();
	});
}


/*$('.ruleWiseReportTable').on('click', '.viewButton', function() {
    // Get the data attributes
    
    var requestId = $(this).find('i').data('requestId');
    var reportType = $(this).find('i').data('reportType');
    var month = $(this).find('i').data('month');
    var year = $(this).find('i').data('year');
    

    // Call the viewButtonClick function with the parameters
    viewButtonClick(requestId, reportType, month, year);
});*/

// Your existing viewButtonClick function
function viewButtonClick(requestId, reportType, month, year) {
	// Your logic here
	

	var pageValJson = "{\"reportType\":" + "\"" + reportType + "\",\n"
		+ "    \"year\": \"" + year + "\",\n"
		+ "    \"month\": \"" + month + "\",\n"
		+ "\"requestId\": \"" + requestId + "\"}";
	

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray
		.random(128 / 8).toString(
			CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize,
		iterationCount);

	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), pageValJson);

	$("#encryptedJsonSearch").val(
		ciphertext + ':~:' + passphrase);
	

	$("#searchId").submit();



}
