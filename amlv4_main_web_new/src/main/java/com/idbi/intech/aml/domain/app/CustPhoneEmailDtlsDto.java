package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class CustPhoneEmailDtlsDto {

	private String recordId;
	private String custId;
	private String recordValue;
	private String recordType;
	private Date recModifiedDt;
	private Date recUploadDt;
}
