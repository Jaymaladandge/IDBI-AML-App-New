/*GLOBAL VARIABLE*/
var incidentIdArray = [];
var whetherInsuredStatus = false;
var customerImpactedStatus = false;
var regulatoryImpactStatus = false;
var deptId = $("#deptId").val()
var recordDate = $("#incidentRecordDate").val();
var startDate = "";
var xValue = 0;
var tempEvent;
/*GLOBAL VARIABLE*/

/*two decimals*/
/*$(".two-decimals").change(function() {
	this.value = parseFloat(this.value).toFixed(2);
});*/
/*two decimals*/

/*Loader*/
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
/*Loader*/

/*Initialize Select2 Elements*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});
/*Initialize Select2 Elements*/

/*$(function() {
	$(".fileTable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [4, 5]
		}],
		"lengthMenu": [5, 10, 25, 50, 75, 100],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#filedetails_wrapper .col-md-12:eq(0)');
});*/


/*cancel Modal*/
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this);
	$('a.target').attr('href', recipient);

});

/*cancel Modal*/


/*AJAX CALL*/
$('#viewLink').click(function() {
	
		if($("#caseReportedTo").val() ==""){
		toastr.error("Value Cannot be Empty");
	}else{
		
		var searchParam = "GET";
	var value = "{\"searchParam\":" + "\"" + searchParam + "\",\n"
		+ "\"incidentId\":\"" + $("#incidentId").val() + "\",\n"
		+ "\"departmentId\":\"" + deptId + "\"}";

	var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), value);
	var pageValJson = ciphertext + ':~:' + passphrase;

	// ajax call
	$.ajax({
		url: 'linkIncidentList',
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
		success: function(response) {
			setTimeout(function() {
				document.getElementById('interactive');
			}, 1000);

			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);

			console.log(obj);
			console.log(obj.incidentList);
			var incidentList = obj.incidentList;

			incidentList.forEach(function(items) {

				if (items.incidentId) {

					$("<tr role='row' class='odd' id='row_id'><td><input type='checkbox' name='incidentId' title='" + items.incidentName + "~" + items.incidentDescription + "' rel='" + items.incidentDescription + "' value='" + items.incidentId + "' id='" + items.incidentId + "'>"
					+ "</td><td><a href='#' class='text-blue' id='"+ items.incidentId + "' onclick='viewModal(this.id)'>" 
						+ items.incidentId
						+ "</td><td><span name='incidentName' class='textCapitalize'>"
						+ items.incidentName
						+ "</td><td><span name='incidentDescription' value='" + items.incidentDescription + "' class='textCapitalize description'>"
						+ items.incidentDescription
						+ "</span></td>"
						+ "</tr>").appendTo(".incidentListView");
				}
			});
			$("#incidentListView").DataTable({
				"columnDefs": [{
					orderable: false,
					targets: [0]
				}],
				"order": [1, "desc"],
				"responsive": false,
				"lengthMenu": [10, 20, 30, 40],
				"autoWidth": true,
				"searching": false,
				"destroy": true,
				"fixedHeader": true,
				//"buttons": ["csv", "excel", "pdf", "print"],
				"language": {
					"emptyTable": "No Data Available"
				},

			}).buttons().container().appendTo(
				'#incidentListView_wrapper .col-md-6:eq(0)');

			$('#incidentListView').DataTable().draw();

		},
		error: function(xhr, status, error) {
			toastr.success('Some Error Occured');
		}
	});
	$('.incidentListView').show();
	
	
	stepper.next();
	}
	
});


$('#closeIncidentModal').click(function() {
	$('.incidentListView tr:gt(0)').remove();
});

/*AJAX CALL*/


/*VALIDATE VERIFIER PAGE*/

function validateSecond() {


	if ($('#verifyIncidentForm').valid()) {
		stepper.next();
	}
}
/*VALIDATE VERIFIER PAGE*/

