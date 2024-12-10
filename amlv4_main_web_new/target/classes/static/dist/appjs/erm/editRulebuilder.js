$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('whatever')
	var modal = $(this)
	$('a.target').attr('href', recipient);

})

$(document).ready(function() {
	$('select option').filter(function() {
		return ($(this).val().trim() == "" && $(this).text().trim() == "");
	}).remove();

	$("select option").each(function() {
		$(this).siblings('[value="' + this.value + '"]').remove();
	});
	
	$('select option').each(function() {
		t = $(this).text();
		$(this).text(t.replace(/^(.)|\s(.)/g, function($1) { return $1.toUpperCase(); }))
	});
});

$(document).ready(function() {
	$("#query").keypress(function(e) {
		var key = e.keyCode;
		$return = (key == 8 || key == 32 || (key >= 39 && key <= 57) || (key > 58 && key < 91) || (key >= 95 && key < 123));
		if (!$return) {
			toastr.error('No special characters Allowed!');
			return false;
		}
	});


});
$("#getData").prop("hidden", true);

$(document).ready(function() {
	$("#addrow").click(function() {
		var total_row = $(".adddiv").length;
		var lastid = $(".adddiv:last").attr("id");
		var split_id = lastid.split("_");
		nextindex = Number(split_id[1]) + 1;
		var $pages = $('.rowcontainer');
		var childAdded = false;
		$pages.each(function() {
			var $page = $(this);
			nextindex = $page.children().length;
			if ($page.children().length < 50) {
				childAdded = true;
				return false;
			}
		});
		if (!childAdded) {
			toastr.error('Parameter Value Limit Exceeded!, You cannnot add anymore');
		} else {
			$(".adddiv:last").before("<div class='row' id='row_" + nextindex + "'></div>");
			$("#row_" + nextindex).append("<div class='test row col-sm-12'><div class='col-sm-5' id='div_" + nextindex + "'><div class='form-group'><input type='text' placeholder='Parameter Key' name='paramkey[]' class='form-control form-control-sm' id='parameterkey" + nextindex + "'></div></div>"
				+ "<div class='col-sm-6' id='div_" + nextindex + "'> <div class='form-group'><textarea class='form-control form-control-sm paramVal' rows='1' style='overflow:auto' name ='parametervalue' placeholder='Parameter value' id='parametervalue" + nextindex + "'></textarea></div></div>"
				+ "<div class='col-sm-1' id='div_" + nextindex + "'><div class='form-group'><a class='btn btn-danger btn-sm remove' id='deleteRow_" + nextindex + "'> <i class='fas fa-window-close'></i></a></div></div></div>");

		}

	});
	$('.rowcontainer').on('click', '.remove', function() {
		var id = this.id;
		var split_id = id.split("_");
		var deleteindex = split_id[1];
		$("#row_" + deleteindex).remove();


	});
});

$("#addComment")
	.click(
		function(e) {
			$('.addCommentBox').append(`<div class="form-group "><div class="input-group"><textarea class="form-control" name="ruleComment" maxlength="3000" placeholder="Rule Comment" id="ruleComment${rowCount}" ></textarea></div></div>`)
			rowCount++;
		});

$("#otherblock").hide();

$(function() {
	$("#commentList").change(function() {
		var ruleType = $("#commentList").val();
		if (ruleType.includes("Others")) {
			$("#otherblock").show();
		} else {
			$("#otherblock").hide();
		}
	});
});

$(function() {
	//Initialize Select2 Elements
	$('.select2').select2();
	bsCustomFileInput.init();


	$("#queryDataTable").DataTable({
		"columnDefs": [{
			orderable: false,
		}],
		"responsive": false,
		"autoWidth": true,
		"sorting": false,
		"bPaginate": false,
		"searching": false,
		"bInfo": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	})

})
$(function() {

	var optionValues = [];
	$('#commentList option').each(function() {
		if ($.inArray(this.value, optionValues) > -1) {
			$(this).remove()
		} else {
			optionValues.push(this.value);
		}
	});
});


