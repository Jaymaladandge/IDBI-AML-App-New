document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
		//document.getElementById('contents').style.visibility = "hidden";
	} else if (state == 'complete') {
		setTimeout(
			function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
				//document.getElementById('contents').style.visibility = "visible";
			}, 1000);
	}
}



/*$(document).ready(function() {
	var table = $('#taskNotification').DataTable();

	table.rows().every(function(rowIdx, tableLoop, rowLoop) {
		var cell = table.cell({ row: rowIdx, column: 0 }).node();
		$(cell).addClass('alert-danger1');
	});
});*/

$(document).ready(function() {
	/*var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}*/
	$("#summarylink").click(function() {

		$('#task-tab').css('display', '');
		$('#info-tab').css('display', 'none');
		$('#graph-tab').css('display', 'none');
	});

	$("#graphLink").click(function() {
		$('#task-tab').css('display', 'none');
		$('#info-tab').css('display', 'none');
		$('#graph-tab').css('display', '');

	});

});

/*var idString = 'viewByValue';

$(document).on("change", "#RuleClassification", function() {
	idString = $("#RuleClassification").val();
})

$(document).on("change", "#priority", function() {
	idString = $("#priority").val();
})
var mainId = '#' + idString;

alert(mainId);*/

$("#accountBased").hide();
$("#customerBasedCount").hide();
$("#ruleBased").show();
$("#customerBasedCount2").hide();



// view Information Notification   



