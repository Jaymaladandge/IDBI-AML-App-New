package com.idbi.intech.aml.domain.app;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ChatGPTDto {

	private String id;
	private String object;
	private String created;
	private String model;
	private List<ChatGPTChoice> choices;
	private String question;
	private String respMsg;
	private String chatGtpResponse;
	private String bardGoogleResponse;
	private String chatType;
}
