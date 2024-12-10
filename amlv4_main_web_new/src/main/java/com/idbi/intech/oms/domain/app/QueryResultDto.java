package com.idbi.intech.oms.domain.app;

import lombok.Data;

@Data
public class QueryResultDto {
	
	public String query;
	public String result;
	public String queryType;
	public String errorMassage;
	public String dataSource;
	public String headerValues;
	public String procedureName;
}
