package com.idbi.intech.erm.domain.app;


import lombok.Data;

@Data
public class CTRAccountDto {

	private String srNO;
	private String recordType;
	private String monthOfRecord;
	private String yearOfRecord;
	private String lineNo;
	private String branchRefNo;
	private String accountNo;
	private String accountName;
	private String typeOfAc;
	private String typeOfAcholder;
	private String acctOpnDate;
	private String riskRating;
	private String cummCrTot;
	private String cummDrTot;
	private String cummCsCrTot;
	private String cummCsDrTot;
	private String acctStatus;
	private String ctrSeqNo;
	private String personName;
	private String processFlg;
	private String custId;
	private String fileName;
	private String stateCode;
}
