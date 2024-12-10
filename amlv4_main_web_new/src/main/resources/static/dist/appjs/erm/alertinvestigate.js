//loader
document.onreadystatechange = function() {
	var state = document.readyState
	//if (state == 'complete') {
	document.getElementById('load').style.visibility = "hidden";
	//}
}

$(document).ready(function() {
	$('.acctTab').each(function(i, obj) {
		var cust = $(this).attr('id');
		if (cust.indexOf(('AlertTab')) != -1) {
			$(function() {
				$('#' + cust.trim()).DataTable({
					"order": [0, "desc"],
					"columnDefs": [{
						orderable: false,
						targets: [5, 7, 9, 0, 1, 3, 4, 5, 8, 10, 11, 12]
					}],
					"responsive": false,
					"lengthMenu": [3, 6, 9, 20],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					}
				});
			});
		}

	});

	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY'
	});
	//Date range picker
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY'
	});

	$('#tranStartDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY'
	});
	$('#tranEndDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY'
	});


	$('#ledgeStartDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY'
	});
	$('#ledgeEndDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY'
	});

	$('#gsDate').datetimepicker({
		dateFormat: 'dd-mm-yyyy' // Set the date format as dd-mm-yyyy
	});

	$('#geDate').datetimepicker({
		dateFormat: 'dd-mm-yyyy' // Set the date format as dd-mm-yyyy
	});


	$(".barView").hide();
	$(".barViewCred").hide();


});


/*FORMAT DATE FUNCTION*/
function formatDate(date) {
	var day = date.getDate();
	var month = date.getMonth() + 1; // Months are zero-based, so add 1
	var year = date.getFullYear();
	// Add leading zeros if necessary
	if (day < 10) {
		day = '0' + day;
	}
	if (month < 10) {
		month = '0' + month;
	}
	// Return the formatted date string
	return day + '-' + month + '-' + year;
}

$('#gsDate').on('change', function() {

	var startDate = new Date($(this).val()); // Parse the selected start date
	var maxEndDate = new Date(startDate);
	maxEndDate.setMonth(maxEndDate.getMonth() + 3);
	// Format the maximum end date as yyyy-mm-dd (required for min attribute in input type="date")
	var maxEndDateFormatted = maxEndDate.toISOString().slice(0, 10);
	//var maxEndDateFormatted = formatDate(maxEndDate);;
	// Set the minimum selectable end date on the input element
	$('#geDate').attr('max', maxEndDateFormatted);
});
/*FORMAT DATE FUNCTION*/



$(document).on("click", "#ftchGReport", function() {

	var flg = true;

	//var tranAcidObj = $(this).attr("graphTranAcid");
	//var tranAcidObj = "WO22213658"; // WO22213658
	var tranAcidObj = $("#tranACIDG").val();
	var accountId = $("#accGID").val();

	$("#gAcctStmtNo").text(' ' + accountId);

	var startObj = $("#gsDate").val();
	var endObj = $("#geDate").val();
	var drpDwnVal = $("#credDebDD").val();

	if (startObj == '') {
		toastr.info('Start Date cannot be blank')
		flg = false;
	}
	if (endObj == '') {
		toastr.info('End Date cannot be blank')
		flg = false;
	}
	if (drpDwnVal == '') {
		toastr.info('Please Select Credit or Debit')
		flg = false;
	}


	if (flg) {
		var startDate = startObj.split('-')[2] + '-' + startObj.split('-')[1] + '-' + startObj.split('-')[0];
		var endDate = endObj.split('-')[2] + '-' + endObj.split('-')[1] + '-' + endObj.split('-')[0];



		var pageValJson = "{\n" +
			"    \"tranAcid\": \"" + tranAcidObj + "\",\n" +
			"    \"startDate\":\"" + startDate + "\",\n" +
			"    \"credDebtFlag\":\"" + drpDwnVal + "\",\n" +
			"\"endDate\":\"" + endDate + "\"}";

		//alert('pageValJson = ' + pageValJson)

		document.getElementById('load').style.visibility = "visible";

		// ajax call
		$
			.ajax({
				url: 'fetchGraphDetails',
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
					var jsonResponse = JSON
						.stringify(response);
					var obj = JSON.parse(jsonResponse);

					var tranChannelDebitList = obj.debt3MonthList;
					var tranChannelCreditList = obj.credit3MonthList;
					var tranCredDebt = obj.trendChartCredDebt;

					var vredDbtFlg = obj.credDebtFlag;

					//	alert("vredDbtFlg = " + vredDbtFlg);

					if (vredDbtFlg == 'C') {
						$.fn.drawPieChartCredit(tranChannelCreditList);
						$.fn.drawPieChartCreditValue(tranChannelCreditList);
						$.fn.drawBARCREDIT(tranChannelCreditList);
						$("#dbtDivG").hide();
						$("#crdDbtDivG").hide();
						$("#credDivG").show();
						//$("#tranDtlsDIV").hide();
						//	$('#tranDtlsModal').modal('hide');
					} else if (vredDbtFlg == 'D') {
						$.fn.drawPieChartDebit(tranChannelDebitList);
						$.fn.drawPieChartDebitValue(tranChannelDebitList);
						$.fn.drawDebtBAR(tranChannelDebitList);
						$("#credDivG").hide();
						$("#crdDbtDivG").hide();
						$("#dbtDivG").show();
						//$("#tranDtlsDIV").hide();
						//$('#tranDtlsModal').modal('hide');
					}

					//$.fn.drawBARChartCredDebt(tranCredDebt);


					$(".debitTbl > .dbtBdy").empty();

					$(".creditTbl > .crdtBdy").empty();

					$(".tCredCount").text(obj.totCrdtCount);
					$(".tCredValCount").text(obj.totCrdtValueFrmt);
					$(".tDbtCount").text(obj.totDbtCount);
					$(".tDbtValCount").text(obj.totDbtValueFrmt);


					var debtTableList = obj.tranChannelDebit;
					var credTableList = obj.tranChannelCredit;



					debtTableList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.transactionType
							+ "</td ><td><span name='dValue' value='" + items.debtCountAndPercent + "' data-sDate='" + startDate + "' data-eDate='" + endDate + "' data-channelType='" + items.transactionType + "' data-acid='" + tranAcidObj + "' data-crdDebFlg='D' class='textCapitalize pointer text-blue getTranDtls'  >"
							+ items.debtCountAndPercent
							+ "</td><td><span name='dSumValue' value='" + items.sumDebitValueFormatted + "' class='textCapitalize'>"
							+ items.sumDebitValueFormatted
							+ "</td></tr>").appendTo(".dbtBdy");
					});

					credTableList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.transactionType
							+ "</td class='pointer'><td><span name='cValue' value='" + items.crdtCountAndPercent + "' data-sDate='" + startDate + "' data-eDate='" + endDate + "' data-channelType='" + items.transactionType + "' data-acid='" + tranAcidObj + "' data-crdDebFlg='C' class='textCapitalize pointer text-blue getTranDtls'>"
							+ items.crdtCountAndPercent
							+ "</td><td><span name='cSumValue' value='" + items.sumDebitValueFormatted + "' class='textCapitalize'>"
							+ items.sumcreditValueFormatted
							+ "</td></tr>").appendTo(".crdtBdy");
					});

					$('#tranDtlsDIV').modal('hide');

				},
				error: function(xhr, status, error) {
					toastr.error('Some Error Occured');
					console.log("xhr - " + xhr + "::" + "status - " + status + "::" + "error - " + error)
				}
			});


		$('#graphAnalysisModal').modal('show');
	}
});



$('a.ruleModel')
	.click(
		function() {
			var ruleId = $(this).attr('id');
			var pageValJson = "{\"ruleId\":" + "\""
				+ ruleId + "\"}";

			console.log(pageValJson);
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'RuleViewModel',
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
						var jsonResponse = JSON
							.stringify(response);
						console.log("json Response "
							+ jsonResponse)
						var obj = JSON.parse(jsonResponse);
						console.log("obj " + obj);
						var i = 0;
						$("#ruleIdLabel").text(
							obj.ruleId);
						$("#ruleDesc").text(
							obj.ruleDesc);
						$("#ruleFrequency")
							.val(obj.ruleFrequency);
						$("#ruleClassification").val(
							obj.ruleClassification);
						$("#ruleIndicator").val(
							obj.ruleIndicator);
						$("#ruleCategory").val(
							obj.ruleCategory);
						$("#ruleImpact").val(
							obj.ruleImpact);
						$("#ruleLikelihood")
							.val(obj.ruleLikelihood);
						$("#inherentRisk").val(
							obj.inherentRisk);
						$("#ruleExeFlg").val(
							obj.ruleExeFlg);
						$("#nextExeFlg").val(
							obj.nextExeFlg);
						$("#lastExeFlg").val(
							obj.lastExeFlg);
						$("#ruleExpiryDate")
							.val(obj.ruleExpiryDate);
						$("#ruleConstitution").val(
							obj.ruleConstitution);
						$("#ruleTrnChannel").val(
							obj.ruleTrnChannel);
						$("#ruleTrnSubChannel").val(
							obj.ruleTrnSubChannel);
						$("#makerId").val(
							obj.makerId);
						$("#makerTimeStamp")
							.val(obj.makerTimeStamp);
						$("#lastUserId").val(
							obj.lastUserId);
						$("#lastUpdateTime").val(
							obj.lastUpdateTime);
						$("#actionStatus").val(
							obj.actionStatus);
						$("#recordStatus").val(
							obj.recordStatus);
						$("#ruleAggType")
							.val(obj.ruleAggType);
						var thresholdData = obj.ruleThresholdDtoList;
						$(".ruleThresDtls > #tbodyR").empty();

						// alert('thresholdData '+thresholdData);
						thresholdData.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.ruleId
								+ "</td><td><span name='incidentName' value='" + items.ruleDesc + "' class='textCapitalize'>"
								+ items.ruleParameter
								+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleClassification + "' class='textCapitalize'>"
								+ items.ruleKey
								+ "</td></tr>").appendTo("#tbodyR");
						});
						var riskData = obj.ruleRiskDefinationDtoList;
						$(".ruleRiskDtls > #tbodyRiskR").empty();

						// alert('thresholdData '+thresholdData);
						riskData.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.ruleRiskId
								+ "</td><td><span name='incidentName' value='" + items.ruleRiskParameter + "' class='textCapitalize'>"
								+ items.ruleRiskParameter
								+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleRiskValue + "' class='textCapitalize'>"
								+ items.ruleRiskValue
								+ "</td></tr>").appendTo("#tbodyRiskR");
						});
						//	$("#ruleThresRow").css("display", "block");

					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});
			$('#viewRuleModel').modal('show');
		});

