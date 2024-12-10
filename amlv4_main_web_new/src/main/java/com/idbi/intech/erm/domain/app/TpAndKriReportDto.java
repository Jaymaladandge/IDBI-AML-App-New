package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class TpAndKriReportDto {
	
	private String kriId;
	private String kriName;
	private String deptProvidingDataName;
	private String kriThresholdDescription;
	private String kriDataSource;
	private String kriUpdateFrequency;
	private String kriBenchmark;
	private String kriFormula;
	private String kriValueDesc;
	private String kriBmId;
	private String kriRecordStatus;
	private String makerId;
	private String searchParam;
	private String searchValue;
	private String userId;
	private String userDept;
	private String userOffice;
	private String selectedOffice;
	private String userRole;
	private String userName;

	private List<TpAndKriReportDto> kriList;
	private List<ActionPlanMasterDto> actionPlanList;
	private String actionPlanExist;
	private String bmDesc;
	private List<ModuleDeptMasterDto> DeptDetailsList;
	private List<AsstTypeDto> threshouldDetailsList;
	private String deptProvidingDataDesc;

}
