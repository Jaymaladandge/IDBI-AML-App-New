package com.idbi.intech.aml.domain.app;

import java.util.List;

import com.idbi.intech.erm.domain.app.UserDto;

import lombok.Data;

@Data
public class StateWiseReportDto {
	
	private List<String> states;
	private String time;
	private String branchState;
	private String userId;
	private String requestId;
	private String requestParameters;
	private String requestedBy;
	private String userPosition;
	private String requestedTime;
	private String status;
	private String fileName;
	private String reportType;
	private String alertStartDate;
	private String alertEndDate;
	private int alertCount;
	private int strCount;
	private List<StateWiseReportDto> viewRequestList;
	private List<String> viewStateList;
	private String recordId;
	private String regionZone;
	private String branchId;
	private String branchName;
	private int customerCnt;
	private int ctrCnt;
	private int strCnt;
	private int cbwtrCnt;
	private int ntrCnt;
	private int ccrCnt;
	private int alertCnt;
	private UserDto userDto;
	private List<StateWiseReportDto> finalList;
	private String reportDate;
	private String reportExtractionDate;
	private StateWiseExportDto stateWiseExportDto;
	private List<StateWiseReportDto> statusList;
}
