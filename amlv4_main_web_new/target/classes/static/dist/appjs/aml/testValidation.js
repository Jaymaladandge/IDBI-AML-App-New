//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
}

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
})
$(function() {
	$("#testSummarytable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [0, 1, 4, 5, 6]
		}],
		"order": [2, "desc"],
		"responsive": false,
		"lengthMenu": [25, 30, 50, 75, 100],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"buttons": ["csv", "excel", "pdf", "print"],
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#testSummarytable_wrapper .col-md-6:eq(0)');
});

var totalsizeOfUploadFiles = 0;
function getExcelData(input) {
	//alert("enterd");
	var fup = document.getElementById('excel_file');
	var fileName = fup.value;
	var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
	var select = $('.ExcelUpload');

	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
		var flg = true;
		$('.ExcelUpload tr').each(function() {
			var fName = $(this).find('td:eq(0)').text()

			console.log('fName ' + fName + ' filename ' + filename);
			if (fName == filename) {
				flg = false;
			}
		});
		if (flg) {
			select
				.append($('<tr id=tr' + i + '><td id=filetd' + i + '>'
					+ filename
					+ '</td><td id=filesizetd' + i + '>'
					+ filesizeInMB
					+ ' kb</td><td>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td> Self </td><td class="project-actions text-right"><a class="btn btn-danger text-white btn-sm" id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		//alert("till here correct");
		$('#ExcelUploader').show();
		$('#ExcelUploaderheader').show();
	}

}
$(".ExcelUpload").on("click", "#closerow", function() {
	var rowCount = $('.ExcelUpload tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#ExcelUploader').hide();
		$('#ExcelUploaderheader').hide();
	}
	$(this).closest("tr").remove();
});

const excel_file = document.getElementById('excel_file');

excel_file.addEventListener('change', (event) => {
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
			var table_output = '<table class="table table-striped table-bordered " cellspacing="0" width="100%" id="testdetails">';
			table_output += '<thead>';
			for (var row = 0; row < sheet_data.length; row++) {
				//alert("check here"+sheet_data.length);
				table_output += '<tr id="tableRow header">';
				var undefinedCellCount = 0;
				for (var cell = 1; cell < sheet_data[row].length; cell++) {
					//alert("check here"+sheet_data[row].length);
					if (row == initial_row) {

						table_output += '<th rowspan="2" class="tableHeader   text-bold">' + sheet_data[row][cell] + '</th>';


						if (sheet_data[row].length - 1 == cell) {
							//alert(sheet_data[row].length - 1+"here check out");
							table_output += '<tr>'

								+ '</tr></thead>';
							table_output += '<tbody>';
							//alert(sheet_data[row][9]+"here check out");
						}
					}
					else if (row > initial_row) {
						console.log('todays date');
						//console.log("Row " + row + "Cell" + cell + "SHeet cell Data " + sheet_data[row][cell]);
						if ((typeof (sheet_data[row][cell]) === "undefined") || (sheet_data[row][cell] == "")) {
							console.log('find me out');
							undefinedCellCount++;
						}
						if ((typeof (sheet_data[row][cell]) !== "undefined") || (sheet_data[row][cell] != "")) {
							//console.log('lets check out');
							table_output += '<td class="tableData">' + sheet_data[row][cell] + '</td>';

						}
						//alert(sheet_data[row][5]+"here check out");
					}

				}

				table_output += '</tr class="tableRow">';
			}
			table_output += '</tbody>';
			table_output += '</table class="tableOutput">';
			document.getElementById('checkout').innerHTML = table_output;
			//	console.log(table_output);
			$('#testdetails').DataTable({

				"paging": true,
				"lengthChange": true,
				"searching": true,
				"ordering": false,
				"info": true,
				"autoWidth": false,
				"responsive": false

				/*"buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"] */
			}).buttons().container().appendTo('#testdetails_wrapper .col-md-6:eq(0)');
		}
	}
	excel_file.value = '';
});

