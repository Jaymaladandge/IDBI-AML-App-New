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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.ActivityLogDto;
import com.idbi.intech.erm.domain.app.BenchMarkFileUploaderDto;
import com.idbi.intech.erm.domain.app.DepartmentMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.PolicyMasterDto;
import com.idbi.intech.erm.domain.app.RcsaFileUploaderDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class FileUpLoaderController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	@Autowired
	private CommonUtility commonUtility;

	RequestResponseJsonDto respDto = null;

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchFileUpload}")
	private String fetchFileUpload;
	@Value("${app-url.fetchRcsaFileUpload}")
	private String fetchRcsaFileUpload;
	@Value("${app-url.fetchBenchmarkFileUpload}")
	private String fetchBenchmarkFileUpload;

	

	@RequestMapping("/viewFileSummary")
	public String viewFileSummary(@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model,
			RedirectAttributes redirectAttributes,
			@RequestParam(value = "message", required = false, defaultValue = "") String message, HttpSession session,
			HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException, InvalidKeyException, JsonProcessingException {

		HttpHeaders resHeaders = null;
		final ObjectMapper objectMapper = new ObjectMapper();

		ResponseEntity<String> fuString = null;
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		UserDto userObj = new UserDto();
		userObj.setUsername(user.getUsername());
		userObj.setUserDept(user.getUserDept());
		userObj.setUserPosition(user.getUserPosition());
		userObj.setUserId(user.getUserId());
		try {

			PolicyMasterDto policyMasterDto = new PolicyMasterDto();
			respDto = commonUtility.objectToJson(policyMasterDto);
			 System.out.println("policyMasterDto>>>" + policyMasterDto);
			fuString = commonUtility.webserviceConsume(uri + fetchFileUpload, respDto);
			resHeaders = fuString.getHeaders();

		} catch (UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException | CertificateException
				| KeyStoreException | IllegalBlockSizeException | BadPaddingException | NoSuchProviderException
				| InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		if (null != sourceText && sourceText.equals("CREATE")) {
			messageText = "Data Has Been Sent For Upload";
		} else if (null != sourceText && sourceText.equals("ERROR")) {
			messageText = "Error Occured While Performing Action. Please Try Again Later";
		}
		model.addAttribute("message", messageText);

		return "viewFileSummary";

	}

	@RequestMapping("/fetchFileDetails")
	public String fetchFileDetails(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			RedirectAttributes redirectAttributes, @ModelAttribute(name = "source") String source, Model model,
			@RequestParam("files[]") MultipartFile[] multipartFile, @AuthenticationPrincipal User user)
			throws JsonProcessingException, InvalidKeyException {

		HttpHeaders resHeaders = null;

		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> fuString = null;
		String requestString = "";

		// String messageText = "";
		UserDto userObj = new UserDto();
		userObj.setUsername(user.getUsername());
		userObj.setUserDept(user.getUserDept());
		userObj.setUserPosition(user.getUserPosition());
		userObj.setUserId(user.getUserId());
		ActivityLogDto logDto = new ActivityLogDto();

		try {
			commonUtility.uploadFiles(multipartFile);
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			
			PolicyMasterDto policyMasterDto = objectMapper.readValue(requestString, PolicyMasterDto.class);
			policyMasterDto.setUserName(user.getUsername());
			policyMasterDto.setUser(userObj);
			policyMasterDto.setMakerId(user.getUserId());
			respDto = commonUtility.objectToJson(policyMasterDto);
			 System.out.println("policyMasterDto 2 >>>" + policyMasterDto);
			logDto.setActivityImpactTblKey(policyMasterDto.getPolicyId());
			logDto.setUserId(user.getUserId().toString());
			logDto.setTableName("POLICY_MASTER");
			//policyMasterDto.setActivityLogDto(logDto);
			System.out.println("policyMater111");
			fuString = commonUtility.webserviceConsume(uri + fetchFileUpload, respDto);
			resHeaders = fuString.getHeaders();

		} catch (UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException | CertificateException
				| KeyStoreException | IllegalBlockSizeException | BadPaddingException | NoSuchProviderException
				| InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "CREATE");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}

		return "redirect:/viewFileSummary";

	}

	
	@RequestMapping("/rcsaFileUploader")
	public String rcsaFileUploader(@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model,
			RedirectAttributes redirectAttributes,
			@RequestParam(value = "message", required = false, defaultValue = "") String message, HttpSession session,
			HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException, InvalidKeyException, JsonProcessingException {

		HttpHeaders resHeaders = null;
		final ObjectMapper objectMapper = new ObjectMapper();

		ResponseEntity<String> fuString = null;
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		UserDto userObj = new UserDto();
		userObj.setUsername(user.getUsername());
		userObj.setUserDept(user.getUserDept());
		userObj.setUserPosition(user.getUserPosition());
		userObj.setUserId(user.getUserId());
		
		try {

			RcsaFileUploaderDto rcsaFileUploaderDto = new RcsaFileUploaderDto();
			rcsaFileUploaderDto.setMakerId(user.getUserId());
			respDto = commonUtility.objectToJson(rcsaFileUploaderDto); //
			System.out.println("source " + sourceText);
			fuString = commonUtility.webserviceConsume(uri + fetchRcsaFileUpload, respDto);
			resHeaders = fuString.getHeaders();

		} catch (UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException | CertificateException
				| KeyStoreException | IllegalBlockSizeException | BadPaddingException | NoSuchProviderException
				| InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		if (null != sourceText && sourceText.equals("CREATE")) {
			messageText = "Data Has Been Sent For Upload";
		} else if (null != sourceText && sourceText.equals("ERROR")) {
			messageText = "Error Occured While Performing Action. Please Try Again Later";
		}
		model.addAttribute("message", messageText);

		return "rcsaFileUploader";

	}
	
	@RequestMapping("/fetchRcsaFileUploader")
	public String fetchRcsaFileUploader(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			RedirectAttributes redirectAttributes, @ModelAttribute(name = "source") String source, Model model,
			@RequestParam("files[]") MultipartFile[] multipartFile, @AuthenticationPrincipal User user)
			throws JsonProcessingException, InvalidKeyException {

		HttpHeaders resHeaders = null;

		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> fuString = null;
		String requestString = "";
		RcsaFileUploaderDto rcsaFileUploaderDto = new RcsaFileUploaderDto();
		UserDto userObj = new UserDto();
		userObj.setUsername(user.getUsername());
		userObj.setUserDept(user.getUserDept());
		userObj.setUserPosition(user.getUserPosition());
		userObj.setUserId(user.getUserId());
		ActivityLogDto logDto = new ActivityLogDto();
		rcsaFileUploaderDto.setMakerId(user.getUserId());

		// System.out.println("Checkpoint 2");
		try {
			commonUtility.uploadFiles(multipartFile);
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			rcsaFileUploaderDto = objectMapper.readValue(requestString, RcsaFileUploaderDto.class);

			System.out.println("rcsaFileUploaderDto =" + rcsaFileUploaderDto.toString());

			rcsaFileUploaderDto.setUserName(user.getUsername());
			rcsaFileUploaderDto.setUser(userObj);
			rcsaFileUploaderDto.setMakerId(user.getUserId());

			respDto = commonUtility.objectToJson(rcsaFileUploaderDto);
			// System.out.println("rcsaFileUploaderDto "+ rcsaFileUploaderDto);
			fuString = commonUtility.webserviceConsume(uri + fetchRcsaFileUpload, respDto);
			resHeaders = fuString.getHeaders();

		} catch (UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException | CertificateException
				| KeyStoreException | IllegalBlockSizeException | BadPaddingException | NoSuchProviderException
				| InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "CREATE");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}

		return "redirect:/rcsaFileUploader";

	}
	
	@RequestMapping("/benchMarkFileUploader")
	public String benchMarkFileUploader(@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model,
			RedirectAttributes redirectAttributes,
			@RequestParam(value = "message", required = false, defaultValue = "") String message, HttpSession session,
			HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException, InvalidKeyException, JsonProcessingException {

		HttpHeaders resHeaders = null;
		final ObjectMapper objectMapper = new ObjectMapper();

		ResponseEntity<String> fuString = null;
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		UserDto userObj = new UserDto();
		userObj.setUsername(user.getUsername());
		userObj.setUserDept(user.getUserDept());
		userObj.setUserPosition(user.getUserPosition());
		userObj.setUserId(user.getUserId());
	
		try {

			BenchMarkFileUploaderDto bmFileUploaderDto = new BenchMarkFileUploaderDto();
			respDto = commonUtility.objectToJson(bmFileUploaderDto); //
			System.out.println("source>>>" + sourceText);
			System.out.println("bmFileUploaderDto 1: "+bmFileUploaderDto);
			fuString = commonUtility.webserviceConsume(uri + fetchBenchmarkFileUpload, respDto);
			resHeaders = fuString.getHeaders();

			model.addAttribute("financialYear","2021-22");
		} catch (UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException | CertificateException
				| KeyStoreException | IllegalBlockSizeException | BadPaddingException | NoSuchProviderException
				| InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		if (null != sourceText && sourceText.equals("CREATE")) {
			messageText = "Data Has Been Sent For Upload";
		} else if (null != sourceText && sourceText.equals("ERROR")) {
			messageText = "Error Occured While Performing Action. Please Try Again Later";
		}
		model.addAttribute("message", messageText);
		

		return "benchMarkFileUploader";

	}

	@RequestMapping("/fetchBmFileUploader")
	public String fetchBmFileUploader(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			RedirectAttributes redirectAttributes, @ModelAttribute(name = "source") String source, Model model,
			@RequestParam("files[]") MultipartFile[] multipartFile, @AuthenticationPrincipal User user)
			throws JsonProcessingException, InvalidKeyException {

		HttpHeaders resHeaders = null;

		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> fuString = null;
		String requestString = "";
		BenchMarkFileUploaderDto bmFileUploaderDto = new BenchMarkFileUploaderDto();
		try {
		UserDto userObj = new UserDto();
		userObj.setUsername(user.getUsername());
		userObj.setUserDept(user.getUserDept());
		userObj.setUserPosition(user.getUserPosition());
		userObj.setUserId(user.getUserId());
		ActivityLogDto logDto = new ActivityLogDto();
		bmFileUploaderDto.setMakerId(user.getUserId());

		 System.out.println("Checkpoint 2");
		 
		 List<DepartmentMasterDto> deptList = new ArrayList<DepartmentMasterDto>();

			try {
				deptList = commonUtility.fetchDeptList();
			} catch (Exception e) {
				e.printStackTrace();
			}
		
			commonUtility.uploadFiles(multipartFile);
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
		System.out.println("bmFileUploaderDto>> "+bmFileUploaderDto);
			
			bmFileUploaderDto = objectMapper.readValue(requestString, BenchMarkFileUploaderDto.class);

		 System.out.println("bmFileUploaderDto =" + bmFileUploaderDto.toString());

			bmFileUploaderDto.setUserName(user.getUsername());
			bmFileUploaderDto.setUser(userObj);
			bmFileUploaderDto.setMakerId(user.getUserId());

			logDto.setActivityImpactTblKey(bmFileUploaderDto.getBmName());
			logDto.setUserId(user.getUserId().toUpperCase());

			bmFileUploaderDto.setActivityLogDto(logDto);

			respDto = commonUtility.objectToJson(bmFileUploaderDto);
		System.out.println("bmFileUploaderDto "+ bmFileUploaderDto);
			fuString = commonUtility.webserviceConsume(uri + fetchBenchmarkFileUpload, respDto);
			resHeaders = fuString.getHeaders();
		} catch (UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException | CertificateException
				| KeyStoreException | IllegalBlockSizeException | BadPaddingException | NoSuchProviderException
				| InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "CREATE");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}

		return "redirect:/benchMarkFileUploader";

	}


}