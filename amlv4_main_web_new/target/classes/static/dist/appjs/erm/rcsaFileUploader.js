
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

		var flg = false;
		var initial_row = 0;
		if (sheet_data.length > 0) {
			for (var row = 0; row < sheet_data.length; row++) {
				flg = false;
				for (var cell = 0; cell < 22; cell++) {

					//					console.log("Row " + row + "Cell" + cell + "SHeet cell Data " + sheet_data[row][cell]);

					if ((typeof (sheet_data[row][cell]) === "undefined") || (sheet_data[row][cell] == "")) {
						flg = false;
					}
					else {
						flg = true;
					}

				}

				if (flg == true) {
					initial_row = row;
					break;
				}
			}
		}

		//alert("Initial row " + initial_row);

		if (sheet_data.length > 0) {
			var table_output = '<table class="table table-striped table-bordered " cellspacing="0" width="100%" id="filedetails">';
			table_output += '<thead>';
			for (var row = 0; row < sheet_data.length; row++) {
				table_output += '<tr id="tableRow header">';
				var undefinedCellCount = 0;
				for (var cell = 0; cell < sheet_data[row].length; cell++) {

					if (row == initial_row) {
						if (row == initial_row && cell == 8) {
							table_output += '<th rowspan="1" colspan="2" class="tableHeader text-bold">' + sheet_data[row][cell] + '</th>'
								;
							cell++;
						} else if (row == initial_row && cell == 12) {
							table_output += '<th rowspan="1" colspan="4" class="tableHeader text-bold">' + sheet_data[row][cell] + '</th>'
							cell = cell + 3;
						} else {
							table_output += '<th rowspan="2" class="tableHeader   text-bold">' + sheet_data[row][cell] + '</th>';
						}


						if (sheet_data[row].length - 1 == cell) {
							table_output += '<tr><th rowspan="1" class="tableHeader   text-bold">' + sheet_data[row + 1][8] + '</th>'
								+ '<th rowspan="1" class="tableHeader   text-bold">' + sheet_data[row + 1][9] + '</th>'

								+ '<th rowspan="1" class="tableHeader   text-bold">' + sheet_data[row + 1][12] + '</th>'
								+ '<th rowspan="1" class="tableHeader   text-bold">' + sheet_data[row + 1][13] + '</th>'
								+ '<th rowspan="1" class="tableHeader   text-bold">' + sheet_data[row + 1][14] + '</th>'
								+ '<th rowspan="1" class="tableHeader   text-bold">' + sheet_data[row + 1][15] + '</th>'

								+ '</tr></thead>';
							table_output += '<tbody>';
						}
					}
					else if (row > initial_row + 1) {

						console.log("Row " + row + "Cell" + cell + "SHeet cell Data " + sheet_data[row][cell]);
						if ((typeof (sheet_data[row][cell]) === "undefined") || (sheet_data[row][cell] == "")) {
							undefinedCellCount++;
						}


						if ((typeof (sheet_data[row][cell]) !== "undefined") || (sheet_data[row][cell] != "")) {
							table_output += '<td class="tableData">' + sheet_data[row][cell] + '</td>';
						}
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

				/*"buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"] */
			}).buttons().container().appendTo('#filedetails_wrapper .col-md-6:eq(0)');
			//});

		}

		excel_file.value = '';
	}

});




// submiting and encrypting list of file and passing to controller using json

