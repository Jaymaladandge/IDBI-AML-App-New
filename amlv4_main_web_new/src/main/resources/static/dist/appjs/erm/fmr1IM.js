var selectedOfficeTypeE = "";
var officeCodeE = "";
var officeIdE = "";
var financialYearE = "";
var userDeptIdE = "";


var financialYear = "";

//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
	} else if (state == 'complete') {
		setTimeout(
			function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
	}
}
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});

$(function() {

	var rowCountIm = $('.IncidentManagementtable tr').length;
	if (rowCountIm == 1) {
		$('#showImTable').hide();

	} else if (rowCountIm > 1) {
		$('#showImTable').show();

	}

});

$("#fetchDataBtn")
	.click(
		function() {
			var selectedValue = "";
			selectedValue = $('#officeType').val();
			console.log(selectedValue)
			if (selectedValue == "") {
				toastr.error("Please Select Office Type");

			}

			else {
				var selectedOfficeType = $('#officeType :selected').val();

				var officeId = $('#officeId').val();
				var userDeptId = $("#userDeptId").val();
				var officeCode = $("#officeCode").val();

				selectedOfficeTypeE = selectedOfficeType;
				officeCodeE = officeCode;
				officeIdE = officeId;
				financialYearE = financialYear;
				userDeptIdE = userDeptId;


				pageValJson = "{\n"
					+ "    \"userOfc\": \"" + selectedOfficeType + "\",\n"
					+ "    \"officeCode\": \"" + officeCode + "\",\n"
					+ "    \"officeId\": \"" + officeId + "\",\n"
					+ "    \"financialYear\": \"" + financialYear + "\",\n"
					+ "    \"userDept\": \"" + userDeptId + "\"\n" + "}";


				document.getElementById('load').style.visibility = "visible";

				$.ajax({
					url: "fraudMonitorReport1IM",
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
						var obj = JSON
							.parse(jsonResponse);
						console.log(obj.fmrPart1list);

						var totalData = obj.totalFmr;
						var totFmr2 = obj.totalFmr2;
						var totFmr4 = obj.totalFmr4;

						$(".fmrIMtable > #tbodyIm")
							.empty();
						$('#fmrIMtable')
							.dataTable()
							.fnClearTable();
						$('#fmrIMtable')
							.DataTable().destroy();

						obj.fmrPart1list.forEach(function(item) {

							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ item.split('~')[0]
								+ "</td>"
								+ "<td>"
								+ item.split('~')[1]
								+ "</td>"
								+ "<td>"
								+ item.split('~')[2]
								+ "</td>"
								+ "<td>"
								+ getamountInword(item.split('~')[3])
								+ "</td>"
								+ "<td>"
								+ item.split('~')[4]
								+ "</td>"
								+ "<td>"
								+ getamountInword(item.split('~')[5])
								+ "</td>"
								+ "<td>"
								+ item.split('~')[6]
								+ "</td>"
								+ "<td>"
								+ getamountInword(item.split('~')[7])
								+ "</td>"
								+ "<td>"
								+ item.split('~')[8]
								+ "</td>"
								+ "<td>"
								+ getamountInword(item.split('~')[9])
								+ "</td>"
								+ "</tr>")
								.appendTo(
									".fmrIMtable");

						});
						$('#tot1').text(totalData.split('~')[0]);
						$('#tot2').text(getamountInword(totalData.split('~')[1]));
						$('#tot3').text(totalData.split('~')[2]);
						$('#tot4').text(getamountInword(totalData.split('~')[3]));
						$('#tot5').text(totalData.split('~')[4]);
						$('#tot6').text(getamountInword(totalData.split('~')[5]));
						$('#tot7').text(totalData.split('~')[6]);
						$('#tot8').text(getamountInword(totalData.split('~')[7]));


						$(".fmrIMtable2 > #tbodyIm2")
							.empty();
						$('#fmrIMtable2')
							.dataTable()
							.fnClearTable();
						$('#fmrIMtable2')
							.DataTable().destroy();

						obj.fmrPart2list.forEach(function(item) {

							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ item.split('~')[0]
								+ "</td>"
								+ "<td>"
								+ item.split('~')[1]
								+ "</td>"
								+ "<td>"
								+ item.split('~')[2]
								+ "</td>"
								+ "<td>"
								+ getamountInword(item.split('~')[3])
								+ "</td>"
								+ "</tr>")
								.appendTo(
									".fmrIMtable2");

						});

						$('#tot2_1').text(totFmr2.split('~')[0]);
						$('#tot2_2').text(getamountInword(totFmr2.split('~')[1]));


						$(".fmrIMtable3 > #tbodyIm3")
							.empty();
						$('#fmrIMtable3')
							.dataTable()
							.fnClearTable();
						$('#fmrIMtable3')
							.DataTable().destroy();

						obj.fmrPart3list.forEach(function(item) {

							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ item.split('~')[0]
								+ "</td>"
								+ "<td>"
								+ item.split('~')[1]
								+ "</td>"
								+ "<td>"
								+ item.split('~')[2]
								+ "</td>"
								+ "</tr>")
								.appendTo(
									".fmrIMtable3");
						});


						obj.fmrPart4list.forEach(function(item) {

							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ item.split('~')[0]
								+ "</td>"
								+ "<td>"
								+ item.split('~')[1]
								+ "</td>"
								+ "<td>"
								+ item.split('~')[2]
								+ "</td>"
								+ "<td>"
								+ getamountInword(item.split('~')[3])
								+ "</td>"
								+ "<td>"
								+ item.split('~')[4]
								+ "</td>"
								+ "<td>"
								+ getamountInword(item.split('~')[5])
								+ "</td>"
								+ "<td>"
								+ item.split('~')[6]
								+ "</td>"
								+ "<td>"
								+ getamountInword(item.split('~')[7])
								+ "</td>"
								+ "<td>"
								+ item.split('~')[8]
								+ "</td>"
								+ "<td>"
								+ getamountInword(item.split('~')[9])
								+ "</td>"
								+ "</tr>")
								.appendTo(
									".fmrIMtable4");

						});

						$('#tot4_1').text(totFmr4.split('~')[0]);
						$('#tot4_2').text(getamountInword(totFmr4.split('~')[1]));
						$('#tot4_3').text(totFmr4.split('~')[2]);
						$('#tot4_4').text(getamountInword(totFmr4.split('~')[3]));
						$('#tot4_5').text(totFmr4.split('~')[4]);
						$('#tot4_6').text(getamountInword(totFmr4.split('~')[5]));
						$('#tot4_7').text(totFmr4.split('~')[6]);
						$('#tot4_8').text(getamountInword(totFmr4.split('~')[7]));

						$('#showImTable').show();
						
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


function getCurrentFinancialYear() {
	var fiscalyear = "";
	var today = new Date();
	if ((today.getMonth() + 1) <= 3) {
		fiscalyear = (today.getFullYear() - 1) + "-"
			+ today.getFullYear()
	} else {
		fiscalyear = today.getFullYear() + "-"
			+ (today.getFullYear() + 1)
	}
	financialYear = fiscalyear;
	return fiscalyear
}

document.getElementById("spFY").innerHTML = getCurrentFinancialYear();


$(".exportPdf")
	.click(
		function() {

			var IncidentManagementtable;

			IncidentManagementtable = "[\n";
			if ($('#IncidentManagementtable tr').length > 0) {
				$('#IncidentManagementtable > tbody  > tr')
					.each(
						function(index, value) {

							IncidentManagementtable = IncidentManagementtable
								+ "  {  \"srNo\": \""
								+ $(this)
									.find(
										'td:eq(0) ')
									.text()
								+ "\",\n"
								+ "    \"checkListNmae\": \""
								+ $(this)
									.find(
										'td:eq(1) ')
									.text()
								+ "\",\n"
								+ "    \"checkListCout\": \""
								+ $(this)
									.find(
										'td:eq(2) ')
									.text()
								+ "\"\n" + " },";

						});
				IncidentManagementtable = IncidentManagementtable
					.substring(
						0,
						IncidentManagementtable.length - 1);

			}
			IncidentManagementtable += "]";

			console.log("Action String "
				+ IncidentManagementtable);

			var IncidentManagementString = "{\n"
				+ "    \"checkListCount\":"
				+ IncidentManagementtable + ",\n"
				+ "    \"financialYear\": \""
				+ getCurrentFinancialYear() + "\"\n" + "}";
			console.log(IncidentManagementString);

			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(
				128 / 8).toString(CryptoJS.enc.Hex);

			var aesUtil = new AesUtil(keySize, iterationCount);

			var ciphertext = aesUtil.encrypt(
				reverseText(passphrase),
				IncidentManagementString);
			$("#encryptedJson").val(
				ciphertext + ':~:' + passphrase);

			console.log("Workflow String "
				+ IncidentManagementString);
			$("#exportPdfReport").submit();

		});




$(".exportPdf").click(function() {

	pageValJson = "{\n"
		+ "    \"userOfc\": \"" + selectedOfficeTypeE + "\",\n"
		+ "    \"officeCode\": \"" + officeCodeE + "\",\n"
		+ "    \"officeId\": \"" + officeIdE + "\",\n"
		+ "    \"financialYear\": \"" + financialYearE + "\",\n"
		+ "    \"userDept\": \"" + userDeptIdE + "\"\n" + "}";

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize, iterationCount);

	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase),
		pageValJson);
	$("#encryptedJson").val(
		ciphertext + ':~:' + passphrase);

	$("#exportPdfReport").submit();



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




