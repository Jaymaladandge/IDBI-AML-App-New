package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class RiskLibraryMasterDto {
	private String riskId;   
	private String riskFunction;
	private String riskName;
	private String rootCauseOrTrigger;
	private String riskDescription;
	private String keyMitigationMeasures;
	private String riskImpact;
	private String riskAssessmentFreq;
	private String riskClassification;
	private String subRiskClassification;
	private String riskActionStatus;	// AR / CR / VR / ER
	private String riskStatus; 			// E / D / O
	private String makerId;
	private Date makerTimestamp;
	private String checkerId;
	private Date checkerTimestamp;
	private String approverId;
	private Date approverTimestamp;
	
	private String userName;
	private String riskDept;
	private List<FileMasterDto> filedetailsList;
	private String riskActionName;
	private String officesIdList;
	private String controlIdList;
	private String userDept;
	private List<RiskControlLinkDto> riskCntrlLinkList;
	private List<ModuleOfficeMasterDto> momOffList;
	private String sourceName;
	private String riskActionStatusOld;
	private UserDto user;
	private CommentDto commentDto;
	private ActivityLogDto activityLogDto;
	private String userRole;
	private List<ControlLibraryDto> controlDtoList;
	
	private String searchParam;
	private String searchValue;
	private String sortValue;
	private String officeType;
	private String riskStatusColor;
	private String warningColor;
	private List<RiskLibraryMasterDto> listRiskLibDto;
	
	private List<ImpactRatingDto> impactRatingScaleList;			// Impact Rating Scale Parameters List
	private List<LikelihoodRatingDto> likelihoodRatingList;			// Likelihood Rating Scale Parameters List
	private List<ImpactLikelihoodMatrixDto> likeImpactMatrixList;	// Impact-Likelihood Rating Scale Parameters List
	private ImpactLikelihoodMatrixDto likeImpactMatrix;				// Impact-Likelihood Rating Scale Parameters Dto
	private String impactRating;
	private String likelihoodRating;
	
	private RiskMatrixCalcDto matrixCalcDto;	// Final Record Saving Table DTO
	private List<RiskMatrixCalcDto> matrixCalcList;
	private List<String> riskClassList;
	private List<String> subRiskList;
	
	private String controlId;
	private List<String> riskImpactList;
	private List<String> trendData;
	
	private ResidualAssessmentDto residualAssDto;
	private List<String> pieData;
	List<String> ragWithColour;
	private List<String> deptNameList;
	private String deptName;
	private String ermDeptId;
	
	private String inherentRiskAssessment;
	private String cntrlEffectiveness;
	private String requestStatus;
	private String userOfficeId;
	
	private ControlLibraryDto cntrlLibraryDto;
	private String officeId;
	private String actionName;
	private String concatAsessmentPeriod;
	
	private List<ActionPlanMasterDto> actionPlanList;
	private ActionPlanMasterDto actionPlanDto;
	private String additionalActionPlan;
	private String controlGaps;
	private ControlLibraryDto ctrlDto;
	
	private List<RiskBizzTabDto> riskBizzTabList;
	private List<KeyMitigationPlanDto> keyMitigationList;
	private String assessmentDate;
	private String selectedDept;
	private String selectedAssessmentPeriod;
	private String selectedOfficeCode;
	private String selectedOfficeType;
	private int srNo;
	
	private List<RiskLibraryMasterDto> riskLibDtoList;
	private List<OfficeMasterDto> officeDtoList;
	private List<RiskBizzTabDto> bizzDtoList;
	private String bizzRecordId;
	private String riskAssessmentValue;
	private String residualAssessmentValue;
	private String filterCode;
	
	private List<OfficeMasterDto> officeCodeList;
	private List<DepartmentMasterDto> deptList;
	
	private String reportDate;
	private String reportExtractedDate;
	private UserDto userDto;
	
	private String selectedOfficeId;
	private boolean sendNotification;
	private String makerDept;
	private List<String> imactList;
	private String officeName;
}
