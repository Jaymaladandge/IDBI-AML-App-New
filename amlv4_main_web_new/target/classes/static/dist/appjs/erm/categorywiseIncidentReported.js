
var internalFraudCountAndAmountE = "";
	var externalFraudCountAndAmountE = "";
	var empAndWorkCountAndAmountE = "";
	var clientProductBusinessPractiseCountAndAmountE = "";
	var damageToPhyAssetsCountAndAmountE = "";
	var businessDisSysFailureE = "";
	var exeDelAndPmE = "";
	var intermediaryCountAndAmountE = "";
	var policyCountAndAmountE = "";
	var categoryTotalE="";
	var formattedSDateE=""; 
	var formattedEDateE="";
	var deptIdE = "";
	var userOfcE="";


var userDeptId = $("#userDeptId").val();
var officeCode = $("#officeCode").val();

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}


$(document).ready(function() {
	var deptNameTemp = $('#userDept').val();
	if (deptNameTemp != 'ERM') {
		var userOffice = $("#userOffice").val();
		if (userOffice === 'ZO') {
			$('#officeType option[value="CO"]').attr("disabled", true);
			$('#officeType option[value="DO"]').attr("disabled", true);
			$('#officeType option[value="BO"]').attr("disabled", true);
		} else if (userOffice === 'DO') {
			$('#officeType option[value="CO"]').attr("disabled", true);
			$('#officeType option[value="ZO"]').attr("disabled", true);
			$('#officeType option[value="BO"]').attr("disabled", true);
		} else if (userOffice === 'BO') {
			$('#officeType option[value="CO"]').attr("disabled", true);
			$('#officeType option[value="ZO"]').attr("disabled", true);
			$('#officeType option[value="DO"]').attr("disabled", true);
		}
	}
});

$(document).ready(function() {
	$('#startDate').datetimepicker({
		format: 'YYYY-MM-DD',
		maxDate: new Date()
	});
	//Date range picker
	$('#endDate').datetimepicker({
		format: 'YYYY-MM-DD',
		maxDate: new Date()
	});
});

