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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.RuleMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class RuleManagementController {
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	// CommonUtility Object
	@Autowired
	private CommonUtility commonUtility;

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchAllRuleList}")
	private String fetchAllRuleList;
	@Value("${app-url.context-path}")
	private String contextPath;
	@Value("${app-url.fetchRuleDetails}")
	private String fetchRuleDetails;
	@Value("${app-url.saveEditedRule}")
	private String saveEditedRule;
	@Value("${app-url.fetchRuleRiskParam}")
	private String fetchRuleRiskParam;
	@Value("${app-url.fetchVerifyRuleDetails}")
	private String fetchVerifyRuleDetails;
	@Value("${app-url.verifyRule}")
	private String verifyRule;
	@Value("${app-url.validateSession}")
	private String validateSession;
	

	RequestResponseJsonDto respDto = null;

	@RequestMapping("/fetchAllRuleList")
	public String fetchAllRuleList(@AuthenticationPrincipal User user, Model model,
			@ModelAttribute(name = "source") String source, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			if (source == null || source.equals("")) {
				source = "NA";
			}
			UserDto userObj = new UserDto();
			userObj.setUserRole(user.getUserPosition());
			userObj.setUserId(user.getUserId());
			respDto = commonUtility.objectToJson(userObj);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + fetchAllRuleList, respDto));
			RuleMasterDto ruleMasterDto = objectMapper.readValue(respString, RuleMasterDto.class);
			model.addAttribute("ruleDto", ruleMasterDto);
			model.addAttribute("source", source);
		} catch ( Exception e) {
			e.printStackTrace();
		}
		return "ruleManagementSummary";
	}

	@PostMapping("/editRulePage")
	public String editRulePage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		RuleMasterDto ruleDto = new RuleMasterDto();
		try {
			requestString = encryptedRequest.getEncryptedJson();
			ruleDto = objectMapper.readValue(requestString, RuleMasterDto.class);
			respDto = commonUtility.objectToJson(ruleDto);
			final String response = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + fetchRuleDetails, respDto));
			ruleDto = objectMapper.readValue(response, RuleMasterDto.class);
			model.addAttribute("ruleDto", ruleDto);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException | NullPointerException e) {
			e.printStackTrace();
		}
		return "editRule";

	}

	@RequestMapping("/saveEditedRule")
	public String saveEditedRule(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		RuleMasterDto ruleDto = new RuleMasterDto();
		String requestString = "";
		HttpHeaders resHeaders = null;
		ResponseEntity<String> rasString = null;
		try {
			requestString = encryptedRequest.getEncryptedJson();
			ruleDto = objectMapper.readValue(requestString, RuleMasterDto.class);
			ruleDto.setLastUserId(user.getUserId());
			ruleDto.setUserRole(user.getUserPosition());
			respDto = commonUtility.objectToJson(ruleDto);
			rasString = commonUtility.webserviceConsume(uri + contextPath + saveEditedRule, respDto);
			resHeaders = rasString.getHeaders();
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			redirectAttributes.addFlashAttribute("source", "ERROR");
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Modified Rule Sent For Verification Successfully");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}
		return "redirect:/fetchAllRuleList";
	}

	@RequestMapping(value = "/fetchRuleRiskParam")
	@ResponseBody
	public RuleMasterDto fetchRuleRiskParam(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		RuleMasterDto ruleMasterDto = new RuleMasterDto();
		try {
			respDto = commonUtility.objectToJson(ruleMasterDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + fetchRuleRiskParam, respDto));
			ruleMasterDto = objectMapper.readValue(respString, RuleMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return ruleMasterDto;
	}

	@PostMapping("/verifyRulePage")
	public String verifyRulePage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		RuleMasterDto ruleDto = new RuleMasterDto();
		try {
			requestString = encryptedRequest.getEncryptedJson();
			ruleDto = objectMapper.readValue(requestString, RuleMasterDto.class);
			respDto = commonUtility.objectToJson(ruleDto);
			final String response = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + fetchVerifyRuleDetails, respDto));
			ruleDto = objectMapper.readValue(response, RuleMasterDto.class);
			model.addAttribute("ruleDto", ruleDto);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException | NullPointerException e) {
			e.printStackTrace();
		}
		return "verifyRule";

	}
	
	

	@PostMapping("/verifyRule")
	public String verifyRule(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		RuleMasterDto ruleDto = new RuleMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String returnString = "";
		String source = "";
		UserDto userDtoObject = new UserDto();
		try {
			// Encrypted JSON Request
			userDtoObject.setUserSession(user.getUserSession());
			userDtoObject.setUserId(user.getUserId());
			respDto = commonUtility.objectToJson(userDtoObject);
			String responseString = "";
			responseString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateSession, respDto));
			userDtoObject = objectMapper.readValue(responseString, UserDto.class);
			if (userDtoObject.isLogin()) {
				requestString = encryptedRequest.getEncryptedJson();
				ruleDto = objectMapper.readValue(requestString, RuleMasterDto.class);
				ruleDto.setMakerId(user.getUserId());
				ruleDto.setUserRole(user.getUserPosition());
				respDto = commonUtility.objectToJson(ruleDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + verifyRule, respDto));
				ruleDto = objectMapper.readValue(respString, RuleMasterDto.class);
				if (ruleDto.getMsg().equals("success")) {
					source = "Rule Successfully Verified";
				} else {
					source = "Some Error Occurred";
				}
				redirectAttributes.addFlashAttribute("source", source);
				returnString = "redirect:/fetchAllRuleList";
			} else {
				returnString = "multipleLogin";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return returnString;
	}

}
