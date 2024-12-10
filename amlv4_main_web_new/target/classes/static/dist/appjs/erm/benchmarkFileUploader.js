
//  Excel Uploader using Apache poi
const excel_file = document.getElementById('excel_file');

excel_file.addEventListener('change', (event) => {

	//checking excel file or not
	if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(event.target.files[0].type)) {
		document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';

		excel_file.value = '';

		return false;
	}

	var reader = new FileReader();

	reader.readAsArrayBuffer(event.target.files[0]);


	reader.onload = function(event) {

		var data = new Uint8Array(reader.result);

		var work_book = XLSX.read(data, { type: 'array' });

		var sheet_name = work_book.SheetNames;

		var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], { header: 1 });

		if (sheet_data.length > 0) {
			var table_output = '<table class="table table-striped table-bordered " cellspacing="0" width="100%" id="filedetails">';
			table_output += '<thead>';
			for (var row = 0; row < sheet_data.length; row++) {
				table_output += '<tr id="tableRow header">';

				for (var cell = 0; cell < sheet_data[row].length; cell++) {

					if (row == 0) {
						table_output += '<th class="tableHeader">' + sheet_data[row][cell] + '</th>';
						if (sheet_data[row].length - 1 == cell) {
							table_output += '</thead>';
							table_output += '<tbody>';
						}
					}
					else {

						table_output += '<td class="tableData">' + sheet_data[row][cell] + '</td>';

					}

				}

				table_output += '</tr class="tableRow">';
			}
			table_output += '</tbody>';
			table_output += '</table class="tableOutput">';

			document.getElementById('excel_data').innerHTML = table_output;
			//	alert(table_output);
			//	console.log(table_output);
			$('#filedetails').DataTable({

				"paging": true,
				"lengthChange": true,
				"searching": true,
				"ordering": false,
				"info": true,
				"autoWidth": false,
				"responsive": false

				/*"buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
			}).buttons().container().appendTo('#filedetails_wrapper .col-md-6:eq(0)');*/
			});

		}

		excel_file.value = '';
	}

});



