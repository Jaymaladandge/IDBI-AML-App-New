package com.idbi.intech.aml.domain.app;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for Alert Status
 * 
 * @author Omkar
 *
 */
@Data
public class AlertStatusDto {
	private String status;
	private String cnt;
	private String flg;
	private String statusDesc;
	private String bgClass;
	private String symbol;
	private int alertCnt;
}
