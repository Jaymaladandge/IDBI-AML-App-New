package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class AlertActivityReportDto {

	private String recordId;
	private String requestId;
	private String userId;
	private String userName;
	private String userRole;
	private String alertStatus;
	private Date actDate;
	private int ucicCount;
	private int customerCount;
	private int alertCount;
	private int activityCount;
	private String startDate;
	private String endDate;
	private List<MisDto> misDtoList;
	private List<ActivityReportDto> activityReportDtoList;
	private List<String> ucicCountList;
	private List<String> alertCountList;
	private List<String> actionCountList;
	private List<String> customerCountList;
	private List<String> userCountList;
	private Integer rownumNumber;
	private Integer ucicSum;
	private Integer customerSum;
	private Integer alertSum;
	private Integer actionSum;

	private List<ActivityReportDto> listNew;

}