/*TextArea validation*/
function checkTextArea(textAreaName, data) {
	let msg = "SUCCESS";
	if (data == '') {
		msg = textAreaName + " cannot be blank.";
	} else if (data.length < 10) {
		msg = textAreaName + " should be greater than 10 letters.";
	} else if (/[\\'|]/.test(data)) {
		msg = textAreaName + " cannot contain special characters.";
	} else if (data.indexOf('\'') >= 0) {
		msg = textAreaName + " should not contains single quote.";
	}
	return msg;
}


function executeSubmit(status, action) {
	$('#action').val(status);
	$('#actModal').text(action);
	$('#actModal').val(action);
	$('#closemodal').modal('show');
}

function finalSubmit() {
	var status = $("#action").val();
	var action = $("#actModal").val();
	var userComment = $("#alertComment").val();
	var alertAggFlg = $("#aggFlg").val();
	var alertAggVal = $("#aggVal").val();
	var checkComment = checkTextArea("User Comment", userComment);
	var flg = false;

	if (checkComment == 'SUCCESS') {
		/*var filedetails = "[\n";
		if ($('#filedetails tr').length > 0) {
			$('#filedetails > tbody  > tr').each(function(index, value) {
				var splitvalue = $(this).find('td:eq(0)').text().split('.');
				var sizesplit = $(this).find('td:eq(1)').text().split(' ');
				filedetails = filedetails +
					"  {  \"fileName\": \"" + $(this).find('td:eq(0)').text() + "\",\n" +
					"    \"fileSize\": \"" + sizesplit[0] + "\",\n" +

					"    \"fileType\": \"" + splitvalue[1] + "\"\n" +
					" },";
			});
			filedetails = filedetails.substring(0, filedetails.length - 1);
		}
		filedetails = filedetails + "]";*/
		var pageValJson = "{\"alertAggFlg\": \"" + alertAggFlg + "\",\"eddFlg\": \"" + false + "\",\"action\": \"" + action +
			"\",\"alertAggVal\": \"" + alertAggVal + "\"," + "\"alertStatus\":\"" + $("#alertStatus").val()
			+ "\",\"actionStatus\":\"" + status + "\",\"userComment\":\"" + userComment.replace(/(\r\n|\n|\r)/gm, "") + "\" }";
		flg = true;
	} else {
		toastr.error(checkComment);
	}
	if (flg) {
		$("#encryptedJson").val(pageValJson);
		$("#invForm").submit();
	}
}
$(document).on('click', 'a.tranDetails', function() {
	var acid = $(this).attr('id');
	$('#tranAcidId').val(acid);
	var accountNo = $(this).attr('Acno');
	$('#tranAc').val(accountNo);
	var startDate = $('#tranStartDate').val();
	var endDate = $('#tranEndDate').val();
	var pageValJson = "{\"accountId\":" + "\"" + acid + "\",\"accountNo\":" + "\"" + accountNo +
		"\",\"startDate\":" + "\"" + null + "\",\"endDate\":" + "\"" + endDate + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchTransactionDetails',
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
			$("#accNoLabel").text(
				obj.accountNo);
			$("#tranDiv").empty();
			obj.tranDetails.forEach(
				function(items) {
					$("#tranDiv").append($('<table class="table table-sm table-head-fixed table-bordered table-striped "style="width: 60%"><th colspan="2" class="text-center">Transaction Detail For ' + items.startDate + ' to ' + items.endDate + ' </th>'
						+ '<tr><td>Total Credit</td> <td class="text-right" id="tc">' + items.totalCred + '</td> <tr>'
						+ '<tr><td>Total Debit</td> <td class="text-right" id="tc">' + items.totalDeb + '</td> <tr>'
						+ '<tr><td>Total Cash Credit</td> <td class="text-right" id="tc">' + items.totalCashCred + '</td> <tr>'
						+ '<tr><td>Total Cash Debit</td> <td class="text-right" id="tc">' + items.totalCashDeb + '</td> <tr>'
						+ '<tr><td>Average</td> <td class="text-right" id="tc">' + items.avg + '</td> <tr>'
						+ '<table> '));

				});

			$('#viewTranModel').modal('show');

		},
		error: function(xhr, status, error) {
			toastr.error('Some Error Occured');
		}
	});
});

$(document).on('click', 'a.retdPersonDetails', function() {
	var acid = $(this).attr('acid');
	var accountNo = $(this).attr('Accno');
	var pageValJson = "{\"accountId\":" + "\"" + acid + "\",\"accountNo\":" + "\"" + accountNo + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchRelatedPersonDetails',
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

$('a.alertModel')
	.click(
		function() {
			var alertId = $(this).attr('id');
			var pageValJson = "{\"alertId\":" + "\""
				+ alertId + "\"}";

			console.log(pageValJson);
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'AlertViewModel',
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
						var jsonResponse = JSON
							.stringify(response);
						console.log("json Response "
							+ jsonResponse)
						var obj = JSON.parse(jsonResponse);

						$("#alertIdLabel").text(
							obj.alertId);

						if (obj.headerList.length > 0) {
							var headerListData = obj.headerList;
							$(".alertDtls > #alertDtlsHead").empty();
							$("<tr>").appendTo("#alertDtlsHead");
							headerListData.forEach(function(items) {
								$("<th class='sorting_1'>"
									+ items
									+ "</th>").appendTo("#alertDtlsHead");
							});
							$("</tr>").appendTo("#alertDtlsHead");

							var thresholdData = obj.dataList;
							$(".alertDtls > #alertDtlsBody").empty();
							thresholdData.forEach(function(items) {
								var dataString = items.split("~");

								$("<tr>").appendTo("#alertDtlsBody");
								dataString.forEach(function(value) {

									$("<td class='sorting_1'>"
										+ value
										+ "</td>").appendTo("#alertDtlsBody");
								});
								$("</tr>").appendTo("#alertDtlsBody");
							});
							$('#viewAlertModel').modal('show');

						} else {
							toastr.warning('Alert Details Not Present');
						}
					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});

		});
function searchTranData() {
	var acid = $('#tranAcidId').val();
	var accountNo = $('#tranAc').val();
	var startDate = $('#tranStartDate').val();
	var endDate = $('#tranEndDate').val();
	var pageValJson = "{\"accountId\":" + "\"" + acid + "\",\"accountNo\":" + "\"" + accountNo +
		"\",\"startDate\":" + "\"" + startDate + "\",\"endDate\":" + "\"" + endDate + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchTransactionDetails',
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
			$("#accNoLabel").text(
				obj.accountNo);
			$("#tranDiv").empty();
			obj.tranDetails.forEach(
				function(items) {
					$("#tranDiv").append($('<table class="table table-sm table-head-fixed table-bordered table-striped "style="width: 60%"><th colspan="2" class="text-center">Transaction Detail For ' + items.startDate + ' to ' + items.endDate + ' </th>'
						+ '<tr><td>Total Credit</td> <td class="text-right" id="tc">' + items.totalCred + '</td> <tr>'
						+ '<tr><td>Total Debit</td> <td class="text-right" id="tc">' + items.totalDeb + '</td> <tr>'
						+ '<tr><td>Total Cash Credit</td> <td class="text-right" id="tc">' + items.totalCashCred + '</td> <tr>'
						+ '<tr><td>Total Cash Debit</td> <td class="text-right" id="tc">' + items.totalCashDeb + '</td> <tr>'
						+ '<tr><td>Average</td> <td class="text-right" id="tc">' + items.avg + '</td> <tr>'
						+ '<table> '));
				});
			$('#viewTranModel').modal('show');

		},
		error: function(xhr, status, error) {
			toastr.error('Some Error Occured');
		}
	})

}
// viewAccountStmt
function searchData() {
	var tranType = $("#tranType").val();
	var creDebFlg = $("#creDebFlg").val();
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var acid = $("#acidId").val();
	var pageValJson = "{\n" + "\"tranType\": \"" + tranType + "\",\n"
		+ "   \"creDebFlg\": \"" + creDebFlg + "\",\n"
		+ "   \"startDate\": \"" + startDate + "\",\n"
		+ "   \"endDate\": \"" + endDate + "\",\n"
		+ "   \"tranAcid\": \"" + acid + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'getAcStatementFilterWise',
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
				}, 1);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			$("#acctStmt tbody tr").remove();
			$('#acctStmt').dataTable()
				.fnClearTable();
			$('#acctStmt').DataTable()
				.destroy();
			obj.forEach(function(item) {
				var credTab = '';
				var debTab = '';
				let credAmt = 0;
				let debAmt = 0;
				if (item.creDebFlg == 'C') {
					credTab = '<span class="badge bg-success">' + item.tranAmt + '</span>';
					credAmt = item.tranAmt;
					debTab = '<span class="badge bg-danger ">0</span>';
				} else {
					debAmt = item.tranAmt;
					debTab = '<span class="badge bg-danger ">' + item.tranAmt + '</span>';
					credTab = '<span class="badge bg-success ">0</span>';
				}
				jQuery("#acctStmt tbody").append('<tr><td>' + moment(item.tranDate).format('DD-MM-YYYY') + '</td><td>' + item.tranId + '</td><td>' + item.tranParticular + '</td><td class="text-right">' + debAmt + '</td><td class="text-right">' + credAmt + '</td><td>' + item.tranrmks + '</td><td>' + item.sourceDetails + '</td><td>' + item.destDetails + '</td><td>' + item.tranChannel + '</td></tr>');
			});
			//fetchAcctStmt
			$("#acctStmt").DataTable({
				"responsive": false,
				"order": [],
				"columnDefs": [{
					orderable: false,
					targets: [1, 2, 3, 4, 5, 6, 7, 8]
				}],
				"lengthMenu": [50, 75, 100, 200],
				"autoWidth": true,
				"searching": true,
				"fixedHeader": true,
				"buttons": [{ extend: 'csvHtml5', title: 'Transaction Statement', width: 'auto' }, {
					extend: 'excelHtml5',
					title: 'Transaction Statement',
					customize: function(xlsx) {
						var sheet = xlsx.xl.worksheets['sheet1.xml'];
						var col = $("col", sheet);
						$(col[0]).attr("width", 17);
						$(col[1]).attr("width", 17);
						$(col[3]).attr("width", 17);
						$(col[4]).attr("width", 17);
						$(col[5]).attr("autoWidth", true);
					}
				}, "pdfHtml5", "print"],
				"language": {
					"emptyTable": "No Data Available"
				}
			}).buttons().container().appendTo('#acctStmt_wrapper .col-md-6:eq(0)');
			$('#acctStmt').DataTable().columns.adjust()
				.draw();
		},
		error: function(xhr, status, error) {
			toastr
				.error('Some Error Occured');
		}
	});
}

$(document).on('click', 'a.acctStmtDetails', function() {
	$("#acidId").val($(this).attr("acStid"));
	$("#acctStmtNo").text($(this).attr("accStno"));
	$('#tranType').select2();
	$('#creDebFlg').select2();
	$("#acctStmt tbody tr").remove(); $('#acctStmt').dataTable()
		.fnClearTable();
	$('#acctStmt').DataTable()
		.destroy();
	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = (day) + "-" + (month) + "-" + now.getFullYear();
	var priorDate = new Date(new Date().setDate(now.getDate() - 90));
	var startDay = ("0" + priorDate.getDate()).slice(-2);
	var startMonth = ("0" + (priorDate.getMonth() + 1)).slice(-2);
	var endDate = (startDay) + "-" + (startMonth) + "-" + priorDate.getFullYear();
	$('#endDate').val(today);
	$('#startDate').val(endDate);
	searchData();
	$('#accountStmtModal').modal('show');
});

