$('#officetype').on('change', function() {

	var officeType = $("#officetype").val()
	var pageValJson = "{\"officeType\":"
		+ "\"" + officeType + "\"}";

	document.getElementById('load').style.visibility = "visible";

	// ajax call
	$
		.ajax({
			url: 'viewDashBoardByOffice',
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
				var obj = JSON
					.parse(jsonResponse);
				var dashboardTableData = $(
					'#taskNotification')
					.DataTable();


				dashboardTableData.clear().draw();

				//destroy datatable
				//table.destroy();
				obj.forEach(function(items) {
					console.log(items);
					var modelid = items.sourceId + '~' + items.sourceName + '~' + items.tasks;
					var tr = $("<tr>"
						+ "<td><a class='text-blue' data-toggle='modal'  id='" + modelid + "' onclick='viewModalFunc(this.id)' href='#'>" + items.sourceId + "</a></td>"
						+ "<td class='text-capitalize'>" + items.sourceName + "</td>"
						+ "<td>" + items.assignDate + "</td>"
						+ "<td>" + items.targetDate + "</td>"
						+ "<td class='text-capitalize'>" + items.taskName + "</td>"
						+ "<td class='text-capitalize'>" + items.officeTypeCode + "</td>"
						+ "<td class='text-capitalize'>" + items.officeCode + "</td>"
						+ "<td class='project-actions text-center'><span><a   id='" + modelid + "' onclick='dataByOffice(this.id)' class='btn-sm tasknotification " + items.bgClass + "' href='#'><i class='fas fa-arrow-circle-right text-white'></i></a></span></td>"
						+ "</tr>");

					dashboardTableData.row.add(tr[0]).draw();


				});

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

function dataByOffice(moduleId) {
	//alert("hello");
	var notifyInfo = moduleId;

	var notifyArray = notifyInfo.split('~');
	var pageValJson;
	var url;
	if (notifyArray[1] == 'RISK APPETITE') {
		if (notifyArray[2] == 'CR') {
			url = 'actionRAS';
			pageValJson = "{\"ID\":" + "\""
				+ notifyArray[1] + "\"}";
		}
	}
	var homeString = "{\n" + "    \"moduleId\": \""
		+ notifyArray[0] + "\",\n"
		+ "    \"moduleName\": \"" + notifyArray[1]
		+ "\",\n" + "    \"moduleAction\":\""
		+ notifyArray[2] + "\"\n" + "}";

	var iterationCount = 1000;
	var keySize = 128;
	//passPhrase is the key
	var passphrase = CryptoJS.lib.WordArray.random(128 / 8)
		.toString(CryptoJS.enc.Hex);

	var aesUtil = new AesUtil(keySize, iterationCount);
	var ciphertext = aesUtil.encrypt(
		reverseText(passphrase), homeString);
	$("#encryptedJson")
		.val(ciphertext + ':~:' + passphrase);

	$("#homeForm").submit();
}

/*$( document ).ready(function() {
$('#officetype option[value="ALL"]').attr("selected",
		"selected").change();
		
});*/


$('.select2').select2();

bsCustomFileInput.init();


