package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class RegReportRequestDto {

	private String reqNo;
	private String requestId;
	private String reportType;
	private String userName;
	private String userRole;
	private String recordStatus;
	private String makerId;
	private Date makerTimestamp;
	private String month;
	private String year;
	private String userId;
	private String requestedBy;
}
