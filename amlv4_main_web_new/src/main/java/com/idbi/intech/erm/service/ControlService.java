package com.idbi.intech.erm.service;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idbi.intech.erm.domain.app.ControlLibraryDto;

public interface ControlService {

	ControlLibraryDto fetchDetails(ControlLibraryDto controlDto)
			throws JsonParseException, JsonMappingException, IOException;

}
