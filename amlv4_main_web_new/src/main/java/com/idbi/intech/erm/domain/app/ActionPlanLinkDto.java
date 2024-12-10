package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class ActionPlanLinkDto {

	private String actionLinkId;
	private String actionId;
	private String deptLinkId;
	private String deptId;
	private String sourceId;
	private String sourceName;
	private String moduleName;
	private String actionName;
	private String actionLinkStatus;
	private Date makerTimeStamp;
	private String makerId;
	private Date checkerTimeStamp;
	private String checkerId;
	private Date approverTimeStamp;
	private String approverId;
	private List<ActionPlanLinkDto> actionPlanList;
	private ActivityLogDto activityLogDto;
	private CommentDto commentDto;
	
	private List<ActionPlanMasterDto> actionPlanMasterDto;
	private List<ModuleDeptMasterDto> moduleDeptMasterDto;
	
	private String userRole;
}

