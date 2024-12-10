package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Data;

@Data
public class FeedbackDto {
	private String feedbackId;
	private String feedbackSubject;
	private String feedbackDescription;
	private String officeId;
	private String deptId;
	private String recordStatus;
	private String remark;
	private String makerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date makerTimestamp;
	private String checkerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date checkerTimestamp;
	private String approverId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date approverTimestamp;
	private String deptName;
	private String officeName;
	private List<FeedbackDto> feedbackDtoList;
	private UserDto userDto;
	private String officeCode;
	private List<OfficeMasterDto> officeCodeList;
	private List<OfficeMasterDto> officeNameList;
	private String selectedOfficeType;
	private List<DepartmentMasterDto> deptList;
	private String fileName;
	private Double fileSize;
	private String uploadedBy;
	private String uploadedDate;
	private List<UserDto> documentList;
	private List<FileMasterDto> filedetails;
	private String officeTagId;
	private String searchParam;
	private String searchValue;
	private String sortValue;

}
