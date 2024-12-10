package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class BenchmarkValueCaptureDto {

	private String moduleValueId;
	private String bmId;
	private String deptId;
	private String financialYear;
	private String activeFlg;
	private String assessmentValue;
	private String capturerOfficeId;
	private String capturerUserId;
	private Date capturerTimeStamp;
	private String respCode;
	private String officeType;
	private List<CodeMasterDto> codeMasterDtoList;
	private String searchParam;
	private String officeCode;
	private String bmName;
	private String deptName;
	private List<BenchmarkValueCaptureDto> benchmarkValueCaptureDtoList;
	private String oldValue;
	private String newValue;
	private String makerId;
	private String[] linkedOfcList;
	private String ntfId;
	private String assessmentPeriod;
	private String benchmarkDesc;
	private UserDto user;
	private List<OfficeMasterDto> officeCodeList;
	private String selectedOfcCode;
	private String selectedDeptId;
	
}

