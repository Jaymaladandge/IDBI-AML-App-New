/**
 * 
 */
 document.onreadystatechange = function() {
			var state = document.readyState
			if (state == 'interactive') {
				document.getElementById('contents').style.visibility = "visible";
			} else if (state == 'complete') {
				setTimeout(
						function() {
							document.getElementById('interactive');
							document.getElementById('load').style.visibility = "hidden";
							//document.getElementById('contents').style.visibility = "visible";
						}, 1000);
			}
		}
		
		$("#ntftable").DataTable({
		"columnDefs" : [ {
			orderable : false,
			targets : [6],
			//visible: document.getElementById('userRole').value == 'Enricher'
		},{
			orderable : false,
			targets : [7],
			visible:false,
		} ],
		"order" : [ 0, "desc" ],
		"responsive" : false,
		"lengthMenu" : [ 10,25, 50, 75, 100 ],
		"autoWidth" : true,
		"searching" : true,
		"fixedHeader" : true,
		 "buttons": ["csv", "excel", "pdf", "print"],
		"language" : {
			"emptyTable" : "No Data Available"
		}
	}).buttons().container().appendTo(
			'#feedbacktable_wrapper .col-md-6:eq(0)');

$('a.viewModal')
	.click(
		function() {
			
			var id = $(this).attr('id');
		
			viewModelData(id);

		});
		function viewModelData(requestId) {
		var pageValJson = "{\"requestorId\":" + "\""
			+ requestId + "\"}";
		document.getElementById('load').style.visibility = "visible";
		// ajax call
		$
			.ajax({
				url: 'viewLeaRequestModal',
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
					console.log('obj '+obj.requestorId);
					$('#requestorId').val(obj.requestorId);
					//recordStatus
					$('#recordStatus').val("View Enquiry");
					$('#selectionOfEnricher').val(
						obj.selectionOfEnricher);
					$('#subjectLine').val(obj.subjectLine);
					$('#sourceOfQuery')
						.val(obj.sourceOfQuery);
					$('#locationOfLea').val(
						obj.locationOfLea);
					$('#infoNeeded').val(
						obj.infoNeeded);
					
					$('#noticeReceivedDate').val(
						obj.noticeReceivedDate);
					$('#tatMentionedInQuery')
						.val(
							obj.tatMentionedInQuery);
					$('#tatAssignByRequestor').val(
						obj.tatAssignByRequestor);
						 $('#customerDtls tbody').empty();
						 if(obj.leaEnricherDtoObj.custDataList!=null){
							obj.leaEnricherDtoObj.custDataList.forEach(function(element){
								var customerType='';
								if(element.custType=='I'){
									customerType='Individual';
								}else if(element.custType=='N'){
									customerType='Non-Individual';
								}else{
									customerType=element.custType;
								}
							var data="<tr><td>"+element.custId+"</td><td>"+element.custFullName+"</td><td>"+customerType+"</td></tr>";
							//customerDtls
							$('#customerDtls tbody').append(data);
							$('#custAcctDtls tbody').empty();
							if(element.acctList!=null){
								element.acctList.forEach(function(acct){
							var act="<tr><td>"+acct.accountNo+"</td><td>"+acct.custId+"</td><td>"+acct.accountName+"</td><td>"+acct.acctStatus+"</td><td>"+acct.acBalanceAmt+"</td></tr>";
							$('#custAcctDtls tbody').append(act);
							$('#custAcctPersonDtls tbody').empty();
							if(acct.aasDetails!=null){
								acct.aasDetails.forEach(function(rlt){
									var rltPersonData="<tr><td>"+rlt.accountId+"</td><td>"+rlt.acReltnPersonName+"</td><td>"+rlt.reltdCustId+"</td><td>"+rlt.acReltnTypeDesc+"</td></tr>";
							$('#custAcctPersonDtls tbody').append(rltPersonData);
								});
								}
							
							})
							}
							
								
							
						});
						}
						
// Call the destroyAndReinitializeDataTable function
destroyAndReinitializeDataTable('#customerDtls');
destroyAndReinitializeDataTable('#custAcctDtls');
destroyAndReinitializeDataTable('#custAcctPersonDtls');

var matchFoundData=obj.leaEnricherDtoObj2.matchFound;
var freezeMarkedData=obj.leaEnricherDtoObj2.freezeMarked;
var statusOfQueryData=obj.leaEnricherDtoObj2.statusOfQuery;
var remarksData=obj.leaEnricherDtoObj2.remarks;
var bankReplyData=obj.leaEnricherDtoObj2.banksReply;


      if(matchFoundData!=null){
	$("#matchFound").val(matchFoundData=='Y'?'Yes':'No');
}
 if(freezeMarkedData!=null){
	$("#freezeMarked").val(freezeMarkedData=='Y'?'Yes':'No');
}
if(statusOfQueryData!=null){
	$("#statusOfQuery").val(statusOfQueryData);
}
if(remarksData!=null){
	$("#remarksValueDesc").text(remarksData);
}
if(bankReplyData!=null){
	$("#banksReply").text(bankReplyData);
}
		if(obj.leaEnricherDtoObj2.matchFound=='Y'){
			 $("#bbeRows").show();
			
			var bbePodNumberData=obj.leaEnricherDtoObj2.bbePodNumber;
			if(bbePodNumberData!=null){
				$("#PODNo").val(bbePodNumberData);
			}
			var bbeDateOfIssueData=obj.leaEnricherDtoObj2.bbeDateOfIssue;
			if(bbeDateOfIssueData!=null){
					$("#bbeDate").val(bbeDateOfIssueData);
			}
			var branchNameData=obj.leaEnricherDtoObj2.branchName;
			if(branchNameData!=null){
					$("#branchName").val(branchNameData);
			}
		}				
						
					$('#viewEnquiryModel').modal('show');
				},
				error: function(xhr, status, error) {
					toastr
						.error('Some Error Occured');
				}
			});
	}
	$('.tasknotification').click(
			function() {

				var moduleId = $(this).attr('id');
				
				var moduleName="LQTS";
				var moduleAction=$(this).attr('data-status');
				var homeString = "{\n" + "    \"moduleId\": \""
				+ moduleId + "\",\n"
				+ "    \"moduleName\": \"" + moduleName
				+ "\",\n" + "    \"moduleAction\":\""
				+ moduleAction + "\"\n" + "}";
			

		       var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
						.toString(CryptoJS.enc.Hex);

				var aesUtil = new AesUtil(keySize, iterationCount);
				var ciphertext = aesUtil.encrypt(reverseText(passphrase),
						homeString);
				$("#encryptedJson").val(ciphertext + ':~:' + passphrase);

				$("#assignQueryForm").submit(); 

			});
			$(document).ready(function() {
				var message = $('#message').val();
				if (message != "") {
					toastr.success(message);
				}
				});
				
				

function destroyAndReinitializeDataTable(tname) {
    // Check if DataTable exists
    if ($.fn.DataTable.isDataTable(tname)) {
        // DataTable exists, destroy it
        $(tname).DataTable().destroy();
    }

    // Reinitialize DataTable with new settings or data
    $(tname).DataTable({
        // Add your new options here
        "columnDefs": [{
            orderable: false,
            //targets: [9, 10]
        }],
        "paging": true,
        "ordering": true,
        "language": {
            "emptyTable": "No Data Available"
        }
        // ... and more
    });
}

function searchData(){
	toastr.success("Search Button Development in process !!!");
}
