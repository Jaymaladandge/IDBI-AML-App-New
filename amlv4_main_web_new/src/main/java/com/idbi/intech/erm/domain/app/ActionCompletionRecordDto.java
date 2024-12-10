package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class ActionCompletionRecordDto {
	
	private String actionRecId;
	private String actionId;
	private String actionUpdatePeriod;
	private String actionCompletionPercent;
	private String actionEcDate;
	private Date makerTimestamp;
	private String makerId;
	private Date checkerTimestamp;
	private String checkerId;
	private Date approverTimestamp;
	private String approverId;
	private String recordStatus;

	private List<UserDto> userMasterDto;
	private String recUpdateDate;
	
	private CommentDto CommentDto;
	private ActivityLogDto alDto;
	private List<FileMasterDto> filedetails;
	private String deptId;
	private String actionStatusName;
	
	private String userRole;
	private String moduleFlag;

}