$(function() {
	$("#btnsubmit")
		.click(
			function() {
				// Form validation
				if ($('#createTestForm').valid()) {

					var testdetails = "[\n";
					if ($('#testdetails tr').length > 0) {
						$('#testdetails > tbody  > tr')
							.each(
								function(index, value) {
									var examQuestions = $(
										this).find(
											'td:eq(0)')
										.text().split(
											'.');
									var sizesplit = $(this)
										.find(
											'td:eq(1)')
										.text().split(
											' ');
									var fileType = $(this)
										.find(
											'td:eq(2)')
										.text().split(
											' ');
									var correctOpt = $(this)
										.find(
											'td:eq(2)')
										.text().split(
											',');

									var availableOpt = '';
									$.each(
										correctOpt,
										function(
											i) {
											var temp = correctOpt[i];
											availableOpt = temp + "~" + availableOpt;
										});
									availableOpt = availableOpt.substring(0, availableOpt.length - 1);
									if (examQuestions != "") {
										testdetails = testdetails
											+ "  {  \"question\": \""
											+ $(this)
												.find(
													'td:eq(0)')
												.text()
											+ "\",\n"
											+ "    \"questionType\": \""
											+ $(this)
												.find(
													'td:eq(1)')
												.text()
											+ "\",\n"
											+ "    \"options\": \""
											+ availableOpt
											+ "\",\n"
											+ "    \"questionWeightage\": \""
											+ $(this)
												.find(
													'td:eq(4)')
												.text()
											+ "\",\n"
											+ "    \"correctAnswer\": \""
											+ $(this)
												.find(
													'td:eq(3)')
												.text()
											+ "\"\n"
											+ " },";
									}
								});
						testdetails = testdetails.substring(0,
							testdetails.length - 1);
					}
					testdetails = testdetails + "]";

					var pageValJson = "{\n" +
						"	\"testId\": \"" + $("#testId").val() + "\",\"testInstruction\": \"" + $("#TestInstruction").val() + "\","
						+ " \"testAssignedCategory\": \"" + $("#testCategory").val() + "\",\"testAssignedSubCategory\": \"" + $("#testSubCategory").val() + "\","
						+ " \"testDescription\": \"" + $("#testDescription").val() + "\"," +
						"   \"queList\": " + testdetails + "}";
					console.log(pageValJson);
					$("#testDetailsJson").val(testdetails);
					$("#encryptedJson").val(pageValJson);
					$("#createTestForm").submit();
					// Additional validation for table details
					if ($('#testdetails tr').length === 0) {
						var message = 'Please upload the file.';
						$('#messages').html(message);
						return false;
					}
				}
			});
	$('#createTestForm')
		.validate(
			{
				rules: {
					testCategory: {
						required: true
					},
					testSubCategory: {
						required: true
					},
					testDescription: {
						required: true,
						minlength: 10,
						maxlength: 3000,
					},
					TestInstruction: {
						required: true,
						minlength: 10,
						maxlength: 3000,
					},
				},
				messages: {
					testCategory: {
						required: "Please select a EDD category",
					},
					testSubCategory: {
						required: "Please select a EDD sub-category",
					},
					testDescription: {
						required: "Please enter the EDD description",
						minlength: "Description must be at least 10 characters long",
						maxlength: "Description cannot exceed 3000 characters",
					},
					TestInstruction: {
						required: "Please enter the EDD instruction",
						minlength: "Instruction must be at least 10 characters long",
						maxlength: "Instruction cannot exceed 3000 characters",
					},
				},
				errorElement: 'span',
				errorPlacement: function(error, element) {
					error.addClass('invalid-feedback');
					element.closest('.form-group').append(error);
				},
				highlight: function(element, errorClass,
					validClass) {
					$(element).addClass('is-invalid');
				},
				unhighlight: function(element, errorClass,
					validClass) {
					$(element).removeClass('is-invalid');
				},
			});
});

$('#testCategory')
	.on(
		'change',
		function() {
			//alert("entered in jsp");
			var testCategoryValue = $("#testCategory").val();
			var pageValJson = "{\"testAssignedCategory\": \"" + testCategoryValue + "\"}";
			document.getElementById('load').style.visibility = "visible";
			$
				.ajax({
					url: "fetchSubCategory",
					method: "POST",
					data: {
						pageValJson: pageValJson
					}, headers: {
						"X-CSRF-TOKEN": $("input[name='_csrf']").val()
					}, cache: false,
					// async:true,
					success: function(response) {
						setTimeout(
							function() {
								document.getElementById('load').style.visibility = "hidden";
							}, 1000);
						var jsonResponse = JSON.stringify(response);
						var obj = JSON.parse(jsonResponse);
						var temp = '#testSubCategory';
						var appenddata1 = "";
						$("#testSubCategory").empty();
						appenddata1 += "<option value = '' class='text-capitalize'><font class='text-capitalize'>"
							+ 'Select'
							+ "</font> </option>";
						obj.subCategoryList
							.forEach(function(items, i) {
								//alert(i);
								//alert(items);
								// Dropdown
								appenddata1 += "<option value = '" + items + " ' class='text-capitalize'><font class='text-capitalize'>"
									+ items
									+ "</font> </option>";
							})

						$('select option')
							.each(
								function() {
									t = $(this).text();
									$(this).text(
										t.replace(
											/^(.)|\s(.)/g,
											function(
												$1) {
												return $1
													.toUpperCase();
											}))
								});
						$("#testSubCategory").append(
							appenddata1);

						$('#testSubCategory option')
							.text(
								function(i, oldtext) {
									return oldtext
										.substr(0,
											1)
										.toUpperCase()
										+ oldtext
											.substr(1);
									/* return oldtext.toUpperCase(); */
								});

					},
					error: function() {
						toastr.error('Some Error Occured');
					}
				})
		})
 