package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class StrMisInsertReportBean {

	private String strNo;
	private String userId;
	private String userName;
	private String userRole;
	private String alertStatus;
	private Date actDate;
	private int ucicCount;
	private int customerCount;
	private int alertCount;
	private int activityCount;
	private Date startDate;
	private Date endDate;

	private Integer rownumNumber;
	private Integer ucicSum;
	private Integer customerSum;
	private Integer alertSum;
	private Integer actionSum;
	private String reportDate;
	private String reportExtractionDate;
	private String accountNo;
	private String accountName;
	private String acctOpenDate;
	private String acctStatus;
	private String ruleId;
	private String branchId;
	private String accOpenDate;
	private String accountStatus;
	private String ruleDesc;

	private String analystId;
	private String analystComment;
	private String reviewerId;
	private String reviewerComment;
	private String verifierId;
	private String verifierComment;

	private List<StrMisInsertReportBean> strMisReportBeanList;
	private String strStatus;
	private String strReqType;
	private String amlVersion;
	private String requestDate;

	// StrMisCustomerData
	private String recordId;
	private String requestId;

	private String custId;
	private String customerName;
	private String panNo;
	private String riskCode;
	private String ucicNumber;
	private String custConstitution;
	private String custOccupation;

}
