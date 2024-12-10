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
import javax.servlet.http.HttpSession;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.DashboardReportDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class DashboardReportController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.getDashboardReport}")
	private String getDashboardReport;
	RequestResponseJsonDto respDto = null;
	
	
	@RequestMapping("/getDashboardReportData")
	public String getDashboardReportData(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) throws JsonProcessingException 
	{
		final ObjectMapper objectMapper = new ObjectMapper();
		DashboardReportDto dashDto = new DashboardReportDto();
		
		try
		{
			dashDto.setUserId(user.getUserId());
			dashDto.setRoleId(user.getUserPosition());
			
			respDto = commonUtility.objectToJson(dashDto);
			String responseString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getDashboardReport, respDto));
			dashDto = objectMapper.readValue(responseString, DashboardReportDto.class);
		}
		catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		
		model.addAttribute("dashDto", dashDto);
		return "dashboard";
	}
	
	 

	
}
