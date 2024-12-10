package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer.
 *
 */
@Data
public class ValueCaptureDto {
	private String kriId;
	private String kriName;
	private String deptProvidingData;
	private String kriDataType;
	private String kriDataSource;
	private String kriThresholdDescription;
	private String kriUpdateFrequency;
	private String kriRecordStatus;
	private String kriFormula;
	private String kriBenchmark;
	private String kriBenchmarkValue;
	private List<ModuleDeptMasterDto> mdmDtoList;
	private List<ModuleValueCaptureDto> mvcDtoList;
	private List<FileMasterDto> filedetails;
	private String sourceId;
	private String stmtName;
	private String toleranceThreshold;
	private String userName;
	private String startDate;
	private String endDate;
	private String kriValueDesc;
	}
