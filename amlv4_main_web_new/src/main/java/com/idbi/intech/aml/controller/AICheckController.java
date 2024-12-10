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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.ChatGPTDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class AICheckController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.context-path}")
	private String contextPath;

	@RequestMapping("/getAICheckResponse")
	@ResponseBody
	public ChatGPTDto getAICheckResponse(@AuthenticationPrincipal User user, Model model, HttpSession session,
			HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		ChatGPTDto chatGPTDto = new ChatGPTDto();
		RequestResponseJsonDto respDto = null;
		try {
			String pageValJson = request.getParameter("pageValJson");
			chatGPTDto = objectMapper.readValue(pageValJson, ChatGPTDto.class);
			respDto = commonUtility.objectToJson(chatGPTDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + "getAICheckResponse", respDto));
			chatGPTDto = objectMapper.readValue(respString, ChatGPTDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return chatGPTDto;

	}

}
