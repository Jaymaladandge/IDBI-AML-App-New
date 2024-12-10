package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Data;

@Data
public class DashBoardDto {

	private String sourceId;
	private String sourceName;
	private String assignDate;
	private String targetDate;
	private String tasks;
	private String bgClass;
	private String taskName;
	private String officeType;
	private List<RiskAppetiteMasterDto> riskAppMasDto;
	private List<ActionPlanMasterDto> actionPlanMasterDto;
	private HashMap<String, String> officeLevel;
	private String deptName;
	private String officeTypeCode;
	private List<DashBoardDto> dashBoardDto;
	private String dueCnt;
	private String escCnt;
	private String dueWeekCnt;
	private List<String> notifyAllLevelModuleCode;
	private String moduleCode;
	private String officeCode;
	private String officeId;
	private DashBoardDto dashboardCnt;

	private String notificationId;
	private Boolean flg;
	private RiskRegisterDto riskRegister;
	private List<String> officeList;
	HashMap<String,Long> closeNotificationStatusCount;
	private String ntfStatus;
	private List<String> deptList;
	private List<String> officeCodeList;
	private String deptId;
	private String makerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date recordTimeStamp;

	
}
