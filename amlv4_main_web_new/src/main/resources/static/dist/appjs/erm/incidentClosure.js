/*GLOBAL VARIABLE*/
var remediationString;
riskIdArray = [];
/*GLOBAL VARIABLE*/

/*Loader*/
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);


}
/*Loader*/

/*cancel Modal*/
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this);
	$('a.target').attr('href', recipient);

});

/*cancel Modal*/
/*$(document).ready(function() {
				
$("#actionplantable").DataTable({
				"columnDefs" : [ {
					orderable : false,
					targets : [ 7 ]
				} ],
				"responsive" : false,
				"autoWidth" : true,
				"searching" : false,
				"fixedHeader" : true,
				"language" : {
					"emptyTable" : "No Data Available"
				}
			}).buttons().container().appendTo(
					'#actionplantable_wrapper .col-md-12:eq(0)');				

});*/



/*Initialize Select2 Elements*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});
/*Initialize Select2 Elements*/


/*BS-Stepper Init*/
$(document).ready(function() {
	var stepper = new Stepper($('.bs-stepper')[0])
});

document.addEventListener('DOMContentLoaded', function() {
	window.stepper = new Stepper(document.querySelector('.bs-stepper'))
});
/*BS-Stepper Init*/


/*COMMA SEPARATED AMOUNT*/
/*$(document).ready(function() {

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

	var y = $('#recoverableValueH').val();
	y = y.toString();
	var afterPoint = '';
	if (y.indexOf('.') > 0)
		afterPoint = y.substring(y.indexOf('.'), y.length);
	y = Math.floor(y);
	y = y.toString();
	var lastThree = y.substring(y.length - 3);
	var otherNumbers = y.substring(0, y.length - 3);
	if (otherNumbers != '')
		lastThree = ',' + lastThree;
	var response = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;

	$('#recoverableValue').val(response);


	var z = $('#grossLossRemediationH').val();
	z = z.toString();
	var afterPoint = '';
	if (z.indexOf('.') > 0)
		afterPoint = z.substring(z.indexOf('.'), z.length);
	z = Math.floor(z);
	z = z.toString();
	var lastThree = z.substring(z.length - 3);
	var otherNumbers = z.substring(0, z.length - 3);
	if (otherNumbers != '')
		lastThree = ',' + lastThree;
	var response = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;

	$('#grossLossRemediation').val(response);


	var a = $('#netLossRemediationH').val();
	a = a.toString();
	var afterPoint = '';
	if (a.indexOf('.') > 0)
		afterPoint = a.substring(a.indexOf('.'), a.length);
	a = Math.floor(a);
	a = a.toString();
	var lastThree = a.substring(a.length - 3);
	var otherNumbers = a.substring(0, a.length - 3);
	if (otherNumbers != '')
		lastThree = ',' + lastThree;
	var response = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;

	$('#netLossRemediation').val(response);

});
*//*COMMA SEPARATED AMOUNT*/

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
});

$(document).ready(function() {
	var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	inWords($('#grossLossRemediationH').val());
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
		$('#grossLossRemediationW').text(str);
	}
});


$(document).ready(function() {
	var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
	var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
	inWords($('#netLossRemediationH').val());
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
		$('#netLossRemediationW').text(str);
	}
});
*/



/*Number to Words*/

/*VALIDATE CLOSURE PAGE*/

function validateSecond() {

	//stepper.next();


	if ($('#incidentClosureForm').valid()) {

		stepper.next();

	}


}
/*VALIDATE CLOSURE PAGE*/

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


