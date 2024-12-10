package com.idbi.intech.erm.controller;

import java.security.Security;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.BranchEddMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.ModuleMasterDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.RoleMasterDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class IndexPageController {
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	@Autowired
	private CommonUtility commonUtility;
	RequestResponseJsonDto respDto = null;
	RequestResponseJsonDto auditRespDto = null;
	@Value("${app-url.fetchUserDataById}")
	private String fetchUserDataById;
	@Value("${app-url.updateSession}")
	private String updateSession;
	@Value("${app-url.fetchAllTestDetails}")
	private String fetchAllTestDetails;
	@Value("${app-url.context-path}")
	private String contextPath;

	@RequestMapping("/RolePage")
	public String indexPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes, HttpSession session,
			@ModelAttribute(name = "source") String source) {
		UserDto userDto = new UserDto();
		List<String> selectedRoleName = new ArrayList<>();
		HashMap<String, List<RoleMasterDto>> selectedRoleModuleMap = new HashMap<>();
		HashMap<String, List<RoleMasterDto>> unselectedRoleModuleMap = new HashMap<>();
		List<String> moduleCodeLists = new ArrayList<>();
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			Boolean ruleFlg = false;
			String sourceText = "";
			sourceText = source == null ? "" : source;
			userDto.setUserId(user.getUserId());
			userDto.setUserSession(session.getId());
			respDto = commonUtility.objectToJson(userDto);
			if (user.getRequestStatus().equalsIgnoreCase("07")) {
				redirectAttributes.addFlashAttribute("sourceName", "OFFICE MISMATCH");
				return "redirect:/";
			} else if (user.getRequestStatus().equalsIgnoreCase("01")) {
				redirectAttributes.addFlashAttribute("sourceName", "Authentication failed");
				return "redirect:/";
			} else if (user.getRequestStatus().equalsIgnoreCase("02")) {
				redirectAttributes.addFlashAttribute("sourceName", "Password Expired");
				return "redirect:/";
			} else if (user.getRequestStatus().equalsIgnoreCase("09")) {
				redirectAttributes.addFlashAttribute("sourceName", "Office Not Present");
				return "redirect:/";
			} else if (user.getRequestStatus().equalsIgnoreCase("10")) {
				redirectAttributes.addFlashAttribute("sourceName", "Role Not Present");
				return "redirect:/";
			} else if (user.getIsAdStatus().equals("Y") && user.getEmailFlgStatus().equals("Y")) {
				return "redirect:/generateOtp";
			}
			String messageText = "";

			if (sourceText != null) {

				if (null != sourceText && sourceText.equals("SWITCHOFC")) {
					messageText = "Office Changed Successfully";
					model.addAttribute("message", messageText);

				}
				if (null != sourceText && sourceText.equals("INVALIDOFC")) {
					messageText = "Office Not Present";
					model.addAttribute("message", messageText);
				}
			}
			userDto.setUserId(user.getUserId());
			userDto.setUserPosition(user.getUserPosition());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserOfficeType(user.getUserOfficeType());

			if (user.getMenuMapList() != null) {
				userDto.setMenuMapList(user.getMenuMapList());

				userDto.getMenuMapList().entrySet().stream().forEach(data -> {

					selectedRoleName.add(data.getKey());

				});

				session.setAttribute("menuButtonData", userDto.getMenuMapList());
			}
			if (user.getAllRolesDtoList() != null) {
				userDto.setAllRolesDtoList(user.getAllRolesDtoList());
				session.setAttribute("menuButtonData", userDto.getMenuMapList());
			}

			if (user.getRoleModuleMap() != null) {

				userDto.setRoleModuleMap(user.getRoleModuleMap());

				userDto.getRoleModuleMap().entrySet().stream().forEach(data -> {

					String key = data.getKey();
					List<RoleMasterDto> selectedRoleList = new ArrayList<>();
					List<RoleMasterDto> unselectedRoleList = new ArrayList<>();
					data.getValue().stream().forEach(role -> {

						if (selectedRoleName.contains(role.getRoleName())) {

							selectedRoleList.add(role);

						} else {
							unselectedRoleList.add(role);
						}

					});

					selectedRoleModuleMap.put(key, selectedRoleList);
					unselectedRoleModuleMap.put(key, unselectedRoleList);

				});

			}
			if (user.getDefaultRoleList() != null) {
				userDto.setDefaultRoleList(user.getDefaultRoleList());
			}
			if (user.isHrmsFlg()) {
				String emailid = user.getUserEmail().split("@")[0];
				user.setUserId(emailid.toUpperCase());
				userDto.setSourceName("getUserData");
				userDto.setUserId(emailid.toUpperCase());
				respDto = commonUtility.objectToJson(userDto);
				final String respoString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchUserDataById, respDto));
				userDto = objectMapper.readValue(respoString, UserDto.class);
				if (userDto != null) {
					user.setUserDept(userDto.getUserDept().toLowerCase());
					user.setUserDeptName("OMS");
					user.setUserOffice(userDto.getUserOffice());
				}
			}
			if (user.getModuleDtoList() != null) {

				userDto.setModuleDtoList(user.getModuleDtoList());
				userDto.getModuleDtoList().entrySet().stream().forEach(data -> {
					moduleCodeLists.add(data.getValue().getModuleCode());
				});
			}
			List<ModuleMasterDto> moduleList = new ArrayList<>();
			for (String moduleCode : moduleCodeLists) {
				moduleList.add(userDto.getModuleDtoList().get(moduleCode));
			}

			// Edd Addition
			BranchEddMasterDto eddMasterDto = new BranchEddMasterDto();
			respDto = commonUtility.objectToJson(eddMasterDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + fetchAllTestDetails, respDto));
			eddMasterDto = objectMapper.readValue(respString, BranchEddMasterDto.class);
			user.setEddDto(eddMasterDto);
			user.setDeviceToken(user.getDeviceToken());
			session.removeAttribute("rolePosition");
			session.removeAttribute("moduleCode");
			model.addAttribute("user", user);
			model.addAttribute("roleMenuMap", userDto.getMenuMapList());
			model.addAttribute("AllRoleList", userDto.getAllRolesDtoList());
			model.addAttribute("defaultRole", user.getDefaultRoleList());
			model.addAttribute("roleModuleList", userDto.getRoleModuleMap());
			model.addAttribute("selectedroleModuleList", selectedRoleModuleMap);
			model.addAttribute("unSelectedroleModuleList", unselectedRoleModuleMap);
			model.addAttribute("moduleNameList", userDto.getModuleDtoList());
			model.addAttribute("moduleCodeList", moduleCodeLists);
			model.addAttribute("ruleFlg", ruleFlg);
			model.addAttribute("moduleList", moduleList);
		} catch (

		Exception e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

		return "roles";

	}

	@RequestMapping("/roleAction")
	public String roleAction(@ModelAttribute(name = "message") String message,
			@ModelAttribute(name = "source") String source,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes, HttpSession session)
			throws JsonMappingException, JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		RequestResponseJsonDto respDto = null;
		String requestString = "";
		requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
		UserDto userDto = new UserDto();
		userDto = objectMapper.readValue(requestString, UserDto.class);
		respDto = commonUtility.objectToJson(userDto);
		user.setUserPosition(userDto.getRoleName());
		user.setModuleCode(userDto.getModuleCode());
		session.setAttribute("rolePosition", userDto.getRoleName());
		session.setAttribute("moduleCode", userDto.getModuleCode());

		return "redirect:/home";

	}
}