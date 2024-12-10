package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for ModuleDeptThresholdEntity Entity
 * 
 *
 */
@Data
public class ModuleDeptThresholdDto {

	private String deptThresholdId;
	private String deptLinkId;
	private String deptThresholdType;
	private String asstType;
	private String asstTypeDesc;
	private String deptThresholdValue;
	private String deptThreshValue;
	private String deptRecordStatus;
	private String officeType;
	private String bgClass;
	private List<AsstTypeDto> asstTypeDtos;
	
}
