/*Global Variable*/
var riskIdArray;
var grossLossTable;
var recoveryLossTable;
var incidentReportedToLawStatus=false;
var grossVal;
var netVal;
var grosstotal = 0;
var nettotal = 0;
var incidentLoss=0;

/*Global Variable*/

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
});
$("#today").text(moment(new Date()).format('DD/MM/YYYY'));
/*loader*/

/*cancel Modal*/
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this);
	$('a.target').attr('href', recipient);

});

/*cancel Modal*/


/*BS-Stepper Init*/
/*$(document).ready(function() {
	var stepper = new Stepper($('.bs-stepper')[0])
});*/

document.addEventListener('DOMContentLoaded', function() {
	window.stepper = new Stepper(document.querySelector('.bs-stepper'))
});
/*BS-Stepper Init*/

//incidentdetails
$(document).ready(function() { 
	$("#incidentdetailsPrev").DataTable({
		"columnDefs": [{
			orderable: false,
			//targets: [4, 5]
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
		'#incidentdetailsPrev_wrapper .col-md-12:eq(0)');
});


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
		if(y!=''){
		if(y=='00'){
			
		var str = str1 + ' Rupees and Zero Paisa Only';
		}	else{
			
		var str = str1 + ' Rupees and ' + inWord(y)  + ' Paisa Only';
		}
		}
	}else{
		var str = str1  + 'Rupees Only';
	}
	$('#showWordAmt').text(str);
	
	
	
	//recoverable value
	var flg = false;
	x = $("#recoverableValueH").val();
	var newX = $("#recoverableValueH").val();

	if (x.indexOf('.') > 0) {
		flg = true;
	}
	xValue = $("#recoverableValueH").val().replaceAll(',', '');
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
		if(y!=''){
				
		if(y=='00'){
			
		var str = str1 + ' Rupees and Zero Paisa Only';
		}	else{
			
		var str = str1 + ' Rupees and ' + inWord(y)  + ' Paisa Only';
		}
		}
	}else{
		
		var str = str1  + 'Rupees Only';
	}
	$('#showWordsAmt').text(str);

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
/*$(document).ready(function() {

	var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	inWords($('#recoverableValueH').val());
	
	
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
		$('#showWordsAmt').text(str);
	}
});

$(document).ready(function() {
	var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	inWords($('#assessedImpactValueH').val());
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
		$('#showWordAmt').text(str);
	}
});*/
/*Number to Words*/


/*GROSS LOSS DYNAMIC DATA*/
$(document).ready(function() {

	// Denotes total number of rows
	var rowIdx = 0;

	// jQuery button click event to add a row
	$('#addBtn').on('click', function() {

		// Adding a row inside the tbody.
		$('#tbody').append(`<tr id="R${++rowIdx}">
		
			<td id=R ${++rowIdx} class="row-index text-center">

				<div class="input-group date ml-4" data-target-input="nearest"><input type="text" class="date_of_gross dateOfGross" placeholder="DD/MM/YYYY"/>
				 <div class="input-group-text"><i class="fa fa-calendar"></i></div></div>
																										
			</td>
			<td  id=R ${++rowIdx} class="row-index text-center">
			
			
			<textarea class="form-control form-control-sm lossDesc" name="typeOfLoss" id="Row ${rowIdx}" maxlength="3000" placeholder="Description Of Loss"></textarea>		
			
			</td>
			<td id=R ${++rowIdx} class="row-index text-center">
			
			<input class="form-control form-control-sm glamt rupee calglAmt" onblur="grossAmtCal()" type="text" name="lossAmount"  placeholder="Loss Amount" maxlength="16" id="Row${rowIdx}" />
			<span id="spanRow${rowIdx}"  name="words"></span>
			
			</td>
			
			<td class="text-center">
				<button class="btn btn-danger btn-sm remove"
				type="button"><i class="fa fa-window-close"></i></button>
				</td>
			</tr>`);
			
			
			//$(".glamt").each(function() { // or $(".total_price") if given a class
		   /*var nettotalvalue =$('.glamt').val();
			alert("netValue =" + nettotalvalue);
		    nettotalvalue += isNaN(nettotalvalue) || $.trim(nettotalvalue)=="" ? 0 : parseFloat(nettotalvalue); // or parseInt(val,10);
		 // });

		
		var x=nettotalvalue;
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
		    var responsenetTotal = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;
			alert(responsenetTotal);*/
			//$("#totalgrossloss").empty();
			//$("#totalgrossloss").append('<i class="fas fa-rupee-sign p-1"></i>');
			//$("#totalgrossloss").append(responsenetTotal);
			
			
	});
	
	//calgAmt
	/*if ($('#grossLossTable tr').length > 1) {
			$('#grossLossTable > #tbody  > tr').each(function(index, value) {*/
	//	$('body').on('focus', ".calglAmt", function() {	
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

$("#tbody").on("keyup", ".calglAmt", function(){
	//alert("Row Id "+ $('#row_0').val());
	id = this.id;
	
	var value = $('#'+id).val();
	//alert(" id = " + value );
	
	if (value.indexOf('.') > 0){
		var valueR = value.split('.')[0];
		var valueP = value.split('.')[1];
		 valueR.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
	}else{
		var valueP = ' Zero '; 
		var valueR = value;
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
	//$("#"+id).val(price_in_words(valueR) + ' Rupees And ' + x + ' Paise Only' );
	//var spId = $('.spnWord').attr('id');
	
	$('#'+'span'+id).text(price_in_words(valueR) + ' Rupees And ' + x + ' Paise Only' );
	} else {
	var moneys = money.replace(new RegExp(',', 'g'), '');
	var valueP = moneys.substring(moneys.length - 7, moneys.length);
	var croreValue = moneys.substr(0, moneys.length - 7);
	
	}
	//$('#'+id).val(value.replace(/\D/g, '').replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"));
	
});


			
	
	
	
	
	/*$(".calglAmt").blur(function(){
	
		var nettotalvalue =$('.calglAmt').val();
			alert("netValue =" + nettotalvalue);
		    nettotalvalue = isNaN(nettotalvalue) || $.trim(nettotalvalue)=="" ? 0 : parseFloat(nettotalvalue);

		var x=nettotalvalue;
		alert(x);
		    x=x.toString();
		    var afterPoint = '';
		    if(x.indexOf('.') > 0)
		    afterPoint = x.substring(x.indexOf('.'),x.length);
		    alert(x);
			x = Math.floor(x);
			alert(x);
		    x=x.toString();
			alert(x);
		    var lastThree = x.substring(x.length-3);
		    var otherNumbers = x.substring(0,x.length-3);
		    if(otherNumbers != '')
		    lastThree = ',' + lastThree;
		    var responsenetTotal = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;
			$("#totalgrossloss").empty();
			$("#totalgrossloss").append('<i class="fas fa-rupee-sign p-1"></i>');
			$("#totalgrossloss").append(responsenetTotal);
		
		
	});*/
	
	
	
	$('body').on('focus', ".date_of_gross", function() {
		$(this).datepicker({
			dateFormat: 'dd/mm/yy',
			maxDate: new Date()
		});
	});


	// jQuery button click event to remove a row.
	$('#tbody').on('click', '.remove', function() {

		// Getting all the rows next to the row
		// containing the clicked button
		var child = $(this).closest('tr').nextAll();

		// Iterating across all the rows
		// obtained to change the index
		child.each(function() {

			// Getting <tr> id.
			var id = $(this).attr('id');

			// Getting the <p> inside the .row-index class.
			var idx = $(this).children('.row-index').children('p');

			// Gets the row number from <tr> id.
			var dig = parseInt(id.substring(1));

			// Modifying row index.
			idx.html(`Row ${dig - 1}`);

			// Modifying row id.
			$(this).attr('id', `R${dig - 1}`);
		});

		// Removing the current row.
		$(this).closest('tr').remove();

		// Decreasing total number of rows by 1.
		rowIdx--;
	});
});

/*GROSS LOSS DYNAMIC DATA*/






/*RECOVERY LOSS DYNAMIC DATA*/

$(document).ready(function() {

	// Denotes total number of rows
	var rowIdx = 0;

	// jQuery button click event to add a row
	$('#add').on('click', function() {

		// Adding a row inside the tbody.
		$('#tbodyR').append(`<tr id="R${++rowIdx}">
			
			<td id=R ${++rowIdx} class="row-index text-center">
			<div class="input-group date ml-4" data-target-input="nearest"><input type="text" class="date_of_reco dateOfReco" placeholder="DD/MM/YYYY"/>
				 <div class="input-group-text"><i class="fa fa-calendar"></i></div></div>
			</td>
			
			<td  id=R ${++rowIdx} class="row-index text-center">
			
			<textarea class="form-control form-control-sm" name="typeOfRecovery" id="Row ${rowIdx}" maxlength="3000" placeholder="Description Of Recovery"></textarea>
			
			</td>
			<td id=R ${++rowIdx} class="row-index text-center">
			<input class="form-control form-control-sm amt rupee calRecoveryAmt" onblur="recoveryAmtCal()" type="text" name="lossAmount" placeholder="Recovery Amount" maxlength="16" id="Row${rowIdx}" />
			<span id="spanoneRow${rowIdx}"  name="words"></span>
			</td>
			
			<td class="text-center">
				<button class="btn btn-danger btn-sm removeR"
				type="button"><i class="fa fa-window-close"></i></button>
				</td>
			</tr>`);
			
			
			
	});


	$('body').on('focus', ".date_of_reco", function() {
		$(this).datepicker({
			dateFormat: 'dd/mm/yy',
			maxDate: new Date()
		});
	});


	// jQuery button click event to remove a row.
	$('#tbodyR').on('click', '.removeR', function() {

		// Getting all the rows next to the row
		// containing the clicked button
		var child = $(this).closest('tr').nextAll();

		// Iterating across all the rows
		// obtained to change the index
		child.each(function() {

			// Getting <tr> id.
			var id = $(this).attr('id');

			// Getting the <p> inside the .row-index class.
			var idx = $(this).children('.row-index').children('p');

			// Gets the row number from <tr> id.
			var dig = parseInt(id.substring(1));

			// Modifying row index.
			idx.html(`Row ${dig - 1}`);

			// Modifying row id.
			$(this).attr('id', `R${dig - 1}`);
		});

		// Removing the current row.
		$(this).closest('tr').remove();

		// Decreasing total number of rows by 1.
		rowIdx--;
	});
});
/*RECOVERY LOSS DYNAMIC DATA*/

	function price_in_word(price1) {
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

$("#tbodyR").on("keyup", ".calRecoveryAmt", function(){
	//alert("Row Id "+ $('#row_0').val());
	id = this.id;
	var value = $('#'+id).val();
	
	if (value.indexOf('.') > 0){
		var valueR = value.split('.')[0];
		var valueP = value.split('.')[1];
		 valueR.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
	}else{
		var valueP = ' Zero '; 
		var valueR = value;
	}
	
	var money = valueR;
	var length = money.length;
	
if (length < 15) {
		var x=0;
		if(valueP == ' Zero '){
			x = ' Zero ';
		}else{
			x = price_in_word(valueP);
		}
	
	$('#'+'spanone'+id).text(price_in_word(valueR) + ' Rupees And ' + x + ' Paise Only' );
	} else {
	var moneys = money.replace(new RegExp(',', 'g'), '');
	var valueP = moneys.substring(moneys.length - 7, moneys.length);
	var croreValue = moneys.substr(0, moneys.length - 7);
	
	}
	//$('#'+id).val(value.replace(/\D/g, '').replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"));
	
});


$(document).ready(function(){
	
	
	if(incidentReportedToLawStatus == true){
			$("#incidentReportedToLawStatus").empty();
			$("#incidentReportedToLawStatus").append("Yes");
		}else if(incidentReportedToLawStatus == false){
			
			$("#incidentReportedToLawStatus").empty();
			$("#incidentReportedToLawStatus").append("No");
		}
	
	});
	

/*INCIDENT REPORTED TO LAW*/

$("#incidentReportedToLaw").on('change', function() {
		    
		if ($(this).is(':checked')) {
		        incidentReportedToLawStatus = $(this).is(':checked');
				incidentReportedToLawStatus = true;
		    }else{
				incidentReportedToLawStatus = false;
		}	
		
		if(incidentReportedToLawStatus == true){
			$("#incidentReportedToLawStatus").empty();
			$("#incidentReportedToLawStatus").append("Yes");
		}else if(incidentReportedToLawStatus == false){
			
			$("#incidentReportedToLawStatus").empty();
			$("#incidentReportedToLawStatus").append("No");
		}
		
		});



/*$("#incidentReportedToLaw").on('change', function() {
	if ($(this).is(':checked')) {
		incidentReportedToLaw = $(this).is(':checked');
		incidentReportedToLaw == true;
	} else {
		incidentReportedToLaw == false;
	}
});*/
/*INCIDENT REPORTED TO LAW*/


/*VALIDATE FINANCE PAGE*/

function validateSecond() {
	
	
	getTotalNetLoss();
	
	getTotalGrossLoss();
	
	
	// fetching Gross Loss Data
	grossLossTable = "[\n";
		if ($('#grossLossTable tr').length > 1) {
			$('#grossLossTable > #tbody  > tr').each(function(index, value) {
				grossLossTable = grossLossTable +
					" { \"incidentId\": \"" + $("#incidentId").val() + "\",\n" +
					"\"date\": \"" + $(this).find('td:eq(0) input[type=text]').val() + "\",\n" +
					"\"type\": \"" + $(this).find('td:eq(1) textarea').val() + "\",\n" +
					"\"amount\": \"" + $(this).find('td:eq(2) input[type=text]').val() + "\",\n" +
					"\"category\": \"" + "GL\"" + "},";
			});
			grossLossTable = grossLossTable.substring(0, grossLossTable.length - 1);

		}
		grossLossTable += "]";
		// fetching Gross Loss Data

	
		//sum of Net Loss
		function getTotalNetLoss() {	
		   nettotal=0;
		  $(".amt").each(function() { // or $(".total_price") if given a class
		    netVal = $(this).val();
		    nettotal += isNaN(netVal) || $.trim(netVal)=="" ? 0 : parseFloat(netVal); // or parseInt(val,10);
		  });
		  
			
			
		}

		// sum of Gross Loss
		function getTotalGrossLoss() {	
		   grosstotal=0
		  $(".glamt").each(function() { // or $(".total_price") if given a class
		     grossVal = $(this).val();
		    grosstotal += isNaN(grossVal) || $.trim(grossVal)=="" ? 0 : parseFloat(grossVal); // or parseInt(val,10);
		  });
		  
			
			var x=grosstotal;
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
			
			$("#grossLossRemediation").empty();
			$("#grossLossRemediation").append('<i class="fas fa-rupee-sign p-1" style="color:black;"></i>');
			$("#grossLossRemediation").append(res);
			
			var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	inWords(grosstotal);

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
		$('#showGrossAmt').text(str)
			
		}
	
			
		}
	
	
		// fetching Recovery Loss Data
		recoveryLossTable = "[\n";
		if ($('#recoveryLossTable tr').length > 1) {
			$('#recoveryLossTable > #tbodyR  > tr').each(function(index, value) {
				recoveryLossTable = recoveryLossTable +
					" { \"incidentId\": \"" + $("#incidentId").val() + "\",\n" +
					"\"date\": \"" + $(this).find('td:eq(0) input[type=text]').val() + "\",\n" +
					"\"type\": \"" + $(this).find('td:eq(1) textarea').val() + "\",\n" +
					"\"amount\": \"" + $(this).find('td:eq(2) input[type=text]').val() + "\",\n" +
					"\"category\": \"" + "RL\"" + "},";
			});
			recoveryLossTable = recoveryLossTable.substring(0, recoveryLossTable.length - 1);
		}
		recoveryLossTable += "]";
		// fetching Recovery Loss Data
		

	 incidentLoss=0;
	
	 var temp =  grosstotal - nettotal;
		if( (grosstotal - nettotal) < 0){
			
			incidentLoss = 0;
		}else {
			incidentLoss = temp;
		}
			
			
			var x=nettotal;
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
		    var resnetTotal = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;

			$("#recoveryLossIncident").empty();
			$("#recoveryLossIncident").append('<i class="fas fa-rupee-sign p-1" style="color:black;"></i>');
			$("#recoveryLossIncident").append(resnetTotal);
			
			
	var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	inWords(nettotal);

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
		$('.showRecoveryAmt').text(str)
			
		}
	
	var x=incidentLoss;
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
			
			$("#netLossRemediation").empty();
			$("#netLossRemediation").append('<i class="fas fa-rupee-sign p-1" style="color:black;"></i>');
			$("#netLossRemediation").append(res);
			
			
			var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	inWords(incidentLoss);

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
		$('#showNetLossAmt').text(str)
			
		}
	
			
	
	//stepper.next();
	if(myValidationFunction()==true){
		stepper.next();
	}
	
}	
/*VALIDATE FINANCE PAGE*/
$(document).ready(function() {
	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		minDate: new Date(),
		format: 'DD-MM-YYYY',
		onChangeDateTime: function(dp, $input) {
		}
	});
});

