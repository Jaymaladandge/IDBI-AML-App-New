var userDeptId = $("#userDeptId").val();
var officeCode = $("#officeCode").val();

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
	var deptNameTemp = $('#userDept').val();
	if (deptNameTemp != 'ERM') {

		var userOffice = $("#userOffice").val();
		if (userOffice === 'CO') {
			$('#officeType option[value="ZO"]').attr("disabled", false);
			$('#officeType option[value="DO"]').attr("disabled", false);
			$('#officeType option[value="BO"]').attr("disabled", false);
		} else if (userOffice === 'ZO') {
			$('#officeType option[value="CO"]').attr("disabled", true);
			$('#officeType option[value="DO"]').attr("disabled", false);
			$('#officeType option[value="BO"]').attr("disabled", false);
		} else if (userOffice === 'DO') {
			$('#officeType option[value="CO"]').attr("disabled", true);
			$('#officeType option[value="ZO"]').attr("disabled", true);
			$('#officeType option[value="BO"]').attr("disabled", false);
		} else if (userOffice === 'BO') {
			$('#officeType option[value="CO"]').attr("disabled", true);
			$('#officeType option[value="ZO"]').attr("disabled", true);
			$('#officeType option[value="DO"]').attr("disabled", true);
		}

	}

});


$(document).ready(function() {
	$('#startDate').datetimepicker({
		format: 'YYYY-MM-DD',
		maxDate: new Date()
	});
	//Date range picker
	$('#endDate').datetimepicker({
		format: 'YYYY-MM-DD',
		maxDate: new Date()
	});
});


$("#fetchDataBtn").click(function() {

	var date1 = $("#startDate").val();
	var date2 = $("#endDate").val();
	var startDate = new Date(date1);
	var endDate = new Date(date2);

	var officeType = $("#officeType").val();

	var validFlg = true;
	if (startDate > endDate) {
		toastr
			.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (date1 === '' || date1 == null) {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (date2 === '' || date2 == null) {
		toastr.error("end date cannot be blank");
		validFlg = false;
	} else if (officeType === '' || officeType == null) {
		toastr.error("Office Type cannot be blank");
		validFlg = false;
	}
	if ($("#incidentDept").val() === "") {
		toastr.error("Please Select Department");
		validFlg = false;
	}

	var formattedSDate = [startDate.getDate(), startDate.getMonth() + 1, startDate.getFullYear()].join('-');
	var formattedEDate = [endDate.getDate(), endDate.getMonth() + 1, endDate.getFullYear()].join('-');

	if (validFlg) {

		var pageValJson = "";

		var selectedOfficeType = $('#officeType :selected').val();
		var deptId = $('#incidentDept :selected').val();
		var officeId = $('#officeId').val();

		pageValJson = "{\n"
			+ "    \"searchParam\": \"" + selectedOfficeType + "\",\n"
			+ "    \"startDate\": \"" + formattedSDate + "\",\n"
			+ "    \"department\": \"" + deptId + "\",\n"
			+ "    \"officeCode\": \"" + officeCode + "\",\n"
			+ "    \"userDept\": \"" + userDeptId + "\",\n"
			+ "    \"officeId\": \"" + officeId + "\",\n"
			+ "    \"endDate\":\"" + formattedEDate + "\"\n" + "}";


		document.getElementById('load').style.visibility = "visible";

		$.ajax({
			url: "fetchIncidentRiskLinkReport",
			type: "POST",
			data: {
				pageValJson: pageValJson
			},// important line for thymeleaf http security
			headers: {
				"X-CSRF-TOKEN": $("input[name='_csrf']").val()
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

				var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);
				console.log('obj' + obj);
				var dataList = obj.incidentList;
				console.log(dataList);
				$(".incidentTypeReportTable > #tbodyR").empty();
				$('#incidentTypeReportTable').dataTable().fnClearTable();
				$('#incidentTypeReportTable').DataTable().destroy();


				dataList.forEach(function(items) {

					var riskId = '';
					var riskDescription = '';
					
					items.incidentClosureLinkDtoList.forEach(function(item) {
						riskId+= item.riskId;
						riskDescription = item.riskDescription
					

					$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'><a href='#' id='" + items.incidentId + "' onclick='viewBenchMarkDetails(this.id)'>"
						+ items.incidentId
						+ "</td><td><span name='incidentName' value='" + items.incidentDescription + "' class='textCapitalize'>"
						+ items.incidentDescription
						+ "</td><td><span name='department' value='" + items.department + "' class='textCapitalize'>"
						+ items.department
						+ "</td><td><span name='officeCode' value='" + items.operatingOfcLocation + "' class='textCapitalize'>"
						+ items.operatingOfcLocation
						+ "</td><td><span name='officeCode' value='" + items.officeCode + "' class='textCapitalize'>"
						+ items.officeCode
						+ "</td><td><span name='officeZone' value='" + items.officeZone + "' class='textCapitalize'>"
						+ items.officeZone
						+ "</td><td><span name='riskId' value='" + riskId + "' class='textCapitalize'> <a href='#' id='" + riskId + "' onclick='viewRiskLibraryDetails(this.id)'>"
						+ riskId
						+ "</td><td><span name='riskDescription' value='" + riskDescription + "' class='textCapitalize'>"
						+ riskDescription
						+ "</span></td>"
						+ "</tr>").appendTo(".incidentTypeReportTable");
						
					})
						
				});



				$("#incidentTypeReportTable").DataTable({
					"columnDefs": [{
						orderable: false
						//targets: [7]
					}],
					"responsive": false,
					"autoWidth": true,
					"searching": true,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					},
					"dom": 'Bfrtip',
					"buttons": [{
						extend: 'csvHtml5',
						title: 'Incident Risk Link Report'
					}, {
						extend: 'pdfHtml5', title: 'Incident Risk Link Report',

					}, {
						extend: 'excel',
						title: 'Incident Risk Link Report',
					}, {
						extend: 'print',
						title: 'Incident Risk Link Report'
					}],
				}).buttons().container().appendTo(
					'#incidentTypeReportTable_wrapper .col-md-12:eq(0)');

			},
			error: function(xhr, status, error) {
				console.log(xhr);
				console.log(status);
				console.log(error);
				toastr
					.success('Some Error Occured');
			}

		});



	}

});


