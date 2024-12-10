package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class ModuleMasterDto {
	private String moduleId;
	private String moduleName;
	private String moduleCode;
	private String productName;
	private String moduleColorCode;
	private Integer moduleSeq;
	private String applicationUrl;

	private List<ModuleMasterDto> productList;
}
