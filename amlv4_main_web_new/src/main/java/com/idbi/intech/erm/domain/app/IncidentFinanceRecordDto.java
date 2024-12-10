package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class IncidentFinanceRecordDto {

	private String financeId;
	private String incidentId;
	private String date;
	private String type;
	private String amount;
	private String category;
	private String status;
	private String financeMakerId;
	private Date financeMakerTimeStamp;
	private IncidentDto incidentDto;
	private List<IncidentFinanceRecordDto> incidentFinanceList;
	
}
