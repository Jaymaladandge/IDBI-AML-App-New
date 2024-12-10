/*GLOBAL VARIABLE*/
var incidentIdentificationDate = "";
var num;
var xValue = 0;
/*GLOBAL VARIABLE*/

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
}
$(document).ready(function() {
	$("a .fa-twitch").click(function() {
		$('#timelinelink').css('class', 'border');
		$('#timelinelink').css('display', '');
		$('#timelinelink').click();

	});
	$("#summarylink").click(function() {
		$('#timelinelink').css('display', 'none');
	});

	/*var message = $('#message').val();
			if (message != "") {
				toastr.success(message);
			}*/

});
$("#today").text(moment(new Date()).format('DD/MM/YYYY'));
/*loader*/


/*confirm | cancel Modals*/
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this);
	$('a.target').attr('href', recipient);

});
$("#create").click(function() {
	if ($('#incidentForm').valid()) {
		$('#confirmmodal').modal('show');
	}
});
/*confirm | cancel Modals*/


/*$(".two-decimals").change(function() {
	this.value = parseFloat(this.value).toFixed(2);
});*/




/*$("#assessedImpactValue").on('keypress', function(event) {

	//Disable special character except '.'
	var regex = new RegExp("^[0-9]+$");
	var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
	if ('.' != key) {
		if (!regex.test(key)) {
			event.preventDefault();
			return false;
		}
	}
	var x = $("#assessedImpactValue").val();
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
	var lastThree = x.substring(x.length - 2);
	var otherNumbers = x.substring(0, x.length - 2);
	if (otherNumbers != '')
		lastThree = ',' + lastThree;
	var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
	if (res == 'NaN') {
		res = 0;
	}
	//alert("res =" + res);
	$("#assessedImpactValue").val(res);
});
*/
/*$(document).ready(function() {
	
	if($("#assessedImpactValue").val() != null){
		
		var flg = false;
	x = $("#assessedImpactValue").val();
	var newX = $("#assessedImpactValue").val();

	if (x.indexOf('.') > 0) {
		flg = true;
	}
	xValue = $("#assessedImpactValue").val().replaceAll(',', '');
	var number = x.split('.')[0].split('');
	var x = '';
	for (i = 0; i < number.length; i++) {
		if (number[i] != ',') {
			x = x + number[i];
		}
	}
	var str1 = inWord(x);

	if (flg) {
		var y = newX.split('.')[1];
		if(y!='')
		var str = str1 + ' Rupees and ' + inWord(y)  + ' Paisa Only';
	}else{
		var str = str1  + 'Rupees Only';
	}
	$('#showWordsAmt').text(str);
	}
	
	
})*/



/*$("#assessedImpactValue").on('keyup', function(event) {
	var flg = false;
	x = $("#assessedImpactValue").val();
	var newX = $("#assessedImpactValue").val();

	if (x.indexOf('.') > 0) {
		flg = true;
	}
	xValue = $("#assessedImpactValue").val().replaceAll(',', '');
	var number = x.split('.')[0].split('');
	var x = '';
	for (i = 0; i < number.length; i++) {
		if (number[i] != ',') {
			x = x + number[i];
		}
	}
	var str1 = price_in_words(x);

	if (flg) {
		var y = newX.split('.')[1];
		if(y!='')
		var str = str1 + ' Rupees and ' + price_in_words(y)  + ' Paisa Only';
	}else{
		var str = str1  + 'Rupees Only';
	}
	$('#showWordsAmt').text(str);
	//toWords(x);
});*/

/*Number to Words*/


/*LOSS EVENT CATEGORY*/
$("#primaryLossEvent").change(function() {
	$('#secondaryLossEvent').empty();
	tempEvent = $(this).val().replaceAll('~', ', ');
	var catList = $("#categoryList").val().replace('[', '');
	catList = catList.replace(']', '');
	catList = catList.split(',');
	var categoryArray = [];
	var secondaryArray = [];
	for (var i = 0; i < catList.length; i++) {
		categoryArray.push(catList[i]);
	}
	for (var i = 0; i < categoryArray.length; i++) {
		var strValue = categoryArray[i].replaceAll('~', ', ');
		//alert('first '+$.trim(strValue).length+'='+tempEvent.length);
		if ($.trim(strValue) !== $.trim(tempEvent)) {
			secondaryArray.push(categoryArray[i]);
		}
	}
	for (var i = 0; i < secondaryArray.length; i++) {
		$('#secondaryLossEvent').append('<option value="">Select</option> <option value="' + secondaryArray[i].replaceAll('~', ', ') + '" >' + secondaryArray[i].replaceAll('~', ', ') + '</option>');
	}

});
/*LOSS EVENT CATEGORY*/

