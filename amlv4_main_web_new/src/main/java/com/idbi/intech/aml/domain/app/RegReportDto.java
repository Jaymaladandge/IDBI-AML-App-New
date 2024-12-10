package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import com.idbi.intech.erm.domain.app.UserDto;

import lombok.Data;
@Data
public class RegReportDto {
	
	private String requestId;
	private String branchId;
	private String branchName;
	private String customerId;
	private String customerName;
	private String accountNumber;
	private String accountType;
	private String accountName;
	private String transactionId;
	private String transactionDT;
	private String transactionType;
	private String creditDebitFlg;
	private String transactionAmount;
	private String transactionCurrency;
	private String sequenceNumber;
	private String strFlg;
	private String strReqNO;
	private String strCreatedDT;
	private String reportType;
	private List<String> reportTypeList;
	private List<String> reportYearList;
	private List<String> reportMonthList;
	private String yearValue;
	private String monthValue;
	private String srNo;
	private List<RegReportDto> reportList;
	private String makerId;
	private Date makerTimestamp;
	private String userName;
	private String userRole;
	private String recordStatus;
	private UserDto userObj;
	private List<RegReportRequestDto> regReportList;
	private String custUCIC;
	private String reqNo;
	private String requestedBy;
	private String userPosition;
	private String userId;
	private String subReportType;
	private String repYearValue;
	private String repMonth;

}
