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

/*cancel Modal*/
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})
/*cancel Modal*/


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

$(document).ready(function() {

	// Denotes total number of rows
	var rowIdx = 0;

	// jQuery button click event to add a row
	$('#addBtn').on('click', function() {

		// Adding a row inside the tbody.
		$('#tbody').append(`<tr id="R${++rowIdx}">
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
				class="select2 text-capitalize form-control-sm"
				name="AppendsubmenuType"
				data-placeholder="Submenu Type"
				 style="width: 100%;">
					<option value=''>Select</option>
					<option value="OS" class="text-capitalize">Operational Submenu</option>
					<option value="AS" class="text-capitalize">Admin
						Submenu</option>
	
	
						</select>
			
			
			</td>
			
			
			<td id=R ${++rowIdx} class="row-index text-center">
			<select
						class="select2 text-capitalize form-control-sm"
						name="AppendsubmenuModuleName"
						data-placeholder="Submenu Module Name"
						 style="width: 100%;">
							<option value=''>Select</option>
							<option value="TOP RISK" class="text-capitalize">Top
								Risk</option>
							<option value="APP PARAMETER" class="text-capitalize">App
								Parameter</option>
							<option value="USER MASTER" class="text-capitalize">User
								Master</option>
							<option value="MENU MASTER" class="text-capitalize">Menu
								Master</option>
							<option value="KEY RISK INDICATOR"
								class="text-capitalize">Key Risk Indicator</option>
			
					</select>
			
			
			</td>
			
			<td class="text-center">
				<button class="btn btn-danger btn-sm remove"
				type="button"><i class="fas fa-window-close"></i></button>
				</td>
			</tr>`);
	});

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
});

/*cancel Modal*/
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);
})
/*cancel Modal*/



/*Form Validate*/
$(function() {
	$('#frmMenu').validate({
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
			moduleName: {
				required: true
			},

			commentRa: {
				required: true,
				minlength: 10
			},

		},
		messages: {
			commentRa: {
				required: "Please Provide a comment",
			},
			menuName: {
				required: "Menu Name must not be empty",
			},

			menuOrder: {
				required: "Please Mentioned Menu Order",
			},

			menuType: {
				required: "Menu Type Must not be empty",
			},

			moduleName: {
				required: "Module Name Must not be empty",
			},
		},
		errorElement: 'span',
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback');
			element.closest('.form-group')
				.append(error);
		},
		highlight: function(element, errorClass,
			validClass) {
			$(element).addClass('is-invalid');
		},
		unhighlight: function(element, errorClass,
			validClass) {
			$(element).removeClass('is-invalid');
		},
		submitHandler: function(form) {

			setTimeout(function() {
				form.submit();
			}, 2000);
		}
	});
});
/*Form Validate*/


/*Submit function*/
$("#submitmenu").click(function() {

	if ($('#frmMenu').valid()) {
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
				filedetails = filedetails +
					"  {  \"fileName\": \"" + $(this).find('td:eq(0)').text() + "\",\n" +
					"    \"fileSize\": \"" + sizesplit[0] + "\",\n" +

					"    \"fileType\": \"" + splitvalue[1] + "\"\n" +
					" },";


			});
			//filedetails = filedetails.slice(0,-1);
			filedetails = filedetails.substring(0, filedetails.length - 1);
		}
		filedetails = filedetails +
			"]";

		var statusFlgOld = $("#statusFlg").val();
		if ($("#statusFlg").val() == 'Active') {
			statusFlgOld = 'A';
		} else if ($("#statusFlg").val() == 'Pending for Approval') {
			statusFlgOld = 'D';
		} else if ($("#statusFlg").val() == 'Rejected') {
			statusFlgOld = 'R';
		} else if ($("#statusFlg").val() == 'Closed') {
			statusFlgOld = 'C';
		} else if ($("#statusFlg").val() == 'Edited') {
			statusFlgOld = 'E';
		}
		else if ($("#statusFlg").val() == 'Deleted') {
			statusFlgOld = 'X';
		}

		var comment = $("#CommentMenu").val();

		var menuString = "{\n" + "\"menuId\": \"" + $("#menuId").val() + "\",\n"
			+ " \"sourceName\": \"" + $("#sourceName").val() + "\",\n"
			+ " \"menuStatusOld\": \"" + statusFlgOld + "\",\n"
			+ "    \"menuName\": \"" + $("#menuName").val() + "\",\n"
			+ "    \"menuOrder\": \"" + $("#menuOrder").val() + "\",\n"
			+ "    \"menuType\": \"" + $("#menuType").val() + "\",\n"
			+ "   \"moduleName\": \"" + $("#moduleName").val() + "\",\n"
			+ "  \"actionPath\": \"" + actionPathId + "\",\n"
			+ "  \"subMenus\":" + submenuDetails + ",\n"
			+ "  \"filedetailsList\":" + filedetails + ",\n"
			+ " \"menuStatus\": \"" + $("input[name='menuStatus']:checked").val() + "\",\n"
			+ " \"menuRecordStatus\": \"" + "E\",\n"
			+ "\"commentDto\":{\"comment\":\""
			+ comment + "\"}}";

		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(
			128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize,
			iterationCount);
		var ciphertext = aesUtil.encrypt(
			reverseText(passphrase), menuString);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);

		console.log("Menu Json " + menuString);
		$("#frmMenu").submit();
	}
});

