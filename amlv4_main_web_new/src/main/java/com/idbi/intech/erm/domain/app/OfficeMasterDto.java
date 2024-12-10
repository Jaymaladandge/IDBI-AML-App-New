package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class OfficeMasterDto {

	private String officeId;
	private String officeInternalCode;
	private String officeName;
	private String officeType;
	private String deptId;
	private String officeCity;
	private String officeState;
	private String officeAreaPinCode;
	private String reportingOfficeCode;
	private String officeStatus;
	private String officeMakerId;
	private Date makerTimestamp;
	private String officeCheckerId;
	private Date checkerTimestamp;
	private String officeCode;
	private String officePinCode;

	private String colorCode;
	private String userId;
	private String zone;
	private String division;
	private String officeEmailId;
	private String flg;
	private List<OfficeMasterDto> ofcListDto;
	private String selectedOfficeType;
	private List<String> ofcCodeList;
}
