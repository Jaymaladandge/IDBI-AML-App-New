package com.idbi.intech.aml.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class AlertDumpDto {

	private String ruleId;
	private String ruleDesc;
	private String userId;
	private String requestId;
	private String filterList;
	private String requestParameters;
	private String requestedBy;
	private String userPosition;
	private String requestedTime;
	private String status;
	private String ReportType;
	private String searchParam;
	private String responseJson;
	private String alertStartDate;
	private String alertEndDate;
	private String fileName;
	private String omsUserId;
	private List<String> ruleList;
	private String rules;
	private String searchList;
	private List<AlertDumpDto> viewRequestList;
	private List<AlertDumpDto> statusList;
	private String setTime;
	private String time;

}
