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

$(document).ready(function() {

$('option').each(function() {
    t = $(this).text();
    $(this).text(t.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }))
});

});

$("#create").click(function() {

	var checkflg = false;
	if ($("#aggregationValue").val() != null) {

		var cntrlAssessment = $("#controlAssessment").find(":selected").text().trim();
		var txtcntrlAssessment = $("#aggregationValue").val().trim();

		if (cntrlAssessment != txtcntrlAssessment) {
			if ($('#overRidejustification').val() == "") {
				$('span[id^="reason-error"]').remove();
				$('#overRidejustification').addClass('is-invalid');
				$('#overRidejustification')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Justification For The Rating Override </span>');
				checkflg = false;
			}
			else {
				$('span[id^="reason-error"]').remove();
				checkflg = true;
			}
		}
		else {
			checkflg = true;
		}
	}
	else {
		checkflg = true;
	}

	if (checkflg == true) {

		if ($('#controlAssessmentFrm').valid()) {
			$('span[id^="reason-error"]').remove();
			$('#confirmmodal').modal('show');
		}
	}

});

$(function() {

	$('#controlAssessmentFrm').validate({
		rules: {
			controlAssessmentFreq: {
				required: true
			},
			officeId: {
				required: true
			},
			justification: {
				required: true,
				minlength: 10
			},

			compensating: {
				required: true,
				minlength: 10
			},

			improvementAreas: {
				required: true,
				minlength: 10
			},



		},
		messages: {
			controlAssessmentFreq: {
				required: "Please Select a Provide Control Assessment",
			},

			officeId: {
				required: "Please Provide the Office Id",
			},

			justification: {
				required: "Please Provide the Justification",
			},

			compensating: {
				required: "Please Provide the Compensating",
			},

			improvementAreas: {
				required: "Please Provide a Improvements Areas",
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

$("#controlAssessment").change(function() {

	var txtcntrlAssessment = $("#aggregationValue").val();
	if (txtcntrlAssessment != null) {
		var cntrlAssessment = $("#controlAssessment").find(":selected").text();

		if (cntrlAssessment.trim() != txtcntrlAssessment.trim()) {
			$("#ratingOverride").show();
		}
		else {
			$("#ratingOverride").hide();
		}

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


	var programming = $("input[name='checkboxOffice']:checked").map(function() {
		return this.value;
	}).get().join(', ');
	
	var overRide = null;
	if($('#overRidejustification').val() == null)
	{
		overRide = null
	}
	else
	{
		overRide = $('#overRidejustification').val().trim();
	}

	var rasString = "{\n" +
		"    \"controlId\": \"" + $("#controlId").val() + "\",\n" +
		"    \"controlAssessmentValue\":\"" + $('#controlAssessment').find(":selected").text().toUpperCase().trim() + "\",\n" +
		"    \"justifyForOverRidding\":\"" + overRide + "\",\n" +
		"    \"justificationForRating\":\"" + $('#justification').val().trim() + "\",\n" +
		"    \"compensatingControl\":\"" + $('#compensating').val().trim() + "\",\n" +
		"    \"improvementAreas\":\"" + $('#improvementAreas').val().trim() + "\",\n" +
		"    \"listRiskId\":\"" + programming + "\",\n" +
		"    \"officeId\":\"" + $('#officeId').val() + "\",\n" +
		"    \"reportingOfficeCode\":\"" + $('#reportingOfcId').val() + "\",\n" +
		"    \"listRiskId\":\"" + programming + "\",\n" +
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
	$("#controlAssessmentFrm").submit();
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
		"columnDefs": [{
			orderable: false,

		}],
		"order": [1, "desc"],
		"responsive": false,
		"lengthMenu": [25, 50, 75, 100],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"buttons": ["csv", "excel", "pdf", "print"],
		"language": {
			"emptyTable": "No Data Available"
		},

	}).buttons().container().appendTo(
		'#controlTable_wrapper .col-md-6:eq(0)');

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

//$("#controlAssessment").change(function() {
//
//	alert($('#controlAssessment').val());
//	var controlAssessment = $('#controlAssessment').val();
//
//	var controlId = $("#controlId").val();
//
//	//if (impactRating != '' && likelihood != '') {
//	var pageValJson = "{\"controlId\":" + "\"" + controlId
//		+ "\",\"controlAssessment\":\"" + controlAssessment 
//		+ "\",\"controlAssessment\":\"" + controlAssessment + "\"}";
//
//	console.log(pageValJson);
//
//	document.getElementById('load').style.visibility = "visible";
//
//	// ajax call
//	$
//		.ajax({
//			url: 'fetchResidualMatrix',
//			type: "POST",
//			data: {
//				pageValJson: pageValJson
//			},// important line for thymeleaf http security
//
//			headers: {
//				"X-CSRF-TOKEN": $(
//					"input[name='_csrf']")
//					.val()
//			},
//			cache: false,
//			// async:true,
//
//			success: function(response) {
//				setTimeout(
//					function() {
//						document
//							.getElementById('interactive');
//						document
//							.getElementById('load').style.visibility = "hidden";
//						document
//							.getElementById('contents').style.visibility = "visible";
//					}, 1000);
//
//				var jsonResponse = JSON
//					.stringify(response);
//				obj = JSON.parse(jsonResponse);
//
//
//				$('#matrixTable').dataTable()
//					.fnClearTable();
//				$('#matrixTable').DataTable()
//					.destroy();
//
//				$("#assessmentValue").val(obj.likeImpactMatrix.calcValues);
//				//	alert(obj.likeImpactMatrix.colorCode);
//				//	obj.likeImpactMatrixList.forEach(function(items) {
//
//				//$('#actionplantable tr:last').after(
//
//				if (obj.likeImpactMatrix.severityLevel)
//					$(
//						"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
//						+ riskName
//						+ "</td><td><span class='textCapitalize'>"
//						+ $('#impactRating').find(":selected").text().toString().toLowerCase()
//						+ "</span></td><td><span class='textCapitalize'>"
//						+ $('#likelihood').find(":selected").text().toString().toLowerCase()
//						+ "</span></td>"
//						+ "<td><span class='badge text-white' style='background-color:"
//						+ obj.likeImpactMatrix.colorCode
//						+ "'; >"
//						+ obj.likeImpactMatrix.severityLevel
//						+ "</span></td>"
//						+ "<td><span class='textCapitalize'>"
//						+ moment().format('DD-MMM-YYYY')
//						+ "</span></td>"
//						+ "<td><span class='textCapitalize'>"
//						+ $('#userName').val()
//						+ "</span></td>"
//						+ "</tr>")
//						.appendTo(
//							".matrixBody");
//
//				//		});
//
//				$("#matrixTable").DataTable({
//					"ordering": false,
//					"responsive": false,
//					"lengthMenu": [25, 50, 75, 100],
//					"autoWidth": true,
//					"searching": false,
//					"fixedHeader": true,
//					//"buttons": ["csv", "excel", "pdf", "print"],
//					"language": {
//						"emptyTable": "No Data Available"
//					},
//
//				}).buttons().container().appendTo(
//					'#controlTable_wrapper .col-md-6:eq(0)');
//
//				//.clear().rows.add()
//				$('span[id^="reason-error"]').remove();
//				$('#hiddenMatrix').show();
//				$('#matrixTable').DataTable()
//					.draw();
//
//			},
//			error: function(xhr, status, error) {
//				console.log(xhr);
//				toastr
//					.error('Some Error Occured');
//			}
//		});
//
//
//	//}
//
//});
//
//
//

