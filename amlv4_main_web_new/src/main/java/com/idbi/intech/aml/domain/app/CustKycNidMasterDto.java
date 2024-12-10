package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class CustKycNidMasterDto {

	private String custId;
	private String custIsSuspended;
	private String title;
	private String custFullName;
	private Date custDob;
	private String custPanNo;
	private String custOccupation;
	private String custCategory;
	private String custConstitution;
	private String custNreFlg;
	private String primaryBranchId;
	private Date custOpnDate;
	private Date custType;
	private Date custModifiedDt;
	private String custMgrOpinion;
	private String custNidFlg;
	private Date recUploadDt;
	private String companyId;
	private String fcraRegState;
	private Date dateOfRegistration;
	private String custTurnover;
	private String placeOfRegistration;
	private String fcraStatus;
	private String fcraRegNum;
	private String entityWebsite;
	private String uboPresentFlg;

}