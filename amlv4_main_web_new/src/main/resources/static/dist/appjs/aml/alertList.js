//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
}
$(document).ready(function() {
	var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}
});
$(".fetchAlertDetails").click(
	function() {
		var flg = $(this).attr('flg');
		var val = $(this).attr('val');
		var risk = $(this).attr('risk');
		var regFlg = $(this).attr('regFlg');
		var strFlg = $(this).attr('strFlg');
		if (flg == 'UCIC') {
			flg = 'U';
		} else if (flg == 'Account') {
			flg = 'A';
		}
		var alertStatus = $('#filterAlertStatus').val();
		var alertConstitution = '';
		var pageValJson = "{\"alertAggFlg\":" + "\"" + flg + "\",\"alertConstitution\":" + "\"" + alertConstitution
			+ "\",\"regStatus\":" + "\"" + regFlg + "\",\"strStatus\":" + "\"" + strFlg + "\",\"ucicRisk\":" + "\"" + risk
			+ "\",\"alertStatus\":" + "\"" + alertStatus + "\",\"alertAggVal\":" + "\"" + val + "\"}";
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJson")
			.val(ciphertext + ':~:' + passphrase);
		$("#mainForm").attr('action', './fetchAlertDtls');
		$("#mainForm").submit();
	});


//search method
$("#getReport").click(
	function() {
		var alertStatus = "alert_status";
		var searchValue = $('#alertStatus').val().toUpperCase();
		alertStatus = "alert_status";

		var alertAggKey = "ALERT_AGG_FLG";
		var alertAggKey = $('#alertAggKey').val().toUpperCase();
		var alertAggValue = $('#alertAggValue').val();
		if (alertAggValue == 'UCIC') {
			alertAggValue = 'U';
		} else if (alertAggValue == 'Account') {
			alertAggValue = 'A';
		}
		if (searchValue == '') {
			toastr.info('Please Select Ticket Status');
		} else {
			var pageValJson = "{\"searchParam\":" + "\"" + alertStatus + "\",\n" +
				"\"alertAggKey\": \"" + alertAggKey + "\",\n" +
				"\"alertAggFlg\": \"" + alertAggKey + "\",\n"
				+ "\"alertAggValue\": \"" + alertAggValue + "\",\n"
				+ "\"alertStatus\": \"" + searchValue + "\"}";

			//console.log("pageValJson " + pageValJson);
			//alert("pageValJson " + pageValJson);
			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
				.toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
				pageValJson);
			$("#encryptedJsonSearch").val(ciphertext + ':~:' + passphrase);
			$("#searchAlertId").submit();
		}
	});

$("#accTabLink").click(function() {
	var pageValJson = "{\"alertAggKey\": \"" + "A" + "\",\n" +
		"\"alertAggFlg\": \"" + "A" + "\"}";
	fetchAlertList(pageValJson);
});

$("#ucicTabLink").click(function() {
	var pageValJson = "{\"alertAggKey\": \"" + "U" + "\",\n" +
		"\"alertAggFlg\": \"" + "U" + "\"}";
	fetchAlertList(pageValJson);
});

$("#custTabLink").click(function() {
	var pageValJson = "{\"alertAggKey\": \"" + "C" + "\",\n" +
		"\"alertAggFlg\": \"" + "C" + "\"}";
	fetchAlertList(pageValJson);

});

