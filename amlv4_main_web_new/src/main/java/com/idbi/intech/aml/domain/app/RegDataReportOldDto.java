package com.idbi.intech.aml.domain.app;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for RegDataReportOldDto
 * 
 * @author
 *
 */
@Data
public class RegDataReportOldDto {
	private String recordId;
	private String monthOfRecord;
	private String yearOfRecord;
	private String accountNo;
	private String custId;
	private String cummCrTot;
	private String cummDrTot;
	private String regReportType;
	private String ucicNo;
	private String totAmt;
	private String acctName;
	private String finVersion;
}
