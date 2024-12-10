package com.idbi.intech.aml.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class RuleWiseReportDto {
	
	private String ruleId;
	private String ruleDesc;
	private String ruleFrequency;
	private String ruleStatus;
	private String userId;
	private String requestId;
	private String requestParameters;
	private String requestedBy;
	private String userPosition;
	private String requestedTime;
	private String status;
	private String fileName;
	private String ReportType;
	private String alertStartDate;
	private String alertEndDate;
	private String omsUserId;
	private List<String> ruleList;
	private String rules;
	private String setTime;
	private List<RuleWiseReportDto> viewRequestList;
	private String time;
	private List<RuleWiseReportDto> statusList;
	private int totalAlertCount;
	private int strCount;
	private int closedAlertCount;
	private double conversionRatio;
	private List<RuleWiseReportDto>finalList;
	private String reportDate;
	private String reportExtractionDate;
	private RuleWiseExportDto ruleWiseExportDto;

}