$('a.custModel')
	.click(
		function() {
			var custId = $(this).attr('id');
			var pageValJson = "{\"custId\":" + "\""
				+ custId + "\"}";
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'CustViewModel',
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
						var jsonResponse = JSON
							.stringify(response);
						var obj = JSON.parse(jsonResponse);
						console.log("obj " + obj);
						var i = 0;
						$("#custIdLabel").text(
							obj.custId);
						$("#custFullName").val(
							obj.custFullName);
						$("#custPanNo")
							.val(obj.custPanNo);
						$("#custOccupation").val(
							obj.custOccupation);
						$("#custIndFlg").val(
							obj.custType);
						if (obj.custIndFlg == 'I') {
							$("#custAnnualIncome").val(obj.custAnnualIncome);
							$("#custMinFlg").val(obj.custMinorFlg);
							$("#custNreFlg").val(obj.custNreFlg);
							$("#custGender").val(obj.custGender);
							$("#custDob").val(moment(obj.custDob).format('DD-MM-YYYY'));
							$("#indRow").show();
						} else {
							$("#custTurnOver").val(obj.custTurnover);
							$("#compId").val(obj.companyId);
							$("#dateOfReg").val(obj.dateOfRegistration);
							$("#placeOfReg").val(obj.placeOfRegistration);
							$("#nidRow").show();
						}
						$("#custConstitution").val(
							obj.custConstitution);
						$("#custOpnDate").val(
							obj.custOpnDate);
						$("#custRisk").val(
							obj.actualRisk);
						$("#custRisk").addClass(obj.custRisk);
						$("#lastKycDate").val(
							obj.custKycDate);
						var custAddress = obj.custAddressDtoList;
						$(".custAddressDtls > #tbodyAddressR").empty();

						// alert('thresholdData '+thresholdData);
						custAddress.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.city
								+ "</td><td><span name='state' value='" + items.state + "' class='textCapitalize'>"
								+ items.state
								+ "</td><td><span name='country' value='" + items.country + "' class='textCapitalize'>"
								+ items.country
								+ "</td><td><span name='zipcode' value='" + items.zip + "' class='textCapitalize'>"
								+ items.zip
								+ "</td><td><span name='addressCategory' value='" + items.addressCategory + "' class='textCapitalize'>"
								+ items.addressCategory
								+ "</td><td><span name='address' value='" + items.addressLine1 + "' class='textCapitalize'>"
								+ items.addressLine1
								+ "</td></tr>").appendTo("#tbodyAddressR");
						});
						$(".custDocDtls > #tbodyDocR").empty();
						obj.custDocDtoList.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.docCode
								+ "</td><td><span class='textCapitalize'>" + items.docDesc + "</td><td><span   class='textCapitalize'>"
								+ items.docValue + "</td><td><span  class='textCapitalize'>" + items.docIssueCntry
								+ "</td><td><span class='textCapitalize'>" + items.docIssuePlace + "</td><td><span  class='textCapitalize'>"
								+ items.docIssueDate
								+ "</td></tr>").appendTo("#tbodyDocR");
						});
						$(".custContactDtls > #tbodyContactR").empty();
						obj.custPhoneEmailDtlsDtos.forEach(function(items) {
							$("<tr role='row'id='row_id'><td class='sorting_1'>"
								+ items.recordType
								+ "</td><td><span class='textCapitalize'>" + items.recordValue + "</td></tr>").appendTo("#tbodyContactR");
						});
					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});
			$('#viewCustModel').modal('show');
		});


$('a.ucicDetails')
	.click(
		function() {
			$('#viewUcicModel').modal('show');
		});

$("#otherCloseAccLink").click(function() {
	var custId = $(this).attr("closeCustId");
	var status = 'Y';
	var tabId = custId.trim() + 'CloseTab';
	if ($('#' + tabId + ' >tbody >tr').length == 0) {
		var pageValJson = "{\"custId\":" + "\"" + custId + "\",\"acctStatus\":" + "\"" + status + "\"}";
		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$.ajax({
			url: 'getAccountList',
			type: "POST",
			data: {
				pageValJson: pageValJson
			},// important line for thymeleaf http security
			headers: {
				"X-CSRF-TOKEN": $(
					"input[name='_csrf']")
					.val()
			},
			cache: false, success: function(response) {
				setTimeout(function() {
					document.getElementById('load').style.visibility = "hidden";
				}, 1);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);
				obj.forEach(function(acctObj) {
					jQuery('#' + tabId + ' tbody').append('<tr><td >' + acctObj.accountNo + '</td><td>' + acctObj.branchId + '</td><td>'
						+ moment(acctObj.acctOpnDate).format('DD/MM/YYYY') + '</td><td  class="text-capitalize">' + acctObj.accountType + '/' + acctObj.productCode + '</td><td>' + acctObj.nomDetails
						+ '</td><td>' + acctObj.acctStatus + '</td><td>' + acctObj.acBalanceAmt
						+ '</td><td><a class="btn btn-sm bg-orange acctStmtDetails"  AccStno=' + acctObj.accountNo + ' acStid=' + acctObj.accountId
						+ ' title="View Account Statement"><em class="fa fa-receipt fa-1x text-white"></em></a></td><td><a class="btn btn-sm bg-teal ledgerStmtDetails"  AccStno=' + acctObj.accountNo + ' acStid=' + acctObj.accountId
						+ ' title="View Ledger Account Statement"><em class="fas fa-file-invoice-dollar fa-1x text-white"></em></a></td>' +
						'<td><a class="btn btn-sm bg-cyan tranDetails" Acno=' + acctObj.accountNo + ' id=' + acctObj.accountId
						+ ' title="View Transaction Details"><em class="fa fa-rupee-sign fa-1x text-white"></em></a></td><td><a class="btn btn-sm bg-green retdPersonDetails" Accno=' + acctObj.accountNo + ' acid=' + acctObj.accountId
						+ ' title="Related Person"><em class="fas fa-users fa-1x text-black"></em></a></tr>');
				});
				$('#' + tabId).DataTable({
					"order": [0, "desc"],
					"columnDefs": [{
						orderable: false,
						targets: [5, 7, 9, 0, 1, 3, 4, 5, 8, 10]
					}],
					"responsive": false,
					"lengthMenu": [3, 6, 9, 20],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					}
				});
			},
			error: function(xhr, status, error) {
				toastr.error('Some Error Occured');
			}
		});
	}
});

$("#otherActAccLink").click(function() {
	var custId = $(this).attr("actCustId");
	var status = 'A';
	var tabId = custId.trim() + 'ActTab';
	if ($('#' + tabId + ' >tbody >tr').length == 0) {
		var pageValJson = "{\"custId\":" + "\"" + custId + "\",\"acctStatus\":" + "\"" + status + "\"}";
		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$.ajax({
			url: 'getAccountList',
			type: "POST",
			data: {
				pageValJson: pageValJson
			},// important line for thymeleaf http security
			headers: {
				"X-CSRF-TOKEN": $(
					"input[name='_csrf']")
					.val()
			},
			cache: false, success: function(response) {
				setTimeout(function() {
					document.getElementById('load').style.visibility = "hidden";
				}, 1);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);
				obj.forEach(function(acctObj) {
					jQuery('#' + tabId + ' tbody').append('<tr><td >' + acctObj.accountNo + '</td><td>' + acctObj.branchId + '</td><td>'
						+ moment(acctObj.acctOpnDate).format('DD/MM/YYYY') + '</td><td  class="text-capitalize">' + acctObj.accountType + '/' + acctObj.productCode + '</td><td>' + acctObj.nomDetails
						+ '</td><td>' + acctObj.acctStatus + '</td><td>' + acctObj.acBalanceAmt
						+ '</td><td><a class="btn btn-sm bg-orange acctStmtDetails" AccStno=' + acctObj.accountNo + ' acStid=' + acctObj.accountId
						+ ' title="View Account Statement"><em class="fa fa-receipt fa-1x text-white"></em></a></td><td><a class="btn btn-sm bg-teal ledgerStmtDetails"  AccStno=' + acctObj.accountNo + ' acStid=' + acctObj.accountId
						+ ' title="View Ledger Account Statement"><em class="fas fa-book fa-1x text-white"></em></a></td>' +
						'<td><a class="btn btn-sm bg-cyan tranDetails" Acno=' + acctObj.accountNo + ' id=' + acctObj.accountId
						+ ' title="View Transaction Details"><em class="fa fa-rupee-sign fa-1x text-white"></em></a></td><td><a class="btn btn-sm bg-green retdPersonDetails" Accno=' + acctObj.accountNo + ' acid=' + acctObj.accountId
						+ ' title="Related Person"><em class="fas fa-users fa-1x text-black"></em></a></tr>');
				});
				$('#' + tabId).DataTable({
					"order": [0, "desc"],
					"columnDefs": [{
						orderable: false,
						targets: [5, 7, 9, 0, 1, 3, 4, 5, 8, 10]
					}],
					"responsive": false,
					"lengthMenu": [3, 6, 9, 20],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					}
				});
			},
			error: function(xhr, status, error) {
				toastr.error('Some Error Occured');
			}
		});
	}

});



$(".fetchSummaryDetails").click(
	function() {
		var alertStatus = $(this).attr('status');
		var searchFlg = $(this).attr('act');
		var val = $(this).attr('val');
		var pageValJson = "{\"searchFlg\": \"" + searchFlg + "\"," + "\"alertAggVal\": \"" + val
			+ "\"," + "\"alertStatus\": \"" + alertStatus + "\"}";
		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchAlertSummaryData',
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
				$("#ctrTab > #tBodyCtrReg").empty();
				$("#ntrTab > #tBodyNtrReg").empty();
				$("#cbwtrTab > #tBodyCbwtrReg").empty();
				$("#strTab > #tBodyStr").empty();
				$("#alertCountTab > #tBodyAlertCnt").empty();
				$("#ucicId").text(val);
				if (searchFlg == 'regReport') {
					let ctrFlg = true;
					let ntrFlg = true;
					let cbwtrFlg = true;
					console.log(obj);
					let map = obj.regDataOldList;
					$.each(map, function(key, value) {
						if (key == 'CTR') {
							value.forEach(function(items) {
								let regObj = JSON.parse(JSON.stringify(items));
								if (regObj !== null) {
									ctrFlg = false;
									$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
										+ regObj.monthOfRecord
										+ "</td><td> "
										+ items.yearOfRecord
										+ "</td><td> "
										+ items.custId
										+ "</td><td> "
										+ items.cummCrTot
										+ "</td><td> "
										+ items.cummDrTot
										+ "</td><td> "
										+ items.finVersion
										+ "</td></tr>").appendTo("#tBodyCtrReg");
								}
							});
						} else if (key == 'NTR') {
							value.forEach(function(items) {
								let regObj = JSON.parse(JSON.stringify(items));
								if (regObj !== null) {
									ntrFlg = false;
									$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
										+ regObj.monthOfRecord
										+ "</td><td> "
										+ items.yearOfRecord
										+ "</td><td> "
										+ items.custId
										+ "</td><td> "
										+ items.cummCrTot
										+ "</td><td> "
										+ items.cummDrTot
										+ "</td><td> "
										+ items.finVersion
										+ "</td></tr>").appendTo("#tBodyNtrReg");
								}
							});
						} else if (key == 'CBWTR') {
							value.forEach(function(items) {
								let regObj = JSON.parse(JSON.stringify(items));
								if (regObj !== null) {
									cbwtrFlg = false;
									$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
										+ regObj.monthOfRecord
										+ "</td><td> "
										+ items.yearOfRecord
										+ "</td><td> "
										+ items.custId
										+ "</td><td> "
										+ items.totAmt
										+ "</td><td> "
										+ items.finVersion
										+ "</td></tr>").appendTo("#tBodyCbwtrReg");
								}
							});
						}
					});
					if (ctrFlg) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-center' colspan='8'>No Data Available</td></tr>").appendTo("#tBodyCtrReg");
					}
					if (ntrFlg) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-center' colspan='8'>No Data Available</td></tr>").appendTo("#tBodyNtrReg");
					}
					if (cbwtrFlg) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1 text-center' colspan='8'>No Data Available</td></tr>").appendTo("#tBodyCbwtrReg");
					}
					$('#ctrTab').show();
					$('#ntrTab').show();
					$('#cbwtrTab').show();
					$('#strTab').hide();
				} else if (searchFlg == 'strReport') {
					obj.strDataOldList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.reqNo
							+ "</td><td> "
							+ moment(items.updateTime).format('DD-MM-YYYY')
							+ "</td><td>"
							+ items.custId
							+ "</td><td> "
							+ items.gos
							+ "</td><td> "
							+ items.finNo
							+ "</td><td> "
							+ items.finVersion
							+ "</td></tr>").appendTo("#tBodyStr");
					});
					$('#ctrTab').hide();
					$('#ntrTab').hide();
					$('#cbwtrTab').hide();
					$('#strTab').show();
				}
				$('#viewUcicRegModel').modal('show');
			},
			error: function() {
				toastr.error('Some Error Occured');
			}
		});
	});

