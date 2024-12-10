package com.idbi.intech.oms.domain.app;


import java.util.List;

import lombok.Data;

@Data
public class AlertTatMasterDto {
	
	public String branchId;
	public String branchName;
	public String regionName;
	public String zoneName;
	public String tatStartDate;
	public String tatEnddate;
	public String numOfAlerts;
	public String tatPercentage;
	List<AlertTatMasterDto> tatReportList;
	public String searchParam;
	public String searchValue;
	private String totalAttended;
	private String totaldeleyed;
}
