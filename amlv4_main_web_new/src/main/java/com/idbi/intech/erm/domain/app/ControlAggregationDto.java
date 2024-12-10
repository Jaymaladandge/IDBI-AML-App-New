package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class ControlAggregationDto {
	
	private String recordId;
	private String controlId;
	private String officeType;
	private String reportingOfficeId;
	private String aggregationValue;
	private String aggregateDate;
	private String aggregateTimestamp;
	private String statusFlg;
	
	private String riskId;
	private String riskName;
	private String aggregationColValue;
	private List<ControlAggregationDto> cntrlAggList;
	
}
