package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class ControlLookupDto {

	private String recordId;
	private String resultValue;
	private Double min;
	private Double max;
	private String officeType;
	private String category;
	private String moduleName;
}
