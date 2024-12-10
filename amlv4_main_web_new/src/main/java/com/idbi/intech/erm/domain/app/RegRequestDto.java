package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class RegRequestDto {

	private String reqId;
	private String regReportType;
	private String reqStatus;
	private String userId;
	private String lastUserId;
	private String updateDt;
	private String makerId;
	private String makerDt;
	private String checkerId;
	private String checkerDt;
	private String verifyId;
	private String verifyDt;
	private String gos;
	private String doi;
	private String fromDt;
	private String endDt;
	private String suspProcdCrime;
	private String suspCmplxTxn;
	private String suspEcoRational;
	private String suspFinTerrorism;
	private String attempedTxn;
	private String leaInformed;
	private String sourceOfAlert;
	private String leaDetails;
	private String priorityRating;
	private String reportCoverage;
	private String additionalDocs;
	private String finnetNo;
	private String fileName;
	
}
