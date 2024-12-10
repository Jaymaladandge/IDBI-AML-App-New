/*Loader*/
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
/*Loader*/

/*Initialize Select2 Elements*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});
/*Initialize Select2 Elements*/


/*DOCUMENT READY FUNCTION*/

$(document).ready(function() {
	
	$(".regRequestTable").DataTable({
				"columnDefs" : [ {
					orderable : false,
					targets : [ 9, 10 ]
				} ],
				"order" : [ 0, "desc" ],
				"responsive" : false,
				"lengthMenu" : [ 25, 50, 75, 100 ],
				"autoWidth" : true,
				"searching" : false,
				"fixedHeader" : true,
				"language" : {
					"emptyTable" : "No Data Available"
				}
			}).buttons().container().appendTo(
					'#regRequestTable_wrapper .col-md-6:eq(0)');
					
					
		$("#reportViewTable").hide();			
});	

/*DOCUMENT READY FUNCTION*/	


/*FETCH YEAR BASED ON REPORT TYPE*/

$('#reportType').change(function() {

	var reportValue = $('#reportType').val();
	var pageValJson = "{\"reportType\":" + "\"" + reportValue + "\"\n" + "}"
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchRegReportYearList',
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
			$("#yearId").empty();
			$("<option />", {
				val: "",
				text: "Select Year"
			}).appendTo($("#yearId"));
			obj.reportYearList.forEach(function(items) {
				$("<option />", {
					val: items,
					text: items
				}).appendTo($("#yearId"));
			});
			$("#yearId").show();
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.success('Some Error Occured');
		}
	});
});
/*FETCH YEAR BASED ON REPORT TYPE*/


/*FETCH MONTH BASED ON YEAR*/

$('#yearId').change(function() {

	var yearValue = $('#yearId').val();
	var reportValue = $('#reportType').val();
		var pageValJson = "{\n" +
			"    \"yearValue\": \"" + yearValue + "\",\n" 
			+ "  \"reportType\":\""+ reportValue + "\"}";
	
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchRegReportMonthList',
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
			$("#monthId").empty();
			$("<option />", {
				val: "",
				text: "Select Month"
			}).appendTo($("#monthId"));
			obj.reportMonthList.forEach(function(items) {
				$("<option />", {
					val: items,
					text: items
				}).appendTo($("#monthId"));
			});
			$("#monthId").show();
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.success('Some Error Occured');
		}
	});
});
/*FETCH MONTH BASED ON YEAR*/


/*FETCH BUTTON CLICK METHOD*/
/*$("#fetchDataBtn").click(function() {
	
	var yearValue = $('#yearId').val();
	var reportValue = $('#reportType').val();
	var monthValue = $('#monthId').val();
	
	var pageValJson = "{\n" +
			"    \"yearValue\": \"" + yearValue + "\",\n" 
			+"    \"monthValue\": \"" + monthValue + "\",\n" 
			+ "  \"reportType\":\""+ reportValue + "\"}";
	
	
	console.log(pageValJson)
	alert(pageValJson)
	
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchRegReportDetailedData',
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
			
			var dataList = obj.reportList;
			
			dataList.forEach(function(items) {
				

				$("<tr role='row' class='deptNa ' id='" + items.srNO + "'><td class='sorting_1 textCapitalize'>"
					+ items.srNo
					+ "</td><td><span name='tpNa' value='" + items.branchId + "' id='" + items.branchId + "' class='textCapitalize'>"
					+ items.branchId
					+ "</td><td><span name='tpNa' value='" + items.branchName + "' id='" + items.branchName + "' class='textCapitalize'>"
					+ items.branchName
					+ "</td><td><span name='amber' value='" + items.customerId + "' id='" + items.customerId + "' class='textCapitalize'>"
					+ items.customerId
					+ "</td><td><span name='amber2' value='" + items.customerName + "' id='" + items.customerName + "' class='textCapitalize'>"
					+ items.customerName
					+ "</td><td><span name='amber3' value='" + items.accountNumber + "' id='" + items.accountNumber + "' class='textCapitalize'>"
					+ items.accountNumber
					+ "</td><td><span name='amber4' value='" + items.accountType + "' id='" + items.accountType + "' class='textCapitalize'>"
					+ items.accountType
					+ "</td><td><span name='amber5' value='" + items.transactionId + "' id='" + items.transactionId + "' class='textCapitalize'>"
					+ items.transactionId
					+ "</td><td><span name='amber6' value='" + items.transactionDT + "' id='" + items.transactionDT + "' class='textCapitalize'>"
					+ items.transactionDT
					+ "</td><td><span name='amber7' value='" + items.transactionType + "' id='" + items.transactionType + "' class='textCapitalize'>"
					+ items.transactionType
					+ "</td><td><span name='amber8' value='" + items.creditDebitFlg + "' id='" + items.creditDebitFlg + "' class='textCapitalize'>"
					+ items.creditDebitFlg
					+ "</td><td><span name='amber8' value='" + items.transactionAmount + "' id='" + items.transactionAmount + "' class='textCapitalize'>"
					+ items.transactionAmount
					+ "</td><td><span name='green' id='" + items.requestId + "' value='" + items.requestId + "' class='textCapitalize description'>"
					+ items.requestId
					+ "</span></td>"
					+ "</tr>").appendTo(".regReportTable");

			});
			
			$("#regReportTable").DataTable(
				{
					"columnDefs": [{
						orderable: false,
					}],
						"responsive": false,
						"autoWidth": true,
						"searching": true,
						"fixedHeader": true,
						"language": {
						"emptyTable": "No Data Available"
					},

				}).buttons().container().appendTo(
						'#regReportTable_wrapper .col-sm-12:eq(0)');

			
			
					},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.success('Some Error Occured');
		}
	});*/
	
	
