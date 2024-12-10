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

/*DATE FUNCTION*/
$(document).ready(function() {
	$('#startDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD/MM/yyyy',
		onChangeDateTime: function(dp, $input) {
		}
	});
	$('#endDate').datetimepicker({
		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		maxDate: new Date(),
		format: 'DD/MM/yyyy',
		onChangeDateTime: function(dp, $input) {
		}
	});
});

/*DATE FUNCTION*/

/*fetchDataBtn click Function*/

$("#fetchDataBtn").click(function() {
	
	var zone = $("#zoneDropdown").val();
	
	
});	

/*fetchDataBtn click Function*/