$(function() {
	$("#ruleReport").change(function() {
		var ruleType = $("#ruleReport").val();
		if (ruleType === 'R' || ruleType === 'P') {
			$("#hideDiv").show();
		} else {
			$("#hideDiv").hide();
		}
	});
});
$("#otherblock").hide();

$(function() {
	$("#commentList").change(function() {
		var ruleType = $("#commentList").val();
		if (ruleType.includes("Others")) {
			$("#otherblock").show();
		} else {
			$("#otherblock").hide();
		}
	});
});



$(document).ready(function() {
	if ($("#recheckRequired").val() == 'Y') {
			$("#hideDiv2").show()
		} else {
			$("#hideDiv2").hide()
		}
	$("#recheckRequired").change(function() {
		if ($("#recheckRequired").val() == 'Y') {
			$("#hideDiv2").show()
		} else {
			$("#hideDiv2").hide()
		}
	})
});

$(document).ready(function() {
	$("#hideNewFrequency").hide()
	$("#RuleFrequency").change(function() {
		if ($("#RuleFrequency").val() == 'O') {
			$("#hideNewFrequency").show()
		} else {
			$("#hideNewFrequency").hide()
		}
	})
});
$(function() {

	var optionValues = [];
	$('#RuleFrequency option').each(function() {
		if ($.inArray(this.value, optionValues) > -1) {
			$(this).remove()
		} else {
			optionValues.push(this.value);
		}
	});

	var optionValues1 = [];
	$('#RuleType option').each(function() {
		if ($.inArray(this.value, optionValues1) > -1) {
			$(this).remove()
		} else {
			optionValues1.push(this.value);
		}
	});

	var optionValues2 = [];
	$('#ruleReport option').each(function() {
		if ($.inArray(this.value, optionValues2) > -1) {
			$(this).remove()
		} else {
			optionValues2.push(this.value);
		}
	});

	var optionValues3 = [];
	$('#priority option').each(function() {
		if ($.inArray(this.value, optionValues3) > -1) {
			$(this).remove()
		} else {
			optionValues3.push(this.value);
		}
	});

	var optionValues5 = [];
	$('#dataSource option').each(function() {
		if ($.inArray(this.value, optionValues5) > -1) {
			$(this).remove()
		} else {
			optionValues5.push(this.value);
		}
	});

	var optionValues4 = [];
	$('#RuleClassification option').each(function() {
		if ($.inArray(this.value, optionValues4) > -1) {
			$(this).remove()
		} else {
			optionValues4.push(this.value);
		}
	});
	
	var optionValues7 = [];
	$('#recheckRequired option').each(function() {
		if ($.inArray(this.value, optionValues7) > -1) {
			$(this).remove()
		} else {
			optionValues2.push(this.value);
		}
	});

});


// BS-Stepper Init
$(document).ready(function() {
	var stepper = new Stepper($('.bs-stepper')[0])
})
// BS-Stepper Init
document.addEventListener('DOMContentLoaded', function() {
	window.stepper = new Stepper(document.querySelector('.bs-stepper'))
})

document.onreadystatechange = function() {
	var state = document.readyState
	setTimeout(function() {
		document.getElementById('load').style.visibility = "hidden";
	}, 1000);
}



/*function validateFirst() {
	var flg = true;
	if ($('#editRuleForm').valid()) {
		if (flg) {
			stepper.next();
		}
	}
}*/

/*function validate2() {
	var flg = true;
	if (flg) {
		stepper.next();
	}
}*/


