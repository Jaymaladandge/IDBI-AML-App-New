package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class OtpGerneratorDto {
	private String otpCode;
	private String otpMessage;
	private String otpId;
	private String emailId;
	private String otpRequestStatus;
	private String otpSource;
	private String userDept;
	private boolean hrmsFlg;
	private String officeCode;
	private String userOfficeType;

}
