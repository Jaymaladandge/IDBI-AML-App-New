package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for Comment_Master Entity
 * 
 * @author Omkar
 *
 */
@Data
public class CodeMasterDto {
	private String codeSno;
	private String codeId;
	private String codeValue;
	private String codeValueDesc;
	private String codeName;
	private String flg;
	private String codeResponse;
	private List<CodeMasterDto> codeMasterList;
	private List<CodeMasterDto> moduleNameList;
	private List<CodeMasterDto> actionList;
	private List<CodeMasterDto> workflowOfficetypeList;
	private List<String> alertstatusList;
	private List<String> strStatusList;
	
}
