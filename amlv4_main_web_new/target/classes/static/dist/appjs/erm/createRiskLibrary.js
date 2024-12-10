$(document).ready(function() {

var startDate="";
//Date range picker
$('#startDate').datetimepicker({
         closeOnDateSelect:false,
         closeOnTimeSelect: true,
         maxDate: new Date(),
         format: 'DD-MM-YYYY',
         onChangeDateTime: function(dp,$input){
                   startDate = $("#startDate").val();
                   //alert(startDate);
                   }
                                               });

//Date range picker
$('#endDate').datetimepicker({
         closeOnDateSelect:false,
         closeOnTimeSelect: true,
         maxDate: new Date(),
         format: 'DD-MM-YYYY',
         onClose: function(current_time, $input){
                var endDate = $("#endDate").val();
                if(startDate>endDate){
                       alert('Please select correct date');
                 }
 	}
 });
		

$('option').each(function() {
    t = $(this).text();
    $(this).text(t.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }))
});

});

//search by date method
function searchDateData() {


	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var range = $("#reservation").val();
	
	var programming = $("input[name='checkboxOffice']:checked").map(function() {
                return this.value;
            }).get().join(', ');
	
	if (startDate == '') {
		toastr.info('Please Select Start Date For Search');
	} else if (endDate == '') {
		toastr.info('Please Select End Date For Search');
	} 
	 else if (process(startDate) > process(endDate)) {
		toastr.info('Start Date Cannot Be Greater Than End Date');
	}else {
		var pageValJson = "{\"startDate\":" + "\"" + startDate
			+ "\",\"officeType\":\"" + programming.trim()
			+ "\",\"endDate\":\"" + endDate + "\"}";
			
			console.log(pageValJson);
			
			document.getElementById('load').style.visibility = "visible";

				var rowCount = 0;

				rowCount = $('#controlTable tr').length;

				if (rowCount > 1) {

					var i = 1;
					while (i < rowCount) {
						$('#row_id').remove();
						i++;
					}

				}
				
			// ajax call
				$
					.ajax({
						url : 'searchControlByDate',
						type: "POST",
						data: {
							pageValJson : pageValJson
						},// important line for thymeleaf http security

						headers : {
											"X-CSRF-TOKEN" : $(
													"input[name='_csrf']")
													.val()
										},
						cache: false,
						// async:true,

						success : function(response) {
								setTimeout(
										function() {
											document
													.getElementById('interactive');
											document
													.getElementById('load').style.visibility = "hidden";
											document
													.getElementById('contents').style.visibility = "visible";
										}, 1000);

											var jsonResponse = JSON
													.stringify(response);
											obj = JSON.parse(jsonResponse);

											$('#controlTable').dataTable()
													.fnClearTable();
											$('#controlTable').DataTable()
													.destroy();

											var NewRowsCount = 0;

																obj
													.forEach(function(items) {

														//$('#actionplantable tr:last').after(

														if (items.controlId)
															$(
																	"<tr role='row' class='odd' id='row_id'><td><input type='checkbox'	name='controlid' value=' "+  items.controlId +" ' id=' "+  items.controlId +" '></td><td class='sorting_1'>"
																			+ items.controlId
																			+ "</td><td><span class='textCapitalize'>"
																			+ items.controlFunction
																			+ "</span></td><td><span class='textCapitalize'>"
																			+ items.controlName
																			+ "</span></td>"
																			+ "<td><span class='textCapitalize'>"
																			+ items.controlAssessmentFreq
																			+ "</span></td>"
																			+ "</tr>")
																	.appendTo(
																			".actPlanBody");

													});

											if (userRole != "Risk Owner") {
												$(".unlinkbtn").addClass(
														"disabled");
											}
											
											if ($('#controlTable tr').length == 2) {
												$(".unlinkbtn").addClass(
														"disabled");
											}

											$("#controlTable").DataTable({
													"columnDefs": [{
														orderable: false,
														targets: [0]
													}],
													"order": [1, "desc"],
													"responsive": false,
													"lengthMenu": [25, 50, 75, 100],
													"autoWidth": true,
													"searching": false,
													"fixedHeader": true,
													//"buttons": ["csv", "excel", "pdf", "print"],
													"language": {
														"emptyTable": "No Data Available"
													},
											
												}).buttons().container().appendTo(
													'#controlTable_wrapper .col-md-6:eq(0)');

											//.clear().rows.add()
											$('#controlTable').DataTable()
													.draw();

										},
										error : function(xhr, status, error) {
											console.log(xhr);
											toastr
													.error('Some Error Occured');
										}
									});

	}
}
		