/*DATA TABLE TO OTHER TABLE*/
$('#link').click(function() {
	$('input[name="incidentId"]:checked').each(function() {
		var id = this.value;
		var addFlg = true;
		$('.incidentdetails tr').each(
			function() {
				var rowid = $(this).find('td:eq(0)').text();
				if (rowid == id) {
					addFlg = false;
				}
			});
		incidentIdArray.push(id);
		var name = this.title.split('~')[0];
		var description = this.title.split('~')[1];
		if (addFlg) {
			$('#' + id).each(function() {
				$('.incidentdetails tr:last').after('<tr id=' + id + '><td>'
					+ id
					+ '</td><td>'
					+ name
					+ '</td><td>'
					+ description
					+ '</td></tr>');
			});
		}

	});

	/*var seen = {};
			$('.incidentdetails tr').each(function() {
				var txt = $(this).text();
				if (seen[txt])
					$(this).remove();
				else
					seen[txt] = true;
			});*/

	var rowCount = $('.incidentdetails tr').length;
	if (rowCount == 1) {
		$('#linkedIncident').hide();
	} else if (rowCount > 1) {
		$('#incidentdetails').show();
		$('#linkedIncident').show();
	}
	//$('#incidentdetails').show();
});

$(".incidentdetails").on("click", "#closerow", function() {
	$(this).closest("tr").remove();
});
/*DATA TABLE TO OTHER TABLE*/

$(document).ready(function() {

	var rowCount = $('.incidentdetails tr').length;
	if (rowCount == 1) {
		$('#linkedIncident').hide();
	} else if (rowCount > 1) {
		$('#linkedIncident').show();
	}
})




/*BS-Stepper Init*/
$(document).ready(function() {
	var stepper = new Stepper($('.bs-stepper')[0])
});
document.addEventListener('DOMContentLoaded', function() {
	window.stepper = new Stepper(document.querySelector('.bs-stepper'))
});
/*BS-Stepper Init*/


/*Comma Separated Numbers*/

/*function price_in_words(price1) {
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


$('#recoverableValue').keyup(function(event) {

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
	});*/




$("#recoverableValue").on('keypress', function(event) {

	//Disable special character except '.'
	var regex = new RegExp("^[0-9]+$");
	var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
	if ('.' != key) {
		if (!regex.test(key)) {
			event.preventDefault();
			return false;
		}
	}
	var x = $("#recoverableValue").val();
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
	$("#recoverableValue").val(res);
});

$("#recoverableValue").on('keyup', function(event) {

	var flg = false;
	x = $("#recoverableValue").val();
	var newX = $("#recoverableValue").val();

	if (x.indexOf('.') > 0) {
		flg = true;
	}
	xValue = $("#recoverableValue").val().replaceAll(',', '');
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
		if (y != '')
			var str = str1 + ' Rupees and ' + inWord(y) + ' Paisa Only';

	} else {
		var str = str1 + 'Rupees Only';
	}
	$('#showWordsAmt').text(str);
});


// assessment value

$(document).ready(function() {


	var flg = false;
	x = $("#assessedImpactValueH").val();
	var newX = $("#assessedImpactValueH").val();

	if (x.indexOf('.') > 0) {
		flg = true;
	}
	xValue = $("#assessedImpactValueH").val().replaceAll(',', '');
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
		if (y != '') {
			var str = str1 + ' Rupees and ' + inWord(y) + ' Paisa Only';
		} else if (y == '' || y == '0') {
			var str = str1 + ' Rupees and ' + 'Zero Paisa Only';
		}
	} else {
		var str = str1 + 'Rupees Only';
	}
	$('#showWordAmt').text(str);


})




/*Comma Separated Numbers*/

