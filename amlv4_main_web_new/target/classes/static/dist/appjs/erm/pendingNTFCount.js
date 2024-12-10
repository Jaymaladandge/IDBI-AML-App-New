document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
		//document.getElementById('contents').style.visibility = "hidden";
	} else if (state == 'complete') {
		setTimeout(
				function() {
					document.getElementById('interactive');
					document.getElementById('load').style.visibility = "hidden";
					//document.getElementById('contents').style.visibility = "visible";
				}, 1000);
	}
}
		
/* 	$(function() {
			var currentdate = new Date();
			var datetime = +currentdate.getDate() + "/"
					+ (currentdate.getMonth() + 1) + "/"
					+ currentdate.getFullYear() + "_" + currentdate.getHours()
					+ ":" + currentdate.getMinutes() + ":"
					+ currentdate.getSeconds();

			$("#reporttable").DataTable({
				"columnDefs" : [ {
					orderable : false,

				} ],

				"order" : [ 0, "asc" ],
				"lengthMenu" : [ 25, 50, 100 ],
				"responsive" : false,
				"autoWidth" : false,
				"searching" : true,
				"fixedHeader" : true,

				"language" : {
					"emptyTable" : "No Data Available"
				},
				"buttons" : [ {

					extend : 'excel',
					title : 'RCSA Report_' + datetime,

				} ]
			}).buttons().container().appendTo(
					'#reporttable_wrapper .col-md-6:eq(0)');
		});
 */
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
});

$(function() {
		
	 $("#officeType").change(function () {
		 var userOffice=$("#officeType").val();
		 var userOfficeText = $("#officeType option:selected").text();

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
								text:items.officeCode
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


$("#reload").click(function() {
	location.reload();
});

$("#fetch").click(
function() {

	var search = "filtered";
	var selectedValue = "";
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
					+ "    \"ntfOfficeType\": \"" + selectedValue + "\",\n"
					+ "    \"assessmentDate\": \"" +$("#creationPeriod").val() + "\",\n"
					+ "    \"searchParam\": \"" +search + "\",\n"
					+ "    \"ofcCode\": \"" + $("#officeCode").val() + "\",\n"
					+ "    \"targetDept\": \"" + $("#riskDept").val() +"\"\n"
					+ "}";
	

	console.log(pageValJson);
	document.getElementById('load').style.visibility = "visible";
	var table = $('#reporttable').DataTable();
							 table.destroy();
							 $('#reporttable').dataTable().fnClearTable();
							$("#reporttableTbody").empty();
							
							$('#reporttable').DataTable()
							.destroy();
							$("#sumCount tbody").empty();
	// ajax call
	$
			.ajax({
				url : 'FetchNftPendencyCount',
				type : "POST",
				data : {
					pageValJson : pageValJson
				},// important line for thymeleaf http security

				headers : {
					"X-CSRF-TOKEN" : $(
							"input[name='_csrf']")
							.val()
				},
				cache : false,
				// async:true,
				success : function(response) {
					setTimeout(
							function() {
								document
										.getElementById('load').style.visibility = "hidden";
							}, 1000);

					var jsonResponse = JSON
							.stringify(response);

					obj = JSON.parse(jsonResponse);

					console.log(obj)
					 //$('#reporttable tr:gt(0)').remove();
					/*$('#reporttable').dataTable()
							.fnClearTable();
					$('#reporttable').DataTable()
							.destroy();*/
							
							
							var pending=0;
							var pendingForVC=0;
							var close=0;
							
							

					obj.ntfDtoList
							.forEach(function(item) {
								pending=pending+item.pendingNtf;
							
								pendingForVC=pendingForVC+item.pendingVCNtf;
							
								close=close+item.closeNtf;

								$('#reporttableTbody')
										.append(
												'<tr><td>'
														+ item.targetDept
														+ '</td><td>'
														+ item.ntfDate
														+ '</td><td>'

														+ item.pendingNtf
														+ '</td><td>'

														+ item.pendingVCNtf
														+ '</td><td>'
														+ item.closeNtf
														+ '</td></tr>'
														);
							});
							
						
							$("#sumCount tbody").append('<tr><td><b>'
														+ "SUM of Count"
														+ '</b></td><td>'
														+ pending
														+ '</td><td>'
														+pendingForVC
														+ '</td><td>'
														+ close
														+ '</td></tr>');

	/*<td><span><a class="btn btn-sm bg-success showRisk " title="View"> <i class="fas fa-arrow-circle-right text-white"></i></a></span>  </td>*/
$("#officeHeader").text($("#officeType option:selected").text()+' - '+$("#officeCode").val());
					$("#reporttable")
							.DataTable(
									{
										
										"columnDefs" : [ {
											orderable : false,
											
										} ],

										"order" : [ 0,"asc" ],
										"lengthMenu" : [25, 50,100 ],
										"responsive" : false,
										"autoWidth" : false,
										"searching" : true,
										"fixedHeader" : true,

										"language" : {
											"emptyTable" : "No Data Available"
										} 
									})
							
					

				},
				error : function(xhr, status, error) {
					console.log(xhr);
					toastr
							.error('Some Error Occured here	');
				}

			}); 
				}}}
});


$("#exportDataBtn").click(function() {
		
	var search = "filtered";
	var selectedValue = "";
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
					+ "    \"ntfOfficeType\": \"" + selectedValue + "\",\n"
					+ "    \"assessmentDate\": \"" +$("#creationPeriod").val() + "\",\n"
					+ "    \"assessmentDate2\": \"" +$("#creationPeriod option:selected").text() + "\",\n"
					+ "    \"searchParam\": \"" +search + "\",\n"
					+ "    \"officeName\": \"" +$("#officeType option:selected").text() + "\",\n"
					+ "    \"ofcCode\": \"" + $("#officeCode").val() + "\",\n"
					+ "    \"targetDept\": \"" + $("#riskDept").val() +"\"\n"
					+ "}";
	
	//$("#creationPeriod option:selected").text()

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
			$("#rcsaReportForm").submit();
			document.getElementById('load').style.visibility = "disable";

});

$("#reporttable")
							.DataTable(
									{
										
										"columnDefs" : [ {
											orderable : false,
											
										} ],

										"order" : [ 0,"asc" ],
										"lengthMenu" : [25, 50,100 ],
										"responsive" : false,
										"autoWidth" : false,
										"searching" : true,
										"fixedHeader" : true,

										"language" : {
											"emptyTable" : "No Data Available"
										} 
									})
							
	