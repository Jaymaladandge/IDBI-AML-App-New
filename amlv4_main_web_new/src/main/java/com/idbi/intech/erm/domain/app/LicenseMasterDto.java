package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class LicenseMasterDto {


	private String licenseId;
	private String  domainId;
	private String  productName;
	private String  licenseUploadDate;
	private String  activationDate;
	private String  warrenty;
	private String  amcstartDate;
	private String amcFreq;
	private String  amcexpDate;
	private String  licenseStatus;
	private String  makerId;
	private String  makerTimeStamp;
	private String  checkerId;
	private String  checkerTimeStamp;
	
	private List<FileMasterDto> fileDetailsList;
}