/*Number to Words*/
function inWord(num) {
	//alert('NUM'+num);
	var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	if ((num = num.toString()).length > 15) return 'overflow';
	n = ('000000000000000' + num).substr(-15).match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
	//alert(n);
	if (!n) return;
	var str = '';
	str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Lakh ' : '';
	str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Thousand ' : '';
	str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Hundred ' : '';
	str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Crore ' : '';
	str += (n[5] != 0) ? (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Lakh ' : '';
	str += (n[6] != 0) ? (a[Number(n[6])] || b[n[6][0]] + ' ' + a[n[6][1]]) + 'Thousand ' : '';
	str += (n[7] != 0) ? (a[Number(n[7])] || b[n[7][0]] + ' ' + a[n[7][1]]) + 'Hundred ' : '';
	str += (n[8] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[8])] || b[n[8][0]] + ' ' + a[n[8][1]]) + '' : '';
	return str;
}
/*Number to Words*/


/*Number to Words for Assessed Impact Value*/
/*$(document).ready(function() {
	var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	inWords($('#assessedImpactValueH').val());
	function inWords(num) {
		if ((num = num.toString()).length > 9) return 'overflow';
		n = ('000000000000000' + num).substr(-15).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return;
		var str = '';
		str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
		str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
		str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
		str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
		str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
		
		$('#showWordAmt').text(str)
	}
});*/
/*Number to Words for Assessed Impact Value*/


