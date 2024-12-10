

var menuArray = [];
var subMenuArray = [];
var menuActionArray = [];
var subMenuActionArray = [];

var paramKeyOld = $("#roleCategory").val();
var sourceName = $("#sourceName").val()


$(document).ready(function() {
	var statusFlg = $("#statusFlgh").val();
	$("input[name='roleStatus'][value='" + statusFlg + "']").prop("checked", true);
});

$("#roleCategory").change(function() {
	$(".menuAction").empty();
	$(".subMenuAction").empty();
	/*$("input[class='menuAction']:checkbox").prop('checked',false);
	$("input[name='childHeaderT']:checkbox").prop('checked',false);
	$("input[name='parentHeaderT']:checkbox").prop('checked',false);
	$("input[name='childHeaderT']:checkbox").prop('checked',false);*/
	$(".hideA").hide();
	
	
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
			}, 1000);
			var jsonResponse = JSON.stringify(response);
			var obj = JSON.parse(jsonResponse);
			
			
			var actionValues = obj.actionValues;
			var paramKey = obj.paramKey;
			 objParamId = obj.recordId;
			
			if (paramKeyOld == objParamId) {
			
				/*$(".menuAction").show();
				$(".subMenuAction").show()*/
				//$(".hideChecked").prop("checked", false);
				$(".hideA").show();
				$("input[name='menucheckT']:checkbox").prop('checked',true);
				$("input[name='submenucheckT']:checkbox").prop('checked',true);
				$("input[name='parentHeaderT']:checkbox").prop('checked',true);
				$("input[name='childHeaderT']:checkbox").prop('checked',true);
				
				
				$(".hideChecked").prop("checked", true);
				
				
			} else {
					/* menuArray = [];
					 subMenuArray = [];
					 menuActionArray = [];
					 subMenuActionArray = [];*/
				$("input[name='menucheckT']:checkbox").prop('checked',false);
				$("input[name='submenucheckT']:checkbox").prop('checked',false);
				$("input[name='parentHeaderT']:checkbox").prop('checked',false);
				$("input[name='childHeaderT']:checkbox").prop('checked',false);
				
						
					
					//$("input[name='menucheck']:checkbox").prop('checked',false);
				
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
		}
	});
});


$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);

})


/*Nested Menu Checkbox selection*/

$('input[type=checkbox]').change(function(e) {
	var checked = $(this).prop('checked');
	var isParent = !!$(this).closest('li').find(' > ul').length;
	if (isParent) {
		// if a parent level checkbox is changed, locate all children
		var children = $(this).closest('li').find('ul input[type=checkbox]');
		children.prop({
			checked
		}); // all children will have what parent has
	} else {
		// if a child checkbox is changed, locate parent and all children
		var parent = $(this).closest('ul').closest('li').find('>label input[type=checkbox]');
		var children = $(this).closest('ul').find('input[type=checkbox]');
		if (children.filter(':checked').length === 0) {
			// if all children are unchecked
			parent.prop({ checked: false, indeterminate: false });
		} else if (children.length === children.filter(':checked').length) {
			// if all children are checked
			parent.prop({ checked: true, indeterminate: false });
		} else {
			// if some of the children are checked
			parent.prop({ checked: true, indeterminate: true });
		}
	}
});

/*Nested Menu Checkbox selection*/

$("#submitRo").click(function() {
	var actionName = $(this).attr("name");
		
	if ($('#submitRoleForm').valid()) {
		//Check table data
		var filedetails = "[\n";
		if ($('#filedetails tr').length > 0) {
			$('#filedetails > tbody  > tr').each(
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

			
			$.each($('input[name=parentHeaderT]:checked'), function() {
			var menu_id = $(this).attr('value');
			menuArray.push(menu_id);
		});
		
		$.each($('input[name=parentHeader]:checked'), function() {
			var menu_id = $(this).attr('value');
			menuArray.push(menu_id);
		});
			$.each($('input[name=childHeaderT]:checked'), function() {
			var submenu_id = $(this).attr('value');
			subMenuArray.push(submenu_id);
			});
			
			$.each($('input[name=childHeader]:checked'), function() {
			var submenu_id = $(this).attr('value');
			subMenuArray.push(submenu_id);
		});
		$('input:checkbox[name=menucheckT]:checked').each(function() {
			menuActionArray.push($(this).attr('id'));
		});
		$('input:checkbox[name=menucheck]:checked').each(function() {
			menuActionArray.push($(this).attr('id'));
		});
		$('input:checkbox[name=submenucheckT]:checked').each(function() {
			subMenuActionArray.push($(this).attr('id'));
		});
		$('input:checkbox[name=submenucheck]:checked').each(function() {
			subMenuActionArray.push($(this).attr('id'));
		});
		
		var pageValJson = "{\"roleId\": \"" + $("#roleId").val() + "\",\n"
			+ "   \"roleName\": \"" + $("#roleName").val() + "\",\n"
			+ "   \"roleCategory\": \"" + $("#roleCategory").val() + "\",\n"
			+ "    \"moduleCode\":\"" + $("#moduleCode").val() + "\",\n" 
			+ "   \"menuArr\": \"" + menuArray + "\",\n"
			+ "   \"subMenuArr\": \"" + subMenuArray + "\",\n"
			+ "   \"menuActionArray\": \"" + menuActionArray + "\",\n"
			+ "   \"subMenuActionArray\": \"" + subMenuActionArray + "\",\n"
			+ "   \"roleStatus\": \"" + $("input[name='roleStatus']:checked").val() + "\",\n"
			+ "    \"roleActionName\":\"" + actionName + "\",\n"
			+ "   \"filedetails\":" + filedetails + ",\n"
			+ "   \"commentDto\": {\n"
			+ "   \"comment\": \"" + $("#commentRo").val().replace(/(\r\n|\n|\r)/gm, "") + "\"}}";
			
			
			console.log(pageValJson);
			alert(pageValJson);


		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase), pageValJson);
		$("#encryptedJsonUpdate").val(ciphertext + ':~:' + passphrase);
		$("#submitRoleForm").submit();
	}
});


$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();
})

//loader
document.onreadystatechange = function() {
	var state = document.readyState
	if (state == 'interactive') {
	} else if (state == 'complete') {
		setTimeout(
			function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
	}
}

$(function() {
	$('#submitRoleForm').validate({
	
		rules: {
			roleName: {
				required: true
			},
			roleCategory: {
				required: true
			},
			commentRo: {
				required: true,
				minlength: 10,
				maxlength: 400
			},
		},
		messages: {
			roleName: {
				required: "Please Enter Role Name",
			},
			roleCategory: {
				required: "Please Select Category",
			},
			commentRo: {
				required: "Please Provide Your Comment",
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
			document.getElementById('load').style.visibility = "visible";
				form.submit();
		}
		
		
		
		
	});
});


var totalsizeOfUploadFiles = 0;
function getFileData(input) {
	var select = $('.uploadTable');
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

