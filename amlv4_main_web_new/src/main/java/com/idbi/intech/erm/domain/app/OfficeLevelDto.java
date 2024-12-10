package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class OfficeLevelDto {
	
	private String dept;
	private List<ControlDescDto> officeCheckValue;
	private List<ControlDescDto> officeDescValue;

}
