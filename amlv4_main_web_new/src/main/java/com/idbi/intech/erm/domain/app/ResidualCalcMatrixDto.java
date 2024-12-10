package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class ResidualCalcMatrixDto {
	private String inherentControlConcat;
	private String scaleRange;
	private String colorCode;
	private String calcValues;

	private String inherentAssessment;
	private String controlAssessment;

}