$("#fetchData")
	.click(
		function(e) {

			var flg = false;
			$("#getQueryData").css("display", "none");
			var variable = $("#query").val().toLowerCase();

			//variable=variable.replace(/[^\x00-\x7F]/g, "");
			/*var myJSONString = JSON.stringify(variable);
var myEscapedJSONString = myJSONString.escapeSpecialChars();*/
			//console.log(variable);
			var queryType = $("#ruleReport").val().trim();
			var dataSource = $("#dataSource").val();
			if (queryType !== null && queryType !== undefined &&
				queryType !== '') {
				flg = true;
			} else {
				flg = false;
				toastr.error("Please Select Query Type");
			}
			if (dataSource !== null && dataSource !== undefined &&
				dataSource !== '') {
				flg = true;
			} else {
				flg = false;
				toastr.error("Please Select Data Source");
			}
			if (queryType != 'P') {
				if (variable !== null && variable !== undefined &&
					variable !== '') {

					if (variable.startsWith('select') &&
						variable.includes("from")) {
						flg = true;

					} else {
						toastr.error("Not a valid Query");
						flg = false;
					}

				} else {
					flg = false;
					toastr.error("Query cannot be null");
				}
			}
			if (flg) {

				var recordStatus = 'D';
				var pageValJson = "{\"query\":\"" + variable + "\",\n" +
					"\"recordStatus\":\"" + recordStatus + "\",\n" +
					"\"ruleType\":\"" + queryType + "\",\n" +
					" \"dataSource\":\"" + dataSource + "\"}";
				console.log(pageValJson);
				document.getElementById('load').style.visibility = "visible";
				$
					.ajax({
						url: 'validateQuery',
						type: "POST",
						data: {
							pageValJson: pageValJson
						}, // important line for thymeleaf http security
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
							console.log(obj);
							$("#tabname").val(obj.tableName);

							if (obj.ruleType == 'R' || obj.ruleType == 'RT') {

								$('.rowcontainer').hide();
								$('.referenceDiv').show();
								$("#tableName").empty();
								$("#getQuery").prop("hidden", false);

								$('#parameterListTable tbody').empty();
								$('#returnTypeListTable tbody').empty();
								Object.keys(obj).forEach(
									function(items) {



										var tableName = '';
										var ruleParameterList = ''
										if (items == 'tableName') {
											tableName = obj[items];

											$("#tableName").append("<span><b>Table Name: " + tableName + "</b></span>")
										}
										if (items == 'parameterColumnNameList') {
											var data = obj[items];

											$("#dataTableName").text(tableName);
											for (const [key, value] of Object.entries(data)) {

												console.log(value);
												$("#parameterList").css("display", "");
												$("#returnTypeList").css("display", "");
												$("#getQueryRow").css("display", "");
												//var valueKey = "";
												if (value.includes(",")) {

													const valueSize = value.split(",");
													var valueKey = valueSize[0];
													var valueSize2 = valueSize.length;
													var i = 0;

												} else {

													var valueKey = value;

												}

												if (valueKey === '?') {
													//$("#parameterListTableBody").append("<tr><td>" + key + "</td><td><div class='" + key + "'>")
													var columnId = "." + key
													var select = $(columnId);
													if (value.includes(",")) {
														for (i; i < valueSize2; i++) {
															$("#parameterListTableBody").append("<tr><td>" + key + "</td><td><input type='text' class='form-control mt-3' id='Input," + key + i + "'><div></td><tr>")
														}
													} else {
														$("#parameterListTableBody").append("<tr><td>" + key + "</td><td><input type='text' class='form-control' id='Input," + key + "'><div></td><tr>")
													}
												} else if (valueKey.includes("?)")) {
													//$("#parameterListTableBody").append("<tr><td>" + key + "</td><td><div class='" + key + "'>")
													var brackets = value.replace("?", "");

													if (value.includes(",")) {
														for (i; i < valueSize2; i++) {


															$("#parameterListTableBody").append("<tr><td>" + key + "</td><td><input type='text' class='form-control mt-3' id='Input," + key + i + "~" + brackets + "'><div></td><tr>")
														}
													} else {
														//alert(brackets);
														$("#parameterListTableBody").append("<tr><td>" + key + "</td><td><input type='text' class='form-control' id='Input," + key + "~" + brackets + "'><div></td><tr>")
													}

												} else {
													$("#parameterListTableBody").append("<tr><td>" + key + "</td><td><input type='text' class='form-control' id='" + value + "' value='" + value + "' disabled></td><tr>")
												}

											}
										}
										if (items == 'returnTypeColumnList') {
											var returnTypeData = obj[items];

											$.each(returnTypeData, function(index, value) {

												$("#returnTypeListTable>tbody").append("<tr><td>" + value + "</td><td><input type='text' class='form-control' id='returnVal" + value + "' ></td><tr>")

											});

										}




									})
							} else if (obj.ruleType == 'P') {
								$("#testQuery").prop("hidden", false);
								$('.rowcontainer').css("display", "");
								if (obj.procParameterString != null) {

									$("#getQuery").prop("hidden", false);
									$("#parameterListTable").css("display", "");
									$('#parameterListTable tr:gt(0)').remove();
									const parameterList = obj.procParameterString.replace("(", "").replace(")", "").trim().split(",");
									for (var i = 0; i < parameterList.length; i++) {
										const parameterListColumn = parameterList[i].split("~");
										for (var j = 0; j < 1; j++) {

											$("#parameterListTableBody").append("<tr><td>" + parameterListColumn[0] + "</td><td><input type='text' class='form-control' id='" + parameterListColumn[0] + "'><div></td><tr>")

										}
									}



								} else {
									//$("#getQueryData").css("display", "");
									//$("#getQueryData").append("<textarea type='text' class='form-control mt-6' id='finalquery' name='finalquery' rows='10' placeholder='Query' style='font-weight: bold'>" + obj.query + "</textarea>");
									$("#testQuery").prop("hidden", false);
								}
							}

						},
						error: function(xhr, status, error) {

							toastr
								.error('Some Error Occured');

						}
					});
			}
		})


