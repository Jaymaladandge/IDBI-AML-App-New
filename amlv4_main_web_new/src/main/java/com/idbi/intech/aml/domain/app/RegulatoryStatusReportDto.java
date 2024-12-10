package com.idbi.intech.aml.domain.app;

import java.util.List;

import com.idbi.intech.erm.domain.app.UserDto;

import lombok.Data;

@Data
public class RegulatoryStatusReportDto {

	private String userId;
	private String requestId;
	private String requestParameters;
	private String requestedBy;
	private String userPosition;
	private String requestedTime;
	private String status;
	private String fileName;
	private String filterList;
	private String reportType;
	private String alertStartDate;
	private String alertEndDate;
	private String searchList;
	private String time;
	private List<RegulatoryStatusReportDto> viewRequestList;
	private UserDto userDto;
	private List<RegulatoryStatusReportDto> finalList;
	private String reportDate;
	private String reportExtractionDate;
	private List<RegulatoryStatusReportDto> statusList;
	private String strRequested;
	private String strRequestId;
	private String strStatus;
	private String strSource;
	private String strFinNo;
	private int ctr;
	private int ntr;
	private int cbwtr;
	private int ccr;
	private String customerId;
	private String accountNo;
	private String userDeptName;
	private String userOfficeName;
	private String userOfficeType;
	private String username;
	
}