/*Search method*/
function searchData() {
	var searchParam = $('#dimension').find(":selected").val().replace(
		/(\r\n|\n|\r)/gm, "");
	var searchValue = $('#searchcriteria').val().toUpperCase().replace(
		/(\r\n|\n|\r)/gm, "");
	if (searchParam == '') {
		toastr.info('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.info('Please Add Some Value For Search');
	} else {
		if (searchParam == 'incidentStatus') {
			if (searchValue.includes('CREATE')) {
				searchValue = 'D';
			} else {
				searchValue = searchValue.charAt(0);
				if (searchValue == 'D') {
					searchValue = 'X';
				} else if (searchValue == 'P') {
					searchValue = 'D';
				}
			}
		}
		//var sortValue = $('#sorting').find(":selected").val();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam
			+ "\",\"searchValue\":\"" + searchValue+ "\"}";
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$("#searchForm").submit();
	}
}
$('#searchcriteria').keypress(function(event) {
	if (event.keyCode === 10 || event.keyCode === 13) {
		event.preventDefault();
	}
});
/*Search method End*/

/*COMMA SEPARATED AMOUNT*/
$(document).ready(function() {
	var x = $('#assessedImpactValueH').val();
	x = x.toString();
	var afterPoint = '';
	if (x.indexOf('.') > 0)
		afterPoint = x.substring(x.indexOf('.'), x.length);
	x = Math.floor(x);
	x = x.toString();
	var lastThree = x.substring(x.length - 3);
	var otherNumbers = x.substring(0, x.length - 3);
	if (otherNumbers != '')
		lastThree = ',' + lastThree;
	var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
	$('#assessedImpactValue').val(res);
});
/*COMMA SEPARATED AMOUNT*/

$(document).ready(function() {
	if (whetherInsuredStatus == true) {
		$("#whetherInsuredStatus").empty();
		$("#whetherInsuredStatus").append("Yes");
	} else if (whetherInsuredStatus == false) {
		$("#whetherInsuredStatus").empty();
		$("#whetherInsuredStatus").append("No");
	}
	if (customerImpactedStatus == true) {
		$("#customerImpactedStatus").empty();
		$("#customerImpactedStatus").append("Yes");
	} else if (customerImpactedStatus == false) {
		$("#customerImpactedStatus").empty();
		$("#customerImpactedStatus").append("No");
	}
	if (regulatoryImpactStatus == true) {
		$("#regulatoryImpactStatus").empty();
		$("#regulatoryImpactStatus").append("Yes");
	} else if (regulatoryImpactStatus == false) {
		$("#regulatoryImpactStatus").empty();
		$("#regulatoryImpactStatus").append("No");
	}
})

/*FOR TOGGLE SWITCH*/

$(document).ready(function() {
	$("#whetherInsured").on('change', function() {
		if ($(this).is(':checked')) {
			whetherInsuredStatus = $(this).is(':checked');
			whetherInsuredStatus = true;
		} else {
			whetherInsuredStatus = false;
		}
		if (whetherInsuredStatus == true) {
			$("#whetherInsuredStatus").empty();
			$("#whetherInsuredStatus").append("Yes");
		} else if (whetherInsuredStatus == false) {
			$("#whetherInsuredStatus").empty();
			$("#whetherInsuredStatus").append("No");
		}
	});
	$("#customerImpacted").on('change', function() {
		if ($(this).is(':checked')) {
			customerImpactedStatus = $(this).is(':checked');
			customerImpactedStatus = true;
		} else {
			customerImpactedStatus = false;
		}
		if (customerImpactedStatus == true) {
			$("#customerImpactedStatus").empty();
			$("#customerImpactedStatus").append("Yes");
		} else if (customerImpactedStatus == false) {
			$("#customerImpactedStatus").empty();
			$("#customerImpactedStatus").append("No");
		}
	});
	$("#regulatoryImpact").on('change', function() {
		if ($(this).is(':checked')) {
			regulatoryImpactStatus = $(this).is(':checked');
			regulatoryImpactStatus = true;
		} else {
			regulatoryImpactStatus = false;
		}
		if (regulatoryImpactStatus == true) {
			$("#regulatoryImpactStatus").empty();
			$("#regulatoryImpactStatus").append("Yes");
		} else if (regulatoryImpactStatus == false) {
			$("#regulatoryImpactStatus").empty();
			$("#regulatoryImpactStatus").append("No");
		}
	});
});

/*FOR TOGGLE SWITCH*/

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



/*CHECK RECOVERABLE VALUE LESS THAN ASSESSMENT VALUE*/
$("#recoverableValue").focusout(function() {
	var assessmentValue = $("#assessedImpactValueH").val();

	if (parseFloat(xValue) > parseFloat(assessmentValue)) {

		toastr.error("Recoverable Value Cannot be greater than Assessment Value");
	}
})
/*CHECK RECOVERABLE VALUE LESS THAN ASSESSMENT VALUE*/


$(document).ready(function() {
	
	var optionValueP = $('#losseventPrimary').val();
	var optionValueS = $('#losseventSecondary').val();
	if(optionValueP!=null ){
	if(optionValueS!=null || optionValueS==''){	
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
		if ($.trim(strValue) !== $.trim(optionValueP) && $.trim(strValue) !== $.trim(optionValueS)) {
			secondaryArray.push(categoryArray[i]);
		}
	}
	for (var i = 0; i < secondaryArray.length; i++) {
		$('#secondaryLossEvent').append('<option value="">Select</option> <option value="' + secondaryArray[i].replaceAll('~', ', ') + '" >' + secondaryArray[i].replaceAll('~', ', ') + '</option>');
	}
		
	}	
	}
});


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

