package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class AlertCommentDto {

	private String alertId;
	private String userComment;
	private String userId;
	private String userName;
	private String roleId;
	private String action;
	private String tat;
	private Date commentTime;
	private List<AlertCommentDto> commentList;
	private String version;
}