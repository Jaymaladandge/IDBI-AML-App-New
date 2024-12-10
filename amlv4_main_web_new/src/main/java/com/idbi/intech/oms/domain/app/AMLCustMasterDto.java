package com.idbi.intech.oms.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class AMLCustMasterDto {

	private String custId;
	private String custName;
	private String custSex;
	private String entityCreFlg;
	private String custDelFlag;
	private String custOccpCode;
	private String custTypeCode;
	private String custStatCode;
	private String custConst;
	private String custMinorFlag;
	private String custNREFlag;
	private String custDOB;
	private String custPanNo;
	private String custPassportNo;
	private String psprtIssueDate;
	private String psprtDet;
	private String psprtEXPDate;
	private String primarySolId;
	private String custOpenDate;
	private String custActiveDate;
	private String tdsTbldede;
	private String natIdCardNum;
	private String kycReviewDate;
	private String kycDate;
	private String riskRating;
	private String staffFlg;
	private String stateCode;
	private String cuuntryCode;
	private String pinCode;
	private String groupId;
	private String preferedName;
	private String amlUploadDate;
	private String scanFlg;
	private String primaryFlg;
	private String riskColor;
	private String msg;
	private String idType;
	private String id;
	private String mailingAddress;
	private String searchParam;
	private String searchValue;
	private List<AMLCustMasterDto> custList;
	private List<AMLCustAddressDto> addrList;
	private List<AMLCustPhoneEmailDto> contactList;
	private List<AmlAcMasterDto> acctList;
	private int count;
	private String agmName;
	private String dgmName;
	private String rmName;
	private String dealingVertical;
}
