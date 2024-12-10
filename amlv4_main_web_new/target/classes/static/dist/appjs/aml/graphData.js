//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
	
	$('#selectAll').click(function () {
        $('.selectAlert').prop('checked', this.checked);
    });
}


//alertList
$("#alertList").DataTable({
	"columnDefs": [{
		orderable: false,
		targets: [13,14]

	}],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo('#alertList_wrapper .col-md-6:eq(0)');

//previousAlertDtls
$("#previousAlertDtls").DataTable({
	"columnDefs": [{
		orderable: false,
		targets: [6]

	}],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#previousAlertDtls_wrapper .col-md-6:eq(0)');

// addrssDtlsModal
$("#addrssDtlsModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#addrssDtlsModal_wrapper .col-md-6:eq(0)');

// alias modal
$("#aliasDtlsTblModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#aliasDtlsTblModal_wrapper .col-md-6:eq(0)');

// sourceTblModal modal
$("#sourceTblModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#sourceTblModal_wrapper .col-md-6:eq(0)');

// positionTblModal modal
$("#positionTblModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},
	
}).buttons().container().appendTo(
		'#positionTblModal_wrapper .col-md-6:eq(0)');

// identityTblModal modal
$("#identityTblModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#identityTblModal_wrapper .col-md-6:eq(0)');

// identityTblModal modal
$("#sanctionTblModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#sanctionTblModal_wrapper .col-md-6:eq(0)');

$("#adverseTblModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#adverseTblModal_wrapper .col-md-6:eq(0)');

$("#pepTblModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#pepTblModal_wrapper .col-md-6:eq(0)');

$("#pepSubTblModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},
	
}).buttons().container().appendTo(
		'#pepSubTblModal_wrapper .col-md-6:eq(0)');

// enforcementTblModal
$("#enforcementTblModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#enforcementTblModal_wrapper .col-md-6:eq(0)');

// soeTblModal
$("#soeTblModal").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#soeTblModal_wrapper .col-md-6:eq(0)');

// relationsDtls
$("#relationsDtls").DataTable({
	"columnDefs": [],
	"order": [0, "asc"],
	"responsive": false,
	"lengthMenu": [25, 50, 75, 100],
	"autoWidth": false,
	"searching": true,
	"fixedHeader": true,
	//"buttons": ["csv", "excel"],
	"language": {
		"emptyTable": "No Data Available",
		"search": "Search:"
	},

}).buttons().container().appendTo(
	'#relationsDtls_wrapper .col-md-6:eq(0)');


$(document).ready(function() {
	$('.acctTab').each(function(i, obj) {
		var cust = $(this).attr('id');
		if (cust.indexOf(('AlertTab')) != -1) {
			$(function() {
				$('#' + cust.trim()).DataTable({
					"order": [0, "desc"],
					"columnDefs": [{
						orderable: false,
						targets: [5, 7, 9, 0, 1, 3, 4, 5, 8]
					}],
					"responsive": false,
					"lengthMenu": [3, 6, 9, 20],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					}
				});
			});
		}
	});
	//Date range picker
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY'
	});

	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY'
	});
});

/* Customer Modal Start */
$('a.custModel')
	.click(
		function() {
			var custId = $(this).attr('id');
			var pageValJson = "{\"custId\":" + "\""
				+ custId + "\"}";
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'CustViewModel',
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
						console.log("json Response "
							+ jsonResponse)
						var obj = JSON.parse(jsonResponse);
						console.log("obj " + obj);
						var i = 0;
						$("#custIdLabel").text(
							obj.custId);
						$("#custFullName").val(
							obj.custFullName);
						$("#custPanNo")
							.val(obj.custPanNo);
						$("#custOccupation").val(
							obj.custOccupation);
						$("#custIndFlg").val(
							obj.custType);
						if (obj.custIndFlg == 'I') {
							$("#custAnnualIncome").val(obj.custAnnualIncome);
							$("#custMinFlg").val(obj.custMinorFlg);
							$("#custNreFlg").val(obj.custNreFlg);
							$("#custGender").val(obj.custGender);
							$("#indRow").show();
						} else {
							$("#custTurnOver").val(obj.custTurnover);
							$("#compId").val(obj.companyId);
							$("#dateOfReg").val(obj.dateOfRegistration);
							$("#placeOfReg").val(obj.placeOfRegistration);
							$("#nidRow").show();
						}
						$("#custConstitution").val(
							obj.custConstitution);
						$("#custOpnDate").val(
							obj.custOpnDate);
						$("#custRisk").val(
							obj.actualRisk);
						$("#custRisk").addClass(obj.custRisk);
						$("#lastKycDate").val(
							obj.custKycDate);
						var custAddress = obj.custAddressDtoList;
						$(".custAddressDtls > #tbodyAddressR").empty();

						// //alert('thresholdData '+thresholdData);
						custAddress.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.city
								+ "</td><td><span name='state' value='" + items.state + "' class='textCapitalize'>"
								+ items.state
								+ "</td><td><span name='country' value='" + items.country + "' class='textCapitalize'>"
								+ items.country
								+ "</td><td><span name='zipcode' value='" + items.zip + "' class='textCapitalize'>"
								+ items.zip
								+ "</td><td><span name='addressCategory' value='" + items.addressCategory + "' class='textCapitalize'>"
								+ items.addressCategory
								+ "</td><td><span name='address' value='" + items.addressLine1 + "' class='textCapitalize'>"
								+ items.addressLine1
								+ "</td></tr>").appendTo("#tbodyAddressR");
						});
						$(".custDocDtls > #tbodyDocR").empty();
						obj.custDocDtoList.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.docCode
								+ "</td><td><span class='textCapitalize'>" + items.docDesc + "</td><td><span   class='textCapitalize'>"
								+ items.docValue + "</td><td><span  class='textCapitalize'>" + items.docIssueCntry
								+ "</td><td><span class='textCapitalize'>" + items.docIssuePlace + "</td><td><span  class='textCapitalize'>"
								+ items.docIssueDate
								+ "</td></tr>").appendTo("#tbodyDocR");
						});
						$(".custContactDtls > #tbodyContactR").empty();
						obj.custPhoneEmailDtlsDtos.forEach(function(items) {
							$("<tr role='row'id='row_id'><td class='sorting_1'>"
								+ items.recordType
								+ "</td><td><span class='textCapitalize'>" + items.recordValue + "</td></tr>").appendTo("#tbodyContactR");
						});
					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});
			$('#viewCustModel').modal('show');
		});


/* Customer Modal End */

/* View Entity Profile Start */
$('.alertModal').click(
	function() {
		$('#alertModalView').modal('show');

		//$("#alertModalView").show();
	})


