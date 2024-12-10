package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Data;

/**
 * DTO class for Control Library module
 * @author arnoldanthony
 *
 */
@Data
@JsonInclude(Include.NON_NULL)
public class ControlLibraryDto {
	//Module Specific
		private String controlId;
		private String controlFunction;
		private String controlName;
		private String controlDept;
		private String controlDescCO;
		private String controlDescZO;
		private String controlDescDO;
		private String controlDescBO;
		private String controlAssessmentFreq;
		private String controlStatus;
		private String controlActionStatus;
		private Date makerTimestamp;
		private String makerId;
		private Date checkerTimestamp;
		private String checkerId;
		private String approverId;
		private Date approverTimestamp;
		private String officeType;
		private CommentDto commentDto;
		private UserDto user;
		private ActivityLogDto activityLogDto;
		
		private List<ControlFieldDto> officeSet;
		private List<ControlFieldDto> officeDesc;
		private List<ModuleOfficeMasterDto> moDto;
		private List<ModuleDeptMasterDto> mmDto;
		private List<FileMasterDto> filedetails;
		private List<ControlDescDto> officeCheckValue;
		private List<ControlDescDto> officeDescValue;
		private List<ControlLibraryDto> controlList;
		
		private String searchParam;
		private String searchValue;
		private String sortValue;
		private String userDept;
		private String userName;
		private String actionName; 
		private String sourceName;
		private String actionStatus;
		private String actionStatusOld;
		private String userRole;
		private String requestStatus;
		private String controlActionStatusOld;
		private List<OfficeMasterDto> officeList;
		
		private String controlStatusColor;
		private String warningColor;
		private String riskId;
		private boolean isLinked;
		
		private String startDate;
		private String endDate;
		
		private List<ControlEffectiveDto> cntrlEffectiveDto;
		private List<ControlAggregationDto> cntrlAggDto;
		
		private String controlOwner;
		private String controlGaps;
		private String indeparmentDependencies;
		private List<String> controlOwnerList;

}