/*View Incident Modal*/
function viewBenchMarkDetails(incidentId) {
	//var incidentId = $(this).attr('id');
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
	document.getElementById('load').style.visibility = "visible";
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
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);


			if (obj.assessedImpactValue != null) {
				var x = obj.assessedImpactValue;
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
			}

			//recovery amount

			if (obj.recoverableValue != null) {
				var a = obj.recoverableValue;
				a = a.toString();
				var afterPoint = '';
				if (x.indexOf('.') > 0)
					afterPoint = x.substring(a.indexOf('.'), a.length);
				a = Math.floor(a);
				a = a.toString();
				var lastThree = a.substring(a.length - 3);
				var otherNumbers = a.substring(0, a.length - 3);
				if (otherNumbers != '')
					lastThree = ',' + lastThree;
				var resRecovery = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
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


			if (obj != null) {

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
				$('#primaryLossEventM').val(obj.primaryLossEvent);
				$('#secondaryLossEventM').val(obj.secondaryLossEvent);
				$('#recoverableValueM').val(resRecovery);

				$('#recoveryStatusM').val(obj.recoveryStatus);
				$('#additionalBusinessUnitM').val(obj.additionalBusinessUnit);

			}

			/*$('#whetherInsuredM').val(obj.whetherInsured);
			$('#customerImpactedM').val(obj.customerImpacted);
			$('#regulatoryImpactM').val(obj.regulatoryImpact);*/
			if (obj.incidentRemediationLinkDto != null && obj.incidentStatus == 'Pending Closure' || obj.incidentStatus == 'Closed') {

				var remDto = obj.incidentRemediationLinkDto;
				$('#rootCauseIncidentM').val(remDto.rootCauseIncident);
				$('#rootCauseTypeM').val(remDto.rootCauseType);
				$('#rootCauseDescriptionM').val(remDto.rootCauseDescription);
				$('#grossLossRemediationM').val(remDto.grossLossRemediation);
				$('#netLossRemediationM').val(remDto.netLossRemediation);

				$('#remediateDiv').show();

			} else if (obj.incidentRemediationLinkDto == null && obj.incidentStatus != 'Pending Closure') {

				$('#remediateDiv').hide();
			}

			//console.log(obj.incidentFinanceList);
			if (obj.incidentFinanceList != null) {
				var financeDto = obj.incidentFinanceList;
				if (financeDto.length > 0) {
					$(".grossLossTable > #tbodyR").empty();
					$(".recoveryLossTable > #tbodyT").empty();
					financeDto.forEach(function(items) {
						/*alert(items.type);
						alert(items.incidentId);
						alert(items.amount);
						alert(items.category);*/
						if (items.category == 'GL') {
							$('<tr><td>'
								+ items.date
								+ '</td><td>'
								+ items.type
								+ '</td><td>'
								+ items.amount
								+ '</td>'
								+ '</tr>').appendTo(".grossLossTable > #tbodyR");

						} if (items.category == 'RL') {
							$('<tr><td>'
								+ items.date
								+ '</td><td>'
								+ items.type
								+ '</td><td>'
								+ items.amount
								+ '</td>'
								+ '</tr>').appendTo(".recoveryLossTable > #tbodyT");
						}


					});
				}
			}

			if (obj.aplMasterDto != null) {

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
					+ '</tr>').appendTo(".actionplantable > #actPlanBody");


				$('#actionDiv').show();
			} else {

				$('#actionDiv').hide();
			}


			if (obj.incidentClosureLinkDto != null && obj.incidentStatus == 'Closed') {

				var closureList = obj.incidentClosureLinkDto;
				$('#businessSegmentM').val(closureList.businessSegment);
				$('#riskInRiskRegisterM').val(closureList.riskInRiskRegister);
				$('#controlInRiskRegisterM').val(closureList.controlInRiskRegister);
				$('#closureReasonM').val(closureList.closureReason);

				if (obj.incidentClosureLinkDto.checkList.length > 0) {
					obj.incidentClosureLinkDto.checkList.forEach(function(items) {
						if (items.checkListResponse != null) {
							$('<tr><td>'
								+ items.checkListId
								+ '</td><td>'
								+ items.checkListDescription
								+ '</td><td>'
								+ items.checkListResponse
								+ '</td>'
								+ '</tr>').appendTo(".checklistView > #tbodyC");
						} else if (items.checkListResponse == null) {

							$('<tr><td>'
								+ items.checkListId
								+ '</td><td>'
								+ items.checkListDescription
								+ '</td><td>'
								+ "No Value"
								+ '</td>'
								+ '</tr>').appendTo(".checklistView > #tbodyC");

						}
					});
				}
				$('#closureDiv').show();
			} else if (obj.incidentClosureLinkDto == null) {


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

/*View Risk Modal*/

function viewRiskLibraryDetails(riskId) {
			var pageValJson = "{\"riskId\":" + "\""
				+ riskId + "\"}";
			document.getElementById('load').style.visibility = "visible";
			// ajax call
			$
				.ajax({
					url: 'viewRiskModal',
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
								document
									.getElementById('contents').style.visibility = "visible";
							}, 1000);
						var jsonResponse = JSON
							.stringify(response);
						var obj = JSON.parse(jsonResponse);

						$('#controlId').val(obj.riskId);
						$('#recordstatus').val(
							obj.riskStatus);
						$('#controlDept').val(obj.riskDept);
						$('#controlFunction')
							.val(obj.riskFunction);
						$('#controlName').val(
							obj.riskName);
						$('#controlAssessmentFreq').val(
							obj.riskAssessmentFreq);

						var riskName = obj.riskName;
						$('#classification').val(
							obj.riskClassification);
						$('#subrisk').val(
							obj.subRiskClassification);

						$('#keymitigation').val(
							obj.keyMitigationMeasures);

						var rowCount = $('#capturetbl tr').length;
						if (rowCount == 1) {
							$('#asrDiv').hide();
						} else {
							$('#asrDiv').show();
						}

						$('#linkedModuleTbl tr:gt(0)').remove();
						$('#previousMatrix tr:gt(0)').remove();
						$('#modalFileId tr:gt(0)').remove();


						/* LInked Controls Start*/
						if (obj.riskCntrlLinkList.length > 0) {
							obj.riskCntrlLinkList
								.forEach(function(item) {
									$(
										'#linkedModuleTbl tr:last')
										.after(
											'<tr role="row" class="odd" id="row_id"><td class="sorting_1">'
											+ item.controlId
											+ '</td><td>'
											+ item.cntrlFunName
											+ '</td><td>'
											+ item.cntrlName
											+ '</td>>'
											+ '<td>'
											+ item.cntrlAssessmentFreq
											+ '</td><td class="text-capitalize"> <span class="badge text-white" style="background-color:'
											+ item.statusCol
											+ '">'
											+ item.recordStatus
											+ '</span></td>'
											+ '</tr>');
								});

							var seen = {};

							$('#linkedModuleTbl tr')
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

							$('#asrDiv').show();
						}

						/** Linked Controls End */

						/* Risk Assessment Details */

						if (obj.matrixCalcList.length > 0) {
							obj.matrixCalcList
								.forEach(function(items) {
									$(
										'#previousMatrix tr:last')
										.after(
											'<tr><td>'
											+ riskName
											+ '</td><td>'
											+ items.impactRatingScale
											+ '</td><td>'
											+ items.likelihoodRatingScale
											+ '</td><td class="text-capitalize"> <span class="badge text-white" style="background-color:'
											+ items.colorCode
											+ '">'
											+ items.assessmentRatingScale
											+ '</span></td><td>'
											+ items.assessmentDate
											+ '</td>'
											+ '<td>'
											+ items.makerId
											+ '</td></tr>');
								});

							var seen = {};

							$('#previousMatrix tr')
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

							$('#previousMatrixRow').show();
						}


						/* Risk Assessment Details End */




						if (obj.filedetailsList.length > 0) {
							obj.filedetailsList
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
											+ '<a name=' + item.fileName + ' href="#" class="btn btn-info downloadfile"><i '
											+ ' class="fas fa-download"></i></a>'
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
					error: function(xhr, status, error) {
						toastr
							.success('Some Error Occured');
					}
				});
		}

/*View Risk Modal*/
















