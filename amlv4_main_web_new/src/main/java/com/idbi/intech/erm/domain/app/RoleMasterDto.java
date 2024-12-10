package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class RoleMasterDto {
		
	private String roleId;
	private String roleDept;
	private String rolePosition;
	private String statusFlg;
	private String roleName;
	private Date makerTimestamp;
	private String makerId;
	private String checkerId;
	private Date checkerTimestamp;
	private String menuJson;
	private String roleOfficeType;
	private CommentDto commentDto;
	private String userDept;
	private List<FileMasterDto> filedetails;
	private String searchParam;
	private String searchValue;
	private String sortValue;
	private List<RoleMasterDto> roleList;
	private String userName;
	private String statusFlgOld;
	private ActivityLogDto activityLogDto;
	private String userRole;
	private List<RoleMasterDto> rolePositionList;
	private String sourceName;
	private String requestStatus;
	private String menuArr;
	private String subMenuArr;
	private String roleStatus;
	private List<MenuDto> menus;
	private String roleCategory;
	private String menuActionArray;
	private String subMenuActionArray;
	private String roleCategoryId;
	private String roleActionName;
	private UserDto user;
	private String roleActionStatus;
	private String menuAction;
	private String subMenuAction;
	private String departmentId;
	private List<String> roleNames;
	private String moduleCode; 
	private String roleOfcAvailability;
	private String defaultAccessFlg;

}





