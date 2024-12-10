package com.idbi.intech.oms.domain.app;

import lombok.Data;

@Data
public class OmsAuditDto {

	private int totalCount;
	private int openCount;
	private int closeCount;
	private int escalateCount;
	private String zoneName;
	private String regionName;
	private String branchId;
	private String branchName;
	private String ruleId;
	private String ruleDesc;
	private String ruleClassification;
	private String rulePriority;

	private int lowCount;
	private int mediumCount;
	private int highCount;

	private int lowOpenCount;
	private int lowCloseCount;
	private int lowEscalateCount;

	private int mediumOpenCount;
	private int mediumCloseCount;
	private int mediumEscalateCount;

	private int highOpenCount;
	private int highCloseCount;
	private int highEscalateCount;
	
	private int statusWiseCount;
	
	private int operationalOpenCount;
	private int operationalCloseCount;
	private int operationalEscalteCount;

	private int irregularTranOpenCount;
	private int irregularTranCloseCount;
	private int irregularTranEscalteCount;

	private int financialExpOpenCount;
	private int financialExpCloseCount;
	private int financialExpEscalteCount;

	private int incomeLeakageOpenCount;
	private int incomeLeakageCloseCount;
	private int incomeLeakageEscalteCount;

	private int regulatoryComplOpenCount;
	private int regulatoryComplCloseCount;
	private int regulatoryComplEscalteCount;
}
