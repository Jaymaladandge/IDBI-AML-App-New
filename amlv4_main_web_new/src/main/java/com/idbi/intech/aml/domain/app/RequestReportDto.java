package com.idbi.intech.aml.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class RequestReportDto {
	String requestId;
	String user;
	String role;
	String reportType;
	String year;
	String month;
	String request_Date;
	String status;
	List<String> yearList;
	List<String> monthList;
	String userPosition;
	Boolean reportExists;
	List<RequestReportDto> dtoList;
	

}
