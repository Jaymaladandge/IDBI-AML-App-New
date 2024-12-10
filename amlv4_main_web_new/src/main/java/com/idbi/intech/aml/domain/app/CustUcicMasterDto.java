package com.idbi.intech.aml.domain.app;

import java.util.Date;

import lombok.Data;

@Data
public class CustUcicMasterDto {

	private String custId;
	private String ucicNo;
	private String delFlg;
	private Date recUploadDt;
	private String custName;
}