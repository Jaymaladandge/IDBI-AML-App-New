package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class KeyMitigationPlanDto {
	
	
	private String keyMitigationId;
	private String keyMitigationName;
	private String keyMitigationDesc;
	private String applicableOffice;
	private String makerId;
	private Date makerTimestamp;
	private String checkerId;
	private Date checkerTimestamp;
	private String approverId;
	private Date approverTimestamp;
	
	private String actionStatus;
	private String riskId;
	
	private String deptName;
	private String keyMitigation;
	private int implementedCount;
	private int notDue;
	private int pendingLessThan6Mon;
	private int pendingGreaterThan6Mon;
	private int actionIdCount;
	private List<KeyMitigationPlanDto> keyMitigationList;
	private String selectedOfficeType;
	private String selectedOfcCode;
	private String selectedDeptId;
	private UserDto User;
	private String  selectedAssessmentPeriod;
	private String currentAssDate;
	private int mediumRiskCount;
	private int highRiskCount;
	

}
