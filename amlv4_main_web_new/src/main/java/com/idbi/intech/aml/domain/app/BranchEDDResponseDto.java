package com.idbi.intech.aml.domain.app;

import java.util.List;

import com.idbi.intech.erm.domain.app.FileMasterDto;
import com.idbi.intech.erm.domain.app.UserDto;

import lombok.Data;

@Data
public class BranchEDDResponseDto {

	private String testQuetionId;
	private String testId;
	private String question;
	private String questionAns;
	private String requestId;
	private List<BranchEDDResponseDto> eddResponceList;
	private String filedetailsEncryptedStr;
	private UserDto userDto;
	private List<FileMasterDto> fileList;
	private String eventAction;
	private String previousEventAction;
	private String actionEvent;
	private List<EDDBranchRequestMasterDto> requestList;
}
