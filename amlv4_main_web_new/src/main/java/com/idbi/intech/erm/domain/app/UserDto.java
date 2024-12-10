package com.idbi.intech.erm.domain.app;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.idbi.intech.aml.domain.app.BranchEddMasterDto;

import lombok.Data;

/**
 * POJO for data transfer. This a DTO for User_Master Entity
 * 
 * @author sharath
 *
 */
@Data
public class UserDto {
	private String userId;
	private String username;
	private String userMobile;
	private String userEmail;
	private String userRole;
	private String userOffice;
	private Date userLastLoginTime;
	private Date userLastFailLoginTime;
	private String password;
	private String userActiveStatus;
	private Integer userFailLoginAttempt;
	private String requestStatus;
	private Date userCurrentLoginTime;
	private String userSupRole;
	private String userDept;
	private String userDeptName;
	private String userPosition;
	private String userOfficeType;
	private String userAccessMenu;
	private String makerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date makerTimestamp;
	private String checkerId;
	@JsonSerialize(as = Date.class)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date checkerTimestamp;
	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date lastPasswordChangeDate;
	private String searchParam;
	private String searchValue;
	private String sortValue;

	private String fileName;
	private Double fileSize;
	private String uploadedBy;
	private String uploadedDate;
	private List<UserDto> documentList;
	private List<FileMasterDto> filedetails;

	private List<DepartmentMasterDto> deptName;
	private List<RoleMasterDto> selectedRoleName;
	private List<RoleMasterDto> roleShortNameList;
	private List<OfficeMasterDto> officeName;
	private List<UserDto> userDtoList;
	private String deptId;
	private String sourceName;
	private String userActiveStatusOld;

	private CommentDto commentDto;
	private ActivityLogDto activityLogDto;
	private List<String> emailIdList;
	private List<String> deptNameList;
	private List<String> roleShortName;
	private List<String> roleNameList;

	private String raRecordStatusColor;
	private String warningColor;
	private String userActionName;
	private List<MenuDto> menuList;
	private List<String> menuName;
	private HashMap<String, List<MenuDto>> menuMapList;
	private String roleName;
	HashMap<String, ArrayList<String>> buttonMenuList;
	private List<String> userPositionList;
	private String gradeName;
	private String gradeId;
	List<RoleMasterDto> allRolesDtoList;
	HashMap<String, List<RoleMasterDto>> roleModuleMap;
	private String selectedOfcType;
	private String officePinCode;
	private String userValidateRequestStatus;
	private String officeCode;
	private List<String> officeCodeList;
	private String isAdStatus;
	private String srno;
	private boolean hrmsFlg;
	private String ermDeptId;
	private HashMap<String, String> officeLevel;
	private boolean emailFlg;
	private String emailFlgStatus;
	private List<String> defaultRoleList;
	private String switchAccessFlg;
	private String userOfficeName;
	private String moduleCode;
	private String ntfStatus;
	private String zone;
	private List<AppSysMaintenanceDto> maintenanceDtoList;
	private String ntf15Days;
	private LinkedHashMap<String, ModuleMasterDto> moduleDtoList;
	private String branchId;
	private String vertical;
	private String userRegion;
	private String supPersonId;
	private String supEin;
	private String supFullName;
	private String userZone;
	private String omsOfficeType;
	private String omsUserPosition;
	private String searchFromDashboard;
	private String locationName;
	private String branchName;
	private String hrmsZone;
	private String hrmsRegion;
	private String userCat;
	private List<String> solVerticalList;
	private String verticalFlg;
	private String adminFlg;
	private String userBranch;
	private String alertAggFlg;
	private String alertStatus;
	private String alertAggKey;
	private String alertAggValue;
	private boolean raiseStrFlg;
	private boolean escBackFlg;
	private boolean isLogin;
	private List<String> tmRoleAction;
	private String mailContent;
	private String userSession;
	private String deviceToken;
	private String alertStartDate;
	private String alertEndDate;
	private BranchEddMasterDto eddDto;
	private String channelCode;
	private String channelId;
	
	
	List<String> appNamesWithDesc;
	List<NsRegisterMasterDto> nsRegisterMasterDtoList;
}
