package com.idbi.intech.oms.controller;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;

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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.oms.domain.app.QueryResultDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.oms.domain.app.RuleMasterDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class RuleBuilderController {
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	@Value("${app-url.uri}")
	private String uri;
	@Autowired
	private CommonUtility commonUtility;
	RequestResponseJsonDto respDto = null;
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	@Value("${app-url.fetchRuleData}")
	private String fetchRuleData;
	@Value("${app-url.validateQuery}")
	private String validateQuery;
	@Value("${app-url.testQueryResult}")
	private String testQueryResult;
	@Value("${app-url.createRuleAction}")
	private String createRuleAction;
	@Value("${app-url.checkRuleId}")
	private String checkRuleId;
	@Value("${app-url.getRuleSummary}")
	private String getRuleSummary;
	@Value("${app-url.getInfoByRuleId}")
	private String getInfoByRuleId;
	@Value("${app-url.getRuleEditData}")
	private String getRuleEditData;
	@Value("${app-url.editRuleAction}")
	private String editRuleAction;
	@Value("${app-url.ruleApprovalPage}")
	private String ruleApprovalPage;

	@RequestMapping("/createRule")
	public String createRule(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		RuleMasterDto ruleBuiderDto = new RuleMasterDto();
		UserDto userDto = new UserDto();

		try {

			respDto = commonUtility.objectToJson(ruleBuiderDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRuleData, respDto));
			ruleBuiderDto = objectMapper.readValue(respString, RuleMasterDto.class);

		} catch (Exception e) {
			e.printStackTrace();
		}

		ruleBuiderDto.setRecordId(commonUtility.getRulePrimaryKey());
		userDto.setUsername(user.getUsername());
		model.addAttribute("recordStatus", "Create Rule");
		model.addAttribute("ruleBuiderDto", ruleBuiderDto);

		ruleBuiderDto.getRuleParameterList().entrySet().forEach(data -> {
			if (data.getKey().equalsIgnoreCase("priorityList")) {
				model.addAttribute("priorityList", data.getValue());
			} else if (data.getKey().equalsIgnoreCase("reportTypeList")) {
				model.addAttribute("reportTypeList", data.getValue());
			} else if (data.getKey().equalsIgnoreCase("ruleKeyList")) {
				model.addAttribute("ruleKeyList", data.getValue());
			} else if (data.getKey().equalsIgnoreCase("RuleClassification")) {
				model.addAttribute("RuleClassification", data.getValue());
			} else if (data.getKey().equalsIgnoreCase("RuleDependency")) {
				model.addAttribute("RuleDependency", data.getValue());
			}
		});
		model.addAttribute("comment", ruleBuiderDto.getCommentList());

		return "createRules";
	}

	@RequestMapping(value = "/validateQuery")
	@ResponseBody
	public RuleMasterDto validateQuery(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		RuleMasterDto ruleBuiderDto = new RuleMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			ruleBuiderDto = objectMapper.readValue(pageValJson, RuleMasterDto.class);
			respDto = commonUtility.objectToJson(ruleBuiderDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateQuery, respDto));
			ruleBuiderDto = objectMapper.readValue(respString, new TypeReference<RuleMasterDto>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return ruleBuiderDto;
	}

	@RequestMapping(value = "/testQuery")
	@ResponseBody
	public QueryResultDto testQuery(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		QueryResultDto queryDto = new QueryResultDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			queryDto = objectMapper.readValue(pageValJson, QueryResultDto.class);
			respDto = commonUtility.objectToJson(queryDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + testQueryResult, respDto));
			queryDto = objectMapper.readValue(respString, QueryResultDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return queryDto;
	}

	@PostMapping("/createRuleAction")
	public String createRuleAction(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		RuleMasterDto ruleDto = new RuleMasterDto();
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> workflowString = null;
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			ruleDto = objectMapper.readValue(requestString, RuleMasterDto.class);
			ruleDto.setMakerId(user.getUserId().toUpperCase());
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			userDto.setSelectedOfcType(user.getSelectedOfficeType());
			userDto.setOfficeCode(user.getOfficeCode());
			ruleDto.setUser(userDto);
			respDto = commonUtility.objectToJson(ruleDto);
			// User Validation
			workflowString = commonUtility.webserviceConsume(uri + createRuleAction, respDto);
			resHeaders = workflowString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Record Created Successfully And Sent For Verification");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/RuleBuilderSummary";
	}

	@RequestMapping(value = "/checkRuleId")
	@ResponseBody
	public RuleMasterDto checkRuleId(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		RuleMasterDto ruleDto = new RuleMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			ruleDto = objectMapper.readValue(pageValJson, RuleMasterDto.class);
			respDto = commonUtility.objectToJson(ruleDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + checkRuleId, respDto));
			ruleDto = objectMapper.readValue(respString, RuleMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return ruleDto;
	}

	@RequestMapping("/RuleBuilderSummary")
	public String ruleSummary(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			HttpSession session, RedirectAttributes redirectAttributes)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {

		String sourceText = "";
		sourceText = source == null ? "" : source;
		String requestString = "";
		String messageText = "";
		RuleMasterDto ruleDto = new RuleMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();

		try {

			ruleDto.setRecordStatus("Cr");
			ruleDto.setSearchParam("ALL");
			respDto = commonUtility.objectToJson(ruleDto);
			requestString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getRuleSummary, respDto));
			ruleDto = objectMapper.readValue(requestString, RuleMasterDto.class);

			model.addAttribute("ruleDtoList", ruleDto);
			model.addAttribute("user", user);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		model.addAttribute("message", messageText);

		model.addAttribute("message", messageText);
		
		String redirectPage = "";
		if (user.getAdminFlg() != null && user.getAdminFlg().equalsIgnoreCase("Y") ) {
			redirectPage = "ruleBuilderSummary";
		}else {
			redirectPage = "redirect:/logout";
		}
		
		return redirectPage;

	}

	@RequestMapping("/createVerifyRule")
	public String createVerifyRule(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "sourceId") String sourceId) {
		final ObjectMapper objectMapper = new ObjectMapper();

		RuleMasterDto ruleDto = new RuleMasterDto();
		UserDto userDto = new UserDto();
		try {
			userDto.setUserDept(user.getUserDept());
			userDto.setMakerId(user.getUserId().toUpperCase());
			ruleDto.setUser(userDto);
			if (sourceName.equals("") && sourceId.equals("")) {

				model.addAttribute("sourceName", "");
				model.addAttribute("sourceId", "nullvalue");
			} else {
				model.addAttribute("sourceName", sourceName);
				model.addAttribute("sourceId", sourceId);
				ruleDto.setRuleId(sourceId);
			}

			if (sourceName.equalsIgnoreCase("EDIT") || sourceName.equalsIgnoreCase("EDITVERIFY")
					|| sourceName.equalsIgnoreCase("EDITREJECT")) {
				ruleDto.setSearchParam("Edit");

				respDto = commonUtility.objectToJson(ruleDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + getInfoByRuleId, respDto));
				ruleDto = objectMapper.readValue(respString, RuleMasterDto.class);
				model.addAttribute("ruleDto", ruleDto);
				model.addAttribute("user", user);

				if (sourceName.equalsIgnoreCase("edit")) {
					model.addAttribute("oldActionStatus", "ER");

					model.addAttribute("riskStatus", "Pending  Verification for Edit");
				} else if (sourceName.equalsIgnoreCase("editverify")) {
					model.addAttribute("oldActionStatus", "EV");

					model.addAttribute("riskStatus", "Pending  Approval for Edit");
				}

			} else {
				ruleDto.setSearchParam("Create");
				respDto = commonUtility.objectToJson(ruleDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + getInfoByRuleId, respDto));
				ruleDto = objectMapper.readValue(respString, RuleMasterDto.class);
				model.addAttribute("ruleDto", ruleDto);
				model.addAttribute("user", user);

				if (sourceName.equalsIgnoreCase("create")) {
					model.addAttribute("oldActionStatus", "CR");
				} else if (sourceName.equalsIgnoreCase("createverify")) {
					model.addAttribute("oldActionStatus", "VR");
				}
			}
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

		}

		return "verifyRulePage";
	}

	@RequestMapping("/editCreatedRule")
	public String editCreatedRule(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		RuleMasterDto ruleDto = new RuleMasterDto();
		RuleMasterDto ruleBuiderDto = new RuleMasterDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			ruleDto = objectMapper.readValue(requestString, RuleMasterDto.class);
			respDto = commonUtility.objectToJson(ruleDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getRuleEditData, respDto));
			ruleDto = objectMapper.readValue(respString, RuleMasterDto.class);
			model.addAttribute("ruleDto", ruleDto);
			model.addAttribute("user", user);

			final String respString2 = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRuleData, respDto));
			ruleBuiderDto = objectMapper.readValue(respString2, RuleMasterDto.class);

			model.addAttribute("ruleBuiderDto", ruleBuiderDto);

			ruleBuiderDto.getRuleParameterList().entrySet().forEach(data -> {
				if (data.getKey().equalsIgnoreCase("priorityList")) {
					model.addAttribute("priorityList", data.getValue());
				} else if (data.getKey().equalsIgnoreCase("reportTypeList")) {
					model.addAttribute("reportTypeList", data.getValue());
				} else if (data.getKey().equalsIgnoreCase("ruleKeyList")) {

					model.addAttribute("ruleKeyList", data.getValue());
				} else if (data.getKey().equalsIgnoreCase("RuleClassification")) {
					model.addAttribute("RuleClassification", data.getValue());
				} else if (data.getKey().equalsIgnoreCase("RuleDependency")) {
					model.addAttribute("RuleDependency", data.getValue());
				}
			});
			model.addAttribute("comment", ruleBuiderDto.getCommentList());

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

		}

		return "editRulePage";
	}

	@PostMapping("/editRuleAction")
	public String editRuleAction(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		RuleMasterDto ruleDto = new RuleMasterDto();
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> workflowString = null;
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			ruleDto = objectMapper.readValue(requestString, RuleMasterDto.class);
			ruleDto.setMakerId(user.getUserId().toUpperCase());
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			userDto.setSelectedOfcType(user.getSelectedOfficeType());
			userDto.setOfficeCode(user.getOfficeCode());
			ruleDto.setUser(userDto);
			respDto = commonUtility.objectToJson(ruleDto);
			// User Validation
			workflowString = commonUtility.webserviceConsume(uri + editRuleAction, respDto);
			resHeaders = workflowString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Record Created Successfully");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/RuleBuilderSummary";
	}

	@PostMapping("/ruleApprovalPage")
	public String ruleApprovalPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		RuleMasterDto ruleDto = new RuleMasterDto();
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> workflowString = null;
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			ruleDto = objectMapper.readValue(requestString, RuleMasterDto.class);
			ruleDto.setMakerId(user.getUserId().toUpperCase());
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			userDto.setSelectedOfcType(user.getSelectedOfficeType());
			userDto.setOfficeCode(user.getOfficeCode());
			ruleDto.setUser(userDto);
			respDto = commonUtility.objectToJson(ruleDto);
			// User Validation
			workflowString = commonUtility.webserviceConsume(uri + ruleApprovalPage, respDto);
			resHeaders = workflowString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Record Created Successfully And Sent For Verification");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/home";
	}

	@RequestMapping(value = "/getRuleById")
	@ResponseBody
	public RuleMasterDto getRuleById(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		RuleMasterDto ruleDto = new RuleMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			ruleDto = objectMapper.readValue(pageValJson, RuleMasterDto.class);
			respDto = commonUtility.objectToJson(ruleDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getRuleEditData, respDto));
			ruleDto = objectMapper.readValue(respString, RuleMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return ruleDto;
	}

	@RequestMapping("/searchRuleList")
	@ResponseBody
	public RuleMasterDto searchRuleList(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		RuleMasterDto ruleDto = new RuleMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			ruleDto = objectMapper.readValue(pageValJson, RuleMasterDto.class);
			respDto = commonUtility.objectToJson(ruleDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getRuleSummary, respDto));
			ruleDto = objectMapper.readValue(respString, RuleMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return ruleDto;
	}

}
