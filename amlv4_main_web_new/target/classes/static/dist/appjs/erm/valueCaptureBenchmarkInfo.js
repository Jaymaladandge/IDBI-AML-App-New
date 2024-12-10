var rowIdx = 0;
var deptName = $('#userDept').val();

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
	var deptId="";
	var ofcCode="";
	var selectedValue = "";
	var fiscalyear = "";
	var today = new Date();
	if ((today.getMonth() + 1) <= 3) {
		var year = today.getFullYear();
		year = year.toString().trim().substring(2, 4);
		fiscalyear = (today.getFullYear() - 1) + "-" + year
	} else {
		var fullyear = today.getFullYear() + 1;
		fullyear = fullyear.toString().trim().substring(2, 4);
		fiscalyear = today.getFullYear() + "-" + fullyear.toString().slice(2);
	}
	
	var selectedValue = $('#officeType :selected').val();
	
	var pageValJson = "";
	if ($("#officeType").val() === "") {
		toastr.error("Please Select Office Type");
	} else {
		selectedValue = $('#officeType :selected').val();
	}
	if ($("#riskDept").val() === "") {
		toastr.error("Please Select Department");
	} else {
		deptId = $('#riskDept :selected').val();
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
					+ "    \"selectedOfcCode\": \"" + $("#officeCode").val() + "\",\n"
					+ "    \"selectedDeptId\": \"" + $("#riskDept").val() + "\",\n"
					+ "    \"financialYear\":\"" +fiscalyear + "\"\n"
					+ "}";
	console.log(pageValJson);
	/*var ciphertext = null;
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase), value);
	var pageValJson = ciphertext + ':~:' + passphrase;*/
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: "fetchBenchmarkAssessmentValue",
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

			$(".benchmarkValueCapturetable > #tbodyR").empty();
			$('#benchmarkValueCapturetable').dataTable().fnClearTable();
			$('#benchmarkValueCapturetable').DataTable().destroy();
			var dataList = obj.benchmarkValueCaptureDtoList;
			var deptNameTemp = $('#userDept').val();
			dataList.forEach(function(items) {
				rowIdx = rowIdx + 1;
				$("<tr role='row' class='bmname' value='" + items.bmName + "' id='bmname" + rowIdx + "' name='" + items.bmId + "'><td class='sorting_1'>"
					+ items.bmName
					+ "</td><td><span value='" + items.deptName + "' id='dept" + rowIdx + "' name='" + items.deptId + "' class='textCapitalize'>"
					+ items.deptName
					+ "</td><td><span name='finyear' value='" + items.financialYear + "' id='finyear" + rowIdx + "' class='textCapitalize'>"
					+ items.financialYear
					+"</td> <td ><div class='form-group input-group'><input type='number' id='input" + rowIdx + "' name='" + items.assessmentValue + "' value='" + items.assessmentValue + "' class='form-control' disabled/>"
					+ "<a href='#' class='input-group-addon editBtn bg-green' id='edit~" + rowIdx + "'><i class='form-control fa fa-edit'></i></a></div></td>"
					+ "<td><span name='ofcCode' id='ofcCode" + rowIdx + "' value='" + items.officeCode + "' class='textCapitalize description'>"
					+ items.officeCode
					+ "</span></td><td><button type='button'  class='update btn btn-block btn-outline-primary' id='" + rowIdx + "'disabled ><i class='fa fa-save' ></i></button></td>"
				+ "</tr>").appendTo(".benchmarkValueCapturetable");
				if(deptNameTemp!='ERM'){
					$(".editBtn").css("display","none");
					
				}
			});


			$("#benchmarkValueCapturetable").DataTable({
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
				"buttons": [{
					extend: 'csvHtml5',
					exportOptions: {
						format: {
							body: function(data, row, column, node) {
								if (column === 3) {
									data = $(node).find("input").val();
								} else if (column === 5) {
									data = '';
								} else {
									data = data;
								}
								return data;
							}
						}
					},
					title: 'Benchmark Data'
				}, {
					extend: 'pdfHtml5', title: 'Benchmark Data',
					exportOptions: {
						format: {
							body: function(data, row, column, node) {
								if (column === 3) {
									data = $(node).find("input").val();
								} 
								if(column === 1 || column === 2 || column === 4){
									data =  $(node).find("span").text();
								}
								
								 if (column === 5) {
									data = '';
								} else {
									data = data;
								}
								return data;
							}
						}
					}
				}, {
					extend: 'excel',
					title: 'Benchmark Data', exportOptions: {
						format: {
							body: function(data, row, column, node) {
								if (column === 3) {
									data = $(node).find("input").val();
								} 
								if(column === 1 || column === 2 || column === 4){
									data =  $(node).find("span").text();
								}
								
								else if (column === 5) {
									data = '';
								} else {
									data = data;
								}
								return data;
							}
						}
					}
				}, {
					extend: 'print', exportOptions: {
						format: {
							body: function(data, row, column, node) {
								if (column === 3) {
									data = $(node).find("input").val();
								} 
								if(column === 1 || column === 2 || column === 4){
									data =  $(node).find("span").text();
								}
								if (column === 5) {
									data = '';
								} else {
									data = data;
								}
								return data;
							}
						}
					},
					title: 'Benchmark Data'
				}]
			}).buttons().container().appendTo(
				'#benchmarkValueCapturetable_wrapper .col-sm-12:eq(0)');



			var rowCount = $('#benchmarkValueCapturetable tr').length;
			if (rowCount > 1) {
				$('#showTable').show();
			}


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



/*$(document).ready(function() {

	//$('#officeType').val("CENTRAL OFFICE");
	document.getElementById('load').style.visibility = "visible";
	var ofcCode = $("#officeType option[value='CO']").attr("selected", "selected").change();
	

})*/

$(document).on('click', '.editBtn', function() {
	var id = this.id.split('~')[1];
	$('#input' + id).attr("disabled", false);
	$('#' + id).prop('disabled', false);
});


$(document).on('click', '.update', function() {


	var newValue = $('#input' + this.id).val();
	var oldValue = $('#input' + this.id).attr("name");

	if (newValue == oldValue) {
		toastr.error('Value Updated is same as previous value');
	} else {

		var bmId = $('#bmname' + this.id).attr("name");
		var finYear = $('#finyear' + this.id).attr("value");
		var deptId = $('#dept' + this.id).attr("name");
		var ofcCode = $('#ofcCode' + this.id).attr("value");

		var pageValJson = "{\"bmId\": \"" + bmId + "\",\n"
			+ "   \"deptId\": \"" + deptId + "\",\n"
			+ "   \"financialYear\": \"" + finYear + "\",\n"
			+ "    \"officeCode\":\"" + ofcCode + "\",\n"
			+ "    \"oldValue\":\"" + oldValue + "\",\n"
			+ "    \"newValue\":\"" + newValue + "\"}";


		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: "saveEditedBenchmarkCaptureValue",
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

				/*var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);*/

				//newValue.val(obj.newValue);
				toastr.success("Value Updated Successfully");

				$('#benchmarkValueCapturetable').DataTable().destroy();
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
					"buttons": [{
						extend: 'csvHtml5',
						exportOptions: {
							format: {
								body: function(data, row, column, node) {
									if (column === 3) {
										data = $(node).find("input").val();
									} else if (column === 5) {
										data = '';
									} else {
										data = data;
									}
									return data;
								}
							}
						},
						title: 'Benchmark Data'
					}, {
						extend: 'pdfHtml5', title: 'Benchmark Data',
						exportOptions: {
							format: {
								body: function(data, row, column, node) {
									if (column === 3) {
										data = $(node).find("input").val();
									} else if (column === 5) {
										data = '';
									} else {
										data = data;
									}
									return data;
								}
							}
						}
					}, {
						extend: 'excel',
						title: 'Benchmark Data', exportOptions: {
							format: {
								body: function(data, row, column, node) {
									if (column === 3) {
										data = $(node).find("input").val();
									} else if (column === 5) {
										data = '';
									} else {
										data = data;
									}
									return data;
								}
							}
						}
					}, {
						extend: 'print', exportOptions: {
							format: {
								body: function(data, row, column, node) {
									if (column === 3) {
										data = $(node).find("input").val();
									} else if (column === 5) {
										data = '';
									} else {
										data = data;
									}
									return data;
								}
							}
						},
						title: 'Benchmark Data'
					}]
				}).buttons().container().appendTo(
					'#benchmarkValueCapturetable_wrapper .col-sm-12:eq(0)');


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
$("#exportDataBtn").click(function() {
	
	var fiscalyear = "";
	
	deptId = $('#riskDept :selected').val();
	if(deptId != undefined){
	
	}else{
	deptId = $("#riskDept").val();
	
	}
	
	var today = new Date();
	if ((today.getMonth() + 1) <= 3) {
		var year = today.getFullYear();
		year = year.toString().trim().substring(2, 4);
		fiscalyear = (today.getFullYear() - 1) + "-" + year
	} else {
		var fullyear = today.getFullYear() + 1;
		fullyear = fullyear.toString().trim().substring(2, 4);
		fiscalyear = today.getFullYear() + "-" + fullyear.toString().slice(2);
	}
	
	var selectedValue = $('#officeType :selected').val();
	
	pageValJson = "{\n"
					+ "    \"searchParam\": \"" + selectedValue + "\",\n"
					+ "    \"selectedOfcCode\": \"" + $("#officeCode").val() + "\",\n"
					+ "    \"selectedDeptId\": \"" + deptId + "\",\n"
					+ "    \"financialYear\":\"" +fiscalyear + "\"\n"
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
										$("#frmbenchmarkVcAction").submit();
										document.getElementById('load').style.visibility = "disable";

		});
		
		
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

	
	


