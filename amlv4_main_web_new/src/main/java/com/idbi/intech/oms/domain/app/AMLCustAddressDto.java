package com.idbi.intech.oms.domain.app;

import lombok.Data;

@Data
public class AMLCustAddressDto {

	private String custId;
	private String addressLine1;
	private String addressLine2;
	private String city;
	private String state;
	private String zip;
	private String country; 
	private String addressCategory;
	private String preferredAddress;
	private String tmDate;
	private String spanClass;
}
