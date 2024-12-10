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
	
	if($('#impactRating').val() =="")
	{
		if ($('#impactRating').val() == '') {
			$('span[id^="reason-error"]').remove();
			$('#impactRating').addClass('is-invalid');
			$('#impactRating')
				.after(
					'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Impact Rating</span>');
		} 
		
	}
	else if($('#likelihood').val() =="")
	{
		if ($('#likelihood').val() == '') {
			$('span[id^="reason-error"]').remove();
			$('#likelihood').addClass('is-invalid');
			$('#likelihood')
				.after(
					'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Likelihood Rating</span>');
		} 
		
	}
	else
	{
		$('span[id^="reason-error"]').remove();
		$('#confirmmodal').modal('show');
	}

	

});

$("#createRA").click(function() {

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
		
	var assessmentValue = $("#assessmentValue").val();
	var assessmentRating = $("#matrixTable").find('td:eq(3)').text();
	var assessmentDate = $("#matrixTable").find('td:eq(4)').text();
	
	var matrixString = "{\n" + "  \"riskId\": \""
					+ $("#raStmtId").val() + "\",\n"
					+ " \"impactRatingScale\": \""
					+ $('#impactRating').find(":selected").text().trim() + "\",\n"
					+ " \"impactValue\": \""
					+ $('#impactRating').val().trim() + "\",\n"
					+ " \"likelihoodRatingScale\":\""
					+ $('#likelihood').find(":selected").text().trim() + "\",\n"
					+ " \"likelihoodValue\": \""
					+ $('#likelihood').val().trim() + "\",\n"
					+ " \"assessmentValue\": \"" + assessmentValue + "\",\n"
					+ " \"assessmentDate\": \""
					+ assessmentDate + "\",\n"
					+ " \"assessmentRatingScale\":\"" + assessmentRating + "\"\n"
					+ "}";	
					
	console.log("Matrix Rating Scale "+ matrixString);
	
	var rasString = "{\n" +
		"    \"riskId\": \"" + $("#raStmtId").val() + "\",\n" +
		"    \"impactRating\":\"" + $('#impactRating').val().trim() + "\",\n" +
		"    \"likelihoodRating\":\"" + $('#likelihood').val().trim() + "\",\n" +
		" 	\"matrixCalcDto\":" + matrixString + "\, \n"+
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
	$("#riskAssessmentFrm").submit();
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


// Top risk jquery


$(function() {
	
$("#previousMatrix").DataTable({
	
		"order": [0, "desc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": true,
		"searching": true,
		"fixedHeader": true,
		"buttons": [
            'copy',
			{
                extend: 'csv',
                messageTop: 'Inherent Risk Assessment'
            },
            {
                extend: 'excel',
                messageTop: 'Inherent Risk Assessment'
            },
            {
                extend: 'pdf',
                messageTop: 'Inherent Risk Assessment'
            },
            {
                extend: 'print',
                messageTop: 'Inherent Risk Assessment'
            }
        ],
		"language": {
			"emptyTable": "No Data Available"
		},
		
		
	}).buttons().container().appendTo(
		'#previousMatrix_wrapper .col-md-6:eq(0)');	
	
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
		
	//residualAssessmentTbl
	$("#residualAssessmentTbl").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [0]
		}],
		"order": [4, "desc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": true,
		"searching": true,
		"fixedHeader": true,
		"buttons": [
            'copy',
			{
                extend: 'csv',
                messageTop: 'Residual Risk Assessment'
            },
            {
                extend: 'excel',
                messageTop: 'Residual Risk Assessment'
            },
            {
                extend: 'pdf',
                messageTop: 'Residual Risk Assessment'
            },
            {
                extend: 'print',
                messageTop: 'Residual Risk Assessment'
            }
        ],
		"language": {
			"emptyTable": "No Data Available"
		},

	}).buttons().container().appendTo(
		'#residualAssessmentTbl_wrapper .col-md-6:eq(0)');
		
		
		
$("#actionPlanTbl").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [0]
		},
		{
			targets: [1],
			width: "20%"
			
		}
		
		],
		"order": [1, "desc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": false,
		"searching": false,
		"fixedHeader": true,
		//"buttons": ["csv", "excel", "pdf", "print"],
		"language": {
			"emptyTable": "No Data Available"
		},

	}).buttons().container().appendTo(
		'#controlTable_wrapper .col-md-6:eq(0)');
		
		//filedetails
	$("#controlAggTable").DataTable({
	"columnDefs": [{
		orderable: false,
		targets: [0]
	}],
	"order": [3, "desc"],
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
	
	
$("#filedetails").DataTable({
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




	
	
		// Dropdown change function
	// Syntax for [IMPACT - LIKELIHOOD]
	
	$(".ratingImpact").change(function() {
		
		var impactRating = $('#impactRating').val();
		var likelihood = $('#likelihood').val().toString().toLowerCase();
		
		if(impactRating !='' && likelihood !='')
		{
			var pageValJson = "{\"impactRating\":" + "\"" + impactRating
				+ "\",\"likelihoodRating\":\"" + likelihood + "\"}";
			
			console.log(pageValJson);
			
			var riskName = $("#riskName").val();
			
			document.getElementById('load').style.visibility = "visible";
			
			// ajax call
				$
					.ajax({
						url : 'fetchMatrixTable',
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

											
											$('#matrixTable').dataTable()
													.fnClearTable();
											$('#matrixTable').DataTable()
													.destroy();
											
											$("#assessmentValue").val(obj.likeImpactMatrix.calcValues);
										//	alert(obj.likeImpactMatrix.colorCode);
										//	obj.likeImpactMatrixList.forEach(function(items) {

														//$('#actionplantable tr:last').after(

														if (obj.likeImpactMatrix.severityLevel)
															$(
																	"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
																			+ riskName
																			+ "</td><td><span class='textCapitalize'>"
																			+ $('#impactRating').find(":selected").text().toString().toLowerCase()
																			+ "</span></td><td><span class='textCapitalize'>"
																			+ $('#likelihood').find(":selected").text().toString().toLowerCase()
																			+ "</span></td>"
																			+ "<td><span class='badge text-white' style='background-color:"
																			+ obj.likeImpactMatrix.colorCode
																			+ "'; >"
																			+ obj.likeImpactMatrix.severityLevel
																			+ "</span></td>"
																			+ "<td><span class='textCapitalize'>"
																			+ moment().format('DD-MMM-YYYY')
																			+ "</span></td>"
																			+ "<td><span class='textCapitalize'>"
																			+ $('#userName').val()
																			+ "</span></td>"
																			+ "</tr>")
																	.appendTo(
																			".matrixBody");

										//		});
											
											$("#matrixTable").DataTable({
													"ordering": false,
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
											$('span[id^="reason-error"]').remove();
											$('#hiddenMatrix').show();
											$('#matrixTable').DataTable()
													.draw();

										},
										error : function(xhr, status, error) {
											console.log(xhr);
											toastr
													.error('Some Error Occured');
										}
									});
				
			
		}

	});
	
	
	
		$('a.viewControlModal')
				.click(
						function() {
							var controlId = $(this).attr('id');
							var toleranceValue;
							var pageValJson = "{\"controlId\":" + "\""
									+ controlId + "\"}";
							document.getElementById('load').style.visibility = "visible";
							// ajax call
							$
									.ajax({
										url : 'viewControlModal',
										type : "POST",
										data : {
											pageValJson : pageValJson
										},// important line for thymeleaf http security
										headers : {
											"X-CSRF-TOKEN" : $(
													"input[name='_csrf']")
													.val()
										},
										cache : false,
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
											var obj = JSON.parse(jsonResponse);
											$('#controlId').val(obj.controlId);
											$('#recordstatus').val(
													"View");
											
											$('#controlDepartment').val(obj.controlDept);
											$('#controlFunctionM')
													.val(obj.controlFunction);
											$('#controlNameM').val(
													obj.controlName);
											$('#controlAssessmentFreqM').val(
													obj.controlAssessmentFreq);
													
												$('#indepartment').val(
													obj.indeparmentDependencies);
											$('#controlGaps').val(
													obj.controlGaps);
													
											//office
											$(".office-set").empty();
											obj.officeCheckValue
													.forEach(function(items) {
														if(items.officeFlg){
														$(
															//"<div class='form-group text-capitalize'' id='officetypeCheck'>"+
													        "<div  class='form-check ofcCheckbox text-capitalize'>"+
															"<input class='form-check-input checkboxOffice' type='checkbox' name="+
															items.officeValue +
															" id=check-"+
															items.officeCode +
															" checked="+
															items.officeFlg+
															"  disabled> "+
                          								    "<label class='form-check-label' for=check-"+
															items.officeCode +
															" >"+
															items.officeValue+
															"</label> &nbsp"+
                          									"</div>")
																.appendTo(
																		".office-set");
														}else{
																$(
															//"<div class='form-group text-capitalize'' id='officetypeCheck'>"+
													        "<div  class='form-check ofcCheckbox text-capitalize'>"+
															"<input  class='form-check-input checkboxOffice' type='checkbox' name="+
															items.officeValue +
															" id=check-"+
															items.officeCode +
															"  disabled> "+
                          								    " <label class='form-check-label' for=check-"+
															items.officeCode +
															" >"+
															items.officeValue+
															"</label>"+
                          									"</div>")
																.appendTo(
																		".office-set");
														}
														

													});
													
													
																						//office
											$(".office-desc").empty();
											obj.officeDescValue
													.forEach(function(items) {
													$(	
													"<div class='form-group text-capitalize'>"+
													"<label for='controlDescCO' > "+
													 items.officeValue+
													"</label>"+
													"<textarea class='form-control form-control-sm officeDesc' "+
													" name='"+
													items.officeCode +  
													" id='"+
													items.officeCode+
													"' maxlength='3000' placeholder='Control Description' readonly>"+
													items.officeDesc+
													"</textarea> </div>"
													)
																.appendTo(
																		".office-desc");
														
											});
											//office

											var rowCount = $('#capturetbl tr').length;
											if (rowCount == 1) {
												$('#asrDiv').hide();
											} else {
												$('#asrDiv').show();
											}
											$('#modalFileId tr:gt(0)').remove();
											if (obj.filedetails.length > 0) {
												obj.filedetails
														.forEach(function(item) {
															$(
																	'#modalFileId tr:last')
																	.after(
																			'<tr><td>'
																					+ item.fileName
																					+ '</td><td>'
																					+ item.fileSize
																					+ '</td><td class="text-capitalize">'
																					+ item.uploadedBy
																					+ '</td><td>'
																					+ item.uploadTimestamp
																					+ '</td><td><div class="btn-group btn-group-sm">'
																					+ '<a name='+item.fileName+' href="#" class="btn btn-info downloadfile"><i '
								+' class="fas fa-download"></i></a>'
																					+ '</div></td></tr>');
														});
												var seen = {};
												$('#modalFileId tr')
														.each(
																function() {
																	var txt = $(
																			this)
																			.text();
																	if (seen[txt])
																		$(this)
																				.remove();
																	else
																		seen[txt] = true;
																});
												$('#fileDiv').show();
											}
											$('#controlmodal').modal('show');
										},
										error : function(xhr, status, error) {
											toastr
													.success('Some Error Occured');
										}
									});
						});

		
	
		
// Back Button Logic
		
	$('a.backBtn').click(function() {
   
//			alert("Function Called");
			var pageName = $(this).attr("data-pagename");
			var riskId = $("#raStmtId").val();
			//alert(pageName);
			var defaultDept = $("#defaultDept").val();
//			alert("Default Dept "+ defaultDept);
			//alert(riskId);
			var pageValJson = "{\"defaultDept\":" + "\""
				+ defaultDept 
				+ "\",\"pageName\":\"" + pageName
				+ "\",\"riskId\":\"" + riskId
				+ "\"}";

			//alert(pageValJson);
			document.getElementById('load').style.visibility = "visible";

			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
				.toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
				pageValJson);
			$("#encryptedJsonReg").val(ciphertext + ':~:' + passphrase);
			console.log(pageValJson);
			$('#riskAssessmentFrm').attr('action', pageName);
			$("#riskAssessmentFrm").submit();

	});