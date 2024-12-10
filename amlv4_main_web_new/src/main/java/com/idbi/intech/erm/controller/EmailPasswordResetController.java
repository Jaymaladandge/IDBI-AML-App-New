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

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.AppParameterDto;
import com.idbi.intech.erm.domain.app.EmailDetailsDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class EmailPasswordResetController {
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
		
	}
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchEmailDetails}")
	private String fetchEmailDetails;
	@Value("${app-url.emailPasswordMail}")
	private String emailPasswordMail;
	@Value("${app-url.emailPasswordSaveChange}")
	private String emailPasswordSaveChange;
	
	
	
	@Autowired
	private CommonUtility commonUtility;
	
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;
	
	RequestResponseJsonDto respDto = null;
	
	@RequestMapping("/emailPasswordReset")
	public String emailPasswordReset(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,Model model)
			throws JsonProcessingException {
		
		final ObjectMapper objectMapper = new ObjectMapper();
		
		try {
			AppParameterDto appDto = new AppParameterDto();
			appDto.setParamKey("EMAIL CREDENTIALS");
			respDto = commonUtility.objectToJson(appDto);

			final String emailStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchEmailDetails, respDto));
			appDto = objectMapper.readValue(emailStr, AppParameterDto.class);
			
			model.addAttribute("Email", appDto.getEmailDetailsDto().getEmailCredentialsList().get(1));
			
			model.addAttribute("username",user.getUserEmail());
			
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		
		return "emailpasswordreset";

	}
	
	@RequestMapping(value = "/emailPasswordMailChack")
	@ResponseBody
	public EmailDetailsDto emailMailConfirmation(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		EmailDetailsDto emailDto = new EmailDetailsDto();
		
		try {
			String pageValJson = request.getParameter("pageValJson");
			emailDto = objectMapper.readValue(pageValJson, EmailDetailsDto.class);
			emailDto.setEmailId(user.getUserEmail());
	
			respDto = commonUtility.objectToJson(emailDto);
	
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + emailPasswordMail, respDto));
			emailDto = objectMapper.readValue(respString, EmailDetailsDto.class);
			
	
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
	
		return emailDto;
	}
	
	@RequestMapping("/emailPasswordResetAction")
	public String emailPasswordResetAction(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model,RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		
		HttpHeaders resHeaders = null;
		AppParameterDto appDto= new AppParameterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> workflowString = null;
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			appDto = objectMapper.readValue(requestString, AppParameterDto.class);
			appDto.setParamKey("EMAIL CREDENTIALS");
			respDto = commonUtility.objectToJson(appDto);
			// User Validation
			workflowString = commonUtility.webserviceConsume(uri + emailPasswordSaveChange, respDto);
			resHeaders = workflowString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Update Password");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}
		return "redirect:/home";

	}

}
