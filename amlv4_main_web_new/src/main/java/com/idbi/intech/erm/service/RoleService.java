package com.idbi.intech.erm.service;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idbi.intech.erm.domain.app.RoleMasterDto;

public interface RoleService {
	
	public RoleMasterDto fetchDetails(RoleMasterDto roleDto) throws JsonParseException, JsonMappingException, IOException;

}
