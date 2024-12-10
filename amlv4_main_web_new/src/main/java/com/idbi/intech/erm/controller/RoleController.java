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
import java.util.Iterator;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.json.JSONObject;
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
import com.idbi.intech.erm.domain.app.AppParameterDto;
import com.idbi.intech.erm.domain.app.BenchmarkValueCaptureDto;
import com.idbi.intech.erm.domain.app.CodeMasterDto;
import com.idbi.intech.erm.domain.app.CommentDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.MenuDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.RoleMasterDto;
import com.idbi.intech.erm.domain.app.SubMenuDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.RoleService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class RoleController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchRoleList}")
	private String fetchRoleList;
	@Value("${app-url.createRole}")
	private String createRole;
	@Value("${app-url.viewModalRole}")
	private String viewModalRole;
	@Value("${app-url.editRole}")
	private String editRole;
	@Value("${app-url.fetchEditedRole}")
	private String fetchEditedRole;
	@Value("${app-url.approveRejectRoleData}")
	private String approveRejectRoleData;
	@Value("${app-url.viewParamValue}")
	private String viewParamValue;
	@Value("${app-url.fetchMenuList}")
	private String fetchMenuList;
	@Value("${app-url.fetchParamKeyList}")
	private String fetchParamKeyList;
	@Value("${app-url.fetchAppModuleList}")
	private String fetchAppModuleList;
	@Value("${app-url.fetchOfficeNameList}")
	private String fetchOfficeNameList;

	@Autowired
	private RoleService roleService;
	@Autowired
	private CommonUtility commonUtility;
	RequestResponseJsonDto respDto = null;
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;

	@RequestMapping("/mainRolePage")
	public String mainRolePage(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			@ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "sourceId") String sourceId) {

		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		RoleMasterDto roleDto = new RoleMasterDto();
		roleDto.setSearchParam("ALL");
		roleDto.setUserDept(user.getUserDept());
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			respDto = commonUtility.objectToJson(roleDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRoleList, respDto));
			roleDto = objectMapper.readValue(respString, RoleMasterDto.class);
			model.addAttribute("roleList", roleDto.getRoleList());
			model.addAttribute("user", user);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		if (null != sourceText && sourceText.equals("CREATE")) {
			messageText = "Role Created Successfully";
		} else if (null != sourceText && sourceText.equals("EDIT")) {
			messageText = "Role Modified Successfully";
		} else if (null != sourceText && sourceText.equals("CLOSE")) {
			messageText = "Role Closed Successfully";
		} else if (null != sourceText && sourceText.equals("CLOSEREJECT")) {
			messageText = "Kindly Create New Role Close Request";
		} else if (null != sourceText && sourceText.equals("ERROR")) {
			messageText = "Error Occured While Performing Action. Please Contact Your System Administrator";
		}
		model.addAttribute("message", messageText);
		model.addAttribute("userRole", user.getUserPosition());
		/* model.addAttribute("modulename", "RM"); */
		return "mainRolePage";
	}

	@RequestMapping("/createRole")
	public String createRole(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {

		List<MenuDto> menuList = new ArrayList<MenuDto>();
		List<AppParameterDto> paramKeyList = new ArrayList<AppParameterDto>();
		final ObjectMapper objectMapper = new ObjectMapper();
		CodeMasterDto codeMasterDto = new CodeMasterDto();
		RoleMasterDto roleDto = new RoleMasterDto();
		try {
			menuList = fetchMenuList();
			paramKeyList = fetchParamKeyList();
			codeMasterDto = fetchAppModuleList();
			// String posResponse = "Fetch";
			// respDto = commonUtility.objectToJson(posResponse);
		} catch (Exception e) {
			e.printStackTrace();
		}
		roleDto.setRoleId(commonUtility.getRolePrimaryKey());
		roleDto.setUserName(user.getUsername());
		model.addAttribute("recordStatus", "Create");
		model.addAttribute("roleDto", roleDto);
		model.addAttribute("menuList", menuList);
		model.addAttribute("paramKeyList", paramKeyList);
		model.addAttribute("codeMasterList", codeMasterDto.getCodeMasterList());

		return "createRole";
	}

	public BenchmarkValueCaptureDto fetchOfficeList() {

		BenchmarkValueCaptureDto benchmarkValueCaptureDto = new BenchmarkValueCaptureDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		respDto = commonUtility.objectToJson(benchmarkValueCaptureDto);
		String respString;
		try {
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchOfficeNameList, respDto));
			benchmarkValueCaptureDto = objectMapper.readValue(respString, BenchmarkValueCaptureDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return benchmarkValueCaptureDto;
	}

	@PostMapping("/createActionRole")
	public String createActionRole(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {

		HttpHeaders resHeaders = null;
		RoleMasterDto roleDto = new RoleMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		ResponseEntity<String> roleString = null;
		String requestString = "";
		try {
			// Encrypted JSON Request
			commonUtility.uploadFiles(multipartFile);
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			roleDto = objectMapper.readValue(requestString, RoleMasterDto.class);
			roleDto.setDepartmentId(user.getUserDept());
			roleDto.setMakerId(user.getUserId().toUpperCase());
			roleDto.setUserName(user.getUsername());
			userDto.setUserRole(user.getOmsOfficeType());
			roleDto.setUser(userDto);
			respDto = commonUtility.objectToJson(roleDto);
			roleString = commonUtility.webserviceConsume(uri + createRole, respDto);
			resHeaders = roleString.getHeaders();
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "CREATE");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}
		return "redirect:/mainRolePage";
	}

	@RequestMapping("/searchRoleList")
	public String searchRoleList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model) {

		RoleMasterDto roleDto = new RoleMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			roleDto = objectMapper.readValue(requestString, RoleMasterDto.class);
			UserDto userObj = new UserDto();
			userObj.setUsername(user.getUsername());
			userObj.setUserDept(user.getUserDept());
			userObj.setUserPosition(user.getUserPosition());
			userObj.setUserId(user.getUserId());
			roleDto.setUser(userObj);
			roleDto.setMakerId(user.getUserId());
			respDto = commonUtility.objectToJson(roleDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRoleList, respDto));
			roleDto = objectMapper.readValue(respString, RoleMasterDto.class);
			model.addAttribute("roleList", roleDto.getRoleList());
			model.addAttribute("user", user);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
		}
		return "mainRolePage";
	}

	/*
	 * @RequestMapping("/actionRole") public String
	 * actionRole(@AuthenticationPrincipal User user, @ModelAttribute(name =
	 * "sourceName") String sourceName,
	 * 
	 * @ModelAttribute(name = "sourceId") String sourceId, Model model) throws
	 * JsonParseException, JsonMappingException, IOException { final ObjectMapper
	 * objectMapper = new ObjectMapper(); RoleMasterDto roleDtoObj = new
	 * RoleMasterDto(); RoleMasterDto roleMDtoObj = new RoleMasterDto();
	 * RoleMasterDto roleDto = new RoleMasterDto(); List<MenuDto> menuList = new
	 * ArrayList<MenuDto>(); try { menuList = fetchMenuList();
	 * roleDtoObj.setRoleId(sourceId); roleDto =
	 * roleService.fetchDetails(roleDtoObj); if
	 * (roleDto.getStatusFlg().equalsIgnoreCase("D")) { RoleMasterDto roleMasterDto
	 * = new RoleMasterDto(); roleMasterDto = roleService.fetchDetails(roleDtoObj);
	 * roleMasterDto.setSourceName("createVerify"); String json =
	 * roleDto.getMenuJson(); List<MenuDto> selectedMenuList = new
	 * ArrayList<MenuDto>(); selectedMenuList = objectMapper.readValue(json, new
	 * TypeReference<List<MenuDto>>() { }); for (MenuDto menuDto : menuList) { for
	 * (MenuDto menuDtoSelected : selectedMenuList) { if
	 * (menuDto.getMenuId().equalsIgnoreCase(menuDtoSelected.getMenuId())) {
	 * menuDto.setMenuAction(menuDtoSelected.getMenuAction());
	 * menuDto.setCheckFlg("true"); } if (menuDto.getActionPath() == null) { if
	 * (menuDtoSelected.getActionPath() == null) { for (SubMenuDto subMenu :
	 * menuDto.getSubMenus()) { for (SubMenuDto subMenuSelected :
	 * menuDtoSelected.getSubMenus()) { if
	 * (subMenu.getMenuId().equalsIgnoreCase(subMenuSelected.getMenuId())) { if
	 * (subMenu.getSubMenuId() .equalsIgnoreCase(subMenuSelected.getSubMenuId())) {
	 * subMenu.setSubMenuAction(subMenuSelected.getSubMenuAction());
	 * subMenu.setCheckFlg("true"); } } } } } } } }
	 * model.addAttribute("recordStatus", "Pending Approval For Creation");
	 * model.addAttribute("sourceId", sourceId); model.addAttribute("roleDto",
	 * roleMasterDto); model.addAttribute("userName", user.getUsername());
	 * model.addAttribute("menuList", menuList); } else if
	 * (roleDto.getStatusFlg().equalsIgnoreCase("M")) { RoleMasterDto
	 * roleMasterDtoObj = new RoleMasterDto(); roleMDtoObj.setRoleId(sourceId);
	 * respDto = commonUtility.objectToJson(roleMDtoObj); final String respString =
	 * commonUtility .decryptedResToString(commonUtility.webserviceConsume(uri +
	 * fetchEditedRole, respDto)); roleMasterDtoObj =
	 * objectMapper.readValue(respString, RoleMasterDto.class);
	 * roleMasterDtoObj.setSourceName("editVerify"); String json =
	 * roleMasterDtoObj.getMenuJson(); List<MenuDto> selectedMenuList = new
	 * ArrayList<MenuDto>(); selectedMenuList = objectMapper.readValue(json, new
	 * TypeReference<List<MenuDto>>() { }); for (MenuDto menuDto : menuList) { for
	 * (MenuDto menuDtoSelected : selectedMenuList) { if
	 * (menuDto.getMenuId().equalsIgnoreCase(menuDtoSelected.getMenuId())) {
	 * menuDto.setMenuAction(menuDtoSelected.getMenuAction());
	 * menuDto.setCheckFlg("true"); } if (menuDto.getActionPath() == null) { if
	 * (menuDtoSelected.getActionPath() == null) { for (SubMenuDto subMenu :
	 * menuDto.getSubMenus()) { for (SubMenuDto subMenuSelected :
	 * menuDtoSelected.getSubMenus()) { if
	 * (subMenu.getMenuId().equalsIgnoreCase(subMenuSelected.getMenuId())) { if
	 * (subMenu.getSubMenuId() .equalsIgnoreCase(subMenuSelected.getSubMenuId())) {
	 * subMenu.setSubMenuAction(subMenuSelected.getSubMenuAction());
	 * subMenu.setCheckFlg("true"); } } } } } } } }
	 * model.addAttribute("recordStatus", "Pending Approval For Edit");
	 * model.addAttribute("sourceId", sourceId); model.addAttribute("roleDto",
	 * roleMasterDtoObj); model.addAttribute("userName", user.getUsername());
	 * model.addAttribute("menuList", menuList); } } catch (InvalidKeyException |
	 * UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
	 * | CertificateException | KeyStoreException | IllegalBlockSizeException |
	 * BadPaddingException | NoSuchProviderException |
	 * InvalidAlgorithmParameterException | IOException e) { e.printStackTrace(); }
	 * return "actionRole"; }
	 */

	/*
	 * @RequestMapping("/reviewRole") public String reviewRole(@ModelAttribute(name
	 * = "encryptedRequest") EncryptedRequestDto encryptedRequest,
	 * 
	 * @AuthenticationPrincipal User user, Model model, RedirectAttributes
	 * redirectAttributes,
	 * 
	 * @RequestParam("files[]") MultipartFile[] multipartFile) throws
	 * JsonProcessingException {
	 * 
	 * ResponseEntity<String> roleString = null; HttpHeaders resHeaders = null;
	 * String sourceTxt = ""; RoleMasterDto roleDto = new RoleMasterDto();
	 * ActivityLogDto logDto = new ActivityLogDto(); UserDto userDto = new
	 * UserDto(); final ObjectMapper objectMapper = new ObjectMapper(); String
	 * requestString = ""; StringBuilder initJson = new
	 * StringBuilder("{\"statusFlgOld\":\""); StringBuilder newJson = new
	 * StringBuilder("{\"statusFlg\":\""); try {
	 * commonUtility.uploadFiles(multipartFile); requestString =
	 * commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
	 * roleDto = objectMapper.readValue(requestString, RoleMasterDto.class);
	 * roleDto.setDepartmentId(user.getUserDept());
	 * roleDto.setMakerId(user.getUserId().toUpperCase());
	 * roleDto.setUserName(user.getUsername());
	 * userDto.setUserRole(user.getUserPosition()); roleDto.setUser(userDto); if
	 * (roleDto.getSourceName().equalsIgnoreCase("createVerify")) { if
	 * (roleDto.getRoleStatus().equalsIgnoreCase("A")) { if
	 * (roleDto.getStatusFlg().equalsIgnoreCase("A")) {
	 * initJson.append(roleDto.getStatusFlgOld()); newJson.append("\"A\"");
	 * logDto.setUserComments("ROLE APPROVED"); logDto.setActivityType("AR");
	 * roleDto.setCheckerId(user.getUserId()); sourceTxt = "APPROVEDRM"; } else if
	 * (roleDto.getStatusFlg().equalsIgnoreCase("R")) {
	 * initJson.append(roleDto.getStatusFlgOld()); newJson.append("\"R\"");
	 * logDto.setUserComments("ROLE REJECTED"); logDto.setActivityType("ZR");
	 * roleDto.getCommentDto().setCommentBy(user.getUserId());
	 * roleDto.getCommentDto().setModuleId(roleDto.getRoleId());
	 * roleDto.getCommentDto().setModuleName("RM");
	 * roleDto.setCheckerId(user.getUserId()); sourceTxt = "REJECTEDRM"; } } else if
	 * (roleDto.getRoleStatus().equalsIgnoreCase("I")) { if
	 * (roleDto.getStatusFlg().equalsIgnoreCase("A")) {
	 * initJson.append(roleDto.getStatusFlgOld()); newJson.append("\"A'\"");
	 * logDto.setUserComments("ROLE APPROVED"); logDto.setActivityType("AR");
	 * roleDto.setCheckerId(user.getUserId()); sourceTxt = "APPROVEDRM"; } else if
	 * (roleDto.getStatusFlg().equalsIgnoreCase("R")) {
	 * initJson.append(roleDto.getStatusFlgOld()); newJson.append("\"R\"");
	 * logDto.setUserComments("ROLE REJECTED"); logDto.setActivityType("ZR");
	 * roleDto.getCommentDto().setCommentBy(user.getUserId());
	 * roleDto.getCommentDto().setModuleId(roleDto.getRoleId());
	 * roleDto.getCommentDto().setModuleName("RM");
	 * roleDto.setCheckerId(user.getUserId()); //
	 * roleDto.setSourceName("editRejectRM"); sourceTxt = "REJECTEDRM"; } } } else
	 * if (roleDto.getSourceName().equalsIgnoreCase("editVerify")) { if
	 * (roleDto.getRoleStatus().equalsIgnoreCase("A")) { if
	 * (roleDto.getStatusFlg().equalsIgnoreCase("A")) {
	 * initJson.append(roleDto.getStatusFlgOld()); newJson.append("\"A\"");
	 * logDto.setUserComments("ROLE EDITED APPROVED"); logDto.setActivityType("EA");
	 * roleDto.setCheckerId(user.getUserId()); sourceTxt = "APPROVEDERM"; } else if
	 * (roleDto.getStatusFlg().equalsIgnoreCase("R")) {
	 * initJson.append(roleDto.getStatusFlgOld()); newJson.append("\"R\"");
	 * logDto.setUserComments("ROLE EDIT REJECTED"); logDto.setActivityType("EZ");
	 * roleDto.getCommentDto().setCommentBy(user.getUserId());
	 * roleDto.getCommentDto().setModuleId(roleDto.getRoleId());
	 * roleDto.getCommentDto().setModuleName("RM");
	 * roleDto.setCheckerId(user.getUserId()); //
	 * roleDto.setSourceName("editRejectRM"); sourceTxt = "REJECTEDERM"; } } else if
	 * (roleDto.getRoleStatus().equalsIgnoreCase("I")) { if
	 * (roleDto.getStatusFlg().equalsIgnoreCase("A")) {
	 * initJson.append(roleDto.getStatusFlgOld()); newJson.append("\"A\"");
	 * logDto.setUserComments("ROLE EDITED APPROVED"); logDto.setActivityType("EA");
	 * roleDto.setCheckerId(user.getUserId()); sourceTxt = "APPROVEDERM"; } else if
	 * (roleDto.getStatusFlg().equalsIgnoreCase("R")) {
	 * initJson.append(roleDto.getStatusFlgOld()); newJson.append("\"R\"");
	 * logDto.setUserComments("ROLE EDIT REJECTED"); logDto.setActivityType("EZ");
	 * roleDto.getCommentDto().setCommentBy(user.getUserId());
	 * roleDto.getCommentDto().setModuleId(roleDto.getRoleId());
	 * roleDto.getCommentDto().setModuleName("RM");
	 * roleDto.setCheckerId(user.getUserId()); //
	 * roleDto.setSourceName("editRejectRM"); sourceTxt = "REJECTEDERM"; } } }
	 * initJson.append("}"); newJson.append("}");
	 * logDto.setActivityImpactTblKey(roleDto.getRoleId());
	 * logDto.setInitJson(initJson.toString());
	 * logDto.setModJson(newJson.toString());
	 * logDto.setUserId(user.getUserId().toString());
	 * logDto.setTableName("ROLE MASTER"); roleDto.setActivityLogDto(logDto);
	 * roleDto.setUserRole(user.getUserPosition()); respDto =
	 * commonUtility.objectToJson(roleDto); roleString =
	 * commonUtility.webserviceConsume(uri + approveRejectRoleData, respDto);
	 * resHeaders = roleString.getHeaders(); } catch (InvalidKeyException |
	 * UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
	 * | CertificateException | KeyStoreException | IllegalBlockSizeException |
	 * BadPaddingException | NoSuchProviderException |
	 * InvalidAlgorithmParameterException | IOException e) { e.printStackTrace(); }
	 * finally { if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
	 * redirectAttributes.addFlashAttribute("source", sourceTxt); } else {
	 * redirectAttributes.addFlashAttribute("source", "ERROR"); } } return
	 * "redirect:/home"; }
	 */

	@RequestMapping("/editRole")
	public String editRole(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model) {

		final ObjectMapper objectMapper = new ObjectMapper();
		RoleMasterDto roleDto = new RoleMasterDto();
		List<MenuDto> menuList = new ArrayList<MenuDto>();
		List<AppParameterDto> paramKeyList = new ArrayList<AppParameterDto>();
		List<AppParameterDto> paramKeySelected = new ArrayList<AppParameterDto>();
		List<CodeMasterDto> codeMasterDtoSelected = new ArrayList<CodeMasterDto>();
		List<CodeMasterDto> codeMasterDtoOfcSelected = new ArrayList<CodeMasterDto>();
		List<CodeMasterDto> codeMasterDtoList = new ArrayList<CodeMasterDto>();
		List<CodeMasterDto> codeMasterDtoOfcList = new ArrayList<CodeMasterDto>();

		CodeMasterDto codeMasterDto = new CodeMasterDto();
		BenchmarkValueCaptureDto benchmarkValueCaptureDto = new BenchmarkValueCaptureDto();
		String requestString = "";
		List<String> values = new ArrayList<String>();
		JSONObject json = null;
		try {
			menuList = fetchMenuList();
			paramKeyList = fetchParamKeyList();
			codeMasterDto = fetchAppModuleList();
			// benchmarkValueCaptureDto = fetchOfficeList();
		//	codeMasterDtoOfcList.addAll(benchmarkValueCaptureDto.getCodeMasterDtoList());
			codeMasterDtoList.addAll(codeMasterDto.getCodeMasterList());
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			roleDto = objectMapper.readValue(requestString, RoleMasterDto.class);
			respDto = commonUtility.objectToJson(roleDto);
			String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewModalRole, respDto));
			roleDto = objectMapper.readValue(respString, RoleMasterDto.class);

			if (roleDto.getModuleCode() != null) {
				String[] codeValues = roleDto.getModuleCode().split(",");
				for (String codeValue : codeValues) {
					for (CodeMasterDto codeMasterValue : codeMasterDto.getCodeMasterList()) {
						if (codeMasterValue.getCodeValue().equalsIgnoreCase(codeValue)) {
							codeMasterDtoSelected.add(codeMasterValue);
							codeMasterDtoList.remove(codeMasterValue);
						}
					}
				}

			}
			/*
			 * if (roleDto.getRoleOfcAvailability() != null) { String[] ofcValues =
			 * roleDto.getRoleOfcAvailability().split(","); for (String ofcValue :
			 * ofcValues) { for (CodeMasterDto codeMasterValue :
			 * benchmarkValueCaptureDto.getCodeMasterDtoList()) { if
			 * (codeMasterValue.getCodeValue().equalsIgnoreCase(ofcValue)) {
			 * codeMasterDtoOfcSelected.add(codeMasterValue);
			 * codeMasterDtoOfcList.remove(codeMasterValue); } } } }
			 */

			String existingParamKey = roleDto.getRoleCategory().trim();
			for (AppParameterDto paramkey : paramKeyList) {
				if (paramkey.getParamKey().equalsIgnoreCase(existingParamKey)) {
					paramKeySelected.add(paramkey);
				}
			}
			paramKeyList.removeAll(paramKeySelected);
			String paramValues = paramKeySelected.get(0).getParamValue();
			try {
				json = new JSONObject(paramValues);
				Iterator<String> keys = json.keys();
				while (keys.hasNext()) {
					Object key = keys.next();
					values.add(json.getString((String) key));
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			String menuJson = roleDto.getMenuJson();
			List<MenuDto> selectedMenuList = new ArrayList<MenuDto>();
			selectedMenuList = objectMapper.readValue(menuJson, new TypeReference<List<MenuDto>>() {
			});
			for (MenuDto menuDto : menuList) {
				for (MenuDto menuDtoSelected : selectedMenuList) {
					if (menuDto.getMenuId().equalsIgnoreCase(menuDtoSelected.getMenuId())) {
						try {
							if (menuDtoSelected.getMenuAction() != null) {
								List<String> mArray = menuDtoSelected.getMenuAction();
								List<String> selectedMenuArray = new ArrayList<String>();
								for (String array : mArray) {
									String actValue = array.split("~")[0];
									selectedMenuArray.add(actValue);
								}
								menuDto.setMenuAction(selectedMenuArray);
							}
							menuDto.setMenuName(menuDtoSelected.getMenuName());
							menuDto.setCheckFlg("true");
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					if (menuDto.getActionPath() == null) {
						if (menuDtoSelected.getActionPath() == null) {
							for (SubMenuDto subMenu : menuDto.getSubMenus()) {
								for (SubMenuDto subMenuSelected : menuDtoSelected.getSubMenus()) {
									if (subMenu.getMenuId().equalsIgnoreCase(subMenuSelected.getMenuId())) {
										if (subMenu.getSubMenuId().equalsIgnoreCase(subMenuSelected.getSubMenuId())) {
											System.out.println(" ubMenuSelected.getSubMenuAction() = "
													+ subMenuSelected.getSubMenuAction());
											List<String> sArray = subMenuSelected.getSubMenuAction();
											List<String> selectedArray = new ArrayList<String>();
											for (String arr : sArray) {
												String value = arr.split("~")[0];
												selectedArray.add(value);
											}

											System.out.println(" selectedArray = " + selectedArray);
											subMenu.setSubMenuAction(selectedArray);
											subMenu.setCheckFlg("true");

										}
									}
								}
							}
						}
					}
				}
			}
			roleDto.setSourceName("edit");
			roleDto.setMakerId(user.getUserId());
			roleDto.setDepartmentId(user.getUserDept());

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		model.addAttribute("recordStatus", "Edit");
		model.addAttribute("paramKeySelected", paramKeySelected);
		model.addAttribute("actionValues", values);
		model.addAttribute("paramKeyList", paramKeyList);
		model.addAttribute("roleDto", roleDto);
		model.addAttribute("menuList", menuList);
		model.addAttribute("userName", user.getUsername().toLowerCase());
		model.addAttribute("codeMasterList", codeMasterDtoList);
		model.addAttribute("codeMasterDtoSelected", codeMasterDtoSelected);
		// model.addAttribute("officeNameList", codeMasterDtoOfcList);
		// model.addAttribute("officeNameListSelected", codeMasterDtoOfcSelected);

		return "editRolePage";
	}

	@RequestMapping("/editActionRole")
	public String editActionRole(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) {

		HttpHeaders resHeaders = null;
		RoleMasterDto roleDto = new RoleMasterDto();
		CommentDto commentDto = new CommentDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> roleString = null;
		UserDto userDto = new UserDto();
		String requestString = "";
		try {
			commonUtility.uploadFiles(multipartFile);
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			roleDto = objectMapper.readValue(requestString, RoleMasterDto.class);

			roleDto.setMakerId(user.getUserId().toUpperCase());
			commentDto.setComment(roleDto.getCommentDto().getComment());
			commentDto.setCommentBy(user.getUserId().toUpperCase());
			commentDto.setModuleId(roleDto.getRoleId());
			commentDto.setModuleName("RM");
			roleDto.setCommentDto(commentDto);
			roleDto.setDepartmentId(user.getUserDept());
			roleDto.setUserRole(user.getOmsOfficeType());
			roleDto.setMakerId(user.getUserId().toUpperCase());
			roleDto.setUserName(user.getUsername());
			userDto.setUserRole(user.getOmsOfficeType());
			roleDto.setUser(userDto);
			respDto = commonUtility.objectToJson(roleDto);
			roleString = commonUtility.webserviceConsume(uri + editRole, respDto);
			resHeaders = roleString.getHeaders();
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "EDIT");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}
		return "redirect:/mainRolePage";
	}

	@RequestMapping("/editRejectRole")
	public String editRejectRole(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "sourceId") String sourceId) {

		final ObjectMapper objectMapper = new ObjectMapper();
		RoleMasterDto roleDto = new RoleMasterDto();
		List<MenuDto> menuList = new ArrayList<MenuDto>();
		List<AppParameterDto> paramKeyList = new ArrayList<AppParameterDto>();
		List<AppParameterDto> paramKeySelected = new ArrayList<AppParameterDto>();
		List<String> values = new ArrayList<String>();
		UserDto userDto = new UserDto();
		JSONObject json = null;
		try {
			menuList = fetchMenuList();
			paramKeyList = fetchParamKeyList();
			roleDto.setRoleId(sourceId);
			if (sourceName.equalsIgnoreCase("editRejectRM")) {
				respDto = commonUtility.objectToJson(roleDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchEditedRole, respDto));
				roleDto = objectMapper.readValue(respString, RoleMasterDto.class);
				String existingParamKey = roleDto.getRoleCategory().trim();
				for (AppParameterDto paramkey : paramKeyList) {
					if (paramkey.getParamKey().equalsIgnoreCase(existingParamKey)) {
						paramKeySelected.add(paramkey);
					}
				}
				paramKeyList.removeAll(paramKeySelected);
				String paramValues = paramKeySelected.get(0).getParamValue();
				try {
					json = new JSONObject(paramValues);
					Iterator<String> keys = json.keys();
					while (keys.hasNext()) {
						Object key = keys.next();
						values.add(json.getString((String) key));
					}
				} catch (Exception e) {
					e.printStackTrace();
				}

				String menuJson = roleDto.getMenuJson();
				List<MenuDto> selectedMenuList = new ArrayList<MenuDto>();
				selectedMenuList = objectMapper.readValue(menuJson, new TypeReference<List<MenuDto>>() {
				});
				for (MenuDto menuDto : menuList) {
					for (MenuDto menuDtoSelected : selectedMenuList) {
						if (menuDto.getMenuId().equalsIgnoreCase(menuDtoSelected.getMenuId())) {
							try {
								if (menuDtoSelected.getMenuAction() != null) {
									List<String> mArray = menuDtoSelected.getMenuAction();
									List<String> selectedMenuArray = new ArrayList<String>();
									for (String array : mArray) {
										String actValue = array.split("~")[0];
										selectedMenuArray.add(actValue);
									}
									menuDto.setMenuAction(selectedMenuArray);
								}
								menuDto.setMenuName(menuDtoSelected.getMenuName());
								menuDto.setCheckFlg("true");
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
						if (menuDto.getActionPath() == null) {
							if (menuDtoSelected.getActionPath() == null) {
								for (SubMenuDto subMenu : menuDto.getSubMenus()) {
									for (SubMenuDto subMenuSelected : menuDtoSelected.getSubMenus()) {
										if (subMenu.getMenuId().equalsIgnoreCase(subMenuSelected.getMenuId())) {
											if (subMenu.getSubMenuId()
													.equalsIgnoreCase(subMenuSelected.getSubMenuId())) {
												List<String> sArray = subMenuSelected.getSubMenuAction();
												List<String> selectedArray = new ArrayList<String>();
												for (String arr : sArray) {
													String value = arr.split("~")[0];
													selectedArray.add(value);
												}
												subMenu.setSubMenuAction(selectedArray);
												subMenu.setCheckFlg("true");
											}
										}
									}
								}
							}
						}
					}
				}
				model.addAttribute("recordStatus", "Rejected Edit Request");
				model.addAttribute("sourceId", sourceId);
				model.addAttribute("roleDto", roleDto);
				model.addAttribute("userName", user.getUsername());
				model.addAttribute("actionValues", values);
				model.addAttribute("menuList", menuList);
				model.addAttribute("paramKeySelected", paramKeySelected);
				model.addAttribute("paramKeyList", paramKeyList);
			} else {

				respDto = commonUtility.objectToJson(roleDto);
				String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + viewModalRole, respDto));
				roleDto = objectMapper.readValue(respString, RoleMasterDto.class);
				String existingParamKey = roleDto.getRoleCategory().trim();
				for (AppParameterDto paramkey : paramKeyList) {
					if (paramkey.getParamKey().equalsIgnoreCase(existingParamKey)) {
						paramKeySelected.add(paramkey);
					}
				}
				paramKeyList.removeAll(paramKeySelected);
				String paramValues = paramKeySelected.get(0).getParamValue();
				try {
					json = new JSONObject(paramValues);
					Iterator<String> keys = json.keys();
					while (keys.hasNext()) {
						Object key = keys.next();
						values.add(json.getString((String) key));
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				String menuJson = roleDto.getMenuJson();
				List<MenuDto> selectedMenuList = new ArrayList<MenuDto>();
				selectedMenuList = objectMapper.readValue(menuJson, new TypeReference<List<MenuDto>>() {
				});
				for (MenuDto menuDto : menuList) {
					for (MenuDto menuDtoSelected : selectedMenuList) {
						if (menuDto.getMenuId().equalsIgnoreCase(menuDtoSelected.getMenuId())) {
							try {
								if (menuDtoSelected.getMenuAction() != null) {
									List<String> mArray = menuDtoSelected.getMenuAction();
									List<String> selectedMenuArray = new ArrayList<String>();
									for (String array : mArray) {
										String actValue = array.split("~")[0];
										selectedMenuArray.add(actValue);
									}
									menuDto.setMenuAction(selectedMenuArray);
								}
								menuDto.setCheckFlg("true");
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
						if (menuDto.getActionPath() == null) {
							if (menuDtoSelected.getActionPath() == null) {
								for (SubMenuDto subMenu : menuDto.getSubMenus()) {
									for (SubMenuDto subMenuSelected : menuDtoSelected.getSubMenus()) {
										if (subMenu.getMenuId().equalsIgnoreCase(subMenuSelected.getMenuId())) {
											if (subMenu.getSubMenuId()
													.equalsIgnoreCase(subMenuSelected.getSubMenuId())) {
												List<String> sArray = subMenuSelected.getSubMenuAction();
												List<String> selectedArray = new ArrayList<String>();
												for (String arr : sArray) {
													String value = arr.split("~")[0];
													selectedArray.add(value);
												}
												subMenu.setSubMenuAction(selectedArray);
												subMenu.setCheckFlg("true");
											}
										}
									}
								}
							}
						}
					}
				}
				roleDto.setMakerId(user.getUserId());
				roleDto.setUserName(user.getUsername());
				userDto.setUserRole(user.getUserPosition());
				roleDto.setUser(userDto);

				model.addAttribute("recordStatus", "Edit");
				model.addAttribute("paramKeySelected", paramKeySelected);
				model.addAttribute("actionValues", values);
				model.addAttribute("paramKeyList", paramKeyList);
				model.addAttribute("roleDto", roleDto);
				model.addAttribute("menuList", menuList);
				model.addAttribute("userName", user.getUsername().toLowerCase());
			}
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		}
		return "editRolePage";
	}

	@RequestMapping(value = "/viewRole")
	@ResponseBody
	public RoleMasterDto viewRole(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		RoleMasterDto roleDto = new RoleMasterDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			roleDto = objectMapper.readValue(pageValJson, RoleMasterDto.class);
			roleDto.setUserRole(user.getUserPosition());
			roleDto = roleService.fetchDetails(roleDto);
			List<MenuDto> menuList = new ArrayList<MenuDto>();
			menuList = fetchMenuList();
			List<MenuDto> selectedMenuList = new ArrayList<MenuDto>();
			selectedMenuList = objectMapper.readValue(roleDto.getMenuJson(), new TypeReference<List<MenuDto>>() {
			});
			for (MenuDto menuDto : menuList) {
				for (MenuDto menuDtoSelected : selectedMenuList) {
					if (menuDto.getMenuId().equalsIgnoreCase(menuDtoSelected.getMenuId())) {
						menuDto.setMenuAction(menuDtoSelected.getMenuAction());
						menuDto.setCheckFlg("true");
					}
					if (menuDto.getActionPath() == null) {
						if (menuDtoSelected.getActionPath() == null) {
							for (SubMenuDto subMenu : menuDto.getSubMenus()) {
								for (SubMenuDto subMenuSelected : menuDtoSelected.getSubMenus()) {
									if (subMenu.getMenuId().equalsIgnoreCase(subMenuSelected.getMenuId())) {
										if (subMenu.getSubMenuId().equalsIgnoreCase(subMenuSelected.getSubMenuId())) {
											subMenu.setSubMenuAction(subMenuSelected.getSubMenuAction());
											subMenu.setCheckFlg("true");
										}
									}
								}
							}
						}
					}
				}
			}
			roleDto.setMenus(menuList);
		} catch (Exception e) {

			e.printStackTrace();
		}
		return roleDto;
	}

	public List<MenuDto> fetchMenuList() throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		List<MenuDto> menuDtoList = new ArrayList<MenuDto>();
		try {
			String menuResponse = "Fetch";
			respDto = commonUtility.objectToJson(menuResponse);
			final String menuListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchMenuList, respDto));
			menuDtoList = objectMapper.readValue(menuListStr, new TypeReference<List<MenuDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return menuDtoList;
	}

	public List<AppParameterDto> fetchParamKeyList() throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		List<AppParameterDto> paramKeyList = new ArrayList<AppParameterDto>();
		try {
			String response = "Fetch";
			respDto = commonUtility.objectToJson(response);
			final String paramListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchParamKeyList, respDto));
			paramKeyList = objectMapper.readValue(paramListStr, new TypeReference<List<AppParameterDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return paramKeyList;
	}

	public CodeMasterDto fetchAppModuleList() throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		CodeMasterDto codeMasterDto = new CodeMasterDto();
		try {
			// String response = "Fetch";
			// respDto = commonUtility.objectToJson(response);
			final String codeMasterListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAppModuleList, respDto));

			codeMasterDto = objectMapper.readValue(codeMasterListStr, CodeMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return codeMasterDto;
	}

	@RequestMapping(value = "/viewParamValue")
	@ResponseBody
	public AppParameterDto viewParamValue(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		AppParameterDto paramDto = new AppParameterDto();
		List<MenuDto> menuList = new ArrayList<MenuDto>();
		try {
			menuList = fetchMenuList();
			paramDto.setMenus(menuList);

			String pageValJson = request.getParameter("pageValJson");
			paramDto = objectMapper.readValue(pageValJson, AppParameterDto.class);
			respDto = commonUtility.objectToJson(paramDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewParamValue, respDto));
			paramDto = objectMapper.readValue(respString, new TypeReference<AppParameterDto>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();

		}

		return paramDto;

	}

}
