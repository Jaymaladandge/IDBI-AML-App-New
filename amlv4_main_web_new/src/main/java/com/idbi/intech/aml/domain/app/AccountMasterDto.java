package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class AccountMasterDto {

	private String accountId;
	private String accountName;
	private String accountNo;
	private String productCode;
	private String custId;
	private String branchId;
	private String glCode;
	private String accountType;
	private Date acctOpnDate;
	private String acctClsFlg;
	private Date acctClsDate;
	private String acBalanceAmt;
	private String acctOwnership;
	private String sanctionLimit;
	private String acctCrncyCode;
	private String acctStatus;
	private Date recUploadDt;
	private List<TransactionDetailsDto> tranDetails;
	private List<AcctRelatedPersonDto> aasDetails;
	private String startDate;
	private String endDate;
	private String labelCode;
	private String acctLabelDesc;
	private String channelId;
	private String nomDetails;
	private String freezeStatus;
}