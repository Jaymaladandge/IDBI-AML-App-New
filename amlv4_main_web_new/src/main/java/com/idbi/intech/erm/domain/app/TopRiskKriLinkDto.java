package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for top_risk_kri_link Entity
 * 
 * @author Akshay
 *
 */
@Data
public class TopRiskKriLinkDto {

	private String topRiskKriLinkId;
	private String deptLinkId;
	private String kriId;
	private int kriWeightage;
	private String recordStatus;
	private Date recordCreDate;
	private String kriName;
	private List<ModuleDeptThresholdDto> mdtlist;
	private String kriUpdateFrequency;
	
}
