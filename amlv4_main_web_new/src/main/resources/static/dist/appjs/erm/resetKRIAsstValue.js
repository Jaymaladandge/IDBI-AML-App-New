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
$("#riskDept").change(function() {
	$('#submitDiv').hide();
	$(".KRIValueCapturetable > #tbodyR").empty();
});
$("#officeCode").change(function() {
	$('#submitDiv').hide();
	$(".KRIValueCapturetable > #tbodyR").empty();
});
$("#officeType").change(function() {
	var userOffice = $("#officeType").val();
	var pageValJson = "{\"officeType\":" + "\"" + userOffice + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$('#submitDiv').hide();
	$(".KRIValueCapturetable > #tbodyR").empty();
	// ajax call
	$
		.ajax({
			url: 'DeptRiskOfficeWise',
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
				document.getElementById('load').style.visibility = "hidden";
				var jsonResponse = JSON
					.stringify(response);
				obj = JSON.parse(jsonResponse);
				if (obj.deptList != null) {
					$("#riskDept").empty();
					$("<option />", {
						val: "",
						text: "Select Department"
					}).appendTo($("#riskDept"));
					obj.deptList.forEach(function(items) {
						$("<option />", {
							val: items.deptId,
							text: items.deptName
						}).appendTo($("#riskDept"));
					});
				}
				if (obj.officeCodeList != null) {
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
					.error('Some Error Occured');
			}
		});
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
	var statusValue = 'C';
	if ($("#riskDept").val() === "") {
		toastr.error("Please Select Department");
	}
	if (selectedValue != null && selectedValue != "") {
		if (statusValue != null && statusValue != "") {
			pageValJson = "{\n"
				+ "    \"searchParam\": \"" + selectedValue + "\",\n"
				+ "    \"selectedOfcCode\": \"" + $("#officeCode").val() + "\",\n"
				+ "    \"selectedDeptId\": \"" + $("#riskDept").val() + "\",\n"
				+ "    \"statusParam\":\"" + statusValue + "\"\n"
				+ "}";
			document.getElementById('load').style.visibility = "visible";
			$.ajax({
				url: "fetchKRIAsstValue",
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
					var flg = false;
					$(".KRIValueCapturetable > #tbodyR").empty();
					$('#KRIValueCapturetable').dataTable().fnClearTable();
					$('#KRIValueCapturetable').DataTable().destroy();
					dataList.forEach(function(items) {
						flg = true;
						$("<tr role='row' class='deptName' value='" + items.ntfModuleId + "' id='" + items.ntfModuleId + "' name='" + items.ntfModuleId + "'><td><input type='checkbox' id='kriId' name='kriId' value='" + items.ntfModuleId + "'></td><td class='sorting_1'><a href='#' id='" + items.ntfModuleId + "' onclick='viewKRIDetails(this.id)'> "
							+ items.ntfModuleId
							+ "</td><td><span value='" + items.deptName + "' id='" + items.deptName + "' name='" + items.deptName + "' class='textCapitalize'>"
							+ items.deptName
							+ "</td><td><span value='" + items.ntfModuleDesc + "' id='" + items.ntfModuleDesc + "' name='" + items.ntfModuleDesc + "' class='textCapitalize'>"
							+ items.ntfModuleDesc
							+ "</td>"
							+ "</td><td><span value='" + items.ntfValue + "' id='" + items.ntfValue + "' name='" + items.ntfValue + "' class='textCapitalize'>"
							+ items.ntfValue
							+ "</td><td><span value='" + items.ntfActionStatus + "' id='" + items.ntfActionStatus + "' name='" + items.ntfActionStatus + "' class='textCapitalize'>"
							+ items.ntfActionStatus
							+ "</td>"
							+ "</tr>").appendTo(".KRIValueCapturetable");
					});
					if (flg) {
						$('#submitDiv').show();
					}
					$("#KRIValueCapturetable").DataTable({
						"columnDefs": [{
							orderable: false,
							targets: [0]
						}],
						"responsive": true,
						"autoWidth": true,
						"searching": true,
						"bPaginate": false,
						"fixedHeader": true,
						"bInfo": false,
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
						.error('Some Error Occured');
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
$("#checkAll").click(function() {
	$('input:checkbox').not(this).prop('checked', this.checked);
});

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);

})

// File upload //
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
					+ '</td><td ><a class="btn btn-danger btn-sm" id="closerow"><i class="fas fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
	}
}


$("#update_btn")
	.click(
		function(e) {
			var checkboxSelectValidation = false;
			var ofcType = $('#officeType :selected').val();
			var ofcCode = $('#officeCode :selected').val();
			var deptId = $('#riskDept :selected').val();
			var asstPeriod = $("#asstPeriod").val();
			var moduleId = '';
			$('input:checkbox[name=kriId]')
				.each(
					function() {
						if ($(this).is(':checked')) {
							var kriId = $(this).val();

							moduleId += kriId + ',';
						}
					});
			moduleId = moduleId.slice(0, -1);
			var comment = $("#comment").val().replace(/(\r\n|\n|\r)/gm, "");
			if (comment == '' || comment.length < 10) {
				checkboxSelectValidation = true;
				toastr.error("Please Add Proper Comment");
			}
			if ($('input[name=kriId]:checked').length <= 0) {
				checkboxSelectValidation = true;
				toastr.error("Select atleast one Checkbox");
			}
			if (checkboxSelectValidation) {
				document.getElementById('load').style.visibility = "hidden";
				e.preventDefault();
			}
			//Check table data
			var filedetails = "[\n";
			if ($('#filedetails tr').length > 0) {
				$('#filedetails > tbody  > tr').each(function(index, value) {
					var splitvalue = $(this).find('td:eq(0)').text().split('.');
					var sizesplit = $(this).find('td:eq(1)').text().split(' ');
					filedetails = filedetails +
						"  {  \"fileName\": \"" + $(this).find('td:eq(0)').text() + "\",\n" +
						"    \"fileSize\": \"" + sizesplit[0] + "\",\n" +

						"    \"fileType\": \"" + splitvalue[1] + "\"\n" +
						" },";
				});
				filedetails = filedetails.substring(0, filedetails.length - 1);
			}
			filedetails = filedetails +
				"]";
			var pageValJson = "{\n"
				+ "    \"ntfModuleId\": \"" + moduleId + "\",\n"
				+ "    \"ofcCode\": \"" + ofcCode + "\",\n"
				+ "    \"targetDept\": \"" + deptId + "\",\n"
				+ "    \"ntfDate\": \"" + asstPeriod + "\",\n"
				+ "    \"ntfOfficeType\":\"" + ofcType + "\",\n"
				+ "    \"filedetailsList\":" + filedetails + ",\n"
				+ "    \"searchParam\":\"" + comment + "\"\n"
				+ "}";
			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(
				128 / 8).toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(
				reverseText(passphrase), pageValJson);

			$("#encryptedJson").val(
				ciphertext + ':~:' + passphrase);
			if (checkboxSelectValidation === false) {
				$("#resetForm").submit();
			}
		});

$(document).ready(function() {
	var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}
});