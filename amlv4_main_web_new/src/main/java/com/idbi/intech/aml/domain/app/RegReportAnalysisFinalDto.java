package com.idbi.intech.aml.domain.app;

import lombok.Data;
@Data
public class RegReportAnalysisFinalDto {
	
	private String requestId;

	private String reportType;

	private String regYear;
	
	private String regMonth;

	private int seqNo;
	
	private String threshold;
	
	private String value;
}
