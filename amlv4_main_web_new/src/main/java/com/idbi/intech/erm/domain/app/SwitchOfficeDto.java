package com.idbi.intech.erm.domain.app;

import java.util.HashMap;
import java.util.List;

import lombok.Data;

@Data
public class SwitchOfficeDto {
	private List<String> deptList;
	private List<String> officeTypeList;
	private List<String> officeCodeList;
	private String makerId;
	private String officeType;
	private String officeCode;
	private String department;
	private String userRole;
	private String officeId;
	private String departmentName;
	private String requestStatus;
	private List<String> roleList;
	private String roleName;
	private List<MenuDto> menuList;
	private HashMap<String,List<MenuDto>> menuMapList;
	private List<String> roleNameList;
	private String selectedOfficeType;
	

}