function process(date){
   var parts = date.split("-");
   return new Date(parts[2], parts[1] - 1, parts[0]);
}


$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
})

$("#create").click(function() {
	
	
	if($("input[name='controlid']:checked").length == 0)
		{
		    toastr.error('Please select Control for Link');
		}
		else if($("input[name='controlid']:checked").length > 1)
		{
			 toastr.error('Please select Only One Control at time for Risk');
		}
		else
		{
			$('#confirmmodal').modal('show');
		}
});

$("#createRA").click(function() {

	
	var actionName = $(this).attr("name");
	// code for between threshold value
	
	var officeidlist = $("input[name='checkboxOffice']:checked").map(function() {
                return this.value;
            }).get().join(', ');

	var controlidlist = $("input[name='controlid']:checked").map(function() {
                return this.value;
            }).get().join(', ');

	
	document.getElementById('load').style.visibility = "visible";
	//Check table data
	var filedetails = "[\n";
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
		//filedetails = filedetails.slice(0,-1);
		filedetails = filedetails.substring(0, filedetails.length - 1);
	}
	filedetails = filedetails +
		"]";
	var rasString = "{\n" +
		"    \"riskId\": \"" + $("#raStmtId").val() + "\",\n" +
		"    \"riskDept\": \"" + $("#controlDept").val() + "\",\n" +
		"    \"riskFunction\":\"" + $("#controlFunction").val() + "\",\n" +
		"    \"riskName\":\"" + $("#riskName").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
		"    \"riskDescription\":\"" + $("#raStmtDescription").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
		"    \"rootCauseOrTrigger\":\"" + $("#rootCause").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
		"    \"riskImpact\":\"" + $("#impact").val() + "\",\n" +
		"    \"riskAssessmentFreq\":\"" + $("#controlAssessmentFreq").val() + "\",\n" +
		"    \"riskClassification\":\"" + $("#riskClassification").val() + "\",\n" +
		"    \"subRiskClassification\":\"" + $("#subRisk").val() + "\",\n" +
		"    \"riskStatus\":\"CR\",\n" +
		"    \"riskActionName\":\"" + actionName + "\",\n" +
		"    \"officesIdList\":\"" + officeidlist.trim() + "\",\n" +
		"    \"controlIdList\":\"" + controlidlist.trim() + "\",\n" +
		"    \"filedetailsList\":" + filedetails + "\n" +
		"}";
		
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize, iterationCount);

	var ciphertext = aesUtil.encrypt(reverseText(passphrase), rasString);
	$("#encryptedJson").val(ciphertext + ':~:' + passphrase);

	//alert("Final json is " + rasString);
	console.log(rasString);
	$("#frmriskapptstmt").submit();
});

$(function() {

	$('#frmriskapptstmt').validate({
		rules: {
			controlDept: {
				required: true
			},
			controlFunction: {
				required: true
			},
			riskName: {
				required: true
			},

			checkboxOffice: {
				required: true
			},

			raStmtDescription: {
				required: true,
				minlength : 10
			},

			rootCause: {
				required: true,
				minlength : 10
			},

			impact: {
				required: true
			},

			controlAssessmentFreq: {
				required: true
			},
			riskClassification: {
				required: true
			},


			raAssessmentCriteria: {
				required: true
			},

			riskClassification: {
				required: true
			},

			subRisk: {
				required: true
			},

		},
		messages: {
			controlDept: {
				required: "Please Select a Control Department",
			},


			controlFunction: {
				required: "Please Provide the Control Function Name",
			},

			riskName: {
				required: "Please provide the Risk Name",
			},

			checkboxOffice: {
				required: "Please Select Office",
			},

			raStmtDescription: {
				required: "Please Provide a Risk Description",
			},

			rootCause: {
				required: "Please Select a Department",
			},

			impact: {
				required: "Please Select a impact Value for Risk",
			},

			controlAssessmentFreq: {
				required: "Please Select a Assessment Frequency",
			},

			riskClassification: {
				required: "Please Select a Risk Classification",
			},

			subRisk: {
				required: "Please Select an Sub Risk",
			},


		
		},
		errorElement: 'span',
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback');
			element.closest('.form-group').append(error);
		},
		highlight: function(element, errorClass, validClass) {
			$(element).addClass('is-invalid');
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).removeClass('is-invalid');
		},
		submitHandler: function(form) {
			form.submit();
		}
	});
});

