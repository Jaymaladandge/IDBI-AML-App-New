package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class InformationNotificationDto {

	private String ntfId;
	private String ntfTitle;
	private String ntfModule;
	private String ntfModuleId;
	private String ntfStatus;
	private String ntfTarget;
	private String targetDept;
	private String targetId;
	private Date ntfStartDate;
	private Date ntfEndDate;
	private String ntfMakerId;
	private Date ntfMakerTimeStamp;
	private String ntfActionStatus;
	private String ntfOfficeType;
	private String ntfOfficeId;
	private String ofcCode;
	
	private List<InformationNotificationDto> ntfInfoList;
	private UserDto userDto;
	private String emailId;
	private String srNo;
	private String srNoList;
	
	private String isInfoNotification;
}
