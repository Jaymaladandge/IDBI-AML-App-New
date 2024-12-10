package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class WorkflowActionDto {

	private String wfActionId;
	private String wfActionCode;
	private String wfAction;
	private String wfActionSource;
	private String wfStatus;
	private String wfModule;
	private String wfPreviousAction;
	private String makerId;
	private Date makerTime;
	private String checkerId;
	private Date checkerTime;
	private String officeType;
	private String wfActionDest;
	private String wfDeptName;
	private String wfActionOfficeSource;
	private String wfActionOfficeDest;
	
	private String isExistMsg;
	private String isExistStatus;
}