$('#custIdList').on('change', function() {
	let custId = this.value.split('~')[0];
	let custName = this.value.split('~')[1];
	let branchMail = this.value.split('~')[2].split('-')[0];
	$("#emailTo").val(branchMail);
	$("#subject").val("Seeking Information For Customer Id : " + custId + ",Customer Name: " + custName.toUpperCase());
});

$("#sendMailBtn").click(function() {
	var flg = true;
	var emailTo = $("#emailTo").val();
	var emailCC = $("#emailCC").val();
	var ucic = $("#hdnUcic").val();
	var subject = $("#subject").val().replace(/(\r\n|\n|\r)/gm, "");
	var message = $("#messageData").val().replace(/(\r|\r|\t)/gm, "").trim().replaceAll('\n', '<br>');
	var apString = "{\"toEmail\":\"" + emailTo + "\"," + "\"ccEmail\":\"" + emailCC + "\"," + "\"moduleId\":\"" + ucic + "\","
		+ "\"subject\":\"" + subject + "\"," + "\"message\":\"" + message + "\"}";
	document.getElementById('load').style.visibility = "visible";
	if (emailCC == '') {
		flg = false;
		toastr.error('Please Add CC');
	}
	if (message == '') {
		flg = false;
		toastr.error('Please Add Message');
	}
	if (flg) {
		// ajax call
		$.ajax({
			url: 'sendMail',
			type: "POST",
			data: {
				pageValJson: apString
			},// important line for thymeleaf http security
			headers: {
				"X-CSRF-TOKEN": $(
					"input[name='_csrf']")
					.val()
			},
			cache: false, success: function(response) {
				setTimeout(function() {
					document.getElementById('load').style.visibility = "hidden";
				}, 1);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);
				if (obj.requestStatus) {
					toastr.success('Mail Sent Successfully');
				} else {
					toastr.error('Mail Sent UnSuccessfully');
				}
				$('#exampleModal').modal('toggle');
			}, error: function(xhr, status, error) {
				toastr.error('Some Error Occured');
			}
		});
	}
});
$(".mailDetails").click(
	function() {
		$('#viewMailListModel').modal('show');
	});

$('a.closemodal').click(function() {
	$('#stmtId').text($(this).attr('id'));
	$('#closemodal').modal('show');
});


var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
	var username = $('#userName').val();
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
		var extension = filename.substr((filename.lastIndexOf('.') + 1));
		switch (extension) {
			case 'jpg':
				break;
			case 'jpeg':
				break;
			case 'png':
				break;
			case 'pdf':
				break;
			case 'doc':
				break;
			case 'docx':
				break;
			default:
				flg = false;
				toastr.error('Sorry, ' + filename + ' is invalid, allowed extensions are: jpg,pdf,doc,png ');
		}
		if (flg) {
			select
				.append($('<tr id=tr' + i + '><td id=filetd' + i + '>'
					+ filename
					+ '</td><td id=filesizetd' + i + '>'
					+ filesizeInMB
					+ ' kb</td><td>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td class="text-capitalize">'
					+ username
					+ '</td><td ><a class="btn btn-danger btn-sm" id="closerow"><i class="fas fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
			$('#filedetails').show();
			$('#filedetailsheader').show();
		}
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

function checkAIResponse(chatType, custName) {
	var pageValJson = "{\"chatType\":" + "\"" + chatType + "\",\"question\":\"" + custName + "\"}";
	$("#queId").val(custName);
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'getAICheckResponse',
		type: "POST",
		data: {
			pageValJson: pageValJson
		},// important line for thymeleaf http security
		headers: {
			"X-CSRF-TOKEN": $(
				"input[name='_csrf']")
				.val()
		},
		cache: false, success: function(response) {
			setTimeout(function() {
				document.getElementById('load').style.visibility = "hidden";
			}, 1);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			if (obj.respMsg == 'Success') {
				if (obj.chatType == 'C') {
					$("#dronaReponse").val(obj.chatGtpResponse);
				} else if (obj.chatType == 'G') {
					$("#dronaReponse").val(obj.bardGoogleResponse);
				}
				$('#viewAICheckModel').modal('show');
			} else {
				toastr.error('Some Error Occured');
			}
		}, error: function(xhr, status, error) {
			toastr.error('Some Error Occured');
		}
	});
}

function askAIResponse() {
	var que = $("#queId").val();
	checkAIResponse("B", que);
}

function askDrona(type) {
	var que = $("#queId").val();
	checkAIResponse(type, que);
}

//"eddModal"

function executeEddSubmit() {
	$('#eddModal').modal('show');
}


$('#eddCustIdList').on('change', function() {
	let custId = this.value.split('~')[0];
	let custName = this.value.split('~')[1];
	let branchId = this.value.split('~')[2];
	let ucid = $("#hdnUcic").val();
	let selectValue = this.value;
	let alertStatus = $("#alertStatus").val();
	let eddType = $("#eddType").val();
	if (eddType == '') {
		toastr.error('Please select the EDD Type');
		return false;
	} else if (eddType == 'C') {
		if (selectValue != 'NA') {
			var appenddata1 = "";
			$("#branchIdList").empty();
			appenddata1 += "<option value = '" + branchId + " ' class='text-capitalize'><font class='text-capitalize'>"
				+ branchId
				+ "</font> </option>";
			$("#branchIdList").append(
				appenddata1);
		}
	} else if (eddType == 'A') {
		var appenddata1 = "";
		$("#branchIdList").empty();
		if (custId != 'NA') {
			var pageValJson = "{\"eddType\":" + "\"" + eddType + "\",\"custId\":\"" + custId + "\"}";
			document.getElementById('load').style.visibility = "visible";
			$.ajax({
				url: 'fetchCustBranch',
				type: "POST",
				data: {
					pageValJson: pageValJson
				},// important line for thymeleaf http security
				headers: {
					"X-CSRF-TOKEN": $(
						"input[name='_csrf']")
						.val()
				},
				cache: false, success: function(response) {
					setTimeout(function() {
						document.getElementById('load').style.visibility = "hidden";
					}, 1);
					var jsonResponse = JSON
						.stringify(response);
					var obj = JSON.parse(jsonResponse);
					$("#branchIdList").empty();
					var appenddata1 = "";
					appenddata1 += "<option value = '' class='text-capitalize'><font class='text-capitalize'>"
						+ 'Select'
						+ "</font> </option>";
					obj.branchList
						.forEach(function(items) {
							appenddata1 += "<option value = '" + items.branchId + '-' + items.branchName + " ' class='text-capitalize'><font class='text-capitalize'>"
								+ items.branchId + '-' + items.branchName
								+ "</font> </option>";
						})
					$("#branchIdList").append(
						appenddata1);
				}, error: function() {
					toastr.error('Some Error Occured');
				}
			});
		}
	}
});

$('#eddType').on('change', function() {
	$("#branchIdList").empty();
	$('#eddCustIdList').val("NA").change();
});
//
$(document).on('click', 'input[type="checkbox"]', function() {
	$('input[type="checkbox"]').not(this).prop('checked', false);
});

//Send Edd Code
function eddSubmit() {
	var alertAggFlg = $("#aggFlg").val();
	var alertAggVal = $("#aggVal").val();
	var eddType = $("#eddType").val();
	var branchId = $("#branchIdList").val();
	var custId = $("#eddCustIdList").val();
	var status = $("#alertAction").val();
	let eddId = '';
	$('input.eddCheck:checkbox:checked').each(function() {
		eddId = $(this).attr("id");
	});
	if (eddType == '' || eddType == null) {
		toastr.error('Please Select Edd Type');
		return false;
	}
	if (branchId == '' || branchId == null) {
		toastr.error('Please Select Branch Id For EDD');
		return false;
	}
	if (status == '' || status == null) {
		toastr.error('Please Select Action For Proceed');
		return false;
	}
	if (eddId == '' || eddId == null) {
		toastr.error('Please Select EDD For Proceed');
		return false;
	}
	if (status == '' || status == null) {
		toastr.error('Please Select Action For Proceed');
		return false;
	}
	var userComment = $("#alertCommentText").val();
	var checkComment = checkTextArea("User Comment", userComment);
	var flg = false;
	if (checkComment == 'SUCCESS') {
		var pageValJson = "{\"alertAggFlg\": \"" + alertAggFlg + "\",\"eddFlg\": \"" + true + "\",\"custId\": \"" + custId
			+ "\",\"eddId\": \"" + eddId + "\",\"eddBranch\": \"" + branchId + "\",\"alertAggVal\": \"" + alertAggVal
			+ "\"," + "\"alertStatus\":\"" + $("#alertStatus").val() + "\",\"actionStatus\":\"" + status
			+ "\",\"userComment\":\"" + userComment.replace(/(\r\n|\n|\r)/gm, "") + "\" }";
		flg = true;
		alert(pageValJson);
	} else {
		toastr.error(checkComment);
	}
	if (flg) {
		$("#encryptedJson").val(pageValJson);
		$("#invForm").submit();
	}
}

$('a.eddView').click(function() {
	var eddId = $(this).attr("id");
	$("#eddIdLabel").text(eddId);
	var pageValJson = "{\"testId\":" + "\"" + eddId + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$
		.ajax({
			url: 'fetchEddDetails',
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
						document.getElementById('interactive');
						document.getElementById('load').style.visibility = "hidden";
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				console.log("json Response "
					+ jsonResponse)
				var obj = JSON.parse(jsonResponse);
				console.log("obj " + obj);
				$("#testDescription").text(
					obj.testDescription);
				$("#eddCat").val(
					obj.testAssignedCategory);
				$("#eddSubCat").val(
					obj.testAssignedSubCategory);
				$("#TestInstruction").text(
					obj.testInstruction);
				$("#eddQueTab > #eddTbody").empty();
				obj.queList.forEach(function(items) {
					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.question
						+ "</td><td>"
						+ items.questionType
						+ "</td><td> "
						+ items.options
						+ "</td></tr>").appendTo("#eddTbody");
				});
			},
			error: function() {
				toastr.error('Some Error Occured');
			}
		});
	$('#eddViewModal').modal('show');
});

$(document).on('click', 'a.alertHistory', function() {
	var ucicId = $(this).attr('id');
	var status = $(this).attr('status');
	var pageValJson = "{\"alertAggVal\":" + "\"" + ucicId + "\",\"alertStatus\":\"" + status + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$
		.ajax({
			url: 'fetchOldTicketComment',
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
						document.getElementById('interactive');
						document.getElementById('load').style.visibility = "hidden";
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);

				$("#alertHistTab > #histTbody").empty();
				obj.alertList.forEach(function(items) {
					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.alertId
						+ "</td><td>"
						+ items.alertRuleDesc
						+ "</td><td> "
						+ moment(items.alertStartDate).format('DD-MM-YYYY')
						+ "</td><td> "
						+ moment(items.alertEndDate).format('DD-MM-YYYY')
						+ "</td><td> "
						+ items.alertStatus
						+ "</td><td><a href='#' class='alertCommentClass' id=" + items.alertId + "> "
						+ 'View Comments'
						+ "</a></td></tr>").appendTo("#histTbody");
				});
			},
			error: function() {
				toastr.error('Some Error Occured');
			}
		});
	$('#viewAlertHistoryModel').modal('show');
});


