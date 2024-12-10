package com.idbi.intech.oms.domain.app;

import lombok.Data;

@Data
public class ReportRequestMasterDto {

	private String requestNo;
	private String reportName;
	private String zoneName;
	private String regionName;
	private String branchId;
	private String alertStatus;
	private String riskStatus;
	private String startDate;
	private String endDate;
	private String requestStatus;
	private String reqTimestamp;
	private String requestApiName;
	private String email;
	private String userId;
}
