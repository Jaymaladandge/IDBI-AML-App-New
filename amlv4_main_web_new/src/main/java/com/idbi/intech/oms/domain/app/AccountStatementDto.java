package com.idbi.intech.oms.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class AccountStatementDto {
	private String tranAcid;
	private String accNo;
	private String tranId;
	private Date tranDate;
	private String partTranSrlNum;
	private String delFlg;
	private String creDebFlg;
	private String glSubHeadCode;
	private String tranAmt;
	private String tranParticular;
	private String tranParticular2;
	private String tranType;
	private String tranrmks;
	private String tranCustId;
	private String branchId;
	private String searchParam;
	private String startDate;
	private String endDate;
	private String frmAmt;
	private String endAmt;
	private String tranNarration;
	private String sourceDetails;
	private String destDetails; 
	private String tranChannel;  
	private Date pstdDate;
	private String debitAmt;
	private String creditAmt;
	private String eobBal;
	private String ledgeDate;
}
