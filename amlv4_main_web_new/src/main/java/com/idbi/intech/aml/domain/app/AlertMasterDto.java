package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.idbi.intech.erm.domain.app.FileMasterDto;

import lombok.Data;

@Data
public class AlertMasterDto {

	private String alertId;
	private String alertAggFlg;
	private String alertAggVal;
	private String alertRuleId;
	private String alertRuleDesc;
	private String alertRuleClassification;
	private String alertRuleIndicator;
	private String alertRuleRisk;
	private String alertConstitution;
	private String alertValType;
	private String alertVal;
	private Date alertStartDate;
	private Date alertEndDate;
	private String userId;
	private String lastUserId;
	private Date generatedTime;
	private Date lastChangeDate;
	private String alertStatus;
	private String currentRole;
	private String lastRole;
	private String isLocked;
	private String inherentRisk;
	private String residualRisk;
	private String strFlg;
	private List<AlertMasterDto> alertList;
	private int customerIdCnt;
	private int involvedCustCnt;
	private String userRole;
	private String actionStatus;
	private String userComment;
	private List<CustomerDataDto> custDataList;
	private Date lockTime;
	private String lockId;
	private Date unlockTime;
	private boolean alertPresentFlg;
	private String filterAggFlg;
	private String filterAlertStatus;
	private List<MarkCustDataDto> markCustList;
	private boolean markCustFlg;
	private List<AlertActivityLogDto> alertCommentList;
	private List<String> headerList;
	private List<String> dataList;
	private boolean isLockFlg;
	private List<CustUcicMasterDto> ucicCustList;
	private String ucicId;
	private String searchFlg; 
	private String alertValCnt;
	private HashMap<String,LinkedHashSet<RegDataReportOldDto>> regDataOldList;
	private Set<RegStrDataOldDto> strDataOldList;
	private String regStatus;
	private String strStatus;
	private String ucicRisk;
	private int mailCnt;
	private List<EmailDetailsDto> mailList;
	private String alertLockFlg;
	private List<FileMasterDto> filedetails;
	private String mailContent;
	private String userName;
	private String userMobile;
	private String userPosition;
	private String eddBranch;
	private String eddId;
	private Boolean eddFlg;
	private String custId;
	private String channelId;
	private String alertAge;
	private String accfRisk;
	private String accfRefNum;
	private String accfRiskColor;
	private String action;
	private Date releaseDate;
}