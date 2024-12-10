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
import java.util.Arrays;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.AppSysMaintenanceDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class SystemMaintenanceController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.AddNewMaintenanceActivity}")
	private String AddNewMaintenanceActivity;
	@Value("${app-url.MaintenanceActivitySummary}")
	private String MaintenanceActivitySummary;
	@Value("${app-url.removeSysMaintenanceById}")
	private String removeSysMaintenanceById;

	@Autowired
	private CommonUtility commonUtility;

	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;

	RequestResponseJsonDto respDto = null;

	@RequestMapping("/AddNewMaintenanceEntry")
	public String addNewMaintenanceEntry(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {
		AppSysMaintenanceDto sysDto = new AppSysMaintenanceDto();

		sysDto.setMaintenanceId(pkGenerator.getIMPrimaryKey("MNT", "CO"));
		model.addAttribute("sysPk", sysDto);

		model.addAttribute("user", user);
		return "addNewMaintenanceEntry";

	}

	@RequestMapping("/addNewMaintenanceEntryAction")
	public String addNewMaintenanceEntryAction(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		AppSysMaintenanceDto sysDto = new AppSysMaintenanceDto();
		HttpHeaders resHeaders = null;
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> DocumentString = null;
		String requestString = "";
		try {

			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());

			sysDto = objectMapper.readValue(requestString, AppSysMaintenanceDto.class);

			sysDto.setMakerId(user.getUserId().toUpperCase());
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			sysDto.setUser(userDto);

			if (sysDto.getFileDetailsList() != null) {
				sysDto.getFileDetailsList().stream().forEach(e -> {
					Arrays.asList(multipartFile).stream().forEach(file -> {

						if (e.getFileName().equals(file.getOriginalFilename())) {
							if (!e.getFileName().equalsIgnoreCase("No Data Available")) {
								commonUtility.uploadFile(file);
							}

						}
					});
				});
			}

			respDto = commonUtility.objectToJson(sysDto);
			DocumentString = commonUtility.webserviceConsume(uri + AddNewMaintenanceActivity, respDto);

			resHeaders = DocumentString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Record Submited");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/SystemMaintenanceSummary";

	}

	@RequestMapping("/SystemMaintenanceSummary")
	public String systemMaintenanceSummary(
			@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			HttpSession session, RedirectAttributes redirectAttributes)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		AppSysMaintenanceDto sysDto = new AppSysMaintenanceDto();
		sysDto.setSearchParam("ALL");
		try {
			respDto = commonUtility.objectToJson(sysDto);

			final String workflowListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + MaintenanceActivitySummary, respDto));
			sysDto = objectMapper.readValue(workflowListStr, AppSysMaintenanceDto.class);

			model.addAttribute("summaryList", sysDto.getSummaryList());

			model.addAttribute("message", messageText);
			if (null != sourceText && sourceText.equals("Record Submited")) {
				messageText = "Record Submited Successfully";
			} else if (null != sourceText && sourceText.equals("ERROR")) {
				messageText = "Error occured in the request";
			}
			model.addAttribute("message", messageText);
		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();

		}

		return "systemMaintenanceSummary";
	}

	@RequestMapping(value = "/removeSysMaintenanceById")
	@ResponseBody
	public AppSysMaintenanceDto removeSysMaintenanceById(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		AppSysMaintenanceDto sysDto = new AppSysMaintenanceDto();
		try {

			String pageValJson = request.getParameter("pageValJson");
			sysDto = objectMapper.readValue(pageValJson, AppSysMaintenanceDto.class);

			respDto = commonUtility.objectToJson(sysDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + removeSysMaintenanceById, respDto));
			sysDto = objectMapper.readValue(respString, AppSysMaintenanceDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return sysDto;
	}

	@RequestMapping("/searchList")
	public String searchList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) {

		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// Encrypted JSON Request
			AppSysMaintenanceDto sysDto = new AppSysMaintenanceDto();

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			sysDto = objectMapper.readValue(requestString, AppSysMaintenanceDto.class);
			UserDto userDto = new UserDto();
			userDto.setSelectedOfcType(user.getSelectedOfficeType());
			userDto.setUserDept(user.getUserDept());
			sysDto.setUser(userDto);
			respDto = commonUtility.objectToJson(sysDto);
			// Fetch Risk Appetite List
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + MaintenanceActivitySummary, respDto));
			sysDto = objectMapper.readValue(respString, AppSysMaintenanceDto.class);

			model.addAttribute("summaryList", sysDto.getSummaryList());
			model.addAttribute("user", user);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// Logger needs to ADD
		}

		return "systemMaintenanceSummary";
	}

}