$("#fetchDataBtn").click(function() {

	var officeType = $("#officeType").val();
	var date1;
	var date2;

	if ($("#startDate").val() != '') {
		date1 = $("#startDate").val();
	} else if ($("#startDate").val() == '') {
		toastr.error("start date cannot be blank");
	}
	if ($("#endDate").val() != '') {
		date2 = $("#endDate").val();
	} else if ($("#endDate").val() == '') {
		toastr.error("end date cannot be blank");
	}

	var startDate = new Date(date1);
	var endDate = new Date(date2);

	var formattedSDate = [startDate.getDate(), startDate.getMonth() + 1, startDate.getFullYear()].join('-');
	var formattedEDate = [endDate.getDate(), endDate.getMonth() + 1, endDate.getFullYear()].join('-');
	formattedSDateE = formattedSDate;
	formattedEDateE = formattedEDate;

	var officeType = $("#officeType").val();
	var validFlg = true;


	if (startDate > endDate) {
		toastr
			.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (startDate === '' || startDate == null) {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (endDate === '' || endDate == null) {
		toastr.error("end date cannot be blank");
		validFlg = false;
	} else if (officeType === '' || officeType == null) {
		toastr.error("Office Type cannot be null");
		validFlg = false;
	}
	if ($("#incidentDept").val() === "") {
		toastr.error("Please Select Department");
		validFlg = false;
	}

	if (validFlg) {

		var pageValJson = "";

		var selectedOfficeType = $('#officeType :selected').val();
		var deptId = $('#incidentDept :selected').val();
		var officeId = $('#officeId').val();
		deptIdE = deptId;
		userOfcE = selectedOfficeType;

		pageValJson = "{\n"
			+ "    \"searchParam\": \"" + selectedOfficeType + "\",\n"
			+ "    \"startDate\": \"" + formattedSDate + "\",\n"
			+ "    \"department\": \"" + deptId + "\",\n"
			+ "    \"officeCode\": \"" + officeCode + "\",\n"
			+ "    \"officeId\": \"" + officeId + "\",\n"
			+ "    \"userDept\": \"" + userDeptId + "\",\n"
			+ "    \"endDate\":\"" + formattedEDate + "\"\n" + "}";



		document.getElementById('load').style.visibility = "visible";

		$.ajax({
			url: "fetchIncidentCategoryReport",
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
						document
							.getElementById('interactive');
						document
							.getElementById('load').style.visibility = "hidden";
					}, 1000);

				var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);
				console.log('obj' + obj);
				$(".categorywiseReportTable > #tbodyR").empty();
				$('#categorywiseReportTable').dataTable().fnClearTable();
				$('#categorywiseReportTable').DataTable().destroy();



				$("<tr><td class='sorting_1'> Internal Fraud</td> <td><span name='internalFraudCountAndAmount' class='textCapitalize'>" + obj.internalFraudCountAndAmount.split(',')[1].toString() + " </span> </td> <td><span name='internalFraudCountAndAmount' class='textCapitalize text-bold'>" + getamountInword(obj.internalFraudCountAndAmount.split(',')[0].toString()) + "(" + rupeeInWord(obj.internalFraudCountAndAmount.split(',')[0].toString()) + ")</span>"
					+ "</td></tr><tr><td class='sorting_1'> External Fraud</td> <td><span name='externalFraudCountAndAmount' class='textCapitalize'>" + obj.externalFraudCountAndAmount.split(',')[1].toString() + "</span> </td> <td><span name='externalFraudCountAndAmount' class='textCapitalize text-bold'>" + getamountInword(obj.externalFraudCountAndAmount.split(',')[0].toString()) + "(" + rupeeInWord(obj.externalFraudCountAndAmount.split(',')[0].toString()) + ")</span>"
					+ "</td></tr><tr><td class='sorting_1'> Employment Practices and Workplace Safety</td> <td><span name='empAndWorkCountAndAmount' class='textCapitalize'>" + obj.empAndWorkCountAndAmount.split(',')[1].toString() + "</span> </td> <td><span name='empAndWorkCountAndAmount' class='textCapitalize text-bold'>" + getamountInword(obj.empAndWorkCountAndAmount.split(',')[0].toString()) + "(" + rupeeInWord(obj.empAndWorkCountAndAmount.split(',')[0].toString()) + ")</span>"
					+ "</td></tr><tr><td class='sorting_1'> Clients, Products, and Business Practise</td> <td><span name='clientProductBusinessPractiseCountAndAmount' class='textCapitalize'>" + obj.clientProductBusinessPractiseCountAndAmount.split(',')[1].toString() + "</span> </td><td> <span name='clientProductBusinessPractiseCountAndAmount' class='textCapitalize text-bold'>" + getamountInword(obj.clientProductBusinessPractiseCountAndAmount.split(',')[0].toString()) + "(" + rupeeInWord(obj.clientProductBusinessPractiseCountAndAmount.split(',')[0].toString()) + ")</span>"
					+ "</td></tr><tr><td class='sorting_1'> Damage to Physical Assets</td> <td><span name='damageToPhyAssetsCountAndAmount' class='textCapitalize'>" + obj.damageToPhyAssetsCountAndAmount.split(',')[1].toString() + "</span> </td><td> <span name='damageToPhyAssetsCountAndAmount' class='textCapitalize text-bold'>" + getamountInword(obj.damageToPhyAssetsCountAndAmount.split(',')[0].toString()) + "(" + rupeeInWord(obj.damageToPhyAssetsCountAndAmount.split(',')[0].toString()) + ")</span>"
					+ "</td></tr><tr><td class='sorting_1'> Business Disruption and Systems Failures</td> <td><span name='businessDisSysFailure'  class='textCapitalize'>" + obj.businessDisSysFailure.split(',')[1].toString() + "</span> </td> <td><span name='businessDisSysFailure'  class='textCapitalize text-bold'>" + getamountInword(obj.businessDisSysFailure.split(',')[0].toString()) + "(" + rupeeInWord(obj.businessDisSysFailure.split(',')[0].toString()) + ")</span>"
					+ "</td></tr><tr><td class='sorting_1'> Execution, Delivery, and Process Management</td> <td><span name='exeDelAndPm' class='textCapitalize'>" + obj.exeDelAndPm.split(',')[1].toString() + " </span> </td><td> <span name='exeDelAndPm' class='textCapitalize text-bold'>" + getamountInword(obj.exeDelAndPm.split(',')[0].toString()) + "(" + rupeeInWord(obj.exeDelAndPm.split(',')[0].toString()) + ")</span>"
					+ "</td></tr><tr><td class='sorting_1'> Intermediary Fraud</td> <td><span name='intermediaryCountAndAmount' class='textCapitalize'>" + obj.intermediaryCountAndAmount.split(',')[1].toString() + " </span> </td> <td><span name='intermediaryCountAndAmount' class='textCapitalize text-bold'>" + getamountInword(obj.intermediaryCountAndAmount.split(',')[0].toString()) + "(" + rupeeInWord(obj.intermediaryCountAndAmount.split(',')[0].toString()) + ")</span>"
					+ "</td></tr><tr><td class='sorting_1'> Policyholder Fraud and/or Claims Fraud</td> <td><span name='policyCountAndAmount' class='textCapitalize'>" + obj.policyCountAndAmount.split(',')[1].toString() + " </span> </td><td> <span name='policyCountAndAmount'class='textCapitalize text-bold'>" + getamountInword(obj.policyCountAndAmount.split(',')[0].toString()) + "(" + rupeeInWord(obj.policyCountAndAmount.split(',')[0].toString()) + ")</span>"
					+ "</td>"
					+ "</tr>").appendTo(".categorywiseReportTable");
					
					
				internalFraudCountAndAmountE =  "Internal Fraud" +"~"+ parseFloat(obj.internalFraudCountAndAmount.split(',')[1])+"~"+ getamountInword(obj.internalFraudCountAndAmount.split(',')[0]);
				externalFraudCountAndAmountE = "External Fraud" +"~"+ parseFloat(obj.externalFraudCountAndAmount.split(',')[1])+"~"+ getamountInword(obj.externalFraudCountAndAmount.split(',')[0]);
				empAndWorkCountAndAmountE = "Employment Practices and Workplace Safety" +"~"+ parseFloat(obj.empAndWorkCountAndAmount.split(',')[1])+"~"+ getamountInword(obj.empAndWorkCountAndAmount.split(',')[0]);
				clientProductBusinessPractiseCountAndAmountE = "Clients, Products, and Business Practise" +"~"+ parseFloat(obj.clientProductBusinessPractiseCountAndAmount.split(',')[1])+"~"+ getamountInword(obj.clientProductBusinessPractiseCountAndAmount.split(',')[0]);
				damageToPhyAssetsCountAndAmountE ="Damage to Physical Assets" +"~"+ parseFloat(obj.damageToPhyAssetsCountAndAmount.split(',')[1])+"~"+ getamountInword(obj.damageToPhyAssetsCountAndAmount.split(',')[0]);	
				businessDisSysFailureE = "Business Disruption and Systems Failures" +"~"+ parseFloat(obj.businessDisSysFailure.split(',')[1])+"~"+ getamountInword(obj.businessDisSysFailure.split(',')[0]);	
				exeDelAndPmE = "Execution, Delivery, and Process Management" +"~"+ parseFloat(obj.exeDelAndPm.split(',')[1])+"~"+ getamountInword(obj.exeDelAndPm.split(',')[0]);
				intermediaryCountAndAmountE = "Intermediary Fraud" +"~"+ parseFloat(obj.intermediaryCountAndAmount.split(',')[1])+"~"+ getamountInword(obj.intermediaryCountAndAmount.split(',')[0]);
				policyCountAndAmountE = "Policyholder Fraud and/or Claims Fraud" +"~"+ parseFloat(obj.policyCountAndAmount.split(',')[1])+"~"+ getamountInword(obj.policyCountAndAmount.split(',')[0]);
				
					
				var externalFraudCountAndAmount = isNaN(parseFloat(obj.externalFraudCountAndAmount.split(',')[0].trim())) == true ? 0 : parseFloat(obj.externalFraudCountAndAmount.split(',')[0].trim());
				var internalFraudCountAndAmount = isNaN(parseFloat(obj.internalFraudCountAndAmount.split(',')[0].trim())) == true ? 0 : parseFloat(obj.internalFraudCountAndAmount.split(',')[0].trim());
				var empAndWorkCountAndAmount = isNaN(parseFloat(obj.empAndWorkCountAndAmount.split(',')[0].trim())) == true ? 0 : parseFloat(obj.empAndWorkCountAndAmount.split(',')[0].trim());
				var clientProductBusinessPractiseCountAndAmount = isNaN(parseFloat(obj.clientProductBusinessPractiseCountAndAmount.split(',')[0].trim())) == true ? 0 : parseFloat(obj.clientProductBusinessPractiseCountAndAmount.split(',')[0].trim());
				var damageToPhyAssetsCountAndAmount = isNaN(parseFloat(obj.damageToPhyAssetsCountAndAmount.split(',')[0].trim())) == true ? 0 : parseFloat(obj.damageToPhyAssetsCountAndAmount.split(',')[0].trim());
				var businessDisSysFailure = isNaN(parseFloat(obj.businessDisSysFailure.split(',')[0].trim())) == true ? 0 : parseFloat(obj.businessDisSysFailure.split(',')[0].trim());
				var exeDelAndPm = isNaN(parseFloat(obj.exeDelAndPm.split(',')[0].trim())) == true ? 0 : parseFloat(obj.exeDelAndPm.split(',')[0].trim());
				var intermediaryCountAndAmount = isNaN(parseFloat(obj.intermediaryCountAndAmount.split(',')[0].trim())) == true ? 0 : parseFloat(obj.intermediaryCountAndAmount.split(',')[0].trim());
				var policyCountAndAmount = isNaN(parseFloat(obj.policyCountAndAmount.split(',')[0].trim())) == true ? 0 : parseFloat(obj.policyCountAndAmount.split(',')[0].trim());


				var noOfIncidentsCount = parseInt(obj.internalFraudCountAndAmount.split(',')[1].trim()) + parseInt(obj.externalFraudCountAndAmount.split(',')[1].trim()) + parseInt(obj.empAndWorkCountAndAmount.split(',')[1].trim()) + parseInt(obj.clientProductBusinessPractiseCountAndAmount.split(',')[1].trim()) + parseInt(obj.damageToPhyAssetsCountAndAmount.split(',')[1].trim()) + parseInt(obj.businessDisSysFailure.split(',')[1].trim()) + parseInt(obj.exeDelAndPm.split(',')[1].trim()) + parseInt(obj.intermediaryCountAndAmount.split(',')[1].trim()) + parseInt(obj.policyCountAndAmount.split(',')[1].trim());
				var incidentAmountTotal = internalFraudCountAndAmount +
					externalFraudCountAndAmount +empAndWorkCountAndAmount +clientProductBusinessPractiseCountAndAmount+damageToPhyAssetsCountAndAmount+businessDisSysFailure+
										exeDelAndPm+intermediaryCountAndAmount +policyCountAndAmount;
			
			categoryTotalE = noOfIncidentsCount +"~"+ getamountInword(incidentAmountTotal.toString());							
			
				$('#total').text(noOfIncidentsCount);
				$('#totalAmount').text(getamountInword(incidentAmountTotal.toString()) + '(' + rupeeInWord(incidentAmountTotal.toString()) + ')');

				

				$("#categorywiseReportTable").DataTable({
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
					'#categorywiseReportTable_wrapper .col-md-6:eq(0)');

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

function getamountInword(x) {
	var number = x.split('');
	var x = '';
	for (i = 0; i < number.length; i++) {
		if (number[i] != ',') {
			x = x + number[i];
		}
	}
	var afterPoint = '';
	if (x.indexOf('.') > 0)
		afterPoint = x.substring(x.indexOf('.'), x.length);
	x = Math.floor(x);
	x = x.toString();
	var lastThree = x.substring(x.length - 3);
	var otherNumbers = x.substring(0, x.length - 3);
	if (otherNumbers != '')
		lastThree = ',' + lastThree;
	var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
	if (res == 'NaN') {
		res = 0;
	}
	return res;
}

function rupeeInWord(num) {
	var flg = false;
	if (num == 'NaN' || num == null) {
		num = '0';
	}
	var x = num;
	var newX = num;
	if (x.indexOf('.') > 0) {

		flg = true;
	}
	var number = x.split('.')[0].split('');
	var x = '';
	for (i = 0; i < number.length; i++) {
		if (number[i] != ',') {
			x = x + number[i];
		}
	}
	var str1 = inWord(x);
	if (str1 == '' || str1 === undefined) {
		str1 = 'Zero';
	}
	if (flg) {
		var y = num.split('.')[1];
		if (y != '') {
			var str = str1 + ' Rupees and ' + inWord(y) + ' Paisa Only';
		} else if (y == '' || y == '0') {
			var str = str1 + ' Rupees and ' + 'Zero Paisa Only';
		}
	} else {
		var str = str1 + ' Rupees Only';
	}
	return str;
}



function inWord(num) {
	//alert('NUM'+num);
	var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	if ((num = num.toString()).length > 15) return 'overflow';
	n = ('000000000000000' + num).substr(-15).match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
	//alert(n);
	if (!n) return;
	var str = '';
	str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Lakh ' : '';
	str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Thousand ' : '';
	str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Hundred ' : '';
	str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Crore ' : '';
	str += (n[5] != 0) ? (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Lakh ' : '';
	str += (n[6] != 0) ? (a[Number(n[6])] || b[n[6][0]] + ' ' + a[n[6][1]]) + 'Thousand ' : '';
	str += (n[7] != 0) ? (a[Number(n[7])] || b[n[7][0]] + ' ' + a[n[7][1]]) + 'Hundred ' : '';
	str += (n[8] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[8])] || b[n[8][0]] + ' ' + a[n[8][1]]) + '' : '';
	return str;
}



$('.exportExcel').click(function() {

pageValJson = "{\n"
			+ "    \"internalFraudCountAndAmount\": \"" + internalFraudCountAndAmountE + "\",\n"
			+ "    \"externalFraudCountAndAmount\": \"" + externalFraudCountAndAmountE + "\",\n"
			+ "    \"empAndWorkCountAndAmount\": \"" + empAndWorkCountAndAmountE + "\",\n"
			+ "    \"clientProductBusinessPractiseCountAndAmount\": \"" + clientProductBusinessPractiseCountAndAmountE + "\",\n"
			+ "    \"damageToPhyAssetsCountAndAmount\": \"" + damageToPhyAssetsCountAndAmountE + "\",\n"
			+ "    \"businessDisSysFailure\": \"" + businessDisSysFailureE + "\",\n"
			+ "    \"exeDelAndPm\": \"" + exeDelAndPmE + "\",\n"
			+ "    \"intermediaryCountAndAmount\": \"" + intermediaryCountAndAmountE + "\",\n"
			+ "    \"policyCountAndAmount\": \"" + policyCountAndAmountE + "\",\n"
			+ "    \"startDate\": \"" + formattedSDateE + "\",\n"
			+ "    \"endDate\": \"" + formattedEDateE + "\",\n"
			+ "    \"department\": \"" + deptIdE + "\",\n"
			+ "    \"selectedOfcType\": \"" + userOfcE + "\",\n"
			+ "    \"categoryTotal\":\"" + categoryTotalE + "\"\n" + "}";



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

		document.getElementById('load').style.visibility = "disable";


	
});	







