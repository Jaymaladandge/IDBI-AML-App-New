package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class BranchEddMasterDto {

	private String testId;
	private String testInstruction;
	private String testDescription;
	private String uploadBy;
	private Date uploadTimestamp;
	private String lastModifiedby;
	private String status;
	private String lastModifiedTimestamp;
	private String lastModifiedAction;
	private String testAssignedCategory;
	private String eddRole;
	private String testAssignedSubCategory;
	private List<BranchEddMasterDto> testList;
	private List<String> categoryList;
	private List<String> subCategoryList;
	private List<EddQuestionMapperDto> queList;
	private String makerRole;
	private List<String> roleList;
	private List<String> actionList;
	private String actionRole;
	private String module;
	private String eddRoleAction;
	private String currentRole;
	private List<BranchMasterDto> branchList;
	private String eddType;
	private String custId;
	private String currentAction;
	private String comment;
	private String msg;
	private String searchParam;
	private String searchValue;
}
