package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class StateWiseExportDto {
	
	private String alertStartDate;
	private String alertEndDate;
	private String branchState;
	private String username;
	private String userDeptName;
	private String userOfficeName;
	private String userOfficeType;
}
