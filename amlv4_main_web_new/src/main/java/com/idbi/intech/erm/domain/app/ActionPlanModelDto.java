package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Data;

@Data
public class ActionPlanModelDto {

	private String actionPlanId;
	private String recordStatus;
	private String actionName;
	private String actionDesc;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date expDate;
	private String comPercentage;
	private String actionOwner;
	private String actionUpdateFrequency;
	
	private String sourceId;
	private String sourceName;
	private String moduleName;
	private String recStatus;
	private String asstStatus;
	
	private String updatePeriod;
	private String completionPerEntry;
	private String updatedBy;
	private String updatedDate;
	
	private String completionDate;
	private String revisedDate;
	private String recordCreatedBy;
	private String recordDate;
	
	private String fileName;
	private Double fileSize;
	private String uploadedBy;
	private String uploadedDate;
	
	private List<ActionPlanModelDto> linkedModules;
	private List<ActionPlanModelDto> actionUpdatesList;
	private List<ActionPlanModelDto> revisedDateList;
	private List<ActionPlanModelDto> documentList;
}
