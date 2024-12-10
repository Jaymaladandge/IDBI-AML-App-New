package com.idbi.intech.erm.controller;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.WorkflowActionDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.FileMasterDto;
import com.idbi.intech.erm.domain.app.NsRegisterMasterDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.RoleMasterDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;
import com.idbi.intech.oms.domain.app.OmsAlertMasterDto;

@Controller
public class UserController {
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	@Autowired
	private CommonUtility commonUtility;
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.getUserData}")
	private String getUserData;
	@Value("${app-url.createUserData}")
	private String createUserData;
	@Value("${app-url.fetchAllUserData}")
	private String fetchAllUserData;
	@Value("${app-url.fetchUserDataById}")
	private String fetchUserDataById;
	@Value("${app-url.approveRejectUserData}")
	private String approveRejectUserData;
	@Value("${app-url.viewAuditTrail}")
	private String viewAuditTrail;
	@Value("${app-url.editUserData}")
	private String editUserData;
	@Value("${app-url.fetchEditUserDataById}")
	private String fetchEditUserDataById;
	@Value("${app-url.fetchUsrData}")
	private String fetchUsrData;
	@Value("${app-url.fetchDeptNameList}")
	private String fetchDeptNameList;
	@Value("${app-url.fetchRoleShortNameList}")
	private String fetchRoleShortNameList;
	@Value("${app-url.userViewModel}")
	private String userViewModel;
	@Value("${app-url.fetchOfficeCodeByDeptAnduserOfficeType}")
	private String fetchOfficeCodeByDeptAnduserOfficeType;
	// fetchHrmsDataBySrno
	@Value("${app-url.fetchHrmsDataBySrno}")
	private String fetchHrmsDataBySrno;
	@Value("${app-url.fetchOfficewiseUsersData}")
	private String fetchOfficewiseUsersData;
	@Value("${app-url.fetchUserDataByUserId}")
	private String fetchUserDataByUserId;
	@Value("${app-url.fetchDistinctZoneList}")
	private String fetchDistinctZoneList;
	@Value("${app-url.validateEmail}")
	private String validateEmail;
	RequestResponseJsonDto respDto = null;
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;

	@Value("${app-url.getAllPositions}")
	private String getAllPositions;
	@Value("${app-url.getRoleForPosition}")
	private String getRoleForPosition;
	@Value("${app-url.getAllChannelId}")
	private String getAllChannelId;
	

	@RequestMapping("/userSummary")
	public String usersSummary(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			HttpSession session) throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException,
			NoSuchPaddingException, CertificateException, KeyStoreException, IllegalBlockSizeException,
			BadPaddingException, NoSuchProviderException, InvalidAlgorithmParameterException, IOException {

		System.out.println("============= usersSummary() =============");

		String sourceText = "";
		String redirectPage = "";
		String messageText = "";
		boolean ermIdFlg = false;
		final ObjectMapper objectMapper = new ObjectMapper();

		sourceText = source == null ? "" : source;

		UserDto userDto = new UserDto();

		userDto.setSearchParam("ALL");
		userDto.setZone(user.getHrmsZone());
		userDto.setUserRegion(user.getHrmsRegion());
		userDto.setBranchId(user.getBranchId());
		userDto.setUserPosition(user.getUserPosition());
		userDto.setUserOffice(user.getOmsOfficeType());

		try {
			respDto = commonUtility.objectToJson(userDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchUsrData, respDto));

			userDto = objectMapper.readValue(respString, UserDto.class);

			model.addAttribute("userList", userDto.getUserDtoList());
			model.addAttribute("user", user);

			if (null != sourceText && sourceText.equals("CREATE")) {
				messageText = "User Created Successfully";
			} else if (null != sourceText && sourceText.equals("EDIT")) {
				messageText = "User Modified Successfully";
			} else if (null != sourceText && sourceText.equals("ERROR")) {
				messageText = "Error occured in the request";
			}

			String modulename = "UM";
			model.addAttribute("userRole", user.getUserPosition());
			model.addAttribute("modulename", modulename);
			model.addAttribute("message", messageText);
			model.addAttribute("userDto", userDto);

		} catch (Exception e) {
			e.printStackTrace();

		}

		redirectPage = "userSummary";
		return redirectPage;
	}

	@RequestMapping("/createUser")
	public String creatingUser(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {

		System.out.println("============= creatingUser() ===============");

		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		userDto.setUserId(pkGenerator.getModulePrimaryKey("UM"));
		model.addAttribute("userId", userDto.getUserId());

		respDto = commonUtility.objectToJson(userDto);
		final String respString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + getUserData, respDto));

		userDto = objectMapper.readValue(respString, UserDto.class);

		model.addAttribute("userName1", user.getUsername());
		model.addAttribute("recordStatus", "Create User");
		model.addAttribute("appNamesWithDesc", userDto.getAppNamesWithDesc());

		System.out.println("============= creatingUser() model ===============" + model);

		return "createUser";

	}

	@RequestMapping("/fetchAllPositions")
	@ResponseBody
	public UserDto fetchAllPositions(HttpServletRequest request, Model model) {

		System.out.println("=============fetchAllPositions()==============");
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();

		try {

			respDto = new RequestResponseJsonDto();
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getAllPositions, respDto));
			userDto = objectMapper.readValue(respString, UserDto.class);
			System.out.println("====================fetchAllPositions() userDto====================");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		}

		return userDto;
	}

	
	
	
	@RequestMapping("/fetchAllChannelId")
	@ResponseBody
	public List<NsRegisterMasterDto> fetchAllChannelId(HttpServletRequest request, Model model) {
		
		System.out.println("============fetchAllChannelId()============");
		
		UserDto userDto = new UserDto();
		List<NsRegisterMasterDto> nsRegiMasterDtoList = new ArrayList<>();
		respDto = new RequestResponseJsonDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		
		try {
			
			final String respString = commonUtility.decryptedResToString(commonUtility.webserviceConsume(uri + getAllChannelId, respDto));
			userDto = objectMapper.readValue(respString, UserDto.class);
			nsRegiMasterDtoList = userDto.getNsRegisterMasterDtoList();
			System.out.println("=================fetchAllChannelId() userDto=================="+nsRegiMasterDtoList);
			
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		
		return nsRegiMasterDtoList;
	}
	
	
	
	@PostMapping("/fetchRolesForPosition")
	@ResponseBody
	public List<RoleMasterDto> fetchRolesForPosition(@RequestParam String positionVal, Model model) throws JsonParseException, JsonMappingException, IOException {

		System.out.println("==============fetchRolesForPosition()=============="+positionVal);
		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		
		try {
			userDto.setUserPosition(positionVal);
			System.out.println("==============fetchRolesForPosition() userDto =============="+userDto);
			respDto = commonUtility.objectToJson(userDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getRoleForPosition, respDto));
			userDto = objectMapper.readValue(respString, UserDto.class);
			System.out.println("==========fetchRolesForPosition() final response userDto==========="+userDto);
			
			
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return userDto.getAllRolesDtoList();
	}
	
	
	

	
	
//	@RequestMapping("/userSummary")
//	public String userSummary(@RequestParam(value = "message", required = false, defaultValue = "") String message,
//			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
//			HttpSession session) throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException,
//			NoSuchPaddingException, CertificateException, KeyStoreException, IllegalBlockSizeException,
//			BadPaddingException, NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
//		String sourceText = "";
//		String redirectPage = "";
//		sourceText = source == null ? "" : source;
//
//		String messageText = "";
//		UserDto userDto = new UserDto();
//
//		// System.out.println("user.getOmsOfficeType() = " + user.getOmsOfficeType());
//		// System.out.println("user.getUserPosition() = " + user.getUserPosition());
//
//		userDto.setSearchParam("ALL");
//
//		userDto.setZone(user.getHrmsZone());
//		userDto.setUserRegion(user.getHrmsRegion());
//		// System.out.println("Branch Id = " + user.getBranchId());
//		userDto.setBranchId(user.getBranchId());
//		userDto.setUserPosition(user.getUserPosition());
//		userDto.setUserOffice(user.getOmsOfficeType());
//		boolean ermIdFlg = false;
//		final ObjectMapper objectMapper = new ObjectMapper();
//		try {
//			// userDto.setUserDept(user.getUserDept());
//			// userDto.setUserOfficeType(user.getUserOfficeType());
//			respDto = commonUtility.objectToJson(userDto);
//			final String respString = commonUtility
//					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchUsrData, respDto));
//			userDto = objectMapper.readValue(respString, UserDto.class);
//			model.addAttribute("userList", userDto.getUserDtoList());
//			model.addAttribute("user", user);
//			OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
//			alertDto.setSearchParam("zone");
//
//			respDto = commonUtility.objectToJson(alertDto);
//			final String respString1 = commonUtility
//					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
//			alertDto = objectMapper.readValue(respString1, OmsAlertMasterDto.class);
//
//			model.addAttribute("zoneList", alertDto.getBranchDtoList());
//
//			// //System.out.println("erm user test " + user.getErmTitle());
//			if (null != sourceText && sourceText.equals("CREATE")) {
//				messageText = "User Created Successfully";
//			} else if (null != sourceText && sourceText.equals("EDIT")) {
//				messageText = "User Modified Successfully";
//			} else if (null != sourceText && sourceText.equals("ERROR")) {
//				messageText = "Error occured in the request";
//			}
//			model.addAttribute("userRole", user.getUserPosition());
//
//			String modulename = "UM";
//			model.addAttribute("modulename", modulename);
//
//			model.addAttribute("message", messageText);
//
//		} catch (Exception e) {
//			// Logger needs to ADD
//			e.printStackTrace();
//
//		}
//
//		if (user.getAdminFlg() != null && user.getAdminFlg().equalsIgnoreCase("Y")) {
//			redirectPage = "userSummary";
//		} else {
//			redirectPage = "redirect:/logout";
//		}
//
//		return redirectPage;
//	}
//

//		@RequestMapping("/createUser")
//		public String createUser(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model)
//				throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
//				CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
//				NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
//			final ObjectMapper objectMapper = new ObjectMapper();
//			UserDto userDto = new UserDto();
//			boolean ermIdFlg = false;
//			userDto.setUserId(pkGenerator.getModulePrimaryKey("UM"));
//			model.addAttribute("userId", userDto.getUserId());
//			model.addAttribute("recordStatus", "Create User");
//			respDto = commonUtility.objectToJson(userDto);
//			final String respString = commonUtility
//					.decryptedResToString(commonUtility.webserviceConsume(uri + getUserData, respDto));
//			userDto = objectMapper.readValue(respString, UserDto.class);
//			model.addAttribute("OfficeNameList", userDto.getOfficeName()); //
//			// System.out.println(userDto.getDeptNameList()); //
//			model.addAttribute("deptNameList", userDto.getDeptNameList()); //
//			model.addAttribute("RoleShortNameList", userDto.getRoleShortNameList());
//			model.addAttribute("userName1", user.getUsername()); //
//			model.addAttribute("emailList", userDto.getEmailIdList());
//			model.addAttribute("deptName", user.getUserDeptName());
//			model.addAttribute("userOfficeType", user.getUserOfficeType());
//			model.addAttribute("level1", userDto.getOfficeLevel().get("level1"));
//			model.addAttribute("level2", userDto.getOfficeLevel().get("level2"));
//			model.addAttribute("level3", userDto.getOfficeLevel().get("level3"));
//			model.addAttribute("level4", userDto.getOfficeLevel().get("level4"));
//			model.addAttribute("deptId", user.getUserDept());
//
//			if (user.getUserDept().equalsIgnoreCase(userDto.getErmDeptId())) {
//				ermIdFlg = true;
//			}
//			model.addAttribute("ermDeptFlg", ermIdFlg);
//
//			return "createUser";
//
//		}

	@PostMapping("/createUserPage")
	public String createUserPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;
		WorkflowActionDto workflowActionDto = new WorkflowActionDto();

		
		String requestString = "";
		String returnPage = "";
		try {
			workflowActionDto.setWfModule("UM");
			workflowActionDto.setWfAction("CREATE");
			workflowActionDto.setWfActionSource(user.getUserPosition().toUpperCase());
			workflowActionDto = commonUtility.checkWorkFlowExist(workflowActionDto);
//			if ("SUCCESS".equalsIgnoreCase(workflowActionDto.getIsExistStatus())) {
				requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
				userDto = objectMapper.readValue(requestString, UserDto.class);
				userDto.setUserActionName("create");
				userDto.setMakerId(user.getUserId().toUpperCase());
				userDto.setDeptId(user.getUserDept());
				//userDto.setUserPosition(user.getUserPosition());

				userDto.getFiledetails().stream().forEach(e -> {
					Arrays.asList(multipartFile).stream().forEach(file -> {
						if (e.getFileName().equals(file.getOriginalFilename())) {
							if (!e.getFileName().equalsIgnoreCase("No Data Available")) {
								commonUtility.uploadFile(file);
							}

						}
					});
				});

				respDto = commonUtility.objectToJson(userDto);
				apString = commonUtility.webserviceConsume(uri + createUserData, respDto);

				resHeaders = apString.getHeaders();
//			} else {
//				redirectAttributes.addFlashAttribute("source", "UNAUTHORIZE");
//				returnPage = "redirect:/userSummary";
//			}

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "CREATE");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/userSummary";

	}

	
	@RequestMapping("/editUser")
	public String editUser(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceId") String sourceId, @ModelAttribute(name = "sourceName") String sourceName)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
				
		
		System.out.println("=======editUser()========");
		
		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		String requestString = "";

		if (sourceId.length() > 0) {
			userDto.setUserId(sourceId);
		} else {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			userDto = objectMapper.readValue(requestString, UserDto.class);
			userDto.setUserId(userDto.getUserId());
		}
		
		userDto.setSourceName("edit");
		
		respDto = commonUtility.objectToJson(userDto);
		final String respString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + fetchUserDataById, respDto));
		userDto = objectMapper.readValue(respString, UserDto.class);
		
		
		model.addAttribute("recordStatus", "Edit User");
		model.addAttribute("userName1", user.getUsername());
		model.addAttribute("deptId", user.getUserDept());

		model.addAttribute("nsRegisterMasterDtoList", userDto.getNsRegisterMasterDtoList());
		model.addAttribute("roleNameList", userDto.getRoleNameList());
		model.addAttribute("userId", userDto.getUserId());
		model.addAttribute("username", userDto.getUsername());
		model.addAttribute("userEmail", userDto.getUserEmail());
		model.addAttribute("channelId", userDto.getChannelId());
		model.addAttribute("userMobile", userDto.getUserMobile());
		model.addAttribute("userPosition", userDto.getUserPosition());
		model.addAttribute("allRolesDtoList", userDto.getAllRolesDtoList());
		model.addAttribute("filedetails", userDto.getFiledetails());

		return "editingUser";
		
	}
	
	@RequestMapping("/editlistUser")
	public String editlistUser(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceId") String sourceId, @ModelAttribute(name = "sourceName") String sourceName)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		
		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		String requestString = "";
		boolean ermFlag = false;

		// userDto.setUserId(sourceId);

		if (sourceId.length() > 0) {
			userDto.setUserId(sourceId);
		} else {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			userDto = objectMapper.readValue(requestString, UserDto.class);
			userDto.setUserId(userDto.getUserId());
		}
		model.addAttribute("userId", userDto.getUserId());
		model.addAttribute("recordStatus", "Edit User");
		userDto.setMakerId(user.getUserId().toUpperCase());
		userDto.setDeptId(user.getUserDept());

		userDto.setSourceName("edit");
		respDto = commonUtility.objectToJson(userDto);
		final String respString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + fetchUserDataById, respDto));
		userDto = objectMapper.readValue(respString, UserDto.class);
		if (userDto.getDeptId().equalsIgnoreCase(userDto.getErmDeptId())) {
			ermFlag = true;
		}
		model.addAttribute("ermDeptFlg", ermFlag);
		model.addAttribute("deptName", user.getUserDeptName());
		model.addAttribute("userDto", userDto);
		model.addAttribute("userName1", user.getUsername());
		model.addAttribute("deptId", user.getUserDept());
		model.addAttribute("OfficeNameList", userDto.getOfficeName());
		model.addAttribute("DeptList", userDto.getDeptNameList());

		ArrayList<String> selectedRoleId = new ArrayList<>();
		userDto.getSelectedRoleName().stream().forEach(roleId -> {
			if (roleId != null) {
				selectedRoleId.add(roleId.getRoleId());
			}
		});

		model.addAttribute("RoleShortNameList", userDto.getRoleShortName());
		model.addAttribute("selectedRoleName", userDto.getSelectedRoleName());
		model.addAttribute("selectedRoleId", selectedRoleId);

		return "editUser";

	}

	@RequestMapping("/editlistUserData")
	public String editlistUserData(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceId") String sourceId, @ModelAttribute(name = "sourceName") String sourceName)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		String requestString = "";
		boolean ermFlag = false;

		// userDto.setUserId(sourceId);

		if (sourceId.length() > 0) {
			userDto.setUserId(sourceId);
		} else {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			userDto = objectMapper.readValue(requestString, UserDto.class);
			userDto.setUserId(userDto.getUserId());
		}
		model.addAttribute("userId", userDto.getUserId());
		model.addAttribute("recordStatus", "Edit User");
		userDto.setMakerId(user.getUserId().toUpperCase());
		userDto.setDeptId(user.getUserDept());

		userDto.setSourceName("edit");
		respDto = commonUtility.objectToJson(userDto);
		final String respString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + fetchUserDataById, respDto));
		userDto = objectMapper.readValue(respString, UserDto.class);
		if (userDto.getDeptId().equalsIgnoreCase(userDto.getErmDeptId())) {
			ermFlag = true;
		}
		model.addAttribute("ermDeptFlg", ermFlag);
		model.addAttribute("deptName", user.getUserDeptName());
		model.addAttribute("userDto", userDto);
		model.addAttribute("userName1", user.getUsername());
		model.addAttribute("deptId", user.getUserDept());
		model.addAttribute("OfficeNameList", userDto.getOfficeName());
		model.addAttribute("DeptList", userDto.getDeptNameList());

		ArrayList<String> selectedRoleId = new ArrayList<>();
		userDto.getSelectedRoleName().stream().forEach(roleId -> {
			if (roleId != null) {
				selectedRoleId.add(roleId.getRoleId());
			}
		});

		model.addAttribute("RoleShortNameList", userDto.getRoleShortName());
		model.addAttribute("selectedRoleName", userDto.getSelectedRoleName());
		model.addAttribute("selectedRoleId", selectedRoleId);

		return "editUserData";

	}
	
	

	@PostMapping("/editUserPage")
	public String editUserPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;

		String requestString = "";
		String returnPage = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			userDto = objectMapper.readValue(requestString, UserDto.class);
			userDto.setMakerId(user.getUserId().toUpperCase());
			userDto.setDeptId(user.getUserDept());
			//userDto.setUserPosition(user.getUserPosition());
			userDto.setUserActionName("EDIT");

			System.out.println("======multipartFile.length======"+multipartFile.length);
			
			
			if (userDto.getFiledetails() != null) {
				userDto.getFiledetails().stream().forEach(e -> {
					
					Arrays.asList(multipartFile).stream().forEach(file -> {
						
						if (e.getFileName().equals(file.getOriginalFilename())) {
							if (!e.getFileName().equalsIgnoreCase("No Data Available")) {
								commonUtility.uploadFile(file);
							}

						}
					});
				});
			}

			respDto = commonUtility.objectToJson(userDto);
			apString = commonUtility.webserviceConsume(uri + editUserData, respDto);
			resHeaders = apString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "EDIT");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/userSummary";

	}

	@PostMapping("/editUserDataPage")
	public String editUserDataPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;

		String requestString = "";
		String returnPage = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			userDto = objectMapper.readValue(requestString, UserDto.class);
			userDto.setMakerId(user.getUserId().toUpperCase());
			userDto.setDeptId(user.getUserDept());
			userDto.setUserPosition(user.getUserPosition());
			userDto.setUserActionName("EDIT");
			userDto.getFiledetails().stream().forEach(e -> {
				Arrays.asList(multipartFile).stream().forEach(file -> {
					if (e.getFileName().equals(file.getOriginalFilename())) {
						if (!e.getFileName().equalsIgnoreCase("No Data Available")) {
							commonUtility.uploadFile(file);
						}

					}
				});
			});

			respDto = commonUtility.objectToJson(userDto);
			apString = commonUtility.webserviceConsume(uri + editUserData, respDto);
			resHeaders = apString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "EDIT");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/modifyUserAcess";

	}

	@RequestMapping("/searchUserList")
	public String searchRaList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) {
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			userDto = objectMapper.readValue(requestString, UserDto.class);
			userDto.setUserDept(user.getUserDept());
			userDto.setMakerId(user.getUserId());

			userDto.setUserOfficeType(user.getUserOfficeType());
			respDto = commonUtility.objectToJson(userDto);
			// Fetch Risk Appetite List
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchUsrData, respDto));
			userDto = objectMapper.readValue(respString, UserDto.class);
			model.addAttribute("userList", userDto.getUserDtoList());
			model.addAttribute("userRole", user.getUserPosition());
			model.addAttribute("user", user);
			OmsAlertMasterDto omsAlertDto = new OmsAlertMasterDto();
			omsAlertDto.setSearchParam("ZONE");
			final String respString2 = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
			omsAlertDto = objectMapper.readValue(respString2, OmsAlertMasterDto.class);
			model.addAttribute("zoneList", omsAlertDto.getBranchDtoList());
			String modulename = "UM";
			ArrayList<String> subMenuButtonList = commonUtility.getSubMenuBtnData(modulename, session);
			model.addAttribute("btnName", subMenuButtonList);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// Logger needs to ADD
		}

		return "userSummary";
	}

	@RequestMapping(value = "/fetchDepartmentByOfcName")
	@ResponseBody
	public UserDto fetchDeptData(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		UserDto userDto = new UserDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			userDto = objectMapper.readValue(pageValJson, UserDto.class);
			respDto = commonUtility.objectToJson(userDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDeptNameList, respDto));
			userDto = objectMapper.readValue(respString, new TypeReference<UserDto>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return userDto;
	}

	@RequestMapping(value = "/viewUserModel")
	@ResponseBody
	public UserDto viewUserModal(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		UserDto userDto = new UserDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			userDto = objectMapper.readValue(pageValJson, UserDto.class);

			respDto = commonUtility.objectToJson(userDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + userViewModel, respDto));
			userDto = objectMapper.readValue(respString, UserDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return userDto;
	}

	@RequestMapping(value = "/fetchOfficeCodeByDeptAnduserOfficeType")
	@ResponseBody
	public UserDto fetchOfficeCodeByDeptAnduserOfficeType(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		UserDto userDto = new UserDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			userDto = objectMapper.readValue(pageValJson, UserDto.class);
			respDto = commonUtility.objectToJson(userDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchOfficeCodeByDeptAnduserOfficeType, respDto));
			userDto = objectMapper.readValue(respString, new TypeReference<UserDto>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return userDto;
	}

	@RequestMapping(value = "/fetchHrmsDataBySrno")
	@ResponseBody
	public UserDto fetchHrmsDataBySrno(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		UserDto userDto = new UserDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			userDto = objectMapper.readValue(pageValJson, UserDto.class);
			respDto = commonUtility.objectToJson(userDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchHrmsDataBySrno, respDto));
			userDto = objectMapper.readValue(respString, new TypeReference<UserDto>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return userDto;
	}

	@RequestMapping(value = "/validateEmail")
	@ResponseBody
	public UserDto validateEmail(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		UserDto userDto = new UserDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			userDto = objectMapper.readValue(pageValJson, UserDto.class);
			respDto = commonUtility.objectToJson(userDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateEmail, respDto));
			userDto = objectMapper.readValue(respString, new TypeReference<UserDto>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return userDto;
	}

