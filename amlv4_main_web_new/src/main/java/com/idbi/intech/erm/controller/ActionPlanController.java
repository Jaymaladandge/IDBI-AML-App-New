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
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.Arrays;
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
import com.idbi.intech.erm.domain.app.ActionCompletionRecordDto;
import com.idbi.intech.erm.domain.app.ActionPlanLinkDto;
import com.idbi.intech.erm.domain.app.ActionPlanListDto;
import com.idbi.intech.erm.domain.app.ActionPlanMasterDto;
import com.idbi.intech.erm.domain.app.ActionPlanModelDto;
import com.idbi.intech.erm.domain.app.ActivityLogDto;
import com.idbi.intech.erm.domain.app.CommentDto;
import com.idbi.intech.erm.domain.app.DepartmentMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.IncidentDto;
import com.idbi.intech.erm.domain.app.ModuleDeptMasterDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class ActionPlanController {
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.getAPOwner}")
	private String getAPOwner;
	@Value("${app-url.fetchAPList}")
	private String fetchAPList;
	@Value("${app-url.fetchAPReport}")
	private String fetchAPReport;
	@Value("${app-url.createAP}")
	private String createAP;
	@Value("${app-url.linkAP}")
	private String linkAP;
	@Value("${app-url.getAPDataById}")
	private String getAPDataById;
	@Value("${app-url.approveRejectAP}")
	private String approveRejectAP;
	@Value("${app-url.closeAP}")
	private String closeAP;
	@Value("${app-url.editActionPlan}")
	private String editActionPlan;
	@Value("${app-url.listOfActionPlan}")
	private String listOfActionPlan;
	@Value("${app-url.viewActionPlanModal}")
	private String viewActionPlanModal;
	@Value("${app-url.unlinkActionPlan}")
	private String unlinkActionPlan;
	@Value("${app-url.updateActionCompletionPercent}")
	private String updateActionCompletionPercent;

	@Autowired
	private CommonUtility commonUtility;
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;

	RequestResponseJsonDto respDto = null;
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	// SessionKeyEncryptor Object

	@RequestMapping("/createActionPlan")
	public String createActionPlan(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@RequestParam(value = "sourceId", required = false, defaultValue = "") String sourceId,
			@RequestParam(value = "sourceName", required = false, defaultValue = "") String sourceName,
			@RequestParam(value = "moduleName", required = false, defaultValue = "") String moduleName,
			@RequestParam(value = "sourceReq", required = false, defaultValue = "") String sourceReq,
			@RequestParam(value = "actionPlanId", required = false, defaultValue = "") String actionPlanId,
			@RequestParam(value = "actionName", required = false, defaultValue = "") String actionName, Model model,
			RedirectAttributes redirectAttributes, HttpSession session) throws JsonProcessingException {

		final ObjectMapper objectMapper = new ObjectMapper();
		ActionPlanMasterDto apmDto = new ActionPlanMasterDto();

		try {
			if (actionPlanId.equals("")) {

				apmDto.setActionId(pkGenerator.getModulePrimaryKey("APL"));
				apmDto.setSourceId(sourceId);
				apmDto.setModuleName(moduleName);
				apmDto.setSourceName(sourceName);
				respDto = commonUtility.objectToJson(apmDto);

				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + getAPOwner, respDto));
				apmDto = objectMapper.readValue(respString, ActionPlanMasterDto.class);

				if (apmDto != null) {
					if (apmDto.getMvcDto() != null) {
						model.addAttribute("captureValue", apmDto.getMvcDto().getCaptureUserId());
						model.addAttribute("actionOwner", apmDto.getActionOwner());

					}
				}

				model.addAttribute("apmDto", apmDto);
				model.addAttribute("sourceId", sourceId);
				model.addAttribute("sourceName", sourceName);
				model.addAttribute("moduleName", moduleName);
				model.addAttribute("actionPlanId", actionPlanId);
				model.addAttribute("deptName", user.getUserDeptName());
				model.addAttribute("deptId", user.getUserDept());
				model.addAttribute("userId", user.getUserId());
				model.addAttribute("userName", user.getUsername().toLowerCase());
				model.addAttribute("sourceReq", sourceReq);
				

				model.addAttribute("actionOwnerList", apmDto.getActionOwnerList());

			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "createActionPlan";
	}

	@PostMapping("/createActionPlanPage")
	public String createActionPlanPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		ActionPlanMasterDto apmDto = new ActionPlanMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;

		String requestString = "";
		try {
			// Encrypted JSON Request

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			apmDto = objectMapper.readValue(requestString, ActionPlanMasterDto.class);
			if (apmDto.getActionStatus().equalsIgnoreCase("cancel")) {
				redirectAttributes.addFlashAttribute("sourceId", apmDto.getSourceId());
				redirectAttributes.addFlashAttribute("moduleName", apmDto.getModuleName());
				redirectAttributes.addFlashAttribute("sourceName", apmDto.getSourceName());
				return "redirect:/mainActionPlan";
			}
			apmDto.setDepartmentId(user.getUserDept());

			apmDto.setMakerId(user.getUserId().toUpperCase());
			apmDto.getFiledetails().stream().forEach(e -> {
				Arrays.asList(multipartFile).stream().forEach(file -> {
					if (e.getFileName().equals(file.getOriginalFilename())) {
						commonUtility.uploadFile(file);
					}
				});
			});
			respDto = commonUtility.objectToJson(apmDto);

			// User Validation

			apString = commonUtility.webserviceConsume(uri + createAP, respDto);

			resHeaders = apString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				if (!apmDto.getActionStatus().equalsIgnoreCase("cancel")) {
					redirectAttributes.addFlashAttribute("source", "CREATE");
					redirectAttributes.addFlashAttribute("sourceId", apmDto.getSourceId());
					redirectAttributes.addFlashAttribute("moduleName", apmDto.getModuleName());
					redirectAttributes.addFlashAttribute("sourceName", apmDto.getSourceName());
				}
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}
		return "redirect:/mainActionPlan";

	}

	@PostMapping("/cancelActionPlanPage")
	public String cancelActionPlanPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		ActionPlanMasterDto apmDto = new ActionPlanMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;

		String requestString = "";
		try {
			// Encrypted JSON Request

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			apmDto = objectMapper.readValue(requestString, ActionPlanMasterDto.class);
			// resHeaders = apString.getHeaders();
			// Logger needs to ADD
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {

			redirectAttributes.addFlashAttribute("source", "CANCEL");
			redirectAttributes.addFlashAttribute("sourceId", apmDto.getSourceId());
			redirectAttributes.addFlashAttribute("moduleName", apmDto.getModuleName());
			redirectAttributes.addFlashAttribute("sourceName", apmDto.getSourceName());
		}
		return "redirect:/mainActionPlan";

	}

	@PostMapping("/editActionPlanPage")
	public String editActionPlanPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		ActionPlanMasterDto apmDto = new ActionPlanMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;

		String requestString = "";
		try {

			// Encrypted JSON Request

			CommentDto commentDto = new CommentDto();
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			apmDto = objectMapper.readValue(requestString, ActionPlanMasterDto.class);

			apmDto.getFiledetails().stream().forEach(e -> {
				Arrays.asList(multipartFile).stream().forEach(file -> {
					if (e.getFileName().equals(file.getOriginalFilename())) {
						commonUtility.uploadFile(file);
					}
				});
			});
			apmDto.setDepartmentId(user.getUserDept());

			apmDto.setMakerId(user.getUserId().toUpperCase());
			commentDto.setComment(apmDto.getCommentDto().getComment());
			commentDto.setCommentBy(user.getUserId().toUpperCase());
			commentDto.setModuleId(apmDto.getActionId());
			commentDto.setModuleName("AP");
			apmDto.setCommentDto(commentDto);

			respDto = commonUtility.objectToJson(apmDto);
			// User Validation

			apString = commonUtility.webserviceConsume(uri + editActionPlan, respDto);
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
		return "redirect:/mainActionPlan";

	}

	@RequestMapping("/fetchAactionPlanData")
	public String fetchActionData(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@ModelAttribute(name = "actionId") String actionId, @AuthenticationPrincipal User user, Model model) {
		final ObjectMapper objectMapper = new ObjectMapper();
		ActionPlanMasterDto apmDto = new ActionPlanMasterDto();

		try {
			apmDto.setActionId(actionId);
			model.addAttribute("actionId", actionId);
			model.addAttribute("sourceName", "Update Action Plan");
			apmDto.setRecordStatus("valueCapture");
			respDto = commonUtility.objectToJson(apmDto);

			LocalDate currentdate = LocalDate.now();
			Month currentMonth = currentdate.getMonth();

			// getting the current year
			int currentYear = currentdate.getYear();

			String updateDate = currentMonth + "-" + currentYear;

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getAPDataById, respDto));
			apmDto = objectMapper.readValue(respString, ActionPlanMasterDto.class);

			model.addAttribute("actionData", apmDto);

			model.addAttribute("acrRecords", apmDto.getActionRecords());
			model.addAttribute("updateDate", updateDate);
			model.addAttribute("username", user.getUsername());
			

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "captureActionUpdate";

	}

	@RequestMapping("/fetchAactionPlanEditData")
	public String fetchActionDataEdit(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@RequestParam(value = "message", required = false, defaultValue = "") String message,
			RedirectAttributes redirectAttributes, @AuthenticationPrincipal User user, Model model) {
		final ObjectMapper objectMapper = new ObjectMapper();

		String requestString = "";
		ActionPlanMasterDto apmDto = new ActionPlanMasterDto();

		try {

			model.addAttribute("sourceName", "Edit");
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			apmDto.setRecordStatus("edit");
			apmDto = objectMapper.readValue(requestString, ActionPlanMasterDto.class);

			model.addAttribute("actionId", apmDto.getActionId());
			
			respDto = commonUtility.objectToJson(apmDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getAPDataById, respDto));
			apmDto = objectMapper.readValue(respString, ActionPlanMasterDto.class);

			model.addAttribute("actionData", apmDto);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "editActionPlan";

	}

	@RequestMapping("/mainActionPlan")
	public String mainActionPlan(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@ModelAttribute(name = "sourceId") String sourceId, @ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "moduleName") String moduleName,
			@RequestParam(value = "moduleId", required = false, defaultValue = "") String moduleId,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			HttpSession session) {
		String sourceText = "";

		sourceText = source == null ? "" : source;
		String messageText = "";
		ActionPlanMasterDto actionMasterDto = new ActionPlanMasterDto();
		IncidentDto incidentDto = new IncidentDto();
		actionMasterDto.setSearchParam("ALL");
		List<DepartmentMasterDto> deptList = new ArrayList<DepartmentMasterDto>();
		final ObjectMapper objectMapper = new ObjectMapper();
		String deptSelected = "";
		String reportedDept = "";

		try {
			deptList = commonUtility.fetchDeptList();
			if (sourceId.length() > 0) {
				model.addAttribute("sourceId", sourceId);
				actionMasterDto.setSourceId(sourceId);
				//incidentDto.setIncidentId(sourceId);
				//incidentDto = commonUtility.fetchIncidentDetails(incidentDto);
			} else {
				model.addAttribute("sourceId", moduleId);
				actionMasterDto.setSourceId(moduleId);
			}
			model.addAttribute("sourceName", sourceName);
			model.addAttribute("moduleName", moduleName);
			respDto = commonUtility.objectToJson(actionMasterDto);
			// Fetch Action Plan List
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAPList, respDto));
			actionMasterDto = objectMapper.readValue(respString, ActionPlanMasterDto.class);
			model.addAttribute("actionList", actionMasterDto.getApmList());
			model.addAttribute("deptId", user.getUserDept());
			model.addAttribute("userRole", user.getUserPosition());
			
			ArrayList<String> menuButtonList = new ArrayList<String>();
			String modulename = "AP";
			if (user.getUserPosition().equalsIgnoreCase("Incident Remediator")) {

				String DeptId = incidentDto.getDepartmentId();
				String[] addDept = incidentDto.getAdditionalBusinessUnit().split(",");
				for (String existingDept : addDept) {
					for (DepartmentMasterDto dept : deptList) {
						if (dept.getDeptId().equalsIgnoreCase(existingDept)) {
							deptSelected += dept.getDeptName() + " , ";
						}
					}
				}
				deptSelected = deptSelected.substring(0, deptSelected.length() - 2);
				for (String actDept : DeptId.split(",")) {
					for (DepartmentMasterDto dept : deptList) {
						if (dept.getDeptId().equalsIgnoreCase(actDept)) {
							reportedDept += dept.getDeptName() + " ,";
						}
					}
				}
				reportedDept = reportedDept.substring(0, reportedDept.length() - 2);
				model.addAttribute("deptName", reportedDept + " , " + deptSelected);
				modulename = "IM";
			} else {
				modulename = "AP";
				if (user.getUserDeptName() != null) {
					model.addAttribute("deptName", user.getUserDeptName());
				}
			}
			menuButtonList = commonUtility.getMenuBtnData(modulename, session);
			model.addAttribute("btnName", menuButtonList);

			if (null != sourceText && sourceText.equals("CREATE")) {
				messageText = "Action Plan Created Successfully";
			} else if (null != sourceText && sourceText.equals("EDIT")) {
				messageText = "Action Plan Modified Successfully";
			} else if (null != sourceText && sourceText.equals("CLOSE")) {
				messageText = "Action Plan closed";
			} else if (null != sourceText && sourceText.equals("LAPCREATE")) {
				messageText = "Action Plan Linked Successfully";
			} else if (null != sourceText && sourceText.equals("ERROR")) {
				messageText = "Error occured in the request";
			} else if (null != sourceText && sourceText.equals("Update Action Plan")) {
				messageText = "Action Plan Updated Successfully";
			}
			model.addAttribute("message", messageText);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "mainActionPlan";
	}

	@RequestMapping("/searchActionList")
	public String searchActionList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@RequestParam(value = "sourceId", required = false, defaultValue = "") String sourceId,
			@RequestParam(value = "sourceName", required = false, defaultValue = "") String sourceName,
			@RequestParam(value = "moduleName", required = false, defaultValue = "") String moduleName, Model model,
			@AuthenticationPrincipal User user) {

		ActionPlanMasterDto actionMasterDto = new ActionPlanMasterDto();

		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			actionMasterDto = objectMapper.readValue(requestString, ActionPlanMasterDto.class);

			if (!"".equals(sourceId) && !"".equals(sourceName) && !"".equals(moduleName)) {
				actionMasterDto.setSourceId(sourceId);
				actionMasterDto.setModuleName(moduleName);
				actionMasterDto.setSourceName(sourceName);

			}
			model.addAttribute("sourceId", sourceId);
			model.addAttribute("sourceName", sourceName);
			model.addAttribute("moduleName", moduleName);
			model.addAttribute("deptId", user.getUserDept());
			model.addAttribute("userRole", user.getUserPosition());
			
			respDto = commonUtility.objectToJson(actionMasterDto);
			// Fetch Risk Appetite List

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAPList, respDto));
			actionMasterDto = objectMapper.readValue(respString, ActionPlanMasterDto.class);
			model.addAttribute("actionList", actionMasterDto.getApmList());

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
			// Logger needs to ADD
		}

		return "mainActionPlan";
	}

	@RequestMapping("/updateActionPlan")
	public String updateActionPlan(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;

		ActionCompletionRecordDto acrDto = new ActionCompletionRecordDto();

		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;

		String requestString = "";
		try {
			// Encrypted JSON Request

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			acrDto = objectMapper.readValue(requestString, ActionCompletionRecordDto.class);

			acrDto.setDeptId(user.getUserDept());
			acrDto.setUserRole(user.getUserPosition());
			acrDto.getFiledetails().stream().forEach(e -> {
				Arrays.asList(multipartFile).stream().forEach(file -> {
					if (e.getFileName().equals(file.getOriginalFilename())) {
						commonUtility.uploadFile(file);
					}
				});
			});

			acrDto.setMakerId(user.getUserId().toUpperCase());

			ActivityLogDto activityLogDto = new ActivityLogDto();
			if (acrDto.getModuleFlag().equalsIgnoreCase("true")) {
				activityLogDto.setActivityType("AX");
			} else {
				activityLogDto.setActivityType("AQ");
			}

			activityLogDto.setInitJson("");
			activityLogDto.setTableName("ACTION_COMPLETION_RECORD");
			activityLogDto.setUserComments("Action Plan Update ");

			activityLogDto.setUserId(user.getUserId());
			activityLogDto.setModJson(acrDto.toString());
			acrDto.setAlDto(activityLogDto);
			acrDto.setActionStatusName("close");

			acrDto.setUserRole(user.getUserPosition());

			acrDto.getCommentDto().setCommentBy(user.getUserId());

			acrDto.getCommentDto().setModuleName("AP");

			respDto = commonUtility.objectToJson(acrDto);
			// User Validation

			apString = commonUtility.webserviceConsume(uri + updateActionCompletionPercent, respDto);
			resHeaders = apString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "UPDATEACTION");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}
		return "redirect:/home";

	}

	@RequestMapping("/linkActionPlan")
	public String linkActionPlan(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model) {
		final ObjectMapper objectMapper = new ObjectMapper();
		HttpHeaders resHeaders = null;
		ActionPlanLinkDto actionPlanLinkDto = new ActionPlanLinkDto();
		ResponseEntity<String> rasString = null;
		String requestString = "";
		try {

			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			actionPlanLinkDto = objectMapper.readValue(requestString, ActionPlanLinkDto.class);

			actionPlanLinkDto.setMakerId(user.getUserId());
			actionPlanLinkDto.setActionLinkStatus("L");
			ActivityLogDto activityLogDto = new ActivityLogDto();
			activityLogDto.setActivityType("LQ");

			activityLogDto.setInitJson("");
			activityLogDto.setTableName("ACTION_PLAN_LINK");
			activityLogDto.setUserComments("Action Plan Link Request");
			activityLogDto.setActivityImpactTblKey(actionPlanLinkDto.getSourceId());
			activityLogDto.setUserId(user.getUserId());
			activityLogDto.setModJson(actionPlanLinkDto.toString());
			actionPlanLinkDto.setActivityLogDto(activityLogDto);
			actionPlanLinkDto.setUserRole(user.getUserPosition());

			respDto = commonUtility.objectToJson(actionPlanLinkDto);

			rasString = commonUtility.webserviceConsume(uri + linkAP, respDto);
			resHeaders = rasString.getHeaders();

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "LAPCREATE");
				redirectAttributes.addFlashAttribute("sourceId", actionPlanLinkDto.getSourceId());
				redirectAttributes.addFlashAttribute("moduleName", actionPlanLinkDto.getModuleName());
				redirectAttributes.addFlashAttribute("sourceName", actionPlanLinkDto.getSourceName());
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}
		return "redirect:/home";

	}

	@RequestMapping(value = "/fetchActionPlan")
	@ResponseBody
	public List<ActionPlanListDto> fetchActionPlan(HttpServletRequest request, @AuthenticationPrincipal User user,
			Model model) throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<ActionPlanListDto> actPlanListDto = new ArrayList<ActionPlanListDto>();
		ModuleDeptMasterDto modDeptDto = new ModuleDeptMasterDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			modDeptDto = objectMapper.readValue(pageValJson, ModuleDeptMasterDto.class);
			modDeptDto.setDeptId(user.getUserDept());

			respDto = commonUtility.objectToJson(modDeptDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + listOfActionPlan, respDto));
			actPlanListDto = objectMapper.readValue(respString, new TypeReference<List<ActionPlanListDto>>() {
			});

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return actPlanListDto;
	}

	@RequestMapping(value = "/viewActionPlanModal")
	@ResponseBody
	public ActionPlanModelDto viewActionPlanModal(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		ActionPlanModelDto actPlanModDto = new ActionPlanModelDto(); // Action Plan Model Dto
		ActionPlanMasterDto apmDto = new ActionPlanMasterDto(); // Action Plan Master Dto

		try {
			String pageValJson = request.getParameter("pageValJson");
			apmDto = objectMapper.readValue(pageValJson, ActionPlanMasterDto.class);
			respDto = commonUtility.objectToJson(apmDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewActionPlanModal, respDto));
			actPlanModDto = objectMapper.readValue(respString, ActionPlanModelDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return actPlanModDto;
	}

	@RequestMapping("/unLinkActionPlanTest")
	public String unLinkActionPlan(@ModelAttribute(name = "encryptedJson") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model) {

		final ObjectMapper objectMapper = new ObjectMapper();

		HttpHeaders resHeaders = null;
		ActionPlanLinkDto aplDto = new ActionPlanLinkDto(); // For Sending Request

		String requestString = "";
		ResponseEntity<String> rasString = null;

		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			aplDto = objectMapper.readValue(requestString, ActionPlanLinkDto.class);
			// Pass MakerId
			aplDto.setMakerId(user.getUserId());

			// Set Passed Comment
			aplDto.getCommentDto().setCommentBy(user.getUserId());
			aplDto.getCommentDto().setModuleId(aplDto.getActionLinkId());
			aplDto.getCommentDto().setModuleName("RA");
			aplDto.getCommentDto().setCommentBy(user.getUserId().toUpperCase());

			// Add Activity Log
			String initJson = "{\"actionLinkStatus\":\"L\"}";
			String modJson = "{\"actionLinkStatus\":\"U\"}";
			ActivityLogDto activityLogDto = new ActivityLogDto();
			activityLogDto.setActivityType("LD");
			activityLogDto.setInitJson(initJson);
			activityLogDto.setModJson(modJson);
			activityLogDto.setUserId(user.getUserId().toUpperCase());
			activityLogDto.setActivityImpactTblKey(aplDto.getActionLinkId());
			activityLogDto.setTableName("ACTION_PLAN_LINK");
			aplDto.setActivityLogDto(activityLogDto);

			respDto = commonUtility.objectToJson(aplDto);

			rasString = commonUtility.webserviceConsume(uri + unlinkActionPlan, respDto);

			resHeaders = rasString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "UNLINK");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}

		return "redirect:/mainRasPage";
	}

	@RequestMapping("/closeActionPlan")
	public String closeActionPlan(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@RequestParam("files[]") MultipartFile[] multipartFile) {
		final ObjectMapper objectMapper = new ObjectMapper();
		ActionPlanMasterDto apmDto = new ActionPlanMasterDto();

		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			apmDto = objectMapper.readValue(requestString, ActionPlanMasterDto.class);
			apmDto.getFiledetails().stream().forEach(e -> {
				Arrays.asList(multipartFile).stream().forEach(file -> {
					if (e.getFileName().equals(file.getOriginalFilename())) {
						commonUtility.uploadFile(file);
					}
				});
			});
			apmDto.getCommentDto().setCommentBy(user.getUserId());
			apmDto.getCommentDto().setModuleId(apmDto.getActionId());
			apmDto.getCommentDto().setModuleName("AP");
			apmDto.getCommentDto().setCommentBy(user.getUserId());
			apmDto.setDepartmentId(user.getUserDept());
			apmDto.setMakerId(user.getUserId());
			String initJson = "{\"actionRecordStatus\":\"O\"}";
			String modJson = "{\"actionRecordStatus\":\"C\"}";

			ActivityLogDto activityLogDto = new ActivityLogDto();

			apmDto.setActionRecordStatus("C");
			apmDto.setActionActStatus("AX");
			activityLogDto.setActivityType("XX");
			activityLogDto.setInitJson(initJson);
			activityLogDto.setModJson(modJson);
			apmDto.setAlDto(activityLogDto);
			respDto = commonUtility.objectToJson(apmDto);
			// send request for closing risk appetite
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + closeAP, respDto));
			apmDto = objectMapper.readValue(respString, ActionPlanMasterDto.class);
			if (apmDto.getRequestStatus().equals("00")) {
				redirectAttributes.addFlashAttribute("source", "CLOSE");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
			model.addAttribute("user", user);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

		}
		return "redirect:/home";

	}

	@RequestMapping("/fetchCloseAactionPlanData")
	public String fetchCloseAactionPlanData(
			@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@ModelAttribute(name = "actionId") String actionId, @AuthenticationPrincipal User user, Model model) {
		final ObjectMapper objectMapper = new ObjectMapper();

		ActionPlanMasterDto apmDto = new ActionPlanMasterDto();

		try {

			model.addAttribute("actionId", actionId);
			apmDto.setActionId(actionId);
			model.addAttribute("sourceName", "Close Action Plan");
			respDto = commonUtility.objectToJson(apmDto);

			LocalDate currentdate = LocalDate.now();
			Month currentMonth = currentdate.getMonth();

			// getting the current year
			int currentYear = currentdate.getYear();

			String updateDate = currentMonth + "-" + currentYear;
			apmDto.setRecordStatus("close");
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getAPDataById, respDto));
			apmDto = objectMapper.readValue(respString, ActionPlanMasterDto.class);

			model.addAttribute("actionData", apmDto);
			
			model.addAttribute("acrRecords", apmDto.getActionRecords());
			model.addAttribute("filedetails", apmDto.getDocumentList());

			model.addAttribute("updateDate", updateDate);
			model.addAttribute("username", user.getUsername());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "closeActionPlan";

	}

	/**
	 * Fetch data for action plan report
	 * 
	 * @param message
	 * @param sourceId
	 * @param sourceName
	 * @param moduleName
	 * @param moduleId
	 * @param user
	 * @param source
	 * @param model
	 * @return
	 */

	@RequestMapping("/mainActionPlanReport")
	public String mainActionPlanReport(
			@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@ModelAttribute(name = "sourceId") String sourceId, @ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "moduleName") String moduleName,
			@RequestParam(value = "moduleId", required = false, defaultValue = "") String moduleId,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model) {

		ActionPlanMasterDto actionMasterDto = new ActionPlanMasterDto();

		actionMasterDto.setSearchParam("ALL");
		final ObjectMapper objectMapper = new ObjectMapper();

		try {

			if (sourceId.length() > 0) {

				model.addAttribute("sourceId", sourceId);
				
				actionMasterDto.setSourceId(sourceId);
			} else {

				model.addAttribute("sourceId", moduleId);
				actionMasterDto.setSourceId(moduleId);
			}

			respDto = commonUtility.objectToJson(actionMasterDto);
			// Fetch Action Plan List

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAPReport, respDto));
			actionMasterDto = objectMapper.readValue(respString, ActionPlanMasterDto.class);

			model.addAttribute("actionList", actionMasterDto.getApmList());
			if (user.getUserDeptName() != null) {
				model.addAttribute("deptName", user.getUserDeptName());
			}

			model.addAttribute("deptId", user.getUserDept());
			model.addAttribute("userRole", user.getUserPosition());

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "mainActionPlanReport";
	}

	@RequestMapping("/searchActionReportList")
	public String searchActionReportList(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@RequestParam(value = "sourceId", required = false, defaultValue = "") String sourceId,
			@RequestParam(value = "sourceName", required = false, defaultValue = "") String sourceName,
			@RequestParam(value = "moduleName", required = false, defaultValue = "") String moduleName, Model model,
			@AuthenticationPrincipal User user) {

		ActionPlanMasterDto actionMasterDto = new ActionPlanMasterDto();

		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			actionMasterDto = objectMapper.readValue(requestString, ActionPlanMasterDto.class);

			if (sourceId != "" && sourceName != "" && moduleName != "") {
				actionMasterDto.setSourceId(sourceId);
				actionMasterDto.setModuleName(moduleName);
				actionMasterDto.setSourceName(sourceName);

			}
			model.addAttribute("sourceId", sourceId);
			model.addAttribute("sourceName", sourceName);
			model.addAttribute("moduleName", moduleName);
			model.addAttribute("deptId", user.getUserDept());
			model.addAttribute("userRole", user.getUserPosition());
			
			respDto = commonUtility.objectToJson(actionMasterDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAPReport, respDto));
			actionMasterDto = objectMapper.readValue(respString, ActionPlanMasterDto.class);
			model.addAttribute("actionList", actionMasterDto.getApmList());

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
			// Logger needs to ADD
		}

		return "mainActionPlanReport";
	}

	@RequestMapping("/searchActionReportDateList")
	public String searchActionReportDateList(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@RequestParam(value = "sourceId", required = false, defaultValue = "") String sourceId,
			@RequestParam(value = "sourceName", required = false, defaultValue = "") String sourceName,
			@RequestParam(value = "moduleName", required = false, defaultValue = "") String moduleName, Model model,
			@AuthenticationPrincipal User user) {

		ActionPlanMasterDto actionMasterDto = new ActionPlanMasterDto();

		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			actionMasterDto = objectMapper.readValue(requestString, ActionPlanMasterDto.class);
			actionMasterDto.setSearchParam("DATE");
			if (!"".equals(sourceId) && !"".equals(sourceName) && !"".equals(moduleName)) {
				actionMasterDto.setSourceId(sourceId);
				actionMasterDto.setModuleName(moduleName);
				actionMasterDto.setSourceName(sourceName);

			}
			model.addAttribute("sourceId", sourceId);
			model.addAttribute("sourceName", sourceName);
			model.addAttribute("moduleName", moduleName);
			model.addAttribute("deptId", user.getUserDept());
			model.addAttribute("userRole", user.getUserPosition());
		
			respDto = commonUtility.objectToJson(actionMasterDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAPReport, respDto));
			actionMasterDto = objectMapper.readValue(respString, ActionPlanMasterDto.class);
			model.addAttribute("actionList", actionMasterDto.getApmList());

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();

		}

		return "mainActionPlanReport";
	}

}
