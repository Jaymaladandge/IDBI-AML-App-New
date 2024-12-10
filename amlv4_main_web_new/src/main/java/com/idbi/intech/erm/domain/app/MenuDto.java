package com.idbi.intech.erm.domain.app;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for Menu_Master Entity
 * 
 * 
 *
 */

@Data
public class MenuDto {

	private String menuId;
	private String menuName;
	private String moduleName;
	private String menuStatus; 				// A / I
	private String menuRecordStatus;		// A / D / R / E
	private String actionStatus;			// CR / AR / ER / XR
	private Date checkerTimestamp;
	private Date makerTimestamp;
	private String makerId;
	private String checkerId;
	private String menuOrder;
	private String actionPath;
	private List<SubMenuDto> subMenus;
	private String menuType;
	private List<FileMasterDto> filedetailsList;
	private List<String> menuAction;
	private String checkFlg;

	private String userName;
	private String searchParam;
	private String searchValue;
	private String sortValue;
	private List<MenuDto> menuList;
	private CommentDto commentDto;
	private String userDept;
	private String sourceName;
	private String requestStatus;
	private String menuStatusOld;
	private ActivityLogDto activityLogDto;
	private String userRole;
	private String moduleCode;
	HashMap<String,ArrayList<String>> ButtonMenuList=new HashMap<String,ArrayList<String>>();
	
	private UserDto userDto;
	private String actionName;
}
