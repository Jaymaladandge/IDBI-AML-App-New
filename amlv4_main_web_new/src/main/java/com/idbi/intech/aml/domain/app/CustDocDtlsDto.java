package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class CustDocDtlsDto {

	private String recordId;
	private String custId;
	private String docCode;
	private String docDesc;
	private String status;
	private String docValue;
	private String docIssueCntry;
	private String docIssuePlace;
	private Date recUploadDt;
	private String docIssueDate;
	private String placeOfRegistration;

}
