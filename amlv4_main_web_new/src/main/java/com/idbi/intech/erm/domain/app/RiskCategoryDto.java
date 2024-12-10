package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class RiskCategoryDto {
	
	private String riskClassification;
	private int classificationCount;	

	private int srNo;
	private String deptName;
	private int totalNo;
	
	private int currHigh;
	private int prevHigh;
	private int currMedium;
	private int prevMedium;
	private int currLow;
	private int prevLow;
	
	private int currentRiskCount;
	private int prviousRiskCount;
	
	private int categoryListSize;
}

