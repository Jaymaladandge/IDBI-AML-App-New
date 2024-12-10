package com.idbi.intech.erm.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idbi.intech.erm.domain.app.BenchmarkValueCaptureDto;
import com.idbi.intech.erm.domain.app.ModuleValueCaptureDto;
import com.idbi.intech.erm.domain.app.NotificationDto;
import com.idbi.intech.erm.domain.app.TopRiskMasterDto;
import com.idbi.intech.erm.domain.app.User;

public interface KeyRiskMasterService {
	public ByteArrayInputStream exportReportWithImage(List<NotificationDto> ntfDtoList,User user,String AssessmentPeriod)
			throws JsonParseException, JsonMappingException, IOException;
	//exportReportWithImageCaptureBMData
	public ByteArrayInputStream exportReportWithImageCaptureBMData(List<BenchmarkValueCaptureDto> ntfDtoList,User user,String AssessmentPeriod)
			throws JsonParseException, JsonMappingException, IOException;
	public ByteArrayInputStream exportTopriskReportData(List<TopRiskMasterDto> trmDtoList,User user,String AssessmentPeriod)
			throws JsonParseException, JsonMappingException, IOException;
	//exportValueCapturePendingForVerificationWithImage
	public ByteArrayInputStream exportValueCapturePendingForVerificationWithImage(List<ModuleValueCaptureDto> mvcDtoList,User user,String AssessmentPeriod)
			throws JsonParseException, JsonMappingException, IOException;
	//exportTopriskReportModeloData
	public ByteArrayInputStream exportTopriskReportModelData(TopRiskMasterDto tpMasterDto,User user,String AssessmentPeriod)
			throws JsonParseException, JsonMappingException, IOException;
}
