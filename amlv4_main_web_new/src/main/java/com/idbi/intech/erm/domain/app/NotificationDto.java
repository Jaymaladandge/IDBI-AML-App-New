package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Data;

@Data
public class NotificationDto {

	private String ntfId;
	private String ntfTitle;
	private String ntfModule;
	private String ntfModuleId;
	private String ntfPriority;
	private String ntfStatus;
	private String ntfTarget;
	private String targetDept;
	private String targetId;
	private Date ntfStartDate;
	private Date ntfEndDate;
	private String ntfMakerId;
	private Date ntfMakerTimeStamp;
	private String ntfCheckerId;
	private Date ntfCheckerTimeStamp;
	private String ntfActionStatus;
	private String ntfOfficeType;
	private String ntfOfficeId;
	private String userEmail;
	private List<NotificationDto> ntfDtoList;
	private String mailSendFlg;
	private String searchParam;
	private String deptName;
	private String ntfValue;
	private String ofcCode;
	private String statusParam;
	private String financeYear;
	private String ntfDate;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date startDate;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date endDate;
	private List<String> ntfIdList;
	private UserDto user;
	private String ntfModuleDesc;
	private String assessmentDate;
	private String selectedOfcCode;
	private String selectedDeptId;
	
	private List<OfficeMasterDto> officeDtoList;
	private List<RiskBizzTabDto> bizzDtoList;
	
	private int pendingNtf;
	private int pendingVCNtf;
	private int closeNtf;
	private HashMap<String,Integer> statusCount;

	private List<FileMasterDto> filedetailsList;
	private String selectedDepartment;
	private List<NotificationDto> ntfDtoListPending;
	private List<NotificationDto> ntfDtoListPendingForVerification;
	private List<NotificationDto> ntfDtoListCaptured;
	private String assessmentDate2;
	private List<String> sumVCData;
	private String officeName;
	
}
