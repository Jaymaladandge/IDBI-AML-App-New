package com.idbi.intech.oms.domain.app;

import lombok.Data;

@Data
public class AMLCustPhoneEmailDto {
	
	private String custId;
	private String phoneNoLocalCode;
	private String phoneEmailType;
	private String phoneOrEmail;
	private String email;
	private String preferredFlag;
	private String tmDate;

} 
