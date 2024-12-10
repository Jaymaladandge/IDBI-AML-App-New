package com.idbi.intech.aml.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class DmatClientDto {
	private String custId;
	private String id;
	private String shortName;
	private String firstHolderName;
	private String dpmClientId;
	List<DmatClientDto> clientList;
	List<String> dpmClientIdList;
}
