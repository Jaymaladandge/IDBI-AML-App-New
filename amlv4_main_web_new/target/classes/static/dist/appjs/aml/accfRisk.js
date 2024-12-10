
$(".fetchAccfRisk").click(
	function() {
		var refId = $(this).attr('refId');
		var pageValJson = "{\"refId\": \"" + refId + "\"}";
		document.getElementById('load').style.visibility = "visible";
		$.ajax({
			url: 'fetchAccfRiskData',
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
				setTimeout(
					function() {
						document.getElementById('load').style.visibility = "hidden";
					}, 1000);
				var jsonResponse = JSON.stringify(response);
				var obj = JSON.parse(jsonResponse);
				$("#ucicNo").text(obj.ucicId);
				$("#accfTab > #tBodyAccf").empty();
				var trLength = obj.alertCatList.length;
				var flg = true;
				obj.alertCatList.forEach(function(items) {
					var jsonObj = JSON.parse(items.riskJson);
					var tabDiv = '';
					var risk;
					var finalRisk;
					var custRisk;
					var derivedRisk;
					$.each(jsonObj, function(key, value) {
						var keyDiv;
						if (key == 'G') {
							keyDiv = '<span class="text-bold text-green verti">Green</span>'
						} if (key == 'A') {
							keyDiv = '<span class="text-bold text-orange">Amber</span>'
						} if (key == 'R') {
							keyDiv = '<span class="text-bold text-red">Red</span>'
						}
						if (items.ragStatus == 'G') {
							risk = '<span class="text-bold text-green">Green</span>'
						} if (items.ragStatus == 'A') {
							risk = '<span class="text-bold text-orange">Amber</span>'
						} if (items.ragStatus == 'R') {
							risk = '<span class="text-bold text-red">Red</span>'
						}
						
						if (items.derivedRisk == 'G') {
							derivedRisk = '<span class="text-bold text-green">Green</span>'
						} if (items.derivedRisk == 'A') {
							derivedRisk = '<span class="text-bold text-orange">Amber</span>'
						} if (items.derivedRisk == 'R') {
							derivedRisk = '<span class="text-bold text-red">Red</span>'
						}
						if (items.finalRisk == 'G') {
							finalRisk = '<span class="text-bold text-green">Green</span>'
						} if (items.finalRisk == 'A') {
							finalRisk = '<span class="text-bold text-orange">Amber</span>'
						} if (items.finalRisk == 'R') {
							finalRisk = '<span class="text-bold text-red">Red</span>'
						}

						if (items.custRisk == 'L') {
							custRisk = '<span class="text-bold text-green">Low</span>'
						} if (items.custRisk == 'M') {
							custRisk = '<span class="text-bold text-orange">Medium</span>'
						} if (items.custRisk == 'H') {
							custRisk = '<span class="text-bold text-red">High</span>'
						}
						tabDiv += '<tr><td>' + keyDiv + '</td><td>' + value.split('~')[0] + '</td><td>' + value.split('~')[1] + '</td></tr>';
					});
					var finalWtDiv = '';
					if (flg) {
						flg = false;
						finalWtDiv = "</td><td rowspan=" + trLength * 4 + " style='vertical-align: middle;'> " + items.finalWt
						+ "</td><td rowspan=" + trLength * 4 + " style='vertical-align: middle;'> " + derivedRisk
							+ "</td><td rowspan=" + trLength * 4 + " style='vertical-align: middle;'> " + custRisk
							+ "</td><td rowspan=" + trLength * 4 + " style='vertical-align: middle;'> " + finalRisk;
					} else {
						finalWtDiv = '';
					}
					//tabDiv += '</table>';
					$("<tr role='row' class='odd text-capitalize' id='row_id'><td style='vertical-align: middle;' rowspan='4'>"
						+ items.ruleCat.toLowerCase()
						+ "</td><td class='text-capitalize verti' style='vertical-align: middle;' rowspan='4'>"
						+ items.cateWt
						+ "</td><td class='text-capitalize '  style='vertical-align: middle;' colspan='3'>"
						+ ''
						+ "</td><td rowspan='4' style='vertical-align: middle;'> "
						+ items.percentage
						+ "</td><td rowspan='4' style='vertical-align: middle;'> "
						+ items.calWt
						+ "</td><td rowspan='4' style='vertical-align: middle;'> "
						+ risk
						+ finalWtDiv 
						+ "</td></tr>").appendTo("#tBodyAccf");
					$(tabDiv).appendTo("#tBodyAccf");
				});
				$('#viewAccfModal').modal('show');
			},
			error: function(xhr, status, error) {
				toastr.error('Some Error Occured');
			}
		});
	});
