/*loader*/
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
};
/*loader*/

$(document).ready(
	function() {

		var dFlag = "";
		var vtFlag = "";
		
		
		
		if ($("#bmDataFlgSelected").val() == 'Proportionate') {
			dFlag = "P";
		}
		
		 if ($("#bmDataFlgSelected").val() == 'Fixed') {
			dFlag = "F";
		}
		if ($("#bmValueTypeFlagSelected").val() == 'Percentage') {
			vtFlag = "P";
		} else if ($("#bmValueTypeFlagSelected").val() == 'Absolute') {
			vtFlag = "A";
		}

		$('#bmDatatype option[value="' + $("#bmDatatypeSelected").val() + '"]').attr("selected",
			"selected").change();


		$('#bmAssessmentPeriod option[value="' + $("#bmAssessmentPeriodSelected").val() + '"]')
			.attr("selected", "selected").change();

		$('#bmDataFlg option[value="' + dFlag + '"]')
			.attr("selected", "selected").change();

		$('#bmValueTypeFlag option[value="' + vtFlag + '"]')
			.attr("selected", "selected").change();


	});


/*Data Tables Declarations*/
$(function() {
	$("#filedetails").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [4, 5]
		}],
		"responsive": false,
		"lengthMenu": [5, 10, 25, 50, 75, 100],
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"lengthChange": false,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#filedetails_wrapper .col-md-12:eq(0)');
});
/*Data Tables Declarations*/

/*confirm | cancel Modals*/
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this);
	$('a.target').attr('href', recipient);

});

$("#edit").click(function() {
	if ($('#benchMarkForm').valid()) {
		$('#confirmmodal').modal('show');
	}
});
/*confirm | cancel Modals*/

/*two decimals*/
$(".two-decimals").change(function() {
	this.value = parseFloat(this.value).toFixed(2);
});
/*two decimals*/

/*Financial Year Dropdown*/
var assessYear = $('#assessYear').val();
var yearsLength = 3;
var currentYear = new Date().getFullYear() - 1;

for (var i = 0; i < yearsLength; i++) {
	var next = currentYear + 1;
	var year = currentYear + '-' + next.toString().slice(2);
	$('#bmAssessmentYear').append(new Option(year, year));
	currentYear++;
}
$('#bmAssessmentYear').val(assessYear);
/*Financial Year Dropdown*/

/*dropdown code*/
if ($("#bmAssessmentPeriod").val() == "Other") {
	var months = $("#periodValue").val()
	$("#show").val(months);
	$("#show").show();
}
/*dropdown code*/

/*Benchmark Assessment Period*/
$("#bmAssessmentPeriod").change(function() {
	$('span[id^="reason-error"]').remove();
	if ($(this).val() == "Other") {
		$("#show").show();
		$("#show").after($("#monthText"));
		$("#show").focusout(function() {
			var monthValue = $("#show").val();
			if (monthValue == '') {
				$('span[id^="reason-error"]').remove();
				$('#show').addClass('is-invalid');
				$('#show')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide number of Months </span>');
			} else if (monthValue == '6') {
				$('span[id^="reason-error"]').remove();
				$('#show').addClass('is-invalid');
				$('#show')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please select Half Yearly </span>');
			} else if (monthValue == '3') {
				$('span[id^="reason-error"]').remove();
				$('#show').addClass('is-invalid');
				$('#show')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please select Quaterly </span>');
			} else if (monthValue == '1') {
				$('span[id^="reason-error"]').remove();
				$('#show').addClass('is-invalid');
				$('#show')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please select Yearly </span>');
			} else if (monthValue == '2' || monthValue == '4' || monthValue == '5' || monthValue == '7' || monthValue == '8' || monthValue == '9' || monthValue == '10' || monthValue == '11' || monthValue == '12') {
				$('span[id^="reason-error"]').remove();
				$('#show').addClass('is-invalid');
				$('#show')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please select Monthly </span>');
			} else {
				var monthValue = $("#show").val().replace(/(\r\n|\n|\r)/gm, "");
			}
			$("#show").focusin(function() {
				$('span[id^="reason-error"]').remove();
			});
		});
	} else {
		$("#show").hide();
	}
});
/*Benchmark Assessment Period*/

