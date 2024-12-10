package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class CustomerDto {
	private String custId;
	private String custIsSuspended;
	private String title;
	private String custFirstName;
	private String custMiddleName;
	private String custLastName;
	private String custFullName;
	private String custGender;
	private Date custDob;
	private String custPanNo;
	private String custOccupation;
	private String custCategory;
	private String custConstitution;
	private String custMinorFlg;
	private String custNreFlg;
	private String primaryBranchId;
	private String custOpnDate;
	private String custType;
	private String empFlg;
	private String empId;
	private String passportNo;
	private Date passportIssueDate;
	private String passportDetails;
	private Date passportExpirationDate;
	private String custAnnualIncome;
	private Date custModifiedDt;
	private String custIndFlg;
	private Date recUploadDt;
	private String employerName;
	private String employerAddress;
	private String custMgrOpinion;
	private String custNidFlg;
	private String companyId;
	private String fcraRegState;
	private Date dateOfRegistration;
	private String custTurnover;
	private String placeOfRegistration;
	private String fcraStatus;
	private String fcraRegNum;
	private String uboPresentFlg;
	private String entityWebsite;
	private String addressCategory;
	private String addressLine1;
	private String addressLine2;
	private String addressLine3;
	private String city;
	private String state;
	private String zip;
	private String country;
	private String preferredAddress;
	private Date lastUpdateDate;
	private Date recModifiedDate;
	private Date recUploadDate;
	private String custRisk;
	private String custKycDate;
	private String actualRisk;
	private List<CustAddressDtlsDto> custAddressDtoList;
	private List<CustDocDtlsDto> custDocDtoList;
	private List<CustPhoneEmailDtlsDto> custPhoneEmailDtlsDtos;
}
