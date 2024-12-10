package com.idbi.intech.erm.domain.app;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.idbi.intech.aml.domain.app.BranchEddMasterDto;

import lombok.Data;

@Data
public class User implements UserDetails {

	private static final long serialVersionUID = 1L;

	private String userId;
	@JsonIgnore
	private String username;
	private String password;
	@JsonIgnore
	private String userActiveStatus;
	@JsonIgnore
	private Integer userFailLoginAttempt;
	@JsonIgnore
	private String requestStatus;
	@JsonIgnore
	private Date userCurrentLoginTime;
	@JsonIgnore
	private String userSupRole;
	@JsonIgnore
	private String userDept;
	@JsonIgnore
	private String userDeptName;
	@JsonIgnore
	private String userPosition;
	@JsonIgnore
	private String userOffice;
	@JsonIgnore
	private String userOfficeType;
	@JsonIgnore
	private String selectedOfficeType;
	@JsonIgnore
	private String officePinCode;
	@JsonIgnore
	private String userAccessMenu;
	@JsonIgnore
	private String userEmail;
	@JsonIgnore
	private String userMobile;
	@JsonIgnore
	private List<Role> authorities;
	@JsonIgnore
	private boolean accountNonExpired = true;
	@JsonIgnore
	private boolean accountNonLocked = true;
	@JsonIgnore
	private boolean credentialsNonExpired = true;
	@JsonIgnore
	private boolean enabled = false;
	@JsonIgnore
	private List<String> roleNameList;
	@JsonIgnore
	private List<String> menuName;
	@JsonIgnore
	private List<MenuDto> menuDtoList;
	@JsonIgnore
	private HashMap<String, List<MenuDto>> menuMapList;
	@JsonIgnore
	private HashMap<String, List<MenuDto>> menuDetails;
	@JsonIgnore
	private HashMap<String, List<MenuDto>> menuDetails2;
	@JsonIgnore
	List<RoleMasterDto> allRolesDtoList;
	@JsonIgnore
	private String defaultRole;
	@JsonIgnore
	HashMap<String, List<RoleMasterDto>> roleModuleMap;
	@JsonIgnore
	private String userValidateRequestStatus;
	@JsonIgnore
	private String officeCode;
	@JsonIgnore
	private String isAdStatus;
	@JsonIgnore
	private boolean hrmsFlg;
	@JsonIgnore
	private String emailFlgStatus;
	@JsonIgnore
	private String ermTitle;
	@JsonIgnore
	private List<String> defaultRoleList;
	@JsonIgnore
	private String moduleCode;
	@JsonIgnore
	private Boolean switchAccessFlg;
	@JsonIgnore
	private String zone;
	@JsonIgnore
	private List<AppSysMaintenanceDto> maintenanceDtoList;
	@JsonIgnore
	private String startDate;
	@JsonIgnore
	private String endDate;
	@JsonIgnore
	private String startTime;
	@JsonIgnore
	private String endTime;
	@JsonIgnore
	private String massegeColor;
	@JsonIgnore
	private String ntf15Days;
	@JsonIgnore
	private LinkedHashMap<String, ModuleMasterDto> moduleDtoList;
	@JsonIgnore
	private String branchId;
	@JsonIgnore
	private String vertical;
	@JsonIgnore
	private String userVertical;
	@JsonIgnore
	private String supEin;
	@JsonIgnore
	private String userRegion;
	@JsonIgnore
	private String supFullName;
	@JsonIgnore
	private String omsOfficeType;
	@JsonIgnore
	private String omsUserPosition;
	@JsonIgnore
	private String searchFromDashboard;
	@JsonIgnore
	private String locationName;
	@JsonIgnore
	private String branchName;
	@JsonIgnore
	private String hrmsZone;
	@JsonIgnore
	private String hrmsRegion;
	@JsonIgnore
	private String period;
	@JsonIgnore
	private String verticalFlg;
	@JsonIgnore
	private String adminFlg;
	@JsonIgnore
	private String alertAggFlg;
	@JsonIgnore
	private String alertStatus;
	@JsonIgnore
	private boolean raiseStrFlg;
	@JsonIgnore
	private boolean escBackFlg;
	@JsonIgnore
	private List<String> tmRoleAction;
	@JsonIgnore
	private String mailContent;
	@JsonIgnore
	private String userSession;
	@JsonIgnore
	private String deviceToken;
	@JsonIgnore
	private BranchEddMasterDto eddDto;
	@JsonIgnore
	private String channelCode;
	@JsonIgnore
	private String channelId;
}
