package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class ImpactRatingDto {
	
	private String financeImpact;
	private int rating;
	private String colorCode;
}
