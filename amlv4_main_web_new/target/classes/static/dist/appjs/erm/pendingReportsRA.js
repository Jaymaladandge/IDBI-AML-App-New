//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
	} else if (state == 'complete') {
		setTimeout(function() {
			document.getElementById('interactive');
			document.getElementById('load').style.visibility = "hidden";
		}, 1000);
	}
}
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});

$(document).ready(function() {
	var deptNameTemp = $('#userDept').val();
	if (deptNameTemp != 'ERM') {
		$("#fetchDataBtn").prop("disabled", true);
		$("#status").prop("disabled", true);
		$("#officeType").prop("disabled", true);
	}
});


$(document).ready(function() {
	var deptNameTemp = $('#userDept').val();
	if (deptNameTemp != 'ERM') {
		$("#fetchDataBtn").prop("disabled", true);
		$("#module").prop("disabled", true);
		$("#officeType").prop("disabled", true);
	}
});




$("#fetchDataBtn").click(function() {

	var selectedValue = "";
	var statusValue = "P";
	var moduleName = "RA";
	var pageValJson = "";
	if ($("#officeType").val() === "") {
		toastr.error("Please Select Office Type");
	} else {
		selectedValue = $('#officeType :selected').val();
	}
	if (selectedValue != null && selectedValue != "") {
		if (statusValue != null && statusValue != "") {
			if (moduleName != null && moduleName != "") {
				pageValJson = "{\n"
					+ "    \"searchParam\": \"" + selectedValue + "\",\n"
					+ "    \"ntfModule\": \"" + moduleName + "\",\n"
					+ "    \"statusParam\":\"" + statusValue + "\"\n"
					+ "}";

				document.getElementById('load').style.visibility = "visible";

				$.ajax({
					url: "fetchRAVCAssessmentValue",
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


							var dataList = obj.ntfDtoList;

							$(".RaValueCapturetable > #tbodyRa").empty();
							$('#RaValueCapturetable').dataTable().fnClearTable();
							$('#RaValueCapturetable').DataTable().destroy();


							dataList.forEach(function(items) {
								$("<tr role='row' class='deptName' value='" + items.ntfModuleId + "' id='" + items.ntfModuleId + "' name='" + items.ntfModuleId + "'><td class='sorting_1'><a href='#' id='" + items.ntfModuleId + "' onclick='viewRaDetails(this.id)'> "
									+ items.ntfModuleId
									+ "</td><td><span value='" + items.deptName + "' id='" + items.deptName + "' name='" + items.deptName + "' class='textCapitalize'>"
									+ items.deptName
									+ "</td><td><span value='" + items.ntfValue + "' id='" + items.ntfValue + "' name='" + items.ntfValue + "' class='textCapitalize'>"
									+ items.ntfValue
									+ "</td><td><span value='" + items.ntfDate + "' id='" + items.ntfDate + "' name='" + items.ntfDate + "' class='textCapitalize'>"
									+ items.ntfDate
									+ "</td><td><span value='" + items.ofcCode + "' id='" + items.ofcCode + "' name='" + items.ofcCode + "' class='textCapitalize'>"
									+ items.ofcCode
									+ "</td>"
									+ "</tr>").appendTo(".RaValueCapturetable");

							});
							$("#RaValueCapturetable").DataTable({
								"columnDefs": [{
									orderable: false
									//targets: [6]
								}],
								"responsive": true,
								"autoWidth": true,
								"searching": true,
								"fixedHeader": true,
								"language": {
									"emptyTable": "No Data Available"
								},
								"buttons": [{
									extend: 'csvHtml5',
									title: 'Risk Appetite Value Capture Data'
								}, {
									extend: 'pdfHtml5', title: 'KRI Value Capture Data',

								}, {
									extend: 'excel',
									title: 'Risk Appetite Value Capture Data',
								}, {
									extend: 'print',
									title: 'Risk Appetite Value Capture Data'
								}]
							}).buttons().container().appendTo(
								'#RaValueCapturetable_wrapper .col-sm-12:eq(0)');


							$('#showRaTable').show();

					



					}, error: function(xhr, status, error) {
						console.log(xhr);
						console.log(status);
						console.log(error);
						toastr
							.success('Some Error Occured');
					}
				});

			}
		}
	}

});





// Modal For View Risk Appetite
function viewRaDetails(raStmtId) {
	var pageValJson = "{\"raStmtId\":" + "\""
		+ raStmtId + "\"}";
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$
		.ajax({
			url: 'viewRaModal',
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
				$('#parameterId').val(obj.raStmtId);
				$('#recordstatus').val(
					obj.raRecordStatus);
				$('#riskcate').val(obj.raRiskCate);
				$('#risksubcate')
					.val(obj.raSubCate);
				$('#riskstmtname').val(
					obj.raStmtName);
				$('#riskdescription').val(
					obj.raStmtDescription);
				$('#datapoints').val(
					obj.raStmtDataPts);
				$('#datatype')
					.val(
						obj.raToleranceValueDatatype);
				$('#datadept').val(
					obj.raResponsibleDept);
				$('#datapdept').val(
					obj.raDeptProvidingData);
				$('#capturedept').val(
					obj.raCaptureValueDept);

				$('#frequency')
					.val(
						obj.raCaptureValueFrequency);
				$('#criteria').val(
					obj.raAssessmentCriteria);
				$('#threshold').val(
					obj.raToleranceThreshold);
				$('#capturetbl tr:gt(0)').remove();
				if (obj.mvcDtoList != null
					&& obj.mvcDtoList.length > 0) {
					obj.mvcDtoList
						.forEach(function(item) {
							if (item.assessmentStatus == 'Above Tolerance') {
								tolerance = '<td><span class="badge bg-danger">Above Tolerance</span></td>';
							} else if (item.assessmentStatus == 'Within Tolerance') {
								tolerance = '<td><span class="badge bg-success">Within Tolerance</span></td>';
							}
							$(
								'#capturetbl tr:last')
								.after(
									'<tr><td class="text-capitalize">'
									+ item.deptName
									+ '</td><td>'
									+ item.toleranceValue
									+ '</td><td>'
									+ item.assessmentValue
									+ '</td>'
									+ tolerance
									+ '<td class="text-capitalize">'
									+ item.captureUserName
									+ '</td><td>'
									+ moment(
										item.captureTime)
										.format(
											'DD/MM/YYYY')
									+ '</td></tr>');
						});
					var seen = {};
					$('#capturetbl tr')
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
				}

				var rowCount = $('#capturetbl tr').length;
				if (rowCount == 1) {
					$('#asrDiv').hide();
				} else {
					$('#asrDiv').show();
				}
				$('#riskmodal').modal('show');
			},
			error: function(xhr, status, error) {
				toastr
					.error('Some Error Occured');
			}
		});
}


$(document).ready(function() {

	var rowCount = $('.benchmarkValueCapturetable tr').length;
	var rowCountRA = $('.RaValueCapturetable tr').length;
	if (rowCount == 1) {
		$('#showBmTable').hide();
	} else if (rowCount > 1) {
		$('#showBmTable').show();
	}

	if (rowCountRA == 1) {
		$('#showRaTable').hide();
	} else if (rowCountRA > 1) {
		$('#showRaTable').show();
	}

});


