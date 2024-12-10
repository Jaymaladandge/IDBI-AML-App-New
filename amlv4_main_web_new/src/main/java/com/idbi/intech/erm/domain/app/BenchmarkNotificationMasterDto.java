package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class BenchmarkNotificationMasterDto {
	
	private String bmNtfId;
	private String bmId;
	private String bmDesc;
	private String bmStatus;
	private String bmDept;
	private String bmTargetRole;
	private Date bmStartDate;
	private Date bmEndDate;
	private String makerId;
	private Date makerTimeStamp;
	private String ofcType;
	private String ofcCode;
	private String targetOfcId;
	private String ntfId;
	private String[] linkedOfcList;
	private String deptName;
	private List<BenchmarkNotificationMasterDto> bmNtfDtoList; 
	private String assessmentValue;
	private String checkerId;
	private Date checkerTimeStamp;
	private String searchParam;
	private String assessmentDate;
	private String ntfModule;
	private String statusParam;
	private String region;
	private String officeZone;
	private String selectedOfcCode;
	private String selectedDeptId;

}
