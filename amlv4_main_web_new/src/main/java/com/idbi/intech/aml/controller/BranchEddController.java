package com.idbi.intech.aml.controller;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
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
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.BranchEddMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class BranchEddController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchAllTestDetails}")
	private String fetchAllTestDetails;
	@Value("${file-location.loc}")
	private String root;
	@Value("${app-url.fetchCategory}")
	private String fetchCategory;
	@Value("${app-url.context-path}")
	private String contextPath;
	@Value("${app-url.fetchSubCategory}")
	private String fetchSubCategory;
	@Value("${app-url.saveTest}")
	private String saveTest;
	@Value("${app-url.fetchEddRoleActions}")
	private String fetchEddRoleActions;
	@Value("${app-url.fetchEddRoleList}")
	private String fetchEddRoleList;
	@Value("${app-url.fetchEddData}")
	private String fetchEddData;
	@Value("${app-url.fetchCustBranch}")
	private String fetchCustBranch;
	@Value("${app-url.verifyEdd}")
	private String verifyEdd;
	@Value("${app-url.validateSession}")
	private String validateSession;
	@Value("${app-url.searchEdd}")
	private String searchEdd;
	@Value("${app-url.saveEditedEdd}")
	private String saveEditedEdd;

	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;

	RequestResponseJsonDto respDto = null;

	@RequestMapping("/redirectToTestSummary")
	public String redirectToTestSummary(@AuthenticationPrincipal User user, Model model,
			@ModelAttribute(name = "source") String source, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		BranchEddMasterDto testMasterDto = new BranchEddMasterDto();

		try {
			if (source != null) {
				model.addAttribute("msg", source);
			} else {
				model.addAttribute("msg", "");
			}
			respDto = commonUtility.objectToJson(testMasterDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + fetchAllTestDetails, respDto));
			testMasterDto = objectMapper.readValue(respString, BranchEddMasterDto.class);
			model.addAttribute("testMasterDto", testMasterDto);
			model.addAttribute("user", user);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return "EddManagementSummary";
	}

	@RequestMapping("/redirectToCreateTest")
	public String redirectToCreateTest(@AuthenticationPrincipal User user, Model model,
			@ModelAttribute(name = "source") String source, HttpSession session) throws JsonProcessingException {

		final ObjectMapper objectMapper = new ObjectMapper();
		BranchEddMasterDto testMasterDto = new BranchEddMasterDto();
		try {
			respDto = commonUtility.objectToJson(testMasterDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + fetchCategory, respDto));
			testMasterDto = objectMapper.readValue(respString, BranchEddMasterDto.class);
			testMasterDto.setTestId(pkGenerator.getModulePrimaryKey("EDD"));
			model.addAttribute("testMasterDto", testMasterDto);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return "createEdd";
	}

	//
	@PostMapping(value = "/downloadTemplate")
	public void fileDownload(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletRequest request, HttpServletResponse response, @AuthenticationPrincipal User user)
			throws JsonParseException, JsonMappingException, IOException {
		try {

			String file = "Test_Questions.xlsx";
			String fullPath = root + "//" + file;
			File downladFile = new File(fullPath);
			DataInputStream input = new DataInputStream(new FileInputStream(downladFile));
			int length = 0;
			ServletOutputStream outputstream = response.getOutputStream();
			response.setContentType("application/octet-stream");
			response.setContentLength((int) downladFile.length());
			response.setHeader("Content-Disposition", "attachment;filename=" + file);
			byte[] buffer = new byte[1024];
			while ((input != null) && (length = input.read(buffer)) != -1) {
				outputstream.write(buffer, 0, length);
				outputstream.flush();
			}
			input.close();
			outputstream.close();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@RequestMapping("/fetchSubCategory")
	@ResponseBody
	public BranchEddMasterDto fetchSubCategory(@AuthenticationPrincipal User user, Model model, HttpSession session,
			HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		BranchEddMasterDto testMasterDto = new BranchEddMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			testMasterDto = objectMapper.readValue(pageValJson, BranchEddMasterDto.class);
			respDto = commonUtility.objectToJson(testMasterDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + fetchSubCategory, respDto));
			testMasterDto = objectMapper.readValue(respString, BranchEddMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return testMasterDto;
	}

	@RequestMapping("/saveTestData")
	public String saveTestData(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		BranchEddMasterDto testMasterDto = new BranchEddMasterDto();
		String requestString = "";
		HttpHeaders resHeaders = null;
		ResponseEntity<String> rasString = null;
		try {
			requestString = encryptedRequest.getEncryptedJson();
			testMasterDto = objectMapper.readValue(requestString, BranchEddMasterDto.class);
			testMasterDto.setUploadBy(user.getUserId());
			testMasterDto.setMakerRole(user.getUserPosition());
			respDto = commonUtility.objectToJson(testMasterDto);
			rasString = commonUtility.webserviceConsume(uri + contextPath + saveTest, respDto);
			resHeaders = rasString.getHeaders();
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			redirectAttributes.addFlashAttribute("source", "ERROR");
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "EDD Created Successfully");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}
		return "redirect:/redirectToTestSummary";
	}

	@RequestMapping("/fetchEddRoleList")
	@ResponseBody
	public BranchEddMasterDto fetchRoleList(@AuthenticationPrincipal User user, Model model, HttpSession session,
			HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		BranchEddMasterDto testMasterDto = new BranchEddMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			testMasterDto = objectMapper.readValue(pageValJson, BranchEddMasterDto.class);
			respDto = commonUtility.objectToJson(testMasterDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + fetchEddRoleList, respDto));
			testMasterDto = objectMapper.readValue(respString, BranchEddMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return testMasterDto;
	}

	@RequestMapping("/fetchRoleAction")
	@ResponseBody
	public BranchEddMasterDto fetchRoleAction(@AuthenticationPrincipal User user, Model model, HttpSession session,
			HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		BranchEddMasterDto testMasterDto = new BranchEddMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			testMasterDto = objectMapper.readValue(pageValJson, BranchEddMasterDto.class);
			respDto = commonUtility.objectToJson(testMasterDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + fetchEddRoleActions, respDto));
			testMasterDto = objectMapper.readValue(respString, BranchEddMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return testMasterDto;
	}

	//
	@PostMapping("/fetchEddData")
	public String fetchEddData(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		BranchEddMasterDto eddDto = new BranchEddMasterDto();
		try {
			requestString = encryptedRequest.getEncryptedJson();
			eddDto = objectMapper.readValue(requestString, BranchEddMasterDto.class);
			respDto = commonUtility.objectToJson(eddDto);
			final String response = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + fetchEddData, respDto));
			eddDto = objectMapper.readValue(response, BranchEddMasterDto.class);
			model.addAttribute("eddData", eddDto);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException | NullPointerException e) {
			e.printStackTrace();
		}
		return "verifyEdd";

	}

	@RequestMapping("/fetchCustBranch")
	@ResponseBody
	public BranchEddMasterDto fetchCustBranch(@AuthenticationPrincipal User user, Model model, HttpSession session,
			HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		BranchEddMasterDto branchEddDto = new BranchEddMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			branchEddDto = objectMapper.readValue(pageValJson, BranchEddMasterDto.class);
			respDto = commonUtility.objectToJson(branchEddDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + fetchCustBranch, respDto));
			branchEddDto = objectMapper.readValue(respString, BranchEddMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return branchEddDto;
	}

	@PostMapping("/verifyEdd")
	public String verifyEdd(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		BranchEddMasterDto branchEddDto = new BranchEddMasterDto();
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
				branchEddDto = objectMapper.readValue(requestString, BranchEddMasterDto.class);
				branchEddDto.setUploadBy(user.getUserId());
				branchEddDto.setCurrentRole(user.getUserPosition());
				respDto = commonUtility.objectToJson(branchEddDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + verifyEdd, respDto));
				branchEddDto = objectMapper.readValue(respString, BranchEddMasterDto.class);
				if (branchEddDto.getMsg().equals("success")) {
					source = "Edd Successfully Verified";
				} else {
					source = "Some Error Occurred";
				}
				redirectAttributes.addFlashAttribute("source", source);
				returnString = "redirect:/redirectToTestSummary";
			} else {
				returnString = "multipleLogin";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return returnString;
	}

	@RequestMapping("/searchEdd")
	public String searchEdd(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) {
		BranchEddMasterDto eddDto = new BranchEddMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			eddDto = objectMapper.readValue(requestString, BranchEddMasterDto.class);
			respDto = commonUtility.objectToJson(eddDto);
			// Fetch Edd
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + searchEdd, respDto));
			eddDto = objectMapper.readValue(respString, BranchEddMasterDto.class);
			model.addAttribute("testMasterDto", eddDto);
			model.addAttribute("user", user);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return "EddManagementSummary";
	}

	@PostMapping("/editEdd")
	public String editEdd(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		BranchEddMasterDto eddDto = new BranchEddMasterDto();
		try {
			requestString = encryptedRequest.getEncryptedJson();
			eddDto = objectMapper.readValue(requestString, BranchEddMasterDto.class);
			respDto = commonUtility.objectToJson(eddDto);
			final String response = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + fetchEddData, respDto));
			eddDto = objectMapper.readValue(response, BranchEddMasterDto.class);
			model.addAttribute("eddData", eddDto);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException | NullPointerException e) {
			e.printStackTrace();
		}
		return "editEdd";

	}

	@RequestMapping("/saveEditEdd")
	public String saveEditEdd(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		BranchEddMasterDto branchEddDto = new BranchEddMasterDto();
		String requestString = "";
		HttpHeaders resHeaders = null;
		ResponseEntity<String> rasString = null;
		try {
			requestString = encryptedRequest.getEncryptedJson();
			branchEddDto = objectMapper.readValue(requestString, BranchEddMasterDto.class);
			branchEddDto.setUploadBy(user.getUserId());
			branchEddDto.setMakerRole(user.getUserPosition());
			respDto = commonUtility.objectToJson(branchEddDto);
			rasString = commonUtility.webserviceConsume(uri + contextPath + saveEditedEdd, respDto);
			resHeaders = rasString.getHeaders();
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			redirectAttributes.addFlashAttribute("source", "ERROR");
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Modified EDD Sent For Verification Successfully");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}
		return "redirect:/redirectToTestSummary";
	}

	@RequestMapping("/fetchEddDetails")
	@ResponseBody
	public BranchEddMasterDto fetchEddDetails(HttpServletRequest request,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		BranchEddMasterDto eddDto = new BranchEddMasterDto();
		try {
			requestString = request.getParameter("pageValJson");
			eddDto = objectMapper.readValue(requestString, BranchEddMasterDto.class);
			respDto = commonUtility.objectToJson(eddDto);
			final String response = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + fetchEddData, respDto));
			eddDto = objectMapper.readValue(response, BranchEddMasterDto.class);
 		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException | NullPointerException e) {
			e.printStackTrace();
		}
		return eddDto;
	}

}
