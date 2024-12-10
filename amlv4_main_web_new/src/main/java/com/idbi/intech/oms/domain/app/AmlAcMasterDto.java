package com.idbi.intech.oms.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class AmlAcMasterDto {

	private String acid; 
	private String entityCreFlg;
	private String delFlg; 
	private String branchId;
	private String custAcNo; 
	private String custId;
	private String glSubHeadCode; 
	private String acctOwnership;
	private String schmCode;
	private String acctOpenDate;
	private String acctClsFlg; 
	private String acctClsDate;
	private String custAcBalance;
	private String sanctLim;
	private String chqAllwdFlg;
	private String lastTranDate;
	private String lastAnyTranDate;
	private String crncyCode; 
	private String acctCrncyCode;
	private String custAcType; 
	private String swiftAllwedFlg;
	private String acctName; 
	private String lastModifiedDate;
	private String amlUploadDate;
	private String acctType;
	
	private String acTotalDt;
	private String acTotalCr;
	private String acTotalCashDt;
	private String acTotalCashCr;
	private String acAvgBalance;
	private String searchParam;
	private String searchValue;
	
	
	private List<AmlAcMasterDto> acctList;
	private List<AMLCustMasterDto> custIdList;
	private int count;
	
	
	
}