var stack = [];
// viewEntityProfile
function openEntityModal(entityId) {

	//alert("entity id in modal: "+entityId);
	var pageValJson = "{\"entityId\":" + "\""
		+ entityId + "\"}";

	//alert("pageValJson " + pageValJson);
	document.getElementById('load').style.visibility = "visible";

	// ajax call
	$
		.ajax({
			url: 'viewEntityProfile',
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
				console.log("json Response "
					+ jsonResponse)
				var obj = JSON.parse(jsonResponse);

				console.log("obj " + obj);
				var i = 0;

				$("#listId").text(
					entityId);

				$("#entityName").val(convertTextCapitalForText(obj.nsEntityListDto[0].name));

				$("#entityType").val(convertTextCapitalForText(obj.nsEntityListDto[0].entityTypeDesc));

				$("#gender")
					.val(convertTextCapitalForText(obj.nsEntityListDto[0].gender));

				$("#entBirthDay").val(convertTextCapitalForText(
					obj.nsEntityListDto[0].birthday));

				$("#entBirthMonth").val(convertTextCapitalForText(obj.nsEntityListDto[0].birthMonth));

				$("#entBirthYear").val(convertTextCapitalForText(obj.nsEntityListDto[0].birthYear));
				
				$("#posRemark").val(convertTextCapitalForText(obj.nsEntityListDto[0].remark));

				//checkbox code
				function generateCheckboxes() {
					const nsEntity = obj.nsEntityListDto[0];
					const checkboxCode = `
        <div class="row mt-3">
            <div class="col-sm-2">
                <div class="form-group">
                    <div class="custom-control custom-switch custom-switch-${nsEntity.indianFlag === 'N' ? 'off-danger' : 'on-success'}">
                        <input type="checkbox" class="custom-control-input" id="indianFlg" ${nsEntity.indianFlag === 'N' ? '' : 'checked'} disabled>
                        <label class="custom-control-label" for="indianFlg">Is Indian?</label>
                    </div>
                </div>
            </div>
            <div class="col-sm-2">
                <div class="form-group">
                    <div class="custom-control custom-switch custom-switch-${nsEntity.isSanctionFlag === 'N' ? 'off-danger' : 'on-success'}">
                        <input type="checkbox" class="custom-control-input" id="sanction" ${nsEntity.isSanctionFlag === 'N' ? '' : 'checked'} disabled>
                        <label class="custom-control-label" for="sanction">Is Sanction?</label>
                    </div>
                </div>
            </div>
            <div class="col-sm-2">
                <div class="form-group">
                    <div class="custom-control custom-switch custom-switch-${nsEntity.entityPepFlag === 'N' ? 'off-danger' : 'on-success'}">
                        <input type="checkbox" class="custom-control-input" id="pep" ${nsEntity.entityPepFlag === 'N' ? '' : 'checked'} disabled>
                        <label class="custom-control-label" for="pep">Is PEP?</label>
                    </div>
                </div>
            </div>
            <div class="col-sm-2">
                <div class="form-group">
                    <div class="custom-control custom-switch custom-switch-${nsEntity.entityAdvMediasFlag === 'N' ? 'off-danger' : 'on-success'}">
                        <input type="checkbox" class="custom-control-input" id="adverse" ${nsEntity.entityAdvMediasFlag === 'N' ? '' : 'checked'} disabled>
                        <label class="custom-control-label" for="adverse">Is Adverse Media?</label>
                    </div>
                </div>
            </div>
        </div>
    `;
					return checkboxCode;
				}
				const checkboxesDiv = document.getElementById('appendedCheckboxes');
				if (checkboxesDiv) {
					checkboxesDiv.innerHTML = generateCheckboxes();
				}


				var addcount = 0;
				// addrssDtlsModal
				$('#addrssDtlsModal').dataTable()
					.fnClearTable();
				$('#addrssDtlsModal').DataTable()
					.destroy();
				$(".addrssDtlsModaltbody").empty();
				obj.addressListDto
					.forEach(function(item) {
						addcount++;

						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ addcount
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.addressTypeDesc)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.address1)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.city)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.stateProvinceRegion)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.postalCode)
							+ "</td>"

							+ "<td>"
							+ handleNullConditionForStd(item.isoStandard)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.country)
							+ "</td>"

							+ "</tr>")
							.appendTo(
								".addrssDtlsModaltbody");
					});
				
				var linkText = "Address Details (" + addcount + ")";
				$(".add-link").text(linkText);
				if (addcount === 0) {
					$(".add-link").text(linkText).removeAttr("href").addClass("disabled");
				} else {
					$(".add-link").text(linkText).attr("href", "#addressModal").attr("data-toggle", "tab").removeClass("disabled");
				}

				$("#addrssDtlsModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#addrssDtlsModal_wrapper .col-md-6:eq(0)');

				/* Sanction List */
				var sancount = 0;

				// sanctionTblModal
				$('#sanctionTblModal').dataTable()
					.fnClearTable();
				$('#sanctionTblModal').DataTable()
					.destroy();

				$(".sanctionTblModalBody").empty();
				obj.sanctionListDto
					.forEach(function(item) {
						sancount++;

						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ sancount
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.subcategoryLabel)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.sourceName)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.sourceNameAbbrev)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.administrativeUnitName)
							+ "</td>"

							+ "<td>"
							+ handleNullConditionForStd(item.isoStandard)
							+ "</td>"

							+ "</tr>")
							.appendTo(
								".sanctionTblModalBody");
					});
				
				var linkText = "Sanction List (" + sancount + ")";
				$(".sanc-link").text(linkText);
				if (sancount === 0) {
					$(".sanc-link").text(linkText).removeAttr("href").addClass("disabled");
				} else {
					$(".sanc-link").text(linkText).attr("href", "#sanctionModal").attr("data-toggle", "tab").removeClass("disabled");
				}

				// sanctionTblModal modal
				$("#sanctionTblModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#sanctionTblModal_wrapper .col-md-6:eq(0)');


				/* Relation Details List */
				var relcount = 0;
				//relationsDtls
				$('#relationsDtls').dataTable()
					.fnClearTable();
				$('#relationsDtls').DataTable()
					.destroy();

				$(".tbodyAddressR").empty();
				obj.relationListDto
					.forEach(function(item) {
						relcount++;
						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ relcount
							+ "</td>"

							+ "<td><a class='badge bg-info viewEntityProfile' id=" + item.entityId + ">"
							+ convertTextCapital(item.entityId)
							+ "</a></td>"

							+ "<td>"
							+ convertTextCapital(item.entityName)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.entityDesc)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.gender)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.groupDescription)
							+ "</td>"

							+ "<td>"
							+ convertTextCapital(item.relationshipDescription)
							+ "</td>"



							+ "</tr>")
							.appendTo(
								".tbodyAddressR");
					});

				$("#relationsDtls").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [10, 20, 30, 40, 50],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#relationsDtls_wrapper .col-md-6:eq(0)');

				/* Adverse Details List */
				var advcount = 0;

				//adverseModaltbody
				// adverseTblModal
				$('#adverseTblModal').dataTable()
					.fnClearTable();
				$('#adverseTblModal').DataTable()
					.destroy();

				$(".adverseModaltbody").empty();
				obj.adverseMediaListDto
					.forEach(function(item) {
						advcount++;

						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ advcount
							+ "</td>"

							+ "<td>" + convertTextCapital(item.adverseMediaDescription) + "</td>"
							+ "<td>" + convertTextCapital(item.subcategoryLabel) + "</td>"

							+ "</tr>")
							.appendTo(
								".adverseModaltbody");
					});
				
				var linkText = "Adverse Media (" + advcount + ")";
				$(".adv-link").text(linkText);
				if (advcount === 0) {
					$(".adv-link").text(linkText).removeAttr("href").addClass("disabled");
				} else {
					$(".adv-link").text(linkText).attr("href", "#adverseModal").attr("data-toggle", "tab").removeClass("disabled");
				}

				$("#adverseTblModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#adverseTblModal_wrapper .col-md-6:eq(0)');

				/*//advsub
				var advsubcount = 0;
				$(".advSubTblModalBody").empty();
				$('#advSubTblModal').dataTable()
					.fnClearTable();
				$('#advSubTblModal').DataTable()
					.destroy();

				obj.advSubListDto
					.forEach(function(item) {
						advsubcount++;
						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ advsubcount
							+ "</td>"
							+ "<td>" + convertTextCapital(item.subcategoryLabel) + "</td>"
							+ "</tr>")
							.appendTo(
								".advSubTblModalBody");
					});

				$("#advSubTblModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#advSubTblModal_wrapper .col-md-6:eq(0)');
				//./advsub
*/				
				//pepModaltbody
				var pepcount = 0;
				$(".pepTblModalBody").empty();
				$('#pepTblModal').dataTable()
					.fnClearTable();
				$('#pepTblModal').DataTable()
					.destroy();

				obj.pepListDto
					.forEach(function(item) {
						pepcount++;
						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ pepcount
							+ "</td>"
							+ "<td>" + convertTextCapital(item.governingInstitution) + "</td>"

							+ "<td>" + convertTextCapital(item.governingRole) + "</td>"
							+ "<td>" + convertTextCapital(item.pepAdminLevelDesc) + "</td>"
							+ "<td>" + convertTextCapital(item.isPrimaryPep) + "</td>"
							+ "<td>" + convertTextCapital(item.isActivePep) + "</td>"
							
							+ "<td>" + convertTextCapital(item.subcategoryLabel) + "</td>"
							+ "<td>" + handleNullCondition(item.subcategoryDescription) + "</td>"
							
							+ "<td>" + convertTextCapital(item.isInCountryPepOnly) + "</td>"

							+ "<td>" + convertTextCapital(item.effectiveTypeDesc) + "</td>"
							+ "<td>" + convertTextCapital(item.effectiveYear) + "</td>"
							+ "<td>" + convertTextCapital(item.effectiveMonth) + "</td>"

							+ "<td>" + convertTextCapital(item.effectiveDay) + "</td>"

							+ "<td>" + convertTextCapital(item.expirationDateTypeDesc) + "</td>"
							+ "<td>" + convertTextCapital(item.expirationYear) + "</td>"
							+ "<td>" + convertTextCapital(item.expirationMonth) + "</td>"
							+ "<td>" + convertTextCapital(item.expirationDay) + "</td>"

							+ "</tr>")
							.appendTo(
								".pepTblModalBody");
					});
				
				// Adding count to the link text
				var linkText = "PEP (" + pepcount + ")";
				$(".pep-link").text(linkText);
				
				if (pepcount === 0) {
					$(".pep-link").text(linkText).removeAttr("href").addClass("disabled");
				} else {
					$(".pep-link").text(linkText).attr("href", "#pepModal").attr("data-toggle", "tab").removeClass("disabled");
				}


				$("#pepTblModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#pepTblModal_wrapper .col-md-6:eq(0)');

				/*//pepsub
				var pepsubcount = 0;
				$(".pepSubTblModalBody").empty();
				$('#pepSubTblModal').dataTable()
					.fnClearTable();
				$('#pepSubTblModal').DataTable()
					.destroy();

				obj.pepSubListDto
					.forEach(function(item) {
						pepsubcount++;
						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ pepsubcount
							+ "</td>"
							+ "<td>" + convertTextCapital(item.subcategoryLabel) + "</td>"
							+ "<td>" + convertTextCapital(item.subcategoryDescription) + "</td>"
							+ "</tr>")
							.appendTo(
								".pepSubTblModalBody");
					});

				$("#pepSubTblModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#pepSubTblModal_wrapper .col-md-6:eq(0)');
				//./pepsub
*/
				// Enforcement

				var enfcount = 0;
				// enforcementTblModal
				$('#enforcementTblModal').dataTable()
					.fnClearTable();
				$('#enforcementTblModal').DataTable()
					.destroy();
				$(".enforcementTblModalTbody").empty();
				obj.enforceListDto
					.forEach(function(item) {
						enfcount++;

						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ enfcount
							+ "</td>"

							+ "<td>" + convertTextCapital(item.enforcementDescription) + "</td>"
							+ "<td>" + convertTextCapital(item.sourceName) + "</td>"
							+ "<td>" + convertTextCapital(item.sourceNameAbbrev) + "</td>"
							+ "<td>" + convertTextCapital(item.administrativeUnitName) + "</td>"
							+ "<td>" + handleNullConditionForStd(item.isoStandard) + "</td>"


							+ "</tr>")
							.appendTo(
								".enforcementTblModalTbody");
					});
				
				var linkText = "Enforcement Details (" + enfcount + ")";
				$(".enf-link").text(linkText);
				
				if (enfcount === 0) {
					$(".enf-link").text(linkText).removeAttr("href").addClass("disabled");
				} else {
					$(".enf-link").text(linkText).attr("href", "#enforcementDetails").attr("data-toggle", "tab").removeClass("disabled");
				}

				$("#enforcementTblModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#enforcementTblModal_wrapper .col-md-6:eq(0)');


				// SOE ITEM
				var soecount = 0;
				$('#soeTblModal').dataTable()
					.fnClearTable();
				$('#soeTblModal').DataTable()
					.destroy();
				$(".soeTblModaltblBody").empty();
				obj.soedomListDto
					.forEach(function(item) {
						soecount++;
						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ soecount
							+ "</td>"
							+ "<td>" + convertTextCapital(item.soeDomainDescription) + "</td>"
							+ "</tr>")
							.appendTo(
								".soeTblModaltblBody");
					});
				
				var linkText = "Soe Details (" + soecount + ")";
				$(".soe-link").text(linkText);
				if (soecount === 0) {
					$(".soe-link").text(linkText).removeAttr("href").addClass("disabled");
				} else {
					$(".soe-link").text(linkText).attr("href", "#soeDetails").attr("data-toggle", "tab").removeClass("disabled");
				}

				$("#soeTblModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#soeTblModal_wrapper .col-md-6:eq(0)');
				
				
				//alias
				var aliascount = 0;
				$('#aliasDtlsTblModal').dataTable()
					.fnClearTable();
				$('#aliasDtlsTblModal').DataTable()
					.destroy();
				$(".aliasDtlsTblModaltbody").empty();
				obj.aliasListDto
					.forEach(function(item) {
						aliascount++;

						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ aliascount
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.aliasName)
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.aliasTypeDesc)
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.name)
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.englishDescription)
							+ "</td>"
							+ "</tr>")
							.appendTo(
								".aliasDtlsTblModaltbody");
					});
				
				var linkText = "Alias Details (" + aliascount + ")";
				$(".alias-link").text(linkText);
				if (aliascount === 0) {
					$(".alias-link").text(linkText).removeAttr("href").addClass("disabled");
				} else {
					$(".alias-link").text(linkText).attr("href", "#aliasModal").attr("data-toggle", "tab").removeClass("disabled");
				}

				// alias modal
				$("#aliasDtlsTblModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#aliasDtlsTblModal_wrapper .col-md-6:eq(0)');
				
				//country
				var cntrycount = 0;
				// countryTblModal
				$('#countryTblModal').dataTable()
					.fnClearTable();
				$('#countryTblModal').DataTable()
					.destroy();
				$(".countryTblModalTbody").empty();
				obj.countryAscListDto
					.forEach(function(item) {
						cntrycount++;
						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ cntrycount
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.associationTypeDesc)
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.administrativeUnitName)
							+ "</td>"
							+ "<td>"
							+ handleNullConditionForStd(item.isoStandard)
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.ownershipPercentageCalc)
							+ "</td>"
							+ "</tr>")
							.appendTo(
								".countryTblModalTbody");
					});
				
				var linkText = "Country Association (" + cntrycount + ")";
				$(".country-link").text(linkText);
				if (cntrycount === 0) {
					$(".country-link").text(linkText).removeAttr("href").addClass("disabled");
				} else {
					$(".country-link").text(linkText).attr("href", "#countryAssocModal").attr("data-toggle", "tab").removeClass("disabled");
				}

				$("#countryTblModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#countryTblModal_wrapper .col-md-6:eq(0)');
				
				//identity
				var identicount = 0;
				// identityTblModal
				//$('#identityTblModal').dataTable()
				//	.fnClearTable();
				//$('#identityTblModal').DataTable()
				//	.destroy();
				$(".identityTblModalBody").empty();
				obj.identityListDto
					.forEach(function(item) {
						identicount++;
						var country = convertTextCapital(item.country);
						var isoStandard = handleNullConditionForStd(item.isoStandard);
						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ identicount
							+ "</td>"
							+ "<td class='text-ca'>"
							+ country
							+ "</td>"
							+ "<td>"
							+ isoStandard
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.identificationIssuer)
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.identificationTypeDesc)
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.identificationNumber)
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.issueYear)
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.issueMonth)
							+ "</td>"
							+ "<td> " + convertTextCapital(item.issueDay) + " </td>"
							+ "<td>"
							+ convertTextCapital(item.expirationYear)
							+ "</td>"
							+ "<td>"
							+ convertTextCapital(item.expirationMonth)
							+ "</td>"
							+ "<td> " + convertTextCapital(item.expirationDay) + " </td>"
							+ "</tr>")
							.appendTo(
								".identityTblModalBody");
					});
				
				var linkText = "Identity Details (" + identicount + ")";
				$(".identi-link").text(linkText);
				if (identicount === 0) {
					$(".identi-link").text(linkText).removeAttr("href").addClass("disabled");
				} else {
					$(".identi-link").text(linkText).attr("href", "#identityDetails").attr("data-toggle", "tab").removeClass("disabled");
				}
				//alert("0");
				// identityTblModal modal
