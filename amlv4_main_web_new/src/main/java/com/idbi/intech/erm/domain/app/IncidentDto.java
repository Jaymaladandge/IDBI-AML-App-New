package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Data;

@Data
public class IncidentDto {

	private String incidentId;
	private String incidentName;
	private String incidentStatus;
	private String actionStatusOld;
	private String actionStatus;
	private String incidentDescription;
	private String businessUnit;
	private String additionalBusinessUnit;
	private String businessSegment;
	private String department;
	private String departmentId;
	private String operatingOfcLocation;
	private String employeeId;
	private String incidentReportingPerson;
	private String phoneNumber;	
	private String emailId;	
	private String incidentIdentificationDate;
	private String incidentRecordDate;
	private String casesReportedTo;
	private String previousIncidentReference;
	private String assessedImpactValue;
	private String primaryLossEvent;
	private String secondaryLossEvent;
	private String makerId;
	private Date makerTimeStamp;
	private String checkerId;
	private Date checkerTimeStamp;
	private String approverId;
	private Date approverTimeStamp;
	private List<FileMasterDto> filedetails;
	private List<IncidentDto> incidentList;
	private List<CodeMasterDto>codeMasterList;
	private ActionPlanMasterDto apDto;
	private CodeMasterDto codeMasterDto;
	private String searchParam;
	private String searchValue;
	private String sortValue;
	private String actionName;
	private UserDto user;
	private CommentDto commentDto;
	private ActivityLogDto activityLogDto;
	private String sourceName;
	private String userName;
	private String userRole;
	private String requestStatus;
	private String recoverableValue;
	private String incidentType;
	private String incidentImpactLevel;
	private String customerImpacted;
	private String regulatoryImpact;
	private String whetherInsured;
	private String recoveryStatus;
	private List<IncidentFinanceRecordDto> incidentFinanceList;
	private IncidentRemediationLinkDto incidentRemediationLinkDto;
	private List<IncidentRiskLinkDto> incidentRiskLinkList;
	private List<IncidentClosureLinkDto> incidentClosureLinkDtoList;
	private IncidentClosureLinkDto incidentClosureLinkDto;
	private String officeId;
	private String selectedOfcType;
	private String userOfc;
	private String ofcLoc;	
	private List<PrimaryLossEventDto> primaryLossEventDtoList;
	private List<String> checkCountDtoList;
	private List<String> countAndValue;
	private List<String> officeSubNameCount;
	private String ofcPincode;
	private List<String> officeSubNameCountCurYear;
	private List<String> officeSubNameCountPrevYear;
	private String currentYear;
	private String previousYear;
	private String deptReported;
	private String officeCode;
	private String reporterId;
	private String userDept;
	private List<String> quaterList;
	private String internalFraudCountAndAmount;
	private String externalFraudCountAndAmount;
	private String empAndWorkCountAndAmount;
	private String clientProductBusinessPractiseCountAndAmount;
	private String damageToPhyAssetsCountAndAmount;
	private String businessDisSysFailure;
	private String exeDelAndPm;
	private String intermediaryCountAndAmount;
	private String policyCountAndAmount;
	private List<String> branchCountWithYear;
	private List<String> divisionCountAndAmount;
	private List<IncidentReportDto> reportDtoList;
	private ActionPlanMasterDto aplMasterDto;
	private String actionPlanName;
	private String frequency;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date startDate;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date endDate;
	private HashMap<String,Integer> incidentStatusHs;
	private String officeZone;
	private String actionPlanCount;
	private List<ActionPlanMasterDto> actionList;
	private RiskLibraryMasterDto riskLibDto;
	private String financialYear;
	private List<String> fmrPart1list;
	private List<String> fmrPart2list;
	private List<String> fmrPart3list;
	private List<String> fmrPart4list;
	private String totalFmr;
	private String totalFmr2;
	private String totalFmr4;
	private String categoryTotal;
	private NotificationDto notificationDto;

}





