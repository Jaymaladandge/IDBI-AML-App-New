package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RiskRegisterDto {

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
	private String riskActionStatus;
	private String riskStatus;
	private String makerId;
	private Date makerTimestamp;
	private String riskDept;

	private String financeImpact;
	private String probRiskEvent;
	private String severityLevel;

	private String controlId;
	private String controlFunction;
	private String controlName;
	private String controlDept;
	private String controlDescription;
	private String controlDescCO;
	private String controlDescZO;
	private String controlDescDO;
	private String controlDescBO;

	private String centralOfc;
	private String zonalOfc;
	private String divisionalOfc;
	private String branchOfc;

	private Date cntrlMakerTimestamp;
	private String cntrlMakerId;

	private String cntrlEffectiveness;
	private String residualRiskRating;
	private String cntrlOwner;

	private List<RiskRegisterDto> registerList;

	private String recordStatusCol;
	private String inherentRiskStatusCol;
	private String controlEffectivenessCol;
	private String residualRiskCol;

	private List<FileMasterDto> filedetailsList;
	private RiskMatrixCalcDto matrixCalcDto; // Final Record Saving Table DTO
	private List<RiskMatrixCalcDto> matrixCalcList;
	private List<ModuleOfficeMasterDto> momOffList;
	private List<ControlLibraryDto> controlList;
	private String controlAssessmentFreq;
	private List<ResidualAssessmentDto> residualList;
	private String userName;
	private List<ActionPlanMasterDto> actionPlanList;

	private String searchParam;
	private String searchValue;
	private String sortValue;

	private String userRole;
	private String officeType;
	private String userDept;

	private String startDate;
	private String endDate;

	private String controlGaps;
	private String interDeparmentDependencies;

	private int srNo;

	private List<ImpactRatingDto> impactRatingScaleList; // Impact Rating Scale Parameters List
	private List<LikelihoodRatingDto> likelihoodRatingList; // Likelihood Rating Scale Parameters List
	private List<ControlEffectiveDto> cntrlEffectiveDto;

	private String inherentAssCapFlg;
	private ImpactRatingDto selectedImpact;
	private LikelihoodRatingDto selectedLikelihood;
	private ControlEffectiveDto selectedControlEffectiveDto;

	private String pageName;
	private List<ControlAggregationDto> cntrlAggDtoList;
	private String officeId;
	private String defaultDept;
	private boolean isSuperDept;

	private String assessmentPeriod;
	private String assessmentCategory;
	private String selectedAssessmentStatus;
	private String selectOfficeType;
	private String selectedDept;
	private String selectedOfcCode;

	private String registerDate;
	private List<RiskBizzTabDto> riskBizzDtoList;
	private String ofcCode;
	private String deptId;
	private String deptName;
	private int totalNoRisk;
	private List<String> riskCategoryList;
	private List<String> classificationCountList;
	private List<RiskCategoryDto> riskCatDtoList;

	private UserDto userDto;
	private String reportDate;
	private String reportExtractedDate;

	private int currHigh;
	private int prevHigh;

	private int currMedium;
	private int prevMedium;

	private int currLow;
	private int prevLow;

	private String previousAssDate;
	private String currentAssDate;

	private String selectedAssessmentPeriod;
	private String selectedAssessmentPeriod2;
	private String registerOfcCode;
	private List<String> assessmentList;

	private String corporationalOfc;
	private String corporationalAssPeriod;
	private int corporationalTotalNoRisk;
	private Integer corporationSevereCount;
	private Integer corporationPartialEffectiveCount;
	private Integer corporationIneffectiveCount;
	private double corporationEffectivenessOfContrl;
	private double corporationContrlEffectivenessIndex;
	private List<RiskRegisterDto> corporationList;
	private List<RiskCategoryDto> riskCatDtoListForDept;
	private boolean corporationView;

	private int currentRiskCount;
	private int prviousRiskCount;
	private String selectedOfficeId;
	private String riskStatusColor;
	private List<String> registerStatusList;
}
