package com.idbi.intech.oms.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class RoleVerticalMapperDto {

	private String recordId;
	private String role;
	private String roleOfficer;
	private String roleChecker;
	private String vertical;
	private String verticalName;
	private String category;
	private String recordStatus;
	private Date makerTimestamp;
	private int totalAlertCount;
	private String makerId;
	private int alertCount;
	private int closeAlertCount;
	private String rbgCount;
	private int escaletedCount;
	private String roleScope;
	private List<RoleVerticalMapperDto> verticalMapperDto;
	private String vertCat;
	private int firstAlertCnt;
	private int secondAlertCnt;
	private int thirdAlertCnt;
}
