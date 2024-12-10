package com.idbi.intech.aml.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class RequestDumpMasterDto {
	
	private String recordId;
	private String requestId;
	private String paramKey;
	private String paramValue;
	private List<String> filterListNew;

}
