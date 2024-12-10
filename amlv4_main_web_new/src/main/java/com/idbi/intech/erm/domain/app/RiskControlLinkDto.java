package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class RiskControlLinkDto {
	
	private String riskControlLinkId;
	private String riskId;
	private String controlId;
	private String linkActionStatus;
	private String recordStatus;
	private Date recordCreDate;
	
	private String cntrlName;
	private String cntrlFunName;
	private String cntrlAssessmentFreq;
	
	private String searchParam;
	private List<ControlLibraryDto> controlLibraryList;
	private String riskIdArray;
	
	private String statusCol;
	
}
