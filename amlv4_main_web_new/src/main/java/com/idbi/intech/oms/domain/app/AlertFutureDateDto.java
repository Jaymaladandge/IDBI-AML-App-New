package com.idbi.intech.oms.domain.app;

import lombok.Data;

@Data
public class AlertFutureDateDto {

	private String recordId;
	private String ruleId;
	private String key;
	private String value;
	private String futureDate;
	private String makerId;
	private String makerTimestamp;
}
