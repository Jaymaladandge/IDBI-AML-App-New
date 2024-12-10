/**
 * 
 */
// Fetch Action Plan Ajax Started
$('a.fetchActionPlan')
	.click(
		function() {
			var moduleId = $(this).attr('id');
			var pageValJson = "{\"moduleId\":" + "\""
				+ moduleId + "\"}";

			$("#actionLabelId").text(moduleId);

			$("#sourceId").val(moduleId);
			$("#moduleId").val(moduleId);
			
			document.getElementById('load').style.visibility = "visible";

			var userRole = $("#userRole").val();
			var rowCount = 0;

			rowCount = $('#actionplantable tr').length;

			if (rowCount > 1) {

				var i = 1;
				while (i < rowCount) {
					$('#row_id').remove();
					i++;
				}

			}
			// ajax call
			$
				.ajax({
					url: 'fetchActionPlan',
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
						obj = JSON.parse(jsonResponse);

						$('#actionplantable').dataTable()
							.fnClearTable();
						$('#actionplantable').DataTable()
							.destroy();

						var NewRowsCount = 0;
						obj
							.forEach(function(items) {
								if (items.actionPlanId)
									$(
										"<tr role='row' class='odd' id='row_id'><td class='sorting_1'>"
										+ items.actionPlanId
										+ "</td><td><span class='text-capitalize'>"
										+ items.actionPlanName
										+ "</span></td><td><span class='text-capitalize'>"
										+ items.actionOwner
										+ "</span></td><td><span class='badge bg-success'>"
										+ items.actionStatus
										+ "</span></td><td><span class='text-capitalize'>"
										+ items.actionComFreq
										+ "</span></td><td>"
										+ items.actionComPer
										+ "</td><td>"
										+ items.comDate
										+ "</td><td class='project-actions text-center'><span><a class='btn btn-sm bg-orange unlinkbtn' id='unlinkid' href='#' data-toggle='modal' data-target='#unlinkmodal'"
										+ "data-whatever=' "
										+ items.actionLinkId
										+ " ' "
										+ "title='Unlink'> <i "
										+ "class='fas fa-unlink text-white'></i></a>"
										+ "	</span></td>"
										+ "</tr>")
										.appendTo(
											".actPlanBody");
							});
						if (userRole != "Risk Owner") {
							$(".unlinkbtn").addClass(
								"disabled");
						}

						$("#actionplantable")
							.DataTable({
								"columnDefs": [{
									orderable: false,
									targets: [7]
								}],
								"responsive": false,
								"autoWidth": true,
								"searching": false,
								"fixedHeader": true
							})
							.buttons()
							.container()
							.appendTo(
								'#actionplantable_wrapper .col-md-12:eq(0)');

						//.clear().rows.add()
						$('#actionplantable').DataTable()
							.draw();
					},
					error: function(xhr, status, error) {
						console.log(xhr);
						toastr
							.error('Some Error Occured');
					}
				});
		});
$('#unlinkmodal').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('.actionPlanLinkId').attr('value', recipient);
})

// unlink code
$("#unlinkForm")
	.click(
		function(e) {

			var reason = $("#UnLinkReason").val();

			if (reason == '') {
				$('span[id^="reason-error"]').remove();
				$('#UnLinkReason').addClass('is-invalid');
				$('#UnLinkReason')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Please provide a Reason</span>');
				e.preventDefault();
			} else if (reason.length < 10) {
				$('span[id^="reason-error"]').remove();
				$('#UnLinkReason').addClass('is-invalid');
				$('#UnLinkReason')
					.after(
						'<span id="reason-error" class="error invalid-feedback" style="display: inline;">Reason must be greater than 10 characters</span>');
				e.preventDefault();
			} else {
				$('span[id^="reason-error"]').remove();

				var pageValJson = "{\"actionLinkId\": \""
					+ $("#actionPlanLinkId").val().trim()
					+ "\",\n" + "   \"commentDto\": {\n"
					+ "      \"comment\": \""
					+ $("#UnLinkReason").val() + "\"}}";

				var ciphertext = null;
				var iterationCount = 1000;
				var keySize = 128;
				//passPhrase is the key
				var passphrase = CryptoJS.lib.WordArray.random(
					128 / 8).toString(CryptoJS.enc.Hex);
				var aesUtil = new AesUtil(keySize,
					iterationCount);
				var ciphertext = aesUtil.encrypt(
					reverseText(passphrase), pageValJson);
				$("#encryptedJsonReason").val(
					ciphertext + ':~:' + passphrase);
				toastr
					.success('Action Plan Delinked Successfully');
				$("#formUnlink").submit();

			}
		});

$("#createActionPlanBtn").click(function() {

	$("#createAPForm").submit();
});
$("#mainActionPlanBtn").click(function() {

	$("#linkAPForm").submit();
});