function price_in_words(price1) {
	//alert(price1);
	// Just remove commas and periods - regex can do any chars
	price = price1.replace(/([,€])+/g, '');
	var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
		dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
		tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
		handle_tens = function(dgt, prevDgt) {
			return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
		},
		handle_utlc = function(dgt, nxtDgt, denom) {
			return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
		};
	var str = "",
		digitIdx = 0,
		digit = 0,
		nxtDigit = 0,
		words = [];
	if (price += "", isNaN(parseInt(price))) str = "";
	else if (parseInt(price) > 0 && price.length <= 10) {
		for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) switch (digit = price[digitIdx] - 0, nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0, price.length - digitIdx - 1) {
			case 0:
				words.push(handle_utlc(digit, nxtDigit, ""));
				break;
			case 1:
				words.push(handle_tens(digit, price[digitIdx + 1]));
				break;
			case 2:
				words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2] ? " and" : "") : "");
				break;
			case 3:
				words.push(handle_utlc(digit, nxtDigit, "Thousand"));
				break;
			case 4:
				words.push(handle_tens(digit, price[digitIdx + 1]));
				break;
			case 5:
				words.push(handle_utlc(digit, nxtDigit, "Lakh"));
				break;
			case 6:
				words.push(handle_tens(digit, price[digitIdx + 1]));
				break;
			case 7:
				words.push(handle_utlc(digit, nxtDigit, "Crore"));
				break;
			case 8:
				words.push(handle_tens(digit, price[digitIdx + 1]));
				break;
			case 9:
				words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : " Crore") : "")
		}
		str = words.reverse().join("")
	}
	console.log(str);
	return str
}
/*Number to Words*/
$('#assessedImpactValue').keyup(function(event) {

	var valueT = $(this).val();
	if (valueT.indexOf('.') > 0){
		var valueR = valueT.split('.')[0];
		var valueP = valueT.split('.')[1];
		 valueR.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
	}else{
		var valueP = ' Zero '; 
		var valueR = valueT;
	}
	var money = valueR;
	var length = money.length;
	if (length < 15) {
		var x=0;
		if(valueP == ' Zero '){
			x = ' Zero ';
		}else{
			x = price_in_words(valueP);
		}
	$(this).closest('.form-group').find('.spnWord').text(price_in_words(valueR) + ' Rupees And ' + x + ' Paise Only' );
	} else {
	var moneys = money.replace(new RegExp(',', 'g'), '');
	var valueP = moneys.substring(moneys.length - 7, moneys.length);
	var croreValue = moneys.substr(0, moneys.length - 7);
	$('#showWordsAmt').text(price_in_words(croreValue) + ' Crore' + price_in_words(lacvalue) + ' Rupees Only') ;
	}
	});
	/*if(obj.recoverableValue != null){
	var a=obj.recoverableValue;
    a=a.toString();
    var afterPoint = '';
    if(x.indexOf('.') > 0)
    afterPoint = x.substring(a.indexOf('.'),a.length);
    a = Math.floor(a);
    a=a.toString();
    var lastThree = a.substring(a.length-3);
    var otherNumbers = a.substring(0,a.length-3);
    if(otherNumbers != '')
    lastThree = ',' + lastThree;
    var resRecovery = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;
}
*/
	/*Number to Words*/