/*form submit*/
$("#approve").click(function() {
	
	
	var whetherInsured;
	var customerImpacted;
	var regulatoryImpact;
	var actionName = $(this).attr("name");
	if ($('#verifyIncidentForm').valid()) {
		if (whetherInsuredStatus == true) {
			whetherInsured = 'Y'
		} else {
			whetherInsured = 'N'
		}
		if (customerImpactedStatus == true) {
			customerImpacted = 'Y'
		} else {
			customerImpacted = 'N'
		}
		if (regulatoryImpactStatus == true) {

			regulatoryImpact = 'Y'
		} else {
			regulatoryImpact = 'N'
		}

		var filedetails = "[\n";
			if ($('#filedetails tr').length > 0) {
				$('#filedetails > tbody  > tr')
					.each(
						function(index, value) {
							var splitvalue = $(this)
								.find('td:eq(0)')
								.text().split('.');
							var sizesplit = $(this)
								.find('td:eq(1)')
								.text().split(' ');
							var oldfileFlg = $(this)
								.find('td:eq(4)')
								.text();
							if (oldfileFlg == '') {
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
									+ "    \"fileType\": \""
									+ splitvalue[1]
									+ "\"\n"
									+ " },";

							}
						});
				filedetails = filedetails.substring(0,
					filedetails.length - 1);
			}
			filedetails = filedetails + "]";

		var incidentString = "{\n" +
			"    \"incidentId\": \"" + $("#incidentId").val() + "\",\n" +
			"    \"incidentName\":\"" + $("#incidentName").val() + "\",\n" +
			"    \"assessedImpactValue\":\"" + $("#assessedImpactValueH").val() + "\",\n" +
			"    \"additionalBusinessUnit\":\"" + $("#additionalBusinessUnit").val() + "\",\n" +
			"    \"actionName\":\"" + actionName + "\",\n" +
			"    \"filedetails\":" + filedetails + ",\n" +
			"    \"previousIncidentReference\":" + '"' + incidentIdArray + '"' + ",\n" +
			"    \"incidentRecordDate\":\"" + $("#incidentRecordDate").val() + "\",\n" +
			"    \"recoverableValue\":\"" + xValue + "\",\n" +
			"    \"recoveryStatus\":\"" + $("#recoveryStatus").val() + "\",\n" +
			"    \"primaryLossEvent\":\"" + $("#primaryLossEvent").val() + "\",\n" +
			"    \"secondaryLossEvent\":\"" + $("#secondaryLossEvent").val() + "\",\n" +
			"    \"incidentType\":\"" + $("#incidentType").val() + "\",\n" +
			"    \"incidentImpactLevel\":\"" + $("#incidentImpactLevel").val() + "\",\n" +
			"    \"casesReportedTo\":\"" + $("#caseReportedTo").val() + "\",\n" +
			"\"commentDto\":{\"comment\":\"" + $("#incidentComment").val() + "\"}," +
			"    \"whetherInsured\":\"" + whetherInsured + "\",\n" +
			"    \"customerImpacted\":\"" + customerImpacted + "\",\n" +
			"    \"regulatoryImpact\":\"" + regulatoryImpact + "\"}";


		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase), incidentString);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);

		if (parseFloat(xValue) <= parseFloat($("#assessedImpactValueH").val())) {
			$("#verifyIncidentForm").submit();
		} else {
			toastr.error("Recoverable Value must be less than Assessment Value before Submitting the Form");
		}
	}
});
/*form submit*/


$("#reject").click(function() {

	var actionName = $(this).attr("name");
	var filedetails = "[\n";
			if ($('#filedetails tr').length > 0) {
				$('#filedetails > tbody  > tr')
					.each(
						function(index, value) {
							var splitvalue = $(this)
								.find('td:eq(0)')
								.text().split('.');
							var sizesplit = $(this)
								.find('td:eq(1)')
								.text().split(' ');
							var oldfileFlg = $(this)
								.find('td:eq(4)')
								.text();
							if (oldfileFlg == '') {
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
									+ "    \"fileType\": \""
									+ splitvalue[1]
									+ "\"\n"
									+ " },";

							}
						});
				filedetails = filedetails.substring(0,
					filedetails.length - 1);
			}
			filedetails = filedetails + "]";

	var reason = $('#reason').val();
	reason = reason.replace(/[\t\n]+/g, ' ');
	if (reason == '') {
		$('span[id^="reason-error"]').remove();
		$('#reason').addClass('is-invalid');
		$('#reason')
			.after(
				'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
	} else if (reason.length < 10) {
		$('span[id^="reason-error"]').remove();
		$('#reason').addClass('is-invalid');
		$('#reason')
			.after(
				'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
	} else {


		var incidentString = "{\n" +
			"\"incidentId\": \"" + $("#incidentId").val() + "\",\n" +
			" \"actionName\":\"" + actionName + "\",\n" +
			"\"commentDto\":{\"comment\":\"" + reason + "\"}," +
			"\"filedetails\":" + filedetails + "}";



		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase), incidentString);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$("#verifyIncidentForm").submit();
	}


});
/*form validate*/

