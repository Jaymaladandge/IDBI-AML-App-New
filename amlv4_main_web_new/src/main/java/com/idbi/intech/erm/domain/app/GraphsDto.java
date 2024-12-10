package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class GraphsDto {

	private String moduleName;
	private long withinTolerance;
	private long aboveTolerance;
	private String officeType;

	private String withinToleranceColour;
	private String aboveToleranceColour;
	private List<GraphsDto> withinToleranceList;
	private List<GraphsDto> aboveToleranceList;

}
