package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class CalculationDto {
	private String benckMarkValue;
	private String capturedValue;
	private String formulaType;
	private String benckMarkPeriod;
	private String calculatedResult;
	private String moduleId;
	private String startDate;
	private String endDate;
	private String deptId;
	private String officeId;
	private String officeType;
	private String asstPeriod;
	private String tolerence;
}
