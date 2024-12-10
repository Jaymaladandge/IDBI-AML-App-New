package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class CTRCtrlFileDto {

	private String recordId;
	private String reportName;
	private String serialNumber;
	private String recordType;
	private String monthOfRecord;
	private String yearOfRecord;
	private String compNameOfBank;
	private String categoryBank;
	private String bsrCode;
	private String uidFiu;
	private String poName;
	private String poDesignation;
	private String poAddress;
	private String poCity;
	private String poState;
	private String poCountry;
	private String poPincode;
	private String poTelephone;
	private String poFax;
	private String poEmail;
	private String reportType;
	private String reasonForReplacement;
	private String srnoOriginalReport;
	private String operationMode;
	private String dsVersion;
	private String totalBranchNo;
	private String noOfNtrs;
	private String noOfTransactions;
	private String noOfIndividuals;
	private String noOfLegals;
	private String ctrSeqNo;
	private String createdBy;
	private String createdDate;
	
}
