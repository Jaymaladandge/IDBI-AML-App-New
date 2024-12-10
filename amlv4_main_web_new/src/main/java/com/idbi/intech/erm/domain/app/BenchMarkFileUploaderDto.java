package com.idbi.intech.erm.domain.app;

import java.util.ArrayList;
import java.util.Date;

import lombok.Data;

@Data
public class BenchMarkFileUploaderDto {
	
	private String moduleValueId;
	private String bmId;
	private String bmName;
	private String deptId;
	private String deptName;
	private String financialYear;
	private String activeFlg;
	private String assessmentValue;
	private String officeCode;
	private String capturerOfficeId;
	private String officeId;
	private String capturerUserId;
	private Date capturerTimeStamp;
	private String makerId;
	private UserDto user;
	private String userName;
	private ActivityLogDto activityLogDto;
	private ArrayList<BenchMarkFileUploaderDto> listFileDetails;
}