$(document).ready(function() {

	var deptId = $('#deptId').val();
	var sourceName = "IM";
	/*var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}*/

	//fetch risklist dept wise
	var searchParam = "GET";
	var value = "{\"searchParam\":" + "\"" + searchParam + "\",\n" +
		"    \"sourceName\":\"" + sourceName + "\",\n" +
		"\"riskDept\":\"" + deptId + "\"}";

	console.log(value);

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
		url: 'fetchRiskList',
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
			//var incidentList = obj.incidentList;


			console.log(obj.listRiskLibDto);


			var riskList = obj.listRiskLibDto;

			riskList.forEach(function(items) {

				if (items.riskId) {

					$("<tr role='row' class='odd' id='row_id'><td><input type='checkbox' name='riskId' title='" + items.riskFunction + "~" + items.riskName + "' rel='" + items.riskDescription + "' value='" + items.riskId + "' id='" + items.riskId + "'></td><td class='sorting_1'>"
						+ items.riskId
						+ "</td><td><span name='riskFunction' class='textCapitalize'>"
						+ items.riskFunction
						+ "</td><td><span name='riskName'  class='textCapitalize'>"
						+ items.riskName
						+ "</td><td><span name='incidentDescription'  class='textCapitalize description'>"
						+ items.riskDescription
						+ "</span></td>"
						+ "</tr>").appendTo(".riskListView");
				}

			});

		},
		error: function(xhr, status, error) {
			toastr.success('Some Error Occured');
		}
	});

});

/*LINK BUTTON CLICK FUNCTION*/

riskIdArray = [];
$('#linkRisk').click(function() {

		riskIdArray=[];
	

	$('input[name="riskId"]:checked').each(function() {

		var id = this.value;
		var addFlg = true;
		$('.riskListView tr').each(
			function() {
				var rowid = $(this).find('td:eq(0)').text();
				if (rowid == id) {
					addFlg = false;
				}
			});
		riskIdArray.push(id);
		//$(".controlList tr").detach();
	});
	var searchParam = "GET";
	var value = "{\"searchParam\":" + "\""
		+ searchParam + "\",\n"
		+ "\"riskIdArray\":\"" + riskIdArray + "\"}";

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
		url: 'fetchRiskControlList',
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
			//var incidentList = obj.incidentList;

			var controlList = obj.controlLibraryList;
			
			$(".controlList > #tBodyC").empty();
			$('#controlList').dataTable().fnClearTable();
			$('#controlList').DataTable().destroy();


			controlList.forEach(function(items) {
				if (items.controlId) {

					$('#controlList tbody').append('<tr id=' + items.controlId + '><td>'
						+ items.controlId
						+ '</td><td>'
						+ items.controlFunction
						+ '</td><td>'
						+ items.controlName
						+ '</td></tr>');

				}

			});
			
			$("#controlList").DataTable({
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
				'#controlList_wrapper .col-sm-12:eq(0)')
			$("#controlList").show();
			$("#showRow").show();
			//riskIdArray = [];

		},
		error: function(xhr, status, error) {
			toastr.success('Some Error Occured');
		}
	});

});
/*LINK BUTTON CLICK FUNCTION*/


/*FORM VALIDATE*/


