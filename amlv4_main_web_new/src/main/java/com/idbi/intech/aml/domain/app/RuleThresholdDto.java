package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class RuleThresholdDto {
	private String thesholdId;
	private String ruleId;
	private String ruleParameter;
	private String ruleParameterDesc;
	private String ruleKey;
	private String recordStatus;
}
