package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class ResidualAssessmentDto {

	private String residualAssessmentId;
	private String controlAssessmentId;
	private String controlId;
	private String controlAssessmentValue;
	private String justificationForRating;
	private String compensatingControl;
	private String improvementAreas;
	private String riskAssessmentId;
	private String riskId;
	private String riskAssessmentValue;
	private String residualAssessmentValue;
	private String residualAssessmentDate;
	private String residualAssessmentStatus;
	private String officeId;
	private String officeType;
	private String statusFlg;
	private String makerId;
	private Date makerTimestamp;
	private String checkerId;
	private Date checkerTimestamp;

	private String listRiskId;
	private String userRole;
	private List<FileMasterDto> filedetailsList;
	private String justifyForOverRidding;
	private String reportingOfficeCode;
	
	private String controlAssessmentValueCol;
	private String riskAssessmentValueCol;
	private String residualAssessmentValueCol;
	private String residualResult;
	private String residualResultVal;
	private String assessmentCol;
	
	private RiskMatrixCalcDto riskMatrixCalcDto;
	private String residualMatrix;
	
	private String officeLink;
	private String deptId;
	private List<OfficeMasterDto> officeIdList;

}
