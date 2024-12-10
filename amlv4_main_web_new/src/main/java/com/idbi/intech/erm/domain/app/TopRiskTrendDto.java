package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class TopRiskTrendDto {
	private String deptName;
	private String asstPeriod1Result;
	private String result1;
	private String result1BgColor;
	private String asstPeriod2Result;
	private String result2;
	private String result2BgColor;
	private String trend;
}
