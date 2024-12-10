package com.idbi.intech.aml.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class AlertPendencyReportDto {
	
	private String roleId;
	private String reportData;
	private String reportType;
	private String status;
	private String days;
	private String currentRole;
	private String open;
	private String hold;
	private String escalateBack;
	private String escalateUp;
	private String pendingSTR;
	private String strDataGenPen;
	private List<AlertPendencyReportDto> alertPendencyList;
	private List<AlertMasterDto> alertMasterList;
	private List<StrRequestDtlsDto> strReqList;
	private List<String> roleList;
	private String reportDate;
	private String reportExtractionDate;
	
}