//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
		//document.getElementById('contents').style.visibility="hidden";
	} else if (state == 'complete') {
		setTimeout(function() {
			//document.getElementById('interactive');
			document.getElementById('load').style.visibility = "hidden";
			//document.getElementById('contents').style.visibility="visible";
		}, 1000);
	}
}

$("#today").text(moment(new Date()).format('DD/MM/YYYY'));



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
		}
		$('#filedetails').show();
		$('#filedetailsheader').show();
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

$(".two-decimals").change(function() {
	this.value = parseFloat(this.value).toFixed(2);
});


// 0 for null values
// 8 for backspace 
// 48-57 for 0-9 numbers



/*]]>*/




// Department list 
$('#controlDept')
	.change(
		function() {
			var dept = $(this).val();
			var pageValJson = "{\"dept\":"
				+ "\"" + dept + "\"}";
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'fetchOfficeLevel',
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
						$(".office-set").empty();
						obj.officeCheckValue
							.forEach(function(items) {
								$(
									//"<div class='form-group text-capitalize'' id='officetypeCheck'>"+
									"<div  class='form-check'>" +
									"<input  class='form-check-input checkboxOffice' value=' "+ items.officeValue +" ' name='checkboxOffice' type='checkbox' " +
									" id=check-" +
									items.officeCode +
									"  >" +
									"<label class='form-check-label' for=check-" +
									items.officeCode +
									" >" +
									items.officeValue +
									"</label>" +
									"</div>")
									.appendTo(
										".office-set");

							});




						$(".office-desc").empty();
						obj.officeDescValue
							.forEach(function(items) {

								$(
									"<div  class='row text-capitalize office-desc'>" +
									"<div class='col-sm-12'>" +
									"<div class='form-group'>" +
									"<label for='controlDescCO' > " +
									items.officeValue +
									"</label>" +
									"<textarea class='form-control form-control-sm officeDesc' " +
									" name='" +
									items.officeCode +
									"' id='" +
									items.officeCode +
									"' maxlength='3000' placeholder='Control Description' placeholder='Control Description' disabled>" +
									"</textarea> </div></div></div>"
								)
									.appendTo(
										".office-desc");

							});

						console.log(obj);

					},
					error: function(xhr, status, error) {
						console.log(xhr);
						console.log(status);
						console.log(error);
						toastr
							.success('Some Error Occured');
					}
				});
		});

// Top risk jquery


$(function() {
	$("#controlTable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [0]
		}],
		"order": [1, "desc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		//"buttons": ["csv", "excel", "pdf", "print"],
		"language": {
			"emptyTable": "No Data Available"
		},

	}).buttons().container().appendTo(
		'#controlTable_wrapper .col-md-6:eq(0)');
});

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);

})

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
})
// BS-Stepper Init
$(document).ready(function() {
	var stepper = new Stepper($('.bs-stepper')[0])
})
// BS-Stepper Init
document.addEventListener('DOMContentLoaded', function() {
	window.stepper = new Stepper(document.querySelector('.bs-stepper'))
})

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

