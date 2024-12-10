package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class CustomerDataDto {

	private String custId;
	private String custFullName;
	private String custPanNo;
	private String custOccupation;
	private String branchId;
	private String branchMail;
	private String custConst;
	private String custRisk;
	private Date custOpenDate;
	private List<AccountMasterDto> acctList;
	private String custType;
	private Date custDob;
}