$(document).on('click', 'a.alertCommentClass', function() {
	var alertId = $(this).attr('id');
	var pageValJson = "{\"alertId\":" + "\"" + alertId + "\",\"version\":\"4.0\"}";
	document.getElementById('load').style.visibility = "visible";
	$
		.ajax({
			url: 'fetchTicketComment',
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
						document.getElementById('interactive');
						document.getElementById('load').style.visibility = "hidden";
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);

				$("#alertHistCommentTab > #histCommTbody").empty();
				obj.commentList.forEach(function(items) {
					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.userName
						+ "</td><td>"
						+ items.roleId
						+ "</td><td> "
						+ items.action
						+ "</td><td> "
						+ items.userComment
						+ "</td><td> "
						+ items.commentTime
						+ "</td><td> "
						+ items.tat
						+ "</td></tr>").appendTo("#histCommTbody");
				});
			},
			error: function() {
				toastr.error('Some Error Occured');
			}
		});
	$('#alertHistCommentTab').show();
	$('#viewAlertHistoryModel').modal('show');
});


$(document).on('click', 'a.ledgerStmtDetails', function() {
	$("#ledgeAcidId").val($(this).attr("ledgeAcStid"));
	$("#ledgeAcctStmtNo").text($(this).attr("ledgeAccStno"));
	$('#ledgeTranType').select2();
	$('#ledgeCreDebFlg').select2();
	$("#ledgeCreDebFlg tbody tr").remove();

	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = (day) + "-" + (month) + "-" + now.getFullYear();
	var priorDate = new Date(new Date().setDate(now.getDate() - 90));
	var startDay = ("0" + priorDate.getDate()).slice(-2);
	var startMonth = ("0" + (priorDate.getMonth() + 1)).slice(-2);
	var endDate = (startDay) + "-" + (startMonth) + "-" + priorDate.getFullYear();
	$('#ledgeEndDate').val(today);
	$('#ledgeStartDate').val(endDate);
	LedgerSearchData();
	$('#LedgerStmtModal').modal('show');
});


// view Ledger AccountStmt
function LedgerSearchData() {
	var tranType = $("#ledgeTranType").val();
	var creDebFlg = $("#ledgeCreDebFlg").val();
	var startDate = $("#ledgeStartDate").val();
	var endDate = $("#ledgeEndDate").val();
	var acid = $("#ledgeAcidId").val();
	var pageValJson = "{\n" + "\"tranType\": \"" + tranType + "\",\n"
		+ "   \"creDebFlg\": \"" + creDebFlg + "\",\n"
		+ "   \"startDate\": \"" + startDate + "\",\n"
		+ "   \"endDate\": \"" + endDate + "\",\n"
		+ "   \"tranAcid\": \"" + acid + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'getLedgerStmtFilterWise',
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
				}, 1);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			$("#ledgerAcctStmt tbody tr").remove();
			$('#ledgerAcctStmt').dataTable()
				.fnClearTable();
			$('#ledgerAcctStmt').DataTable()
				.destroy();
			obj.forEach(function(item) {
				jQuery("#ledgerAcctStmt tbody").append('<tr><td>' + item.ledgeDate + '</td><td>' +
					item.tranId + '</td><td>' + item.tranParticular + '</td><td >' + item.tranrmks + '</td><td>' + item.tranType
					+ '</td><td  class="text-right">' + item.debitAmt + '</td><td  class="text-right">' + item.creditAmt + '</td><td>'
					+ item.eobBal + '</td></tr>');
			});
			//fetchAcctStmt
			$("#ledgerAcctStmt").DataTable({
				"responsive": false,
				"order": [],
				"columnDefs": [{
					orderable: false,
					targets: [1, 2, 3, 4, 5, 6]
				}],
				"lengthMenu": [50, 75, 100, 200],
				"autoWidth": true,
				"searching": true,
				"fixedHeader": true,
				"buttons": [{ extend: 'csvHtml5', title: 'Transaction Statement', width: 'auto' }, {
					extend: 'excelHtml5',
					title: 'Transaction Statement',
					customize: function(xlsx) {
						var sheet = xlsx.xl.worksheets['sheet1.xml'];
						var col = $("col", sheet);
						$(col[0]).attr("width", 10);
						$(col[1]).attr("width", 10);
						$(col[4]).attr("width", 6);
						$(col[5]).attr("width", 6);
					}
				}, "pdfHtml5", "print"],
				"language": {
					"emptyTable": "No Data Available"
				}
			}).buttons().container().appendTo('#ledgerAcctStmt_wrapper .col-md-6:eq(0)');
			$('#ledgerAcctStmt').DataTable().columns.adjust()
				.draw();
		},
		error: function(xhr, status, error) {
			toastr
				.error('Some Error Occured');
		}
	});
}


$(document).on('click', 'a.graphDetails', function() {

	var tranAcidObj = $(this).attr("graphTranAcid");
	//var tranAcidObj = "WO22213658"; // WO22213658 
	var accountId = $(this).attr("gaccStno");
	//alert('accountId = ' + accountId)
	//alert('tranAcidObj = ' + tranAcidObj)
	$("#gAcctStmtNo").text(' ' + accountId);
	$("#accGID").val(accountId);
	$("#tranACIDG").val(tranAcidObj);



	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = (day) + "-" + (month) + "-" + now.getFullYear();
	var priorDate = new Date(new Date().setDate(now.getDate() - 90));
	var startDay = ("0" + priorDate.getDate()).slice(-2);
	var startMonth = ("0" + (priorDate.getMonth() + 1)).slice(-2);
	var endDate = (startDay) + "-" + (startMonth) + "-" + priorDate.getFullYear();
	//setting date for autopopulate
	var tempSDate = priorDate.getFullYear() + "-" + (startMonth) + "-" + (startDay);
	var tempEDate = now.getFullYear() + "-" + (month) + "-" + (day);
	$('#geDate').val(tempEDate);
	$('#gsDate').val(tempSDate);


	var pageValJson = "{\n" +
		"    \"tranAcid\": \"" + tranAcidObj + "\",\n" +
		"    \"accountId\": \"" + accountId + "\",\n" +
		"    \"startDate\":\"" + endDate + "\",\n" +
		"\"endDate\":\"" + today + "\"}";

	//alert('pageValJson = ' + pageValJson)

	document.getElementById('load').style.visibility = "visible";

	// ajax call
	$.ajax({
		url: 'fetchGraphDetails',
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
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);

			var tranChannelDebitList = obj.debt3MonthList;
			var tranChannelCreditList = obj.credit3MonthList;
			var tranCredDebt = obj.trendChartCredDebt;

			$.fn.drawPieChartDebit(tranChannelDebitList);
			$.fn.drawPieChartDebitValue(tranChannelDebitList);
			$.fn.drawDebtBAR(tranChannelDebitList);
			$.fn.drawPieChartCredit(tranChannelCreditList);
			$.fn.drawPieChartCreditValue(tranChannelCreditList);
			$.fn.drawBARCREDIT(tranChannelCreditList);
			$.fn.drawLINEChartCred(tranCredDebt);
			$.fn.drawLINEChartDebt(tranCredDebt);

			$.fn.drawBARChartCredDebt(tranCredDebt);

			$("#credDivG").hide();
			$("#dbtDivG").hide();

			$(".debitTbl > .dbtBdy").empty();
			$(".creditTbl > .crdtBdy").empty();
			$(".tCredCount").text(obj.totCrdtCount);
			$(".tCredValCount").text(obj.totCrdtValueFrmt);
			$(".tDbtCount").text(obj.totDbtCount);
			$(".tDbtValCount").text(obj.totDbtValueFrmt);


			var debtTableList = obj.tranChannelDebit;
			var credTableList = obj.tranChannelCredit;


			debtTableList.forEach(function(items) {
				$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
					+ items.transactionType
					+ "</td><td><span name='dValue' value='" + items.debtCountAndPercent + "' data-sDate='" + endDate + "' data-eDate='" + today + "' data-channelType='" + items.transactionType + "' data-acid='" + tranAcidObj + "' data-crdDebFlg='D' class='textCapitalize pointer text-blue getTranDtls'  >"
					+ items.debtCountAndPercent
					+ "</td><td><span name='dSumValue' value='" + items.sumDebitValueFormatted + "' class='textCapitalize'>"
					+ items.sumDebitValueFormatted
					+ "</td></tr>").appendTo(".dbtBdy");
			});



			credTableList.forEach(function(items) {
				$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
					+ items.transactionType
					+ "</td><td><span name='cValue' value='" + items.crdtCountAndPercent + "' data-sDate='" + endDate + "' data-eDate='" + today + "' data-channelType='" + items.transactionType + "' data-acid='" + tranAcidObj + "' data-crdDebFlg='C' class='textCapitalize pointer text-blue getTranDtls'>"
					+ items.crdtCountAndPercent
					+ "</td><td><span name='cSumValue' value='" + items.sumDebitValueFormatted + "'  >"
					+ items.sumcreditValueFormatted
					+ "</td></tr>").appendTo(".crdtBdy");
			});


		},
		error: function(xhr, status, error) {
			toastr.error('Some Error Occured');
			console.log("xhr - " + xhr + "::" + "status - " + status + "::" + "error - " + error)
		}
	});






	$('#graphAnalysisModal').modal('show');
});


/*getTranDtls SHOW DETAILS OF TRANSACTION*/