$("#getQuery")
	.click(
		function(e) {

			$("#testQuery").prop("hidden", false);
			var flg = false;
			const parameterListMap = new Map();
			const returnTypeListMap = new Map();
			$("#getQueryData").empty();
			var variable = $("#query").val().toLowerCase().replace(/'/g, '').replace(/"/g, '').replace(/(\r\n|\n|\r)/gm, "");

			if (variable !== null && variable !== undefined &&
				variable !== '') {

				if (variable.startsWith('select') &&
					variable.includes("from")) {
					flg = true;

				} else {
					alert("Not a valid Query");
					flg = false;
				}
				var count = 0;
				var inputId = "";
				$("#parameterListTable > tbody > tr").each(function() {
					if ($(this).find("td:eq(0)").text() !== null && $(this).find("td:eq(0)").text() !== "" && typeof $(this).find("td:eq(1)").text() !== undefined) {
						++count;
						var inputId = $(this).find("td:eq(1) input[type='text']").attr('id');
						alert(inputId);
						const inputId2 = inputId.split(",");
						var value = "";

						if (inputId2[0] === 'Input') {
							$(this).find("td:eq(1)").find("input").each(function() {
								value += "'" + this.value + "',";
							});
							value = value.substring(0, value.length - 1);
							alert(value)
							/*value="'" + $(this).find("td:eq(1) input[type='text']").val() + "'";
							alert(value);*/
						} else {
							value = inputId;
						}

						parameterListMap.set($(this).find("td:eq(0)").text().trim(), value);

					}
				});

				$("#returnTypeListTable > tbody > tr").each(function() {
					if ($(this).find("td:eq(0)").text() !== null && $(this).find("td:eq(0)").text() !== "" && typeof $(this).find("td:eq(2)").text() !== undefined) {
						++count;
						returnTypeListMap.set($(this).find("td:eq(0)").text().trim(), $(this).find("td:eq(2) input[type='text']").val());

					}
				});

				if (variable.startsWith('select')) {
					var from_index = variable.indexOf('from');
					var select_index = variable.indexOf('select');
					var where_index = variable.indexOf('where');
					var columnNames = variable.slice(select_index + 6, from_index).trim();
					var conditionColumns = variable.substring(where_index + 5);
					var tableName = variable.slice(from_index + 4, where_index).trim();

					var arr = [];
					$.each(columnNames.split(','), function(index, value) {

						arr.push(value);
					})
					const variableTemp = arr.map((data) => (data));
					var arr1 = [];
					var operatorContition = '';

					var tempVar = variable.substring(where_index + 7);


					var subQueryList = tempVar.split("select");
					//var subQuery=subQueryList.length;
					var i = 0;
					for (i; i < subQueryList.length; i++) {

						var test = subQueryList[i].split(' ')[1];

						if (test.includes('and')) {
							$.each(conditionColumns.split('and'), function(index, value) {
								if (value.includes('or')) {
									$.each(value.split('or'), function(index1, value1) {
										arr1.push(value1 + '~' + 'or');
										//operatorContition='or';
									});
								}
								else {
									operatorContition = 'and';
									arr1.push(value + '~' + 'and');
									//operatorContition='and';
								}
							})
						} else if (test.includes('or')) {
							$.each(conditionColumns.split('or'), function(index, value) {
								if (value.includes('and')) {
									$.each(value.split('and'), function(index1, value1) {
										arr1.push(value1 + '~' + 'and');
										//operatorContition='or';
									});
								}
								else {
									operatorContition = 'or';
									arr1.push(value + '~' + 'or');
									//operatorContition='and';
								}
							})
						}
					}

					const paramterVariableTemp = arr1.map((data) => {
						return data;
					});
					var parameterData = '';
					var parameterJoinBy = '';
					var valueBetween = '';

					const paramterVariableTemp2 = paramterVariableTemp.map((data) => {
						var condition = '';
						var operator = '';
						alert(data);
						if (data.includes("=") && !data.includes("<=") && !data.includes("!=")) {

							condition = "=";
							//operator=data.split("~")[1];
						} else if (data.split('~')[0].includes("<=")) {
							condition = "<=";
						} else if (data.split('~')[0].includes(">=")) {
							condition = ">=";
						} else if (data.split('~')[0].includes("<>")) {
							condition = "<>";
						} else if (data.split('~')[0].includes("!=")) {
							condition = "!=";
							alert(condition)
						} else if (data.split('~')[0].includes("<")) {
							condition = "<";
						} else if (data.split('~')[0].includes(">")) {
							condition = ">";
						} else if (data.split('~')[0].includes("between")) {
							condition = "between";
							valueBetween = parameterListMap.get(data.split(condition)[0].trim());
							var betweenValues = valueBetween.split(",")[0];
							alert("between" + betweenValues);
							return data.split(condition)[0].trim() + ' ' + condition + ' ' + betweenValues + ' ' + data.split('~')[1] + ' ';
							//var value1=betweenValues;

						} else if (data.split('~')[0].includes("in")) {
							condition = "in";
						} else {
							var betweenValues = valueBetween.split(",")[1] + ' ' + data.split('~')[1].trim();
							alert("else" + betweenValues);
							return betweenValues;
						}


						//if(){
						return data.split(condition)[0].trim() + ' ' + condition + parameterListMap.get(data.split(condition)[0].trim()) + ' ' + data.split('~')[1].trim() + ' ';

						/*}*/
					})



					var new_query = ''
					var new_updated = '';
					var endStmt = ' limit 5';
					var tempData = '';
					$.each(paramterVariableTemp2, function(k, v) {
						alert(v)
						tempData += v.replace(',', ' ');
					})
					const conditionList2 = tempData.split(" ");
					var minusString = 0;
					var conditionList3Size = 0;
					var conditionList4Size = 0;
					conditionList3Size = conditionList2.length;
					conditionList4Size = conditionList3Size - 2;
					var lastVariable = conditionList2[conditionList4Size];
					if (lastVariable === "or") {
						minusString = 3;
					} else if (lastVariable === "and") {
						minusString = 4;
					}


					tempData = tempData.substring(0, tempData.length - 1);
					alert(tempData);

					var testTemp = String(tempData).replace(',', ' ')
					if (variable.includes('where')) {
						new_updated = variable.substr(0, 7) +
							variableTemp.join(",") + ' ' + variable.substr(from_index, 4) + ' ' + tableName + ' ' + variable.substr(where_index, 5) + ' ' + testTemp + '^' + endStmt;
						new_query = new_updated.split('^')[0].slice(0, -minusString) + '' + new_updated.split('^')[1];
					} else {
						new_query = variable.substr(0, 7) +
							variableTemp.join(",") + ' ' + variable.substr(from_index, 4) + ' ' + tableName + endStmt;
					}


				}
				//$("#getQueryData").text(new_query);
				$("#getQueryData").css("display", "");
				$("#getQueryData").append("<textarea type='text' class='form-control mt-6' id='mainQuery' name='mainQuery' rows='10' placeholder='Query' style='font-weight: bold' disabled>" +
					new_query +
					"</textarea>");



			} else {
				flg = false;
				alert("Query cannot be null");
			}

		})

$('#searchcriteria').keypress(function(e) {
	if (e.which == 13) return false;
	if (e.which == 13) e.preventDefault();
});

$(function() {
	$("#parameterListTableBody").DataTable({
		"columnDefs": [{
			orderable: false,
		}],
		"responsive": false,
		"autoWidth": true,
		"sorting": false,
		"bPaginate": false,
		"searching": false,
		"bInfo": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	})
});

$(function() {
	$("#returnTypeListTable").DataTable({
		"columnDefs": [{
			orderable: false,
		}],
		"responsive": false,
		"autoWidth": true,
		"sorting": false,
		"bPaginate": false,
		"searching": false,
		"bInfo": false,
		"fixedHeader": true,
		"language": {
			"emptyTable": "No Data Available"
		}
	})
});



$("#testQuery")
	.click(
		function(e) {

			var finalquery = $("#finalquery").val();
			if (finalquery == null || finalquery == undefined ||
				finalquery == '') {
				finalquery = $("#query").val().replace(/"/g, '\'');
			}


			var dataSource = $("#dataSource").val();
			var queryType = $("#ruleReport").val().trim();
			var procName = $("#tabname").val();

			var headerVal = "";
			$("#returnTypeListTable > tbody > tr").each(function() {
				if ($(this).find("td:eq(1) input").val() != undefined) {
					headerVal += $(this).find("td:eq(1) input").val() + ",";
				}
			});
			headerVal = headerVal.substring(0,
				headerVal.length - 1);

			var pageValJson = "{\"query\":\"" + finalquery.replace(/"/g, '\'') + "\",\n" +
				"\"headerValues\":\"" + headerVal + "\",\n" +
				"\"queryType\":\"" + queryType + "\",\n" +
				"\"procedureName\":\"" + procName + "\",\n" +
				" \"dataSource\":\"" + dataSource + "\"}";

			console.log(pageValJson);
			document.getElementById('load').style.visibility = "visible";

			$
				.ajax({
					url: 'testQuery',
					type: "POST",
					data: {
						pageValJson: pageValJson
					}, // important line for thymeleaf http security
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

						console.log(obj);
						if (queryType.includes("P")) {

							if (obj.errorMassage == 'null') {
								toastr.success("Query Compiled Successfully.");
								$("#tabname").val(obj.procedureName);
								$("#getData").prop("hidden", false);
							} else {

								$("#tableData").val(obj.result);
								$("#tableHeader").val(obj.headerValues)
								toastr
									.error(obj.errorMassage);


							}

						} else {
							if (obj.errorMassage !== null) {
								toastr
									.error(obj.errorMassage);
							} else {
								toastr.success("Query Excuted Successfully.");
								$("#tableData").val(obj.result);
								$("#tableHeader").val(obj.headerValues)

								$("#getData").prop("hidden", false);
							}
						}

					},
					error: function(xhr, status, error) {

						toastr
							.error('Some Error Occured');

					}
				});
		});


$("#getData")
	.click(
		function(e) {

			var queryType = $("#ruleReport").val().trim();
			if (queryType != 'P') {
				$("#queryDataTable thead tr").empty();
				$("#queryDataTable tbody").empty();

				/*$('#queryDataTable').dataTable()
													.fnClearTable();
											$('#actionplantable').DataTable()
													.destroy();*/

				var tableData = $("#tableData").val();
				var tableHeader = $("#tableHeader").val();

				const tableHeaderValues = tableHeader.split(",");

				for (var i = 0; i < tableHeaderValues.length; i++) {

					$("#headerData").append(`
				<th>${tableHeaderValues[i]}</th>
				`)
				}


				const tableDataList = tableData.split("~");
				for (var i = 0; i < tableDataList.length; i++) {

					$("#tableBody").append(`<tr>`);

					const tableDataRow = tableDataList[i].split(",");
					for (var j = 0; j < tableDataRow.length; j++) {

						$("#tableBody").append(`<td>${tableDataRow[j]}</td>`)

					}
					$("#tableBody").append(`</tr>`);
				}

				/*$("#queryDataTable").DataTable({
			"columnDefs": [{
				orderable: false,
			}],
			"responsive": false,
			"autoWidth": true,
			"sorting": false,
			"bPaginate": false,
			"searching": false,
			"bInfo": false,
			"fixedHeader": true,
			"language": {
				"emptyTable": "No Data Available"
			}
		});*/
			}

			validate2();
		});

$(function() {
	$('#editRuleForm').validate({


		rules: {
			dataSource: {
				required: true
			},

			priority: {
				required: true
			},

			ruleId: {
				required: true,
				minlength: 5,
				maxlength: 10
			},
			ruleReport: {
				required: true
			},

			ruleDescription: {
				required: true,
				minlength: 10,
				maxlength: 3000
			},
			RuleClassification: {
				required: true
			},
			RuleFrequency: {
				required: true
			},
			RuleType: {
				required: true
			},
			ruleComment: {
				required: true
			},

		},
		messages: {
			dataSource: {
				required: "Please Select Data Source"
			},

			priority: {
				required: "Please Select Rule Priority"
			},

			ruleId: {
				required: "Please Select RuleId"
			},

			ruleReport: {
				required: "Please Select QueryType"
			},

			ruleDescription: {
				required: "Please Select Rule Description"
			},
			RuleClassification: {
				required: "Please Select Rule Classification"
			},
			RuleFrequency: {
				required: "Please Select Rule Frequency"
			},
			RuleType: {
				required: "Please Select Rule Dependancy"
			},
			ruleComment: {
				required: "Please Enter Rule Comment"
			},

		},
		errorElement: 'span',
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback');
			element.closest('.form-group').append(error);
		},
		highlight: function(element, errorClass, validClass) {
			$(element).addClass('is-invalid');
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).removeClass('is-invalid');
		},



		submitHandler: function(form) {
			form.submit();
		}
	});
});


