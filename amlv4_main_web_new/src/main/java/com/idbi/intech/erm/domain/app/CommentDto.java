package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for Comment_Master Entity
 * 
 * @author Akshay
 *
 */
@Data
public class CommentDto {
	private String commentId;
	private String commentTimeStamp;
	private String moduleId;
	private String moduleName;
	private String activityId;
	private String commentBy;
	private String comment;
	private String additionalComments;
	private List<CommentDto> commentList;
}
