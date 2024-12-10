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
import java.util.ArrayList;
import java.util.List;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.DepartmentMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.SwitchOfficeDto;
import com.idbi.intech.erm.domain.app.TopRiskMasterDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class switchOfficeController {
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	@Value("${app-url.uri}")
	private String uri;
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;

	@Autowired
	private CommonUtility commonUtility;
	@Value("${app-url.fetchswitchOfcData}")
	private String fetchswitchOfcData;
	@Value("${app-url.getOfficeCodeListByOfcType}")
	private String getOfficeCodeListByOfcType;
	@Value("${app-url.switchOfficeData}")
	private String switchOfficeData;

	@RequestMapping("/switchOffice")
	public String switchOffice(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "source") String source)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		SwitchOfficeDto switchOfcDto = new SwitchOfficeDto();
		List<DepartmentMasterDto> deptDtoList = new ArrayList<>();
		RequestResponseJsonDto respDto = null;
		try {
			String sourceText = "";
			sourceText = source == null ? "" : source;

			// deptDtoList = commonUtility.fetchDeptList();
			switchOfcDto.setMakerId(user.getUserId());
			respDto = commonUtility.objectToJson(switchOfcDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchswitchOfcData, respDto));
			switchOfcDto = objectMapper.readValue(respString, SwitchOfficeDto.class);

			model.addAttribute("switchOfcDto", switchOfcDto);

			String messageText = "";
			if (sourceText != null) {

				if (null != sourceText && sourceText.equals("INVALIDOFC")) {
					messageText = "Office Not Present";
					model.addAttribute("message", messageText);
				}
			}
		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

		return "switchOfficePage";

	}

	@RequestMapping(value = "/getOfficeCodeByOfficeType")
	@ResponseBody
	public SwitchOfficeDto getOfficeCodeAndDeptList(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		SwitchOfficeDto switchOfcDto = new SwitchOfficeDto();
		List<String> officeCodeList = new ArrayList<String>();
		RequestResponseJsonDto respDto = null;

		try {
			String pageValJson = request.getParameter("pageValJson");
			switchOfcDto = objectMapper.readValue(pageValJson, SwitchOfficeDto.class);
			respDto = commonUtility.objectToJson(switchOfcDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getOfficeCodeListByOfcType, respDto));

			/*
			 * officeCodeList = objectMapper.readValue(respString, new
			 * TypeReference<List<String>>() { });
			 */
			switchOfcDto = objectMapper.readValue(respString, SwitchOfficeDto.class);

			// System.out.println("officeCodeList "+officeCodeList);

		} catch (Exception e) {

			e.printStackTrace();
		}

		return switchOfcDto;
	}

	@PostMapping("/switchOfficePage")
	public String switchOfficePage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		SwitchOfficeDto switchOfcDto = new SwitchOfficeDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		RequestResponseJsonDto respDto = null;
		ResponseEntity<String> resString = null;

		String requestString = "";

		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			switchOfcDto = objectMapper.readValue(requestString, SwitchOfficeDto.class);
			switchOfcDto.setMakerId(user.getUserId().toUpperCase());
			switchOfcDto.setUserRole(user.getUserPosition());
			respDto = commonUtility.objectToJson(switchOfcDto);

			// resString = commonUtility.webserviceConsume(uri + switchOfficeData, respDto);
			user.setOfficeCode(switchOfcDto.getOfficeCode());
			user.setUserDept(switchOfcDto.getDepartment());
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + switchOfficeData, respDto));
			switchOfcDto = objectMapper.readValue(respString, SwitchOfficeDto.class);
			if (switchOfcDto.getRequestStatus().equalsIgnoreCase("00")) {
				user.setUserOfficeType(switchOfcDto.getOfficeType());
				user.setUserOffice(switchOfcDto.getOfficeId());
				user.setUserDeptName(switchOfcDto.getDepartmentName());
				user.setMenuMapList(switchOfcDto.getMenuMapList());
				user.setSelectedOfficeType(switchOfcDto.getSelectedOfficeType());
			} else {
				if (switchOfcDto.getRequestStatus().equalsIgnoreCase("01")) {
					redirectAttributes.addFlashAttribute("source", "INVALIDOFC");
					return "redirect:/RolePage";
				}

			}

			// resHeaders = respString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (switchOfcDto.getRequestStatus().equalsIgnoreCase("00")) {
				redirectAttributes.addFlashAttribute("source", "SWITCHOFC");
			} else if (switchOfcDto.getRequestStatus().equalsIgnoreCase("01")) {
				redirectAttributes.addFlashAttribute("source", "INVALIDOFC");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/RolePage";

	}

	@RequestMapping("/switchOfficeDetail")
	@ResponseBody
	public SwitchOfficeDto switchOfficeDetail(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes,
			Model model, @ModelAttribute(name = "source") String source)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		SwitchOfficeDto switchOfcDto = new SwitchOfficeDto();
		RequestResponseJsonDto respDto = null;
		try {

			switchOfcDto.setMakerId(user.getUserId());
			respDto = commonUtility.objectToJson(switchOfcDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchswitchOfcData, respDto));
			switchOfcDto = objectMapper.readValue(respString, SwitchOfficeDto.class);

		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

		return switchOfcDto;

	}

}