$(document).on("click", ".getTranDtls", function() {
	var startDate = $(this).attr("data-sDate");
	var endDate = $(this).attr("data-eDate");
	var tranType = $(this).attr("data-channelType");
	var tranAcid = $(this).attr("data-acid");
	var credDbtFlg = $(this).attr("data-crdDebFlg");

	var pageValJson = JSON.stringify({
		tranAcid: tranAcid,
		credDebtFlag: credDbtFlg,
		channelType: tranType,
		startDate: startDate,
		endDate: endDate
	});

	//alert('pageValJson = ' + pageValJson);

	$.ajax({
		url: 'fetchGraphTranDtls',
		type: "POST",
		data: {
			pageValJson: pageValJson
		},
		headers: {
			"X-CSRF-TOKEN": $("input[name='_csrf']").val()
		},
		cache: false,
		success: function(response) {
			var obj = JSON.parse(JSON.stringify(response));
			var debtTableList = obj.accountDtoList;

			var newWindow = window.open("", "", "width=800,height=600");
            newWindow.document.write('<html><head><title>Transaction Summary</title>');
            
			newWindow.document.write('<link rel="stylesheet" th:href= "@{/plugins/datatables-buttons/css/buttons.bootstrap4.min.css}">');
        //    newWindow.document.write('<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">');
           // newWindow.document.write('<link href="https://cdn.datatables.net/1.11.3/css/jquery.dataTables.min.css" rel="stylesheet">');
            newWindow.document.write('<link rel="stylesheet" th:href="@{/plugins/datatables-responsive/css/responsive.bootstrap4.min.css}">');
            newWindow.document.write('<script th:src="@{/plugins/jquery/jquery.min.js}"></script>');
            newWindow.document.write('<script th:src="@{/plugins/jquery-validation/jquery.validate.min.js}"></script>');
            
            newWindow.document.write('<script th:src="@{/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js}"></script>');
            newWindow.document.write('<script th:src="@{/plugins/datatables-responsive/js/dataTables.responsive.min.js}"></script>');
            newWindow.document.write('<script th:src="@{/plugins/datatables-responsive/js/responsive.bootstrap4.min.js}"></script>');
            newWindow.document.write('<script th:src="@{/plugins/datatables-buttons/js/dataTables.buttons.min.js}"></script>');
            newWindow.document.write('<script th:src="@{/plugins/datatables-buttons/js/buttons.bootstrap4.min.js}"></script>');
            newWindow.document.write('<script th:src="@{/plugins/datatables-buttons/js/buttons.html5.min.js}"></script>');
            newWindow.document.write('<script th:src="@{/plugins/datatables-buttons/js/buttons.print.min.js}"></script>');
            
            newWindow.document.write('<script th:src="@{/plugins/datatables/jquery.dataTables.min.js}"></script>');
            newWindow.document.write('</head><body>');
            newWindow.document.write('<div class="container mt-4">');
            newWindow.document.write('<div class="card modal-content">');
            newWindow.document.write('<div class="modal-header custom-modal-header" style="background-image: linear-gradient(to right, rgba(0, 123, 255, 0.5), rgba(255, 0, 0, 0.5));">');
            newWindow.document.write('<h5 class="modal-title">Transaction Summary</h5>');
             newWindow.document.write('<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="window.close();">');
            newWindow.document.write('<span aria-hidden="true">&times;</span>');
            newWindow.document.write('</button>');
            newWindow.document.write('</div>');
            newWindow.document.write('<div class="card-body">');
            newWindow.document.write('<div class="row">');
            newWindow.document.write('<div class="col-sm-12 table-responsive">');
            newWindow.document.write('<table class="table table-sm table-head-fixed table-bordered table-responsive table-striped tranDtlsTbl" id="tranDtlsTbl" style="width: 100%;">');
            newWindow.document.write('<thead><tr><th>Transaction ID</th><th>Transaction Channel</th><th>Transaction Date</th><th>Transaction Amount</th><th>Credit / Debit</th><th>Pstd Date</th><th>Branch ID</th></tr></thead>');
            newWindow.document.write('<tbody id="trnBdy">');

            debtTableList.forEach(function(items) {
                newWindow.document.write('<tr><td>' + items.tranId + '</td><td>' + items.tranChannel + '</td><td>' + items.tranDate + '</td><td>' + items.tranAmt + '</td><td>' + items.creDebFlg + '</td><td>' + items.pstdDate + '</td><td>' + items.branchId + '</td></tr>');
            });

            newWindow.document.write('</tbody></table>');
            newWindow.document.write('</div>');
            newWindow.document.write('</div>');
            newWindow.document.write('</div>');
            newWindow.document.write('</div>');
            newWindow.document.write('</div>');
            newWindow.document.write('<script>');
            newWindow.document.write('$(document).ready(function() { $("#tranDtlsTbl").DataTable({');
            newWindow.document.write('"columnDefs": [],"order": [0, "asc"],"responsive": false,"lengthMenu": [25, 50, 75, 100],"autoWidth": false,"searching": true,"fixedHeader": true,"language": {"emptyTable": "No Data Available","search": "Search:"},});');
            newWindow.document.write('});');
            newWindow.document.write('<\/script>');
            newWindow.document.write('</body></html>');
            newWindow.document.close();
		},
		error: function(xhr, status, error) {
			toastr.error('Some Error Occurred');
			console.log("xhr - " + xhr + "::" + "status - " + status + "::" + "error - " + error);
		}
	});
});




/*getTranDtls SHOW DETAILS OF TRANSACTION*/

/*3 MONTH DEBIT GRAPH*/
$.fn.drawPieChartDebit = function(tranChannelDebitList) {
	$('#pieChartCOTP').remove();
	var topRiskData = tranChannelDebitList;
	var lblArray = [];
	topRiskData.forEach(function(item) {
		//lblArray = item.split(',');
		var lblTemp = item.split(',');
		lblArray.push(lblTemp);
	})
	var dataset = [];
	var label = [];
	lblArray.forEach(function(item) {
		var lblName = item.toString().split('~')[0];
		lblName.replace('[', '')
		lblName.replace(']', '')
		label.push(lblName);
		dataset.push(item.toString().split('~')[1]);
	})
	var donutData = {
		labels: label,
		datasets: [{
			data: dataset,
			backgroundColor: ['#FF0000', '#FFBF00', '#28A745', '#EDBB99', '#7FB3D5', '#F7DC6F', '#3498DB'],
		}],
	}
	$('#pieChartTP').append('<canvas id="pieChartCOTP" style="min-height: 300px; height: 300px; max-height: 300px; max-width: 100%;"></canvas>');

	var pieChartCanvasCOTPD = $('#pieChartCOTP').get(0).getContext('2d');
	var pieDataCO = donutData;
	var pieOptionsCO = {
		maintainAspectRatio: false,
		responsive: true,
		title: {
			display: true,
			text: 'Percent',
			position: 'bottom'
		}
	}
	new Chart(pieChartCanvasCOTPD, {
		type: 'pie',
		data: pieDataCO,
		options: pieOptionsCO
	})
};



$.fn.drawPieChartDebitValue = function(tranChannelDebitList) {
	$('#pieChartDBTTP').remove();
	var topRiskData = tranChannelDebitList;
	var lblArray = [];
	topRiskData.forEach(function(item) {
		//lblArray = item.split(',');
		var lblTemp = item.split(',');
		lblArray.push(lblTemp);
	})
	var dataset = [];
	var label = [];
	lblArray.forEach(function(item) {
		var lblName = item.toString().split('~')[0];
		lblName.replace('[', '')
		lblName.replace(']', '')
		label.push(lblName);
		dataset.push(item.toString().split('~')[2]);
	})
	var donutData = {
		labels: label,
		datasets: [{
			data: dataset,
			backgroundColor: ['#FF0000', '#FFBF00', '#28A745', '#EDBB99', '#7FB3D5', '#F7DC6F', '#3498DB'],
		}],
	}
	$('#pieChartDBT').append('<canvas id="pieChartDBTTP" style="min-height: 300px; height: 300px; max-height: 300px; max-width: 100%;"></canvas>');

	var pieChartCanvasCOTPD = $('#pieChartDBTTP').get(0).getContext('2d');
	var pieDataCO = donutData;
	var pieOptionsCO = {
		maintainAspectRatio: false,
		responsive: true,
		title: {
			display: true,
			text: 'Value',
			position: 'bottom'
		}
	}
	new Chart(pieChartCanvasCOTPD, {
		type: 'pie',
		data: pieDataCO,
		options: pieOptionsCO
	})
};

/*3 MONTH DEBIT GRAPH*/

/*3 MONTH GRAPH CREDIT*/
$.fn.drawPieChartCredit = function(tranChannelCreditList) {


	$('#pieChartTQ').remove();

	var creditData = tranChannelCreditList;
	/*var lblArray = [];
	creditData.forEach(function(item) {
		lblArray = item.split(',');
	})*/

	var dataset = [];
	var label = [];
	creditData.forEach(function(item) {
		var lblName = item.split('~')[0];
		lblName.replace('[', '')
		lblName.replace(']', '')
		label.push(lblName);
		dataset.push(item.split('~')[3]);
	})

	var donutData = {
		labels: label,
		datasets: [{
			data: dataset,
			backgroundColor: ['#FF0000', '#FFBF00', '#28A745', '#EDBB99', '#7FB3D5', '#F7DC6F', '#3498DB'],
		}],

	}

	$('#pieChartQQ').append('<canvas id="pieChartTQ" style="min-height: 300px; height: 300px; max-height: 300px; max-width: 100%;"></canvas>');

	var pieChartCanvasCOTPD = $('#pieChartTQ').get(0).getContext('2d');


	var pieDataCO = donutData;

	var pieOptionsCO = {
		maintainAspectRatio: false,
		responsive: true,
		title: {
			display: true,
			text: 'Percent',
			position: 'bottom'
		}
	}

	new Chart(pieChartCanvasCOTPD, {
		type: 'pie',
		data: pieDataCO,
		options: pieOptionsCO
	})

};

$.fn.drawPieChartCreditValue = function(tranChannelCreditList) {


	$('#pieChartValQ').remove();

	var creditData = tranChannelCreditList;
	/*var lblArray = [];
	creditData.forEach(function(item) {
		lblArray = item.split(',');
	})*/

	var dataset = [];
	var label = [];
	creditData.forEach(function(item) {
		var lblName = item.split('~')[0];
		lblName.replace('[', '')
		lblName.replace(']', '')
		label.push(lblName);
		dataset.push(item.split('~')[2]);
	})

	var donutData = {
		labels: label,
		datasets: [{
			data: dataset,
			backgroundColor: ['#FF0000', '#FFBF00', '#28A745', '#EDBB99', '#7FB3D5', '#F7DC6F', '#3498DB'],
		}],

	}

	$('#pieChartValue').append('<canvas id="pieChartValQ" style="min-height: 300px; height: 300px; max-height: 300px; max-width: 100%;"></canvas>');

	var pieChartCanvasCOTPD = $('#pieChartValQ').get(0).getContext('2d');


	var pieDataCO = donutData;

	var pieOptionsCO = {
		maintainAspectRatio: false,
		responsive: true,
		title: {
			display: true,
			text: 'Value',
			position: 'bottom'
		}
	}

	new Chart(pieChartCanvasCOTPD, {
		type: 'pie',
		data: pieDataCO,
		options: pieOptionsCO
	})

};
/*3 MONTH GRAPH CREDIT*/


/*LINE CHART FOR CREDIT AND DEBIT 3 MONTHS*/

$.fn.drawLINEChartCred = function(tranCredDebt) {

	$('#credLINEChart').remove();

	var trendData = tranCredDebt;
	var dataArray = [];

	trendData.forEach(function(items) {
		dataArray.push(items.split(','));
	})

	var label = [];
	var creditDataset = [];
	trendData.forEach(function(itemd) {

		var lblName = itemd.split('~')[0];
		lblName.replace('[', '')
		lblName.replace(']', '')
		label.push(lblName);
		creditDataset.push(itemd.split('~')[1]);
	});

	$('#credLINEBAR').append('<canvas id="credLINEChart" height="300"></canvas>');

	var $visitorsChart = $('#credLINEChart')
	var ticksStyle = {
		fontColor: '#495057',
		fontStyle: 'bold'
	}
	// eslint-disable-next-line no-unused-vars
	var mode = 'index'
	var intersect = true

	var visitorsChart = new Chart($visitorsChart, {
		data: {
			//labels: ['NEFT/RTGS', 'Cash At Branch', 'Cash At ATM', 'IMPS', 'UPI', 'CBWTR', 'General Transactions'],
			labels: label,
			datasets: [{
				type: 'line',
				label: 'Credit',
				//data: [1000, 6000, 0, 8000, 70000, 6000, 9000],
				data: creditDataset,
				lineTension: 0,
				backgroundColor: 'transparent',
				borderColor: '#28A745',
				pointBorderColor: '#28A745',
				pointBackgroundColor: '#28A745',
				fill: false
				// pointHoverBackgroundColor: '#007bff',
				// pointHoverBorderColor : '#007bff'
			}]
		},
		options: {
			maintainAspectRatio: false,
			tooltips: {
				mode: mode,
				intersect: intersect,
				//bezierCurve: false
			},
			hover: {
				mode: mode,
				intersect: intersect
			},
			legend: {
				display: true
			},
			scales: {
				yAxes: [{
					// display: false,
					gridLines: {
						display: true,
						lineWidth: '4px',
						color: 'rgba(0, 0, 0, .2)',
						zeroLineColor: 'transparent'
					},
					ticks: $.extend({
						beginAtZero: true,

					}, ticksStyle)
				}],
				xAxes: [{
					display: true,
					gridLines: {
						display: true
					},
					ticks: ticksStyle
				}]
			}
		}
	})

};


