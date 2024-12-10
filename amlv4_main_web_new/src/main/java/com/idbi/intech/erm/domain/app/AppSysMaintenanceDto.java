package com.idbi.intech.erm.domain.app;

import java.sql.Time;
import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class AppSysMaintenanceDto {

	private String maintenanceId;
	private String maintenanceDesc;
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	private String makerId;
	private Date makerTimestamp;
	private String searchParam;
	private String searchValue;
	private List<AppSysMaintenanceDto> summaryList;
	private UserDto user;
	private List<FileMasterDto> FileDetailsList;
	private String reasonComment;
	private String activeStatus;
	private String massegeColor;
	
}
