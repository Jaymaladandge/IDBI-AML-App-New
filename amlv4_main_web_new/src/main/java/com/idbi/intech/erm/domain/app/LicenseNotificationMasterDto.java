package com.idbi.intech.erm.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class LicenseNotificationMasterDto {

	// private String licnNtfId;
	private String licenseId;
	private String licnNtfTitle;
	private String licnNtfModule;
	private Date ntf15Day;
	private Date licnExpNtfDate;
	private Date ntf7Day;
	private String ntfMakerId;
	private String ntfMakerTimstamp;
	private String ntfCheckerId;
	private String ntfCheckerTimestamp;
}