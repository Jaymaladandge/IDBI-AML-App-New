package com.idbi.intech.aml.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class DmatTransactionDto {

	private String id;
	private String branchId;
	private String dpmClientId;
	private String name;
	private String clientCategory;
	private String bookingDate;
	private String isinCode;
	private String accountType;
	private String drcrIndicator;
	private String quantity;
	private String bkgNarrationCode;
	private String bkgType;
	private String blFlag;
	private String dpmRefferenceNumber;
	private String transactionId;
	private String transactionDate;
	private String cumulativeQuantity;
	private String transaction_type;
	private String particulars;
	private String credit;
	private String debit;
	private String closingRate;
	private String blCode;
	private String lockReleaseDate;
	private String targetDpId;
	private List<DmatTransactionDto> tranList;
	private String rate;
}
