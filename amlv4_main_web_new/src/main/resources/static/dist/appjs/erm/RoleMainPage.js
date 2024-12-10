
/*Data Tables Declarations*/
$(function() {
	$("#roletable").DataTable({
		"columnDefs": [{
			orderable: false,
			targets: [4, 5]
		}],
		"responsive": false,
		"autoWidth": true,
		"searching": true,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	}).buttons().container().appendTo(
		'#roletable_wrapper .col-md-6:eq(0)');

	$("#audittrailTab").DataTable({
		"responsive": true,
		"autoWidth": true,
		"searching": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		},
	}).buttons().container().appendTo(
		'#audittrailTab_wrapper .col-md-6:eq(0)');
});
/*Data Tables Declarations End*/

/*Message*/
$(document).ready(function() {
	
	var message = $('#message').val();
		if (message != "") {
			toastr.success(message);
		}
});		
/*Message*/

/*loader*/
$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
});

document.onreadystatechange = function() {
	 document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}
$(document).ready(function() {
	$("a .fa-twitch").click(function() {
		$('#timelinelink').css('class', 'border');
		$('#timelinelink').css('display', '');
		$('#timelinelink').click();
	});
	$("#summarylink").click(function() {
		$('#timelinelink').css('display', 'none');
	});
});
$("#today").text(moment(new Date()).format('DD/MM/YYYY'));
/*loader*/

/*Edit Role*/
$(".editRo").click(function() {
	var roleId = $(this).attr('id');
	var pageValJson = "{\"roleId\":" + "\"" + roleId + "\"}";
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase), pageValJson);
	$("#encryptedJsonEdit").val(ciphertext + ':~:' + passphrase);
	$("#editRoleForm").submit();
});
/*Edit Role End*/


