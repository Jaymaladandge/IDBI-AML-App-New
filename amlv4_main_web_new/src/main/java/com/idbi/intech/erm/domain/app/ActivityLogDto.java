package com.idbi.intech.erm.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class ActivityLogDto {
	private String initJson;
	private String modJson;
	private String userComments;
	private String tableName;
	private String userId;
	private String activityType;
	private String activityImpactTblKey;
	private Date activityTimeStamp;
	private String activityId;
	private String moduleCode;
	private String roleName;
	
	
}
