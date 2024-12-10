
$(document).ready(function() {
	$("#prevIncidentdetails").DataTable({
		"columnDefs": [{
			orderable: false
			//targets: [6]
		}],
		"responsive": true,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
					"emptyTable": "No Data Available"
				},
		//"buttons": ["csv", "excel", "pdf", "print"]
	}).buttons().container().appendTo(
		'#prevIncidentdetails_wrapper .col-md-6:eq(0)');
})

/*loader*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});
/*document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}*/
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
		$('#showWordsAmt').text(str)
	}

});*/
/*Number to Words*/

/*Number to Words for Assessed Impact Value*/


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

/*Number to Words for Assessed Impact Value*/


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
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;
$('#assessedImpactValue').val(res);
});


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
    var response = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",") + lastThree + afterPoint;

$('#recoverableValue').val(response);

/*COMMA SEPARATED AMOUNT*/


/*Approve function*/

$("#approve").click(function() {

var actionName = $(this).attr("name");

var actionStatusOld = $("#actionStatus").val();
var reason = $('#approvereason').val().replace(/(\r\n|\n|\r)/gm, "");

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
			
	var incidentId = $("#incidentId").val();	
	
	var actionString = "{\n" + "\"incidentId\": \""+ incidentId + "\",\n"
			
			+"\"actionName\":\"" + actionName + "\",\n"
			+ "\"actionStatus\":\""+ "VI"+ "\",\n"
			+ "\"actionStatusOld\": \""
			+ actionStatusOld + "\",\n" +
			"\"commentDto\":{\"comment\":\""+ reason + "\"}," +
			"\"filedetails\":" + filedetails + "}";
			
			
			console.log(actionString);


		var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(
				128 / 8).toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(
				reverseText(passphrase), actionString);
			$("#encryptedJson").val(
				ciphertext + ':~:' + passphrase);
			$('#frmIncident').submit();
	
	
	
});

/*Approve function*/

/*Reject function*/
$("#reject").click(function() {

	var actionName = $(this).attr("name");
	var actionStatusOld = $("#actionStatus").val();
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
						 "\"actionStatus\":\"" + "VZ"+ "\",\n" +
						 "\"actionStatusOld\": \""+ actionStatusOld + "\",\n" +
					    "\"commentDto\":{\"comment\":\""+ reason + "\"}," +
					    "\"filedetails\":"+ filedetails + "}";
			
					
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase), incidentString);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$("#frmIncident").submit();
	}		
	
	
});

/*Reject function*/


$(document).ready(function() {

	var rowCount = $('.incidentdetails tr').length;
	if (rowCount == 1) {
		$('#linkedIncident').hide();
	} else if (rowCount > 1) {
		$('#linkedIncident').show();
	}
});


$(document).ready(function() {
	
	var rowCount = $('.uploadTable tr').length;
	if (rowCount == 2) {
		$('#filedetails').hide();
	} else {
		$('#filedetails').show();
	}

});	




/*file upload*/
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










