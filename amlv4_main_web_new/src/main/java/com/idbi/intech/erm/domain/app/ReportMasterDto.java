package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for kri_manual_tab Entity
 * 
 * @author Akshay
 *
 */
@Data
public class ReportMasterDto {

	private String reportId;
	private String reportName;
	private String reportModule;
	private String reportOfficeType;
	private String reportDescription;
	private String reportActionPath;
	private String reportType;
	private String reportStatus;
	private UserDto user;
	
	private List<ReportMasterDto> reportNameList;
	
}

