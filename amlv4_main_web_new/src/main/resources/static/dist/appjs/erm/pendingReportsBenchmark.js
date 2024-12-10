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


$("#fetchDataBtn").click(function() {

	var selectedValue = "";
	var statusValue = "P";
	var moduleName = "BM";
	var deptId="";
	var ofcCode="";
	deptId = $('#riskDept :selected').val();
	var pageValJson = "";
	if ($("#officeType").val() === "") {
		toastr.error("Please Select Office Type");
	} else {
		selectedValue = $('#officeType :selected').val();
	}
	if ($("#riskDept").val() === "") {
		toastr.error("Please Select Department");
	} else {
	
	if(deptId != undefined){
	
	}else{
	deptId = $("#riskDept").val();
	
	}
	
	
	
		
	}
	if ($("#officeCode").val() === "") {
		toastr.error("Please Select Office Code");
	} else {
		ofcCode = $('#officeCode :selected').val();
	}
	if (selectedValue != null && selectedValue != "") {
		if (ofcCode != null && ofcCode != "") {
			if (deptId != null && deptId != "") {
				pageValJson = "{\n"
					+ "    \"searchParam\": \"" + selectedValue + "\",\n"
					+ "    \"ntfModule\": \"" + moduleName + "\",\n"
					+ "    \"selectedOfcCode\": \"" + $("#officeCode").val() + "\",\n"
					+ "    \"selectedDeptId\": \"" + $("#riskDept").val() + "\",\n"
					+ "    \"statusParam\":\"" + statusValue + "\"\n"
					+ "}";
				console.log(pageValJson);
				document.getElementById('load').style.visibility = "visible";

				$.ajax({
					url: "fetchBenchmarkVCAssessmentValue",
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

						/*if (obj.ntfModule == 'BM') {*/


							var dataList = obj.bmNtfDtoList;

							$('#showRaTable').hide();
							$(".benchmarkValueCapturetable > #tbodyR").empty();
							$('#benchmarkValueCapturetable').dataTable().fnClearTable();
							$('#benchmarkValueCapturetable').DataTable().destroy();
							var deptNameTemp = $('#userDept').val();

							dataList.forEach(function(items) {
								$("<tr role='row' class='deptName' value='" + items.bmId + "' id='" + items.bmId + "' name='" + items.bmId + "'><td class='sorting_1'><a href='#' id='" + items.bmId + "' onclick='viewBenchMarkDetails(this.id)'> "
									+ items.bmId
									+ "</td><td><span value='" + items.deptName + "' id='" + items.deptName + "' name='" + items.deptName + "' class='textCapitalize'>"
									+ items.deptName
									+ "</td><td><span value='" + items.assessmentValue + "' id='" + items.assessmentValue + "' name='" + items.assessmentValue + "' class='textCapitalize'>"
									+ items.assessmentValue
									+ "</td><td><span value='" + items.assessmentDate + "' id='" + items.assessmentDate + "' name='" + items.assessmentDate + "' class='textCapitalize'>"
									+ items.assessmentDate
									+ "</td><td><span value='" + items.ofcCode + "' id='" + items.ofcCode + "' name='" + items.ofcCode + "' class='textCapitalize'>"
									+ items.ofcCode
									+ "</td>"
									+ "</tr>").appendTo(".benchmarkValueCapturetable");
									
							});
							$("#benchmarkValueCapturetable").DataTable({
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
								
							})

							$('#showBmTable').show();


						/*} else if (obj.ntfModule == 'RA') {


							var dataList = obj.ntfDtoList;

							$('#showBmTable').hide();
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

						}*/



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


function viewBenchMarkDetails(bmId) {
	$('#bmId').val(bmId);
	var value = "{\"bmId\":" + "\"" + bmId
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
		url: 'viewBenchmark',
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

			$('#bmRecordStatus').val(obj.bmRecordStatus);
			$('#bmNameM').val(obj.bmName);
			$('#bmDescriptionM').val(obj.bmDescription);
			$('#bmApplicableOfficeM').val(obj.applicableOffice);
			$('#bmDatatypeM').val(obj.bmDatatype);
			$('#bmValueM').val(obj.bmValue);
			$('#bmAssessmentPeriodM').val(obj.bmAssessmentPeriod);

			const ofc = obj.applicableOffice.split(",");
			Object.keys(ofc).forEach(function(key) {

				$("<input  class='form-check-input' type='checkbox' name='applicableOffice' checked=true disabled/>"
					+ "<label class='font-weight-normal'>"
					+ ofc[key]
					+ "&nbsp;</label><br/>").appendTo(".ofcName");

			});




			$('#viewBenchmarkmodal').modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.error('Some Error Occured');
		}
	});
}


	
 $(function() {
		
		 
		 $("#officeType").change(function () {
			 var userOffice=$("#officeType").val();
			 var pageValJson = "{\"officeType\":" + "\""+ userOffice + "\"}";
			 console.log(pageValJson)
			document.getElementById('load').style.visibility = "visible";
				
				// ajax call
				$
					.ajax({
						url: 'DeptRiskOfficeWise',
						type: "POST",
						data: {
							pageValJson: pageValJson
						},// important line for thymeleaf http security

						headers: {
							"X-CSRF-TOKEN": $( "input[name='_csrf']").val()
						},
						cache: false,
						// async:true,
						success: function(response) {
							setTimeout(
								function() {
									document
										.getElementById('load').style.visibility = "hidden";
								}, 1000);
							
							var jsonResponse = JSON
								.stringify(response);
							
							obj = JSON.parse(jsonResponse);
							
							console.log(obj)
							if(obj.deptList != null){
							$("#riskDept").empty();
							$("<option />", {
									val: "",
									text: "Select Department"
								}).appendTo($("#riskDept"));
							$("<option />", {
								val: "ALL",
								text: "ALL"
							}).appendTo($("#riskDept"));
							obj.deptList.forEach(function(items) {
								

								$("<option />", {
									val: items.deptId,
									text: items.deptName
								}).appendTo($("#riskDept"));


							});
							}
							if(obj.officeCodeList != null){
							$("#officeCode").empty();
							/*$("<option />", {
									val: "",
									text: "Select Department"
								}).appendTo($("#officeCode"));*/
							obj.officeCodeList.forEach(function(items) {
								

								$("<option />", {
									val: items.officeCode,
									text: items.officeCode
								}).appendTo($("#officeCode"));


							});
							}
							$('.select2').select2();
							
				},
				error: function(xhr, status, error) {
					console.log(xhr);
					toastr
						.error('Some Error Occured here	');
				}
			
		});
	 });
	 
	 }); 


$("#exportDataBtn").click(function() {

	var selectedValue = "";
	var statusValue = "P";
	var moduleName = "BM";
	var deptId="";
	var ofcCode="";
	deptId = $('#riskDept :selected').val();
	var pageValJson = "";
	if ($("#officeType").val() === "") {
		toastr.error("Please Select Office Type");
	} else {
		selectedValue = $('#officeType :selected').val();
	}
	if ($("#riskDept").val() === "") {
		toastr.error("Please Select Department");
	} else {
	
	if(deptId != undefined){
	
	}else{
	deptId = $("#riskDept").val();
	
	}
	
	
	
		
	}
	if ($("#officeCode").val() === "") {
		toastr.error("Please Select Office Code");
	} else {
		ofcCode = $('#officeCode :selected').val();
	}
	
				pageValJson = "{\n"
					+ "    \"searchParam\": \"" + selectedValue + "\",\n"
					+ "    \"ntfModule\": \"" + moduleName + "\",\n"
					+ "    \"selectedOfcCode\": \"" + $("#officeCode").val() + "\",\n"
					+ "    \"selectedDeptId\": \"" + $("#riskDept").val() + "\",\n"
					+ "    \"statusParam\":\"" + statusValue + "\"\n"
					+ "}";
				console.log(pageValJson);
			document.getElementById('load').style.visibility = "disable";
			var iterationCount = 1000;
			
								var keySize = 128;
								//passPhrase is the key	
								var passphrase = CryptoJS.lib.WordArray.random(
										128 / 8).toString(CryptoJS.enc.Hex);

								var aesUtil = new AesUtil(keySize,
										iterationCount);

								var ciphertext = aesUtil.encrypt(
										reverseText(passphrase), pageValJson);

								$("#encryptedJson").val(
										ciphertext + ':~:' + passphrase);
										$("#frmpendingKRIVC").submit();
										document.getElementById('load').style.visibility = "disable";

		});












