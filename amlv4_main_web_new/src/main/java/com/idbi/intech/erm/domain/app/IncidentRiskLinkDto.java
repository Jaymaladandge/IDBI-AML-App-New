package com.idbi.intech.erm.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class IncidentRiskLinkDto {
	
	private String incidentRiskLinkId;
	private String incidentId; 
	private String riskControlLinkId;
	private String riskId;
	private String recordStatus;
	private String makerId;
	private Date makerTimestamp;

}
