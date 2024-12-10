
$(document).ready(function() {
	$(function() {
		$("#usertable").DataTable({
			"columnDefs": [{
				orderable: false,
				//targets: [9, 10]
			}],
			"order": [0, "desc"],
			"responsive": false,
			"lengthMenu": [10, 25, 50, 75, 100],
			"autoWidth": true,
			"searching": true,
			"fixedHeader": false,
			"buttons": ["csv", "excel", "pdf", "print"],
			"language": {
				"emptyTable": "No Data Available"
			}
		}).buttons().container().appendTo(
			'#usertable_wrapper .col-md-6:eq(0)');
	});

});




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

$('#searchcriteria').keypress(function(e) {
	if (e.which == 13) return false;
	if (e.which == 13) e.preventDefault();
});

$(document).ready(function() {
	var message = $('#message').val();
	if (message != "") {
		toastr.success(message);
	}

	$("a .fa-tools").click(function() {
		$('#actionplanlink').css('class', 'border');
		$('#actionplanlink').css('display', '');
		$('#actionplanlink').click();
	});

	$("a .fa-twitch").click(function() {
		$('#timelinelink').css('class', 'border');
		$('#timelinelink').css('display', '');
		$('#timelinelink').click();
	});

	$("#summarylink").click(function() {
		$('#actionplanlink').css('display', 'none');
		$('#timelinelink').css('display', 'none');
	});

	$("#actionplanlink").click(function() {
		$('#timelinelink').css('display', 'none');
	});

	//download


});

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();

	bsCustomFileInput.init();
})
$('a.closemodal').click(function() {
	$('#stmtId').text($(this).attr('id'));
	$('#closemodal').modal('show');
});
$('a.viewRaModal')
	.click(
		function() {

			var userId = $(this).attr('id');
			var toleranceValue;
			var pageValJson = "{\"userId\":" + "\""
				+ raStmtId + "\"}";
			document.getElementById('load').style.visibility = "visible";
			// ajax call
			$
				.ajax({
					url: 'viewRaModal',
					type: "POST",
					data: {
						pageValJson: pageValJson
					},// important line for thymeleaf http security
					headers: {
						"X-CSRF-TOKEN":
							$(
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


						$(
							"<div> <i class='far fa-clock bg-gray'></i> </div>")
							.appendTo(
								".timeline-inverse");
						$('#timelinelink').css('class',
							'border');
						$('#timelinelink').css('display',
							'');
						$('#timelinelink').click();

						console.log(obj);

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




//search method
function searchData() {
	var searchParam = $('#dimension').find(":selected").val();
	var searchValue = $('#searchcriteria').val().toUpperCase();
	if (searchParam == '') {
		toastr.info('Please Select Search Parameter For Search');
	} else if (searchValue == '') {
		toastr.info('Please Add Some Value For Search');
	} else {
		if (searchParam == 'userActiveStatus') {
			if (searchValue.includes('PENDING APPROVAL')) {
				searchValue = 'D';
			}

			else {
				searchValue = searchValue.charAt(0);
			}
		}

		var sortValue = $('#sorting').find(":selected").val();
		var pageValJson = "{\"searchParam\":" + "\"" + searchParam
			+ "\",\"searchValue\":\"" + searchValue.replace(/(\r\n|\n|\r)/gm, "") + "\"}";
		//alert(pageValJson);		

		var iterationCount = 1000;
		var keySize = 128;
		//passPhrase is the key
		var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
			.toString(CryptoJS.enc.Hex);
		var aesUtil = new AesUtil(keySize, iterationCount);
		var ciphertext = aesUtil.encrypt(reverseText(passphrase),
			pageValJson);
		$("#encryptedJson").val(ciphertext + ':~:' + passphrase);
		$("#searchForm").submit();
	}
}
// Validating the form before submit
$("#closeRa")
	.click(
		function() {
			var stmtId = $("#stmtId").html();
			var reason = $('#reason').val();
			var action = "XQ";
			if (reason == '') {
				$('span[id^="reason-error"]').remove();
				$('#reason').addClass('is-invalid');
				$('#reason')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
			} else if (reason.length < 10) {
				$('span[id^="reason-error"]').remove();
				$('#reason').addClass('is-invalid');
				$('#reason')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
			} else {
				$('span[id^="reason-error"]').remove();
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(
					128 / 8).toString(CryptoJS.enc.Hex);
				var aesUtil = new AesUtil(keySize,
					iterationCount);
				var pageValJson = "{\"raStmtId\":" + "\""
					+ stmtId + "\",\"raActionStatus\":\""
					+ action
					+ "\",\"commentDto\":{\"comment\":\""
					+ reason + "\"}}";
				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), pageValJson);
				$("#encryptedJsonClose").val(
					ciphertext + ':~:' + passphrase);
				$("#raForm").submit();
			}
		});

// Audit trail   
$('a.viewAuditTrail')
	.click(
		function() {
			var userId = $(this).attr('id');
			var pageValJson = "{\"activityImpactTblKey\":"
				+ "\"" + userId + "\"}";
			document.getElementById('load').style.visibility = "visible";

			$("#auditLabelId").text(userId);

			// ajax call
			$
				.ajax({
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
						setTimeout(
							function() {
								document
									.getElementById('interactive');
								document
									.getElementById('load').style.visibility = "hidden";

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


						$(
							"<div> <i class='far fa-clock bg-gray'></i> </div>")
							.appendTo(
								".timeline-inverse");
						$('#timelinelink').css('class',
							'border');
						$('#timelinelink').css('display',
							'');
						$('#timelinelink').click();

						console.log(obj);

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


/*EDIT USER*/

//edit USER
$(document).on("click", ".editUser", function() {
	var userId = $(this).attr('id');
	var pageValJson = "{\"userId\":" + "\"" + userId
		+ "\"}";

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);
	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(reverseText(passphrase),
		pageValJson);
	$("#encryptedJsonEdit")
		.val(ciphertext + ':~:' + passphrase);
	$("#editUserForm").submit();
});
/*EDIT USER*/


/*USER MODAL*/

$('a.viewUserModel')
	.click(
		function() {

			var userId = $(this).attr('id');
			var sourceName = "createVerify";

			var pageValJson = "{\"userId\":" + "\""
				+ userId + "\"}";


			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'viewUserModel',
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
							
						console.log('-------response-------'+JSON.stringify(response.documentList));

						var i = 0;
						$("#userIdLabel").text(response.userId);
						$("#mUserName").val(response.username);
						$("#mUserMobile").val(response.userMobile);
						$("#mUserEmail").val(response.userEmail);
						$("#mChannelId").val(response.channelId);
						$("#mPosition").val(response.userPosition);
						$("#mUserRoleShortName").val(response.userRole);
	
						
						//$('#modalFileId tr:gt(0)').remove();
						$('#fileDiv').hide();
						$('#modalFileId thead').empty();
						$('#modalFileId tbody').empty();
						
						if (response.documentList !== null && response.documentList !== undefined && response.documentList.length > 0) {
							
							var newRow = '<tr><th>File Name</th><th>File Size</th><th>Uploaded By</th><th>Uploaded Date</th></tr>';
							$('#modalFileId thead').append(newRow);
							
							response.documentList
								.forEach(function(item) {
									
									console.log('--------inside loop-------'+item.fileName);
									
									$('#modalFileId tbody').append('<tr><td>'+item.fileName+'</td><td>'+item.fileSize+'</td><td>'+item.uploadedBy+'</td><td>'+item.uploadedDate+'</td></tr>');
									
								});
						/*	var seen = {};
							$('#modalFileId tr')
								.each(
									function() {
										var txt = $(
											this)
											.text();
											
										if (seen[txt]){
											$(this).remove();
										}
										else{
											seen[txt] = true;
										}
									});  */
									
									
							$('#fileDiv').show();
						}

						/* 	Object.keys(obj).forEach(function(items) {
								
								 var data = obj[items];
								  console.log((++i)+' '+data);
								  //alert(data[0]);
								 // $("#userIdLabel").text(data[0]);
								//alert("items "+arr);
										}); */
					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});
			$('#viewUserModel').modal('show');
		});
$("#backbtn").click(function() {
	window.history.back();
});

/*USER MODAL*/


/*fetchDataBtn*/

$("#fetchDataBtn").click(function() {

	var userId = $("#userId").val();
	var zoneId = $("#zoneDropdown option:selected").text();
	var branchId = $('#branchDropdown').val();
	var regionId = $('#regionDropdown').val();
	var searchParam = "SearchByZone";

	var pageValJson = "{\"userBranch\":" + "\"" + branchId + "\",\n"
		+ "    \"userRegion\": \"" + regionId + "\",\n"
		+ "    \"userZone\": \"" + zoneId + "\",\n"
		+ "    \"searchParam\": \"" + searchParam + "\"\n" + "}";
	alert(pageValJson);
	document.getElementById('load').style.visibility = "visible";

	// ajax call
	$
		.ajax({
			url: 'getUser',
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
					}, 1000);
				document.getElementById('load').style.visibility = "hidden";

				var jsonResponse = JSON
					.stringify(response);
				var obj = JSON.parse(jsonResponse);

				$("#userTableBody").empty();
				$('#usertable').dataTable().fnClearTable();
				$('#usertable').DataTable().destroy();


				if (obj.userDtoList.length > 0) {
					obj.userDtoList
						.forEach(function(item) {
							$(
								"<tr>"

								+ "<td>"
								+ item.userId
								+ "</td>"

								+ "<td>"
								+ item.username
								+ "</td>"

								+ "<td>"
								+ item.userEmail
								+ "</td>"

								+ "<td>"
								+ item.userRole
								+ "</td>"

								+ "<td>"
								+ item.branchId
								+ "</td>"

								+ "<td>"
								+ item.branchName
								+ "</td>"

								+ "<td>"
								+ item.vertical
								+ "</td>"

								+ "<td><span class='badge badge-success'>"
								+ item.userActiveStatus
								+ "</span></td>"

								+ "<td class='project-actions text-center'> <a class='btn btn-sm bg-purple editUser' id='" + item.userId + "' title='Edit' ><i class='fa fa-edit fa-1x text-black'></i></a>"
								+ "</td>"

								+ "<td class='project-actions text-center'><span><a class='btn btn-sm bg-maroon viewAuditTrail' id='" + item.userId + "' title='Audit Trail' ><i class='fab fa-twitch'></i></a>"
								+ "</td>"




								+ "</tr>")
								.appendTo(
									"#userTableBody");

						});
				}


				$("#usertable").DataTable({
					"columnDefs": [{
						orderable: false,

					}],

					"order": [0, "desc"],
					"lengthMenu": [20, 40, 60, 80, 100],
					"responsive": false,
					"autoWidth": false,
					"searching": true,
					"fixedHeader": true,
					"buttons":
						[{
							extend: 'excel',
							title: 'Accounts Wise Report',
						}, {
							extend: 'csv',
							title: 'Accounts Wise Report',
						}, {
							extend: 'pdf',
							title: 'Accounts Wise Report',
						}, {
							extend: 'print',
							title: 'Accounts Wise Report',

						}],
					"language": {
						"emptyTable": "No Data Available"
					}
				}).buttons().container().appendTo(
					'#usertable_wrapper .col-md-12:eq(0)');

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


/*fetchDataBtn*/

/*FETCH REGION BASED ON ZONE*/

$('#zoneDropdown').change(function() {

	var zoneValue = $('#zoneDropdown').val();
	var pageValJson = "{\"zoneId\":" + "\"" + zoneValue + "\"\n" + "}"
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchRegionList',
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
						.getElementById('load').style.visibility = "hidden";
				}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			//clear Drop-Down List of 
			$("#regionDropdown").empty();
			$("<option />", {
				val: "ALL",
				text: "ALL"
			}).appendTo($("#regionDropdown"));
			obj.regionDtoList.forEach(function(items) {
				$("<option />", {
					val: items.regionName,
					text: items.regionName
				}).appendTo($("#regionDropdown"));
			});
			$("#regionDropdown").show();
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
/*FETCH REGION BASED ON ZONE*/


/*FETCH BRANCH BASED ON REGION*/

$('#regionDropdown').change(function() {
	var regionValue = $('#regionDropdown').val();
	var pageValJson = "{\"regionId\":" + "\"" + regionValue + "\"\n" + "}"
	document.getElementById('load').style.visibility = "visible";
	$.ajax({
		url: 'fetchRegionWiseBranchList',
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
						.getElementById('load').style.visibility = "hidden";
				}, 1000);
			var jsonResponse = JSON
				.stringify(response);
			var obj = JSON.parse(jsonResponse);
			//clear Drop-Down List of 
			$("#branchDropdown").empty();
			$("<option />", {
				val: "ALL",
				text: "ALL"
			}).appendTo($("#branchDropdown"));
			obj.branchDtoList.forEach(function(items) {
				$("<option />", {
					val: items.branchId,
					text: items.branchId + "-" + items.branchName
				}).appendTo($("#branchDropdown"));
			});
			$("#branchDropdown").show();
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
/*FETCH BRANCH BASED ON REGION*/