//});

$("#fetchDataBtn").click(function() {
	
	
	
	var yearValue = $('#yearId').val();
	var reportValue = $('#reportType').val();
	var monthValue = $('#monthId').val();
	var userId = $('#useridHidden').val();
	var userRole = $('#userRoleHidden').val();
	var userName = $('#usernameHidden').val();	
	var requestId = $('#reqIdHidden').val();	
	
	
	if(reportValue == ''){
	
	toastr.info("Report Type cannot be blank");
}else if(yearValue == ''){
	toastr.info("Please Select Year to Continue");
}else if(monthValue == ''){
	toastr.info("Please Select Month to Continue");
}		
			
	var pageValJson = "{\n" +
			"    \"yearValue\": \"" + yearValue + "\",\n" 
			+"    \"monthValue\": \"" + monthValue + "\",\n" 
			+"    \"reportType\": \"" + reportValue + "\",\n" 
			+"    \"userId\": \"" + userId + "\",\n" 
			+"    \"userRole\": \"" + userRole + "\",\n" 
			+"    \"requestId\": \"" + requestId + "\",\n" 
			+ "  \"requestedBy\":\""+ userName + "\"}";
	
		//console.log(pageValJson);
	//	alert(pageValJson);
	
		document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'regReportAction',
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
		//	var jsonResponse = JSON .stringify(response);
			//var obj = JSON.parse(jsonResponse);
			
			
			location.reload(true);
			toastr.info('Your Request will be processed shortly !');
			
			$("#reportViewTable").hide();
			
			},error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.success('Some Error Occured');
		}
	});
	

});


/*FETCH BUTTON CLICK METHOD*/


$(".requestBody").on("click", "a.viewReqData", function() {
	

	var requestId = $(this).attr('id');
	
	var pageValJson = "{" 
			+ "  \"requestId\":\""+ requestId + "\"}";
	
	
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchReportDtl',
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
			
			
			var dataList = obj.reportList;
			
			dataList.forEach(function(items) {
				

				$("<tr role='row' class='deptNa ' id='" + items.reqNo + "'><td class='sorting_1 textCapitalize'>"
					+ items.reqNo
					+ "</td><td><span name='tpNa' value='" + items.requestId + "' id='" + items.requestId + "' class='textCapitalize'>"
					+ items.requestId
					+ "</td><td><span name='tpNa' value='" + items.reportType + "' id='" + items.reportType + "' class='textCapitalize'>"
					+ items.reportType
					+ "</td><td><span name='amber' value='" + items.customerId + "' id='" + items.customerId + "' class='textCapitalize'>"
					+ items.customerId
					+ "</td><td><span name='amber2' value='" + items.customerName + "' id='" + items.customerName + "' class='textCapitalize'>"
					+ items.customerName
					+ "</td><td><span name='amber3' value='" + items.accountType + "' id='" + items.accountType + "' class='textCapitalize'>"
					+ items.accountType
					+ "</td><td><span name='amber4' value='" + items.accountNumber + "' id='" + items.accountNumber + "' class='textCapitalize'>"
					+ items.accountNumber
					+ "</td><td><span name='amber5' value='" + items.transactionId + "' id='" + items.transactionId + "' class='textCapitalize'>"
					+ items.transactionId
					+ "</td><td><span name='amber6' value='" + items.transactionDT + "' id='" + items.transactionDT + "' class='textCapitalize'>"
					+ items.transactionDT
					+ "</td><td><span name='amber7' value='" + items.transactionType + "' id='" + items.transactionType + "' class='textCapitalize'>"
					+ items.transactionType
					+ "</td><td><span name='amber8' value='" + items.creditDebitFlg + "' id='" + items.creditDebitFlg + "' class='textCapitalize'>"
					+ items.creditDebitFlg
					+ "</td><td><span name='amber8' value='" + items.transactionAmount + "' id='" + items.transactionAmount + "' class='textCapitalize'>"
					+ items.transactionAmount
					+ "</td><td><span name='green' id='" + items.requestId + "' value='" + items.requestId + "' class='textCapitalize description'>"
					+ items.requestId
					+ "</td><td><span name='green1' id='" + items.strFlg + "' value='" + items.strFlg + "' class='textCapitalize description'>"
					+ items.strFlg
					+ "</td><td><span name='green3' id='" + items.strReqNO + "' value='" + items.strReqNO + "' class='textCapitalize description'>"
					+ items.strReqNO
					+ "</td><td><span name='green3' id='" + items.strCreatedDT + "' value='" + items.strCreatedDT + "' class='textCapitalize description'>"
					+ items.strCreatedDT
					+ "</span></td>"
					+ "</tr>").appendTo(".dtlReqTable");

			});
			
			$("#dtlReqTable").DataTable(
				{
					"columnDefs": [{
						orderable: false,
					}],
						"responsive": false,
						"autoWidth": true,
						"searching": true,
						"fixedHeader": true,
						"language": {
						"emptyTable": "No Data Available"
					},

				}).buttons().container().appendTo(
						'#dtlReqTable_wrapper .col-sm-12:eq(0)');
			
			
			$("#reportViewTable").show();
			
					},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.success('Some Error Occured');
		}
	});
			
			


});	



$(document).on("click", ".getExportReport", function() {
	
	var requestId = $(this).attr("id");
	
	//alert('requestId = ' + requestId);
	
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

	$("#regExport").submit();
	
	
	
})	



