package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class IncidentReportDto {

	
	private String incidentId;
	private String incidentName;
	private String operatingOfcLocation;
	private String incidentRecordDate;
	private String primaryLossEvent;
	private String rootCauseIncident;
	private String rootCauseDescription;
	private String assessedImpactValue;
	private String operatingOfcNo;
	private String department;
}
