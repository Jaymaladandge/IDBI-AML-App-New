package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class HomeDto {

	private String moduleId;
	private String moduleName;
	private String moduleAction;
	private String notificationId;
	private String ruleId;
	private String alertStatus;
}
