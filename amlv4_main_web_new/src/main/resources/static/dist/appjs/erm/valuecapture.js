/**
 * 
 */
/**
 * 
 */
var asstStatus = '';
// Audit trail   
$('a.viewAuditTrail')
	.click(
		function() {
			var stmtId = $("#stmtId").val();
			//var userId = $(this).attr('id');
			var pageValJson = "{\"activityImpactTblKey\":"
				+ "\"" + stmtId + "\"}";

			//document.getElementById('load').style.visibility = "visible";
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
								document
									.getElementById('load').style.visibility = "hidden";
							}, 1000);

						var jsonResponse = JSON
							.stringify(response);
						var obj = JSON.parse(jsonResponse);

						$(".timeline-inverse").empty();

						if (obj.length > 0) {
							obj
								.forEach(function(items) {
									$(
										"<p class='test'><div class='time-label'><span class='bg-success'>"
										+ items.actDate
										+ "</span></div>"
										+ "<div><i class='fas fa-comments bg-warning'></i>"
										+ "<div class='timeline-item'>"
										+ "<h3 class='timeline-header text-capitalize'><a href='#'>"
										+ items.userName
										+ " "
										+ "</a>"
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

							$(
								"<div> <i class='far fa-clock bg-gray'></i> </div>")
								.appendTo(
									".timeline-inverse");
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

var totallengthoffile;
var totallengthoffile2;
$(document).ready(function() {

	$("#today").val(moment(new Date()).format('DD/MM/YYYY'));
	totallengthoffile = $("#capturetbl tr").length;
	totallengthoffile2 = $("#capturetbl2 tr").length;

});
// File upload //

var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var username = $('#userName').val();
	var select = $('.uploadTable');
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
					+ '</td><td>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td class="text-capitalize">'
					+ username
					+ '</td><td>-</td><td class="project-actions" ><a class="btn btn-danger btn-sm" id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
	}
}
$(".uploadTable").on("click", "#closerow", function() {
	$(this).closest("tr").remove();
});

//Capture Value
function valueAdd(value) {
	var userId = $('#hdnuser').val();
	var thresholdTab = '<table>';
	$('#thresholdDTab tr').each(function() {
		thresholdTab += $(this).html();
	});
	asstStatus = tolerance;
	thresholdTab += '</table>';
	//	var thresholdVal = $('#threshold').val();
	if (totallengthoffile == $("#capturetbl tr").length) {
		/*$("#capturetbl tbody")
			.append(
				"<tr>"
				+ "<td>"
				+ moment(new Date()).format('MMM-YYYY')
				+ "</td>"
				+ "<td>"
				+ thresholdTab
				+ "</td>"
				+ "<td>"
				+ value
				+ "</td><td>"
				+ userId
				+ "</td>"
				+ "<td>"
				+ moment(new Date()).format(
					'DD/MM/YYYY')
				+ "</td>"
				+ '<td class="project-actions text-right"><a class="btn btn-danger btn-sm closerowvalue" ><i class="fa fa-window-close"></i></a></td>'
				+ "</tr>");*/
		$('#astDiv').show();
		var displayText = "Assessment Value Entered is " + value
			//+ " and Assessment Status is " + tolerance
			+ ". <br>Are You Sure You Want To Submit.";
		document.getElementById('confirmbox').innerHTML = displayText;
		$('#cancelmodel').modal('show');
		$('#divwarning').show();
	} else {
		$('#cancelmodel').modal('show');
	}

}

function valueAddTable(value) {
	$('#capturetbl2').show();
	var userId = $('#hdnuser').val();
	var thresholdTab = '<table>';
	$('#thresholdDTab tr').each(function() {
		thresholdTab += $(this).html();
	});
	thresholdTab += '</table>';
	var thresholdVal = $('#threshold').val();
	/*if (totallengthoffile2 == $("#capturetbl2 tr").length) {
		$("#capturetbl2 tbody").append(
			'<tr  class="closerowvalue">' + "<td>"
			+ moment(new Date()).format('MMM-YYYY')
			+ "</td>" + "<td>" + thresholdTab + "</td>"
			+ "<td>" + value + "</td><td>" + '-' + "</td><td>"
			+ userId + "</td>" + '<td >'
			+ moment(new Date()).format('DD/MM/YYYY')
			+ "</td>" + "</tr>");
	}*/
}
$('#astMainDiv').show();
$("#capturetbl").on("click", ".closerowvalue", function() {
	$('.closerowvalue').closest("tr").remove();
});

function editValue(ctl) {
	_row = $(ctl).parents("tr");
	var cols = _row.children("td");
	$("#productname").val($(cols[1]).text());
	$("#introdate").val($(cols[2]).text());
	$("#url").val($(cols[3]).text());

	// Change Update Button Text
	$("#updateButton").text("Update");
}

var tolerance = '';
var tolerancemsg = '';
var thresholdVal = '';

$("#valuesubmit")
	.click(
		function() {
			var assessmentValue = $('#captureValue').val();
			var assessmentStatus = tolerancemsg;
			var assessmentPeriod = '';
			if (assessmentValue == '') {
				toastr.error('Please Add Assessment Value...');
			} else {
				var toleranceValue = "{";
				$('#thresholdDTab tr').each(function() {
					toleranceValue += $(this).find("td:eq(0) span").text() + ":"
						+ $(this).find("td:eq(1)").html() + ":" + $(this).find("td:eq(2)").html() + ",";
				});
				toleranceValue = toleranceValue.slice(0, -1);
				toleranceValue += "}";/*
				var assessmentPeriod = '';
				var assessmentValue = '';
				$('table tr.closerowvalue').each(
					function() {
						//assessmentValue = $(this).find("td").eq(8).html();
						assessmentValue = $('#captureValue').val();
						assessmentStatus = tolerancemsg;
					});*/
				var jsonString = "{\n" + "    \"moduleId\": \""
					+ $("#paramidmodal").val() + "\",\n"
					+ "    \"assessmentValue\": \""
					+ assessmentValue + "\",\n"
					+ "    \"assessmentStatus\":\""
					+ assessmentStatus + "\",\n"
					+ "    \"toleranceValue\":\""
					+ toleranceValue + "\",\n"
					+ "    \"assessmentPeriod\":\""
					+ assessmentPeriod + "\"\n" + "}";
				//alert(jsonString);
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(
					128 / 8).toString(CryptoJS.enc.Hex);

				var aesUtil = new AesUtil(keySize,
					iterationCount);

				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), jsonString);
				$("#encryptedJson").val(
					ciphertext + ':~:' + passphrase);
				//toastr.info('Tolerance Status is ' + tolerancemsg + '');
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "visible";
				//setTimeout( function () { 
				$('#vcrForm').submit();
			}
		});

