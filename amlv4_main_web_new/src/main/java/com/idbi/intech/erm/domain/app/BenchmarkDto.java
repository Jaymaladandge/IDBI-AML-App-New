package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class BenchmarkDto {
	
	private String bmId;
	private String bmRecordStatus;
	private String bmName;
	private String bmValue;
	private String bmActionStatus;
	private String bmActionStatusOld;
	private String bmAssessmentYear;
	private String bmAssessmentPeriod;
	private String bmAssessmentPeriodValue;
	private String bmMakerId;
	private Date bmMakerTimestamp;
	private String bmApproverId;
	private Date bmApproverTimestamp;
	private String userName;
	private String bmActionName;
	private UserDto user;
	private List<FileMasterDto> filedetails;
	private String searchParam;
	private String searchValue;
	private String sortValue;
	private CommentDto commentDto;
	private ActivityLogDto activityLogDto;
	private String sourceName;
	private String departmentId;
	private String userRole;
	private String requestStatus;
	private List<BenchmarkDto> benchmarkList;
	private String fileName;
	private String flg;
	private  List<String> offNameList;
	private String bmDescription;
	private String applicableOffice;
	private String bmDatatype;
	private String bmDataFlg;
	private String bmValueTypeFlag;

}
