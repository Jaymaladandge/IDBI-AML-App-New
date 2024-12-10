$(document).ready(function () {

     $('#ToleranceThresholdBetweenValue').hide();
 });
	
	$('#cancelmodel').on('show.bs.modal', function (event) {
		  var button = $(event.relatedTarget) 
		  var recipient = button.data('whatever') 
		  var modal = $(this)
		  $('a.target').attr('href', recipient);
		  
		})
	

	
  $(function () {
    //Initialize Select2 Elements
    $('.select2').select2();
	
	bsCustomFileInput.init();
}) 



	
	$("#createRA").click(function(){
	if ($('#frmriskapptstmt').valid()) {
		$('#confirmmodal').modal('show');
	}
	
	});
	
$("#create").click(function(){
	
 var	actionName = $(this).attr("name");
	// code for between threshold value
var toleranceThreshold;
if($('#raAssessmentCriteria').val() == 'BT'){
	var temp = 0;
	var startValue = parseFloat($("#StartValue").val().trim());
	var endValue = parseFloat($("#EndValue").val().trim());	

	if(startValue > endValue){	
		 temp = startValue;
		 startValue = endValue;
		 endValue = temp;
	} 	
	toleranceThreshold = startValue + " " +'-'+ " " + endValue;	
}else {	
	toleranceThreshold = $("#raToleranceThreshold").val();
}
	
	if ($('#frmriskapptstmt').valid()) {
	document.getElementById('load').style.visibility="visible";
	//Check table data
	var filedetails = "[\n";
	if($('#filedetails tr').length > 0){
	$( '#filedetails > tbody  > tr').each(function( index, value ) {
		var splitvalue = $(this).find('td:eq(0)').text().split('.');
		var sizesplit=$(this).find('td:eq(1)').text().split(' ');
		filedetails=filedetails +
		"  {  \"fileName\": \""+ $(this).find('td:eq(0)').text()+ "\",\n"+ 
		"    \"fileSize\": \""+ sizesplit[0]+ "\",\n"+ 
		
		"    \"fileType\": \""+ splitvalue[1]+ "\"\n"+
		" },";
		

	});
	//filedetails = filedetails.slice(0,-1);
	filedetails = filedetails.substring(0,filedetails.length - 1);
	}
		filedetails = filedetails +
				"]";
	var rasString = "{\n" + 
					"    \"raStmtId\": \""+ $("#raStmtId").val()+ "\",\n"+ 
					"    \"raRiskCate\": \""+ $("#raRiskCate").val()+ "\",\n"+ 
					"    \"raSubCate\":\""+ $("#raSubCate").val()+ "\",\n"+ 
					"    \"raStmtName\":\""+ $("#raStmtName").val().replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+ 
					"    \"raStmtDescription\":\""+ $("#raStmtDescription").val().replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+ 
					"    \"raStmtDataPts\":\""+ $("#raStmtDataPts").val().replace(/(\r\n|\n|\r)/gm, "")+ "\",\n"+  
					"    \"raToleranceValueDatatype\":\""+ $("#raToleranceValueDatatype").val()+ "\",\n"+ 
					"    \"raResponsibleDept\":\""+ $("#raResponsibleDept").val()+ "\",\n"+
					"    \"raCaptureValueDept\":\""+ $("#raCaptureValueDept").val()+ "\",\n"+
					"    \"raDeptProvidingData\":\""+ $("#raDeptProvidingData").val()+ "\",\n"+ 
					"    \"raCaptureValueFrequency\":\""+ $("#raCaptureValueFrequency").val()+ "\",\n"+ 
					"    \"raAssessmentCriteria\":\""+ $("#raAssessmentCriteria").val()+ "\",\n"+  
					"    \"raToleranceThreshold\":\""+toleranceThreshold+ "\",\n"+  
					"    \"raActionStatus\":\"NA\",\n" + 
					"    \"raRecordStatus\":\"CR\",\n" + 
					"    \"raActionName\":\""+actionName+ "\",\n"+  
					"    \"filedetails\":"+ filedetails+"\n"+ 
					"}";
		
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);

		var aesUtil = new AesUtil(keySize, iterationCount);
		
		var ciphertext = aesUtil.encrypt(reverseText(passphrase), rasString);
		$("#encryptedJson").val(ciphertext+':~:'+passphrase);
		
		//alert(rasString);
		$("#frmriskapptstmt").submit();
		}
	});

