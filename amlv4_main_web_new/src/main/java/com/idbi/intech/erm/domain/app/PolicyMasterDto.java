package com.idbi.intech.erm.domain.app;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class PolicyMasterDto {

	private String policyId;
	private String noOfPolicy;
	private String firstPremiumIncome;
	private String weightage;
	private String officeId;
	private String officeType;
	private String officeCode;
	private String deptId;
	private String makerId;
	private Date makerTimestamp;
	private ArrayList<PolicyMasterDto> listFileDetails;
	private String tableOutput;
	
	//private List<PolicyMasterDto> filedetails;
	private ArrayList<FileMasterDto> fileUploadDetails;
	private List<PolicyMasterDto> listofFileDetails;
	private List<FileMasterDto> fileDetails;
	
	private String fileId;
	private String uploadTimestamp;
	private String moduleId;
	private String moduleName;
	
	private String recordId;
	private String actionName;
	private String userName;
	private UserDto user;
	private UserDto userId;
	
}