//searchUserSummary	
	@RequestMapping("/searchUserSummary")
	public String searchUserSummary(
			@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, HttpSession session)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		UserDto userDto = new UserDto();
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			userDto = objectMapper.readValue(requestString, UserDto.class);
			userDto.setBranchId(user.getBranchId());
			respDto = commonUtility.objectToJson(userDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchOfficewiseUsersData, respDto));
			userDto = objectMapper.readValue(respString, new TypeReference<UserDto>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		model.addAttribute("userList", userDto.getUserDtoList());
		model.addAttribute("user", user);
		model.addAttribute("userRole", user.getUserPosition());

		String modulename = "UM";
		model.addAttribute("modulename", modulename);

		return "filterUserSummary";
	}

	@RequestMapping("/modifyUserAcess")
	public String modifyUserAcess(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes, @ModelAttribute(name = "source") String source) {

		UserDto userDto = new UserDto();
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";

		System.out.println("sourceText =" + sourceText);

		if (null != sourceText && sourceText.equals("CREATE")) {
			messageText = "User Created Successfully";
		} else if (null != sourceText && sourceText.equals("EDIT")) {
			messageText = "User Modified Successfully";
		} else if (null != sourceText && sourceText.equals("ERROR")) {
			messageText = "Error occured in the request";
		} else if (null == sourceText || "".equalsIgnoreCase(sourceText)) {
			messageText = "NA";
		}
		model.addAttribute("userRole", user.getUserPosition());

		System.out.println("messageText =" + messageText);
		model.addAttribute("message", messageText);

		model.addAttribute("userDto", userDto);
		return "modifyUserAcessPage";
	}

//fetchDataByUserId	
	@PostMapping("/fetchDataByUserId")
	public String fetchDataByUserId(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {

		HttpHeaders resHeaders = null;
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;
		String requestString = "";

		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			userDto = objectMapper.readValue(requestString, UserDto.class);
			respDto = commonUtility.objectToJson(userDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchUserDataByUserId, respDto));
			userDto = objectMapper.readValue(respString, UserDto.class);

			model.addAttribute("userDto", userDto);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return "userAccessModify";
	}

	@RequestMapping(value = "/getUser")
	@ResponseBody
	public UserDto getUser(HttpServletRequest request, Model model, @AuthenticationPrincipal User user)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		UserDto userDto = new UserDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			userDto = objectMapper.readValue(pageValJson, UserDto.class);
			System.out.println(userDto.getUserZone());
			userDto.setUserOffice(user.getOmsOfficeType());
			userDto.setBranchId(user.getBranchId());
			respDto = commonUtility.objectToJson(userDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchUsrData, respDto));
			userDto = objectMapper.readValue(respString, new TypeReference<UserDto>() {
			});
			System.out.println(userDto.getUserDtoList());

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return userDto;
	}
}