/*search method*/
function searchData() {
	var searchParam = $('#dimension').find(":selected").val().replace(
		/(\r\n|\n|\r)/gm, "");
	var searchValue = $('#searchcriteria').val().toUpperCase().replace(
		/(\r\n|\n|\r)/gm, "");
	if (searchParam == '') {
		toastr.info('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.info('Please Add Some Value For Search');
	} else {
		if (searchParam == 'statusFlg') {
			if (searchValue.includes('PENDING APPROVAL')) {
				searchValue = 'D';
			} else {
				searchValue = searchValue.charAt(0);
				if (searchValue == 'D') {
					searchValue = 'X';
				} else if (searchValue == 'P') {
					searchValue = 'D';
				}
			}
		}
	var sortValue = $('#sorting').find(":selected").val();
	var pageValJson = "{\"searchParam\":" + "\"" + searchParam
		+ "\",\"searchValue\":\"" + searchValue
		+ "\",\"sortValue\":\"" + sortValue + "\"}";
		
	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(
		CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
	$("#searchForm").submit();
}
}
$('#searchcriteria').keypress(function(event) {
	if (event.keyCode === 10 || event.keyCode === 13) {
		event.preventDefault();
	}
});
/*search method*/

/*View Role Modal*/
$('a.viewRole').click(function() {
	var roleId = $(this).attr('id');
	$('#paramId').val(roleId);
	var value = "{\"roleId\":" + "\"" + roleId
		+ "\"}";
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
	$.ajax({
		url: 'viewRole',
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
		success: function(response) {
			setTimeout(function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
			}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			
			var statusFlag="";
			if(obj.statusFlg=="A"){
				statusFlag="Active";
			}else if(obj.statusFlg=="R"){
				statusFlag="Rejected";
			}else if(obj.statusFlg=="D"){
				statusFlag="Pending Approval";
			}else if(obj.statusFlg=="E"){
				statusFlag="Edited";
			}
			$('#statusFlgM').val(statusFlag);
			$('#roleNameM').val(obj.roleName);
			$('#roleCategoryM').val(obj.roleCategory);
			var liTag = '';
			obj.menus.forEach(function(item) {
				var subMenuli = '<ul>';
				var menuBtn = '<ul>';
				if (item.actionPath == null) {
					item.subMenus.forEach(function(subMenu) {
						var subMenuBtn = '<ul>';
						if (subMenu.subMenuAction != null) {
							subMenu.subMenuAction.forEach(function(subMenuBtns) {
								subMenuBtn += '<li style="display: inline-block;"class="text-capitalize"><input type="checkbox" name="parentHeader"checked=true disabled/>&nbsp;'
									+ '<label>' + subMenuBtns.split('~')[0] + '&nbsp;</label></li>';
							});
						}
						subMenuBtn += '</ul>';
						if (subMenu.checkFlg == 'true') {
							subMenuli += '<li><input type="checkbox" name="parentHeader" checked=' + subMenu.checkFlg + ' disabled/> &nbsp;'
								+ '<label>' + subMenu.subMenuName + '</label>' + subMenuBtn + '</li>';
						}
					});
				} else {
					if (item.menuAction != null) {
						item.menuAction.forEach(function(menuBtns) {
							menuBtn += '<li style="display: inline-block;"class="text-capitalize"><input type="checkbox" name="parentHeader"checked="true" disabled/>&nbsp;'
								+ '<label>' + menuBtns.split('~')[0] + '&nbsp;</label></li>';
						});
					}
				}
				menuBtn += '</ul>';
				subMenuli += '</ul>';
				if (item.checkFlg == 'true') {
					liTag += '<li><input type="checkbox" name="parentHeader"checked=' + true + ' disabled/>&nbsp;'
						+ '<label>' + item.menuName + '</label>' + menuBtn + subMenuli + '</li>';
				}
			});
			$('#viewMenuDiv ul li:last').append(liTag);
			var fileFlg = true;
			obj.filedetails.forEach(function(item) {
				fileFlg = false;
				$('#filedetails tr:last').after(
					'<tr><td>'
					+ item.fileName
					+ '</td>'
					+ '<td>'
					+ item.fileSize
					+ '</td>'
					+ '<td>'
					+ item.uploadTimestamp
					+ '</td>'
					+ '<td class="text-capitalize">'
					+ item.uploadedBy
					+ '</td>'
					+ '<td><a name=' + item.fileName + ' href="#"'
					+ ' class="btn btn-info downloadfile"><i'
					+ ' class="fas fa-download"></i></a></td></tr>');
			});
			if (fileFlg) {
				$('#filedetails').hide();
			} else {
				var seen = {};
				$('#filedetails tr').each(function() {
					var txt = $(
						this)
						.text();
					if (seen[txt])
						$(this)
							.remove();
					else
						seen[txt] = true;
				});
				$('#filedetails').show();
			}
			$('#viewRolemodal').modal('show');
		},
		error: function(xhr, status, error) {
			toastr
				.success('Some Error Occured');
		}
	});
});
/*View Role Modal*/

/*Audit trail*/
$('a.viewAuditTrail').click(function() {
	var roleId = $(this).attr('id');
	var pageValJson = "{\"activityImpactTblKey\":"
		+ "\"" + roleId + "\"}";
	document.getElementById('load').style.visibility = "visible";
	$("#auditLabelId").text(roleId);
	// ajax call
	$.ajax({
		url: 'viewAuditTrail',
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
			setTimeout(function() {
				document.getElementById('interactive');
				document.getElementById('load').style.visibility = "hidden";
				document.getElementById('contents').style.visibility = "visible";
			}, 1000);

			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			$(".timeline-inverse").empty();
			obj.forEach(function(items) {
				$(
					"<p class='test'><div class='time-label'><span class='bg-success'>"
					+ items.actDate
					+ "</span></div>"
					+ "<div><i class='fas fa-comments bg-warning'></i>"
					+ "<div class='timeline-item'>"
					+ "<h3 class='timeline-header text-capitalize'><a href='#'>"
					+ items.userName
					+ " "
					+ " ("
					+ items.userRole
					+ ") </a>"
					+ items.actionPerformed
					+ "</h3>"
					+ "<div class='timeline-body'>"
					+ items.actionComment
					+ "</div>"
					+ "</div>"
					+ "</div>"
					+ "</p>")
					.appendTo(
						".timeline-inverse");
			});

			$("<div> <i class='far fa-clock bg-gray'></i> </div>").appendTo(".timeline-inverse");
			$('#timelinelink').css('class', 'border');
			$('#timelinelink').css('display', '');
			$('#timelinelink').click();
			console.log(obj);
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			toastr.success('Some Error Occured');
		}
	});
});
	/*Audit trail*/






















