//				$("#identityTblModal").DataTable({
//					"columnDefs": [],
//					"order": [0, "asc"],
//					"responsive": false,
//					"lengthMenu": [25, 50, 75, 100],
//					"autoWidth": false,
//					"searching": true,
//					"fixedHeader": true,
//					//"buttons": ["csv", "excel"],
//					"language": {
//						"emptyTable": "No Data Available",
//						"search": "Search:"
//					},
//
//				}).buttons().container().appendTo(
//					'#identityTblModal_wrapper .col-md-6:eq(0)');
				
				//source
				var srccount = 0;
				// sourceTblModal
				
				$('#sourceTblModal').dataTable()
					.fnClearTable();
				$('#sourceTblModal').DataTable()
					.destroy();
				$(".sourceTblModalBody").empty();
				obj.sourceListDto
					.forEach(function(item) {
						srccount++;

						$(
							"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
							+ srccount
							+ "</td>"
							+ "<td> <a  class='text-lowercase' href=" + item.sourceUri + " target='_blank'>"
							+ item.sourceUri
							+ " <em class='fas fa-external-link-alt ml-1'></em></a></td>"
							+ "</tr>")
							.appendTo(
								".sourceTblModalBody");
					});
				
				var linkText = "Source Details (" + srccount + ")";
				$(".source-link").text(linkText);
				if (srccount === 0) {
					$(".source-link").text(linkText).removeAttr("href").addClass("disabled");
				} else {
					$(".source-link").text(linkText).attr("href", "#sourceDetails").attr("data-toggle", "tab").removeClass("disabled");
				}

				$("#sourceTblModal").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					//"buttons": ["csv", "excel"],
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#sourceTblModal_wrapper .col-md-6:eq(0)');
				

				//1st row
				if(addcount>0) {
					$('.profile-link1').removeClass('active');
					$('a[href="#addressModal"]').closest('.profile-link1').addClass('active');
					$('.profile-pane1').removeClass('active');
					$('#addressModal').closest('.profile-pane1').addClass('active');
				}else if(aliascount>0) {
					$('.profile-link1').removeClass('active');
					$('a[href="#aliasModal"]').closest('.profile-link1').addClass('active');
					$('.profile-pane1').removeClass('active');
					$('#aliasModal').closest('.profile-pane1').addClass('active');
				}else if(cntrycount>0) {
					$('.profile-link1').removeClass('active');
					$('a[href="#countryAssocModal"]').closest('.profile-link1').addClass('active');
					$('.profile-pane1').removeClass('active');
					$('#countryAssocModal').closest('.profile-pane1').addClass('active');
				}else if(identicount>0) {
					$('.profile-link1').removeClass('active');
					$('a[href="#identityDetails"]').closest('.profile-link1').addClass('active');
					$('.profile-pane1').removeClass('active');
					$('#identityDetails').closest('.profile-pane1').addClass('active');
				}else if(srccount>0) {
					$('.profile-link1').removeClass('active');
					$('a[href="#sourceDetails"]').closest('.profile-link1').addClass('active');
					$('.profile-pane1').removeClass('active');
					$('#sourceDetails').closest('.profile-pane1').addClass('active');
				}
				//2nd row
				if(pepcount>0) {
					$('.profile-link2').removeClass('active');
					$('a[href="#pepModal"]').closest('.profile-link2').addClass('active');
					$('.profile-pane2').removeClass('active');
					$('#pepModal').closest('.profile-pane2').addClass('active');
				}else if(sancount>0) {
					$('.profile-link2').removeClass('active');
					$('a[href="#sanctionModal"]').closest('.profile-link2').addClass('active');
					$('.profile-pane2').removeClass('active');
					$('#sanctionModal').closest('.profile-pane2').addClass('active');
				}else if(advcount>0) {
					$('.profile-link2').removeClass('active');
					$('a[href="#adverseModal"]').closest('.profile-link2').addClass('active');
					$('.profile-pane2').removeClass('active');
					$('#adverseModal').closest('.profile-pane2').addClass('active');
				}else if(enfcount>0) {
					$('.profile-link2').removeClass('active');
					$('a[href="#enforcementDetails"]').closest('.profile-link2').addClass('active');
					$('.profile-pane2').removeClass('active');
					$('#enforcementDetails').closest('.profile-pane2').addClass('active');
				}else if(soecount>0) {
					$('.profile-link2').removeClass('active');
					$('a[href="#soeDetails"]').closest('.profile-link2').addClass('active');
					$('.profile-pane2').removeClass('active');
					$('#soeDetails').closest('.profile-pane2').addClass('active');
				}
							
			},
			error: function(xhr, status, error) {
				toastr.error('Some Error Occured');
			}
		});
	
	/* Alias Details List 
	 $('.alias-tab').click(function() {
		 aliasDetails(entityId);
	 });
	 
	  Country Details List 	 
	 $('.country-tab').click(function() {
		 countryDetails(entityId);
	 });
	 
	  Identity Details List 	 
	 $('.identity-tab').click(function() {
		 identityDetails(entityId);
	 });
	 
	  Source Details List 	 
	 $('.source-tab').click(function() {
		 sourceDetails(entityId);
	 });
	 
	  Position Details List 	 
	 $('.position-tab').click(function() {
		 positionDetails(entityId);
	 });*/
	
	$('#viewEntityModel').modal('show');
}

