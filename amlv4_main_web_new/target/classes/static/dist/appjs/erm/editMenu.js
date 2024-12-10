$(document).ready(function() {

	$("#hiddenSubmenuType").hide();
	$("#hiddensubmenuModuleName").hide();

	$('select option').each(function() {
		t = $(this).text();
		$(this).text(t.replace(/^(.)|\s(.)/g, function($1) { return $1.toUpperCase(); }))
	});


});

//$(function() {
//	$("#submenuDetails").DataTable({
//		"columnDefs": [
//			{
//				visible: false,
//				targets: [5],
//
//			}
//		],
//		"language": {
//			"emptyTable": "No Data Available"
//		},
//
//	}).buttons().container().appendTo(
//		'#controlTable_wrapper .col-md-6:eq(0)');
//});

$(document).ready(function() {
	$('select option').filter(function() {
		return ($(this).val().trim() == "" && $(this).text().trim() == "");
	}).remove();

	$("select option").each(function() {
		$(this).siblings('[value="' + this.value + '"]').remove();
	});
});

$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this);
	$('a.target').attr('href', recipient);

});

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
})

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}

$(document).ready(function() {
	var switchStatus = false;
	$("#customSwitch3").on('change', function() {

		if ($(this).is(':checked')) {
			switchStatus = $(this).is(':checked');
			$("#actionPath").hide();
			$("#subMenu").show();

		}
		else {
			switchStatus = $(this).is(':checked');
			$("#actionPath").show();
			$("#subMenu").hide();
		}
	});
});


$(document).ready(function() {
	//$('#customSwitch3').attr('checked', false);
	if ($("#customSwitch3").is(':checked')) {
		$("#actionPath").hide();
		$("#subMenu").show();

	}
	else {
		$("#actionPath").show();
		$("#subMenu").hide();
	}
});


$(function() {
	$.validator.setDefaults({
		submitHandler: function() {
			toastr.success('Details submitted sucessfully...')
		}
	});

	$("#createmenuform").validate({

		rules: {
			menuName: {
				required: true,
			},

			menuOrder: {
				required: true
			},

			menuType: {
				required: true
			},
			commentRa: {
				required: true,
				minlength: 10
			}

		},
		messages: {

			menuName: {
				required: "Menu Name must not be empty",
			},

			menuOrder: {
				required: "Please Mentioned Menu Order",
			},

			menuType: {
				required: "Menu Type Must not be empty",
			},

			commentRa: {
				required: "Please Provide Comment",
			},
		},
		errorElement: 'span',
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback');
			element.closest('.form-group').append(error);
		},
		highlight: function(element, errorClass, validClass) {
			$(element).addClass('is-invalid');
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).removeClass('is-invalid');
		},
		submitHandler: function(form) {
			form.submit();
		}
	});

});

// Add Submenu 
var rowIdx = 0;
var count = 0;
var modCount = 0;

$('#addBtn')
	.click(
		function() {
			count = count + 1;
			modCount = modCount + 1;

			// Adding a row inside the tbody.
			$('#tbody').append(`
									<tr id="R${++rowIdx}">
										<td  id=R ${++rowIdx} class="row-index text-center">
											<input type="text" name="submenuName" class="form-control form-control-sm" placeholder="Submenu Name" id="Row ${rowIdx}" />
										</td>
										<td  id=R ${++rowIdx} class="row-index text-center">
											<input type="text" name="actionPath" class="form-control form-control-sm" placeholder="Action Path" id="Row ${rowIdx}" />
										</td>
										<td id=R ${++rowIdx} class="row-index text-center">
											<input type="number" name=""class="form-control form-control-sm" placeholder="Submenu Order" id="Row ${rowIdx}"/>
										</td>
										
										<td  id=R ${++rowIdx} class="row-index text-center">
											<select
											class="select2 text-capitalize form-control-sm submenuTypeCls"
											name="submenuType" data-placeholder="Submenu Type"
											id=Role_${count} style="width: 100%;">
											</select>
										</td>
										
										<td id=R ${++rowIdx} class="row-index text-center">
											<select
											class="form-control select2 text-capitalize form-control-sm submoduleName"
											name="AppendsubmenuModuleName" data-placeholder="Submenu Module Name"
											id=M_${modCount} style="width: 100%;">
											
											</select>
										</td>
			
										<td class="text-center">
											
											<button class="btn btn-danger btn-sm remove"
															type="button"><i class="fas fa-window-close"></i></button>
										</td>
										
										
									
									</tr>`);



			$(".submenuTypeCls").append($('#hiddenSubmenuType').html());
			$(".submoduleName").append($('#hiddensubmenuModuleName').html());

			$('.select2').select2();





		});


