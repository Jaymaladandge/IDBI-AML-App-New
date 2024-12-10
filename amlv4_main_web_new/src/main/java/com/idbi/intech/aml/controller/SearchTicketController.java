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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.AlertCategoryCalDto;
import com.idbi.intech.aml.domain.app.AlertCommentDto;
import com.idbi.intech.aml.domain.app.AlertMasterDto;
import com.idbi.intech.aml.domain.app.SearchTicketDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class SearchTicketController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.searchTicketData}")
	private String searchTicketData;
	@Value("${app-url.fetchTicketComment}")
	private String fetchTicketComment;
	@Value("${app-url.validateSession}")
	private String validateSession;
	@Value("${app-url.context-path}")
	private String contextPath;
	@Value("${app-url.fetchOldAlerts}")
	private String fetchOldAlerts;
	@Value("${app-url.fetchAccfRiskData}")
	private String fetchAccfRiskData;

	@Autowired
	private CommonUtility commonUtility;

	RequestResponseJsonDto respDto = null;

	@RequestMapping("/searchTicket")
	public String redirectToSearchPage(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDtoObject = new UserDto();
		String returnString = "";
		try {
			userDtoObject.setUserSession(user.getUserSession());
			userDtoObject.setUserId(user.getUserId());
			respDto = commonUtility.objectToJson(userDtoObject);
			String respString = "";
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateSession, respDto));
			userDtoObject = objectMapper.readValue(respString, UserDto.class);
			if (userDtoObject.isLogin()) {
				SearchTicketDto searchTicketDto = new SearchTicketDto();
				searchTicketDto.setSearchParam("");
				searchTicketDto.setSearchValue("");
				searchTicketDto.setRespMsg("success");
				model.addAttribute("searchData", searchTicketDto);
				returnString = "searchTicket";
			} else {
				returnString = "multipleLogin";
			}
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return returnString;

	}

	@RequestMapping("/searchTicketData")
	public String searchTicketData(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) {
		SearchTicketDto searchTicketDto = new SearchTicketDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		UserDto userDtoObject = new UserDto();
		String returnString = "";
		try {
			userDtoObject.setUserSession(user.getUserSession());
			userDtoObject.setUserId(user.getUserId());
			respDto = commonUtility.objectToJson(userDtoObject);
			String responseString = "";
			responseString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateSession, respDto));
			userDtoObject = objectMapper.readValue(responseString, UserDto.class);
			if (userDtoObject.isLogin()) {
				// Encrypted JSON Request
				requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
				searchTicketDto = objectMapper.readValue(requestString, SearchTicketDto.class);
				searchTicketDto.setUserRole(user.getUserPosition());
				respDto = commonUtility.objectToJson(searchTicketDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + searchTicketData, respDto));
				searchTicketDto = objectMapper.readValue(respString, SearchTicketDto.class);
				model.addAttribute("searchData", searchTicketDto);
				returnString = "searchTicket";
			} else {
				returnString = "multipleLogin";
			}
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return returnString;
	}

	@RequestMapping(value = "/fetchTicketComment")
	@ResponseBody
	public AlertCommentDto fetchTicketComment(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AlertCommentDto alertCommentDto = new AlertCommentDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertCommentDto = objectMapper.readValue(pageValJson, AlertCommentDto.class);
			respDto = commonUtility.objectToJson(alertCommentDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchTicketComment, respDto));
			alertCommentDto = objectMapper.readValue(respString, AlertCommentDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertCommentDto;
	}

	@RequestMapping(value = "/fetchOldTicketComment")
	@ResponseBody
	public AlertMasterDto fetchOldTicketComment(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AlertMasterDto alertMasterDto = new AlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertMasterDto = objectMapper.readValue(pageValJson, AlertMasterDto.class);
			alertMasterDto.setCurrentRole(user.getUserPosition());
			respDto = commonUtility.objectToJson(alertMasterDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + fetchOldAlerts, respDto));
			alertMasterDto = objectMapper.readValue(respString, AlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertMasterDto;
	}
	
	@RequestMapping(value = "/fetchAccfRiskData")
	@ResponseBody
	public AlertCategoryCalDto fetchAccfRiskData(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AlertCategoryCalDto accfDto = new AlertCategoryCalDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			accfDto = objectMapper.readValue(pageValJson, AlertCategoryCalDto.class);
 			respDto = commonUtility.objectToJson(accfDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + fetchAccfRiskData, respDto));
			accfDto = objectMapper.readValue(respString, AlertCategoryCalDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return accfDto;
	}
}
