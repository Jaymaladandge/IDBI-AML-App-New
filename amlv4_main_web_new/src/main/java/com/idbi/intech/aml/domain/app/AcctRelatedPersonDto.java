package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class AcctRelatedPersonDto {

	private String accountId;
	private String acReltnPersonName;
	private String acReltnType;
	private String acReltnTypeDesc;
	private String reltdCustId;
	private String custReltnCode;
}