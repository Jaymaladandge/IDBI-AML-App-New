package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class TopRiskBizzDto {

	private String bizzId;
	private Date startDate;
	private Date endDate;
	private Date createdDate;
	private String processFlg;
	private String creUserId;
	private String isPresent;
	private String asstPeriod;
	private String oldFlg;
	private int notificationCnt;
	private String asstPeriodComp;
	private String deptId;
	private String ofcType;
	private String ofcCode;
	private List<TopRiskTrendDto> trendResult;
	private String ofcId;
	private String selectedOfficeType;
}
