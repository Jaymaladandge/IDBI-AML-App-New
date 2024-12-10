package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.TreeMap;

import lombok.Data;

@Data
public class TopRiskCalculationDto {
	
	
	private String trcId;
	private String topRiskId;
	private String topRiskDeptId;
	private String officeId;
	private String officeName;
	private String deptWeightage;
	private String linkKriId;
	private String kriWeightage;
	private String capturerOfficeType;
	private String kriRagStatus;
	private Double deptKriVal;
	private Double avgDeptKriVal;
	private String deptRagStatus;
	private Double topRiskVal;
	private Double avgTopRiskVal;
	private String topRiskRagStatus;
	private String valueRecordStatus;
	private Date captureTimeStamp;
	private Date updatedTime;
	private String assessmentPeriod;
	private Date makeTimestamp;
	List<String> deptIdAndRagCount;
	List<String> ragWithColour;
	private String ragStatus;
	private String deptName;
	List<TopRiskCalculationDto> topriskCalDtoList;
	private String topRiskTheme;
	private String topRiskDescription;
	private String topRiskWeightage;
	private TreeMap<String,String> kriRAGDeptCount;
	private TreeMap<String,String> topRiskRAGDeptCount;
	private List<String> assessmentDateList;
	private String kriId;
	private String kriName;
	private String kriThresoldDescription;
	private String sourceName;
	private String zone;
	private String division;
	private String officeType;
	private  List<String> deptList;
	private List<String> zoneList;
	private List<String> officeNameList;
	private List<String> coperateRagList;
	private String deptSumVal;
	private String corpRagStatus;
	List<String> kriCalDtoDataList;
	private String assessmentValue;
	private String assessmentStatus;
	private String officeCode;
	private List<String> officeList;
	
}