$.fn.drawLINEChartDebt = function(tranCredDebt) {

	$('#debtLINEChart').remove();

	var trendData = tranCredDebt;
	var dataArray = [];

	trendData.forEach(function(items) {
		dataArray.push(items.split(','));
	})

	var label = [];
	var debitDataset = [];


	trendData.forEach(function(itemd) {

		var lblName = itemd.split('~')[0];
		lblName.replace('[', '')
		lblName.replace(']', '')
		label.push(lblName);
		debitDataset.push(itemd.split('~')[2]);
	});

	$('#debtLINEBAR').append('<canvas id="debtLINEChart" height="300"></canvas>');

	var $visitorsChart = $('#debtLINEChart')
	var ticksStyle = {
		fontColor: '#495057',
		fontStyle: 'bold'
	}
	// eslint-disable-next-line no-unused-vars
	var mode = 'index'
	var intersect = true



	var visitorsChart = new Chart($visitorsChart, {
		data: {
			//labels: ['NEFT/RTGS', 'Cash At Branch', 'Cash At ATM', 'IMPS', 'UPI', 'CBWTR', 'General Transactions'],
			labels: label,
			datasets: [{
				type: 'line',
				label: 'Debit',
				//data: [4500, 3000, 500, 0, 25000, 20000, 8000],
				data: debitDataset,
				lineTension: 0,
				backgroundColor: 'tansparent',
				borderColor: '#FFBF00',
				pointBorderColor: '#FFBF00',
				pointBackgroundColor: '#FFBF00',
				fill: false
				// pointHoverBackgroundColor: '#ced4da',
				// pointHoverBorderColor : '#ced4da'
			}]
		},
		options: {
			maintainAspectRatio: false,
			tooltips: {
				mode: mode,
				intersect: intersect,
				//bezierCurve: false
			},
			hover: {
				mode: mode,
				intersect: intersect
			},
			legend: {
				display: true
			},
			scales: {
				yAxes: [{
					// display: false,
					gridLines: {
						display: true,
						lineWidth: '4px',
						color: 'rgba(0, 0, 0, .2)',
						zeroLineColor: 'transparent'
					},
					ticks: $.extend({
						beginAtZero: true,

					}, ticksStyle)
				}],
				xAxes: [{
					display: true,
					gridLines: {
						display: true
					},
					ticks: ticksStyle
				}]
			}
		}
	})


};


/*LINE CHART FOR CREDIT AND DEBIT 3 MONTHS*/



/*BAR CHART FOR CREDIT AND DEBIT 3 MONTHS*/

$.fn.drawBARChartCredDebt = function(tranCredDebt) {


	$('#visitors-chart').remove();
	var trendData = tranCredDebt;
	var dataArray = [];

	trendData.forEach(function(items) {
		dataArray.push(items.split(','));
	})

	var label = [];
	var creditDataset = [];
	var debitDataset = [];


	trendData.forEach(function(itemd) {

		var lblName = itemd.split('~')[0];
		lblName.replace('[', '')
		lblName.replace(']', '')
		label.push(lblName);
		creditDataset.push(itemd.split('~')[1]);
		debitDataset.push(itemd.split('~')[2]);
	});

	$('#CREDDEBTBAR').append('<canvas id="visitors-chart" height="300"></canvas>');

	var $visitorsChart = $('#visitors-chart')
	var ticksStyle = {
		fontColor: '#495057',
		fontStyle: 'bold'
	}
	// eslint-disable-next-line no-unused-vars
	var mode = 'index'
	var intersect = true



	var visitorsChart = new Chart($visitorsChart, {
		data: {
			//labels: ['NEFT/RTGS', 'Cash At Branch', 'Cash At ATM', 'IMPS', 'UPI', 'CBWTR', 'General Transactions'],
			labels: label,
			datasets: [{
				type: 'line',
				label: 'Credit',
				//data: [1000, 6000, 0, 8000, 70000, 6000, 9000],
				data: creditDataset,
				lineTension: 0,
				backgroundColor: 'transparent',
				borderColor: '#28A745',
				pointBorderColor: '#28A745',
				pointBackgroundColor: '#28A745',
				fill: false
				// pointHoverBackgroundColor: '#007bff',
				// pointHoverBorderColor : '#007bff'
			}, {
				type: 'line',
				label: 'Debit',
				//data: [4500, 3000, 500, 0, 25000, 20000, 8000],
				data: debitDataset,
				lineTension: 0,
				backgroundColor: 'tansparent',
				borderColor: '#FFBF00',
				pointBorderColor: '#FFBF00',
				pointBackgroundColor: '#FFBF00',
				fill: false
				// pointHoverBackgroundColor: '#ced4da',
				// pointHoverBorderColor : '#ced4da'
			}]
		},
		options: {
			maintainAspectRatio: false,
			tooltips: {
				mode: mode,
				intersect: intersect,
				//bezierCurve: false
			},
			hover: {
				mode: mode,
				intersect: intersect
			},
			legend: {
				display: true
			},
			scales: {
				yAxes: [{
					// display: false,
					gridLines: {
						display: true,
						lineWidth: '4px',
						color: 'rgba(0, 0, 0, .2)',
						zeroLineColor: 'transparent'
					},
					ticks: $.extend({
						beginAtZero: true,

					}, ticksStyle)
				}],
				xAxes: [{
					display: true,
					gridLines: {
						display: true
					},
					ticks: ticksStyle
				}]
			}
		}
	})
	//	}	

};

/*BAR CHART FOR CREDIT AND DEBIT 3 MONTHS*/

/*checkRadio FUNCTION*/

$('.checkRadio').click(function() {

	var value = $("input[name='options']:checked").val();
	if (value === 'optionPie') {
		$(".barView").hide();
		$(".pieView").show();
	} else if (value === 'optionBar') {
		$(".pieView").hide();
		$(".barView").show();
	}
});

$('.checkRadioCred').click(function() {

	var valueCred = $("input[name='optionsCred']:checked").val();
	if (valueCred === 'optionPieCred') {
		$(".barViewCred").hide();
		$(".pieViewCred").show();
	} else if (valueCred === 'optionBarCred') {
		$(".pieViewCred").hide();
		$(".barViewCred").show();
	}
})
/*checkRadio FUNCTION*/


/*BAR CHART*/

$.fn.drawDebtBAR = function(tranChannelDebitList) {

	$('#barChart').remove();

	var topRiskData = tranChannelDebitList;

	var lblArray = [];
	topRiskData.forEach(function(item) {
		//lblArray = item.split(',');
		var lblTemp = item.split(',');
		lblArray.push(lblTemp);
	})
	var dataset = [];
	var label = [];
	lblArray.forEach(function(itemO) {
		var lblName = itemO.toString().split("~")[0];
		lblName.replace('[', '')
		lblName.replace(']', '')
		label.push(lblName);
		dataset.push(itemO.toString().split("~")[1]);
	})

	var areaChartData = {
		labels: label,
		//labels  : ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'Debit Summary',
				backgroundColor: 'rgba(60,141,188,0.9)',
				borderColor: 'rgba(60,141,188,0.8)',
				pointRadius: false,
				pointColor: '#3b8bba',
				pointStrokeColor: 'rgba(60,141,188,1)',
				pointHighlightFill: '#fff',
				pointHighlightStroke: 'rgba(60,141,188,1)',
				data: dataset
				// data                : [28, 48, 40, 19, 86, 27, 90]
			},
		]
	}


	$('#chartBAR').append('<canvas id="barChart" style="min-height: 360px; height: 360px; max-height: 360px; max-width: 100%;"></canvas>');

	var barChartCanvas = $('#barChart').get(0).getContext('2d')
	var barChartData = $.extend(true, {}, areaChartData)
	// var temp0 = areaChartData.datasets[0]
	// var temp1 = areaChartData.datasets[1]
	// barChartData.datasets[1] = temp1
	// barChartData.datasets[0] = temp0

	var barChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		datasetFill: false
	}

	new Chart(barChartCanvas, {
		type: 'bar',
		data: barChartData,
		options: barChartOptions
	})



};


$.fn.drawBARCREDIT = function(tranChannelCreditList) {

	$('#barChartCred').remove();

	var topRiskData = tranChannelCreditList;

	var lblArray = [];
	topRiskData.forEach(function(item) {
		//lblArray = item.split(',');
		var lblTemp = item.split(',');
		lblArray.push(lblTemp);
	})
	var dataset = [];
	var label = [];
	lblArray.forEach(function(item) {
		var lblName = item.toString().split('~')[0];
		lblName.replace('[', '')
		lblName.replace(']', '')
		label.push(lblName);
		dataset.push(item.toString().split('~')[3]);
	})



	var areaChartData = {
		labels: label,
		//labels  : ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'Credit Summary',
				backgroundColor: 'rgba(60, 179, 113,0.9)',
				borderColor: 'rgba(60, 179, 113,0.8)',
				pointRadius: false,
				pointColor: '#3b8bba',
				pointStrokeColor: 'rgba(60, 179, 113,1)',
				pointHighlightFill: '#fff',
				pointHighlightStroke: 'rgba(60, 179, 113,1)',
				data: dataset
				// data                : [28, 48, 40, 19, 86, 27, 90]
			},
		]
	}

	$('#chartBARCREDIT').append('<canvas id="barChartCred" style="min-height: 360px; height: 360px; max-height: 360px; max-width: 100%;"></canvas>');

	var barChartCanvas = $('#barChartCred').get(0).getContext('2d')
	var barChartData = $.extend(true, {}, areaChartData)
	//var temp0 = areaChartData.datasets[0]
	//  var temp1 = areaChartData.datasets[1]
	//  barChartData.datasets[0] = temp1
	// barChartData.datasets[1] = temp0

	var barChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		datasetFill: false
	}

	new Chart(barChartCanvas, {
		type: 'bar',
		data: barChartData,
		options: barChartOptions
	})



};

/*BAR CHART*/