$(function() {

	$('#incidentClosureForm').validate({

		rules: {

			closureReason: {
				required: true,
				minlength: 10
			},
			businessSegment: {
				required: true,
			},
			riskInRiskRegister: {
				required: true,
			},
			controlInRiskRegister: {
				required: true,
			},

		},
		messages: {


			closureReason: {
				required: "Please provide reason for closure",
			},
			businessSegment: {
				required: "Please Select Business Segment",
			},
			riskInRiskRegister: {
				required: "Please Provide Risk Details",
			},
			controlInRiskRegister: {
				required: "Please Provide Control Details",
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
			document.getElementById('load').style.visibility = "visible";
			form.submit();
		}

	});

});


/*FORM VALIDATE*/


/*APPROVE BUTTON CLICK FUNCTION*/

$("#approve").click(function() {

	var approve = "approve";
	if ($('#incidentClosureForm').valid()) {

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


		var checklistView = "[\n";
		if ($('#checklistView tr').length > 1) {
			$('#checklistView > #tbody  > tr').each(function(index, value) {
				checklistView = checklistView +
					" { \"checkListId\": \"" + $(this).find('td:eq(0)').text() + "\",\n" +
					"\"checkListDescription\": \"" + $(this).find('td:eq(1)').text() + "\",\n" +
					"\"checkListResponse\": \"" + $(this).find('td:eq(2) select').val() + "\" },";
			});
			checklistView = checklistView.substring(0, checklistView.length - 1);
		}
		checklistView += "]";


		var actionString = "{\n" +
			"    \"incidentId\": \"" + $("#incidentId").val() + "\",\n" +
			"    \"businessSegment\":\"" + $("#businessSegment").val() + "\",\n" +
			"    \"closureReason\":\"" + $("#closureReason").val() + "\",\n" +
			"    \"riskInRiskRegister\":\"" + $("#riskInRiskRegister").val() + "\",\n" +
			"    \"controlInRiskRegister\":\"" + $("#controlInRiskRegister").val() + "\",\n" +
			"    \"casesReportedTo\":\"" + $("#caseReportedTo").val() + "\",\n" +
			"    \"sourceName\": \"" + approve + "\",\n" +
			"    \"checkList\":" + checklistView + ",\n" +
			"    \"filedetails\":" + filedetails + ",\n" +
			"	 \"riskIdArray\":\"" + riskIdArray + "\"}";


		console.log(actionString);



		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(
			128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(
			reverseText(passphrase), actionString);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$('#incidentClosureForm').submit();

	}

});

/*ESCALATE BUTTON CLICK FUNCTION*/


$("#escalate").click(function() {

	var escalate = "escalate";

	//if (!$('#incidentClosureForm').valid()) {

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

	var checklistView = "[\n";
	if ($('#checklistView tr').length > 1) {
		$('#checklistView > #tbody  > tr').each(function(index, value) {
			checklistView = checklistView +
				" { \"checkListId\": \"" + $(this).find('td:eq(0)').text() + "\",\n" +
				"\"checkListDescription\": \"" + $(this).find('td:eq(1)').text() + "\",\n" +
				"\"checkListResponse\": \"" + $(this).find('td:eq(2) select').val() + "\" },";
		});
		checklistView = checklistView.substring(0, checklistView.length - 1);
	}
	checklistView += "]";


	var actionString = "{\n" +
		"    \"incidentId\": \"" + $("#incidentId").val() + "\",\n" +
		"    \"businessSegment\":\"" + $("#businessSegment").val() + "\",\n" +
		"    \"closureReason\":\"" + $("#closureReason").val() + "\",\n" +
		"    \"riskInRiskRegister\":\"" + $("#riskInRiskRegister").val() + "\",\n" +
		"    \"controlInRiskRegister\":\"" + $("#controlInRiskRegister").val() + "\",\n" +
		"    \"casesReportedTo\":\"" + $("#caseReportedTo").val() + "\",\n" +
		"    \"sourceName\": \"" + escalate + "\",\n" +
		"    \"checkList\":" + checklistView + ",\n" +
		"    \"filedetails\":" + filedetails + ",\n" +
		"	 \"riskIdArray\":\"" + riskIdArray + "\"}";

	alert(actionString);
	console.log(actionString);

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(
		128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), actionString);
	$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
	$('#incidentClosureForm').submit();

	//	}

});

/*ESCALATE BUTTON CLICK FUNCTION*/


/*file upload*/

$(document).ready(function() {
	
	var rowCount = $('.uploadTable tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 1) {
		$('#filedetails').hide();
	}else{
		$('#filedetails').show();
	}
	
})

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
					+ '</td><td ><a class="btn btn-danger btn-sm" id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));
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
	
	
	var incidentId = $('#incidentId').val();
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
	
	
	
	
	
		
	/*	var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
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
	*/
	
	
	
	
	
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
			$('#officeCodeM').val(obj.officeCode);
			$('#incidentReportingPersonM').val(obj.incidentReportingPerson);
			$('#assessedImpactValueM').val(res);
			$('#departmentM').val(obj.department);
			$('#incidentIdentificationDateM').val(obj.incidentIdentificationDate);
			$('#incidentRecordDateM').val(obj.incidentRecordDate);
			$('#incidentTypeM').val(obj.incidentType);
			$('#incidentImpactLevelM').val(obj.incidentImpactLevel);
			$('#caseReportedM').val(obj.casesReportedTo);
		
			if(obj.primaryLossEvent != null){
				$('#primaryLossEventM').val(obj.primaryLossEvent.replaceAll('~',', '));	
			}
			if(obj.secondaryLossEvent != null){
				$('#secondaryLossEventM').val(obj.secondaryLossEvent.replaceAll('~',', '));	
			}
			
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