$(document).on("change", '.alertClassification', function() {

	if ($("#viewByValue").val() == 'AW') {
		
		var ageVal=$("#aggingValue").val();
		var tempString = "ACCOUNT_WISE";
		var priority = $("#priority").val();
		var RuleClassification = $("#RuleClassification").val();


		var pageValJson = "{\"searchParam\":" + "\"" + tempString + "\",\"ruleRisk\":" + "\"" + priority + "\",\"ageValue\":" + "\"" + ageVal + "\",\"ruleClassification\":\"" + RuleClassification + "\"}";

		console.log(pageValJson);

		document.getElementById('load').style.visibility = "visible";
		$("#ruleBased").hide();
		$("#accountBased").show();
		$("#customerBasedCount").hide();
		$("#customerBasedCount2").hide();
		// ajax call
		$
			.ajax({
				url: 'getAccountWiseCount',
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
						}, 1000);
					document.getElementById('load').style.visibility = "hidden";

					var jsonResponse = JSON
						.stringify(response);
					var obj = JSON.parse(jsonResponse);

					$(".accountBody").empty();
					$('#accountBasedtbl').dataTable().fnClearTable();
					$('#accountBasedtbl').DataTable().destroy();
					$("#rmList2").val("");
					obj.amlAcList
						.forEach(function(item) {

							if (item.custAcNo)
								$(
									"<tr>"

									+ "<td><a class='text-blue viewModal' data-toggle='modal' href='#' id='" + item.custAcNo + "'>"
									+ item.custAcNo
									+ "</a></td>"

									+ "<td><span class='text-capitalize'>"
									+ item.acctName
									+ "</span></td>"


									+ "<td><span class='badge badge-warning text-bold text-capitalize'>"
									+ item.custAcType
									+ "</span></td>"

									+ "<td><span class='text-capitalize'>"
									+ item.acctOpenDate
									+ "</span></td>"

									+ "<td class='text-center text-bold alertSummary' id='custAcid-" + item.custAcNo + "' name='custAcid'><a href='#' class='badge badge-danger' title='Open Exceptions'>"
									+ item.count
									+ "</a></td>"


									+ "</tr>")
									.appendTo(
										".accountBody");

						});



					$("#accountBasedtbl").DataTable({
						"columnDefs": [{
							orderable: false,

						}],

						"order": [0, "desc"],
						"lengthMenu": [20, 40, 60, 80, 100],
						"responsive": false,
						"autoWidth": false,
						"searching": true,
						"fixedHeader": true,
						"buttons":
							[{
								extend: 'excel',
								title: 'Accounts Wise Report',
							}, {
								extend: 'csv',
								title: 'Accounts Wise Report',
							}, {
								extend: 'pdf',
								title: 'Accounts Wise Report',
							}, {
								extend: 'print',
								title: 'Accounts Wise Report',

							}],
						"language": {
							"emptyTable": "No Data Available"
						}
					}).buttons().container().appendTo(
						'#accountBasedtbl_wrapper .col-md-12:eq(0)');

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

// view Information Notification   
$(document).on("change", '.alertClassification', function() {

	if ($("#viewByValue").val() == 'CW') {
		var tempString = "CUSTOMER_WISE";
		var priority = $("#priority").val();
		var RuleClassification = $("#RuleClassification").val();
		var ageVal=$("#aggingValue").val();


		var pageValJson = "{\"searchParam\":" + "\"" + tempString + "\",\"ruleRisk\":" + "\"" + priority + "\",\"ageValue\":" + "\"" + ageVal + "\",\"ruleClassification\":\"" + RuleClassification + "\"}";



		document.getElementById('load').style.visibility = "visible";

		// ajax call
		$
			.ajax({
				url: 'getCustomerWiseCount',
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
						}, 1000);
					document.getElementById('load').style.visibility = "hidden";

					var jsonResponse = JSON
						.stringify(response);
					var obj = JSON.parse(jsonResponse);

					var varticalValue = $("#verticalValue").val();


					if (varticalValue.indexOf('LCG') != -1 || varticalValue.indexOf('MCG') != -1 || varticalValue.indexOf('NMG') != -1) {

						$(".customerBody2").empty();
						$('#custNotification2').dataTable().fnClearTable();
						$('#custNotification2').DataTable().destroy();

						obj.custList
							.forEach(function(item) {

								if (item.custId)
									$(
										"<tr>"

										+ "<td><a class='text-blue viewModal' data-toggle='modal' href='#' id='" + item.custId + "'>"
										+ item.custId
										+ "</a></td>"

										+ "<td><span class='text-capitalize'>"
										+ item.custName
										+ "</span></td>"

										+ "<td>"
										+ item.custOpenDate
										+ "</td>"

										+ "<td>"
										+ item.dealingVertical
										+ "</td>"

										+ "<td>"
										+ item.rmName
										+ "</td>"

										+ "<td>"
										+ item.agmName
										+ "</td>"

										+ "<td>"
										+ item.dgmName
										+ "</td>"

										+ "<td class='text-center text-bold text-blue alertSummary' id='custId-" + item.custId + "' name='custId'><a href='#' class='badge badge-danger' title='Open Exceptions'>"
										+ item.count
										+ "</a></td>"


										+ "</tr>")
										.appendTo(
											".customerBody2");

							});



						$("#custNotification2").DataTable({
							"columnDefs": [{
								orderable: false,

							}],

							"order": [0, "desc"],
							"lengthMenu": [20, 40, 60, 80, 100],
							"responsive": false,
							"autoWidth": false,
							"searching": true,
							"fixedHeader": true,
							"buttons":
								[{
									extend: 'excel',
									title: 'Customer Wise Report',
								}, {
									extend: 'csv',
									title: 'Customer Wise Report',
								}, {
									extend: 'pdf',
									title: 'Customer Wise Report',
								}, {
									extend: 'print',
									title: 'Customer Wise Report',

								}],
							"language": {
								"emptyTable": "No Data Available"
							}
						}).buttons().container().appendTo(
							'#custNotification_wrapper .col-md-12:eq(0)');

						$("#ruleBased").hide();
						$("#accountBased").hide();
						$("#customerBasedCount2").show();

					} else {

						$(".customerBody").empty();
						$('#custNotification').dataTable().fnClearTable();
						$('#custNotification').DataTable().destroy();

						obj.custList
							.forEach(function(item) {

								if (item.custId)
									$(
										"<tr>"

										+ "<td><a class='text-blue viewModal' data-toggle='modal' href='#' id='" + item.custId + "'>"
										+ item.custId
										+ "</a></td>"

										+ "<td><span class='text-capitalize'>"
										+ item.custName
										+ "</span></td>"

										+ "<td>"
										+ item.custOpenDate
										+ "</td>"

										+ "<td><span class='badge badge-warning text-bold text-capitalize'>"
										+ item.custTypeCode
										+ "</span></td>"

										+ "<td class='text-center text-bold text-blue alertSummary' id='custId-" + item.custId + "' name='custId'><a href='#' class='badge badge-danger' title='Open Exceptions'>"
										+ item.count
										+ "</a></td>"


										+ "</tr>")
										.appendTo(
											".customerBody");

							});



						$("#custNotification").DataTable({
							"columnDefs": [{
								orderable: false,

							}],

							"order": [0, "desc"],
							"lengthMenu": [20, 40, 60, 80, 100],
							"responsive": false,
							"autoWidth": false,
							"searching": true,
							"fixedHeader": true,
							"buttons":
								[{
									extend: 'excel',
									title: 'Customer Wise Report',
								}, {
									extend: 'csv',
									title: 'Customer Wise Report',
								}, {
									extend: 'pdf',
									title: 'Customer Wise Report',
								}, {
									extend: 'print',
									title: 'Customer Wise Report',

								}],
							"language": {
								"emptyTable": "No Data Available"
							}
						}).buttons().container().appendTo(
							'#custNotification_wrapper .col-md-12:eq(0)');

						$("#ruleBased").hide();
						$("#accountBased").hide();
						$("#customerBasedCount").show();

					}
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

/*$(document).on("ready", "#viewByValue", function() {

	if (this.value == 'EW') {
		$("#parameterList").css("display", "");
		$("#accountBased").hide();
		$("#customerBasedCount").hide();
	}
});*/

/*$('input[type=radio][name=viewByTab]').change(function() {
	if (this.value == 'ruleId') {
		$("#ruleBased").show();
		$("#accountBased").hide();
		$("#customerBasedCount").hide();

	}
});*/


// alertSummary
$(document).on('click', ".alertSummary", function() {
	var searchParam = $(this).attr("name");
	var searchValue = this.id.split("-")[1];
	var role = '';
	var searchUserId = "default";
	role = this.id.split("-")[2];
	if (role === 'RM') {
		searchUserId = this.id.split("-")[3];
	}


	/*if ($("#rmList3").val() != '' && $("#rmList3").val() != undefined ) {
		searchUserId = $("#rmList3").val();
	}*/

	var finaJsonString = "{\n" +
		"    \"searchParam\": \"" + searchParam + "\",\n" +
		"    \"searchUserId\": \"" + searchUserId + "\",\n" +
		"    \"searchValue\": \"" + searchValue + "\"\n" +
		"}";
	console.log(finaJsonString);

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase), finaJsonString);
	$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
	$("#alertFormSummary").submit();

})

//searchcriteria
$(document).ready(function() {
	$(".searchValue").hide();
});

$(document).on('click', ".tasknotification", function() {

	var notifyInfo = $(this).attr('id');

	var notifyArray = notifyInfo.split('~');
	var pageValJson;
	var url;
	/*var homeString = "{\n" + "    \"moduleId\": \""
		+ notifyArray[0] + "\",\n"
		+ "    \"moduleName\": \"" + notifyArray[1]
		+ "\",\n" + "    \"moduleAction\":\""
		+ notifyArray[2] + "\"\n" + "}";*/

	var homeString = "{\n" +
		"    \"moduleId\": \"" + notifyArray[0] + "\",\n" +
		"    \"moduleName\": \"" + notifyArray[1] + "\",\n" +
		"    \"moduleAction\": \"" + notifyArray[2] + "\",\n" +
		"    \"alertStatus\": \"" + notifyArray[4] + "\",\n" +
		"    \"ruleId\": \"" + notifyArray[3] + "\"\n" +
		"}";

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		homeString);
	$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
	$("#alertSummary").submit();

});

$(document).ready(function() {
	$("#taskNotification").DataTable({
		/*"columnDefs": [{
			orderable: false,
			targets: [7]
		}],*/

		"order": [0, "desc"],
		"lengthMenu": [20, 40, 60, 80, 100],
		"responsive": false,
		"autoWidth": false,
		"searching": true,
		"fixedHeader": false,
		"buttons": ["csv", "excel", "pdf", "print"],
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#taskNotification_wrapper .col-md-12:eq(0)');
});

// Dropdown change
$(document).on("change", ".searchParam", function() {
	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");

	if (searchParam.includes('makerTimestamp~')) {
		$("#hideDropDown").hide();
		$("#searchcriteria").show();
	}
	else {
		$("#hideDropDown").show();
		$("#searchcriteria").hide();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam + "\"}";
		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				url: 'fetchParamValueList',
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

					$("#searchcriteria").hide();
					$("#selectSearchcriteria").empty();


					if (searchParam.includes('alertCat')) {
						obj.paramValueList.forEach(function(items) {

							$("<option />", {
								val: '',
								text: ''
							}).appendTo($("#selectSearchcriteria"));

							$("<option />", {
								val: items.split("~")[0],
								text: items.split("~")[1]
							}).appendTo($("#selectSearchcriteria"));
						});
					} else {
						obj.paramValueList.forEach(function(items) {

							$("<option />", {
								val: '',
								text: ''
							}).appendTo($("#selectSearchcriteria"));

							$("<option />", {
								val: items,
								text: items
							}).appendTo($("#selectSearchcriteria"));
						});
					}




					$("#selectSearchcriteria").show();
					$('.select2').select2();


				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

	}

})

//search method
function searchData() {

	var searchParam = $('#dimension').find(":selected").val().replace(/(\r\n|\n|\r)/gm, "");
	if (searchParam.includes('makerTimestamp~')) {
		var searchValue = $('#searchcriteria').val().replace(/(\r\n|\n|\r)/gm, "");
	}
	else {
		var searchValue = $('#selectSearchcriteria').find(":selected").val();
	}

	if (searchParam == '') {
		toastr.error('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.error('Please Add Some Value For Search');
	} else {

		var pageValJson = "{\"searchParam\":" + "\"" + searchParam + "\",\"searchValue\":\"" + searchValue + "\"}";
		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				url: 'searchDataList',
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

					$(".taskNotificationBody").empty();
					$('#taskNotification').dataTable().fnClearTable();
					$('#taskNotification').DataTable().destroy();

					obj.alertList
						.forEach(function(item) {

							if (item.alertId)
								$(
									"<tr>"

									+ "<td><a class='text-blue viewModal' data-toggle='modal' href='#' id='" + item.custId + "'>"
									+ item.custId
									+ "</a></td>"

									+ "<td>"
									+ item.ruleId
									+ "</td>"


									+ "<td>"
									+ item.custVertical
									+ "</td>"

									+ "<td>"
									+ item.generatedTime
									+ "</td>"

									+ "<td>"
									+ item.custName
									+ "</td>"


									+ "<td>"
									+ item.branchId
									+ "</td>"

									+ "<td>"
									+ item.ruleClassification
									+ "</td>"

									+ "<td class='project-actions text-center'><span class='badge text-white' >"
									+ "<a id='"
									+ item.alertId + "~" + "TRANSACTION MONITORING" + "~" + "AI" + "~" + item.ruleId + "~" + item.alertStatus
									+ "' class='btn-sm tasknotification bg-success'><em class='fas fa-arrow-circle-right text-white'></em></a>"
									+ "</span></td>"

									+ "</tr>")
									.appendTo(
										".taskNotificationBody");

						});



					$("#taskNotification").DataTable({
						"columnDefs": [{
							orderable: false,

						}],

						"order": [0, "desc"],
						"lengthMenu": [20, 40, 60, 80, 100],
						"responsive": false,
						"autoWidth": false,
						"searching": true,
						"fixedHeader": true,
						"buttons":
							[{
								extend: 'excel',
								title: 'Rule Wise Report',
							}, {
								extend: 'csv',
								title: 'Rule Wise Report',
							}, {
								extend: 'pdf',
								title: 'Rule Wise Report',
							}, {
								extend: 'print',
								title: 'Rule Wise Report',

							}],
						"language": {
							"emptyTable": "No Data Available"
						}
					}).buttons().container().appendTo(
						'#taskNotification_wrapper .col-md-12:eq(0)');



				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});

		//}
	}
}


$(document).on("change", '.alertClassification', function() {
	if ($("#viewByValue").val() == 'EW') {

		var tempString = "EXCEPTION_WISE";

		var priority = $("#priority").val();
		var RuleClassification = $("#RuleClassification").val();
		var reloadFlg = false;
		var ageVal=$("#aggingValue").val();


		var pageValJson = "{\"searchParam\":" + "\"" + tempString + "\",\"ruleRisk\":" + "\"" + priority + "\",\"ageValue\":" + "\"" + ageVal + "\",\"ruleClassification\":\"" + RuleClassification + "\"}";


		document.getElementById('load').style.visibility = "visible";
		$("#ruleBased").show();
		$("#accountBased").hide();
		$("#customerBasedCount").hide();
		$("#customerBasedCount2").hide();
		// ajax call
		$
			.ajax({
				url: 'fetchselectedRMAlertCount',
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
						}, 1000);
					document.getElementById('load').style.visibility = "hidden";

					var jsonResponse = JSON
						.stringify(response);
					var obj = JSON.parse(jsonResponse);

					$(".accountBody").empty();
					$('#taskNotification').dataTable().fnClearTable();
					$(taskNotification).DataTable().destroy();
					//$("#rmList2").val("");
					$(".ruleBody").empty();
					$('#taskNotification').dataTable()
						.fnClearTable();
					$('#taskNotification').DataTable()
						.destroy();

					obj.ruleList
						.forEach(function(item) {
							const priority = item.rulePriority
								.split("~");

							$(
								"<tr>"

								+ "<td><a class='text-blue' data-toggle='modal' href='#' id='" + item.ruleId + "'>"
								+ item.ruleId
								+ "</a></td>"

								+ "<td><span class='text-capitalize'>"
								+ item.ruleDesc
								+ "</span></td>"

								+ "<td><span class='badge text-bold text-capitalize text-white' style='background-color:" + priority[1] + "'>"
								+ priority[0]
								+ "</span></td>"

								+ "<td><span class='text-capitalize'>"
								+ item.ruleFrequency
								+ "</span></td>"

								+ "<td><span class='text-capitalize'>"
								+ item.ruleTat
								+ " Day"
								+ "</span></td>"

								+ "<td>"
								+ item.ruleClassification
								+ "</td>"

								+ "<td class='text-center text-bold text-blue alertSummary' id='ruleId-"
								+ item.ruleId
								+ "-RM-"
								+ $(
									"#rmList")
									.val()
								+ "' name='ruleId'><a href='#' class='badge badge-danger' title='Open Exceptions'>"
								+ item.count
								+ "</a></td>"

								+ "</tr>")
								.appendTo(
									".ruleBody");

						});

					$("#taskNotification")
						.DataTable(
							{
								"columnDefs": [{
									orderable: false,

								}],

								"order": [0,
									"desc"],
								"lengthMenu": [
									20, 40,
									60, 80,
									100],
								"responsive": false,
								"autoWidth": false,
								"searching": true,
								"fixedHeader": true,
								"buttons":
									[{
										extend: 'excel',
										title: 'Rule Wise Report',
									}, {
										extend: 'csv',
										title: 'Rule Wise Report',
									}, {
										extend: 'pdf',
										title: 'Rule Wise Report',
									}, {
										extend: 'print',
										title: 'Rule Wise Report',

									}],
								"language": {
									"emptyTable": "No Data Available"
								}
							})
						.buttons()
						.container()
						.appendTo(
							'#taskNotification_wrapper .col-md-12:eq(0)');

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

$(document).on("click", "a.viewTranDetails", function() {

	$('#alertGraphicalView').modal('show');

});

var backgroundClr = ['#ffd700', '#0a0', '#1b458b', '#08f', '#f80', '#a04',
	'#a52a2a'];

var list = [];
//var list2 = [];
var ticksStyle = {
	fontColor: '#495057',
	fontStyle: 'bold'
}
$(document).ready(function() {

	list = $('#classificationGraph').val();
	console.log("list " + list);
	list = list.replace('[', '');
	list = list.replace(']', '');
	var itemsArr = list.split(",");
	checkLableArr = [];
	dataCountArr = [];
	var bgColr = [];
	/*itemsArr.forEach(function(items) {
		checkLableArr.push(itemsArr[0]);
			dataCountArr.push(itemsArr[1]);
		}*/

	for (var itr in itemsArr) {

		var iteArr = itemsArr[itr].split("~");
		checkLableArr.push(iteArr[0]);
		dataCountArr.push(iteArr[1]);
		bgColr.push(backgroundClr[itr]);
	}

	var donutData = {

		labels: checkLableArr,

		datasets: [{

			data: dataCountArr,
			backgroundColor: bgColr

		}]
	}
	var pieChartCanvas = $('#acctDebitChart').get(0).getContext('2d')
	var pieData = donutData;
	var pieOptions = {
		maintainAspectRatio: true,
		responsive: true,
		legend: {
			position: "right",
			text: "This is example",
			fontSize: 15,
			labels: {
				usePointStyle: true,
			}
		},
		scales: {

			xAxes: [{
				display: false,
				gridLines: {
					display: false
				},
				scaleLabel: {
					display: true,
					labelString: 'Vertical wise total Count'
				},
				ticks: ticksStyle
			}]
		}

	}
	//Create pie or douhnut chart
	// You can switch between pie and douhnut using the method below.
	new Chart(pieChartCanvas, {
		type: 'pie',
		data: pieData,
		options: pieOptions
	})
	var scrollPos = $("#varticalPiChart").offset.top;
	$(window).scrollTop(scrollPos);
});

$(document).ready(function() {

	list = $('#priorityGraph').val();
	console.log("list " + list);
	list = list.replace('[', '');
	list = list.replace(']', '');
	var itemsArr = list.split(",");
	checkLableArr = [];
	dataCountArr = [];
	var bgColr = [];
	/*itemsArr.forEach(function(items) {
		checkLableArr.push(itemsArr[0]);
			dataCountArr.push(itemsArr[1]);
		}*/

	for (var itr in itemsArr) {

		var iteArr = itemsArr[itr].split("~");
		checkLableArr.push(iteArr[0]);
		dataCountArr.push(iteArr[1]);
		bgColr.push(backgroundClr[itr]);
	}

	var donutData = {

		labels: checkLableArr,

		datasets: [{

			data: dataCountArr,
			backgroundColor: bgColr

		}]
	}
	var pieChartCanvas = $('#acctCreditChart').get(0).getContext('2d')
	var pieData = donutData;
	var pieOptions = {
		maintainAspectRatio: true,
		responsive: true,
		legend: {
			position: "right",
			text: "This is example",
			fontSize: 15,
			labels: {
				usePointStyle: true,
			}
		},
		scales: {

			xAxes: [{
				display: false,
				gridLines: {
					display: false
				},
				scaleLabel: {
					display: true,
					labelString: 'Vertical wise total Count'
				},
				ticks: ticksStyle
			}]
		}

	}
	//Create pie or douhnut chart
	// You can switch between pie and douhnut using the method below.
	new Chart(pieChartCanvas, {
		type: 'pie',
		data: pieData,
		options: pieOptions
	})
	/*var scrollPos = $("#varticalPiChart").offset.top;
	$(window).scrollTop(scrollPos);*/
});


/*$(document).on("ready", "#graphDropdown", function() {
	var dropdownValue = $("#graphDropdown").val();
	if (dropdownValue == 'risk') {

		$("#riskWiseGraph").hide();
		$("#classificationWiseGraph").show();

	}else if (dropdownValue == 'classification') {

		$("#riskWiseGraph").show();
		$("#classificationWiseGraph").hide();

	}

});*/


$("#riskWiseGraph").show();
$("#classificationWiseGraph").hide();

$(document).on("change", "#graphDropdown", function() {
	var dropdownValue = $("#graphDropdown").val();
	if (dropdownValue == 'risk') {

		$("#riskWiseGraph").hide();
		$("#classificationWiseGraph").show();

	}else if (dropdownValue == 'classification') {

		$("#riskWiseGraph").show();
		$("#classificationWiseGraph").hide();

	}

});
