package com.idbi.intech.aml.domain.app;

import lombok.Data;
@Data
public class RegReportAnalysisDto {
	
	private String requestId;
	
	private String reportType;
	
	private String regYear;
	
	private String regMonth;
	
	private String seqNo;
	
	private String threshold;
	
	private String totalCnt;
	
	private String totalCreCnt;
	
	private String totalDebCnt;
}
