package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class CustKycIndMasterDto { 

	private String custId;
	private String custIsSuspended;
	private String title;
	private String custFirstName;
	private String custMiddleName;
	private String custLastName;
	private String custFullName;
	private String custMinorFlg;
	private String custGender;
	private Date custDob;
	private String custPanNo;
	private String custOccupation;
	private String custCategory;
	private String custConstitution;
	private String custNreFlg;
	private String primaryBranchId;
	private Date custOpnDate;
	private Date custType;
	private String empFlg;
	private String currentRole;
	private String passportno;
	private Date psprtIssueDate;
	private String psprtDet;
	private Date psprtExpDate;
	private String custAnnualIncome;
	private Date custModifiedDt;
	private String custIndFlg;
	private Date recUploadDt;
	private String employerName;
	private String employerAddress;

}