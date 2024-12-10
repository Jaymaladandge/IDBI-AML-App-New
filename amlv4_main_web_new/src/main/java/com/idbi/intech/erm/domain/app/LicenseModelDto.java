package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class LicenseModelDto {

	private String licenseid;
	private String domainid;
	private String productname;
	private String licenseuploaddate;
	private String activationdate;
	private String warrenty;
	private String amcstartdate;
	private String amcfreq;
	private String amcexpdate;
	private String licensestatus;
	private String makerid;
	private String makertimestamp;
	private String checkerid;
	private String checkertimestamp;
	
	private List<FileMasterDto> filedetailsList;
}
