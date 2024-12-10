package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class EddQuestionMapperDto {

	private String testQuetionId;
	private String testId;
	private String question;
	private String questionWeightage;
	private String options;
	private String optionWeightage;
	private String questionType;
	private String correctAnswer;
	private String uploadBy;
	private String uploadTimestamp;
	private String lastModifiedby;
	private String lastModifiedTimestamp;
	private String status;
	private String recordAction;
	private String lastRecordAction;

}
