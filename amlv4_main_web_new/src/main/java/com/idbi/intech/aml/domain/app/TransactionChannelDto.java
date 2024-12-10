package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class TransactionChannelDto {

	private String transactionType;
	private String debitCount;
	private String sumDebitValue;
	private String creditCount;
	private String sumcreditValue;
	private String sumDebitValueFormatted;
	private String sumcreditValueFormatted;
	private String debtCountPercent;
	private String crdtCountPercent;
	private String debtCountAndPercent;
	private String crdtCountAndPercent;
	
}
