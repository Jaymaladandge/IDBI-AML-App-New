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
import com.idbi.intech.erm.domain.app.ActionPlanMasterDto;
import com.idbi.intech.erm.domain.app.ActionPlanModelDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.KeyRiskIndicatorMasterDto;
import com.idbi.intech.erm.domain.app.LicenseMasterDto;
import com.idbi.intech.erm.domain.app.LicenseModelDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class SubscriptionPageController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchLicenseDtls}")
	private String fetchLicenseDtls;
	@Value("${app-url.createNewLicense}")
	private String createNewLicense;

	@Autowired
	private CommonUtility commonUtility;

	RequestResponseJsonDto respDto = null;

	@RequestMapping(value = "/fetchLicenseDtls")
	@ResponseBody
	public LicenseModelDto fetchLicenseDtls(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		LicenseModelDto licenseModDto = new LicenseModelDto(); // Action Plan Model Dto
		LicenseMasterDto licenseDto = new LicenseMasterDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			licenseDto = objectMapper.readValue(pageValJson, LicenseMasterDto.class);
			respDto = commonUtility.objectToJson(licenseDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchLicenseDtls, respDto));
			licenseModDto = objectMapper.readValue(respString, LicenseModelDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return licenseModDto;
	}

//savelicense
	@PostMapping("/savelicense")
	public String savelicense(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {

		HttpHeaders resHeaders = null;
		// KeyRiskIndicatorMasterDto kriMasterDto = new KeyRiskIndicatorMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> licenseString = null;
		String requestString = "";
		LicenseMasterDto licenseDto = new LicenseMasterDto();
		try {
			// Encrypted JSON Request
			commonUtility.uploadFiles(multipartFile);
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());

			licenseDto = objectMapper.readValue(requestString, LicenseMasterDto.class);

			respDto = commonUtility.objectToJson(licenseDto);

			// User Validation
			licenseString = commonUtility.webserviceConsume(uri + createNewLicense, respDto);
			resHeaders = licenseString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Record Save");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}
		return "redirect:/home";

	}
}
