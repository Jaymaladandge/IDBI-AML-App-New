package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class TransactionDetailsDto {

	private String totalCred;
	private String totalDeb;
	private String totalCashCred;
	private String totalCashDeb;
	private String avg;
	private String startDate;
	private String endDate;
}
