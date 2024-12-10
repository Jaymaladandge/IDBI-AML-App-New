function searchTicketData() {
	var searchParam = $('#selectParam').find(":selected").val().replace(
		/(\r\n|\n|\r)/gm, "");
	var searchValue = $('#searchcriteria').val().toUpperCase().replace(
		/(\r\n|\n|\r)/gm, "").toUpperCase();
	if (searchParam == '') {
		toastr.info('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.info('Please Add Some Value For Search');
	}
	var pageValJson = "{\"searchParam\":" + "\"" + searchParam + "\",\"searchValue\":\"" + searchValue + "\"}";
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson); $("#encryptedJson").val(ciphertext + ':~:' + passphrase);
	$("#searchForm").submit();
}

//loader
document.onreadystatechange = function() {
	var state = document.readyState;
	if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
}
$('a.ucicDetails')
	.click(
		function() {
			var id = $(this).attr('id');
			$(id).modal('show');
		});

$('#searchcriteria').keypress(function(event) {
	if (event.keyCode === 10 || event.keyCode === 13) {
		event.preventDefault();
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
							+ "</td><td class='textCapitalize'>"
							+ items.custFullName
							+ "</td><td class='textCapitalize'>"
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
							+ "</td><td class='textCapitalize'>"
							+ items.alertRuleDesc
							+ "</td><td   class='textCapitalize'>"
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
							+ "</td><td> "
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
										/*	+ items.accountNo
											+ "</td><td> "
											+ items.acctName
											+ "</td><td> "*/
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
										//										+ items.accountNo
										//										+ "</td><td> "
										//										+ items.acctName
										//										+ "</td><td> "
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
										//+ items.accountNo
										//+ "</td><td> "
										//+ items.acctName
										//+ "</td><td> "
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
$(".fetchCommentDetails").click(
	function() {
		var alertId = $(this).attr('alertid');
		var version = $(this).attr('version');
		var pageValJson = "{\"alertId\": \"" + alertId + "\"," + "\"version\": \"" + version + "\"}";
		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchTicketComment',
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
				$("#commentTab > #commentBody").empty();
				obj.commentList.forEach(function(items) {
					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
						+ items.alertId
						+ "</td><td class='textCapitalize'>"
						+ items.userId
						+ "</td><td class='textCapitalize'>"
						+ items.roleId
						+ "</td><td> "
						+ items.userComment
						+ "</td><td> "
						+ moment(items.commentTime).format('DD-MM-YYYY')
						+ "</td><td> "
						+ items.action
						+ "</td></tr>").appendTo("#commentBody");
				});
				$('#viewCommentModel').modal('show');
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


$("#reOpenTicketForm")
	.click(
		function() {
			var stmtId = $("#stmtId").html();
			var reason = $('#reason').val();
			reason = reason.replace(/[\t\n]+/g, ' ');
			var action = "XQ";
			if (reason == '') {
				$('span[id^="reason-error"]').remove();
				$('#reason').addClass('is-invalid');
				$('#reason')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
			} else if (reason.length < 10) {
				$('span[id^="reason-error"]').remove();
				$('#reason').addClass('is-invalid');
				$('#reason')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
			} else {
				$('span[id^="reason-error"]').remove();
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(
					128 / 8).toString(CryptoJS.enc.Hex);
				var aesUtil = new AesUtil(keySize,
					iterationCount);
				var pageValJson = "{\"alertId\":" + "\"" + stmtId + "\",\"userComment\":\"" + reason + "\"}";
				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), pageValJson);
				$("#encryptedJsonClose").val(
					ciphertext + ':~:' + passphrase);
				$("#reOpenTicketForm").submit();
			}
		});