$('#viewLink').click(function() {
	
	if($("#caseReportedTo").val() ==""){
		toastr.error("Value Cannot be Empty");
	}else{
		
		stepper.next();
	}
});

/*APPROVE BUTTON CLICK FUNCTION*/
$("#approve").click(function() {
	
var startDate = $("#startDate").val();
var endDate = $("#endDate").val();	

var actionName = $(this).attr("name");

	if ($('#remediationFormTemp').valid()) {
		
		var incidentReportedToLaw;
		
		if(incidentReportedToLawStatus == true){
			incidentReportedToLaw = 'Y'
		}else{
			incidentReportedToLaw = 'N'
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


		var finalString = "{\n" +
			"    \"incidentId\": \"" + $("#incidentId").val() + "\",\n" +
			"    \"rootCauseIncident\": \"" + $("#rootCauseIncident").val() + "\",\n" +
			"    \"rootCauseType\":\"" + $("#rootCauseType").val() + "\",\n" +
			"    \"rootCauseDescription\":\"" + $("#rootCauseDescription").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
			"    \"actionPlanName\":\"" + $("#actionPlanName").val().replace(/(\r\n|\n|\r)/gm, "") + "\",\n" +
			"    \"frequency\":\"" + $("#frequency").val() + "\",\n" +
			"    \"actionName\":\"" + actionName + "\",\n" +
			"    \"grossLossRemediation\":\"" + grossVal + "\",\n" +
			"    \"netLossRemediation\":\"" + incidentLoss + "\",\n" +
			"	 \"incidentReportedToLaw\":\"" + incidentReportedToLaw + "\",\n" +
			"    \"casesReportedTo\":\"" + $("#caseReportedTo").val() + "\",\n" +
			"\"commentDto\":{\"comment\":\"" + $("#incidentComment").val().replace(/(\r\n|\n|\r)/gm, "") + "\"}," +
			"    \"startDate\":\"" + startDate + "\",\n" +
			"    \"endDate\":\"" + endDate + "\",\n" +
			"    \"grossLoss\":" + grossLossTable + ",\n" +
			"    \"recoveryLoss\":" + recoveryLossTable + ",\n" +
			"    \"filedetails\":" + filedetails + "\}";

	

		console.log(finalString);

		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(
			128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase), finalString);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$('#remediationFormTemp').submit();

	}

});
/*APPROVE BUTTON CLICK FUNCTION*/