/* View Entity Profile End*/

/* Alias Details function */
/*function aliasDetails(entityId){

	var pageValJson = "{\"refEntityId\":" + "\""
		+ entityId + "\"}";

	document.getElementById('load').style.visibility = "visible";

	// ajax call
	$
		.ajax({
			url: 'viewAliasDetails',
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
				console.log("json Response "
					+ jsonResponse)
				var obj = JSON.parse(jsonResponse);
				
				
			},
			error: function(xhr, status, error) {
				toastr.error('Some Error Occured');
			}
		});
}
 Country Details function 
function countryDetails(entityId){
	
	var pageValJson = "{\"refEntityId\":" + "\""
			+ entityId + "\"}";
	
	document.getElementById('load').style.visibility = "visible";
	
	// ajax call
	$
	.ajax({
		url: 'viewCountryDetails',
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
			console.log("json Response "
					+ jsonResponse)
			var obj = JSON.parse(jsonResponse);
			
			
		},
		error: function(xhr, status, error) {
			toastr.error('Some Error Occured');
		}
	});
}
 Identity Details function 
function identityDetails(entityId){
	
	var pageValJson = "{\"refEntityId\":" + "\""
			+ entityId + "\"}";
	
	document.getElementById('load').style.visibility = "visible";
	
	// ajax call
	$
	.ajax({
		url: 'viewIdentityDetails',
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
			console.log("json Response "
					+ jsonResponse)
			var obj = JSON.parse(jsonResponse);
			
			
		},
		error: function(xhr, status, error) {
			toastr.error('Some Error Occured');
		}
	});
}
 Source Details function 
function sourceDetails(entityId){
	
	var pageValJson = "{\"refEntityId\":" + "\""
			+ entityId + "\"}";
	
	document.getElementById('load').style.visibility = "visible";
	
	// ajax call
	$
	.ajax({
		url: 'viewSourceDetails',
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
			console.log("json Response "
					+ jsonResponse)
			var obj = JSON.parse(jsonResponse);
			
			
		},
		error: function(xhr, status, error) {
			toastr.error('Some Error Occured');
		}
	});
}
 Position Details function 
function positionDetails(entityId){
	
	var pageValJson = "{\"refEntityId\":" + "\""
			+ entityId + "\"}";
	
	document.getElementById('load').style.visibility = "visible";
	
	// ajax call
	$
	.ajax({
		url: 'viewPositionDetails',
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
			console.log("json Response "
					+ jsonResponse)
			var obj = JSON.parse(jsonResponse);
			
			var count = 0;
			// positionTblModal
			$(".positionTblModalBody").empty();
			$('#positionTblModal').dataTable()
			.fnClearTable();
			$('#positionTblModal').DataTable()
			.destroy();
			
			obj.positionList
			.forEach(function(item) {
				count++;				
				$(
					"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
					+ count
					+ "</td>"
					+ "<td>"
					+ convertTextCapital(item.position)
					+ "</td>"
					+ "</tr>")
				.appendTo(
						".positionTblModalBody");
			});
			
			$("#positionTblModal").DataTable({
				"columnDefs": [],
				"order": [0, "asc"],
				"responsive": false,
				"lengthMenu": [25, 50, 75, 100],
				"autoWidth": false,
				"searching": true,
				"fixedHeader": true,
				//"buttons": ["csv", "excel"],
				"language": {
					"emptyTable": "No Data Available",
					"search": "Search:"
				},
				
			}).buttons().container().appendTo(
					'#positionTblModal_wrapper .col-md-6:eq(0)');
		},
		error: function(xhr, status, error) {
			toastr.error('Some Error Occured');
		}
	});
}*/


