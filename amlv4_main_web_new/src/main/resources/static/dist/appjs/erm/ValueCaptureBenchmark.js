/*loader*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
})

document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
	} else if (state == 'complete') {
		setTimeout(
			function() {
				document.getElementById('interactive');
			}, 1000);
	}
}
/*loader*/



/*Financial Year Dropdown*/
/*var yearsLength = 3;
var  yearlist= new Date().getFullYear()-1;
var currentYear = new Date().getFullYear();
var nextCy = currentYear + 1;
var selectedYear = currentYear + '-' + nextCy.toString().slice(2);

for (var i = 0; i < yearsLength; i++) {
	var next = yearlist + 1;
	var year = yearlist + '-' + next.toString().slice(2);
	$('#bmAssessmentYear').append(new Option(year, year));
	yearlist++;
}
*/
$(document).ready(function() {
	var fiscalyear = "";
	var today = new Date();
	if ((today.getMonth() + 1) <= 3) {
		var year = today.getFullYear();
		year = year.toString().trim().substring(2, 4);
		fiscalyear = (today.getFullYear() - 1) + "-" + year
	} else {
		var fullyear = today.getFullYear() + 1;
		fullyear = fullyear.toString().trim().substring(2, 4);
		fiscalyear = today.getFullYear() + "-" + fullyear.toString().slice(2);
	}

	$('#bmAssessmentYear').val(fiscalyear);
});
/*Financial Year Dropdown*/


/*Capture Function*/

$("#capturebtn").click(function() {

	if ($('#vcrForm').valid()) {

		var mvcString = "{\n" +
			"    \"bmId\": \"" + $("#bmId").val() + "\",\n" +
			"    \"assessmentValue\":\"" + $("#bmValue").val() + "\",\n" +
			"    \"financialYear\":\"" + $("#bmAssessmentYear").val() + "\"}";

		console.log(mvcString);


		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(
			128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(
			reverseText(passphrase), mvcString);
		$("#encryptedJson").val(
			ciphertext + ':~:' + passphrase);
		$('#vcrForm').submit();

	}
});

/*Capture Function*/




/*form validate*/
$(function() {
	$('#vcrForm').validate({
		rules: {
			bmValue: {
				required: true
			},
		},
		messages: {
			bmValue: {
				required: "Please Enter Benchmark Value",
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
			form.submit();
		}
	});
});
/*form validate*/

/*Audit trail */
$('.viewAuditTrail').click(function() {

	var bmId = $("#bmId").val();
	var pageValJson = "{\"activityImpactTblKey\":"
		+ "\"" + bmId + "\"}";
	// ajax call
	$
		.ajax({
			url: 'viewAuditTrail',
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
					}, 1000);
				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);
				$(".timeline-inverse").empty();
				if (obj.length > 0) {
					obj.forEach(function(items) {
						$(
							"<p class='test'><div class='time-label'><span class='bg-success'>"
							+ items.actDate
							+ "</span></div>"
							+ "<div><i class='fas fa-comments bg-warning'></i>"
							+ "<div class='timeline-item'>"
							+ "<h3 class='timeline-header text-capitalize'><a href='#'>"
							+ items.userName
							+ " "
							+ " ("
							+ items.userRole
							+ ") </a>"
							+ items.actionPerformed
							+ "</h3>"
							+ "<div class='timeline-body'>"
							+ items.actionComment
							+ "</div>"
							+ "</div>"
							+ "</div>"
							+ "</p>")
							.appendTo(
								".timeline-inverse");
					});
					$("<div> <i class='far fa-clock bg-gray'></i> </div>").appendTo(".timeline-inverse");
					$('#timelinelink').css('class', 'border');
					$('#timelinelink').css('display', '');
					$('#timelinelink').click();
				}
				$('#timelinemodal').modal('show');
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
/*Audit trail */

