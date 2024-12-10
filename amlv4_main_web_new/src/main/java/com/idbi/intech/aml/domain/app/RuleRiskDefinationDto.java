package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class RuleRiskDefinationDto {
	private String ruleId;
	private String ruleRiskId;
	private String ruleRiskParameter;
	private String ruleRiskValue;
	private String recordStatus;
	private String startType;
	private String startValue;
	private String ruleRiskType;
	private String endType;
	private String endValue;
 	private String riskValue;
	private String groupFlag;
	private String groupCondition;
	private String color;
}