function validateFirst() {
	
	if ($('#frmriskapptstmt').valid()) {
		
			var searchParam = "ALL";
			var searchValue = "";
			var controlDept = $('#controlDept').find(":selected").val();
			
			$("#riskID").val($('#controlDept').find(":selected").text());
			
			var programming = $("input[name='checkboxOffice']:checked").map(function() {
                return this.value;
            }).get().join(', ');

			$("#operating").val(programming);
			$('#operating').capitalize();
								
			var sortValue = "";
			
			var pageValJson = "{\"searchParam\":" + "\"" + searchParam
				+ "\",\"searchValue\":\"" + searchValue
				+ "\",\"userDept\":\"" + controlDept
				+ "\",\"officeType\":\"" + programming.trim()
				+ "\",\"sortValue\":\"" + sortValue + "\"}";
			
			console.log(pageValJson);
			
			document.getElementById('load').style.visibility = "visible";

				var rowCount = 0;

				rowCount = $('#controlTable tr').length;

				if (rowCount > 1) {

					var i = 1;
					while (i < rowCount) {
						$('#row_id').remove();
						i++;
					}

				}
				
			// ajax call
				$
					.ajax({
						url : 'searchRiskControlList',
						type: "POST",
						data: {
							pageValJson : pageValJson
						},// important line for thymeleaf http security

						headers : {
											"X-CSRF-TOKEN" : $(
													"input[name='_csrf']")
													.val()
										},
						cache: false,
						// async:true,

						success : function(response) {
								setTimeout(
										function() {
											document
													.getElementById('interactive');
											document
													.getElementById('load').style.visibility = "hidden";
											document
													.getElementById('contents').style.visibility = "visible";
										}, 1000);

					var jsonResponse = JSON
													.stringify(response);
											obj = JSON.parse(jsonResponse);

											$('#controlTable').dataTable()
													.fnClearTable();
											$('#controlTable').DataTable()
													.destroy();

											var NewRowsCount = 0;

																obj
													.forEach(function(items) {

														//$('#actionplantable tr:last').after(

														if (items.controlId)
															$(
																	"<tr role='row' class='odd' id='row_id'><td><input type='checkbox' class='controlId' name='controlid' value=' "+  items.controlId +" ' id=' "+  items.controlId +" '></td><td class='sorting_1'>"
																			+ items.controlId
																			+ "</td><td><span class='textCapitalize'>"
																			+ items.controlFunction
																			+ "</span></td><td><span class='textCapitalize'>"
																			+ items.controlName
																			+ "</span></td>"
																			+ "<td><span class='textCapitalize'>"
																			+ items.controlAssessmentFreq
																			+ "</span></td>"
																			+ "</tr>")
																	.appendTo(
																			".actPlanBody");

													});


											if (userRole != "Risk Owner") {
												$(".unlinkbtn").addClass(
														"disabled");
											}
											
											if ($('#controlTable tr').length == 2) {
												$(".unlinkbtn").addClass(
														"disabled");
											}

											$("#controlTable").DataTable({
													"columnDefs": [{
														orderable: false,
														targets: [0]
													}],
													"order": [1, "desc"],
													"responsive": false,
													//"lengthMenu": [25, 50, 75, 100],
													"autoWidth": true,
													"searching": false,
													"fixedHeader": true,
													//"buttons": ["csv", "excel", "pdf", "print"],
													"language": {
														"emptyTable": "No Data Available"
													},
											
												}).buttons().container().appendTo(
													'#controlTable_wrapper .col-md-6:eq(0)');

											//.clear().rows.add()
											$('#controlTable').DataTable()
													.draw();
											
											var flg = true;
											stepper.next();
											$(window).scrollTop(1);

										},
										error : function(xhr, status, error) {
											console.log(xhr);
											toastr
													.error('Some Error Occured');
										}
									});
		
	}
}


 $('.controlId').on('click',function(){
	alert("Clicked");
      $('.controlId').not(this).prop('checked',false);
   });

// File upload //
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
					+ '</td><td class="text-capitalize">'
					+ username
					+ '</td><td ><a class="btn btn-danger btn-sm" id="closerow"><i class="fas fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
	}
}
$(".uploadTable").on("click", "#closerow", function() {
	$(this).closest("tr").remove();
	var rowCount = $('.uploadTable tbody tr').length;
	if (rowCount == 0) {
		$('#filedetails').hide();
	}
});




