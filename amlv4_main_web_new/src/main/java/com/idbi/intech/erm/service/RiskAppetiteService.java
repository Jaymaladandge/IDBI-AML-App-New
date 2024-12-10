package com.idbi.intech.erm.service;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idbi.intech.erm.domain.app.RiskAppetiteMasterDto;

public interface RiskAppetiteService {

	public RiskAppetiteMasterDto fetchDetails(RiskAppetiteMasterDto riskAppDto) throws JsonParseException, JsonMappingException, IOException;
}