/*Submit function*/




var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
	$('.odd').closest("tr").remove();
	for (var i = 0; i < input.files.length; i++) {
		var filesizeInBytes = input.files[i].size;
		var filesizeInMB = (filesizeInBytes / (1024)).toFixed(2);
		var filename = input.files[i].name;
		var flg = true;

		var userName = $('#clientName').val();
		$('.uploadTable tr').each(function() {
			var fName = $(this).find('td:eq(0)').text();
			console.log('fName ' + fName + ' filename ' + filename);
			if (fName == filename) {
				flg = false;
			}
		});
		if (flg) {
			select
				.append($('<tr id=tr' + i + '><td id=filetd' + i + '>'
					+ filename
					+ '</td><td id=filesizetd' + i + '>'
					+ filesizeInMB
					+ ' kb</td><td>'
					+ moment(new Date()).format('DD/MM/YYYY')
					+ '</td><td class="text-capitalize">'
					+ userName
					+ '</td><td class="text-right py-0 align-middle"> - </td><td class="project-actions text-right"><a class="btn btn-danger btn-sm" id="closerow"><i class="fa fa-window-close"></i></a></td></tr>'));
			totalsizeOfUploadFiles += parseFloat(filesizeInMB);
		}
		$('#filedetails').show();
	}
}
$(".uploadTable").on("click", "#closerow", function() {

	var rowCount = $('.uploadTable tr').length;
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#filedetails').hide();
	}
	$(this).closest("tr").remove();
});


$(".two-decimals").change(function() {
	this.value = parseFloat(this.value).toFixed(2);
});

//document.querySelector("#raToleranceThreshold").addEventListener("keypress", function (evt) {
//    if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57)
//   {
//       evt.preventDefault();
//   }
//});

$(function() {
	$("#filedetails").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [4, 5]
		}],
		"lengthMenu": [5, 10, 25, 50, 75, 100],
		"responsive": false,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#filedetails_wrapper .col-md-12:eq(0)');
});
//download
$(document).ready(function() {
	$(document).on('click', '.downloadfile', function() {

		var fileName = $(this).attr('name');
		var pageValJson = "{\"fileName\":"
			+ "\"" + fileName + "\"}";
		//document.getElementById('load').style.visibility = "visible";

		// ajax call
		$
			.ajax({
				url: 'download',
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


					var blob = new Blob([response], { type: "application/octetstream" });

					//Check the Browser type and download the File.
					var isIE = false || !!document.documentMode;
					if (isIE) {
						window.navigator.msSaveBlob(blob, fileName);
					} else {
						var url = window.URL || window.webkitURL;
						link = url.createObjectURL(blob);
						var a = $("<a />");
						a.attr("download", fileName);
						a.attr("href", link);
						$("body").append(a);
						a[0].click();
						$("body").remove(a);
					}

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

});

// 0 for null values
// 8 for backspace 
// 48-57 for 0-9 numbers
