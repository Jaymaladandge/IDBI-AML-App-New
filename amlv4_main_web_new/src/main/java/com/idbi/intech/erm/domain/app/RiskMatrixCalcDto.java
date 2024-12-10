package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class RiskMatrixCalcDto {

	private String matrixId;
	private String riskId;
	private String impactRatingScale;
	private String impactValue;
	private String likelihoodRatingScale;
	private String likelihoodValue;
	private String assessmentRatingScale;
	private String assessmentValue;
	private String assessmentDate;
	private String assessmentStatus;
	private String makerId;
	private Date makerTimestamp;
	private String checkerId;
	private Date checkerTimestamp;
	private String approverId;
	private Date approverTimestamp;

	private String colorCode;
	private String statusColor;
	private String userName;
	private String officeType;
	private String officeId;

	private ResidualAssessmentDto residualAssDto;
	private String startAssessmentDate;
	private String endAssessmentDate;
	private String impactLikelihoodMatrix;

	private String cntrlEffectiveness;
	private String residualAss;
	private String residuaColCode;

	private String officeLink;
	private String deptId;
	private List<OfficeMasterDto> officeIdList;
}
