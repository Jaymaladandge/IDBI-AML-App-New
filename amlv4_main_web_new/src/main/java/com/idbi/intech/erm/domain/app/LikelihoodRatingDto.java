package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class LikelihoodRatingDto {
	
	private String probRiskEvent;
	private int rating;
	private String colorCode;

}
