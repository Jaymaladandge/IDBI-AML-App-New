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






/*FETCH BUTTON CLICK FUNCTION*/

$("#search")
	.click(
		function() {
			var searchParam = $('#dimension').find(":selected").val().replace(
				/(\r\n|\n|\r)/gm, "");
			var searchValue = $('#searchcriteria').val().trim().toUpperCase().replace(
				/(\r\n|\n|\r)/gm, "");
			if (searchParam == '') {
				toastr.info('Please Select Search Parameter For Search');
			} else if (searchValue == '') {
				toastr.info('Please Add Some Value For Search');
			} else {
				if (searchParam == 'kriRecordStatus') {
					if (searchValue.includes('CREATE')) {
						searchValue = 'D';
					} else {
						searchValue = searchValue.charAt(0);
						if (searchValue == 'D') {
							searchValue = 'X';
						} else if (searchValue == 'P') {
							searchValue = 'D';
						}
					}
				}
				var pageValJson = "{\"searchParam\":" + "\"" + searchParam + "\",\"searchValue\":\"" + searchValue + "\"}";
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
					.toString(CryptoJS.enc.Hex);
				var aesUtil = new AesUtil(keySize, iterationCount);
				var ciphertext = aesUtil.encrypt(reverseText(passphrase),
					pageValJson);
				var pageValJson = ciphertext + ':~:' + passphrase;
				document.getElementById('load').style.visibility = "visible";
				// ajax call

				$
					.ajax({
						url: 'searchCustList',
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
									document
										.getElementById('contents').style.visibility = "visible";
								}, 1000);
							var jsonResponse = JSON
								.stringify(response);
							var obj = JSON.parse(jsonResponse);
							//
							console.log('jsonResponse' + jsonResponse);
							var customerDataList = obj.custDataList;
							var customerDataList = obj.custDataList;
							$(".customerDtls > #tbodyDocR").empty();
							$('#customerDtls').dataTable().fnClearTable();
							$('#customerDtls').DataTable().destroy();
							$(".customerDtls > #tbodyAcct").empty();
							$('#custAcctDtls').dataTable().fnClearTable();
							$('#custAcctDtls').DataTable().destroy();


							customerDataList.forEach(function(custData) {
								$("<tr role='row' class='odd' id='cust_" + custData.custId + "'><td class='sorting_1'>"
									+ custData.custId
									+ "</td><td>"
									+ custData.custFullName
									+ "</td><td>"
									+ custData.custType
									+ "</td>"
									+ "</tr>").appendTo(".customerDtls");

								custData.acctList.forEach(function(acctItem) {
									$("<tr role='row' class='odd' id='acct_" + custData.custId + "'><td class='sorting_1'>"
										+ acctItem.accountNo
										+ "</td><td>"
										+ acctItem.accountName
										+ "</td><td>"
										+ acctItem.acctStatus
										+ "</td><td>"
										+ acctItem.acBalanceAmt
										+ "</td>"
										+ "</tr>").appendTo(".custAcctDtls");

								});
								$("#custAcctDtls").DataTable({
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
									'#custAcctDtls_wrapper .col-md-6:eq(0)');
							});

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



						},
						error: function(xhr, status, error) {
							toastr
								.success('Some Error Occured');
						}
					});

			}
		});