$(function() {

	$('#verifyIncidentForm').validate({
		rules: {
			businessUnit: {
				required: true
			},
			additionalBusinessUnit: {
				required: true
			},
			businessSegment: {
				required: true
			},
			recoverableValue: {
				required: true
			},
			recoveryStatus: {
				required: true
			},
			primaryLossEvent: {
				required: true
			},
			incidentType: {
				required: true
			},
			incidentImpactLevel: {
				required: true
			},
			startDate: {
				required: true
			},

		},
		messages: {

			businessUnit: {
				required: "Please Select Business Unit",
			},
			additionalBusinessUnit: {
				required: "Please Select Additional Business Unit",
			},
			businessSegment: {
				required: "Please Select Business Segment",
			},
			recoverableValue: {
				required: "Please Enter Recoverable Value",
			},
			recoveryStatus: {
				required: "Please Select Recovery Status",
			},
			primaryLossEvent: {
				required: "Please Select Primary Loss Event Category",
			},
			incidentType: {
				required: "Please Select Incident Type",
			},
			incidentImpactLevel: {
				required: "Please Select Incident Impact Level",
			},
			startDate: {
				required: "Please Select Start Date",
			},

		},

		errorElement: 'span',
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback');
			element.closest('.form-group')
				.append(error);
		},
		submitHandler: function(form) {
			document.getElementById('load').style.visibility = "visible";
			form.submit();
		}
	});

});

/*form validate*/


/*file upload*/
$(document).ready(function() {
	
	var rowCount = $('.uploadTable tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#filedetails').hide();
	}else{
		$('#filedetails').show();
	}
	
})
	
$(".uploadTable").on("click", "#closerow", function() {

	var rowCount = $('.uploadTable tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#filedetails').hide();
	}
	$(this).closest("tr").remove();
});

var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
		
		var flg = true;
		var userName = $('#userName').val();
		$('.uploadTable tr').each(function() {
			var fName = $(this).find('td:eq(0)').text();
			console.log('fName ' + fName + ' filename ' + filename);
			if(fName==="No Data Available" || fName==="No data available in table"){
				flg = false;
			}
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
					+ userName
					+ '</td><td class="text-right py-0 align-middle"></td><td class="project-actions text-right"><a class="btn btn-danger btn-sm" id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
	}
}

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
/*Audit trail */


