package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class DepartmentMasterDto {

	private String deptId;
	private String refId;
	private String deptName;
	private String deptStatus;
	private String deptMakerId;
	private Date makerTimestamp;
	private String deptCheckerID;
	private Date checkerTimestamp;
	private List<String> captureValueDeptIdList;
	private String deptWeigthage;

	private String linkedOffice;

}
