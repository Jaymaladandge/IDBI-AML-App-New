
/*Loader*/
document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
/*Loader*/


//FOR START DATE AND END DATE  ACTION
$(document).ready(function() {
	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: false,
		maxDate: new Date(),
		format: 'DD/MM/yyyy',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: false,
		maxDate: new Date(),
		format: 'DD/MM/yyyy',
		onChangeDateTime: function(dp, $input) {
		}
	});
});


/*loader*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
});



/* fetchDataBtn click function*/

$('#fetchDataBtnReg').click(function() {

	var accountNumber = $('#accountnumber').val();

	if (accountNumber == '') {
		toastr.error('Please enter the account number');

	} else if (accountNumber != '') {

		var pageValJson = "{\"accountNumber\":" + "\"" + accountNumber + "\"\n" + "}"
		console.log(pageValJson);
		//alert(pageValJson);

		document.getElementById('load').style.visibility = "visible";
		//Ajax Call
		$.ajax({
			url: 'fetchAccountNumberlist',
			type: "POST",
			data: {
				pageValJson: pageValJson
			},
			//important line for thymeleaf http security
			headers: {
				"X-CSRF-TOKEN": $(
					"input[name='_csrf']")
					.val()
			},
			cache: false,
			//async:true,
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
				
				//alert(obj.acid)
				$('#accountname').val(obj.acid);

			    //alert(obj.acid)
				$('#custid').val(obj.acc);
				
				
				$('#schemeCode').val(obj.schm_id);
				
				
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

/*SUBMIT FUNCTION*/

$("#btn_create")
	.click(

		function(e) {
	
		
 var apString = "{\"accountNumber\":\""
					+ $("#accountnumber").val() + "\",\n"
					+ "\"accountName\":\""
					+ $("#accountname").val() + "\",\n"
					+ "\"recordId\":\""
					+ $("#recordid").val() + "\",\n"
					+ "\"custId\":\""
					+ $("#custid").val() + "\",\n"
					+ "\"schemeCode\":\""
					+ $("#schemeCode").val() + "\",\n"
					+ "\"ruleId\":\""
					+ $("#ruleid").val() + "\",\n"
					+ "\"startdate\":\""
					+ $("#startDate").val() + "\",\n"
					+ "\"enddate\":\"" + $("#endDate").val()
					 + "\"}" 
					 
			console.log(apString)
			//alert(apString);
    var date1 = $("#startDate").val();
	var date2 = $("#endDate").val();
	var startDate1 = new Date(date1);
	var endDate1 = new Date(date2);

   //date validatation (end date is always greater than start date)
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

			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(
				128 / 8).toString(CryptoJS.enc.Hex);

			var aesUtil = new AesUtil(keySize,
				iterationCount);


			var ciphertext = aesUtil.encrypt(
				reverseText(passphrase), apString);

			$("#encryptedJson").val(
				ciphertext + ':~:' + passphrase);


			$("#exemptionModule").submit();
				 
		});
		
//for validation
jQuery(document).ready(function() {
	$(function() {
		$('#exemptionModule').validate({

			rules: {

                
				ruleid: {
					required: true,
					
				},
				accountnumber: {
					required: true,
					
				},
				accountname: {
					required: true
				},
				accountname: {
					required: true
				},
				custid: {
					required: true
				},
				Startdate: {
					required: true,
					
				},
				Enddate: {
					
					greaterThan: "#startDate" ,
					required: true,
					
				},
				schemeCode: {
					required: true,
	
				},

			},
			messages: {
												
				ruleid: {
					required: "Please Select RuleId"
				},
				accountnumber: {
					required: "Please  provide a AccountNumber"
				},
				accountname: {
					required: "Please  provide a AccountName"
				},
				custid: {
					required: "Please  provide a Custid"
				},
				Startdate: {
					required: "Please  select a Startdate"
				},
				Enddate: {
					required: "Please  select a Enddate"
				},
				schemeCode: {
					required: "Please  select a schemeCode"
				},
				
			},
			errorElement: 'span',
				errorPlacement: function(
					error, element) {
					error
						.addClass('invalid-feedback');
					element.closest(
						'.form-group')
						.append(error);
				},
				highlight: function(
					element,
					errorClass,
					validClass) {
					$(element).addClass(
						'is-invalid');
				},
				unhighlight: function(
					element,
					errorClass,
					validClass) {
					$(element).removeClass(
						'is-invalid');
				},

			submitHandler: function(form) {
				document.getElementById('load').style.visibility="visible";
				form.submit();
			}
		});
	});
});