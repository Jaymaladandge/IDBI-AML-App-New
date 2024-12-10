package com.idbi.intech.erm.domain.app;

import java.sql.Date;
import java.util.List;

import lombok.Data;

@Data
public class IncidentRemediationLinkDto {
	
	private String remediationId;
	private String incidentId;
	private String rootCauseIncident;
	private String rootCauseType;
	private String rootCauseDescription;
	private String grossLossRemediation;
	private String netLossRemediation;
	private String incidentReportedToLaw;
	private String makerId;
	private Date makerTimeStamp;
	private String casesReportedTo;
	private List<IncidentFinanceRecordDto> grossLoss;
	private List<IncidentFinanceRecordDto> recoveryLoss;
	private List<FileMasterDto> filedetails;
	private IncidentDto incidentDto;
	private String riskIdArray;
	private String userRole;
	private String department;
	private String actionName;
	private String sourceName;
	private String userName;
	private String requestStatus;
	private String officeId;
	private String selectedOfcType;
	private String userOfc;
	private String ofcLoc;
	private CommentDto commentDto;
	private String startDate;
	private String endDate;
	private String actionPlanName;
	private String frequency;
}	
