package com.idbi.intech.erm.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idbi.intech.erm.domain.app.ControlIndexGraphDto;
import com.idbi.intech.erm.domain.app.NotificationDto;
import com.idbi.intech.erm.domain.app.RiskLibraryMasterDto;
import com.idbi.intech.erm.domain.app.RiskRegisterDto;
import com.idbi.intech.erm.domain.app.User;

public interface RiskLibraryService {

	public ByteArrayInputStream exportRegisterWithImage(RiskRegisterDto riskAppDto)
			throws JsonParseException, JsonMappingException, IOException;

	public ByteArrayInputStream exportClassificationReport(RiskRegisterDto riskAppDto)
			throws JsonParseException, JsonMappingException, IOException;

	public ByteArrayInputStream exportReportWithImage(List<NotificationDto> ntfDtoList, User user,
			String AssessmentPeriod) throws JsonParseException, JsonMappingException, IOException;

	public ByteArrayInputStream exportControlIndexReport(ControlIndexGraphDto cntrlIndexDto)
			throws JsonParseException, JsonMappingException, IOException;
	
	public ByteArrayInputStream exportComparisionReport(ControlIndexGraphDto cntrlIndexDto)
			throws JsonParseException, JsonMappingException, IOException;
	
	// exportHighResidualAndSevereInherent
	public ByteArrayInputStream exportHighResidualAndSevereInherent(RiskLibraryMasterDto riskLibraryDto)
			throws JsonParseException, JsonMappingException, IOException;
	
	public ByteArrayInputStream exportHighResidualAndSevereInherentRisk(RiskRegisterDto riskLibraryDto,String AssessmentPeriod,User user)
			throws JsonParseException, JsonMappingException, IOException;
	
	public ByteArrayInputStream exportClassificationInherentReport(RiskRegisterDto riskAppDto)
			throws JsonParseException, JsonMappingException, IOException;

}