$("#create_enricher_btn").click(function() {
	var flg = true;
	var acctDtls = "[\n";
	var custDtls = "[\n";
	var aasDetails = "[\n";
	var thresholdJson = "";
	let validationFlg = true;
	if ($('#frmEnricher').valid()) {
		/*	$('.customerDtls tbody tr').each(function(index, value) {
				var customerId = $(this).attr('id');
				var custName = $(this).find("td").eq(1).text();
				var custType = $(this).find("td").eq(2).text();
	
				$('.custAcctDtls tbody tr').each(function(index, value) {
					var comparevCustId = $(this).attr('id').split("-")[0];
					var compareAcctId = $(this).attr('id').split("-")[1];
					if (comparevCustId == customerId) {
						var acctNo = $(this).find("td").eq(0).text();
						var acctName = $(this).find("td").eq(2).text();
						var acctSts = $(this).find("td").eq(3).text();
						var acctBal = $(this).find("td").eq(4).text();
	
						$('.custAcctPersonDtls tbody tr').each(function(index, value) {
							var accountId = $(this).attr('id').split("-")[1];
							if (accountId == compareAcctId) {
								var acReltnPersonName = $(this).find("td").eq(1).text();
								var reltdCustId = $(this).find("td").eq(2).text();
								var acReltnType = $(this).find("td").eq(3).text();
	
	
								aasDetails = aasDetails + "{\"accountId\":" + "\""
									+ accountId
									+ "\",\"acReltnPersonName\":\""
									+ acReltnPersonName + "\",\"reltdCustId\":\""
									+ reltdCustId + "\",\"acReltnType\":\""
									+ acReltnType
									+ "\"},";
	
	
							}
	
						});
	
						aasDetails = aasDetails.substring(0,
							aasDetails.length - 1);
						aasDetails = aasDetails + "]";
	
						acctDtls = acctDtls + "{\"accountNo\":" + "\""
							+ acctNo
							+ "\",\"accountName\":\""
							+ acctName + "\",\"acctStatus\":\""
							+ acctSts + "\",\"aasDetails\":"
							+ aasDetails + ",\"acBalanceAmt\":\""
							+ acctBal
							+ "\"},";
	
					}
	
	
	
				});
				acctDtls = acctDtls.substring(0,
					acctDtls.length - 1);
				acctDtls = acctDtls + "]";
				custDtls = custDtls + "{\"custId\":" + "\""
					+ customerId
					+ "\",\"custFullName\":\""
					+ custName + "\",\"custType\":\""
					+ custType + "\",\"acctList\":"
					+ acctDtls + "},";
	
	
	
			});
			custDtls = custDtls.substring(0,
				custDtls.length - 1);
			custDtls = custDtls + "]";*/
		var remarks = null, PODNo = null, bbeDate = null, branchName = null;
		var requestorId = $("#requestorId").val();
		var BBEFlg = $("#BBEFlg").val();
		var bbeRequirement = $("#bbeRequirement").val();

		var freezeMarked = $("input[type='radio'][name='floors']:checked").val();
		var matchFound = $("input[type='radio'][name='activeStatus']:checked").val();
		if (freezeMarked == 'Y') {
			if ($("#remarksValueDesc").val() == "" || $("#remarksValueDesc").val() == null) {
				validationFlg = false;
				toastr.error('Please provide remraks');
				return false;
			}
			else {
				remarks = $("#remarksValueDesc").val();
			}
		}
		else {
			remarks = "NA";
		}
		if (bbeRequirement == 'Y') {

			PODNo = $("#PODNo").val();
			var StartTxnDate = GetAccountDate(new Date($('#bbeDate').val()));
			bbeDate = StartTxnDate
			//	alert("bbeDate" + bbeDate);
			branchName = $("#branchName").val();

		}

		var banksReply = $("#banksReply").val();
		var statusOfQuery = $('#statusOfQuery').find(":selected").val();

		if (validationFlg) {
			var enricherString = "{\n" +
				"    \"requestorId\": \"" + requestorId + "\",\n" +
				//			"    \"custDataList\":" + custDtls + ",\n" +
				"    \"remarks\":\"" + remarks.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"matchFound\":\"" + matchFound + "\",\n" +
				"    \"freezeMarked\":\"" + freezeMarked + "\",\n" +
				"    \"bbePodNumber\":\"" + PODNo + "\",\n" +
				"    \"bbeDateOfIssue\":\"" + bbeDate + "\",\n" +
				"    \"branchName\":\"" + branchName + "\",\n" +
				"    \"statusOfQuery\":\"" + statusOfQuery + "\",\n" +
				"    \"banksReply\":\"" + banksReply.replace(/(\r\n|\n|\r)/gm, "") + "\"" +
				"}";
			console.log("enricherString" + enricherString);

			var iterationCount = 1000;
			var keySize = 128;
			// passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(
				128 / 8).toString(CryptoJS.enc.Hex);

			var aesUtil = new AesUtil(keySize, iterationCount);

			var ciphertext = aesUtil.encrypt(
				reverseText(passphrase), enricherString);
			$("#encryptedJson").val(
				ciphertext + ':~:' + passphrase);
			$("#frmEnricher").submit();
		}
	}
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





});


$(document).on('click', 'a.retdPersonDetails', function() {
	var acid = $(this).attr('acid');
	var accountNo = $(this).attr('Accno');
	var pageValJson = "{\"accountId\":" + "\"" + acid + "\",\"accountNo\":" + "\"" + accountNo + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchLeaRelatedPersonDetails',
		type: "POST",
		data: {
			pageValJson: pageValJson
		},// important line for thymeleaf http security
		headers: {
			"X-CSRF-TOKEN": $("input[name='_csrf']").val()
		},
		cache: false,
		// async:true,
		success: function(response) {
			setTimeout(
				function() {
					document.getElementById('load').style.visibility = "hidden";
				}, 1000);
			var jsonResponse = JSON.stringify(response);
			var obj = JSON.parse(jsonResponse);
			$("#acctNoLabel").text(
				obj.accountNo);
			$("#aasDiv").empty();
			obj.aasDetails.forEach(
				function(items) {
					$("#aasDiv").append($(
						'<tr><td>' + items.acReltnPersonName + '</td> '
						+ ' <td>' + items.reltdCustId + '</td>  '
						+ ' <td>' + items.acReltnTypeDesc + '</td> <tr>'));
				});
			$('#viewReltdPersonModel').modal('show');

		},
		error: function(xhr, status, error) {
			toastr.error('Some Error Occured');
		}
	});
});


$(function() {
	$('#frmEnricher').validate({
		rules: {
			statusOfQuery: {
				required: true
			},
			banksReply: {
				required: true
			},




		},
		messages: {
			statusOfQuery: {
				required: "Please Select a Status Of Query",
			},
			banksReply: {
				required: "Please provide the banks Reply",
			},



		},
		errorElement: 'span',
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback');
			element.closest('.form-group').append(error);

		},
		highlight: function(element, errorClass, validClass) {
			$(element).addClass('is-invalid');
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).removeClass('is-invalid');
		},
		submitHandler: function(form) {
			form.submit();
		}
	});
});


/*TextArea validation*/
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








