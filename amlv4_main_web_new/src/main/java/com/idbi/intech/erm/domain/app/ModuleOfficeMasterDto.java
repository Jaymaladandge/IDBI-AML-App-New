package com.idbi.intech.erm.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class ModuleOfficeMasterDto {

	private String modOffLinkId;
	private String moduleName;
	private String moduleId;
	private String officeType;
	private Integer officeWeightage;
	private String officeModuleRemark;
	private String recordAction;
	private String recordStatus;
	private Date recordCreateDate;
	private Date recordLastChangeDate;
	private String recordActionUser;
	
	private boolean flg;
	private String officeShortName;
}