$('#modalCloseButton').on('click', function() {
	stack.pop();

	if (stack.length > 0) {
		var entityId = stack[stack.length - 1];
		//$('#viewEntityModel').modal('hide');
		$('#viewEntityModel').addClass('show');
		openEntityModal(entityId);
	} else {
		$('#viewEntityModel').modal('hide');
	}
});

$('#viewEntityModel').on('#closModalT', function() {

	stack = [];
	$('#viewEntityModel').addClass('show');

});

$(document).on('click', '.viewEntityProfile', function() {
	
	var entityId = $(this).attr('id');
	stack.push(entityId);
	
	openEntityModal(entityId);
});

$('a.ruleModel')
	.click(
		function() {
			var ruleId = $(this).attr('id');
			var pageValJson = "{\"ruleId\":" + "\""
				+ ruleId + "\"}";

			console.log(pageValJson);
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'RuleViewModel',
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
						console.log("json Response "
							+ jsonResponse)
						var obj = JSON.parse(jsonResponse);
						console.log("obj " + obj);
						var i = 0;
						$("#ruleIdLabel").text(
							obj.ruleId);
						$("#ruleDesc").text(
							obj.ruleDesc);
						$("#ruleFrequency")
							.val(obj.ruleFrequency);
						$("#ruleClassification").val(
							obj.ruleClassification);
						$("#ruleIndicator").val(
							obj.ruleIndicator);
						$("#ruleCategory").val(
							obj.ruleCategory);
						$("#ruleImpact").val(
							obj.ruleImpact);
						$("#ruleLikelihood")
							.val(obj.ruleLikelihood);
						$("#inherentRisk").val(
							obj.inherentRisk);
						$("#ruleExeFlg").val(
							obj.ruleExeFlg);
						$("#nextExeFlg").val(
							obj.nextExeFlg);
						$("#lastExeFlg").val(
							obj.lastExeFlg);
						$("#ruleExpiryDate")
							.val(obj.ruleExpiryDate);
						$("#ruleConstitution").val(
							obj.ruleConstitution);
						$("#ruleTrnChannel").val(
							obj.ruleTrnChannel);
						$("#ruleTrnSubChannel").val(
							obj.ruleTrnSubChannel);
						$("#makerId").val(
							obj.makerId);
						$("#makerTimeStamp")
							.val(obj.makerTimeStamp);
						$("#lastUserId").val(
							obj.lastUserId);
						$("#lastUpdateTime").val(
							obj.lastUpdateTime);
						$("#actionStatus").val(
							obj.actionStatus);
						$("#recordStatus").val(
							obj.recordStatus);
						$("#ruleAggType")
							.val(obj.ruleAggType);
						var thresholdData = obj.ruleThresholdDtoList;
						$(".ruleThresDtls > #tbodyR").empty();

						// //alert('thresholdData '+thresholdData);
						thresholdData.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.ruleId
								+ "</td><td><span name='incidentName' value='" + items.ruleDesc + "' class='textCapitalize'>"
								+ items.ruleParameter
								+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleClassification + "' class='textCapitalize'>"
								+ items.ruleKey
								+ "</td></tr>").appendTo("#tbodyR");
						});
						var riskData = obj.ruleRiskDefinationDtoList;
						$(".ruleRiskDtls > #tbodyRiskR").empty();

						// //alert('thresholdData '+thresholdData);
						riskData.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.ruleRiskId
								+ "</td><td><span name='incidentName' value='" + items.ruleRiskParameter + "' class='textCapitalize'>"
								+ items.ruleRiskParameter
								+ "</td><td><span name='operatingOfcLocation' value='" + items.ruleRiskValue + "' class='textCapitalize'>"
								+ items.ruleRiskValue
								+ "</td></tr>").appendTo("#tbodyRiskR");
						});
						//	$("#ruleThresRow").css("display", "block");

					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});
			$('#viewRuleModel').modal('show');
		});

