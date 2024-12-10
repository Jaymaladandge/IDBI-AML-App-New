package com.idbi.intech.aml.domain.app;


import java.util.HashMap;
import java.util.List;

import lombok.Data;

@Data
public class MisDto {
	private String userId;
	private String requestId;
	private String requestParameters;
	private String requestedBy;
	private String userPosition;
	private String requestedTime;
	private String status;
	private String reportType;
	private String searchParam;
	private String responseJson;
	private String alertStartDate;
	private String alertEndDate;
	private String omsUserId;
	private String fileName;
	private List<MisDto> misDtoList;
	private String time;
	private List<MisDto> alertList;
	
	private List<MisDto> outPutList;
	
	private List<MisDto> viewRequestList;
	private HashMap<String, String> requestParametersMap;
	
	
}