$('#submitFile').click(function() {

	if ($('#filedetails tr').length == 0) {
		toastr.info('Please Choose File First.');
		return;
	}


	var filedetails = "[\n";



	//console.log("filedetails");
	//alert($('#filedetails tr').length);
	var data = [];
	var numFlg = false;
	var numFlg1 = false;
	var duplicate = false;
	var duplicateRow = '';
	if ($('#filedetails tr').length > 0) {
		$('#filedetails > tbody  > tr').each(function(index, value) {
			var bmName = $(this).find('td:eq(0)').text();
			var deptName = $(this).find('td:eq(1)').text();
			var financialYear = $(this).find('td:eq(2)').text();
			var assessmentValue = $(this).find('td:eq(3)').text();
			var officeCode = $(this).find('td:eq(4)').text();

			var dataStr = bmName + deptName + financialYear + assessmentValue + officeCode;

			if (data.includes(dataStr)) {
				duplicate = true;
				duplicateIndex = index;
				duplicateRow = dataStr;
				return;
			} else {
				data.push(dataStr);
			}

		});
	}

	if (duplicate) {
		var index = data.indexOf(duplicateRow);
		toastr.info('Duplicate Rows Found On ' + (index + 1));
		return;
	}

	if ($('#filedetails tr').length > 0 && !duplicate) {
		$('#filedetails > tbody  > tr').each(function(index, value) {

			var bmName = $(this).find('td:eq(0)').text();
			var deptName = $(this).find('td:eq(1)').text();
			var financialYear = $(this).find('td:eq(2)').text();
			var assessmentValue = $(this).find('td:eq(3)').text();
			var officeCode = $(this).find('td:eq(4)').text();


			if (financialYear == '2021-22' || financialYear == '2022-23' || financialYear == '2023-24') {
				numFlg = false;
			}

			else {
				numFlg = true;
			}

			/*if (jQuery.type(bmName)!="string") {
				
				numFlg=true;
				//alert(noOfPolicy+' not numberic ')
			//	alert(jQuery.type(noOfPolicy));	
			}
			if (jQuery.type(financialYear)!="number"){
				numFlg=true;	
			}*/
			/*if(jQuery.type(assessmentValue)!="number"){
				numFlg=true;	
			}*/

			if (deptName == 'ACTUARIAL' || deptName == 'INTERNAL AUDIT' || deptName == 'BOARD SECRETARIAT' || deptName == 'ENGINEERING'
				|| deptName == 'SBU - ESTATE' || deptName == 'FINANCE AND ACCOUNTS' || deptName == 'HRD: OD / FPT' || deptName == 'INSPECTION'
				|| deptName == 'INVESTMENT - M AND A' || deptName == 'INVO' || deptName == 'INVESTMENT - RM & R' || deptName == 'Personnel'
				|| deptName == 'CORPORATE COMMUNICATION' || deptName == 'CORPORATE PLANNING / NPRJ' || deptName == 'DIGITAL MARKETING' || deptName == 'MARKETING' 
				|| deptName == 'MARKETING - B AND AC' || deptName == 'MARKETING - CLIA' || deptName == 'MARKETING - SBA' || deptName == 'CMICRO - INSURANCE' 
				|| deptName == 'NB AND REINSURANCE' || deptName == 'PRODUCT DEVELOPMENT'
				|| deptName == 'CRM / PS' || deptName == 'CRM / CLAIMS' || deptName == 'IT / BPR' || deptName == 'IT / SD' || deptName == 'LEGAL '
				|| deptName == 'SUBSIDIARIES' || deptName == 'P AND GS' || deptName == 'RTI' || deptName == 'SBU - I.O.'
				|| deptName == 'VIGILANCE' || deptName == 'TAXATION DEPT' || deptName == 'ERM' || deptName == 'NEW BUSINESS AND REINSURANCE'
				|| deptName == 'INVESTMENT - OPERATIONS' || deptName == 'Office Services' || deptName == 'CORPORATE GOV / GJF / REG.COMP' || deptName == 'CRM') {

				numFlg1 = false;
			}
			else {
				numFlg1 = true;
			}



			filedetails = filedetails +
				"  {    \"bmName\": \"" + bmName + "\",\n" +
				"    \"deptName\": \"" + deptName + "\",\n" +
				"    \"financialYear\": \"" + financialYear + "\",\n" +
				"    \"assessmentValue\": \"" + assessmentValue + "\",\n" +
				"    \"officeCode\": \"" + officeCode + "\"\n" +



				" },";

		});

		filedetails = filedetails.substring(0, filedetails.length - 1);

		filedetails = filedetails +
			"]";
		//console.log(filedetails);
		//alert(filedetails);




		var test = [];
		$('.tableHeader').each(function() { test.push($(this).text()); });

		$.each(test, function(index, value) {
			//	alert(value);
			var obj1 = $(this).find('td:eq(0)').text();
			var obj2 = $(this).find('td:eq(1)').text();

			//	alert("obj1>> "+obj1);
		});
		var validationError = false;

		for (var i = 0; i < test.length; i++) {
			if (test[i] == 'bmName' || test[i] == 'deptName' || test[i] == 'financialYear' || test[i] == 'assessmentValue' || test[i] == 'officeCode') {
				validationError = false;
			} else {
				validationError = true;
				break;
			}
		}

		if (validationError) {
			toastr.info('Columns Does Not Match', { fadeAway: 5000 });
			return;
		}
		if (numFlg) {
			toastr.error('Please Provide Financial Year In Correct Format', { fadeAway: 5000 });
			return;
		}
		if (numFlg1) {
			toastr.error('Please Provide Department Name In Correct Format', { fadeAway: 5000 });
			return;
		}

		/*if (numFlg) {
			toastr.info('Only Number Is Expected In  financialYear, assessmentValue and Check the Financial Year', { fadeAway: 5000 });
			return;
		}*/
		

		//var listFileDetails = filedetails;
		var fileString = "{ \n" + " \"listFileDetails\":" + filedetails + "\n" +
			"}";
		//console.log("Final JSon " + fileString);
		//console.log(filedetails);
		//alert("fileString>> " + fileString)
		//console.log("listFileDetails"+listFileDetails);
		/*alert("listFileDetails>> " + listFileDetails)
		console.log(filedetails);
		alert("filedetails>> " + filedetails)*/

		//	console.log(fileString);
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(
			128 / 8).toString(CryptoJS.enc.Hex);

		var aesUtil = new AesUtil(keySize,
			iterationCount);

		var ciphertext = aesUtil.encrypt(
			reverseText(passphrase), fileString);

		$("#encryptedJson").val(
			ciphertext + ':~:' + passphrase);

		$("#uploadExcelFile").submit();
		//alert(listFileDetails);



	}
});


$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})