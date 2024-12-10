package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import com.idbi.intech.erm.domain.app.AsstTypeDto;

import lombok.Data;

@Data
public class RuleMasterDto {
	private String ruleId;
	private String ruleDesc;
	private String ruleFrequency;
	private String ruleClassification;
	private String ruleIndicator;
	private String ruleCategory;
	private String ruleImpact;
	private String ruleLikelihood;
	private String inherentRisk;
	private String ruleExeFlg;
	private Date nextExeDate;
	private Date lastExeDate;
	private Date ruleExpiryDate;
	private String ruleConstitution;
	private String ruleTrnChannel;
	private String ruleTrnSubChannel;
	private String makerId;
	private Date makerTimeStamp;
	private String lastUserId;
	private Date lastUpdateTime;
	private String actionStatus;
	private String recordStatus;
	private String ruleAggType;
	private List<FrequencyDto> freqDto;
	private List<RuleThresholdDto> ruleThresholdDtoList;
	private List<RuleRiskDefinationDto> ruleRiskDefDtoList;
	private List<RuleMasterDto> ruleList;
	private String channelId;
	private boolean creFlg;
	private boolean editFlg;
	private boolean verifyFlg;
	private List<ScaleDto> cmdDtoList;
	private boolean riskParamFlg;
	private List<AsstTypeDto> asstTypeDtos;
	private List<AsstTypeDto> asstTypeDtosBt;
	private List<AsstTypeDto> ruleCondn;
	private List<AsstTypeDto> ruleGroup;
	private String userRole;
	private String msg;
	private String comment;
}
