$(function() {
	$("#controlTable").DataTable({
		"columnDefs": [
			{
				targets: [3],
				width: "30%"
			},
			{
				targets: [4],
				width: "70%"
			},
			//			{
			//				visible: true,
			//				targets: [2, 3, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 20, 21, 22],
			//
			//			},
			{
				visible: false,
				targets: [1, 2, 5, 6, 7, 11, 12, 16],

			},
			{
				orderable: false,
				targets: [17, 18]

			}
		],

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
		'#controlTable_wrapper .col-md-6:eq(0)');

});

/*$(document).ready(function () {
	$('select option').filter(function(){
			return ($(this).val().trim()=="" && $(this).text().trim()=="");
		}).remove();
		
		$("select option").each(function() {
		  $(this).siblings('[value="'+ this.value +'"]').remove();
		});
		
		$('option').each(function() {
		    t = $(this).text();
		    $(this).text(t.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }))
		});
});*/


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
							/* $("<option />", {
									val: "",
									text: "Select Department"
								}).appendTo($("#officeCode")); */
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
	 $("#riskDept").prop("disabled", false);
 	 $("#officeCode").prop("disabled", false);
	 $("#officeCode").prop("selectedIndex", 0).val();
	
}); 


$('a.closemodal').click(function() {
			$('#stmtId').text($(this).attr('id'));
			$('#closemodal').modal('show');
		});
		
// Add Toaster
$(document).ready(function() {
	
	var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}
	
	//$("#riskDept").prop("disabled", true);
 	//$("#officeCode").prop("disabled", true);
});


// Validating the form before submit
$("#closeRa")
		.click(
				function() {
					var actionName = $(this).attr("name");
					var stmtId = $("#stmtId").html();
					var reason = $('#reason').val();
					var action = "XQ";
					
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
						$('span[id^="reason-error"]').remove();
						var iterationCount = 1000;
						var keySize = 128;
						//passPhrase is the key
						var passphrase = CryptoJS.lib.WordArray.random(
								128 / 8).toString(CryptoJS.enc.Hex);
						var aesUtil = new AesUtil(keySize,
								iterationCount);
						var pageValJson = "{\"riskId\":" + "\""
								+ stmtId + "\",\"riskActionStatus\":\""
								+ action + "\","
								+ "    \"riskActionName\":\""
								+ actionName + "\",\n"
								+ "  \"commentDto\":{\"comment\":\""
								+ reason + "\"}}";
						var ciphertext = aesUtil.encrypt(
								reverseText(passphrase), pageValJson);
						$("#encryptedJsonClose").val(
								ciphertext + ':~:' + passphrase);
								
						$("#raForm").submit();
					}
				});


function process(date) {
	var parts = date.split("-");
	return new Date(parts[2], parts[1] - 1, parts[0]);
}


//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
}


$('.export')
	.click(
		function() {

			if($("#userDepartment").val() == "ERM"){
				
				if($("#riskDept").val() == "ALL"){
					toastr.error('Please Select One Department');
				}else{
			
				var assessmentDate1 = $('#creationPeriod').find(":selected").val();
				var deptId = $('#riskDept').val();
				var officeType = $('#officeType').find(":selected").val();
				var officeCode = $('#officeCode').find(":selected").val();
			
			
			
					 if(officeType == ''){
							toastr.error('Please Select Office Type');
					  }  else if(deptId == ''){
						 	toastr.error('Please Select Department');
					  }
		  			  else  if(officeCode == ''){
							toastr.error('Please Select Office Code');
					  } else if(assessmentDate1 == ''){
							toastr.error('Please Select Assessment Period');
					  } else
							{
			
						var searchParameter = "searchDeptwise";
						var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
												+ "\",\"selectedDept\":\"" + deptId
												+ "\",\"selectedAssessmentPeriod\":\"" +  assessmentDate1
												+ "\",\"selectedOfcCode\":\"" +  officeCode
												+ "\",\"selectOfficeType\":\"" +  officeType
												+ "\"}";
						
			
			
						//document.getElementById('load').style.visibility = "visible";
			
						var iterationCount = 1000;
						var keySize = 128;
						//passPhrase is the key
						var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
							.toString(CryptoJS.enc.Hex);
						var aesUtil = new AesUtil(keySize, iterationCount);
						var ciphertext = aesUtil.encrypt(reverseText(passphrase),
							pageValJson);
						$("#encryptedJsonExport").val(ciphertext + ':~:' + passphrase);
						$("#export").submit();
						
						document.getElementById('load').style.visibility = "disable";
				}

			}
		}
		else
		{
			////alert("Department is NOT ERM");
			
			var assessmentDate1 = $('#creationPeriod').find(":selected").val();
			var deptId = $('#userDeptId').val();
			//var deptId = $('#riskDept').val();
			var officeType = $('#officeType').find(":selected").val();
			var officeCode = $('#officeCode').find(":selected").val();
			
			if(assessmentDate1 == ''){
					toastr.error('Please Select Assessment Period');
			  } else if(deptId == ''){
				 	toastr.error('Please Select Department');
			  }
  			  else if(officeType == ''){
					toastr.error('Please Select Office Type');
			  } else if(officeCode == ''){
					toastr.error('Please Select Office Code');
			  } else
					{
			
			var searchParameter = "searchDeptwise";
			var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
									+ "\",\"selectedDept\":\"" + deptId
									+ "\",\"selectedAssessmentPeriod\":\"" +  assessmentDate1
									+ "\",\"selectedOfcCode\":\"" +  officeCode
									+ "\",\"selectOfficeType\":\"" +  officeType
									+ "\"}";
			


			//alert(" pageValJson "+ pageValJson);
			//document.getElementById('load').style.visibility = "visible";

			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
				.toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
				pageValJson);
			$("#encryptedJsonExport").val(ciphertext + ':~:' + passphrase);
			$("#export").submit();
			
			document.getElementById('load').style.visibility = "disable";
			}
			
		}

			

		});



