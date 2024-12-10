package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import lombok.Data;

@Data
public class ControlIndexGraphDto {

	private Integer noRecordPresent;

	private String userDept;
	private String userOfc;
	private String userId;
	private String userRole;

	private List<ControlIndexGraphDto> contrlIndexList;
	private Date startDate;
	private Date endDate;

	private Integer low;
	private Integer medium;
	private Integer high;

	private String officeId;
	private String officeCode;
	private List<String> assessmentPeriodList;

	private String searchParameter;
	private String searchValue;
	private Integer minor;
	private Integer moderate;
	private Integer severe;

	private Integer minor2;
	private Integer moderate2;
	private Integer severe2;

	private String deptId;
	private String selectedOfficeType;
	private String selectedDept;
	private String userOfficeType;
	private String selectedOfficeCode;
	private String assessmentCategory;

	private Integer low2;
	private Integer medium2;
	private Integer high2;

	private String selectedAssessmentPeriod;
	private String selectedAssessmentPeriod2;
	private String deptName;
	private Integer totalNoRisk;
	private Integer prevTotalRisk;

	private Integer effectiveCount;
	private Integer partialEffectiveCount;
	private Integer ineffectiveCount;

	private Integer prevEffectiveCount;
	private Integer prevPartialEffectiveCount;
	private Integer prebIneffectiveCount;

	private double effectivenessOfContrl;
	private double prevEffectivenessOfContrl;

	private double contrlEffectivenessIndex;
	private double prevContrlEffectivenessIndex;
	
	private UserDto userDto;
	private String reportDate;
	private String reportExtractedDate;
	
	
	private String officeType;
	
	private String corporationalOfc;
	private String corporationalAssPeriod;
	private Integer corporationalTotalNoRisk;
	private Integer corporationalTotalNoRiskAssessed;
	private Integer corporationEffectiveCount;
	private Integer corporationPartialEffectiveCount;
	private Integer corporationIneffectiveCount;
	private double corporationEffectivenessOfContrl;
	private double corporationContrlEffectivenessIndex;
	private List<ControlIndexGraphDto> corporationList;
	private String startingDate;
	private String endingDate;
	private String ofcCode;
	private String makerId;
	private List<RiskAssessmentDto> riskAssessmentDtoList;
	
	private Long corporationSevereCount;
	private Long corporationModerateCount;
	private Long corporationMinorCount;

	private Long corporationHighCount;
	private Long corporationMediumCount;
	private Long corporationLowCount;
	private Integer totalNoRiskAssessed1;
	private Integer totalNoRiskAssessed2;
	private String selectedOfficeId;
	private String assesmentStatus;
	HashMap<String, String> riskDetails;
	private String officeName;
}
