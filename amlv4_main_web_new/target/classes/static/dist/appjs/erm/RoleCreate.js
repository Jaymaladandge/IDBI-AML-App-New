


//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
	} else if (state == 'complete') {
		setTimeout(function() {
			document.getElementById('interactive');
			document.getElementById('load').style.visibility = "hidden";
		}, 1000);
	}
}
$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);

});

$("#create").click(function() {
	if ($('#roleform').valid()) {
		$('#confirmmodal').modal('show');
	}
});

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
});

/*Nested Menu Checkbox selection*/
//checkbox selection 
handleChildren = function() {
	var $checkbox = $(this);
	var $checkboxChildren = $checkbox.parent().find(".children input[type=checkbox]");
	$checkboxChildren.each(function() {
		if ($checkbox.is(":checked")) {
			$(this).prop("checked", "checked");
		} else {
			$(this).prop('checked', false);
		}
	});
};
handleParents = function(current) {
	var $parent = $(current).closest(".children").closest("li").find("> input[type=checkbox]");
	if ($parent.parent().find(".children input[type=checkbox]:checked").length > 0) {
		$parent.prop("checked", "checked");
	} else {
		$parent.prop('checked', false);
		$parent.removeProp("checked");
	}
	handleParents($parent);
}


$('ul.menu_list').find('input[type=checkbox]').each(function(index, input) {
	$(input).on('click', handleChildren);
	$(input).on('click', function() {
		handleParents(this);
	});
});

/*Nested Menu Checkbox selection*/



/*Role Category*/

$("#roleCategory").change(function() {
	
	
	$(".hideChecked").prop("checked", false);
	$(".menuAction").empty();
	$(".subMenuAction").empty();
	var rolecategory = $("#roleCategory").val();
	var pageValJsonParam = "{\"recordId\":" + "\""
		+ rolecategory + "\"}";

	$.ajax({
		url: 'viewParamValue',
		type: "POST",
		data: {
			pageValJson: pageValJsonParam

		},// important line for thymeleaf http security
		headers: {
			"X-CSRF-TOKEN": $("input[name='_csrf']").val()
		},
		cache: false,
		// async:true,
		success: function(response) {
			setTimeout(function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
				//document.getElementById('contents').style.visibility = "visible";
			}, 1000);

			var jsonResponse = JSON.stringify(response);
			var obj = JSON.parse(jsonResponse);
			var actionValues = obj.actionValues;
			var paramKey = obj.paramKey;


			if (actionValues != null && actionValues.length > 0) {
				actionValues.forEach(function(item) {

					var m = 1;
					$('.leaf ul li').each(function() {
						if (typeof ($(this).attr('typ')) !== 'undefined') {
							if (typeof ($(this).attr('rel')) !== 'undefined') {
								if (typeof ($(this).attr('name')) !== 'undefined') {
									var menuType;
									menuType = $(this).attr('typ');
									if ("OM" === menuType) {
										var name;
										name = $(this).attr('name');
										$('[name="' + name + '"]').append("<input type='checkbox' name='menucheck' id='" + item + '~' + name + "' value ='" + item + '~' + name + "' /> " + item + " ");
										m++;
									}
								}
							}
						}
					});

					var sm = 1;
					$('.leaf .children ul li').each(function() {
						if (typeof ($(this).attr('styp')) !== 'undefined') {
							if (typeof ($(this).attr('name')) !== 'undefined') {
								var submenuType;
								submenuType = $(this).attr('styp');
								if ("OS" === submenuType && "CREATOR" === paramKey || "AS" === submenuType && "CREATOR" === paramKey) {
									var name;
									name = $(this).attr('name');
									$('[name="' + name + '"]').append("<input type='checkbox' name='submenucheck' id='" + item + '~' + name + "' value='" + item + '~' + name + "' /> " + item + " ");
									sm++;
								}
								if ("OS" === submenuType && "APPROVER" === paramKey || "AS" === submenuType && "APPROVER" === paramKey) {
									var name;
									name = $(this).attr('name');
									$('[name="' + name + '"]').append("<input type='checkbox' name='submenucheck' id='" + item + '~' + name + "' value='" + item + '~' + name + "' /> " + item + " ");
									sm++;
								}
								if ("OS" === submenuType && "RISK OWNER" === paramKey ||  "OS" === submenuType && "VALUE CAPTURER" === paramKey) {
									var name;
									name = $(this).attr('name');
									$('[name="' + name + '"]').append("<input type='checkbox' name='submenucheck' id='" + item + '~' + name + "'' value='" + item + '~' + name + "' /> " + item + " ");
									sm++;
								}
								if ("OS" === submenuType && "ACTION PLAN" === paramKey || "AS" === submenuType && "ACTION PLAN" === paramKey) {
										var name;
										name = $(this).attr('name');
										$('[name="' + name + '"]').append("<input type='checkbox' name='submenucheck' id='" + item + '~' + name + "' value='" + item + '~' + name + "' /> " + item + " ");
										sm++;
									}
								
								
							}
						}
					});
				});
			}
		}
	});
});
/*Role Category*/


