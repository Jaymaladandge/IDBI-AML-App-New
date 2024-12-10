package com.idbi.intech.oms.domain.app;

import java.util.List;

import com.idbi.intech.erm.domain.app.UserDto;

import lombok.Data;

@Data
public class RomReportDto {
	private String alertId;
	private String alertStatus;
	private String custId;
	private String name;
	private String acctNum;
	private String acctOwnership;
	private String acctLabel;
	private String sol;
	private String branchName;
	private String region;
	private String zone;
	private String ruleId;
	private String ruleDesc;
	private String ruleTat;
	private String ruleFrequency;
	private String ruleCat;
	private String schemeType;
	private String schemeCode;
	private String ruleSeverity;
	private String generatedTime;
	private String tranAmount;
	private String commentDate;
	private String alertComment;
	private String remark;
	private String commentBy;
	private String branchId;
	private String regionId;
	private String searchParam;
	private String startDate;
	private String endDate;
	private List<RomReportDto> reportList;
	private UserDto userDto;
}
