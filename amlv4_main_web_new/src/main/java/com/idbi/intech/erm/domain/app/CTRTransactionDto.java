package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class CTRTransactionDto {

	private String recordId;
	private String recordType;
	private String lineNo;
	private String accountNo;
	private String tranId;
	private String tranDate;
	private String modeOfTran;
	private String creDebFlg;
	private String tranAmount;
	private String tranCrncy;
	private String tranRemarks;
	private String solId;
	private String ctrSeqNo;
	
}
