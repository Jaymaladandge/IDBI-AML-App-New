package com.idbi.intech.oms.domain.app;

import com.idbi.intech.erm.domain.app.UserDto;

import lombok.Data;

@Data
public class VerticalExcelExportDto {
	
	private String vertical;
	private String l30days;
	private String g30l45days;
	private String g45days;
	private String verification;
	private String close;
	private UserDto userDto;
	

}
