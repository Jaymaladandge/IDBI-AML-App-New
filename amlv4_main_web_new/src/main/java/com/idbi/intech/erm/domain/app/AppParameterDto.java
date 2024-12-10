package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for App_Parameter Entity.
 * 
 * @author sharath
 *
 */
@Data
public class AppParameterDto {
	private String recordId;
	private String paramId;
	private String paramKey;
	private String paramValue;
	private String paramDesc;
	private String paramMakerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date paramMakerTimeStamp;
	private String paramCheckerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date paramCheckerTimeStamp;
	private Date paramUpdatedTimestamp;
	private String paramStatus;
	private String departmentId;
	private String fileName;
	private Double fileSize;
	private String uploadedBy;
	private Date uploadedDate;
	private List<FileMasterDto> filedetails;
	private List<AppParameterDto> parameterList;
	private String searchParam;
	private String searchValue;
	private String sortValue;
	private String userDept;
	private String paramCategory;
	private HashMap<String,String> parameterValues;
	private String SourceName;
	private ActivityLogDto activityLogDto;
	private CommentDto commentDto;
	private String paramStatusOld;
	private Date createrTime;
	private List<MenuDto> menus;
	private List<String> actionValues;
	private List<AppParameterDto> paramKeyList;
	private String rolePostion;
	private String paramActionName;
	private List<String> parameterNameList;
	private List<String> categoryList;
	private EmailDetailsDto emailDetailsDto;
	private List<FileMasterDto> fileDetails;

}
