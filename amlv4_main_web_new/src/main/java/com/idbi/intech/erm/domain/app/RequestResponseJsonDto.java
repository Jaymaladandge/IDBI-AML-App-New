package com.idbi.intech.erm.domain.app;

import lombok.Data;

@Data
public class RequestResponseJsonDto {
	private String encryptedJson;
	private String sessionKey;
}
