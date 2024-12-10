package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for mark_cust_data Entity
 * 
 * @author Omkar
 *
 */
@Data
public class MarkCustDataDto {
	private String recordId;
	private String alertAggFlg;
	private String alertAggVal;
	private String status;
	private String markedBy;
	private String unMarkedBy;
	private String markedComment;
	private String unMarkedComment;
	private Date markedDate;
	private Date unMarkedDate;
}
