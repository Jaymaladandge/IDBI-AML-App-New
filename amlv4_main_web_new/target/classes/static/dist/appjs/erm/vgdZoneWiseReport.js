/*Loader*/
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
/*Loader*/

/*Initialize Select2 Elements*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});
/*Initialize Select2 Elements*/


$(document).ready(function() {

	$(".datepicker").attr("autocomplete", "off");

	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'YYYY/MM/DD',
		autocomplete: 'off',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'YYYY/MM/DD',
		autocomplete: 'off',
		onChangeDateTime: function(dp, $input) {
		}
	});


	$('.datepicker').on('click', function(e) {
		e.preventDefault();
		$(this).attr("autocomplete", "off");
	});

	$('#reportTable').hide();

});


/*FETCH BUTTON CLICK FUNCTION*/
$('#fetchDataBtn').click(function() {

	var zone = document.getElementById("zoneDropdown");
	var zoneName = zone.options[zone.selectedIndex].text;
	var zoneId = $('#zoneDropdown').val();

	var date1 = $("#startDate").val();
	var date2 = $("#endDate").val();
	var startDate1 = new Date(date1);
	var endDate1 = new Date(date2);

	var validFlg = true;
    $("#zonewiseTable").css("display","");

	if (startDate1 > endDate1) {
		toastr
			.error("start date cannot be greater than end date");
		validFlg = false;
	} else if (date1 === '' || date1 == null) {
		toastr.error("start date cannot be blank");
		validFlg = false;
	} else if (date2 === '' || date2 == null) {
		toastr.error("end date cannot be blank");
		validFlg = false;
	}
	if (zoneId == '') {
		toastr.error("Zone cannot be blank");
		validFlg = false;
	}

if (validFlg) {
	
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();

	var pagevalJson = "{\"zoneName\":" + "\"" + zoneName + "\",\n"
		+ "    \"startDate\": \"" + startDate + "\",\n"
		+ "    \"endDate\":\"" + endDate + "\"\n" + "}";


	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchZoneWiseVgdReportDetails',
		type: "POST",
		data: {
			pageValJson: pagevalJson
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
			console.log(obj);
			var dataList = obj.omsAlerData;
		/*	dataList.forEach(function(items){
				alert('tran id '+items.tranId);
				
			}); */
			
		$(".zoneWiseVgdReportReportTable > #tbodyR").empty();
			$('#zoneWiseVgdReportReportTable').dataTable().fnClearTable();
			$('#zoneWiseVgdReportReportTable').DataTable().destroy();
			console.log(dataList);
			
			dataList.forEach(function(items) {
				$("<tr role='row' class='odd' id='row_id'><td><span name='incidentName' value='" + items.tranId + "' class='textCapitalize'>"
					+ items.tranId
					+ "</td><td><span name='operatingOfcLocation' value='" + items.tranDate + "' class='textCapitalize'>"
					+ items.tranDate
					+ "</td><td><span name='operatingOfcLocation' value='" + items.custAcid + "' class='textCapitalize'>"
					+ items.custAcid
					+ "</td><td><span name='primaryLossEvent' value='" + items.tranAmt + "' class='textCapitalize'>"
					+ items.tranAmt
					+ "</td><td><span name='primaryLossEvent' value='" + items.alertId + "' class='textCapitalize'>"
					+ items.alertId
					+ "</td><td><span name='primaryLossEvent' value='" + items.custId + "' class='textCapitalize'>"
					+ items.custId
					+ "</td><td><span name='primaryLossEvent' value='" + items.acctName + "' class='textCapitalize'>"
					+ items.acctName
					+ "</td><td><span name='primaryLossEvent' value='" + items.ruleId+ "' class='textCapitalize'>"
					+ items.ruleId
					+ "</td><td><span name='primaryLossEvent' value='" + items.ruleDesc + "' class='textCapitalize'>"
					+ items.ruleDesc
					+ "</td><td><span name='primaryLossEvent' value='" + items.partTranType + "' class='textCapitalize'>"
					+ items.partTranType
					+ "</td><td><span name='primaryLossEvent' value='" + items.branchId + "' class='textCapitalize'>"
					+ items.branchId
					+ "</td><td><span name='primaryLossEvent' value='" + items.tranParticular + "' class='textCapitalize'>"
					+ items.tranParticular					
					+ "</td>"
					+ "</tr>").appendTo(".zoneWiseVgdReportReportTable");
			});
			
		$("#zoneWiseVgdReportReportTable").DataTable({
					"columnDefs": [{
						orderable: false
					}],
					"responsive": false,
					"autoWidth": true,
					"searching": true,
					"fixedHeader": true,
					"language": {
						"emptyTable": "No Data Available"
					},
					"buttons": [{
							extend: 'excel',
							title: 'Alert Categorywise Report',
						},{	
							extend: 'csv',
							title: 'Alert Categorywise Report',
						},{	
							extend: 'pdf',
							title: 'Alert Categorywise Report',
						},{	
							extend: 'print',
							title: 'Alert Categorywise Report',

						}],
				}).buttons().container().appendTo(
					'#zoneWiseVgdReportReportTable_wrapper .col-md-6:eq(0)');
					
					$('#reportTable').show();

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
/*FETCH BUTTON CLICK FUNCTION*/



/*EXPORT EXCEL REGION WISE*/

/*EXPORT EXCEL BRANCH WISE*/
$('.exportExcelVgd').click(function() {
	var zone = document.getElementById("zoneDropdown");
	var zoneName = zone.options[zone.selectedIndex].text;
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();



		var pageValJson = "{\"zoneName\":" + "\"" + zoneName + "\",\n"
			+ "    \"startDate\": \"" + startDate + "\",\n"
			+ "    \"endDate\":\"" + endDate + "\"\n" + "}";

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonExportVgd").val(ciphertext + ':~:' + passphrase);
	$("#exportVgd").submit();
	document.getElementById('load').style.visibility = "disable";

});

/*EXPORT EXCEL BRANCH WISE*/



$(document).ready(function(){
	$("#zonewiseTable").css("display","none");
})


