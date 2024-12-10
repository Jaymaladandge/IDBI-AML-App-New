package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class EmailDetailsDto {

	private String emailId;
	private String emailPassword;
	private String smtpServer;
	private String port;
	private String id;
	private List<String> emailTo;
	private String message;
	private String moduleId;
	private String emailStatus;
	private String makerId;
	private Date makerTimestamp;
	private String subject;
	private List<String> emailCC;
	private String emailFrom;
	private List<EmailDetailsDto> emailDtoList;
	private boolean emailFlag;
	private List<String> emailCredentialsList;
	private String userName;
	private String password;
	private List<String> userEmailList;
	private List<String> branchEmailList;
	private String brnMailId;
	private String userEmail;
	private String toEmail;
	private String ccEmail;
	private boolean requestStatus;
}
