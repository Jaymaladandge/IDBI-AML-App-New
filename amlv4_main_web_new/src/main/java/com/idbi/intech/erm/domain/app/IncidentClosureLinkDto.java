package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class IncidentClosureLinkDto {

	private String incidentClosureLinkId;
	private String incidentId;
	private String recordStatus;
	private String businessSegment;
	private String riskInRiskRegister;
	private String controlInRiskRegister;
	private String checkListJson;
	private String closureReason;
	private String riskIdArray;
	private String makerId;
	private String makerTimestamp;
	private List<IncidentClosureCheckListDto> checkList;
	private List<FileMasterDto> filedetails;
	private String userRole;
	private String department;
	private String officeId;
	private String selectedOfcType;
	private String userOfc;
	private String ofcLoc;
	private String sourceName;
	private IncidentDto incidentDto;
	private List<RiskLibraryMasterDto> riskLibDtoList;
	private String riskId;
	private String riskDescription;
	private List<String> caseName;
	private List<String> caseCount;
	private String srNo;
	private String checkListNmae;
	private String checkListCout;
	private List<IncidentClosureLinkDto> checkListCount;
	private String financialYear;
	private String casesReportedTo;
}

