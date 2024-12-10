package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for RegDataReportOldDto
 * 
 * @author
 *
 */
@Data
public class RegStrDataOldDto {
	private String recordId;
	private String monthOfRecord;
	private String yearOfRecord;
	private String reqNo;
	private String accountNo;
	private String custId;
	private String totDebit;
	private String totCredit;
	private String totCCredit;
	private String totCDebit;
	private String ucicNo;
	private String finNo;
	private String acctName;
	private String doi;
	private String gos;
	private String isPrimary;
	private Date updateTime;
	private String finVersion;
}
