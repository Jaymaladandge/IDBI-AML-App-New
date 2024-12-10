
//Button Click
$(document).ready(function() {
	var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}

	var startDate = "";
	if (moment(new Date()).format('MM') < 4) {
		var lastDate = moment(new Date()).format('yyyy') - 1 + '-04' + '-01';
	} else {
		var lastDate = moment(new Date()).format('yyyy') + '-04' + '-01';
	}
	var endDate = moment(new Date()).format('yyyy-MM-DD') 
	//	$("#startDate").datepicker( "setDate" , "2021-04-01" );
	//Date range picker
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		minDate: lastDate,
		maxDate: endDate,
		format: 'yyyy-MM-DD'
	});


	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: lastDate,
		minDate: lastDate,
		format: 'yyyy-MM-DD'
	});
});

//search by date method
function searchDateData() {

	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var processFlg = $("#processFlg").val();
	if (processFlg == 'Completed') {
		if (startDate == '') {
			toastr.info('Please Select Start Date For Search');
		} else if (endDate == '') {
			toastr.info('Please Select End Date For Search');
		} else if (startDate > endDate) {
			toastr.info('Start Date Cannot Be Greater Than End Date');
		} else {
			var pageValJson = "{\"startDate\":" + "\"" + startDate
				+ "\",\"endDate\":\"" + endDate + "\"}";
			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
				.toString(CryptoJS.enc.Hex);
			var aesUtil = new AesUtil(keySize, iterationCount);
			var ciphertext = aesUtil.encrypt(reverseText(passphrase),
				pageValJson);
			$("#encryptedDateJson")
				.val(ciphertext + ':~:' + passphrase);
			$("#searchDateForm").submit();

		}
	} else {
		toastr.info('Previous Assessment Already In Progress.');
	}
}

function process(date) {
	var parts = date.split("-");
	return new Date(parts[2], parts[1] - 1, parts[0]);
}
//asstTab
$('a.viewDetails')
	.click(
		function() {

			var value = "";
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
			$
				.ajax({
					url: 'fetchPendingAsstData',
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
						obj.topriskCalDtoList
							.forEach(function(item) {
								var d = new Date(item.makeTimestamp);
								var day = d.getDate();
								var month = d.getMonth() + 1;
								var year = d.getFullYear();
								if (day < 10) {
									day = "0" + day;
								}
								if (month < 10) {
									month = "0" + month;
								}
								var date = day + "/" + month + "/" + year;
								$('#asstTab tbody tr:last').after('<tr><td>' + item.topRiskDeptId + '</td><td>'
									+ item.linkKriId + '</td><td>' + item.officeId + '</td><td>'
									+ date + '</td></tr>');
							});

						$("#asstTab").DataTable({
							"responsive": false,
							"lengthMenu": [10, 20, 50, 100],
							"autoWidth": true,
							"searching": true,
							"fixedHeader": true,
							"buttons": ["csv", "excel", "pdf", "print"]
						}).buttons().container().appendTo('#asstTab_wrapper .col-md-6:eq(0)');
						$('#viewAsstDetails')
							.modal('show');
					},
					error: function(xhr, status, error) {
						toastr
							.error('Some Error Occured');
					}
				});

		});
