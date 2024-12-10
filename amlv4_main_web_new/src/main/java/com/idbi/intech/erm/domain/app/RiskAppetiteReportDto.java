package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;
import lombok.Data;


@Data
public class RiskAppetiteReportDto {
	
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

	private String startDate;
	private String endDate;

	private List<RiskAppetiteReportDto> raList;
	private List<QuarterInfoDto> qaInfo;
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
	
	List<RiskAppetiteCaptureValueReportDto> valueList;

}

