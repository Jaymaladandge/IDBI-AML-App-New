package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Data;

@Data
public class KeyRiskIndicatorMasterDto {

	private String kriId;
	private String kriName;
	private String deptProvidingData;
	private String deptProvidingDataName;
	private String kriDataType;
	private String kriDataSource;
	private String kriThresholdDescription;
	private String kriUpdateFrequency;
	private String kriFormula;
	private String kriBenchmark;
	private String kriBmId;
	private String kriActionStatus;
	private String kriRecordStatus;
	private String makerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date makerTimestamp;
	private String checkerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date checkerTimestamp;
	private String approverId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date approverTimestamp;
	private String kriLinkedDept;
	private String kriOfficeData;
	private String kriRangePercentFlg;
	private String asstPeriod;

	// Other Objects Variables
	private String kriActionStatusOld;
	private String requestStatus;
	private String sourceName;
	private String actionName;
	private String searchParam;
	private String searchValue;
	private String sortValue;
	private UserDto user;
	private String userId;
	private String userDept;
	private String userOffice;
	private String userRole;
	private String userName;

	private String taskMSG;
	// private String kriDeptData;

	private CommentDto commentDto;
	private ActivityLogDto activityLogDto;

	private List<KeyRiskIndicatorMasterDto> kriList;

	private List<FileMasterDto> filedetailsList;

	private int mdmCount;
	private List<ModuleDeptMasterDto> mdmDtoList;

	private List<ModuleDeptThresholdDto> mdtDtoList;
	private List<ModuleValueCaptureDto> mvcDtoList;

	private List<String> cmdDtoList;
	private List<CodeMasterDto> codeList;
	private UserDto userObj;
	private String  editOldData;
	private String  editNewData;
	private List<KeyRiskIndicatorMasterDto> deptProvidingDataSelected;
	private List<String> btnList;
	private String kriValueDesc;
	private String  selectedAssessmentPeriod;
	private String currentAssDate;
	
}
