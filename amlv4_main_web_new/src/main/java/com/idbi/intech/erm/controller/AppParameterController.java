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
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.WorkflowActionDto;
import com.idbi.intech.erm.domain.app.ActivityLogDto;
import com.idbi.intech.erm.domain.app.AppParameterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class AppParameterController {

	@Value("${app-url.uri}")
	private String uri;
	
	@Value("${app-url.createAppParameter}")
	private String createAppParameter;
	@Value("${app-url.fetchAllAppParameterData}")
	private String fetchAllAppParameterData;
	@Value("${app-url.fetchParameterDataById}")
	private String fetchParameterDataById;
	@Value("${app-url.editParameterData}")
	private String editParameterData;
	//approveRejectParameterData
	@Value("${app-url.approveRejectParameterData}")
	private String approveRejectParameterData;
	//fetchEditParameterDataById
	@Value("${app-url.fetchEditParameterDataById}")
	private String fetchEditParameterDataById;
	//fetchParameterNameList
	@Value("${app-url.fetchParameterNameList}")
	private String fetchParameterNameList;
	
	
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	@Autowired
	private CommonUtility commonUtility;
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;
	RequestResponseJsonDto respDto = null;
	
	

	@RequestMapping("/createParameterMaster")
	public String createParameterMaster(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes,
			Model model) throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException,
			NoSuchPaddingException, CertificateException, KeyStoreException, IllegalBlockSizeException,
			BadPaddingException, NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AppParameterDto apDto = new AppParameterDto();

		apDto.setParamId(pkGenerator.getAppPrimaryKey());
		model.addAttribute("paramId", apDto.getParamId());
		model.addAttribute("recordStatus", "Create Parameter");
		model.addAttribute("userName1",user.getUsername());
		respDto = commonUtility.objectToJson(apDto);
		final String respString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + fetchParameterNameList, respDto));
		apDto = objectMapper.readValue(respString, AppParameterDto.class);
		
		model.addAttribute("parameterNameList", apDto.getParameterNameList());
		

		return "createParameterMaster";

	}

	@RequestMapping("/createParameterPage")
	public String createParameterPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;

		AppParameterDto appDto = new AppParameterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;
		WorkflowActionDto workflowActionDto = new WorkflowActionDto();

		String requestString = "";
		String returnPage = "";
		try {
			// Encrypted JSON Request
			workflowActionDto.setWfModule("PM");
			workflowActionDto.setWfAction("CREATE");
			workflowActionDto.setWfActionSource(user.getUserPosition().toUpperCase());
			workflowActionDto = commonUtility.checkWorkFlowExist(workflowActionDto);
			if ("SUCCESS".equalsIgnoreCase(workflowActionDto.getIsExistStatus())) {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			appDto = objectMapper.readValue(requestString, AppParameterDto.class);
			
			appDto.setDepartmentId(user.getUserDept());
			appDto.setParamMakerId(user.getUserId());
			appDto.setParamActionName("CREATE");
			appDto.setRolePostion(user.getUserPosition());
			

			if (appDto.getFiledetails() != null) {
				appDto.getFiledetails().stream().forEach(e -> {
					Arrays.asList(multipartFile).stream().forEach(file -> {
						if (e.getFileName().equals(file.getOriginalFilename())) {
							commonUtility.uploadFile(file);
						}
					});
				});
			}
			respDto = commonUtility.objectToJson(appDto);
			// User Validation
			apString = commonUtility.webserviceConsume(uri + createAppParameter, respDto);
			resHeaders = apString.getHeaders();
			} else {
				redirectAttributes.addFlashAttribute("source", "UNAUTHORIZE");
				returnPage = "redirect:/mainAppParameterPage";
			}
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
		return "redirect:/mainAppParameterPage";

	}

	@RequestMapping("/mainAppParameterPage")
	public String userSummary(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,HttpSession session)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		String sourceText = "";
		sourceText = source == null ? "" : source;
	

		String messageText = "";

		AppParameterDto appDto = new AppParameterDto();
		appDto.setSearchParam("ALL");

		final ObjectMapper objectMapper = new ObjectMapper();
		try {

			respDto = commonUtility.objectToJson(appDto);
			model.addAttribute("user",user);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAllAppParameterData, respDto));
			appDto = objectMapper.readValue(respString, AppParameterDto.class);
			model.addAttribute("parameterList", appDto.getParameterList());
			
			String modulename="PM";
			/*
			 * ArrayList<String>
			 * subMenuButtonList=commonUtility.getSubMenuBtnData(modulename, session);
			 * model.addAttribute("btnName",subMenuButtonList);
			 * System.out.println("sub menu button list "+subMenuButtonList);
			 */
			model.addAttribute("message", messageText);
			if (null != sourceText && sourceText.equals("CREATE")) {
				messageText = "App Parameter Created Successfully";
			} else if (null != sourceText && sourceText.equals("EDIT")) {
				messageText = "App Parameter modified Successfully";
			} else if (null != sourceText && sourceText.equals("ERROR")) {
				messageText = "Error occured in the request";
			}
			model.addAttribute("message", messageText);
			
			 
			
			
		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();

		}
		return "parameterSummary";

	}

	@RequestMapping("/searchParameterList")
	public String searchRaList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model,HttpSession session) {

		AppParameterDto appDto = new AppParameterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			appDto = objectMapper.readValue(requestString, AppParameterDto.class);
			appDto.setUserDept(user.getUserDept());
			appDto.setParamMakerId(user.getUserId());
			respDto = commonUtility.objectToJson(appDto);
			// Fetch Risk Appetite List
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAllAppParameterData, respDto));
			appDto = objectMapper.readValue(respString, AppParameterDto.class);
			
			String modulename="PM";
			ArrayList<String> subMenuButtonList=commonUtility.getSubMenuBtnData(modulename, session);
			 model.addAttribute("btnName",subMenuButtonList);
			model.addAttribute("parameterList", appDto.getParameterList());
			model.addAttribute("userRole", user.getUserPosition());
			model.addAttribute("user", user);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// Logger needs to ADD
		}

		return "parameterSummary";
	}

	@RequestMapping("/editParameter")
	public String editParameter(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,

			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceId") String sourceId, @ModelAttribute(name = "sourceName") String sourceName)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		AppParameterDto appDto=new AppParameterDto();
		String requestString = "";

		// userDto.setUserId(sourceId);

		if (sourceId.length() > 0) {
			
			appDto.setRecordId(sourceId);
		} else {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			appDto = objectMapper.readValue(requestString, AppParameterDto.class);
			appDto.setRecordId(appDto.getRecordId());
		
		}
		model.addAttribute("userId", appDto.getRecordId());
		model.addAttribute("recordStatus", "Edit Parameter");
		appDto.setParamMakerId(user.getUserId().toUpperCase());
		appDto.setDepartmentId(user.getUserDept());
		
		appDto.setSourceName("edit");
		respDto = commonUtility.objectToJson(appDto);
		final String respString =commonUtility.decryptedResToString(commonUtility.webserviceConsume(uri + fetchParameterDataById, respDto));
		appDto = objectMapper.readValue(respString, AppParameterDto.class);
		model.addAttribute("appDto", appDto);
		model.addAttribute("fileData",appDto.getFiledetails());
		
		
		model.addAttribute("userName1", user.getUsername());
		model.addAttribute("paramValues",appDto.getParameterValues());
		//System.out.println("param Value "+appDto.getParameterValues());
		

		return "editParameter";

	}
	@RequestMapping("/editParameterPage")
	public String editParameterPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;

		AppParameterDto appDto = new AppParameterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;

		String requestString = "";
		try {
			// Encrypted JSON Request

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			appDto = objectMapper.readValue(requestString, AppParameterDto.class);
			appDto.setDepartmentId(user.getUserDept());
			appDto.setParamMakerId(user.getUserId());
			appDto.setParamActionName("EDIT");
			appDto.setRolePostion(user.getUserPosition());

			if (appDto.getFiledetails() != null) {
				appDto.getFiledetails().stream().forEach(e -> {
					Arrays.asList(multipartFile).stream().forEach(file -> {
						if (e.getFileName().equals(file.getOriginalFilename())) {
							commonUtility.uploadFile(file);
						}
					});
				});
			}
			respDto = commonUtility.objectToJson(appDto);
			// User Validation
			// String uri = "https://localhost:1112/erm-app/createActionPlan";
			apString = commonUtility.webserviceConsume(uri + editParameterData, respDto);
			resHeaders = apString.getHeaders();
			// Logger needs to ADD
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
		return "redirect:/mainAppParameterPage";

	}
	
	@RequestMapping("/reviewParameter")
	public String reviewParameter(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,

			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceId") String sourceId,HttpSession session)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		AppParameterDto appDto=new AppParameterDto();
		String requestString = "";

		// userDto.setUserId(sourceId);

		if (sourceId.length() > 0) {
			
			appDto.setRecordId(sourceId);
		} 
		model.addAttribute("userId", appDto.getRecordId());
		model.addAttribute("recordStatus", "Pending  Approval for Create");
		appDto.setParamMakerId(user.getUserId().toUpperCase());
		appDto.setDepartmentId(user.getUserDept());
		
		appDto.setSourceName("createVerify");
		model.addAttribute("sourceName",appDto.getSourceName());
		respDto = commonUtility.objectToJson(appDto);
		final String respString =commonUtility.decryptedResToString(commonUtility.webserviceConsume(uri + fetchParameterDataById, respDto));
		appDto = objectMapper.readValue(respString, AppParameterDto.class);
		model.addAttribute("appDto", appDto);
		
		model.addAttribute("userName1", user.getUsername());
		model.addAttribute("paramValues",appDto.getParameterValues());
		appDto.setSourceName("createVerify");
		

		return "reviewParameter";

	}
	@PostMapping("/approveRejectParameterPage")
	public String approveRejectUserPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		
		AppParameterDto appDto=new AppParameterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;
		ActivityLogDto logDto = new ActivityLogDto();
		
		String requestString = "";
		String sourceTxt = "";
		StringBuilder initJson = new StringBuilder("{\"paramStatus\"=");
		StringBuilder newJson = new StringBuilder("{\"paramStatus\"=");
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			appDto = objectMapper.readValue(requestString, AppParameterDto.class);
			appDto.setParamMakerId(user.getUserId().toUpperCase());
			appDto.setDepartmentId(user.getUserDept());
			appDto.setRolePostion(user.getUserPosition());
			//userDto.setSourceName("createVerify");
			
			appDto.getFiledetails().stream().forEach(e -> {
				Arrays.asList(multipartFile).stream().forEach(file -> {
					if (e.getFileName().equals(file.getOriginalFilename())) {
						commonUtility.uploadFile(file);
					}
				});
			});
			
			if ("A".equalsIgnoreCase(appDto.getParamStatus())) {
				initJson.append(appDto.getParamStatusOld());
				newJson.append("\"A\"");
				if("createVerify".equals(appDto.getSourceName())) {
				logDto.setUserComments("CREATE PARAMETER APPROVED");
				appDto.setParamActionName("APPROVE");
				
				sourceTxt="APPROVEDPM";
				}else if("editVerify".equals(appDto.getSourceName())) {
					logDto.setUserComments("EDIT PARAMETER APPROVED");
					appDto.setParamActionName("APPROVE");
					sourceTxt="APPROVEEDITPM";
				}
				logDto.setActivityType("AR");
				
			} else if("R".equalsIgnoreCase(appDto.getParamStatus())) {
				initJson.append(appDto.getParamStatusOld());
				newJson.append("\"R\"");
				if("createVerify".equals(appDto.getSourceName())) {
				logDto.setUserComments("CREATE PARAMETER REJECTED");
				appDto.setParamActionName("REJECT");
				sourceTxt="REJECTEDPM";
				}else if("editVerify".equals(appDto.getSourceName())) {
					logDto.setUserComments("EDIT PARAMETER REJECTED");
					appDto.setParamActionName("REJECT");
					sourceTxt="REJECTEDEDITPM";
				}
				logDto.setActivityType("ZR");
				
			}
			initJson.append("}");
			newJson.append("}");
			logDto.setActivityImpactTblKey(appDto.getRecordId());
			logDto.setInitJson(initJson.toString());
			logDto.setModJson(newJson.toString());
			logDto.setUserId(user.getUserId().toString());
			logDto.setTableName("APP_PARAMETER");
			appDto.setActivityLogDto(logDto);
			respDto = commonUtility.objectToJson(appDto);
			apString = commonUtility.webserviceConsume(uri + approveRejectParameterData, respDto);
			resHeaders = apString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
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
	@RequestMapping("/reviewEditParameter")
	public String reviewEditParameter(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,

			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceId") String sourceId,HttpSession session)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		AppParameterDto appDto=new AppParameterDto();
		String requestString = "";

		// userDto.setUserId(sourceId);

		if (sourceId.length() > 0) {
			
			appDto.setRecordId(sourceId);
		} 
		model.addAttribute("userId", appDto.getRecordId());
		model.addAttribute("recordStatus", "Pending  Approval for Edit");
		appDto.setParamMakerId(user.getUserId().toUpperCase());
		appDto.setDepartmentId(user.getUserDept());
		
		appDto.setSourceName("editVerify");
		model.addAttribute("sourceName",appDto.getSourceName());
		respDto = commonUtility.objectToJson(appDto);
		final String respString =commonUtility.decryptedResToString(commonUtility.webserviceConsume(uri + fetchEditParameterDataById, respDto));
		appDto = objectMapper.readValue(respString, AppParameterDto.class);
		model.addAttribute("appDto", appDto);
		
		model.addAttribute("userName1", user.getUsername());
		model.addAttribute("paramValues",appDto.getParameterValues());
		
		appDto.setSourceName("createVerify");
		return "reviewParameter";

	}
	
	
	
	@RequestMapping(value = "/viewParameterModel")
	@ResponseBody
	public AppParameterDto viewParameterModel(HttpServletRequest request, Model model,@AuthenticationPrincipal User user)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		AppParameterDto appDto=new AppParameterDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			appDto = objectMapper.readValue(pageValJson, AppParameterDto.class);
			appDto.setSourceName("createVerify");
			respDto = commonUtility.objectToJson(appDto);
			appDto.setParamMakerId(user.getUserId().toUpperCase());
			appDto.setDepartmentId(user.getUserDept());
			
			final String respString = commonUtility.decryptedResToString(commonUtility.webserviceConsume(uri + fetchParameterDataById, respDto));
			appDto = objectMapper.readValue(respString, AppParameterDto.class);
			
			

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		

		return appDto;
	}


	
	
	
	

}
