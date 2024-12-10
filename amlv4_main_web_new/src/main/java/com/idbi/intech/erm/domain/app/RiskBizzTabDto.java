package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class RiskBizzTabDto {

	private String recordId;
	private Date startDate;
	private Date endDate;
	private String recordStatus;
	private String makerId;
	private Date makerTimestamp;
	private String creationPeriod;
	private String recordAction;
	
	private String paramKey;
	private String searchParam;
	List<String> assessmentPeriodList;
	
	private boolean flg;
}
