package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class AlertMasterAggDto {

	private String recordId;
	private String alertId;
	private String alertCustId;
	private String alertAccountNo;
	private String alertUcicId;
	private String alertValue;
	private String alertStrFlg;
	private Date generatedTime;
	private List<String> headers;
	private List<String> data;

	private List<ActivityReportDto> CustomerCountList;
}