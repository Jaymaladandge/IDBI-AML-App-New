$(document).ready(
	function() {
		$("#reportTable").DataTable({
			"responsive": false,
			"lengthMenu": [10, 25, 50, 100],
			"autoWidth": true,
			"ordering": true,
			"searching": true,
			
			"language": {
				"emptyTable": "No Data Available",
			},

		})

	});

//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'complete') {
		document.getElementById('load').style.visibility = "hidden";
	}
}

$("#getReport")
	.click(
		function() {
			var deptId = $("#deptId option:selected").val();
			
			var asstPeriod1 = $("#asstMent1 option:selected")
				.val();
			var asstPeriod2 = $("#asstMent2 option:selected")
				.val();
			var pageValJson = "{\"deptId\":" + "\"" + deptId + "\",\"asstPeriod\":\"" + asstPeriod1
				+ "\",\"asstPeriodComp\":\"" + asstPeriod2 + "\"}";
				console.log(pageValJson)	
			var iterationCount = 1000;
			var keySize = 128;
			if (asstPeriod1 == '') {
				toastr
					.error('Please Select Assessement 1 For Comparison');
				return false;
			}
			if (asstPeriod2 == '') {
				toastr
					.error('Please Select Assessement 2 For Comparison');
				return false;
			}
			if (deptId == '') {
				toastr
					.error('Please Select Department For Proceed');
				return false;
			}
			if (asstPeriod1 == asstPeriod2) {
				toastr
					.error('Please Select Different Assessment For Comparison');
				return false;
			}
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(
				128 / 8).toString(CryptoJS.enc.Hex);

			var aesUtil = new AesUtil(keySize, iterationCount);

			var ciphertext = aesUtil.encrypt(
				reverseText(passphrase), pageValJson);
			$("#encryptedJson").val(
				ciphertext + ':~:' + passphrase);
			$("#reportForm").submit();
		});

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	//bsCustomFileInput.init();
})
$('#asstMent1').on('change', function() {
	var assrMent1Val = $('#asstMent1').val();
	var pageValJson = "{\"asstPeriod\":" + "\"" + assrMent1Val
		+ "\"}";
	document.getElementById('load').style.visibility = "visible";
	$
		.ajax({
			url: 'getAssmtList2',
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

				var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);

				$("#asstMent2").empty();
				$("<option />", {
					val: "",
					text: "Select Assessment"
				}).appendTo($("#asstMent2"));
				obj.forEach(
					function(items) {
						$("<option />", {
							val: items.asstPeriod,
							text: items.asstPeriod
						}).appendTo($("#asstMent2"));
					});
			},
			error: function(xhr, status, error) {

				toastr
					.success('Some Error Occured');
			}
		});
});

$("#exportDataBtn").click(function() {
	
			var deptId = $("#DeptId1").val();
			var asstPeriod1 = $("#Assest1").val();
			var asstPeriod2 = $("#Assest2").val();
			var pageValJson = "{\"deptId\":" + "\"" + deptId + "\",\"asstPeriod\":\"" + asstPeriod1
				+ "\",\"asstPeriodComp\":\"" + asstPeriod2 + "\"}";
			console.log(pageValJson)		
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

								$("#encryptedJsonEdit").val(
										ciphertext + ':~:' + passphrase);
										$("#exportExcelReport").submit();
										document.getElementById('load').style.visibility = "disable";

		});