$('#cancelmodel').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget);
	var recipient = button.data('whatever');
	var modal = $(this);
	$('a.target').attr('href', recipient);

});


$(function() {
	$("#ruleReport").change(function() {
		var ruleType = $("#ruleReport").val();
		if (ruleType === 'Rule') {
			$("#hideDiv").show();
		}
	});
});

var rowCount = 1;


$("#create")
	.click(
		function(e) {

			var paramkeyVal = $('input[name="paramkey[]"]').map(function(index, value) {
				return $(this).val();
			}).get();
			var paramValue = "";
			var paramValue = jQuery("textarea.paramVal").map(function(index, value) {
				return jQuery(this).val();
			}).get();

			var obj = '';
			for (var a = 0; a < paramkeyVal.length; a++) {
				obj += paramkeyVal[a] + "~" + paramValue[a] + ","
			}

			obj = obj.substring(0,
				obj.length - 1);

			var dataSource = $("#dataSource").val();
			var priority = $("#priority").val();
			var ruleId = $("#ruleId").val();
			var ruleReport = $("#ruleReport").val();
			var RuleType = $("#RuleType").val();
			var RuleClassification = $("#RuleClassification").val();
			var ruleDescription = $("#ruleDescription").val();
			var applicability = $("#Applicability").val();
			var recheckRequired = $("#recheckRequired").val();
			var verticalType = $("#verticalType").val();
			var maxAllowDays = $("#maxAllowed").val();


			/*var query = $("#query").val().trim();*/
			var finalquery = "";

			/*if (ruleReport.includes("P")) {

				finalquery = $("#tabname").val();

			} else {

				finalquery = $("#finalquery").val();
			}
*/

			var RuleFrequency = $("#RuleFrequency").val();
			var frequency = '';
			if (RuleFrequency == 'O') {
				frequency = $("#NewFrequency").val();
			} else {
				frequency = RuleFrequency;
			}

			/*var threshold = "";
			$("#parameterListTable > tbody > tr").each(function() {
				if ($(this).find("td:eq(0)").text().trim() !== '' && $(this).find("td:eq(1) input[type='text']").val() !== '' && $(this).find("td:eq(0)").text().trim() !== undefined && $(this).find("td:eq(1) input[type='text']").val() !== undefined) {
					threshold += $(this).find("td:eq(0)").text().trim() + "~" + $(this).find("td:eq(1) input[type='text']").val() + ",";
				}
			});
			threshold = threshold.substring(0,
				threshold.length - 1);*/

			//console.log(threshold);
			var defaultComment = $("#commentList").val();
			var comment = ""
			var i = 0;

			for (i; i < rowCount; i++) {

				var commentId = "#ruleComment" + i;
				var mainId = $(commentId);
				comment += mainId.val() + ",";
			}
			comment = comment.substring(0, comment.length - 1);

			comment = defaultComment + "," + comment
			console.log(comment);

			var queryString = "{\n" +
				"    \"dataSource\": \"" + dataSource + "\",\n" +
				"    \"ruleId\": \"" + ruleId + "\",\n" +
				"    \"ruleDesc\": \"" + ruleDescription + "\",\n" +
				"    \"ruleType\":\"" + ruleReport + "\",\n" +
				"    \"recheckRequired\":\"" + recheckRequired + "\",\n" +
				"    \"verticalType\":\"" + verticalType + "\",\n" +
				"    \"rulePriority\":\"" + priority + "\",\n" +
				"    \"ruleDependancy\":\"" + RuleType + "\",\n" +
				"    \"ruleClassification\":\"" + RuleClassification + "\",\n" +
				"    \"ruleFrequency\":\"" + frequency + "\",\n" +
				"    \"maxAllowDays\":\"" + maxAllowDays + "\",\n" +

			
				"    \"ruleComment\": \"" + comment + "\"\n" +
				"}";
			console.log(queryString);

			var iterationCount = 1000;
			var keySize = 128;
			//passPhrase is the key
			var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

			var aesUtil = new AesUtil(keySize, iterationCount);

			var ciphertext = aesUtil.encrypt(reverseText(passphrase), queryString);
			$("#encryptedJson").val(ciphertext + ':~:' + passphrase);

			$("#editRuleForm").submit();


		});