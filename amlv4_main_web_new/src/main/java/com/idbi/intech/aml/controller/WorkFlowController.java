package com.idbi.intech.aml.controller;

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
import org.springframework.boot.json.JsonParseException;
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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.WorkflowMasterDto;
import com.idbi.intech.erm.domain.app.ActivityLogDto;
import com.idbi.intech.erm.domain.app.AuditTrailDto;
import com.idbi.intech.erm.domain.app.CodeMasterDto;
import com.idbi.intech.erm.domain.app.DepartmentMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.RoleMasterDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class WorkFlowController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchDept}")
	private String fetchDept;
	@Value("${app-url.fetchRoleList}")
	private String fetchRoleList;
	@Value("${app-url.fetchWorkflowList}")
	private String fetchWorkflowList;
	@Value("${app-url.createWorkflow}")
	private String createWorkflow;
	@Value("${app-url.fetchWorkflowData}")
	private String fetchWorkflowData;
	@Value("${app-url.fetchActionList}")
	private String fetchActionList;
	@Value("${app-url.viewWorkflowModel}")
	private String viewWorkflowModel;
	@Value("${app-url.editWorkflowAction}")
	private String editWorkflowAction;
	@Value("${app-url.fetchDistinctWorkflowData}")
	private String fetchDistinctWorkflowData;
	@Value("${app-url.varifyWorkFlowExist}")
	private String verifyWorkflowExist;
	@Value("${app-url.workflowOfficetypeList}")
	private String workflowOfficetypeList;
	@Value("${app-url.viewAuditTrail}")
	private String viewAuditTrail;

	@Autowired
	private CommonUtility commonUtility;

	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;

	RequestResponseJsonDto respDto = null;
	RequestResponseJsonDto officerespDto = null;
	RequestResponseJsonDto respoDto = null;
	RequestResponseJsonDto resposDto = null;
	RequestResponseJsonDto resDto = null;
	RequestResponseJsonDto editDto = null;

	@RequestMapping("/createWorkflow")
	public String createWorkflow(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {
		List<DepartmentMasterDto> deptList = new ArrayList<DepartmentMasterDto>();
		List<DepartmentMasterDto> departmentList = new ArrayList<DepartmentMasterDto>();
		WorkflowMasterDto workflowMasterDto = new WorkflowMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		try {

			String deptResponse = "Fetch";
			RoleMasterDto roleDto = new RoleMasterDto();
			roleDto.setSearchParam("ALL");
			roleDto.setUserDept(user.getUserDept());
			CodeMasterDto codeMaster = new CodeMasterDto();
			codeMaster.setCodeName("APP MODULE");
			CodeMasterDto ActcodeMaster = new CodeMasterDto();
			ActcodeMaster.setCodeName("ACTION STATUS");
			CodeMasterDto officecodeMaster = new CodeMasterDto();
			officecodeMaster.setCodeName("OFFICE TYPE");

			resDto = commonUtility.objectToJson(ActcodeMaster);
			respDto = commonUtility.objectToJson(deptResponse);

			respoDto = commonUtility.objectToJson(codeMaster);
			resposDto = commonUtility.objectToJson(roleDto);
			officerespDto = commonUtility.objectToJson(officecodeMaster);

			final String deptListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDept, respDto));
			departmentList = objectMapper.readValue(deptListStr, new TypeReference<List<DepartmentMasterDto>>() {
			});

			final String RoleListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRoleList, resposDto));
			roleDto = objectMapper.readValue(RoleListStr, RoleMasterDto.class);
			model.addAttribute("roleList", roleDto.getRoleList());

			final String WfListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchWorkflowList, respoDto));
			codeMaster = objectMapper.readValue(WfListStr, CodeMasterDto.class);
			model.addAttribute("wfList", codeMaster.getModuleNameList());
			
			final String WfActionListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchActionList, resDto));
			codeMaster = objectMapper.readValue(WfActionListStr, CodeMasterDto.class);
			model.addAttribute("ActionList", codeMaster.getActionList());

			final String officeSetList = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + workflowOfficetypeList, officerespDto));
			codeMaster = objectMapper.readValue(officeSetList, CodeMasterDto.class);
			model.addAttribute("cntrlLib", codeMaster);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		workflowMasterDto.setWfGroupId(pkGenerator.getIMPrimaryKey("LIC", "WF"));
		workflowMasterDto.setUserName(user.getUsername());

		for (DepartmentMasterDto deptDto : departmentList) {
			deptDto.setDeptName(deptDto.getDeptName().toUpperCase());
			deptList.add(deptDto);
		}

		model.addAttribute("wfPK", workflowMasterDto);
		model.addAttribute("deptList", deptList);

		return "createWorkFlow";

	}

	@RequestMapping(value = "/viewWorkflowModelPage")
	@ResponseBody
	public WorkflowMasterDto viewWorkflowModal(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		WorkflowMasterDto workflowDto = new WorkflowMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			workflowDto = objectMapper.readValue(pageValJson, WorkflowMasterDto.class);

			respDto = commonUtility.objectToJson(workflowDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewWorkflowModel, respDto));
			workflowDto = objectMapper.readValue(respString, WorkflowMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return workflowDto;
	}

	@PostMapping("/createWorkflowAction")
	public String createWorkflowAction(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		WorkflowMasterDto workflowMasterDto = new WorkflowMasterDto();
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> workflowString = null;
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			workflowMasterDto = objectMapper.readValue(requestString, WorkflowMasterDto.class);
			workflowMasterDto.setMakerId(user.getUserId().toUpperCase());
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			workflowMasterDto.setUser(userDto);
			respDto = commonUtility.objectToJson(workflowMasterDto);
			// User Validation
			workflowString = commonUtility.webserviceConsume(uri + createWorkflow, respDto);
			resHeaders = workflowString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Workflow Created");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/WorkflowSummary";
	}

	@RequestMapping("/WorkflowSummary")
	public String workflowSummary(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			HttpSession session, RedirectAttributes redirectAttributes)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {

		String sourceText = "";
		sourceText = source == null ? "" : source;

		String messageText = "";

		WorkflowMasterDto workflow = new WorkflowMasterDto();
		workflow.setWfSearchParam("ALL");
		workflow.setWfStatus("A");

		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			respDto = commonUtility.objectToJson(workflow);

			final String workflowListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchWorkflowData, respDto));
			workflow = objectMapper.readValue(workflowListStr, WorkflowMasterDto.class);

			model.addAttribute("message", messageText);
			if (null != sourceText && sourceText.equals("Workflow Created")) {
				messageText = "Workflow Created Successfully";
			} else if (null != sourceText && sourceText.equals("Workflow Edited")) {
				messageText = "Workflow modified Successfully";
			} else if (null != sourceText && sourceText.equals("ERROR")) {
				messageText = "Error occured in the request";
			}
			model.addAttribute("message", messageText);
			workflow.setUserName(user.getUsername());

			model.addAttribute("workflow", workflow);

		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();

		}
		return "WorkflowSummary";

	}

	@RequestMapping("/searchWorkflowList")
	public String searchWorkflowList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) {

		WorkflowMasterDto workflow = new WorkflowMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			workflow = objectMapper.readValue(requestString, WorkflowMasterDto.class);
			workflow.setWfDeptName(user.getUserDept());
			workflow.setMakerId(user.getUserId());
			respDto = commonUtility.objectToJson(workflow);
			// Fetch Risk Appetite List
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchWorkflowData, respDto));
			workflow = objectMapper.readValue(respString, WorkflowMasterDto.class);

			workflow.setUserName(user.getUsername());

			model.addAttribute("workflow", workflow);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// Logger needs to ADD
		}

		return "WorkflowSummary";
	}

	@RequestMapping("/editWorkflow")
	public String editParameter(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,

			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceId") String sourceId, @ModelAttribute(name = "sourceName") String sourceName)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		List<DepartmentMasterDto> deptList = new ArrayList<DepartmentMasterDto>();
		List<DepartmentMasterDto> departmentList = new ArrayList<DepartmentMasterDto>();
		WorkflowMasterDto workflowMasterDto = new WorkflowMasterDto();

		WorkflowMasterDto wfDto = new WorkflowMasterDto();
		String requestString = "";

		requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());

		wfDto = objectMapper.readValue(requestString, WorkflowMasterDto.class);
		wfDto.setWfGroupId(wfDto.getWfGroupId());

		model.addAttribute("userId", wfDto.getWfGroupId());
		model.addAttribute("recordStatus", "Edit Parameter");
		wfDto.setMakerId(user.getUserId().toUpperCase());

		String deptResponse = "Fetch";
		RoleMasterDto roleDto = new RoleMasterDto();
		roleDto.setSearchParam("ALL");
		roleDto.setUserDept(user.getUserDept());
		CodeMasterDto codeMaster = new CodeMasterDto();
		codeMaster.setCodeName("APP MODULE");
		CodeMasterDto ActcodeMaster = new CodeMasterDto();
		ActcodeMaster.setCodeName("ACTION STATUS");
		CodeMasterDto officecodeMaster = new CodeMasterDto();
		officecodeMaster.setCodeName("OFFICE TYPE");

		resDto = commonUtility.objectToJson(ActcodeMaster);
		respDto = commonUtility.objectToJson(deptResponse);
		respoDto = commonUtility.objectToJson(codeMaster);
		resposDto = commonUtility.objectToJson(roleDto);
		editDto = commonUtility.objectToJson(wfDto);
		officerespDto = commonUtility.objectToJson(officecodeMaster);
		try {

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewWorkflowModel, editDto));
			wfDto = objectMapper.readValue(respString, WorkflowMasterDto.class);
			model.addAttribute("wfDistinct", wfDto);
			model.addAttribute("wfData", wfDto.getActionViewList());

			final String respoString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctWorkflowData, editDto));
			wfDto = objectMapper.readValue(respoString, WorkflowMasterDto.class);

			model.addAttribute("wfDistinctmodule", wfDto);

			model.addAttribute("wfmodule", workflowMasterDto);

			final String deptListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDept, respDto));
			departmentList = objectMapper.readValue(deptListStr, new TypeReference<List<DepartmentMasterDto>>() {
			});

			final String RoleListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRoleList, resposDto));
			roleDto = objectMapper.readValue(RoleListStr, RoleMasterDto.class);
			model.addAttribute("roleList", roleDto.getRoleList());

			final String WfListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchWorkflowList, respoDto));
			codeMaster = objectMapper.readValue(WfListStr, CodeMasterDto.class);
			model.addAttribute("wfList", codeMaster.getModuleNameList());

			final String WfActionListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchActionList, resDto));
			codeMaster = objectMapper.readValue(WfActionListStr, CodeMasterDto.class);
			model.addAttribute("ActionList", codeMaster.getActionList());

			final String officeSetList = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + workflowOfficetypeList, officerespDto));
			codeMaster = objectMapper.readValue(officeSetList, CodeMasterDto.class);
			model.addAttribute("cntrlLib", codeMaster);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		workflowMasterDto.setUserName(user.getUsername());

		for (DepartmentMasterDto deptDto : departmentList) {
			deptDto.setDeptName(deptDto.getDeptName().toUpperCase());
			deptList.add(deptDto);
		}

		model.addAttribute("deptList", deptList);

		return "editWorkflow";
	}

	@PostMapping("/editWorkflowAction")
	public String editWorkflowAction(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		HttpHeaders resHeaders = null;

		WorkflowMasterDto workflowMasterDto = new WorkflowMasterDto();
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> workflowString = null;
		String requestString = "";

		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			workflowMasterDto = objectMapper.readValue(requestString, WorkflowMasterDto.class);
			workflowMasterDto.setMakerId(user.getUserId().toUpperCase());
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			workflowMasterDto.setUser(userDto);
			respDto = commonUtility.objectToJson(workflowMasterDto);
			// User Validation
			workflowString = commonUtility.webserviceConsume(uri + editWorkflowAction, respDto);
			resHeaders = workflowString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Workflow Edited");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/WorkflowSummary";
	}

	@RequestMapping(value = "/verifyWorkflowExist")
	@ResponseBody
	public WorkflowMasterDto varifyWorkFlowExist(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		WorkflowMasterDto workflowDto = new WorkflowMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			workflowDto = objectMapper.readValue(pageValJson, WorkflowMasterDto.class);

			respDto = commonUtility.objectToJson(workflowDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + verifyWorkflowExist, respDto));
			workflowDto = objectMapper.readValue(respString, WorkflowMasterDto.class);

			/*
			 * final String respoString = commonUtility
			 * .decryptedResToString(commonUtility.webserviceConsume(uri +
			 * fetchDistinctWorkflowData, respDto)); workflowDto =
			 * objectMapper.readValue(respoString, WorkflowMasterDto.class);
			 */

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return workflowDto;
	}

	
	
	
	@RequestMapping(value = "/viewAuditTrail")
	@ResponseBody
	public List<AuditTrailDto> viewAuditTrail(@AuthenticationPrincipal User user, HttpServletRequest request,
			Model model) throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		List<AuditTrailDto> alDto = new ArrayList<AuditTrailDto>();
		ActivityLogDto actLogDto = new ActivityLogDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			actLogDto = objectMapper.readValue(pageValJson, ActivityLogDto.class);
			actLogDto.setRoleName(user.getUserPosition());
			respDto = commonUtility.objectToJson(actLogDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewAuditTrail, respDto));
			alDto = objectMapper.readValue(respString, new TypeReference<List<AuditTrailDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return alDto;
	}
	
}
