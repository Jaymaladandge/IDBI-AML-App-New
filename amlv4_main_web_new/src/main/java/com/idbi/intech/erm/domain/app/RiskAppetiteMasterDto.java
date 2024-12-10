package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for risk_appetite_master Entity
 * 
 * @author Akshay
 *
 */
@Data
public class RiskAppetiteMasterDto {

	private String raStmtId;
	private String sourceName;
	private String raRiskCate;
	private String raSubCate;
	private String raStmtName;
	private String raStmtDescription;
	private String raStmtDataPts;
	private String raToleranceValueDatatype;
	private String raDeptProvidingData;
	private String raResponsibleDept;
	private String raCaptureValueFrequency;
	private String raAssessmentCriteria;
	private String raToleranceThreshold;
	private String raActionStatus;
	private String raActionStatusOld;
	private String raRecordStatus;
	private String makerId;
	private Date makerTimestamp;
	private String checkerId;
	private Date checkerTimestamp;
	private String approverId;
	private Date approverTimestamp;
	private CommentDto commentDto;
	private String requestStatus;
	private String searchParam;
	private String searchValue;
	private String sortValue;
	private String userDept;
	private String raActionName;
	private String thresholdColor;
	private String actionPlanCount;

	private String startDate;
	private String endDate;

	private List<RiskAppetiteMasterDto> raList;
	private ModuleValueCaptureDto mvcDto;
	private String actionPlanStatus;
	private List<ModuleValueCaptureDto> mvcDtoList;
	private ActivityLogDto activityLogDto;
	private List<FileMasterDto> filedetails;
	private String taskMSG;
	private List<ModuleDeptMasterDto> mmDto;
	private List<String> captureValueDeptIdList;
	private UserDto user;

	private String userName;
	private String userRole;
	private String raCaptureValueDept;

	private String raRecordStatusColor;
	private String warningColor;
	private String editDataAudit;
	private String editOldData;
	private String editNewData;

	// Graphs Dto
	private long withinTolerance;
	private long aboveTolerance;
	private String officeType;

	private String withinToleranceColour;
	private String aboveToleranceColour;
	private List<Long> withinToleranceList;
	private List<Long> aboveToleranceList;
	
	private List<String> quater1;
	private List<String> quater2;
	private List<String> quater3;
	private List<String> quater4;
	private String quarterCount;
	private List<String> quaterList;
	private List<ActionPlanMasterDto> actionList;
}
