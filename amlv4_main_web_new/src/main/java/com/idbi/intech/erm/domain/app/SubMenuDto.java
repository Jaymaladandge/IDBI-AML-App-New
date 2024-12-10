package com.idbi.intech.erm.domain.app;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for SubMenu_Master Entity
 * 
 * 
 *
 */


@Data
public class SubMenuDto {
	
	private String subMenuId;
	private String subMenuName;
	private String subModuleName;
	private String subMenuStatus;
	private String subMenuMakerTimestamp;
	private String subMenuMakerId;
	private String subMenuCheckerId;
	private String subMenuCheckerTimestamp;
	private String subMenuPath;
	private String subMenuOrder;
	private String menuId;	
	private String subMenuType;
	private List<String> subMenuAction;
	private String checkFlg;
	private String subMenuModuleCode;
	private HashMap<String,ArrayList<String>> ButtonSubmenuList;
}