// Search method by AJax

// Set Control Table Based on Department Dropdown



// Fetch Action Plan Ajax Started
$('a.fetchControl')
	.click(
		function() {
			
			var controlDept = $('#controlDept').find(":selected").val();
			var searchParam = $('#dimension').find(":selected").val();
			var searchValue = $('#searchcriteria').val().toUpperCase();
			if (searchParam == '') {
				toastr.info('Please Select Search Parameter For Search');
			} else if (searchValue == '') {
				toastr.info('Please Add Some Value For Search');
			} else {
				if (searchParam == 'controlStatus') {
					if (searchValue.includes('PENDING APPROVAL')) {
						searchValue = 'D';
					} else {
						searchValue = searchValue.charAt(0);
					}
				}
				var sortValue = $('#sorting').find(":selected").val();


				var pageValJson = "{\"searchParam\":" + "\"" + searchParam
					+ "\",\"searchValue\":\"" + searchValue
					+ "\",\"userDept\":\"" + controlDept
					+ "\",\"sortValue\":\"" + sortValue + "\"}";
			}
			
			console.log(pageValJson);
			
			document.getElementById('load').style.visibility = "visible";

				var rowCount = 0;

				rowCount = $('#controlTable tr').length;

				if (rowCount > 1) {

					var i = 1;
					while (i < rowCount) {
						$('#row_id').remove();
						i++;
					}

				}
				
			// ajax call
				$
					.ajax({
						url : 'searchRiskControlList',
						type: "POST",
						data: {
							pageValJson : pageValJson
						},// important line for thymeleaf http security

						headers : {
											"X-CSRF-TOKEN" : $(
													"input[name='_csrf']")
													.val()
										},
						cache: false,
						// async:true,

						success : function(response) {
								setTimeout(
										function() {
											document
													.getElementById('interactive');
											document
													.getElementById('load').style.visibility = "hidden";
											document
													.getElementById('contents').style.visibility = "visible";
										}, 1000);

					var jsonResponse = JSON
													.stringify(response);
											obj = JSON.parse(jsonResponse);

											$('#controlTable').dataTable()
													.fnClearTable();
											$('#controlTable').DataTable()
													.destroy();

											var NewRowsCount = 0;

																obj
													.forEach(function(items) {

														//$('#actionplantable tr:last').after(

														if (items.controlId)
															$(
																	"<tr role='row' class='odd' id='row_id'><td><input type='checkbox'	name='controlid' value=' "+  items.controlId +" ' id=' "+  items.controlId +" '></td><td class='sorting_1'>"
																			+ items.controlId
																			+ "</td><td><span class='textCapitalize'>"
																			+ items.controlFunction
																			+ "</span></td><td><span class='textCapitalize'>"
																			+ items.controlName
																			+ "</span></td>"
																			+ "<td><span class='textCapitalize'>"
																			+ items.controlAssessmentFreq
																			+ "</span></td>"
																			+ "</tr>")
																	.appendTo(
																			".actPlanBody");

													});

											if (userRole != "Risk Owner") {
												$(".unlinkbtn").addClass(
														"disabled");
											}
											
											if ($('#controlTable tr').length == 2) {
												$(".unlinkbtn").addClass(
														"disabled");
											}

											$("#controlTable").DataTable({
													"columnDefs": [{
														orderable: false,
														targets: [0]
													}],
													"order": [1, "desc"],
													"responsive": false,
													"lengthMenu": [25, 50, 75, 100],
													"autoWidth": true,
													"searching": false,
													"fixedHeader": true,
													//"buttons": ["csv", "excel", "pdf", "print"],
													"language": {
														"emptyTable": "No Data Available"
													},
											
												}).buttons().container().appendTo(
													'#controlTable_wrapper .col-md-6:eq(0)');

											//.clear().rows.add()
											$('#controlTable').DataTable()
													.draw();

										},
										error : function(xhr, status, error) {
											console.log(xhr);
											toastr
													.error('Some Error Occured');
										}
									});
	});
	
	
	//

		
			