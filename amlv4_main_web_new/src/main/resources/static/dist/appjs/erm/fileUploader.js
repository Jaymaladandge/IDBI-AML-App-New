
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
						if(sheet_data[row].length-1 == cell){
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
      		"ordering": true,
      		"info": true,
      		"autoWidth": false,
      		"responsive": false
      		
      		/*"buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    		}).buttons().container().appendTo('#filedetails_wrapper .col-md-6:eq(0)');*/
       		})

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

	//console.log("filedetails");
	//alert($('#filedetails tr').length);
	if ($('#filedetails tr').length > 0) {
		$('#filedetails > tbody  > tr').each(function(index, value) {
			var policyId = $(this).find('td:eq(0)').text();		
			var noOfPolicy = $(this).find('td:eq(1)').text();
			var firstPremiumPolicy = $(this).find('td:eq(2)').text();
			var weightage = $(this).find('td:eq(3)').text();
			var officeId = $(this).find('td:eq(4)').text();
			var officeType = $(this).find('td:eq(5)').text();
			
				
			filedetails = filedetails +
				"  {  \"policyId\": \"" + policyId + "\",\n" +
				"    \"noOfPolicy\": \"" + noOfPolicy + "\",\n" +
				"    \"firstPremiumIncome\": \"" + firstPremiumPolicy + "\",\n" +
				"    \"weightage\": \"" + weightage + "\",\n" +
				"    \"officeId\": \"" + officeId + "\",\n" +
				"    \"officeType\": \"" + officeType + "\"\n" +

				" },";
			
		});

		filedetails = filedetails.substring(0, filedetails.length - 1);

		filedetails = filedetails +
			"]";

		//	alert(filedetails);
		var test=[];
		$('.tableHeader').each(function(){test.push($(this).text());});
		
		$.each(test,function(index,value){
		//	alert(value);
		var obj1=$(this).find('td:eq(0)').text();
		var obj2=$(this).find('td:eq(1)').text();
		
	//	alert("obj1>> "+obj1);
		});
		var validationError = false;	
		
		for (var i = 0; i < test.length; i++) {
           if(test[i] == 'policyId' || test[i] == 'noOfPolicy' ||test[i] == 'firstPremiumIncome' ||test[i] == 'weightage' ||test[i] == 'officeId' ||test[i] == 'officeType'){
				validationError = false;
			}else{
				validationError = true;
				break;
			}
         }
		
		if(validationError){
			toastr.info('Columns doesnt match',{fadeAway:5000});
			return;
		}
		
		var listFileDetails = filedetails;
		var fileString = "{ \n" + " \"listFileDetails\":" + filedetails + "\n" +
			"}";
		//console.log(fileString);
		//alert("fileString>> " + fileString)
		/*console.log(listFileDetails);
		alert("listFileDetails>> " + listFileDetails)
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
		//alert(listFileDetails);

		if (listFileDetails != null) {
			if (listFileDetails.length === 2) {
				
				toastr.info('Please choose file first.');
			} else {
				//alert("hi");
				$("#uploadExcelFile").submit();
				toastr.success('Data Has Been Sent For Upload',{fadeAway:5000});
			}
		}
		else {
		//	alert("hello");
			toastr.success('Data Has Been Sent For Upload',{fadeAway:5000});
		}

	}
});




$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})



