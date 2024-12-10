package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class ChatGPTChoice {

	private String index;
	private ChatGPTMessage message;
	private String finish_reason; 
}
