package com.idbi.intech.erm.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class RiskAppetiteCaptureValueReportDto {
	
	private String moduleValueId;
	private String moduleName;
	private String moduleId;
	private String deptLinkId;
	private String deptId;
	private String assessmentValue;
	private String assessmentStatus;
	private String toleranceValue;
	private String captureUserId;
	private Date captureTime;
	private String assessmentPeriod;
	private String capturerOfficeId;
	private String valueRecordStatus;
	private String makerId;
	private Date makerTimeStamp;
	private Date checkerTimeStamp;
	private String checkerId;
	private Date approverTimeStamp;
	private String approveId;
	private String actionReqFlg;
	private String respCode;
	private String captureUserName;
	private String deptName;
	private String bgClass;
	private String ofcType;
	private int seqNo;
	
	private String assessmentColor;
	private String quarter;
	

}