/*display message if role category not selected*/
$(document).ready(function() {
	
	$("#collapse").click(function() {
	
	if($("#roleCategory").val() === ""){
			
		toastr.error('Please Select Category To Select Menus For Role');
		
	}
});	
	
});	

$(document).ready(function() {
	
	
});	
    $('.leaf').click(function() {
        $(this).siblings('.leaf children ul').find('li').slideUp();
 		$(this).siblings('.leaf children ul').slideToggle();

    });


/*submit button click*/
$("#submitRole").click(function() {

	var actionName = $(this).attr("name");


	if ($('#roleform').valid()) {
		document.getElementById('load').style.visibility = "visible";
		//Check table data
		var filedetails = "[\n";
		if ($('#filedetails tr').length > 0) {
			$('#filedetails > tbody  > tr')
				.each(
					function(index, value) {
						var splitvalue = $(this)
							.find(
								'td:eq(0)')
							.text().split(
								'.');
						var sizesplit = $(this)
							.find(
								'td:eq(1)')
							.text().split(
								' ');
						filedetails = filedetails
							+ "  {  \"fileName\": \""
							+ $(this)
								.find(
									'td:eq(0)')
								.text()
							+ "\",\n"
							+ "    \"fileSize\": \""
							+ sizesplit[0]
							+ "\",\n"
							+

							"    \"fileType\": \""
							+ splitvalue[1]
							+ "\"\n"
							+ " },";

					});
			filedetails = filedetails.substring(0,
				filedetails.length - 1);
		}
		filedetails = filedetails + "]";
		var menuArray = [];
		var subMenuArray = [];
		var menuActionArray = [];
		var subMenuActionArray = [];
		


		$.each($('input[name=parentHeader]:checked'), function() {
			var menu_id = $(this).attr('value');
			menuArray.push(menu_id);
		});

		$.each($('input[name=childHeader]:checked'), function() {
			var submenu_id = $(this).attr('value');
			subMenuArray.push(submenu_id);
		});


		$('input:checkbox[name=menucheck]:checked').each(function() {
			menuActionArray.push($(this).attr('value'));
		});

		$('input:checkbox[name=submenucheck]:checked').each(function() {
			subMenuActionArray.push($(this).attr('value'));
		});

		var roleString = "{\n" +
			"    \"roleId\": \"" + $("#roleId").val() + "\",\n" +
			"    \"roleName\":\"" + $("#roleName").val() + "\",\n" +
			"    \"roleCategory\":\"" + $("#roleCategory").val() + "\",\n" +
			"    \"moduleCode\":\"" + $("#moduleCode").val() + "\",\n" +
			"    \"filedetails\":" + filedetails + ",\n" +
			"   \"roleStatus\": \"" + $("input[name='roleStatus']:checked").val() + "\",\n" +
			"    \"roleActionName\":\"" + actionName + "\",\n" +
			"    \"menuArr\":\"" + menuArray + "\",\n" +
			"    \"subMenuArr\":\"" + subMenuArray + "\",\n" +
			"    \"menuActionArray\":\"" + menuActionArray + "\",\n" +
			"    \"subMenuActionArray\":\"" + subMenuActionArray + "\"\n" +

			"}";
			
			alert(roleString);
			
		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(
			128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize,
			iterationCount);
		var ciphertext = aesUtil.encrypt(
			reverseText(passphrase), roleString);
		$("#encryptedJson").val(
			ciphertext + ':~:' + passphrase);
		$("#roleform").submit();
	}
});
/*submit button click*/


/*form validate*/
$(function() {
	$('#roleform').validate({
		rules: {
			roleName: {
				required: true
			},
			roleCategory: {
				required: true
			},
			
			
		},
		messages: {
			roleName: {
				required: "Please Enter Role Name",
			},
			roleCategory: {
				required: "Please Select Category",
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
			//toastr
			//		.success('Action Plan Created Successfully');
			document.getElementById('load').style.visibility = "visible";
			form.submit();
		}
	});
});
/*form validate*/



/*file upload*/
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
	console.log('row count ' + rowCount);
	if (rowCount == 2) {
		$('#filedetails').hide();
		$('#filedetailsheader').hide();
	}
	$(this).closest("tr").remove();
});
/*file upload*/