// closeRow
// jQuery button click event to remove a row.
$('#tbody').on('click', '.remove', function() {

	// Getting all the rows next to the row
	// containing the clicked button
	var child = $(this).closest('tr').nextAll();

	// Iterating across all the rows
	// obtained to change the index
	child.each(function() {

		// Getting <tr> id.
		var id = $(this).attr('id');

		// Getting the <p> inside the .row-index class.
		var idx = $(this).children('.row-index').children('p');

		// Gets the row number from <tr> id.
		var dig = parseInt(id.substring(1));

		// Modifying row index.
		idx.html(`Row ${dig - 1}`);

		// Modifying row id.
		$(this).attr('id', `R${dig - 1}`);
	});

	// Removing the current row.
	$(this).closest('tr').remove();

	// Decreasing total number of rows by 1.
	rowIdx--;
});


$("#submitmenu").click(function() {
	if ($('#createmenuform').valid()) {
		document.getElementById('load').style.visibility = "visible";
		switchStatus = $('#customSwitch3').is(':checked');

		if (switchStatus == true) {
			var submenuDetails = "[\n";
			if ($('#submenuDetails tr').length > 0) {
				$('#submenuDetails > tbody  > tr').each(function(index, value) {

					submenuDetails = submenuDetails +
						"  {  \"subMenuName\": \"" + $(this).find('td:eq(0) input[type=text]').val() + "\",\n" +
						"    \"subMenuPath\": \"" + $(this).find('td:eq(1) input[type=text]').val() + "\",\n" +
						"    \"subMenuType\": \"" + $(this).find('td:eq(3) select').val() + "\",\n" +
						"    \"subModuleName\": \"" + $(this).find('td:eq(4) select').val() + "\",\n" +
						"    \"subMenuId\": \"" + $(this).find('td:eq(6) input[type=hidden]').val() + "\",\n" +
						"    \"subMenuOrder\": \"" + $(this).find('td:eq(2) input[type=number]').val() + "\"\n" +
						" },";

				});

				submenuDetails = submenuDetails.substring(0, submenuDetails.length - 1);
			}
			submenuDetails = submenuDetails +
				"]";

			var actionPathId = "";

		}
		else {
			if (!$('#actionPathId').val()) {
				$('span[id^="reason-error"]').remove();
				$("#actionPathId").addClass('is-invalid');
				$('#actionPathId')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Action Path</span>');
			}
			else {
				var actionPathId = $("#actionPathId").val();
			}

			submenuDetails = null;
		}

		var filedetails = "[\n";
		if ($('#filedetails tr').length > 0) {
			$('#filedetails > tbody  > tr').each(function(index, value) {

				var splitvalue = $(this).find('td:eq(0)').text().split('.');
				var sizesplit = $(this).find('td:eq(1)').text().split(' ');

				if (sizesplit[0] != "") {
					filedetails = filedetails +
						"  {  \"fileName\": \"" + $(this).find('td:eq(0)').text() + "\",\n" +
						"    \"fileSize\": \"" + sizesplit[0] + "\",\n" +

						"    \"fileType\": \"" + splitvalue[1] + "\"\n" +
						" },";

				}

			});
			//filedetails = filedetails.slice(0,-1);
			filedetails = filedetails.substring(0, filedetails.length - 1);
		}
		filedetails = filedetails +
			"]";


		var menuString = "{\n" +
			"    \"menuId\": \"" + $("#raMenuId").val() + "\",\n" +
			"    \"menuName\": \"" + $("#menuName").val() + "\",\n" +
			"    \"menuOrder\": \"" + $("#menuOrder").val() + "\",\n" +
			"    \"menuStatus\": \"" + $("input[name='menuStatus']:checked").val() + "\",\n" +
			" 	 \"menuRecordStatus\":\"" + "E\",\n" +
			"    \"menuType\": \"" + $("#menuType").val() + "\",\n" +
			"   \"moduleName\": \"" + $("#moduleName").val() + "\",\n" +
			"    \"actionPath\": \"" + actionPathId + "\",\n" +

			"    \"subMenus\":" + submenuDetails + ",\n" +
			"    \"filedetailsList\":" + filedetails + ",\n" +
			"   \"commentDto\": {\n" +
			"      \"comment\": \"" + $("#commentRa").val().replace(/(\r\n|\n|\r)/gm, "") + "\"}}";

		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

		var aesUtil = new AesUtil(keySize, iterationCount);

		var ciphertext = aesUtil.encrypt(reverseText(passphrase), menuString);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);

		console.log(menuString);
		$("#createmenuform").submit();

	}



});

