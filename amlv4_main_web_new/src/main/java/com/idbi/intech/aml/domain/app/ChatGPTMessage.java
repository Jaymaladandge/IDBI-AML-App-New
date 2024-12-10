package com.idbi.intech.aml.domain.app;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ChatGPTMessage {

	private String role;
	private String content;  
}