/*View Incident Modal*/
//$('a.viewIncident').click(function() {
function viewModal(incidentId) {	
	var incidentId = incidentId;
	//$('#paramId').val(bmId);
	var value = "{\"incidentId\":" + "\"" + incidentId
		+ "\"}";
	var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), value);
	var pageValJson = ciphertext + ':~:' + passphrase;
	//document.getElementById('load').style.visibility = "visible";
	// ajax call
	$.ajax({
		url: 'viewIncident',
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
		success: function(response) {
			setTimeout(function() {
				document.getElementById('interactive');
				//document.getElementById('load').style.visibility = "hidden";
			}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			
			
	if(obj.assessedImpactValue != null){
	var x=obj.assessedImpactValue;
    x=x.toString();
    var afterPoint = '';
    if(x.indexOf('.') > 0)
    afterPoint = x.substring(x.indexOf('.'),x.length);
    x = Math.floor(x);
    x=x.toString();
    var lastThree = x.substring(x.length-3);
    var otherNumbers = x.substring(0,x.length-3);
    if(otherNumbers != '')
    lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;
}

	//recovery amount
	
	if(obj.recoverableValue != null){
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

	//remediation gross loss
	/*var b=remDto.grossLossRemediation;
			    b=b.toString();
			    var afterPoint = '';
			    if(b.indexOf('.') > 0)
			    afterPoint = b.substring(b.indexOf('.'),b.length);
			    b = Math.floor(b);
			    b=b.toString();
			    var lastThree = b.substring(b.length-3);
			    var otherNumbers = b.substring(0,b.length-3);
			    if(otherNumbers != '')
			    lastThree = ',' + lastThree;
			    var resgrossloss = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;*/
	
	
	
		
		var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	inWords(obj.assessedImpactValue);
			function inWords(num) {
		if ((num = num.toString()).length > 9) return 'overflow';
		n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return;
		var str = '';
		str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
		str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
		str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
		str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
		str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
		$('#showWordAmt').text(str)
	}
	
	
	/*var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];*/
	/*inWords(obj.recoverableValue);
	
	function inWords(num1) {
		if ((num1 = num1.toString()).length > 9) return 'overflow';
		n = ('000000000' + num1).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return;
		var str1 = '';
		str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
		str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
		str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
		str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
		str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
		$('#showRecvrAmt').text(str1)
	}*/
	
	
			if(obj != null ){
				
			$('#incidentIdM').val(obj.incidentId);
			$('#incidentStatusM').val(obj.incidentStatus);
			$('#incidentNameM').val(obj.incidentName);
			$('#incidentReportingPersonM').val(obj.incidentReportingPerson);
			$('#incidentDescriptionM').val(obj.incidentDescription);
			$('#operatingOfcLocationM').val(obj.operatingOfcLocation);
			$('#incidentReportingPersonM').val(obj.incidentReportingPerson);
			$('#assessedImpactValueM').val(res);
			$('#departmentM').val(obj.department);
			$('#incidentIdentificationDateM').val(obj.incidentIdentificationDate);
			$('#incidentRecordDateM').val(obj.incidentRecordDate);
			$('#incidentTypeM').val(obj.incidentType);
			$('#incidentImpactLevelM').val(obj.incidentImpactLevel);
			$('#primaryLossEventM').val(obj.primaryLossEvent.replaceAll('~',', '));
			$('#secondaryLossEventM').val(obj.secondaryLossEvent.replaceAll('~',', '));
			$('#recoverableValueM').val(resRecovery);
			
			$('#recoveryStatusM').val(obj.recoveryStatus);
			$('#additionalBusinessUnitM').val(obj.additionalBusinessUnit);
			
		}
			
			/*$('#whetherInsuredM').val(obj.whetherInsured);
			$('#customerImpactedM').val(obj.customerImpacted);
			$('#regulatoryImpactM').val(obj.regulatoryImpact);*/
			if(obj.incidentRemediationLinkDto != null && obj.incidentStatus == 'Pending Closure' ||  obj.incidentStatus == 'Closed' ){
				
			var remDto = obj.incidentRemediationLinkDto;
			$('#rootCauseIncidentM').val(remDto.rootCauseIncident);
			$('#rootCauseTypeM').val(remDto.rootCauseType);
			$('#rootCauseDescriptionM').val(remDto.rootCauseDescription);
			$('#grossLossRemediationM').val(remDto.grossLossRemediation);
			$('#netLossRemediationM').val(remDto.netLossRemediation);
			
			$('#remediateDiv').show();
			
			}else if(obj.incidentRemediationLinkDto == null && obj.incidentStatus != 'Pending Closure'){
				
				$('#remediateDiv').hide();
			}
			
			//console.log(obj.incidentFinanceList);
			if(obj.incidentFinanceList != null){
			var financeDto = obj.incidentFinanceList;
			if(financeDto.length > 0){
			$(".grossLossTable > #tbodyR").empty();
			$(".recoveryLossTable > #tbodyT").empty();	
			financeDto.forEach(function(items) {
				/*alert(items.type);
				alert(items.incidentId);
				alert(items.amount);
				alert(items.category);*/
				if(items.category=='GL'){
				$('<tr><td>'
					+ items.date
					+ '</td><td>'
					+ items.type
					+ '</td><td>'
					+ items.amount
					+ '</td>'
				+'</tr>').appendTo(".grossLossTable > #tbodyR");
			
			} if(items.category=='RL'){
				$('<tr><td>'
					+ items.date
					+ '</td><td>'
					+ items.type
					+ '</td><td>'
					+ items.amount
					+ '</td>'
				+'</tr>').appendTo(".recoveryLossTable > #tbodyT");
			}
			
			
			});
			}
			}
			
			if(obj.aplMasterDto!=null){
				
				var aplMaster = obj.aplMasterDto;
				console.log(aplMaster);
				$('<tr><td>'
					+ aplMaster.actionId
					+ '</td><td>'
					+ aplMaster.actionName
					+ '</td><td>'
					+ aplMaster.actionOwner
					+ '</td><td>'
					+ aplMaster.actionRecordStatus
					+ '</td><td>'
					+ aplMaster.actionUpdateFrequency
					+ '</td><td>'
					+ aplMaster.actionCompPercent
					+ '</td><td>'
					+ aplMaster.actionEcDate
					+ '</td>'
				+'</tr>').appendTo(".actionplantable > #actPlanBody");
				
				
				$('#actionDiv').show();
			} else{
				
				$('#actionDiv').hide();
			}
			
			if(obj.incidentClosureLinkDto!=null && obj.incidentStatus == 'Closed'){
				
				var closureList = obj.incidentClosureLinkDto;
				$('#businessSegmentM').val(closureList.businessSegment);
				$('#riskInRiskRegisterM').val(closureList.riskInRiskRegister);
				$('#controlInRiskRegisterM').val(closureList.controlInRiskRegister);
				$('#closureReasonM').val(closureList.closureReason);
				
				if(obj.incidentClosureLinkDto.checkList.length>0){
				obj.incidentClosureLinkDto.checkList.forEach(function(items) {
				if(items.checkListResponse != null){
					$('<tr><td>'
					+ items.checkListId
					+ '</td><td>'
					+ items.checkListDescription
					+ '</td><td>'
					+ items.checkListResponse
					+ '</td>'
				+'</tr>').appendTo(".checklistView > #tbodyC");
				}else if(items.checkListResponse == null){
					
					$('<tr><td>'
					+ items.checkListId
					+ '</td><td>'
					+ items.checkListDescription
					+ '</td><td>'
					+ "No Value"
					+ '</td>'
				+'</tr>').appendTo(".checklistView > #tbodyC");
					
				}
				});
				}	
				$('#closureDiv').show();
			} else if(obj.incidentClosureLinkDto == null){
				

				$('#closureDiv').hide();
			}
			
			var fileFlg = true;
			obj.filedetails.forEach(function(item) {
				fileFlg = false;
				$('#filedetails tr:last').after(
					'<tr><td>'
					+ item.fileName
					+ '</td>'
					+ '<td>'
					+ item.fileSize
					+ '</td>'
					+ '<td>'
					+ item.uploadTimestamp
					+ '</td>'
					+ '<td class="text-capitalize">'
					+ item.uploadedBy
					+ '</td>'
					+ '<td><a name=' + item.fileName + ' href="#"'
					+ ' class="btn btn-info downloadfile"><i'
					+ ' class="fas fa-download"></i></a></td></tr>');
			});
			
		
			
			
			if (fileFlg) {
				$('#filedetails').hide();
			} else {
				var seen = {};
				$('#filedetails tr').each(function() {
					var txt = $(
						this)
						.text();
					if (seen[txt])
						$(this)
							.remove();
					else
						seen[txt] = true;
				});
				$('#filedetails').show();
			}
			$('#viewIncidentmodal').modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.success('Some Error Occured');
		}
	});
}
/*View Incident Modal*/








