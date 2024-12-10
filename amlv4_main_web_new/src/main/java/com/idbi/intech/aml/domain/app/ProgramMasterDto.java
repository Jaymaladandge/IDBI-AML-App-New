package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class ProgramMasterDto {
	private String programId;
	private String programName;
	private String programDesc;
	private String percentageWatch;

	private String recordAction;
	private String uploadBy;
	private String uploadDate;
	private String makerTimeStamp;
	private String lastModifiedTimeStamp;
	private String startDate;
	private String endDate;
	private String isTestConducted;
	private String isCertificateRequired;
	private String codeValueDesc;
	private String lastModifiedBy;
	private String documentId;
	private String documentTittle;
	private String docDesc;
	private String minPercentageWatch;
	private String category;
	private String count;
	private String technicalCount;
	private String functionalCount;
	private String personalDevlopmentCount;
	private String softSkillCount;
	private String totalPrograms;
	private String activePrograms;
	private String inactivePrograms;
	private String addCategoryCount;

	private String testId;
	private String grade;
	private String accessibility;
	private String programClassification;

	private String notificationStatus;

	private String paramKey;
	private String paramValue;
	private String programCategory;

	private String officeLevels;
	private String programDuration;

	private String assignedCategory;
	private String subCategory;

	private Date sDate;
	private Date eDate;

	private String searchParam;
	private String searchValue;
	private String programValidity;

	private List<BranchEddMasterDto> testBeanList;
	private String actionName;
	private String makerId;

	private String userId;
	private String docType = null;
	public String systemGenFileName;
	private List<ProgramMasterDto> progList;

	public String message;
	private boolean flag;
	private String createdBy;
	private String createdTimestamp;
}