$("#capturebtn")
	.click(
		function() {
			var actualvalue = $('#captureValue').val();
			var capturevalue = 0;
			if (actualvalue !== "") {
				actualvalue = Number($('#captureValue').val());
				var moduleId = $('#stmtId').val();
				var formulaType = $('#kriFormula').val();
				var benckMarkValue = $('#kriBenchmark').attr('att');
				var d = new Date();
				var benckMarkPeriod = d.getMonth() + 1;
				var pageValJson = "{\"capturedValue\":" + "\"" + actualvalue
					+ "\",\"formulaType\":\"" + formulaType + "\",\"moduleId\":\"" + moduleId + "\",\"startDate\":\"" + $('#startDate').val()
					+ "\",\"endDate\":\"" + $('#endDate').val() + "\",\"benckMarkPeriod\":\""
					+ benckMarkPeriod + "\",\"benckMarkValue\":\"" + benckMarkValue
					+ "\"}";
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "visible";
				// ajax call
				$
					.ajax({
						url: 'getCalculatedData',
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
									document
										.getElementById('load').style.visibility = "hidden";
								}, 1000);

							var jsonResponse = JSON
								.stringify(response);
							var obj = JSON.parse(jsonResponse);
							//capturevalue = Number(obj.calculatedResult);
							tolerancemsg = obj.assessmentStatus;
							tolerance = '<td><span class="text-capitalize" style="white-space:pre; background-color:' + obj.bgClass + ';">' + obj.assessmentStatus + '</span></td>';
							valueAdd(actualvalue);
							valueAddTable(actualvalue);
						},
						error: function(xhr, status, error) {
							console.log(xhr);
							console.log(status);
							console.log(error);
							toastr
								.error('Some Error Occured');
						}
					});

			} else {
				toastr.options.fadeOut = 4000;
				toastr
					.error('Assessment Value Cannot Be Blank');
			}
		});
$("#capture_btn")
	.click(
		function() {
			var actualvalue = $('#captureValue').val();
			var capturevalue = 0;
			if (actualvalue !== "") {
				actualvalue = Number($('#captureValue').val());
				var moduleId = $('#stmtId').val();
				var formulaType = $('#kriFormula').val();
				var benckMarkValue = $('#kriBenchmark').attr('att');
				var d = new Date();
				var benckMarkPeriod = d.getMonth() + 1;
				var pageValJson = "{\"capturedValue\":" + "\"" + actualvalue
					+ "\",\"formulaType\":\"" + formulaType + "\",\"moduleId\":\"" + moduleId + "\",\"startDate\":\"" + $('#startDate').val()
					+ "\",\"endDate\":\"" + $('#endDate').val() + "\",\"benckMarkPeriod\":\""
					+ benckMarkPeriod + "\",\"benckMarkValue\":\"" + benckMarkValue
					+ "\"}";
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "visible";
				// ajax call
				$
					.ajax({
						url: 'getCalculatedData',
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
									document
										.getElementById('load').style.visibility = "hidden";
								}, 1000);

							var jsonResponse = JSON
								.stringify(response);
							var obj = JSON.parse(jsonResponse);
							//capturevalue = Number(obj.calculatedResult);
							tolerancemsg = obj.assessmentStatus;
							//alert(tolerancemsg);
							tolerance = '<td><span class="text-capitalize" style="white-space:pre; background-color:' + obj.bgClass + ';">' + obj.assessmentStatus + '</span></td>';
							valueAdd(actualvalue);
							valueAddTable(actualvalue);
						},
						error: function(xhr, status, error) {
							console.log(xhr);
							console.log(status);
							console.log(error);
							toastr
								.error('Some Error Occured');
						}
					});

			} else {
				toastr.options.fadeOut = 4000;
				toastr
					.error('Assessment Value Cannot Be Blank');
			}
		});
//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'complete') {
		setTimeout(
			function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
	}
}

$("#today").text(moment(new Date()).format('DD/MM/YYYY'));