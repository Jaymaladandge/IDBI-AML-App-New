package com.idbi.intech.oms.domain.app;

import lombok.Data;

@Data
public class AlertTransferDto {

	private String branchId;
	private String branchName;
	private String ruleId;
	private String countObj;
	private String vertical;
	private String alertId;
	
}
