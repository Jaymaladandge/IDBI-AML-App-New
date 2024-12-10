package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class FileMasterDto {
	
	private String fileId;
	private String uploadTimestamp;
	private String moduleId;
	private String moduleName;
	private String uploadedBy;
	private String fileName;
	private String fileType;
	private Double fileSize;
	private String fileStatus;
	private String documentDesc;
	private String referanceId;
	private List<FileMasterDto> fileDtoList;

}
