package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class SearchAlertDto {

	private String alertId;
	private String alertAggVal;
	private String alertRuleId;
	private String alertRuleDesc;
	private Date alertStartDate;
	private Date alertEndDate;
	private String alertStatus;
	private String alertValue;
	private String currentRole;
	private String userId;
	private String lastUserId;
	private Date lastUpdateDate;
	private String version;
	private Boolean reOpenFlg;
}