
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
	$("#branchTable").DataTable({
		"columnDefs": [{
			orderable: false
			//targets: [6]
		}],
		"responsive": true,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		},
		"buttons": ["csv", "excel", "pdf", "print"]
	}).buttons().container().appendTo(
		'#branchTable_wrapper .col-md-6:eq(0)');


	/*$("#divisionList").DataTable({
			"columnDefs": [{
				orderable: false
				//targets: [6]
			}],
			"responsive": true,
			"autoWidth": true,
			"searching": false,
			"fixedHeader": true,
			"language": {
						"emptyTable": "No Data Available"
					},
			"buttons": ["csv", "excel", "pdf", "print"]
		}).buttons().container().appendTo(
			'#divisionList_wrapper .col-md-6:eq(0)');	*/


});

$(document).ready(function() {
	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD-MM-YYYY',
		onChangeDateTime: function(dp, $input) {
		}
	});
});


// loss details 
$("#searchBtn").click(function() {

	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var searchParam = startDate+'~'+endDate;
	
	//alert("searchParam = " + searchParam)


	var value = "{\"searchParam\":"
		+ "\"" + searchParam + "\"}";

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
	
	
	$.ajax({
		url: 'fetchRcaReportDetails',
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
				}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			
			var dataList = obj.reportDtoList;
			
			dataList.forEach(function(items) {
			
			console.log(items.incidentId);
			});
			//alert("dataList =" + dataList);
			$(".detailList > #tbodyB").empty();
			$('#detailList').dataTable().fnClearTable();
			$('#detailList').DataTable().destroy();
			dataList.forEach(function(items) {
				$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
					+ items.incidentRecordDate
					+ "</td><td><span name='incidentName' value='" + items.operatingOfcLocation + "' class='textCapitalize'>"
					+ items.operatingOfcLocation 
					+ "</td><td><span name='operatingOfcLocation' value='" + items.operatingOfcNo + "' class='textCapitalize'>"
					+ items.operatingOfcNo
					+ "</td><td><span name='primaryLossEvent' value='" + items.primaryLossEvent + "' class='textCapitalize'>"
					+ items.primaryLossEvent
					+ "</td><td><span name='rootCauseDescription' value='" + items.rootCauseDescription + "' class='textCapitalize'>"
					+ items.rootCauseDescription
					+ "</td><td><span name='rootCauseIncident' value='" + items.rootCauseIncident + "' class='textCapitalize'>"
					+ items.rootCauseIncident
					+ "</td><td><span name='assessedImpactValue' value='" + items.assessedImpactValue + "' class='textCapitalize'>"
					+ items.assessedImpactValue
					+ "</td><td><span name='remark' class='textCapitalize'>"
					+ "</span></td>"
					+ "</tr>").appendTo(".detailList");
			});
			
			$("#detailList").DataTable({
				"columnDefs": [{
					orderable: false
					//targets: [6]
				}],
				"responsive": true,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": ["csv", "excel", "pdf", "print"]
			}).buttons().container().appendTo(
				'#detailList_wrapper .col-md-6:eq(0)');
			
	},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.success('Some Error Occured');
		}
	});
	

});



$("#responseZone").change(function() {
	var selectedValue = $('.zoneWise :selected').val()
	var value = "{\"searchParam\":"
		+ "\"" + selectedValue + "\"}";
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
	$.ajax({
		url: 'fetchDivisionList',
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
				}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			var dataList = obj.divisionCountAndAmount;
			$(".divList > #tbodyR").empty();
			$('#divisionList').dataTable().fnClearTable();
			$('#divisionList').DataTable().destroy();
			dataList.forEach(function(items) {
				$("<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
					+ items.split("~")[0]
					+ "</td><td><span name='incidentName' value='" + items.split("~")[1] + "' class='textCapitalize'>"
					+ items.split("~")[1]
					+ "</td><td><span name='incidentDescription' value='" + items.split("~")[2] + "' class='textCapitalize description'>"
					+ items.split("~")[2]
					+ "</span></td>"
					+ "</tr>").appendTo(".divList");
			});
			$("#divisionList").DataTable({
				"columnDefs": [{
					orderable: false
					//targets: [6]
				}],
				"responsive": true,
				"autoWidth": true,
				"searching": false,
				"fixedHeader": true,
				"language": {
					"emptyTable": "No Data Available"
				},
				"buttons": ["csv", "excel", "pdf", "print"]
			}).buttons().container().appendTo(
				'#divisionList_wrapper .col-md-6:eq(0)');
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr
				.success('Some Error Occured');
		}
	});
});


$(document).ready(function() {
	var x = $('.amt').val();
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
	$('#assessedImpactValue').val(res);
});