/*TextArea validation*/
function checkTextAlertArea(textAreaName, data) {
	let msg = "SUCCESS";
	if (data == '') {
		msg = textAreaName + " cannot be blank.";
	} else if (data.length < 10) {
		msg = textAreaName + " should be greater than 10 letters.";
	} else if (/[!\^'",[\]\<>?|]/.test(data)) {
		msg = textAreaName + " cannot contain special characters.";
	} else if (data.indexOf('\'') >= 0) {
		msg = textAreaName + " should not contains single quote.";
	}
	return msg;
}


function executeSubmitNew(status, action) {
	$('#action').val(status);
	$('#actModal').text(action);
	$('#closemodal').modal('show');
}

//Save Comment
function saveComment() {
    var checkboxState = $("#actionSwitch").prop('checked');
    var alertAction = checkboxState ? "U" : "C";
    var commentText = $("#alertCommentModal").val();
    var checkComment = checkTextAlertArea("User Comment", commentText);

    if (checkComment === 'SUCCESS') {
        var selectedCheckboxes = $(".selectAlert:checked");

        commentText = commentText.replace(/\"/g, ''); //.replace(/[^\x00-\x7F]/g, "");
        commentText = commentText.replace(/[^\x00-\x7F]/g, "");
        commentText = commentText.replace(/(\"\r\n|\n|\r)/gm, "")
        var counter = 0;
        		
        /*new loigc*/
        $('#alertList tr td .selectAlert').each(function() {
        	
        	var idWithText = $("#hiddenAlertId").val();
        	var alertId = idWithText.split("~")[1];
        	
        	if($(this).prop('checked')) {
        		//alert("alert checked");
        		
        		alertId = $(this).attr('id');
            	var pageValJson = "{\n" +
            			"    \"alertId\": \"" + alertId + "\",\n" +
            			"    \"userComment\": \"" + commentText + "\",\n" +
            			"    \"action\": \"" + alertAction + "\"\n" +
            			"}";

            	/*$('#alertCommentId~' + alertId).each(function() {
        			$(this).val(encodeURIComponent(JSON.stringify(pageValJson)));
        		});*/

            	//$('#alertCommentId~' + alertId).val(encodeURIComponent(JSON.stringify(pageValJson)));
            	
            		$('#alertList tr td input[id="alertCommentId~' + alertId + '"]').each(function() {
            			$(this).val(encodeURIComponent(JSON.stringify(pageValJson)));
            		});

            		// Following code is used for Color Change of COmment Box
            		$('#alertList tr td .suspiciousCls').each(function() {

            			var currentId = this.id;
            			if (currentId.split("~")[1] == alertId) {

            				$(this).data('checkboxState', checkboxState);
            				$(this).data('commentText', commentText);
 
            				if (alertAction == "U") {
            					//$('#comment~' + alertId).addClass("bg-danger");
            					$(this).removeClass("bg-warning");
            					$(this).addClass("bg-danger");
            				} else {
            					$(this).removeClass("bg-warning");
            					$(this).removeClass("bg-danger");
            					$(this).addClass("bg-success");

            				}

            			} else {
            				//////alert("Id Not Matched");
            			}
            		});
        		counter++;
        	}else {
        		//alert("alert unchecked");
        	}
        	        	
        	$(this).prop('checked', false);
        	$('#commentModal').modal('hide');
        });
        
        // If not any checkbox selected
        if(counter == 0 && !$(this).prop('checked')) {
        	var idWithText = $("#hiddenAlertId").val();
        	var alertId = idWithText.split("~")[1];
            
        	var pageValJson = "{\n" +
        			"    \"alertId\": \"" + alertId + "\",\n" +
        			"    \"userComment\": \"" + commentText + "\",\n" +
        			"    \"action\": \"" + alertAction + "\"\n" +
        			"}";

        		$('#alertList tr td input[id="alertCommentId~' + alertId + '"]').each(function() {
        			$(this).val(encodeURIComponent(JSON.stringify(pageValJson)));
        		});
        		
        	$('#alertList tr td .suspiciousCls').each(function() {

    			var currentId = this.id;
    			
    			if (currentId.split("~")[1] == alertId) {

    				$(this).data('checkboxState', checkboxState);
    				$(this).data('commentText', commentText);

    				if (alertAction == "U") {
    					//$('#comment~' + alertId).addClass("bg-danger");
    					$(this).removeClass("bg-warning");
    					$(this).addClass("bg-danger");
    				} else {
    					$(this).removeClass("bg-warning");
    					$(this).removeClass("bg-danger");
    					$(this).addClass("bg-success");

    				}

    			} else {
    				//////alert("Id Not Matched");
    			}
    		});
    	}
        
        $('#selectAll').prop('checked', false);
        $('#commentModal').modal('hide');
        /*new loigc ends*/		
       
    } else {
        toastr.error(checkComment);
    }
}

// Fianl Submit
function executeSubmit(status, action) {

	var flag = true;
	var vailidationMsg = "SUCCESS";
	var requestId = $("#requestId").text();
	var singleAlertStatus = "C";


	/* Iterate Table and Pick Last COlumn check wheather all alerts having proper commnets or not*/
	var alertTableDetails = "[\n";
	if ($('#alertList tr').length > 0) {
		$('#alertList > tbody  > tr').each(
			function(index, value) {

				var commentRemark = null;
				commentRemark = $(this)
					.find(
						"td:eq(14) input[type='hidden']")
					.val();

				var alertTblId = $(this)
					.find(
						"td:eq(14) input[type='hidden']")
					.attr("data-hiddenComment");


				if (commentRemark != "") {

					$(this).removeClass("text-bold text-red");
					commentRemark = JSON.parse(decodeURIComponent(commentRemark));
					var commentJsonObj = jQuery.parseJSON(commentRemark);

					////alert(" action " + commentJsonObj.action);
					/* If Any Alert Marked As Suspicious then Suspicious Workflow will be triggred */
					if (commentJsonObj.action == "U") {
						singleAlertStatus = "U";
					}

					/*alertTableDetails = alertTableDetails
						+ "  {  \"reqId\": \""
						+ requestId
						+ "\"," + "\"actionStatus\":\"" + $("#alertStatus").val() + "\, \n" + "\"commentDto\":{\"comment\":\"" + commentRemark + "\"," + "\"moduleId\":\"" + alertId + "\"}}";*/
					alertTableDetails = alertTableDetails +
						"  {  \"alertId\": \"" + alertTblId.split("~")[1] + "\",\n" +
						"    \"alertCommentDto\":" + commentRemark + "\n" +


						" },";

				} else {
					commentRemark = "FAILED";
					flag = false;
					vailidationMsg = "Please provide a Comment for All Alerts ";

					var currentId = $(this).attr("id").split("~")[1];
					if (currentId == alertTblId.split("~")[1]) {
						$(this).addClass("text-bold text-red");
					}



				}


			});
		//filedetails = filedetails.slice(0,-1);
		alertTableDetails = alertTableDetails.substring(0,
			alertTableDetails.length - 1);
	}
	alertTableDetails = alertTableDetails + "]";


	if (flag) {

		if (status == '') {
			status = singleAlertStatus;
		}

		var pageValJson = "{\"reqId\":" + "\"" + requestId + "\"," + "\"alertStatus\":\"" + $("#alertStatus").val() + "\" ,\"actionStatus\":\"" + status + "\" ,\"alertCommentDtoList\":" + alertTableDetails + "\n" + "}"; //+ "\",\"userComment\":\"" + userComment.replace(/(\r\n|\n|\r)/gm, "") + "\" }";

		console.log("pageValJson " + pageValJson);
		//alert("pageValJson " + pageValJson);
		$("#encryptedJson").val(pageValJson);
		$("#invForm").submit();
	} else {
		toastr.error(vailidationMsg);
	}

}

function finalSubmit() {
	var requestId = $("#requestId").text();

	var status = $("#action").val();
	var userComment = $("#alertComment").val();
	var alertAggFlg = $("#aggFlg").val();
	var alertAggVal = $("#aggVal").val();
	var checkComment = checkTextArea("User Comment", userComment);
	var flg = false;
	if (checkComment == 'SUCCESS') {
		//var pageValJson = "{\"alertAggFlg\": \"" + alertAggFlg + "\",\"alertAggVal\": \"" + alertAggVal + "\"," + "\"alertStatus\":\"" + $("#alertStatus").val() + "\",\"actionStatus\":\"" + status + "\",\"userComment\":\"" + userComment.replace(/(\r\n|\n|\r)/gm, "") + "\" }";
		var pageValJson = "{\"reqId\":" + "\"" + requestId + "\"," + "\"alertStatus\":\"" + $("#alertStatus").val() + "\" ,\"actionStatus\":\"" + status + "\, \n" + "\"commentDto\":{\"comment\":\"" + reason + "\"}}"; //+ "\",\"userComment\":\"" + userComment.replace(/(\r\n|\n|\r)/gm, "") + "\" }";

		console.log("pageValJson " + pageValJson);
		////////alert("pageValJson " + pageValJson);
		flg = true;
	} else {
		toastr.error(checkComment);
	}
	if (flg) {
		$("#encryptedJson").val(pageValJson);
		alert("pageValJson " + pageValJson);
		$("#invForm").submit();
	}
}

// Comment Mdoal
function commentModal() {
	var requestId = $("#requestId").text();
	var alertId = $(this).attr("id");
	var buttonEvent = $('#buttonEvent').val();
	//////alert("alertId " + alertId);
	//////alert("buttonEvent " + buttonEvent);
}







$('a.alertModel')
	.click(
		function() {
			var alertId = $(this).attr('id');
			var pageValJson = "{\"alertId\":" + "\""
				+ alertId + "\"}";

			console.log(pageValJson);
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'AlertViewModel',
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
						console.log("json Response "
							+ jsonResponse)
						var obj = JSON.parse(jsonResponse);

						$("#alertIdLabel").text(
							obj.alertId);

						if (obj.headerList.length > 0) {
							var headerListData = obj.headerList;
							$(".alertDtls > #alertDtlsHead").empty();
							$("<tr>").appendTo("#alertDtlsHead");
							headerListData.forEach(function(items) {
								$("<th class='sorting_1'>"
									+ items
									+ "</th>").appendTo("#alertDtlsHead");
							});
							$("</tr>").appendTo("#alertDtlsHead");

							var thresholdData = obj.dataList;
							$(".alertDtls > #alertDtlsBody").empty();
							thresholdData.forEach(function(items) {
								var dataString = items.split("~");

								$("<tr>").appendTo("#alertDtlsBody");
								dataString.forEach(function(value) {

									$("<td class='sorting_1'>"
										+ value
										+ "</td>").appendTo("#alertDtlsBody");
								});
								$("</tr>").appendTo("#alertDtlsBody");
							});
							$('#viewAlertModel').modal('show');

						} else {
							toastr.warning('Alert Details Not Present');
						}
					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});

		});

// viewAccountStmt
function searchData() {
	var tranType = $("#tranType").val();
	var creDebFlg = $("#creDebFlg").val();
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var acid = $("#acidId").val();
	var pageValJson = "{\n" + "\"tranType\": \"" + tranType + "\",\n"
		+ "   \"creDebFlg\": \"" + creDebFlg + "\",\n"
		+ "   \"startDate\": \"" + startDate + "\",\n"
		+ "   \"endDate\": \"" + endDate + "\",\n"
		+ "   \"tranAcid\": \"" + acid + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'getAcStatementFilterWise',
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
						.getElementById('load').style.visibility = "hidden";
				}, 1);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			$("#acctStmt tbody tr").remove();
			$('#acctStmt').dataTable()
				.fnClearTable();
			$('#acctStmt').DataTable()
				.destroy();
			obj.forEach(function(item) {
				var credTab = '';
				let credAmt = 0;
				let debAmt = 0;
				if (item.creDebFlg == 'C') {
					credTab = '<span class="badge bg-success">Credit</span>';
					credAmt = item.tranAmt;
				} else {
					debAmt = item.tranAmt;
					credTab = '<span class="badge bg-danger">Debit</span>';
				}
				jQuery("#acctStmt tbody").append('<tr><td>' + item.tranChannel + '</td><td>' + item.tranId + '</td><td>' + moment(item.tranDate).format('DD-MM-YYYY') + '</td><td>' + credAmt + '</td><td>' + debAmt + '</td><td>' + item.tranParticular + '</td><td>' + item.tranrmks + '</td><td>' + item.sourceDetails + '</td><td>' + item.destDetails + '</td></tr>');
			});
			//fetchAcctStmt
			$("#acctStmt").DataTable({
				"responsive": false,
				"order": [],
				"lengthMenu": [5, 10, 25, 100],
				"autoWidth": true,
				"searching": true,
				"fixedHeader": true,
				"buttons": ["csv", "excel", "pdf", "print"],
				"language": {
					"emptyTable": "No Data Available"
				}
			}).buttons().container().appendTo('#acctStmt_wrapper .col-md-6:eq(0)');
			$('#acctStmt').DataTable()
				.draw();
		},
		error: function(xhr, status, error) {
			toastr
				.error('Some Error Occured');
		}
	});
}


