package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class DashboardReportDto {

	private String roleId;
	private String userId;
	
	private String openCount;
	private String holdCount;
	private String escalatedBackCount;
	private String reopenCount;
	private String suspCount;
	private String nonsuspCount;

	private String lessThan2Days;
	private String less5Great2Days;
	private String less10Great5Days;
	private String greatThan10Days;
	
	private String lessThan2DaysL1;
	private String less5Great2DaysL1;
	private String less10Great5DaysL1;
	private String greatThan10DaysL1;
	
	private String lessThan2DaysL2;
	private String less5Great2DaysL2;
	private String less10Great5DaysL2;
	private String greatThan10DaysL2;
	
	private String lessThan2DaysL3;
	private String less5Great2DaysL3;
	private String less10Great5DaysL3;
	private String greatThan10DaysL3;
	
	private String actionCount;
	private String suspActionCount;
	private String nonsuspActionCount;
	private String strActionCount;
	private String markActionCount;
	private String heldActionCount;
	
	private String strPendingCount;
	private String strCompletedCount;
	private DashboardVerifierDto dashVerifierDto;
	private String startDate;
	private String endDate;
}
