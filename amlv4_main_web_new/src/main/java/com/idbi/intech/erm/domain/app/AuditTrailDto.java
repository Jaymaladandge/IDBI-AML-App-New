package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class AuditTrailDto {
	
	private String actDate;
	private String userName;
	private String actionPerformed;
	private String actionComment;
	private String userRole;
	private String capturedValue;

	private String EditOldData;
	private String EditNewData;
	
	private String actionCol;
	private String additionalComment;
}