$('a.custModel')
	.click(
		function() {
			var custId = $(this).attr('id');
			var pageValJson = "{\"custId\":" + "\""
				+ custId + "\"}";
			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'CustViewModel',
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
						console.log("json Response "
							+ jsonResponse)
						var obj = JSON.parse(jsonResponse);
						console.log("obj " + obj);
						var i = 0;
						$("#custIdLabel").text(
							obj.custId);
						$("#custFullName").val(
							obj.custFullName);
						$("#custPanNo")
							.val(obj.custPanNo);
						$("#custOccupation").val(
							obj.custOccupation);
						$("#custIndFlg").val(
							obj.custType);
						if (obj.custIndFlg == 'I') {
							$("#custAnnualIncome").val(obj.custAnnualIncome);
							$("#custMinFlg").val(obj.custMinorFlg);
							$("#custNreFlg").val(obj.custNreFlg);
							$("#custGender").val(obj.custGender);
							$("#indRow").show();
						} else {
							$("#custTurnOver").val(obj.custTurnover);
							$("#compId").val(obj.companyId);
							$("#dateOfReg").val(obj.dateOfRegistration);
							$("#placeOfReg").val(obj.placeOfRegistration);
							$("#nidRow").show();
						}
						$("#custConstitution").val(
							obj.custConstitution);
						$("#custOpnDate").val(
							obj.custOpnDate);
						$("#custRisk").val(
							obj.actualRisk);
						$("#custRisk").addClass(obj.custRisk);
						$("#lastKycDate").val(
							obj.custKycDate);
						var custAddress = obj.custAddressDtoList;
						$(".custAddressDtls > #tbodyAddressR").empty();

						// //alert('thresholdData '+thresholdData);
						custAddress.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.city
								+ "</td><td><span name='state' value='" + items.state + "' class='textCapitalize'>"
								+ items.state
								+ "</td><td><span name='country' value='" + items.country + "' class='textCapitalize'>"
								+ items.country
								+ "</td><td><span name='zipcode' value='" + items.zip + "' class='textCapitalize'>"
								+ items.zip
								+ "</td><td><span name='addressCategory' value='" + items.addressCategory + "' class='textCapitalize'>"
								+ items.addressCategory
								+ "</td><td><span name='address' value='" + items.addressLine1 + "' class='textCapitalize'>"
								+ items.addressLine1
								+ "</td></tr>").appendTo("#tbodyAddressR");
						});
						$(".custDocDtls > #tbodyDocR").empty();
						obj.custDocDtoList.forEach(function(items) {
							$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
								+ items.docCode
								+ "</td><td><span class='textCapitalize'>" + items.docDesc + "</td><td><span   class='textCapitalize'>"
								+ items.docValue + "</td><td><span  class='textCapitalize'>" + items.docIssueCntry
								+ "</td><td><span class='textCapitalize'>" + items.docIssuePlace + "</td><td><span  class='textCapitalize'>"
								+ items.docIssueDate
								+ "</td></tr>").appendTo("#tbodyDocR");
						});
						$(".custContactDtls > #tbodyContactR").empty();
						obj.custPhoneEmailDtlsDtos.forEach(function(items) {
							$("<tr role='row'id='row_id'><td class='sorting_1'>"
								+ items.recordType
								+ "</td><td><span class='textCapitalize'>" + items.recordValue + "</td></tr>").appendTo("#tbodyContactR");
						});
					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});
			$('#viewCustModel').modal('show');
		});




