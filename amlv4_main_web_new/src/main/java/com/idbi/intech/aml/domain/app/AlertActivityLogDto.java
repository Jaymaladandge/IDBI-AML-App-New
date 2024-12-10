package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class AlertActivityLogDto {

	private String actRefId;
	private String actUserId;
	private Date actStartTime;
	private Date actEndTime;
	private String actStatus;
	private String actPrevUserId;
	private String alertId;
	private String actUserComment;
	private String actUserRoleId;
	private String actPrevRoleId;
	private String acGroupId;
	private String actTat;
	private String actUserName;
	private String totalTat;
	private String accfRefId;
	private String accfRisk;
	private Date releaseDate;
}