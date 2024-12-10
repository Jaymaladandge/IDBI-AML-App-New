package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class CustAddressDtlsDto {
	private String recordId;
	    private String custId;
	    private String addressCategory;
	    private String addressLine1;
	    private String addressLine2;
	    private String addressLine3;
	    private String city;
	    private String state;
	    private String zip;
	    private String country;
	    private String preferredAddress;
	    private Date lastUpdateDate;
	    private Date recModifiedDate;
	    private Date recUploadDate;
}
