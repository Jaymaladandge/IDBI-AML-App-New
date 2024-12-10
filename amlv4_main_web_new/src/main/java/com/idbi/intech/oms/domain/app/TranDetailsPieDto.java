package com.idbi.intech.oms.domain.app;

import java.util.HashMap;
import java.util.List;

import lombok.Data;

@Data
public class TranDetailsPieDto {

	private String tranType;
	private String acid;
	private String idType;
	private String custId;
	private List<Double> tranTypeList;
	private HashMap<String, Double> tranDetails;
}
