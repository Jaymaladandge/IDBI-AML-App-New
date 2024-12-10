package com.idbi.intech.oms.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class HtdDto {

	private String recordId;
	private String tranId;
	private Date tranDate;
	private String partTranSrlNum;
	private String delFlg;
	private String partTranType;
	private String glSubHeadCode;
	private String tranAcid;
	private String tranAmt;
	private String tranParticular;
	private String tranParticular2;
	private String tranType;
	private String tranSubType;
	private String valueDate;
	private String pstdDate;
	private String vfdDate;
	private String rptCode;
	private String refNum;
	private String instrmntType;
	private String instrmntDate;
	private String instrmntNum;
	private String instrmntAlpha;
	private String tranRmks;
	private String pstdFlg;
	private String custId;
	private String rateCode;
	private String rate;
	private String tranCrncyCode;
	private String refCrncyCode;
	private String refAmt;
	private String branchId;
	private String dthInitBranchId;
	
}
