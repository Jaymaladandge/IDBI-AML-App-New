package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;
@Data
public class RcsaFileUploaderDto {

	private String riskDept;
	private String riskFunction;
	private String riskDescription;
	private String rootCauseOrTrigger;
	private String riskImpact;
	private String riskClassification;
	private String subRiskClassification;
	private String controlDept;
	private String likelihoodRatingScale;
	private String impactRatingScale;
	private String assessmentRatingScale;
	private String controlAssessmentValue;
	private String residualAssessment;
	private String keyMitigationMeasures;
	private String existingContrlDesc;
	private String controlOwner;
	private String centralOffice;
	private String zonalOffice;
	private String divisionalOffice;
	private String branchOffice;
	private String makerId;
	private Date makerTimestamp;
	
	private List<RcsaFileUploaderDto> listFileDetails;
	private String controlGaps;
	private String indeparmentDependencies;
	private String userName;
	private UserDto user;
	private ActivityLogDto activityLogDto;
	
	private int srNO;
	
//	private String riskControlLinkId;
//	private String riskId;
//	private String controlId;
//	private String linkActionStatus;
//	private String recordStatus;
//	private Date recordCreDate;	
//	private String cntrlName;
//	private String cntrlFunName;
//	private String cntrlAssessmentFreq;		
//	private String riskFunction;
//	private String riskName;
//	private String rootCauseOrTrigger;
//	private String riskDescription;
//	private String keyMitigationMeasures;
//	private String riskImpact;
//	private String riskAssessmentFreq;
//	private String riskClassification;
//	private String subRiskClassification;
//	private String riskActionStatus;	
//	private String riskStatus; 			
//	private String makerId;
//	private Date makerTimestamp;
//	private String centralOffice;
//	private String zonalOffice;
//	private String divisionalOffice;
//	private String branchOffice;
//		
//	private String userName;
//	private String riskDept;
//	private String riskActionName;
//	private String officesIdList;
//	private String controlIdList;
//	private String userDept;
//	private String sourceName;
//	private String riskActionStatusOld;
//	private UserDto user;
//	private ActivityLogDto activityLogDto;
//	private String userRole;
//	private String officeType;
//	private String impactRating;
//	private List<String> riskClassList;
//	private List<String> subRiskList;
//	private String controlFunction;
//	private String controlName;
//	private String controlDept;
//	private String controlDescCO;
//	private String controlDescZO;
//	private String controlDescDO;
//	private String controlDescBO;
//	private String controlAssessmentFreq;
//	private String controlStatus;
//	private String controlActionStatus;
//		
//	private String actionStatus;
//	private String actionStatusOld;	
//	private String controlActionStatusOld;
//	
//	
//	private List<RcsaFileUploaderDto> listFileDetails;
//	private String likelihoodRatingScale;
//	private String impactRatingScale;
//	private String assessmentRatingScale;
//	private String controlAssessmentValue;
//	private String actionDescription;
//	
//	private String existingContrlDesc;
//	private String controlOwner;
//	private String residualAssessment;
	
}
