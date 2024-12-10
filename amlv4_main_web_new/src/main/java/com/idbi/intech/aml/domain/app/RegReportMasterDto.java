package com.idbi.intech.aml.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class RegReportMasterDto {
	private List<RegReportAnalysisFinalDto> regReportFinalList;

	private RegReportAnalysisFinalDto regReportFinal;

	private List<RegReportAnalysisDto> regReportList;

	private RegReportAnalysisDto regReport;
}