/*COMMA SEPARATED AMOUNT*/
$(document).ready(function(){
	
var x=$('#assessedImpactValueH').val();
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
    var assessedImpactValueH = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;

$('#assessedImpactValue').val(assessedImpactValueH);

var y=$('#recoverableValueH').val();
    y=y.toString();
    var afterPoint = '';
    if(y.indexOf('.') > 0)
    afterPoint = y.substring(y.indexOf('.'),y.length);
    y = Math.floor(y);
    y=y.toString();
    var lastThree = y.substring(y.length-3);
    var otherNumbers = y.substring(0,y.length-3);
    if(otherNumbers != '')
    lastThree = ',' + lastThree;
    var recoverableValueres = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;

$('#recoverableValue').val(recoverableValueres);
	
});
/*COMMA SEPARATED AMOUNT*/


/*form validate*/

/*REMEDIATION FORM*/

$(function() {
	$('#remediationFormTemp').validate({
		rules: {
			rootCauseIncident: {
				required: true
			},

			rootCauseType: {
				required: true
			},
			rootCauseDescription: {
				required: true
			},
			riskInRiskRegister: {
				required: true
			},
			controlInRiskRegister: {
				required: true
			},
			incidentReportedToLaw: {
				required: true
			},
		},
		messages: {
			rootCauseIncident: {
				required: "Please Select Root Cause of Incident",
			},

			rootCauseType: {
				required: "Please Select Root Cause Type",
			},
			rootCauseDescription: {
				required: "Please Enter Root Cause Description",
			},
			riskInRiskRegister: {
				required: "Please Provide Risk Added In Risk Register",
			},
			controlInRiskRegister: {
				required: "Please Provide Control Added In Risk Register",
			},
			incidentReportedToLaw: {
				required: "Please Select Whether Incident Reported To Law Enforcement Agencies",
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

/*REMEDIATION FORM*/


/*FINANCE FORM*/

/*$(function() {
	$('#financeForm').validate({
		rules: {
			rootCauseIncident: {
				required: true
			},

			rootCauseType: {
				required: true
			},
			rootCauseDescription: {
				required: true
			},
			riskInRiskRegister: {
				required: true
			},
			controlInRiskRegister: {
				required: true
			},
			incidentReportedToLaw: {
				required: true
			},
		},
		messages: {
			rootCauseIncident: {
				required: "Please Select Root Cause of Incident",
			},

			rootCauseType: {
				required: "Please Select Root Cause Type",
			},
			rootCauseDescription: {
				required: "Please Enter Root Cause Description",
			},
			riskInRiskRegister: {
				required: "Please Provide Risk Added In Risk Register",
			},
			controlInRiskRegister: {
				required: "Please Provide Control Added In Risk Register",
			},
			incidentReportedToLaw: {
				required: "Please Select Whether Incident Reported To Law Enforcement Agencies",
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
});*/

/*FINANCE FORM*/



/*form validate*/



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


/*File Upload*/

$(document).ready(function() {
	
	var rowCount = $('.uploadTable tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#filedetails').hide();
	}else{
		$('#filedetails').show();
	}
	
});


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

		var flg = false;
		var userName = $('#clientName').val();
		$('.uploadTable tr').each(function() {
			var fName = $(this).find('td:eq(0)').text();
			console.log('fName ' + fName + ' filename ' + filename);
			if (fName === "No Data Available" || fName === "No data available in table") {
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
/*File Upload*/

/*File Download*/
/*$(function() {
	$("#filedetails").DataTable({
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
$('a.viewIncident').click(function() {
	
	var incidentId = $(this).attr('id');
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
});
/*View Incident Modal*/