$('a.closemodal').click(function() {
	$('#stmtId').text($(this).attr('id'));
	$('#closemodal').modal('show');
});

/* New Method For Fetch Comment */

$(document).on("click", ".suspiciousCls", function() {

	var commentId = $(this).attr('id');
	var alertId = commentId.split("~")[1];
	$("#actionSwitch").prop("checked", false);
	var checkboxState = $(this).data('checkboxState');
	var commentText = $(this).data('commentText');

	var pageValJson = JSON.stringify({ alertIdList: [alertId] });

	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$
		.ajax({
			url: 'fetchCommentListForAlertId',
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

				$(".userComments").empty();

				$('#previousAlertDtls').dataTable()
					.fnClearTable();
				$('#previousAlertDtls').DataTable()
					.destroy();

				/*console.log("jsonResponse " + jsonResponse);*/
				var obj = $.parseJSON(jsonResponse)

				/*console.log("obj " + obj.alertCommentList);*/


				//$('#previousAlertDtls tr:gt(0)').remove();
				obj.alertCommentList.forEach(function(item) {
					/*alert(" item.actUserId " + item.actUserId);*/
					$(
						'<tr role="row" class="odd" id="row_id"><td class="sorting_1">'
						+ item.actUserId
						+ '</td><td>'
						+ item.actUserRoleId
						+ '</td><td>'
						+ item.actStatus
						+ '</td>>'
						+ '<td>'
						+ item.actUserComment
						+ '</td><td class="text-capitalize"> '
						+ moment(item.actStartTime).format('DD/MM/YYYY')
						+ '</td><td class="text-capitalize"> '
						+ item.actTat
						+ '</td>'

						+ '</tr>').appendTo(".userComments");
				});


				$(".previousCOmmentDetails").show();
				$("#previousCommentId").show();
				//////alert("till here correct");
				//previousAlertDtls

				$("#previousAlertDtls").DataTable({
					"columnDefs": [],
					"order": [0, "asc"],
					"responsive": false,
					"lengthMenu": [25, 50, 75, 100],
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available",
						"search": "Search:"
					},

				}).buttons().container().appendTo(
					'#previousAlertDtls_wrapper .col-md-6:eq(0)')

				$("#alertCommentModal").val(commentText);

				if (checkboxState == true)
					$("#actionSwitch").prop("checked", true);
				else
					$("#actionSwitch").prop("checked", false);


			},
			error: function(xhr, status, error) {
				toastr
					.success('Some Error Occured');
			}
		});
});


/* View Matching Value */
/* New Method For Fetch Comment */

$(document).on("click", ".alertModal", function() {
	var alertId = $(this).attr('id');

	/*var pageValJson = JSON.stringify({ alertIdList: [alertId] });*/
	var pageValJson = "{\n" +
		"    \"alertId\": \"" + alertId + "\" \n" +

		"}";


	/*var pageValJson = "{\"alertIdList\":" + "\""
		+ alertDetails + "\"}";*/

	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$
		.ajax({
			url: 'fetchMatchingDetails',
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

				console.log("jsonResponse " + jsonResponse);
				var obj = $.parseJSON(jsonResponse)


				$('#alertListModal tr:gt(0)').remove();
				$(".alertListModalbody").empty();

				obj.dataList.forEach(function(item) {
					var matchKey = item.split("~")[0];
					var matchValue = item.split("~")[1];
					$('<tr role="row" class="odd" id="row_id"><td class="sorting_1 text-center" >'
						+ matchKey
						+ '</td><td class="text-center">'
						+ matchValue
						+ '</td>'


						+ '</tr>')
						.appendTo(
							".alertListModalbody");


				});

			},
			error: function(xhr, status, error) {
				toastr
					.success('Some Error Occured');
			}
		});
});

// .checkRiskData
$(document).on("click", ".checkRiskData", function() {

	// associationModal
	$('#associationModal').modal('show');
})

$(".backBtn").click(
	function() {
		$('#associationModal').modal('hide');
	})


// Common Function Convert Text to Text-Capitalize and SPAN BADGE

function handleNullCondition(text) {
	let convertText = text != null ? text : "<span class='badge badge-warning'>NA</span>";
	return convertText;
}

function convertTextCapital(text) {
	let convertText = text != null ? "<font class='text-capitalize'>" + text.toLowerCase() + "</font>" : "<span class='badge badge-warning'>NA</span>";
	convertText = text == "" ? "<span class='badge badge-warning'>NA</span>" : convertText;
	convertText = text == "NA" ? "<span class='badge badge-warning'>NA</span>" : convertText;
	convertText = text == "Not Applicable" ? "<span class='badge badge-warning'>NA</span>" : convertText;
	// Not Applicable
	return convertText;
}

function convertTextCapitalForText(text) {
	let convertText = text != null ? text.toLowerCase() : "NA";
	convertText = text == "" ? "NA" : convertText;
	convertText = text == "NA" ? "NA" : convertText;
	convertText = text == "Not Applicable" ? "NA" : convertText;
	// Not Applicable
	return convertText;
}

function handleNullConditionForStd(text) {
	let convertText = text != null ? text : "<span class='badge badge-warning'>NA</span>";
	return convertText;
}


/* New Method for view association details */
$(document).on("click", ".viewAssociation", function() {
	var pageValJson = "{\"requestId\":" + "\"" + $(this).attr('data-requestid')
		+ "\",\"customer_type\": \"" + $(this).attr('data-custType')
		+ "\",\"part_serial_number\":\"" + $(this).attr('id')
		+ "\"}";

	//alert("pageValJson " + pageValJson);
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$
		.ajax({
			url: 'viewAssociationDetails',
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

				//console.log("jsonResponse " + jsonResponse);
				var obj = $.parseJSON(jsonResponse)
				
						// Update modal values
						$("#assocName").val(obj.related_customer_details.customer_name);
						$("#relationType").val(obj.relation_type);
						$("#customerType").val(obj.customer_type);

						// Handle gender
						var genderValue = obj.related_customer_details.gender;
						
						if (genderValue == "F") {
						    $("#Agender").val("Female");
						} else if (genderValue == "M") {
						    $("#Agender").val("Male");
						} else {
						    $("#Agender").val("Not Applicable");
						}

						// Append country details to the table
						var countryTable = $("#countryDetails tbody");
						countryTable.empty(); // Clear existing rows

						$.each(obj.related_customer_details.country_list, function(index, country) {
							
							var countryType;
						    if (country.country_type === "R") {
						        countryType = "Residence";
						    } else if (country.country_type === "N") {
						        countryType = "Nationality";
						    } else {
						        countryType = "Other";
						    }
						    // Handle country remark
						    var countryRemark = country.country_remarks !== null ? country.country_remarks : "Not Required";
						    
						    countryTable.append("<tr><td>" + (index + 1) + "</td><td>" + country.country_name +
						        "</td><td>" + countryType + "</td><td>" + countryRemark + "</td></tr>");
						});

						// Append document details to the table
						var documentTable = $("#documentDetails tbody");
						documentTable.empty(); // Clear existing rows

						$.each(obj.related_customer_details.id_details, function(index, id) {
						    // Handle document remark
						    var documentRemark = id.id_remarks !== null ? id.id_remarks : "Not Required";
						    
						    documentTable.append("<tr><td>" + (index + 1) + "</td><td>" + id.id_type +
						        "</td><td>" + id.id_value + "</td><td>" + documentRemark + "</td></tr>");
						});

						// Show the modal
						$("#associationModal").modal("show");

			},
			error: function(xhr, status, error) {
				toastr
					.success('Some Error Occured');
			}
		});
});
