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
import java.util.List;

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
import com.idbi.intech.erm.domain.app.ActivityLogDto;
import com.idbi.intech.erm.domain.app.CommentDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.MenuDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.service.SessionKeyEncryptorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class MenuController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.mainMenu}")
	private String mainMenu;
	@Value("${app-url.viewMenuDetails}")
	private String viewMenuDetails;
	@Value("${app-url.createMenu}")
	private String createMenu;
	@Value("${app-url.editMenuMaster}")
	private String editMenuMaster;
	@Value("${app-url.reviewMenu}")
	private String reviewMenu;
	@Value("${app-url.approveRejectMenu}")
	private String approveRejectMenu;
	@Value("${app-url.checkWorkFlowExist}")
	private String checkWorkFlowExist;
	@Value("${app-url.editedMenufetch}")
	private String editedMenufetch;
	@Value("${app-url.reviewEditedMenu}")
	private String reviewEditedMenu;
	@Value("${app-url.fetchMenusDetails}")
	private String fetchMenusDetails;
	@Value("${app-url.fetchMenuType}")
	private String fetchMenuType;
	@Value("${app-url.fetchsubMenuType}")
	private String fetchsubMenuType;
	@Value("${app-url.fetchModuleName}")
	private String fetchModuleName;

	@Autowired
	private CommonUtility commonUtility;
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;

	// SessionKeyEncryptor Object
	@Autowired
	private SessionKeyEncryptorService sessionKeyEncrypt;

	RequestResponseJsonDto respDto = null;
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;

	@RequestMapping("/createMenu")
	public String createMenu(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws IOException {
		MenuDto menuDto = new MenuDto();
		menuDto.setMenuId(pkGenerator.getAppPrimaryKey());
		menuDto.setUserName(user.getUsername());
		model.addAttribute("menuType", this.fetchMenuType());
		model.addAttribute("submenuType", this.fetchSubmenuType());
		System.out.println("Submenu Type "+ this.fetchSubmenuType());
		model.addAttribute("moduleNameList", this.fetchModuleName());
		model.addAttribute("menuMaster", menuDto);
		return "createMenu";

	}

	@PostMapping("/saveMenu")
	public String saveMenu(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		// RiskAppetiteMasterDto rasMaster = new RiskAppetiteMasterDto();

		MenuDto menuDto = new MenuDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> rasString = null;
		String requestString = "";
		try {
			// Encrypted JSON Request
			commonUtility.uploadFiles(multipartFile);

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());

			menuDto = objectMapper.readValue(requestString, MenuDto.class);
			menuDto.setMakerId(user.getUserId().toUpperCase());
			menuDto.setUserRole(user.getUserPosition().toUpperCase());		
			/*
			 * rasMaster.setApproverId(user.getUserId().toUpperCase());
			 * rasMaster.setCheckerId(user.getUserId().toUpperCase());
			 */
			respDto = commonUtility.objectToJson(menuDto);
			// User Validation
			rasString = commonUtility.webserviceConsume(uri + createMenu, respDto);
			resHeaders = rasString.getHeaders();
			// Logger needs to ADD
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
		return "redirect:/mainMenu";

	}

	// fetchMenuType
	public List<MenuDto> fetchMenuType() throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		List<MenuDto> menuTypeList = new ArrayList<MenuDto>();
		try {
			String menuResponse = "Fetch";
			respDto = commonUtility.objectToJson(menuResponse);
			final String menuListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchMenuType, respDto));
			menuTypeList = objectMapper.readValue(menuListStr, new TypeReference<List<MenuDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return menuTypeList;
	}

	// fetchSubmenuType
	public List<MenuDto> fetchSubmenuType() throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		List<MenuDto> menuTypeList = new ArrayList<MenuDto>();
		try {
			String menuResponse = "Fetch";
			respDto = commonUtility.objectToJson(menuResponse);
			final String menuListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchsubMenuType, respDto));
			menuTypeList = objectMapper.readValue(menuListStr, new TypeReference<List<MenuDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return menuTypeList;
	}

	public List<MenuDto> fetchModuleName() throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		List<MenuDto> menuTypeList = new ArrayList<MenuDto>();
		try {
			String menuResponse = "Fetch";
			respDto = commonUtility.objectToJson(menuResponse);
			final String menuListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchModuleName, respDto));
			menuTypeList = objectMapper.readValue(menuListStr, new TypeReference<List<MenuDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return menuTypeList;
	}

	@RequestMapping("/mainMenu")
	public String mainMenu(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			HttpSession session) {
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";

		MenuDto menuDto = new MenuDto();
		menuDto.setSearchParam("ALL");
		menuDto.setMakerId(user.getUserId());

		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			respDto = commonUtility.objectToJson(menuDto);
			// Fetch Risk Appetite List

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + mainMenu, respDto));
			menuDto = objectMapper.readValue(respString, MenuDto.class);
			model.addAttribute("menuList", menuDto.getMenuList());
			model.addAttribute("user", user);
			model.addAttribute("modulename", "MM");
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
			// Logger needs to ADD
		}

		if (null != sourceText && sourceText.equals("CREATE")) {
			messageText = "Menu Created Successfully";
		} else if (null != sourceText && sourceText.equals("EDIT")) {
			messageText = "Menu Modified Successfully";
		} else if (null != sourceText && sourceText.equals("CLOSE")) {
			messageText = "Menu Close Request Sent For Verification";
		} else if (null != sourceText && sourceText.equals("ERROR")) {
			messageText = "Error Occured While Performing Action. Please Contact Your System Adminitrator";
		}

		model.addAttribute("message", messageText);
		model.addAttribute("userRole", user.getUserPosition());

		ArrayList<String> menuButtonList = new ArrayList<String>();
		String modulename = "MM";
		menuButtonList = commonUtility.getMenuBtnData(modulename, session);
		model.addAttribute("btnName", menuButtonList);

		return "mainMenu";
	}

	@RequestMapping("/editMenu")
	public String editMenu(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		MenuDto menuDto = new MenuDto();
		String requestString = "";

		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			menuDto = objectMapper.readValue(requestString, MenuDto.class);
			respDto = commonUtility.objectToJson(menuDto);
			String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewMenuDetails, respDto));

			menuDto = objectMapper.readValue(respString, MenuDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		}
		// model.addAttribute("getDeptList", riskAppetiteDto.getDeptList());

		menuDto.setUserName(user.getUsername().toLowerCase());
		model.addAttribute("menuMaster", menuDto);
		boolean isActionPath = false;
		isActionPath = menuDto.getActionPath() != null ? false : true;

		model.addAttribute("isActionPath", isActionPath);
		model.addAttribute("userName", user.getUsername().toLowerCase());

		model.addAttribute("menuType", this.fetchMenuType());
		List<MenuDto> menuTypeList = this.fetchMenuType();
		
		model.addAttribute("submenuType", this.fetchSubmenuType());
		model.addAttribute("moduleNameList", this.fetchModuleName());

		
		System.out.println("Menu Master "+ menuDto);
		return "editMenuPage";

	}

	@RequestMapping("/editMenuMaster")
	public String editMenuMaster(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) {

		HttpHeaders resHeaders = null;
		MenuDto menuDto = new MenuDto();
		CommentDto commentDto = new CommentDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> rasString = null;
		// String headerResponse = "";
		String requestString = "";

		try {
			// Encrypted JSON Request
			commonUtility.uploadFiles(multipartFile);

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());

			menuDto = objectMapper.readValue(requestString, MenuDto.class);

			menuDto.setMakerId(user.getUserId().toUpperCase());
			commentDto.setComment(menuDto.getCommentDto().getComment());
			commentDto.setCommentBy(user.getUserId().toUpperCase());
			commentDto.setModuleId(menuDto.getMenuId());
			commentDto.setModuleName("MM");
			// commentDto.setActivityId(riskAppetiteDto.getActivityLogDto().getActivityId());
			menuDto.setCommentDto(commentDto);
			// riskAppetiteDto.setUserRole(user.getUserPosition());
			respDto = commonUtility.objectToJson(menuDto);

			rasString = commonUtility.webserviceConsume(uri + editMenuMaster, respDto);

			resHeaders = rasString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {

			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "EDIT");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}

		return "redirect:/mainMenu";

	}

	@RequestMapping("/actionMenu")
	public String actionMenu(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "sourceId") String sourceId) {
		final ObjectMapper objectMapper = new ObjectMapper();

		MenuDto menuDto = new MenuDto();

		try {
			menuDto.setUserDept(user.getUserDept());
			menuDto.setMakerId(user.getUserId().toUpperCase());
			if (sourceName.equals("") && sourceId.equals("")) {

				model.addAttribute("sourceName", "");
				model.addAttribute("sourceId", "nullvalue");
			} else {
				model.addAttribute("sourceName", sourceName);
				model.addAttribute("sourceId", sourceId);
				menuDto.setMenuId(sourceId);
			}

			if (sourceName.equalsIgnoreCase("EDIT")) {

				model.addAttribute("menuStatus", "Pending  Approval for Edit");
				respDto = commonUtility.objectToJson(menuDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + editedMenufetch, respDto));
				model.addAttribute("menuMaster", objectMapper.readValue(respString, MenuDto.class));

			} else {
				model.addAttribute("menuStatus", "Pending  Approval for Create");
				respDto = commonUtility.objectToJson(menuDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + viewMenuDetails, respDto));
				menuDto = objectMapper.readValue(respString, MenuDto.class);
				model.addAttribute("menuMaster", menuDto);

			}

			menuDto.setUserName(user.getUsername().toLowerCase());
			model.addAttribute("userName", user.getUsername().toLowerCase());

			boolean isActionPath = false;
			isActionPath = menuDto.getActionPath() != null ? false : true;

			model.addAttribute("isActionPath", isActionPath);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "actionMenu";

	}

	// createRejectMenu
	@RequestMapping("/createRejectMenu")
	public String createRejectMenu(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "sourceId") String sourceId) {
		final ObjectMapper objectMapper = new ObjectMapper();

		MenuDto menuDto = new MenuDto();

		try {
			menuDto.setUserDept(user.getUserDept());
			menuDto.setMakerId(user.getUserId().toUpperCase());
			if (sourceName.equals("") && sourceId.equals("")) {

				model.addAttribute("sourceName", "");
				model.addAttribute("sourceId", "nullvalue");
			} else {
				model.addAttribute("sourceName", sourceName);
				model.addAttribute("sourceId", sourceId);
				menuDto.setMenuId(sourceId);
			}

			model.addAttribute("menuStatus", "Request Rejected for Create");
			respDto = commonUtility.objectToJson(menuDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewMenuDetails, respDto));
			menuDto = objectMapper.readValue(respString, MenuDto.class);
			model.addAttribute("menuMaster", menuDto);
			menuDto.setUserName(user.getUsername().toLowerCase());
			model.addAttribute("userName", user.getUsername().toLowerCase());

			model.addAttribute("menuType", this.fetchMenuType());
			model.addAttribute("moduleNameList", this.fetchModuleName());

			boolean isActionPath = false;
			isActionPath = menuDto.getActionPath() != null ? false : true;

			model.addAttribute("isActionPath", isActionPath);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "createRejectMenu";

	}

	// reviewMenu
	@RequestMapping("/reviewMenu")
	public String reviewMenu(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {

		ResponseEntity<String> roleString = null;
		HttpHeaders resHeaders = null;
		String sourceTxt = "";
		MenuDto menuDto = new MenuDto();
		// RoleMasterDto roleDto = new RoleMasterDto();
		ActivityLogDto logDto = new ActivityLogDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		StringBuilder initJson = new StringBuilder("{\"statusFlg\"=");
		StringBuilder newJson = new StringBuilder("{\"statusFlg\"=");
		try {
			commonUtility.uploadFiles(multipartFile);
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			menuDto = objectMapper.readValue(requestString, MenuDto.class);
			menuDto.setMakerId(user.getUserId().toUpperCase());
			if (menuDto.getSourceName().equalsIgnoreCase("create")) {

				if (menuDto.getMenuRecordStatus().equalsIgnoreCase("A")) {
					initJson.append(menuDto.getMenuStatusOld());
					newJson.append("\"A\"");
					logDto.setUserComments("MENU APPROVED");
					logDto.setActivityType("AR");
					menuDto.setCheckerId(user.getUserId());
					sourceTxt = "APPROVEDMM";

				} else if (menuDto.getMenuRecordStatus().equalsIgnoreCase("R")) {
					initJson.append(menuDto.getMenuStatusOld());
					newJson.append("\"R\"");
					logDto.setUserComments("MENU REJECTED");
					logDto.setActivityType("ZR");
					menuDto.getCommentDto().setCommentBy(user.getUserId());
					menuDto.getCommentDto().setModuleId(menuDto.getMenuId());
					menuDto.getCommentDto().setModuleName("MM");
					menuDto.setCheckerId(user.getUserId());
					sourceTxt = "REJECTEDMM";

				}

			} else if (menuDto.getSourceName().equalsIgnoreCase("edit")) {

				if (menuDto.getMenuRecordStatus().equalsIgnoreCase("A")) {
					initJson.append(menuDto.getMenuStatusOld());
					newJson.append("\"A\"");
					logDto.setUserComments("MENU EDITED APPROVED");
					logDto.setActivityType("AR");
					menuDto.setCheckerId(user.getUserId());
					sourceTxt = "APPROVEDMM";

				} else if (menuDto.getMenuRecordStatus().equalsIgnoreCase("R")) {
					initJson.append(menuDto.getMenuStatusOld());
					newJson.append("\"R\"");
					logDto.setUserComments("MENU EDIT REJECTED");
					logDto.setActivityType("EZ");
					menuDto.getCommentDto().setCommentBy(user.getUserId());
					menuDto.getCommentDto().setModuleId(menuDto.getMenuId());
					menuDto.getCommentDto().setModuleName("MM");
					menuDto.setCheckerId(user.getUserId());
					sourceTxt = "REJECTEDMM";
				}
			}
			initJson.append("}");
			newJson.append("}");
			logDto.setActivityImpactTblKey(menuDto.getMenuId());
			logDto.setInitJson(initJson.toString());
			logDto.setModJson(newJson.toString());
			logDto.setUserId(user.getUserId().toString());
			logDto.setTableName("MENU MASTER");
			menuDto.setActivityLogDto(logDto);
			menuDto.setUserRole(user.getUserPosition());
			respDto = commonUtility.objectToJson(menuDto);
			roleString = commonUtility.webserviceConsume(uri + approveRejectMenu, respDto);
			resHeaders = roleString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", sourceTxt);
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}

		return "redirect:/home";

	}

	// reviewEditedMenu
	@RequestMapping("/reviewEditedMenu")
	public String reviewEditedMenu(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) {

		HttpHeaders resHeaders = null;
		MenuDto menuDto = new MenuDto();
		CommentDto commentDto = new CommentDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> rasString = null;
		// String headerResponse = "";
		String requestString = "";

		try {
			// Encrypted JSON Request
			commonUtility.uploadFiles(multipartFile);

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());

			menuDto = objectMapper.readValue(requestString, MenuDto.class);
			menuDto.setMakerId(user.getUserId().toUpperCase());
			commentDto.setComment(menuDto.getCommentDto().getComment());
			commentDto.setCommentBy(user.getUserId().toUpperCase());
			commentDto.setModuleId(menuDto.getMenuId());
			commentDto.setModuleName("MM");
			// commentDto.setActivityId(riskAppetiteDto.getActivityLogDto().getActivityId());
			menuDto.setCommentDto(commentDto);
			// riskAppetiteDto.setUserRole(user.getUserPosition());
			respDto = commonUtility.objectToJson(menuDto);

			rasString = commonUtility.webserviceConsume(uri + editMenuMaster, respDto);

			resHeaders = rasString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {

			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "EDITREJECT");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}

		return "redirect:/mainMenu";

	}

	// viewMenuModel
	@RequestMapping(value = "/viewMenuModel")
	@ResponseBody
	public MenuDto viewMenuModel(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		MenuDto menuDto = new MenuDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			menuDto = objectMapper.readValue(pageValJson, MenuDto.class);
			respDto = commonUtility.objectToJson(menuDto);
			// send request for closing risk appetite
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewMenuDetails, respDto));
			menuDto = objectMapper.readValue(respString, MenuDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

		}

		System.out.println("Final Menu Dto "+ menuDto);
		return menuDto;
	}

	@RequestMapping(value = "/checkWorkFlowExist")
	@ResponseBody
	public WorkflowActionDto checkWorkFlowExist(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		WorkflowActionDto workflowActionDto = new WorkflowActionDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			workflowActionDto = objectMapper.readValue(pageValJson, WorkflowActionDto.class);
			workflowActionDto.setWfActionSource(user.getUserPosition().toUpperCase());

			respDto = commonUtility.objectToJson(workflowActionDto);
			// send request for closing risk appetite
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + checkWorkFlowExist, respDto));
			workflowActionDto = objectMapper.readValue(respString, WorkflowActionDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

		}

		return workflowActionDto;
	}

	// fetchMenusDetails
	@RequestMapping("/searchMenuList")
	public String searchMenuList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model) {

		MenuDto menuDto = new MenuDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			menuDto = objectMapper.readValue(requestString, MenuDto.class);
			UserDto userObj = new UserDto();
			userObj.setUsername(user.getUsername());
			userObj.setUserDept(user.getUserDept());
			userObj.setUserPosition(user.getUserPosition());
			userObj.setUserId(user.getUserId());
			menuDto.setUserDto(userObj);
			menuDto.setMakerId(user.getUserId());
			respDto = commonUtility.objectToJson(menuDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchMenusDetails, respDto));
			menuDto = objectMapper.readValue(respString, MenuDto.class);
			model.addAttribute("menuList", menuDto.getMenuList());
			model.addAttribute("user", user);
			model.addAttribute("modulename", "MM");
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
		}
		return "mainMenu";
	}

}