$("#submitFile").click(function() {

	if ($('#filedetails tr').length == 0) {
		toastr.info('Please choose file first.');
		return;
	}

	var filedetails = "[\n";

	var numFlg = false;
	if ($('#filedetails tr').length > 0) {
		$('#filedetails > tbody  > tr').each(function(index, value) {

			var srno = $(this).find('td:eq(0)').text().replaceAll('"', '') === "undefined" ? 0 : $(this).find('td:eq(0)').text().replaceAll('"', '');
			var controlDept = $(this).find('td:eq(1)').text().replaceAll('"', '');
			var riskDept = $(this).find('td:eq(1)').text().replaceAll('"', '');
			var riskFunction = $(this).find('td:eq(2)').text().replaceAll('"', '');
			var riskDescription = $(this).find('td:eq(3)').text().replaceAll('"', '');
			var rootCauseOrTrigger = $(this).find('td:eq(4)').text().replaceAll('"', '');
			var riskImpact = $(this).find('td:eq(5)').text().replaceAll('"', '');
			var riskClassification = $(this).find('td:eq(6)').text().replaceAll('"', '');
			var subRiskClassification = $(this).find('td:eq(7)').text().replaceAll('"', '');

			var likelihoodRatingScale = $(this).find('td:eq(8)').text().replaceAll('"', ''); //probability  IR
			var impactRatingScale = $(this).find('td:eq(9)').text().replaceAll('"', '');  // impact  IR
			var assessmentRatingScale = $(this).find('td:eq(10)').text().replaceAll('"', '');  //Inherent Risk rating
			var existingContrlDesc = $(this).find('td:eq(11)').text().replaceAll('"', '');
			var centralOffice = $(this).find('td:eq(12)').text().replaceAll('"', '');
			var zonalOffice = $(this).find('td:eq(13)').text().replaceAll('"', '');
			var divisionalOffice = $(this).find('td:eq(14)').text().replaceAll('"', '');
			var branchOffice = $(this).find('td:eq(15)').text().replaceAll('"', '');
			var controlOwner = $(this).find('td:eq(16)').text().replaceAll('"', '');
			var controlAssessmentValue = $(this).find('td:eq(17)').text().replaceAll('"', ''); //
			var residualAssessment = $(this).find('td:eq(18)').text().replaceAll('"', ''); //
			//Key Mitigation Measures
			var controlGaps = $(this).find('td:eq(19)').text().replaceAll('"', ''); //
			var keyMitigationMeasures = $(this).find('td:eq(20)').text().replaceAll('"', '');
			var interDepartmentDependencies = $(this).find('td:eq(21)').text().replaceAll('"', ''); //


			if (typeof (residualAssessment) === "undefined") {
				controlAssessmentValue = null;
				residualAssessment = null;
			}

			//alert(srno);
			//alert(typeof (srno) === "undefined" );
			if (typeof (srno) === "undefined" || srno == "") {
				srno = 0;
			}
			
			if (!$.isNumeric(srno)) {
				srno = 0;
			   //it's numeric
			}

			//alert(controlAssessmentValue);
			
			//alert("till here correct 2");
			if(controlAssessmentValue.toUpperCase().trim() == "EFFECTIVE")
			{
				
			}
			else if(controlAssessmentValue.toUpperCase().trim() == "INEFFECTIVE")
			{
				
			}else if(controlAssessmentValue.toUpperCase().trim() == "PARTIALLY EFFECTIVE")
			{
				
			}
			else
			{
				controlAssessmentValue = "NA";
				residualAssessment = "NA";
			}
			

			//			existingContrlDesc = existingContrlDesc.replaceAll('"','');
			//			riskDescription = riskDescription.replaceAll('"','');
			//			rootCauseOrTrigger = rootCauseOrTrigger.replaceAll('"','');
			//			riskImpact = riskImpact.replaceAll('"','');
			//			riskClassification = riskClassification.replaceAll('"','');
			//			subRiskClassification = subRiskClassification.replaceAll('"','');
			//			keyMitigationMeasures = keyMitigationMeasures.replaceAll('"','');
			//			controlGaps = controlGaps.replaceAll('"','');
			//			indeparmentDependencies = interDepartmentDependencies.replaceAll('"','');

			console.log("COntrol Desc " + existingContrlDesc);

			filedetails = filedetails +
				"  {    \"riskDept\": \"" + riskDept.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"srNO\": \"" + srno + "\",\n" +
				"    \"riskFunction\": \"" + riskFunction.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"riskDescription\": \"" + riskDescription.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"rootCauseOrTrigger\": \"" + rootCauseOrTrigger.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"riskImpact\": \"" + riskImpact.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"riskClassification\": \"" + riskClassification.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"subRiskClassification\": \"" + subRiskClassification.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"controlDept\": \"" + controlDept.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"likelihoodRatingScale\": \"" + likelihoodRatingScale.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"impactRatingScale\": \"" + impactRatingScale.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"assessmentRatingScale\": \"" + assessmentRatingScale.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"controlAssessmentValue\": \"" + controlAssessmentValue.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"residualAssessment\": \"" + residualAssessment.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"keyMitigationMeasures\": \"" + keyMitigationMeasures.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"existingContrlDesc\": \"" + existingContrlDesc.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"controlOwner\": \"" + controlOwner.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +

				"    \"controlGaps\": \"" + controlGaps.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"indeparmentDependencies\": \"" + interDepartmentDependencies.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +

				"    \"centralOffice\": \"" + centralOffice.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"zonalOffice\": \"" + zonalOffice.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"divisionalOffice\": \"" + divisionalOffice.replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
				"    \"branchOffice\": \"" + branchOffice.replace(/(\r\n|\n|\r)/gm, "") + "\"\n" +



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
			if (test[i] == 'riskDept' || test[i] == 'riskFunction' || test[i] == 'riskDescription' || test[i] == 'rootCauseOrTrigger' || test[i] == 'riskImpact'
				|| test[i] == 'riskClassification' || test[i] == 'subRiskClassification' || test[i] == 'controlDept'
				|| test[i] == 'likelihoodRatingScale' || test[i] == 'impactRatingScale' || test[i] == 'assessmentRatingScale' || test[i] == 'controlAssessmentValue'
				|| test[i] == 'actionDescription' || test[i] == 'centralOffice' || test[i] == 'zonalOffice' || test[i] == 'divisionalOffice' || test[i] == 'branchOffice') {
				validationError = false;
			} else {
				validationError = true;
				break;
			}
		}

		//		var listFileDetails = filedetails;
		var fileString = "{ \n" + " \"listFileDetails\":" + filedetails + "\n" +
			"}";
		//console.log(filedetails);
		//alert("fileString>> " + fileString)
		/*console.log(listFileDetails);
		alert("listFileDetails>> " + listFileDetails)
		console.log(filedetails);
		alert("filedetails>> " + filedetails)*/

		//console.log(fileString);
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



		console.log("Final JSon " + fileString);
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



