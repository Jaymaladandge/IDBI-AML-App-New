package com.idbi.intech.aml.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class AccountFreezeDtlsDto {

	private String recordId;
	private String acid;
	private String freezeCode;
	private String freezeReasonCode;
	private String freezeRemarks;
	private String freezeDate;
	private String lienAmt;
	private String lienRemarks;
	private String lienDate;
	private String recUploadDate;
	List<AccountFreezeDtlsDto> dtoList;
	private String accountId;
	
	
}
