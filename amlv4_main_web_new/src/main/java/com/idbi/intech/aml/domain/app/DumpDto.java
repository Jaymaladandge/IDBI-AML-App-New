package com.idbi.intech.aml.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class DumpDto {
	
	private String ticketId;
	private String ucicNo;
	private String startDate;
	private String endDate;
	private String ruleId;
	private String ruleDesc;
	private String userId;
	private String actStatus;
	private String actComment;
	private String userRole;
	private String actDate;
	private int alertTat;
	private String strRequested;
	private String strRequestedId;
	private String strStatus;
	private int ctr;
	private int ntr;
	private int cbwtr;
	private int ccr;
	private String requestId;
	private List<AlertDumpTableDto> finalList;
	private List<String> ticketCountList;
	private List<AlertDumpTableDto> alertDumpTableList;
}
