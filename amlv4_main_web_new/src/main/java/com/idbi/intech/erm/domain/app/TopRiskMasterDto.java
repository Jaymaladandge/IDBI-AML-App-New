package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for Top_Risk_master Entity
 * 
 * @author Akshay
 *
 */
@Data
public class TopRiskMasterDto {

	private String topRiskId;
	private String topRiskTheme;
	private String topRiskDescription;
	private String topRiskActionStatus;
	private String topRiskActionStatusOld;
	private String topRiskRecordStatus;
	private String makerId;
	private Date makerTimestamp;
	private String checkerId;
	private Date checkerTimestamp;
	private String approverId;
	private Date approverTimestamp;
	private String searchParam;
	private String searchValue;
	private String sortValue;
	private List<TopRiskMasterDto> topRiskList;
	private List<ModuleDeptMasterDto> deptMasterList;
	private String userDept;
	private List<KeyRiskIndicatorMasterDto> deptKriList;
	private String userRole;
	private CommentDto commentDto;
	private ActivityLogDto activityLogDto;
	private String sourceName;
	private String userName;
	private List<FileMasterDto> filedetails;
	private UserDto userObj;
	private String actionName;
	private String asstPeriod;
	private String asstStatus;
	private String asstColor;
	private String  editOldData;
	private String  editNewData;
	private List<QuarterInfoDto> qaInfo;
	private List<RiskAppetiteCaptureValueReportDto> valueList;
	private String ofcType;
	private String officeId;
	private boolean selectedFlag;
	private String selectedTopRisk;
	private RiskAppetiteCaptureValueReportDto thValue;
	private List<String> assessmentList;
	private String asstStatus2;
	private String asstPeriod2;
	private String asstPeriod1;
	private UserDto user;
	private String TopRiskWeight;
	private String asstValue;
	private List<String> asstValueList;
	private String asstColor1;
	private String tpRagStatus;
	
}
