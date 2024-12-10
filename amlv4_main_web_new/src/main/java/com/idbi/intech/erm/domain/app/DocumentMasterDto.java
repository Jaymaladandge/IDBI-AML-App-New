package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for DocumentMaster Entity.
 *
 */
@Data
public class DocumentMasterDto {

	private String documentId;
	private String documentCategory;
	private String documentDesc;
	private String documentOfficeType;
	private String documentModule;
	private String documentModuleName;
	private String documentDepartment;
	private String documentStartDate;
	private String documentEndDate;
	private String documentNotificationFlg;
	private String documentMakerId;
	private String reasonComment;
	
	
	private String documentMakerTimestamp;
	
	private String documentCheckerId;
	
	private Date documentCheckerTimestamp;
	
	private String documentFileId;
	private String docSearchParam;
	private String docSearchValue;
	private UserDto user;
	private List<DocumentMasterDto> documentDataList;
	private List<DocumentMasterDto> modeleList;
	private List<FileMasterDto> fileDetailsList;
	private String docStatus;
}
