package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class ImpactLikelihoodMatrixDto {
	
	private String impactLikeConcatVal;
	private String severityLevel;
	private String colorCode;
	private String calcValues;
	
	private String impactRating;
	private String likelihoodRating;
}
