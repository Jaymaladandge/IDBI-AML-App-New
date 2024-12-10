package com.idbi.intech.erm.controller;

import java.security.Security;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.IncidentDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class CTRController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	
	@Value("${app-url.uri}")
	private String uri;
	
	
	
	
	
	@Autowired
	private CommonUtility commonUtility;
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;

	RequestResponseJsonDto respDto = null;
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	
	
	
	//@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
	@RequestMapping("/loadCTRPage")
	public String loadCTRPage(@AuthenticationPrincipal User user,Model model) {

		
		try {
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		

		return "loadCTRPage";
	}
	
	
	
	
	
	
}
