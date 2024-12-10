package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class AlertDisposedDto {
	
	private String escalateCount;
	private String holdCount;
	private String closeCount;
	private String strPendingCount;
	private String raiseSTRCount;
	private String agreedCount;
	private String suspiciousCount;
}

