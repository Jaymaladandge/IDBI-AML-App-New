package com.idbi.intech.aml.domain.app;

import java.util.List;

import com.idbi.intech.erm.domain.app.UserDto;

import lombok.Data;

@Data
public class EDDBranchRequestMasterDto {
	private String requestId;
	private String custUCIC;
	private String custId;
	private String custName;
	private String branchId;
	private String eddTestId;
	private String actRoleId;
	private String lastRoleId;
	private String lastUserId;
	private String lastChangeTime;
	private String requestBy;
	private String requestTime;
	private String actionEvent;
	private List<EDDBranchRequestMasterDto> requestList;
	private String actionStatus;
	private String startDate;
	private String endDate;
	private String searchParam;
	private UserDto userDto;
	private String transferComment;

}
