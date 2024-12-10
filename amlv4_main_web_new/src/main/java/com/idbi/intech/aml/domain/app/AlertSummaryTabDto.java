package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for Alert_summary_tab Entity
 * 
 * @author Vishwanath
 *
 */
@Data
public class AlertSummaryTabDto {

	private String recordId;
	private String aggKey;
	private String aggVal;
	private String noOfCust;
	private String noOfRules;
	private String alertStatus;
	private String lockFlg;
	private String userId;
	private String currentRole;
	private String noOfAlerts;
	private Date minDate;
	private Date maxDate;
	private Date lastUpdateDate;
	private String alertValSum;
	private String alertValCnt;
	private List<AlertSummaryTabDto> alertList;
	private int openCnt;
	private int closeCnt;
	private int holdCnt;
	private int escUpCnt;
	private int escbackCnt;
	private int raiseStrCnt;
	private int agreedCnt;
	private String maxAlertAge;
	private int maxAlertAgeNum;
	private List<AlertStatusDto> statusList;
	private String riskFlg;
	private String strFlg;
	private String regFlg;
	private String accfRisk;
	private String accfRefNum;
	private String accfRiskColor;
}
