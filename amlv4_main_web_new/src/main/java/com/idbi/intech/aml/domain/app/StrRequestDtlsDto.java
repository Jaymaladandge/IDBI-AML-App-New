package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class StrRequestDtlsDto {

	private String reqId;
	private String regReportType;
	private String batchNo;
	private String month;
	private String year;
	private String reqStatus;
	private String userId;
	private String lastUserId;
	private String lastModDt;
	private String makerId;
	private String makerDt;
	private String checkerId;
	private String checkerDt;
	private String verifyId;
	private String verifyDt;
	private String userRoleId;
	private String dwldFlg;
	private String amlRefNo;
	private Date reqTime;
	private String recordStatus;
	private String actionStatus;
	private String finnetNumber;
	private String ucicNumber;
	private String versionNumber;
	private String noOfRules;
	private String fileRefNo;
	private String reqAge;
	
	private String roleId;
	
	private String strPendingCount;
	private String strCompletedCount;
}
