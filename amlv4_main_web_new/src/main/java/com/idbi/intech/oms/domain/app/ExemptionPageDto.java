package com.idbi.intech.oms.domain.app;

import java.util.Date;
import java.util.List;

import com.idbi.intech.erm.domain.app.UserDto;

import lombok.Data;

@Data
public class ExemptionPageDto {
	
	private String accountNumber; 
	private String accountName;
	private String custId;
	private String schemeCode;
	private String ruleId;
	private String startdate; 
	private List<String> ruleIdSelectedList;
	private String enddate;
	private List<String> ruleList;
	private String acid;
	private String acc;
	private String schm_id;
	private String makerId;
	private Date makerTimestamp;
	private String checkerId;
	private Date checkerTimestamp;
	private String recordStatus;
	private String recordId;
	private String actRoleId;
	private String userPosition;
	private UserDto userDto;
	private String docSearchParam;
	private String docSearchValue;
	private List<ExemptionPageDto>exemptionpageDtolist;
	
}