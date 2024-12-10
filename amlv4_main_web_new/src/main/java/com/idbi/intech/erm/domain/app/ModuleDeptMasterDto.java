package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class ModuleDeptMasterDto {

	private String deptLinkId;
	private String moduleName;
	private String moduleId;
	private String deptId;
	private double deptWeightage;
	private String recordAction;
	private String recordStatus;
	private Date recordCreateDate;
	private Date recordLastChangeDate;
	private String remarks;
	private String deptName;
	private String targetDate;
	private String actionPlanStatus;
	
	private List <ModuleDeptMasterDto> mdmDto;
	private List <ActionPlanLinkDto> actionPlanLinkDto;
	private List <RiskAppetiteMasterDto> ramDto;
	private List <ActionPlanMasterDto> acpMasterDto;
	private List<ModuleDeptThresholdDto> mdtDtoList;
	private List<TopRiskKriLinkDto> topRiskKriList;
	private List<KeyRiskIndicatorMasterDto> kriList;
	
	private ModuleValueCaptureDto mvcDto;
	private int mdtCount;
	private String kriAsstPeriod;
	private String kriAsstStatus;
	private String kriAsstValue;
	private String kriAsstColor;
	private double topRiskWeightage;
}
