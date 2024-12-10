$('a.ruleModalView')
	.click(
		function() {

			var ruleId = $(this).attr('id');


			var pageValJson = "{\"ruleId\":" + "\"" + ruleId
				+ "\"}";


			document.getElementById('load').style.visibility = "visible";

			// ajax call
			$
				.ajax({
					url: 'getRuleById',
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
						console.log("json Response "
							+ jsonResponse)
						var obj = JSON.parse(jsonResponse);
						console.log("obj " + obj);

						if (obj != null) {

							$("#ruleId").text(obj.ruleId);
							$("#ruleStatus").val(
								obj.recordStatus);

							const priority = obj.rulePriorityValue
								.split("~");
							$("#rulePriority").val(
								priority[0]);
							$("#Description").val(obj.ruleDesc);

							$("#ruleType").val(
								obj.ruleTat + " Day");
							$("#auditConcens").val(obj.auditConcern);
							$("#suggestedAction").val(obj.suggestedAction);
							$("#Classification").val(
								obj.ruleClassification);
							$("#Frequency").val(
								obj.ruleFrequencyValue);

							$("#DataSource")
								.val(obj.verticalTypevalue);

						}
						$('#ruleModalView').modal('show');

					},
					error: function(xhr, status, error) {
						toastr.error('Some Error Occured');
					}
				});

		});

