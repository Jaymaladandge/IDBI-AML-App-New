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
	/*if (deptNameTemp != 'ERM') {
		$("#fetchDataBtn").prop("disabled", true);
		$("#status").prop("disabled", true);
		$("#officeType").prop("disabled", true);
	}*/
});

$("#fetchDataBtn").click(function() {
	var selectedValue = "";
	var statusValue = "";
	var pageValJson = "";
	if ($("#officeType").val() === "") {
		toastr.error("Please Select Office Type");
	} else {
		var selectedValue = $('#officeType :selected').val();
	}
	if ($("#status").val() === "") {
		toastr.error("Please Select Status");
	} else {
		var statusValue = $('#status :selected').val();
	}
	if ($("#riskDept").val() === "") {
		toastr.error("Please Select Department");
	}
	if (selectedValue != null && selectedValue != "") {
		if (statusValue != null && statusValue != "") {
			/*pageValJson = "{\n"
				+ "    \"searchParam\": \"" + selectedValue + "\",\n"
				+ "    \"statusParam\":\"" + statusValue + "\"\n"
				+ "}";*/
				
				pageValJson = "{\n"
					+ "    \"searchParam\": \"" + selectedValue + "\",\n"
					+ "    \"selectedOfcCode\": \"" + $("#officeCode").val() + "\",\n"
					+ "    \"selectedDeptId\": \"" + $("#riskDept").val() + "\",\n"
					+ "    \"statusParam\":\"" + statusValue  + "\",\n"
					+ "    \"ntfStatus\": \"X\"\n"
					+ "}";
					

			document.getElementById('load').style.visibility = "visible";
			$.ajax({
				url: "fetchKRIAssessmentValue",
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
					$(".KRIValueCapturetable > #tbodyR").empty();
					$('#KRIValueCapturetable').dataTable().fnClearTable();
					$('#KRIValueCapturetable').DataTable().destroy();


					dataList.forEach(function(items) {
						$("<tr role='row' class='deptName' value='" + items.ntfModuleId + "' id='" + items.ntfModuleId + "' name='" + items.ntfModuleId + "'><td class='sorting_1'><a href='#' id='" + items.ntfModuleId + "' onclick='viewKRIDetails(this.id)'> "
							+ items.ntfModuleId
							+ "</td><td><span value='" + items.deptName + "' id='" + items.deptName + "' name='" + items.deptName + "' class='textCapitalize'>"
							+ items.deptName
							+ "</td><td><span value='" + items.ntfModuleDesc + "' id='" + items.ntfModuleDesc + "' name='" + items.ntfModuleDesc + "' class='textCapitalize'>"
							+ items.ntfModuleDesc
							+ "</td>"
							+ "</td><td><span value='" + items.ntfValue + "' id='" + items.ntfValue + "' name='" + items.ntfValue + "' class='textCapitalize'>"
							+ items.ntfValue
							+ "</td><td><span value='" + items.ofcCode + "' id='" + items.ofcCode + "' name='" + items.ofcCode + "' class='textCapitalize'>"
							+ items.ofcCode
							+ "</td>"
							+ "</tr>").appendTo(".KRIValueCapturetable");

					});
					$("#KRIValueCapturetable").DataTable({
						"columnDefs": [{
							orderable: false
							//targets: [6]
						}],
						"order" : [ 1, "asc" ],
						"responsive": true,
						"autoWidth": true,
						"searching": true,
						"fixedHeader": true,
						"language": {
							"emptyTable": "No Data Available"
						},
						
					}).buttons().container().appendTo(
						'#KRIValueCapturetable_wrapper .col-sm-12:eq(0)');

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
});

// Modal For View Key Risk Indicator
function viewKRIDetails(kriId) {
	/*View KRI Modal*/
	var value = "{\"kriId\":" + "\"" + kriId
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
	//console.log(pageValJson);
	document.getElementById('load').style.visibility = "visible";
	// ajax call
	$.ajax({
		url: 'viewKriModal',
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
			$('#kriId').val(kriId);
			$('#kriStatus').val(obj.kriRecordStatus);
			$('#kriName').val(obj.kriName);
			$('#kriBenchmark').val(obj.kriBenchmark);
			$('#kriDataType').val(obj.kriDataType);
			$('#thresholddescription').val(obj.kriThresholdDescription);
			$('#datasourcedef').val(obj.kriDataSource);
			$('#frequency').val(obj.kriUpdateFrequency);
			$('#kriFormula').val(obj.kriFormula);
			$('#deptThresholdDetails tr:gt(0)').remove();

			if (obj.mdmDtoList.length > 0) {
				obj.mdmDtoList.forEach(function(mdmItem) {
					var mdtValue = "";
					mdmItem.mdtDtoList.forEach(function(mdtItem) {
						mdtValue += '<td><span class="text-capitalize text-bold" style="white-space:pre;color:' + mdtItem.bgClass + ';">' + mdtItem.deptThresholdType + '</span></td><td>' + mdtItem.asstTypeDesc + '</td><td>' + mdtItem.deptThresholdValue + '</td></tr>';
					});
					//console.log(mdtValue);
					$('#deptThresholdDetails tr:last')
						.after(
							'<tr><td class="text-capitalize text-bold" rowspan="' + mdmItem.mdtDtoList.length + '">'
							+ mdmItem.deptName.toLowerCase()
							+ '</td>'
							+ '<td rowspan="' + mdmItem.mdtDtoList.length + '">'
							+ mdmItem.remarks
							+ '</td>'
							+ mdtValue + '<tr>');
				});

				$('#modalDeptThresDiv').show();

			}
			$('#kriModal')
				.modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.error('Some Error Occured');
		}
	});
}
$(document).ready(function() {
	$(
		'#officeType option[value="'
		+ $("#selectedOfficeType").val() + '"]')
		.attr("selected", "selected").change();
	//assessmentDateSelected
	$(
		'#assessmentDate option[value="'
		+ $("#assessmentDateSelected").val() + '"]')
		.attr("selected", "selected").change();
	var userOffice = $("#userOffice").val();
	//alert(userOffice);

	if (userOffice === 'ZO') {
		$('#officeType option[value="CO"]').attr("disabled", true);
	} else if (userOffice === 'divisional office') {
		$('#officeType option[value="CO"]').attr("disabled", true);
		$('#officeType option[value="ZO"]').attr("disabled", true);
	} else if (userOffice === 'BO') {
		$('#officeType option[value="CO"]').attr("disabled", true);
		$('#officeType option[value="ZO"]').attr("disabled", true);
		$('#officeType option[value="DO"]').attr("disabled", true);
	}
});


$("#exportDataBtn").click(function() {
	
	var selectedValue = "";
	var statusValue = "";
	var pageValJson = "";
	if ($("#officeType").val() === "") {
		toastr.error("Please Select Office Type");
	} else {
		var selectedValue = $('#officeType :selected').val();
	}
	if ($("#status").val() === "") {
		toastr.error("Please Select Status");
	} else {
		var statusValue = $('#status :selected').val();
	}
	if ($("#riskDept").val() === "") {
		toastr.error("Please Select Department");
	}
	if (selectedValue != null && selectedValue != "") {
		if (statusValue != null && statusValue != "") {
			pageValJson = "{\n"
					+ "    \"searchParam\": \"" + selectedValue + "\",\n"
					+ "    \"selectedOfcCode\": \"" + $("#officeCode").val() + "\",\n"
					+ "    \"selectedDeptId\": \"" + $("#riskDept").val() + "\",\n"
					+ "    \"statusParam\":\"" + statusValue + "\",\n"
					+ "    \"ntfStatus\": \"count\"\n"
					+ "}";
				

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

		}
	}
});
		
	 $(function() {
		
		 
		 $("#officeType").change(function () {
			 var userOffice=$("#officeType").val();
			 var pageValJson = "{\"officeType\":" + "\""+ userOffice + "\"}";
		
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
/*View KRI Modal End*/
$("#fetchCountBtn").click(function() {
	var selectedValue = "";
	var statusValue = "";
	var pageValJson = "";
	if ($("#officeType").val() === "") {
		toastr.error("Please Select Office Type");
	} else {
		var selectedValue = $('#officeType :selected').val();
	}
	
	if ($("#riskDept").val() === "") {
		toastr.error("Please Select Department");
	}
	if (selectedValue != null && selectedValue != "") {

			/*pageValJson = "{\n"
				+ "    \"searchParam\": \"" + selectedValue + "\",\n"
				+ "    \"statusParam\":\"" + statusValue + "\"\n"
				+ "}";*/
				
				pageValJson = "{\n"
					+ "    \"searchParam\": \"" + selectedValue + "\",\n"
					+ "    \"selectedOfcCode\": \"" + $("#officeCode").val() + "\",\n"
					+ "    \"selectedDeptId\": \"" + $("#riskDept").val() + "\",\n"
					+ "    \"ntfStatus\": \"countVC\"\n"
					+ "}";
					

			document.getElementById('load').style.visibility = "visible";
			$.ajax({
				url: "fetchKRIAssessmentValue",
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
					var dataCount = obj.statusCount;
					$(".KRIValueCapturetableCount > #tbodyC").empty();
					$('#KRIValueCapturetableCount').dataTable().fnClearTable();
					$('#KRIValueCapturetableCount').DataTable().destroy();
					$('#KRIValueCapturetableCount').css("display","");
					
for (var key in dataCount) {
   // console.log(data[key]);
      $("<tr><td>"+dataCount['p']+"</td><td>"+dataCount['v']+"</td><td>"+dataCount['c']+"</td></tr>").appendTo(".KRIValueCapturetableCount");
      break;
}


				/*	dataList.forEach(function(items) {
						$("<tr role='row' class='deptName' value='" + items.ntfModuleId + "' id='" + items.ntfModuleId + "' name='" + items.ntfModuleId + "'><td class='sorting_1'><a href='#' id='" + items.ntfModuleId + "' onclick='viewKRIDetails(this.id)'> "
							+ items.ntfModuleId
							+ "</td><td><span value='" + items.deptName + "' id='" + items.deptName + "' name='" + items.deptName + "' class='textCapitalize'>"
							+ items.deptName
							+ "</td><td><span value='" + items.ntfModuleDesc + "' id='" + items.ntfModuleDesc + "' name='" + items.ntfModuleDesc + "' class='textCapitalize'>"
							+ items.ntfModuleDesc
							+ "</td>"
							+ "</td><td><span value='" + items.ntfValue + "' id='" + items.ntfValue + "' name='" + items.ntfValue + "' class='textCapitalize'>"
							+ items.ntfValue
							+ "</td><td><span value='" + items.ofcCode + "' id='" + items.ofcCode + "' name='" + items.ofcCode + "' class='textCapitalize'>"
							+ items.ofcCode
							+ "</td>"
							+ "</tr>").appendTo(".KRIValueCapturetable");

					});
*/					$("#KRIValueCapturetableCount").DataTable({
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
						
					}).buttons().container().appendTo(
						'#KRIValueCapturetable_wrapper .col-sm-12:eq(0)');

				}, error: function(xhr, status, error) {
					console.log(xhr);
					console.log(status);
					console.log(error);
					toastr
						.success('Some Error Occured');
				}
			});

		
	}
});

$("#exportAllDataBtn").click(function() {
	
	var selectedValue = "";
	var statusValue = "";
	var pageValJson = "";
	if ($("#officeType").val() === "") {
		toastr.error("Please Select Office Type");
	} else {
		var selectedValue = $('#officeType :selected').val();
	}
	if ($("#status").val() === "") {
		toastr.error("Please Select Status");
	} else {
		var statusValue = $('#status :selected').val();
	}
	if ($("#riskDept").val() === "") {
		toastr.error("Please Select Department");
	}
	if (selectedValue != null && selectedValue != "") {
		if (statusValue != null && statusValue != "") {
			pageValJson = "{\n"
					+ "    \"searchParam\": \"" + selectedValue + "\",\n"
					+ "    \"selectedOfcCode\": \"" + $("#officeCode").val() + "\",\n"
					+ "    \"selectedDeptId\": \"" + $("#riskDept").val() + "\",\n"
					+ "    \"statusParam\":\"" + statusValue + "\",\n"
					+ "    \"ntfStatus\": \"countVC\"\n"
					+ "}";
				

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

		}
	}
});