/*submit button click*/
$("#submitBm").click(function() {
	var officeArr = [];
	$.each($('input[name=applicableOffice]:checked'), function() {
		var office_name = $(this).attr('value');
		officeArr.push(office_name);
	});
	var actionName = $(this).attr("name");
	if ($('#benchMarkForm').valid()) {
		//Check table data
		var filedetails = "[\n";
		if ($('#filedetails tr').length > 0) {
			$('#filedetails > tbody  > tr')
				.each(
					function(index, value) {
						var splitvalue = $(this)
							.find(
								'td:eq(0)')
							.text().split(
								'.');
						var sizesplit = $(this)
							.find(
								'td:eq(1)')
							.text().split(
								' ');
						filedetails = filedetails
							+ "  {  \"fileName\": \""
							+ $(this)
								.find(
									'td:eq(0)')
								.text()
							+ "\",\n"
							+ "    \"fileSize\": \""
							+ sizesplit[0]
							+ "\",\n"
							+
							"    \"fileType\": \""
							+ splitvalue[1]
							+ "\"\n"
							+ " },";
					});
			filedetails = filedetails.substring(0, filedetails.length - 1);
		}
		filedetails = filedetails + "]";

		var bmString = "{\n" +
			"    \"bmId\": \"" + $("#bmId").val() + "\",\n" +
			"    \"bmName\":\"" + $("#bmName").val() + "\",\n" +
			"    \"bmDatatype\":\"" + $("#bmDatatype").val() + "\",\n" +
			"    \"bmDescription\":\"" + $("#bmDescription").val() + "\",\n" +
			"    \"bmActionName\":\"" + actionName + "\",\n" +
			"    \"bmDataFlg\":\"" + $("#bmDataFlg").val() + "\",\n" +
			"    \"bmValueTypeFlag\":\"" + $("#bmValueTypeFlag").val() + "\",\n" +
			"    \"applicableOffice\":\"" + officeArr + "\",\n" +
			"    \"filedetails\":" + filedetails + ",\n" +
			"    \"bmAssessmentPeriod\":\"" + $("#bmAssessmentPeriod").val() + "\",\n"
			+ "   \"commentDto\": {\n"
			+ "   \"comment\": \"" + $("#commentBm").val().replace(/(\r\n|\n|\r)/gm, "") + "\"}}";


alert("bmString = " + bmString);

		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase), bmString);
		$("#encryptedJsonUpdate").val(ciphertext + ':~:' + passphrase);
		$("#benchMarkForm").submit();
	}
});
/*submit button click*/

/*form validate*/
$(function() {
	$('#benchMarkForm').validate({
		rules: {
			bmName: {
				required: true
			},

			bmAssessmentPeriod: {
				required: true
			},
			bmDatatype: {
				required: true
			},
			bmDescription: {
				required: true
			},
			applicableOffice: {
				required: true
			},
			commentBm: {
				required: true
			},
		},
		messages: {
			bmName: {
				required: "Please Enter Benchmark Name",
			},

			bmAssessmentPeriod: {
				required: "Please Select Assessment Period",
			},
			bmDatatype: {
				required: "Please Select BenchMark Datatype",
			},
			bmDescription: {
				required: "Please Select BenchMark Description",
			},
			applicableOffice: {
				required: "Please Select BenchMark Office Name",
			},
			commentBm: {
				required: "Please Enter Comment",
			},
		},
		errorElement: 'span',
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback');
			element.closest('.form-group')
				.append(error);
		},
		highlight: function(element, errorClass,
			validClass) {
			$(element).addClass('is-invalid');
		},
		unhighlight: function(element, errorClass,
			validClass) {
			$(element).removeClass('is-invalid');
		},
		submitHandler: function(form) {
			//toastr
			//		.success('Action Plan Created Successfully');
			document.getElementById('load').style.visibility = "visible";
			form.submit();
		}
	});
});
/*form validate*/

/*file upload*/
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
/*file upload*/



