function fetchAlertList(pageValJson) {
	$("#encryptedJson").val(pageValJson);
	$("#mainForm").submit();
}
function fetchAlertListByStatus(aggKey, alertStatus) {
	var pageValJson = "{\"alertAggKey\": \"" + aggKey + "\"," + "\"alertAggFlg\": \"" + aggKey + "\"," + "\"alertStatus\": \"" + alertStatus + "\"}";
	$("#encryptedJson").val(pageValJson);
	$("#mainForm").submit();
}

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
				$("#custTab > #tBodyCust").empty();
				$("#ruleTab > #tBodyRule").empty();
				$("#amtTab > #tBodyAmt").empty();
				$("#cntTab > #tBodyCnt").empty();
				$("#ctrTab > #tBodyCtrReg").empty();
				$("#ntrTab > #tBodyNtrReg").empty();
				$("#cbwtrTab > #tBodyCbwtrReg").empty();
				$("#strTab > #tBodyStr").empty();
				$("#alertCountTab > #tBodyAlertCnt").empty();
				$("#ucicCustTab > #tBodyUcicCust").empty();
				$("#ucicId").text(val);
				if (searchFlg == 'Customer') {
					obj.custDataList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.custId
							+ "</td><td class='text-capitalize'>"
							+ items.custFullName
							+ "</td><td class='text-capitalize'>"
							+ items.custPanNo
							+ "</td><td> "
							+ items.branchId
							+ "</td></tr>").appendTo("#tBodyCust");
					});
					$('#custTab').show();
					$('#cntTab').hide();
					$('#amtTab').hide();
					$('#ruleTab').hide();
					$('#ucicCustTab').hide();
					$('#ctrTab').hide();
					$('#ntrTab').hide();
					$('#cbwtrTab').hide();
					$('#strTab').hide();
					$('#alertCountTab').hide();
				} else if (searchFlg == 'Rule') {
					obj.alertList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.alertRuleId
							+ "</td><td class='text-capitalize'>"
							+ items.alertRuleDesc
							+ "</td><td   class='text-capitalize'>"
							+ items.alertRuleIndicator
							+ "</td><td> "
							+ items.alertRuleClassification
							+ "</td></tr>").appendTo("#tBodyRule");
					});
					$('#custTab').hide();
					$('#cntTab').hide();
					$('#amtTab').hide();
					$('#ruleTab').show();
					$('#ctrTab').hide();
					$('#ntrTab').hide();
					$('#cbwtrTab').hide();
					$('#strTab').hide();
					$('#ucicCustTab').hide();
					$('#alertCountTab').hide();
				} else if (searchFlg == 'Amount') {
					obj.alertList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.alertId
							+ "</td><td>"
							+ items.alertRuleId
							+ "</td><td>"
							+ items.alertRuleDesc
							+ "</td><td>"
							+ items.alertVal
							+ "</td></tr>").appendTo("#tBodyAmt");
					});
					$('#custTab').hide();
					$('#ruleTab').hide();
					$('#cntTab').hide();
					$('#ucicCustTab').hide();
					$('#amtTab').show();
					$('#ctrTab').hide();
					$('#ntrTab').hide();
					$('#cbwtrTab').hide();
					$('#strTab').hide();
					$('#alertCountTab').hide();
				} else if (searchFlg == 'Count') {
					obj.alertList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.alertId
							+ "</td><td> "
							+ items.alertRuleId
							+ "</td><td> "
							+ items.alertRuleDesc
							+ "</td><td>"
							+ items.alertVal
							+ "</td></tr>").appendTo("#tBodyCnt");
					});
					$('#custTab').hide();
					$('#amtTab').hide();
					$('#ruleTab').hide();
					$('#ctrTab').hide();
					$('#ntrTab').hide();
					$('#cbwtrTab').hide();
					$('#strTab').hide();
					$('#ucicCustTab').hide();
					$('#alertCountTab').hide();
					$('#cntTab').show();
				} else if (searchFlg == 'AlertCount') {
					obj.alertList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.alertId
							+ "</td><td> "
							+ items.alertRuleId
							+ "</td><td> "
							+ items.alertRuleDesc
							+ "</td><td>"
							+ items.alertVal
							+ "</td><td>"
							+ items.alertValCnt
							+ "</td></tr>").appendTo("#tBodyAlertCnt");
					});
					$('#custTab').hide();
					$('#amtTab').hide();
					$('#ctrTab').hide();
					$('#ntrTab').hide();
					$('#cbwtrTab').hide();
					$('#strTab').hide();
					$('#ruleTab').hide();
					$('#alertCountTab').show();
					$('#cntTab').hide();
					$('#ucicCustTab').hide();

				} else if (searchFlg == 'UcicCust') {
					obj.custDataList.forEach(function(items) {
						$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ items.custId
							+ "</td><td class='text-capitalize'> "
							+ items.custFullName
							+ "</td><td>"
							+ items.custPanNo
							+ "</td><td> "
							+ items.branchId
							+ "</td></tr>").appendTo("#tBodyUcicCust");
					});
					$('#custTab').hide();
					$('#amtTab').hide();
					$('#ruleTab').hide();
					$('#alertCountTab').hide();
					$('#cntTab').hide();
					$('#ctrTab').hide();
					$('#ntrTab').hide();
					$('#cbwtrTab').hide();
					$('#strTab').hide();
					$('#ucicCustTab').show();
				} else if (searchFlg == 'regReport') {
					let ctrFlg = true;
					let ntrFlg = true;
					let cbwtrFlg = true;
					let map = obj.regDataOldList;
					$.each(map, function(key, value) {
						if (key == 'CTR') {
							value.forEach(function(items) {
								let versionDiv = '';
								let regObj = JSON.parse(JSON.stringify(items));
								if (regObj !== null) {
									ctrFlg = false;
									if (items.finVersion = '2.0') {
										versionDiv = '<span class="text-white"  style="border-radius: 90px; text-align: center; background-color: #FFBF00"> &nbsp;&nbsp;2.0 &nbsp;&nbsp;<span>';
									} else {
										versionDiv = '<span class="text-white" style="border-radius: 90px; text-align: center; background-color: teal>&nbsp;&nbsp;1.0&nbsp;&nbsp;<span>';
									}
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
										+ "</td><td align='center'> "
										+ versionDiv
										+ "</td></tr>").appendTo("#tBodyCtrReg");
								}
							});
						} else if (key == 'NTR') {
							value.forEach(function(items) {
								let versionDiv = '';
								let regObj = JSON.parse(JSON.stringify(items));
								if (regObj !== null) {
									ntrFlg = false;
									if (items.finVersion = '2.0') {
										versionDiv = '<span class="text-white"  style="border-radius: 90px; text-align: center; background-color: #FFBF00">&nbsp;&nbsp;2.0&nbsp;&nbsp;<span>';
									} else {
										versionDiv = '<span class="text-white" style="border-radius: 90px; text-align: center; background-color: teal>&nbsp;&nbsp;1.0&nbsp;&nbsp;<span>';
									}
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
										+ "</td><td align='center'> "
										+ versionDiv
										+ "</td></tr>").appendTo("#tBodyNtrReg");
								}
							});
						} else if (key == 'CBWTR') {
							value.forEach(function(items) {
								let versionDiv = '';
								let regObj = JSON.parse(JSON.stringify(items));
								if (regObj !== null) {
									cbwtrFlg = false;
									if (items.finVersion = '2.0') {
										versionDiv = '<span class="text-white"  style="border-radius: 90px; text-align: center; background-color: #FFBF00">&nbsp;&nbsp;2.0&nbsp;&nbsp;<span>';
									} else {
										versionDiv = '<span class="text-white"  style="border-radius: 90px; text-align: center; background-color: teal>&nbsp;&nbsp;1.0&nbsp;&nbsp;<span>';
									}
									$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
										+ regObj.monthOfRecord
										+ "</td><td> "
										+ items.yearOfRecord
										+ "</td><td> "
										+ items.custId
										+ "</td><td> "
										+ items.totAmt
										+ "</td><td align='center'> "
										+ versionDiv
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
					$('#custTab').hide();
					$('#amtTab').hide();
					$('#ruleTab').hide();
					$('#alertCountTab').hide();
					$('#cntTab').hide();
					$('#ctrTab').show();
					$('#ntrTab').show();
					$('#cbwtrTab').show();
					$('#strTab').hide();
					$('#ucicCustTab').hide();
				} else if (searchFlg == 'strReport') {
					obj.strDataOldList.forEach(function(items) {
						let versionDiv = '';
						if (items.finVersion = '2.0') {
							versionDiv = '<span class="text-white"  style="border-radius: 90px; text-align: center; background-color: #FFBF00">&nbsp;&nbsp;2.0&nbsp;&nbsp;<span>';
						} else {
							versionDiv = '<span class="text-white" style="border-radius: 90px; text-align: center; background-color: teal>&nbsp;&nbsp;1.0&nbsp;&nbsp;<span>';
						}
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
							+ "</td><td align='center'> "
							+ versionDiv
							+ "</td></tr>").appendTo("#tBodyStr");
					});
					$('#custTab').hide();
					$('#amtTab').hide();
					$('#ruleTab').hide();
					$('#alertCountTab').hide();
					$('#cntTab').hide();
					$('#ctrTab').hide();
					$('#ntrTab').hide();
					$('#cbwtrTab').hide();
					$('#strTab').show();
					$('#ucicCustTab').hide();
				}
				$('#viewUcicModel').modal('show');
			},
			error: function(xhr, status, error) {
				toastr.error('Some Error Occured');
			}
		});
	});


$("#fetchFilterAlert").click(
	function() {
		var risk = $('#risk').val();
		var val = $(this).attr('val');
		var risk = $(this).attr('risk');
		var regFlg = $(this).attr('regFlg');
		var strFlg = $(this).attr('strFlg');
		if (flg == 'UCIC') {
			flg = 'U';
		} else if (flg == 'Account') {
			flg = 'A';
		}
		var alertStatus = $('#filterAlertStatus').val();
		var alertConstitution = '';
		var pageValJson = "{\"alertAggFlg\":" + "\"" + flg + "\",\"alertConstitution\":" + "\"" + alertConstitution
			+ "\",\"regStatus\":" + "\"" + regFlg + "\",\"strStatus\":" + "\"" + strFlg + "\",\"ucicRisk\":" + "\"" + risk
			+ "\",\"alertStatus\":" + "\"" + alertStatus + "\",\"alertAggVal\":" + "\"" + val + "\"}";
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJson")
			.val(ciphertext + ':~:' + passphrase);
		$("#mainForm").attr('action', './fetchAlertDtls');
		$("#mainForm").submit();
	});