/*$('#assessedImpactValue').keyup(function (event) {
$(this).val(function (index, value) {
return value
.replace(/\D/g, '')
.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
;
});
});*/

	/*Date Picker*/
	$(document).ready(function() {

		$('#incidentIdentificationDate').datetimepicker({
			closeOnDateSelect: false,
			closeOnTimeSelect: true,
			maxDate: new Date(),
			format: 'DD/MM/YYYY',
			onChangeDateTime: function(dp, $input) {

			}
		});

	});
	/*Date Picker*/

	/*APPROVE INCIDENT*/

	$("#submitIncident").click(function() {

		var actionName = $(this).attr("name");

		xValue = $("#assessedImpactValue").val().replaceAll(',', '');

		if ($('#incidentForm').valid()) {

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

			incidentIdentificationDate = $("#incidentIdentificationDate").val();
			var incidentRecordDate = $("#incidentRecordDate").val();

			var incidentString = '';

			if ($('#sourceName').val() == "rejectedIncident") {

				incidentString = "{\n" +
					"    \"incidentId\": \"" + $("#incidentId").val() + "\",\n" +
					"    \"incidentName\":\"" + $("#incidentName").val() + "\",\n" +
					"    \"employeeId\":\"" + $("#employeeId").val() + "\",\n" +
					"    \"sourceName\":\"" + $("#sourceName").val() + "\",\n" +
					"    \"actionName\":\"" + actionName + "\",\n" +
					"    \"filedetails\":" + filedetails + ",\n" +
					"    \"incidentDescription\":\"" + $("#incidentDescription").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
					"    \"primaryLossEvent\":\"" + $("#primaryLossEvent").val() + "\",\n" +
					"    \"secondaryLossEvent\":\"" + $("#secondaryLossEvent").val() + "\",\n" +
					"    \"department\":\"" + $("#deptName").val() + "\",\n" +
					"    \"operatingOfcLocation\":\"" + $("#OperatingOfcLocation").val() + "\",\n" +
					"    \"incidentReportingPerson\":\"" + $("#incidentReportingPerson").val() + "\",\n" +
					"    \"assessedImpactValue\":\"" + xValue + "\",\n" +
					"    \"phoneNumber\":\"" + $("#phoneNumber").val() + "\",\n" +
					"    \"emailId\":\"" + $("#emailId").val() + "\",\n" +
					"    \"casesReportedTo\":\"" + $("#caseReported").val() + "\",\n" +
					"\"commentDto\":{\"comment\":\"" + $("#incidentComment").val().replace(/(\r\n|\n|\r)/gm, "") + "\"}," +
					"    \"incidentIdentificationDate\":\"" + incidentIdentificationDate + "\",\n" +
					"    \"incidentRecordDate\":\"" + incidentRecordDate + "\"\n" +
					"}";


			} else if ($('#sourceName').val() == "create") {

				incidentString = "{\n" +
					"    \"incidentId\": \"" + $("#incidentId").val() + "\",\n" +
					"    \"incidentName\":\"" + $("#incidentName").val() + "\",\n" +
					"    \"employeeId\":\"" + $("#employeeId").val() + "\",\n" +
					"    \"sourceName\":\"" + $("#sourceName").val() + "\",\n" +
					"    \"actionName\":\"" + actionName + "\",\n" +
					"    \"filedetails\":" + filedetails + ",\n" +
					"    \"incidentDescription\":\"" + $("#incidentDescription").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
					"    \"primaryLossEvent\":\"" + $("#primaryLossEvent").val() + "\",\n" +
					"    \"secondaryLossEvent\":\"" + $("#secondaryLossEvent").val() + "\",\n" +
					"    \"department\":\"" + $("#deptName").val() + "\",\n" +
					"    \"operatingOfcLocation\":\"" + $("#OperatingOfcLocation").val() + "\",\n" +
					"    \"incidentReportingPerson\":\"" + $("#incidentReportingPerson").val() + "\",\n" +
					"    \"assessedImpactValue\":\"" + xValue + "\",\n" +
					"    \"phoneNumber\":\"" + $("#phoneNumber").val() + "\",\n" +
					"    \"emailId\":\"" + $("#emailId").val() + "\",\n" +
					"    \"casesReportedTo\":\"" + $("#caseReported").val() + "\",\n" +
					"\"commentDto\":{\"comment\":\"" + $("#incidentComment").val().replace(/(\r\n|\n|\r)/gm, "") + "\"}," +
					"    \"incidentIdentificationDate\":\"" + incidentIdentificationDate + "\",\n" +
					"    \"incidentRecordDate\":\"" + incidentRecordDate + "\"\n" +
					"}";

			}


			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(reverseText(passphrase), incidentString);
			$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
			$("#incidentForm").submit();

		}

	});
	/*APPROVE INCIDENT*/

	/*form validate*/
	$(function() {
		$('#incidentForm').validate({
			rules: {
				incidentName: {
					required: true
				},
				incidentDescription: {
					maxlength: 3000,
					required: true
				},
				department: {
					required: true
				},
				OperatingOfcLocation: {
					required: true
				},
				/*assessedImpactValue: {
					required: true
				},*/

				incidentIdentificationDate: {
					required: true
				},
				incidentRecordDate: {
					required: true
				},

			},
			messages: {
				incidentName: {
					required: "Please Enter Incident Name",
				},
				incidentDescription: {
					required: "Please Enter Incident Description",
				},
				department: {
					required: "Please Select Department",
				},
				OperatingOfcLocation: {
					required: "Please Select Operating Office Location",
				},
				/*assessedImpactValue: {
					required: "Please Enter Assessed Impact in terms of Value",
				},*/

				incidentIdentificationDate: {
					required: "Please Select Incident Identification Date",
				},
				incidentRecordDate: {
					required: "Please Select Incident Record Date",
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



	/*Text Area expansion based on Data input */
	$(document).one('focus.form-control', 'textarea.form-control', function() {
		var savedValue = this.value;
		this.value = '';
		this.baseScrollHeight = this.scrollHeight;
		this.value = savedValue;
	}).on('input.form-control', 'textarea.form-control', function() {
		var minRows = this.getAttribute('data-min-rows') | 0, rows;
		this.rows = minRows;
		rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
		this.rows = minRows + rows;
	});
	/*Text Area expansion based on Data input */






	/*Audit trail */

	if ($("#sourceName").val() == "rejectedIncident") {
		$('.viewAuditTrail').click(function() {

			var incidentId = $("#incidentId").val();
			var pageValJson = "{\"activityImpactTblKey\":"
				+ "\"" + incidentId + "\"}";
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
	}
/*Audit trail */





















