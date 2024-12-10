package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for kri_manual_tab Entity
 * 
 * @author Akshay
 *
 */
@Data
public class GraphMasterDto {
	
	private String graphId;
	private String graphName;
	private String graphModule;
	private String graphOfficeType;
	private String graphDescription;
	private String graphActionPath;
	private String graphType;
	private String graphStatus;
	private UserDto user;
	private List<GraphMasterDto> graphDtoList;

}