$(document).ready(function() {

	$('.dmat.transaction').click(function() {

		if ($.fn.DataTable.isDataTable('#dmatTransactionTable')) {
			$('#dmatTransactionTable').DataTable().clear().destroy();
		}
		var custId = $(this).attr('id');
		var pageValJson = "{\"custId\":" + "\"" + custId + "\"}";

		console.log(pageValJson);
		document.getElementById('load').style.visibility = "visible";

		$.ajax({
			url: 'viewDmatTransactionModel',
			type: "POST",
			data: {
				pageValJson: pageValJson
			},
			headers: {
				"X-CSRF-TOKEN": $("input[name='_csrf']").val()
			},
			cache: false,
			success: function(response) {
				setTimeout(function() {
					document.getElementById('interactive');
				}, 1000);
				document.getElementById('load').style.visibility = "hidden";

				var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);

				var itemTableBody = $('#itemTableBody2');
				itemTableBody.empty(); // Clear any existing items

				if (!obj || obj.clientList.length === 0) {
					itemTableBody.append('<tr><td colspan="14" class="text-center">No data found</td></tr>');
					$('#myModal2').modal('show');

					return;
				}

				obj.clientList.forEach(function(item, index) {
					itemTableBody.append(
						'<tr>' +
						'<td>' + item.dpmClientId + '</td>' +
						'<td>' + item.id + '</td>' +
						'<td>' + item.shortName + '</td>' +
						'<td>' + item.firstHolderName + '</td>' +
						'<td><a id="Accountbtn" class="btn btn-sm bg-orange" ' +
						'title="Account Statement">' +
						'<em class="fa fa-receipt fa-1x text-white"></em></a></td>' +

						'</tr>'
					);
				});

				$("#dmatTransactionTable").DataTable({
					"columnDefs": [{
						orderable: false,
						targets: [1, 2, 4]
					}],
					"order": [0, "desc"],
					"responsive": false,
					"lengthMenu": [10, 25, 50, 75, 100],
					"autoWidth": true,
					"searching": true,
					"fixedHeader": false,
					"buttons": ["csv", "excel", "pdf", "print"],
					"language": {
						"emptyTable": "No Data Available"
					}
				}).buttons().container().appendTo(
					'#dmatTransactionTable_wrapper .col-md-6:eq(0)');

				var additionalDataButton = $('#Accountbtn');
				additionalDataButton.data('dpmClientIdList', obj.dpmClientIdList);

				$('#myModal2').on('show.bs.modal', function() {

					$('#secondTable').DataTable().destroy();

				});
				$('#myModal2').on('show.bs.modal', function() {
					$('#secondTable').hide();
					$('#tableHeader').hide();
				});
				$('#myModal2').modal('show');
			},
			error: function(xhr, status, error) {
				console.log(xhr);
				toastr.error('Some Error Occurred here');
			}
		});
	});
	
	$(document).on('click', '#Accountbtn', function() {
		var dpmClientIdList = $(this).data('dpmClientIdList');

		var pageValJson = JSON.stringify({
			dpmClientIdList: dpmClientIdList
		});

		console.log(pageValJson);
		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'viewDmatAccountModel',
			type: "POST",
			data: {
				pageValJson: pageValJson
			},
			headers: {
				"X-CSRF-TOKEN": $("input[name='_csrf']").val()
			},
			cache: false,
			success: function(response) {
				setTimeout(function() {
					document.getElementById('interactive');
				}, 1000);
				document.getElementById('load').style.visibility = "hidden";

				var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);
				var itemTableBody = $('#tranBody');
				itemTableBody.empty(); // Clear any existing items

				if (!obj || !obj.tranList || obj.tranList.length === 0) {
					itemTableBody.append('<tr><td colspan="14" class="text-center">No data found</td></tr>');
					$('#secondTable').show();
					return;
				}

				obj.tranList.forEach(function(item, index) {
					itemTableBody.append(
						'<tr>' +
						'<td>' + item.bookingDate + '</td><td>' + item.dpmRefferenceNumber + '</td>' +				
						'<td>' + item.particulars + '</td><td>' + item.isinCode + '</td>' +
						'<td>' + item.name + '</td><td>' + item.debit + '</td>' +				
						'<td>' + item.credit + '</td><td>' + item.quantity + '</td>' +		
						'<td>' + item.closingRate + '</td><td>' + item.dpmClientId + '</td>' +
						'</tr>'
					);
				});
				$("#secondTable").DataTable({
					"columnDefs": [{
						orderable: false,
						targets: [1, 2]
					}],
					"order": [0, "desc"],
					"responsive": false,
					"lengthMenu": [10, 25, 50, 75, 100],
					"autoWidth": true,
					"searching": true,
					"fixedHeader": false,
					"buttons": [
						{
							extend: 'csv',
							title: 'Transaction Data',
							exportOptions: {
								columns: ':visible,:hidden'
							}
						},
						{
							extend: 'excel',
							title: 'Transaction Data',
							exportOptions: {
								columns: ':visible,:hidden'
							}
						},
						{
							extend: 'pdf',
							title: 'Transaction Data',
							orientation: 'landscape',
							pageSize: 'A4',
							exportOptions: {
								columns: ':visible,:hidden'
							},
							customize: function(doc) {
								doc.styles.tableHeader = {
									bold: true,
									fontSize: 11,
									color: 'black',
									fillColor: '#f2f2f2'
								};
								doc.styles.title = {
									fontSize: 14,
									bold: true,
									alignment: 'center'
								};
								doc.content[1].table.widths = '*'.repeat(doc.content[1].table.body[0].length).split('');
							}
						},
						{
							extend: 'print',
							title: 'Transaction Data',
							exportOptions: {
								columns: ':visible,:hidden'
							}
						}],
					"language": {
						"emptyTable": "No Data Available"
					}
				}).buttons().container().appendTo(
					'#secondTable_wrapper .col-md-6:eq(0)');
				$('#tableHeader').show();
				$('#secondTable').show();
			},
			error: function(xhr, status, error) {
				console.log(xhr);
				toastr.error('Some Error Occurred here');
			}
		});
	}); 
	
	
	
		$('.freezeStscls').click(function() {
		var accountId = $(this).attr('data-account-id');
		var pageValJson = "{\"accountId\":" + "\"" + accountId + "\"}";

		console.log(pageValJson);
		document.getElementById('load').style.visibility = "visible";

		$.ajax({
			url: 'viewFreezeStatusModel',
			type: "POST",
			data: {
				pageValJson: pageValJson
			},
			headers: {
				"X-CSRF-TOKEN": $("input[name='_csrf']").val()
			},
			cache: false,
			success: function(response) {
				setTimeout(function() {
					document.getElementById('interactive');
				}, 1000);
				document.getElementById('load').style.visibility = "hidden";

				var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);



				var itemTableBody = $('#freezeStatusTable');
				itemTableBody.empty(); // Clear any existing items

				if (!obj || obj.dtoList.length === 0) {
					itemTableBody.append('<tr><td colspan="14" class="text-center">No data found</td></tr>');
					$('#freezeStatusModal').modal('show');
					return;
				}

				obj.dtoList.forEach(function(item, index) {
					itemTableBody.append(
						'<tr>' +
						'<td>' + item.recordId + '</td>' +
						'<td>' + item.acid + '</td>' +
						'<td>' + item.freezeCode + '</td>' +
						'<td>' + item.freezeReasonCode + '</td>' +
						'<td>' + item.freezeRemarks + '</td>' +
						'<td>' + item.freezeDate + '</td>' +
						'<td>' + item.lienAmt + '</td>' +
						'<td>' + item.lienRemarks + '</td>' +
						'<td>' + item.lienDate + '</td>' +
						'<td>' + item.recUploadDate + '</td>' +
						'</tr>'
					);
				});

				$("#statusTable").DataTable({
					"columnDefs": [{
						orderable: false,
						targets: [7, 8]
					}],
					"order": [0, "desc"],
					"responsive": false,
					"lengthMenu": [10, 25, 50, 75, 100],
					"autoWidth": true,
					"searching": true,
					"fixedHeader": false,
					"buttons": [
						{
							extend: 'csv',
							title: 'Transaction Data',
							exportOptions: {
								columns: ':visible,:hidden'
							}
						},
						{
							extend: 'excel',
							title: 'Transaction Data',
							exportOptions: {
								columns: ':visible,:hidden'
							}
						},
						{
							extend: 'pdf',
							title: 'Transaction Data',
							orientation: 'landscape',
							pageSize: 'A4',
							exportOptions: {
								columns: ':visible,:hidden'
							},
							customize: function(doc) {
								doc.styles.tableHeader = {
									bold: true,
									fontSize: 11,
									color: 'black',
									fillColor: '#f2f2f2'
								};
								doc.styles.title = {
									fontSize: 14,
									bold: true,
									alignment: 'center'
								};
								doc.content[1].table.widths = '*'.repeat(doc.content[1].table.body[0].length).split('');
							}
						},
						{
							extend: 'print',
							title: 'Transaction Data',
							exportOptions: {
								columns: ':visible,:hidden'
							}
						}
					],
					"language": {
						"emptyTable": "No Data Available"
					}
				}).buttons().container().appendTo(
					'#statusTable_wrapper .col-md-6:eq(0)');

				$('#freezeStatusModal').modal('show');
			},
			error: function(xhr, status, error) {
				console.log(xhr);
				toastr.error('Some Error Occurred here');
			}
		});
	});
	
	
		$('.btn-drona2.transaction').click(function() {
		var custId = $(this).attr('id');
		var pageValJson = "{\"custId\":" + "\"" + custId + "\"}";

		console.log(pageValJson);
		document.getElementById('load').style.visibility = "visible";

		$.ajax({
			url: 'viewTransactionModel',
			type: "POST",
			data: {
				pageValJson: pageValJson
			},
			headers: {
				"X-CSRF-TOKEN": $("input[name='_csrf']").val()
			},
			cache: false,
			success: function(response) {
				setTimeout(function() {
					document.getElementById('interactive');
				}, 1000);
				document.getElementById('load').style.visibility = "hidden";

				var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);



				var itemTableBody = $('#itemTableBody');
				itemTableBody.empty(); // Clear any existing items

				if (!obj || obj.dtoList.length === 0) {
					itemTableBody.append('<tr><td colspan="14" class="text-center">No data found</td></tr>');
					$('#myModal').modal('show');
					return;
				}

				obj.dtoList.forEach(function(item, index) {
					itemTableBody.append(
						'<tr>' +
						'<th scope="row">' + (index + 1) + '</th>' +
						'<td>' + item.cardNumber + '</td>' +
						'<td>' + item.cmsAccountNumber + '</td>' +
						'<td>' + item.txnReferenceNumber + '</td>' +
						'<td>' + item.txnDate + '</td>' +
						'<td>' + item.txnCode + '</td>' +
						'<td>' + item.txnAmount + '</td>' +
						'<td>' + item.txnCurrency + '</td>' +
						'<td>' + item.transactionDescription + '</td>' +
						'<td>' + item.mcc + '</td>' +
						'<td>' + item.setDate + '</td>' +
						'<td>' + item.cdIndi + '</td>' +
						'<td>' + item.approvalCode + '</td>' +
						'<td>' + item.channelId + '</td>' +
						'</tr>'
					);
				});

				$("#transactionTable").DataTable({
					"columnDefs": [{
						orderable: false,
						targets: [7, 8]
					}],
					"order": [0, "desc"],
					"responsive": false,
					"lengthMenu": [10, 25, 50, 75, 100],
					"autoWidth": true,
					"searching": true,
					"fixedHeader": false,
					"buttons": [
						{
							extend: 'csv',
							title: 'Transaction Data',
							exportOptions: {
								columns: ':visible,:hidden'
							}
						},
						{
							extend: 'excel',
							title: 'Transaction Data',
							exportOptions: {
								columns: ':visible,:hidden'
							}
						},
						{
							extend: 'pdf',
							title: 'Transaction Data',
							orientation: 'landscape',
							pageSize: 'A4',
							exportOptions: {
								columns: ':visible,:hidden'
							},
							customize: function(doc) {
								doc.styles.tableHeader = {
									bold: true,
									fontSize: 11,
									color: 'black',
									fillColor: '#f2f2f2'
								};
								doc.styles.title = {
									fontSize: 14,
									bold: true,
									alignment: 'center'
								};
								doc.content[1].table.widths = '*'.repeat(doc.content[1].table.body[0].length).split('');
							}
						},
						{
							extend: 'print',
							title: 'Transaction Data',
							exportOptions: {
								columns: ':visible,:hidden'
							}
						}
					],
					"language": {
						"emptyTable": "No Data Available"
					}
				}).buttons().container().appendTo(
					'#transactionTable_wrapper .col-md-6:eq(0)');

				$('#myModal').modal('show');
			},
			error: function(xhr, status, error) {
				console.log(xhr);
				toastr.error('Some Error Occurred here');
			}
		});
	});
});