// department select
// selectDept
$('#getReport')
	.click(
		function() {

	
			//alert("Assessment Period "+ $('#creationPeriod').find(":selected").val());		
			//var currentDept = $('#currentDept').val();
			var assessmentDate1 = $('#creationPeriod').find(":selected").val();
			
			if($("#userDepartment").val() == "ERM"){
				var deptId = $('#riskDept').val();
			}else{
				var deptId = $('#userDeptId').val();
			}
		
			
			var officeType = $('#officeType').find(":selected").val();
			var officeCode = $('#officeCode').find(":selected").val();
			
			 if(officeType == ''){
					toastr.error('Please Select Office Type');
			  }  else if(deptId == ''){
				 	toastr.error('Please Select Department');
			  }
  			  else  if(officeCode == ''){
					toastr.error('Please Select Office Code');
			  } else if(assessmentDate1 == ''){
					toastr.error('Please Select Assessment Period');
			  } else
					{
			
			var searchParameter = "searchDeptwise";
			var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
									+ "\",\"selectedDept\":\"" + deptId
									+ "\",\"selectedAssessmentPeriod\":\"" +  assessmentDate1
									+ "\",\"selectedOfcCode\":\"" +  officeCode
									+ "\",\"selectOfficeType\":\"" +  officeType
									+ "\"}";
			
			//console.log("PageValJson "+pageValJson );
			//alert("pageValJson "+ pageValJson);
			//var pageValJson = "{\"searchParam\":" + "\"" + searchParameter
			//	+ "\",\"searchValue\":\"" + dept + "\"}";

			document.getElementById('load').style.visibility = "visible";


			// ajax call
			$
				.ajax({
					url: 'fetchRegisterDeptWise',
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

							}, 1000);

						var jsonResponse = JSON
							.stringify(response);
						var obj = JSON.parse(jsonResponse);

						////alert("Object " + obj);
						$(".registerBody").empty();

						$('#controlTable').dataTable()
							.fnClearTable();
						$('#controlTable').DataTable()
							.destroy();

						obj.registerList
							.forEach(function(item) {

								//$('#actionplantable tr:last').after(
								////alert("Risk Id "+ item.riskId);

								if (item.riskId)
									$(
										"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
										+ item.srNo
										+ "</td>"
										+ "<td>"
										+ item.riskId
										+ "</td>"
										+ "<td>"
										+ item.riskFunction
										+ "</td>"

										+ "<td>"
										+ item.riskDept
										+ "</td>"

										+ "<td>"
										+ item.riskDescription
										+ "</td>"

										+ "<td>"
										+ item.riskClassification
										+ "</td>"


										+ "<td>"
										+ item.subRiskClassification
										+ "</td>"


										+ "<td>"
										+ item.riskImpact
										+ "</td>"


										+ "<td>"
										+ item.probRiskEvent
										+ "</td>"


										+ "<td>"
										+ item.financeImpact
										+ "</td>"

										+ "<td><span class='badge text-white' style='background-color:"
										+ item.inherentRiskStatusCol
										+ "'; >"
										+ item.severityLevel
										+ "</span></td>"

										+ "<td>"
										+ item.controlDescription
										+ "</td>"


										+ "<td>"
										+ item.cntrlOwner
										+ "</td>"


										+ "<td><span class='badge text-white' style='background-color:"
										+ item.controlEffectivenessCol
										+ "'; >"
										+ item.cntrlEffectiveness
										+ "</span></td>"

										+ "<td><span class='badge text-white' style='background-color:"
										+ item.residualRiskCol
										+ "'; >"
										+ item.residualRiskRating
										+ "</span></td>"


										+ "<td><span class='badge text-white' style='background-color:"
										+ item.recordStatusCol
										+ "'; >"
										+ "Open"
										+ "</span></td>"

										+ "<td>"
										+ item.keyMitigationMeasures
										+ "</td>"

										+ "</td><td class='project-actions text-center'><span><a data-pagename='riskRegister' class='btn-sm bg-primary checkRiskData'"
										+ "id='"
										+ item.riskId
										+ "' "
										+ "title='Detailed View'> <i "
										+ "class='fas fa-glasses text-white'></i></a>"
										+ "	</span></td>"

										+"<td><span><a class='btn btn-sm bg-navy closemodal disabled' title='Close'> <i class='fas fa-times-circle'></i></a></span> </td>"


										+ "</tr>")
										.appendTo(
											".registerBody");

							});
							
							//tagline
							$("#tagline").text("Risk Register As On - "+ obj.registerDate + " for Office "+ obj.registerOfcCode);

						$("#controlTable").DataTable({
							"columnDefs": [
								{
									targets: [3],
									width: "30%"
								},
								{
									targets: [4],
									width: "70%"
								},
								//			{
								//				visible: true,
								//				targets: [2, 3, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 20, 21, 22],
								//
								//			},
								{
									visible: false,
									targets: [1, 2, 5, 6, 7, 11, 12, 16],
					
								},
								{
									orderable: false,
									targets: [17, 18]
					
								}
							],

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
							'#controlTable_wrapper .col-md-6:eq(0)');


						console.log(obj);

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
		
		
// fetch office code
//$('#officeType').change(
//		function() {
//			
//		
//	var officeId = $('#userOfcId').val();
//	var selectedOfficeType = $('#officeType').find(":selected").val();
//
//	var pageValJson = "{\"selectedOfficeType\":" + "\"" + selectedOfficeType
//						+ "\",\"officeId\":\"" +  officeId
//						+ "\"}";
//	
//	document.getElementById('load').style.visibility = "visible";
//	
//			$.ajax({
//				url: 'fetchOfficeCodes',
//				type: "POST",
//				data: {
//					pageValJson: pageValJson
//				},// important line for thymeleaf http security
//				headers: {
//					"X-CSRF-TOKEN": $(
//						"input[name='_csrf']")
//						.val()
//				},
//				cache: false,
//				// async:true,
//				success: function(response) {
//					setTimeout(
//						function() {
//
//							document
//								.getElementById('load').style.visibility = "hidden";
//
//						}, 1000);
//
//					var jsonResponse = JSON
//						.stringify(response);
//					var obj = JSON.parse(jsonResponse);
//
//					//clear Drop-Down List of 
//
//					$("#officeCode").empty();
//					$("<option />", {
//							val: "",
//							text: "Select Office Code"
//						}).appendTo($("#officeCode"));
//					obj.ofcCodeList.forEach(function(items) {
//						console.log(items);
//
//						$("<option />", {
//							val: items,
//							text: items
//						}).appendTo($("#officeCode"));
//
//
//					});
//					
//					$("#officeCodeDropDown").show();
//
//				},
//				error: function(xhr, status, error) {
//					console.log(xhr);
//					console.log(status);
//					console.log(error);
//					toastr
//						.success('Some Error Occured');
//				}
//			});
//	
//	
//});
		
		


//search method
function searchData() {
	var searchParam = $('#dimension').find(":selected").val();
	var searchValue = $('#searchcriteria').val().toUpperCase();
	if (searchParam == '') {
		toastr.info('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.info('Please Add Some Value For Search');
	} else {
		if (searchParam == 'controlStatus') {
			if (searchValue.includes('PENDING APPROVAL')) {
				searchValue = 'D';
			} else {
				searchValue = searchValue.charAt(0);
			}
		}
		var sortValue = $('#sorting').find(":selected").val();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam
			+ "\",\"searchValue\":\"" + searchValue
			+ "\",\"sortValue\":\"" + sortValue + "\"}";
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$("#searchForm").submit();
	}
}

// view Risk Register By Id
$(".registerBody").on("click", "a.checkRiskData", function(){
	
			var riskId = $(this).attr('id');
			var pageName = $(this).attr("data-pagename");
			//var searchValue = $("#selectDept").find(":selected").val();
			var pageValJson = "{\"riskId\":" + "\""
				+ riskId 
				+ "\",\"pageName\":\"" + pageName
				+ "\"}";

			document.getElementById('load').style.visibility = "visible";
			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
				.toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
				pageValJson);
			$("#encryptedJsonReg").val(ciphertext + ':~:' + passphrase);
			
			$("#registerForm").submit();

});

//$('a.checkRiskData')
//	.click(
//		function() {
//			//alert("Function Called");
//			var riskId = $(this).attr('id');
//			////alert(riskId);
//			var pageValJson = "{\"riskId\":" + "\""
//				+ riskId + "\"}";
//
//			document.getElementById('load').style.visibility = "visible";
//
//			var iterationCount = 1000;
//			var keySize = 128;
//			//passPhrase is the key
//			var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
//				.toString(CryptoJS.enc.Hex);
//			var aesUtil = new AesUtil(keySize, iterationCount);
//			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
//				pageValJson);
//			$("#encryptedJsonReg").val(ciphertext + ':~:' + passphrase);
//			$("#registerForm").submit();
//
//		});
