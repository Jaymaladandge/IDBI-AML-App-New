package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import com.idbi.intech.erm.domain.app.UserDto;

import lombok.Data;

@Data
public class WorkflowMasterDto {

	private String wfId;
	private String wfGroupId;
	private String wfModule;
	private String wfOfficeType;
	private String wfOfcDest;
	private String wfStatus;
	private String wfActionSource;
	private String wfCurrentAction;
	private String wfPreviousAction;
	private String wfActionDest;
	private String wfDescription;
	private String wfDeptName;
	private String wfActionId;
	private String wfTitle;
	private String wfParam;
	private String wfSearchParam;
	private String wfSearchValue;
	private String makerId;
	private String wfExist;
	private String wfExistMassage;
	private Date makerTime;
	private String checkerId;
	private Date checkerTime;
	private String userName;
	private List<WorkflowMasterDto> wfList;
	private UserDto user;
	private List<WorkflowMasterDto> actionList;
	private List<WorkflowMasterDto> actionViewList;
	private List<WorkflowMasterDto> DistinctSummaryList;
	private String wfNewStatus;
	private String wfActionCode;
	private String currentStatus;
}
