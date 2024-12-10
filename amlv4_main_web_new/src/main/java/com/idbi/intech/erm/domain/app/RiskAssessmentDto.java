package com.idbi.intech.erm.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class RiskAssessmentDto {

	private String assessmentPeriod;
	private String deptName;
	private String deptId;
	private Integer totalNoOfRisk;
	private Integer severe;
	private Integer moderate;
	private Integer minor;
	private Integer high;
	private Integer medium;
	private Integer low;
	private Date startDate;
	private Date endDate;
	private Integer totalNoRiskAssessed;
	private String selectedOfficeId;
	
}
