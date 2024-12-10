document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})

$("#saveEdit").click(function() {

	if ($('#ediEddForm').valid()) {


		var testdetails = "[\n";
		if ($('#eddQueTab tr').length > 0) {
			$('#eddQueTab > tbody  > tr')
				.each(
					function() {
						var examQuestions = $(
							this).find(
								'td:eq(0)').find(
									"input")
							.val();
						var correctOpt = $(this)
							.find(
								'td:eq(2)')
							.find(
								"input")
							.val().split(
								',');
						var availableOpt = '';
						$.each(
							correctOpt,
							function(
								i) {
								var temp = correctOpt[i];
								availableOpt = temp + "~" + availableOpt;
							});
						availableOpt = availableOpt.substring(0, availableOpt.length - 1);
						if (examQuestions != "") {
							testdetails = testdetails
								+ "  {  \"question\": \"" + examQuestions + "\","
								+ "    \"questionType\": \"" + $(this).find('td:eq(1)').find("input").val() + "\",\n"
								+ "    \"options\": \""
								+ availableOpt
								+ "\" },";
						} else {
							toastr.error('Please check the questions added');
						}
					});
			testdetails = testdetails.substring(0,
				testdetails.length - 1);
		}
		testdetails = testdetails + "]";
		console.log(testdetails);
		var pageValJson = "{\n" +
			"	\"testId\": \"" + $("#eddId").val() + "\",\"testInstruction\": \"" + $("#TestInstruction").val() + "\","
			+ " \"testDescription\": \"" + $("#testDescription").val() + "\"," +
			"   \"queList\": " + testdetails + "}";
		$("#encryptedJson").val(pageValJson);
		$("#ediEddForm").submit();
	};
});

function removeTr(id) {
	$('#tr' + id).remove();
}

var rowCount = $('#eddQueTab >tbody >tr').length;
$("#addrow")
	.click(
		function() {

			$('#eddQueTab tr:last')
				.after(
					'<tr id="tr' + rowCount
					+ '"><td><input type="text" style="width: 100%" /></td>'
					+ '<td><input type="text" style="width: 100%" /></td>'
					+ '<td><input type="text" style="width: 100%" /></td>'
					+ '<td><a class="btn btn-danger btn-sm" title="Remove" id="'
					+ rowCount
					+ '"'
					+ 'onclick="removeTr(this.id)"><em class="fa fa-window-close"></em></a></td></tr> ');
		});

$('#ediEddForm')
	.validate(
		{
			rules: {
				testDescription: {
					required: true,
					minlength: 10,
					maxlength: 3000,
				},
				TestInstruction: {
					required: true,
					minlength: 10,
					maxlength: 3000,
				},
			},
			messages: {
				testDescription: {
					required: "Please enter the EDD description",
					minlength: "Description must be at least 10 characters long",
					maxlength: "Description cannot exceed 3000 characters",
				},
				TestInstruction: {
					required: "Please enter the EDD instruction",
					minlength: "Instruction must be at least 10 characters long",
					maxlength: "Instruction cannot exceed 3000 characters",
				},
			},
			errorElement: 'span',
			errorPlacement: function(error, element) {
				error.addClass('invalid-feedback');
				element.closest('.form-group').append(error);
			},
			highlight: function(element, errorClass,
				validClass) {
				$(element).addClass('is-invalid');
			},
			unhighlight: function(element, errorClass,
				validClass) {
				$(element).removeClass('is-invalid');
			},
		});

