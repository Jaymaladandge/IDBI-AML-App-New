package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Data;
@Data
public class ActionPlanMasterDto {
	private String actionId;
	private String actionName;
	private String actionDescription;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date actionEcDate;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date actionReviseDate;
	private String actionOwner;
	private String actionRecordStatus;
	private String actionActStatus;
	private String actionUpdateFrequency;
	private String makerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date makerTimestamp;
	private String checkerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date checkerTimestamp;
	private CommentDto CommentDto;
	private String searchParam;
	private String searchValue;
	private String sortValue;
	private String sourceId;
	private String sourceName;
	private String moduleName;
	private ActionCompletionRecordDto acrDtO;
	private List<ActionPlanMasterDto> apmList;
	private ActivityLogDto alDto;
	private String approverId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date approverTimestamp;
	private String actionActStatusOld;
	private String completionPercent;
	private List<FileMasterDto> filedetails;
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date actionCompletionDate;
	
	private String startDate;
	private String endDate;
	
	// Create POJO for Action Plan Link
	private String deptLinkId;
	private String acLinkStatus;

	// Request Status
	private String requestStatus;
	private String requestRemark;
	private List <ActionCompletionRecordDto> actionRecords;
	private List <ActionCompletionRecordDto> actComRecords;
	private List <ActionPlanLinkDto> actionPlanLink;
	private ModuleValueCaptureDto mvcDto;
	private List<UserDto> actionOwnerList;

	private DepartmentMasterDto dmdDto;
	private String departmentName;
	private String departmentId;
	
	private String fileName;
	private Double fileSize;
	private String uploadedBy;
	private String uploadedDate;
	private List<ActionPlanMasterDto> documentList;
	private String recordStatus;
	private Boolean moduleFlag;
	private List<String> linkedActionIdList;
	
	private String updatePeriod;
	private String actionCompPercent;
	private String officeType;
	private String exComplDate;
	private String officeId;
	private String actionStatus;
	private String actionDate;
}
