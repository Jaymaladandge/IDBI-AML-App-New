package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class EmailDetailsDto {

	private String emailId;
	private String emailPassword;
	private String smtpServer;
	private String port;
	private List<String> supportMailIds;
	private List<String> itTeamMailIds;
	private List<String> ermTeamMailIds;
	private String Id;
	private String emailTo;
	private String Message;
	private String moduleId;
	private String emailStatus;
	private String makerId;
	private Date makerTimestamp;
	private String subject;
	private String emailCC;
	private String emailFrom;
	private List<EmailDetailsDto> emailDtoList;
	private boolean emailFlag;
	private List<String> emailCredentialsList;
	private String userName;
	private String password;
}
