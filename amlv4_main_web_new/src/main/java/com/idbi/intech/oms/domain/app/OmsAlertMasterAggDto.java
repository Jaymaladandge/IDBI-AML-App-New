package com.idbi.intech.oms.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class OmsAlertMasterAggDto {
	
	private String alertId;
	private String tranId;
	private String tranDate;
	private String tranParticular;
	private String tranAmt;
	private String tranPartType;
	private String tranType;
	private String forAcid;
	private String acctName;
	private String custId;
	private String acid;
	private String schmCode;
	private String acctOwnership;
	private String acctLabel;
	
	private List<OmsAlertMasterAggDto> alertAggList;
}