$(function () {

  $('#frmriskapptstmt').validate({
      rules: {
	  raRiskCate: {
        required: true
      },		
      
      
      raStmtName: {
		maxlength : 100,
        required: true
      },
      
	  raStmtDescription: {
		maxlength : 3000,
        required: true
      },
	  
	  raStmtDataPts: {
        required: true
      },
	  
	  raToleranceValueDatatype: {
        required: true
      },
	  
	 raDeptProvidingData: {
		 required: true
      },
			
	  raResponsibleDept: {
        required: true
      },
	  
	  raCaptureValueDept: {
		required: true
	},
	  raCaptureValueFrequency: {
        required: true
      },
      
      
	  raAssessmentCriteria: {
	  	required: true
	  },
	  
	  raToleranceThreshold: {
	  	required: true
	  },
	  
	 StartValue: {
	  	required: true
	  },
	
	   EndValue: {
	  	required: true
	  },

    },
    messages: {
		raRiskCate: {
        required: "Please Select a Risk Category",
      },
      

      raStmtName: {
      required: "Please provide the Risk Appetite Name",
	  maxlength: "Please enter no more than {0} characters.",
      },
      
	  raStmtDescription: {
        required: "Please provide the Risk Appetite Description",
      },
	  
	  raStmtDataPts: {
        required: "Please provide Data Points",
      },
	  
	  raToleranceValueDatatype: {
        required: "Please Select a Datatype",
      },
	  
	  raResponsibleDept: {
        required: "Please Select a Department",
      },

 	raCaptureValueDept: {
		required: "Please Select a Capture Value Department",
	},
	  
	  raDeptProvidingData: {
        required: "Please Select a Department",
      },

	  raCaptureValueFrequency: {
        required: "Please Select a Frequency",
      },
      
	  raAssessmentCriteria: {
	   required: "Please Select an Assessment Criteria",
	  },
	  
	  raToleranceThreshold: {
	  	required: "Please Provide Tolerance Threshold",
	  },

	 EndValue: {
	  	required: "Please Provide Value",
	  },

	  StartValue: {
	  	required: "Please Provide Value",
	  },
	  
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass('is-invalid');
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass('is-invalid');
    },
   submitHandler : function(form) {
									form.submit();
								}
  });
});

  //loader
  document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
       //document.getElementById('contents').style.visibility="hidden";
   } else if (state == 'complete') {
      setTimeout(function(){
         //document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
         //document.getElementById('contents').style.visibility="visible";
      },1000);
   }
  }
  
  $("#today").text(moment(new Date()).format('DD/MM/YYYY'));
  

	
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
            console.log('fName '+fName+' filename '+filename);
            if (fName == filename) {
                flg = false;
            }
        });
        if (flg) {
            select
                    .append($('<tr id=tr'+i+'><td id=filetd'+i+'>'
                            + filename
                            + '</td><td id=filesizetd'+i+'>'
                            + filesizeInMB
                            + ' kb</td><td>'
                            + moment(new Date()).format('DD/MM/YYYY')
                            + '</td><td class="text-capitalize">'
							+ username
							+ '</td><td ><a class="btn btn-danger btn-sm" id="closerow"><i class="fas fa-window-close"></i></a></td></tr>'));
            totalsizeOfUploadFiles += parseFloat(filesizeInMB);
        }
        $('#filedetails').show();
         $('#filedetailsheader').show();
    }
}
$(".uploadTable").on("click", "#closerow", function() {
   
    var rowCount = $('.uploadTable tr').length;
    console.log('row count '+rowCount);
    if (rowCount == 2) {
        $('#filedetails').hide();
         $('#filedetailsheader').hide();
    }
    $(this).closest("tr").remove();
});

$(".two-decimals").change(function(){
  this.value = parseFloat(this.value).toFixed(2);
});

$('#raAssessmentCriteria').change(function() {
    if($(this).val() == "BT"){	
    	$('#ToleranceThreshold').hide();
    	$('#ToleranceThresholdBetweenValue').show();
    }else { 
    	$('#ToleranceThreshold').show();
    	$('#ToleranceThresholdBetweenValue').hide();
    }
  
});

$("#raResponsibleDept").change(function () {
   $('#raCaptureValueDept').children().remove();
   var text = $("#raResponsibleDept option:selected").html();
   
   var val= $(this).val();
   	var stri = $(this).val() + '';
   	var stringsplit = stri.trim().split(",");
   	
   	$.each(stringsplit , function( index, value ) {
   	if(value==''){
   	value='select';
   	}
   	var textVal = $("#raResponsibleDept option[value="+value+"]").text();
     $('#raCaptureValueDept').append($('<option>', {  value : value })
          .text(textVal));
});
   
});

document.querySelector("#raToleranceThreshold").addEventListener("keypress", function (evt) {
  //  if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57)
   // {
    //    evt.preventDefault();
    //}
    
    
});

// 0 for null values
// 8 for backspace 
// 48-57 for 0-9 numbers



    /*]]>*/
