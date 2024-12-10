package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class ActionPlanListDto {

	private String actionLinkId;
	private String actionPlanName;
	private String actionPlanId;
	private String actionOwner;
	private String actionStatus;
	private String actionComFreq;
	private String actionComPer;
	private String comDate;
	
}
