/**
 * File Download
 */
$(document).on('click', '.downloadfile', function() {

	//var fileName = $(this).attr('name');
	var fileName = $(this).closest('tr').find("td").eq(0).text().trim();
	var pageValJson = "{\"fileName\":" + "\"" + fileName + "\"}";
	//document.getElementById('load').style.visibility = "visible";

	// ajax call
	$.ajax({
		url: 'download',
		type: "POST",
		data: {
			pageValJson: pageValJson
		},// important line for thymeleaf http security
		headers: {
			"X-CSRF-TOKEN": $("input[name='_csrf']").val()
		},
		cache: false,
		// async:true,
		success: function(response) {

			var blob = new Blob([response], {
				type: "application/octetstream"
			});

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
			toastr.error('Some Error Occured');
		}
	});
});
