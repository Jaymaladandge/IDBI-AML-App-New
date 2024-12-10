package com.idbi.intech.aml.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
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
import javax.servlet.http.HttpServletResponse;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.json.JsonParseException;
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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.BranchEDDResponseDto;
import com.idbi.intech.aml.domain.app.EDDBranchRequestMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.FileMasterDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class EDDController {
	
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchEddRequestList}")
	private String fetchEddRequestList;
	@Value("${app-url.FetchBranchIdList}")
	private String fetchBranchIdList;
	@Value("${app-url.getUploadedFiles}")
	private String getUploadedFiles;
	@Value("${app-url.getResponseData}")
	private String getResponseData;
	@Value("${file-location.loc}")
	private String root;
	@Value("${app-url.eddRequestTransfer}")
	private String eddRequestTransfer;
	
	RequestResponseJsonDto respDto = null;
	
	@RequestMapping("/EddRequestBranchSummary")
	public String eddRequestBranchSummary(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model,
			@ModelAttribute(name = "source") String source,
			@RequestParam(value = "message", required = false, defaultValue = "") String message)
			throws JsonProcessingException {
		EDDBranchRequestMasterDto testQuestionDto = new EDDBranchRequestMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		String requestString = "";
		try {
			if (encryptedRequest.getEncryptedJson() != null) {
				requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
				testQuestionDto = objectMapper.readValue(requestString, EDDBranchRequestMasterDto.class);
			} else {
				testQuestionDto.setSearchParam("defaultList");
			}
			testQuestionDto.setBranchId(user.getBranchId());
			testQuestionDto.setActRoleId(user.getUserPosition());
			respDto = commonUtility.objectToJson(testQuestionDto);
			final String WfActionListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchEddRequestList, respDto));
			testQuestionDto = objectMapper.readValue(WfActionListStr, EDDBranchRequestMasterDto.class);
			if (null != sourceText && sourceText.equals("Request Transfered")) {
				messageText = "Request Transfered Successfully";
			} else if (null != sourceText && sourceText.equals("EddSave")) {
				messageText = "EDD Enhansment Submitted Successfully";
			} else if (null != sourceText && sourceText.equals("ERROR")) {
				messageText = "Error Occured.";
			}
			model.addAttribute("ActionList", testQuestionDto.getRequestList());
			model.addAttribute("user", user);
			model.addAttribute("message", messageText);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return "EddRequestBranchSummary";

	}
	
	@RequestMapping(value = "/FetchBranchIdList")
	@ResponseBody
	public List<String> fetchBranchIdList(@AuthenticationPrincipal User user, HttpServletRequest request, Model model)
			throws JsonParseException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		List<String> branchIdList = new ArrayList<>();
		try {
			String branchParam = "fetch";
			respDto = commonUtility.objectToJson(branchParam);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchBranchIdList, respDto));
			branchIdList = objectMapper.readValue(respString, new TypeReference<List<String>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return branchIdList;
	}
	
	@PostMapping("/eddSavePDFExport")
	public void eddSavePDFExport(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, HttpServletRequest request, HttpServletResponse response, Model model)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {

		BranchEDDResponseDto testQuestionDto = new BranchEDDResponseDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		try {

			String pageValJson = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			pageValJson.replaceAll("\\p{Cntrl}", "");
			testQuestionDto = objectMapper.readValue(pageValJson, BranchEDDResponseDto.class);

			String fileName = "EddReport_" + testQuestionDto.getRequestId().replace("\\/", "~") + ".pdf";

			FileMasterDto fileDto = new FileMasterDto();
			fileDto.setReferanceId(testQuestionDto.getRequestId());
			respDto = commonUtility.objectToJson(fileDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getUploadedFiles, respDto));
			fileDto = objectMapper.readValue(respString, FileMasterDto.class);

			respDto = commonUtility.objectToJson(testQuestionDto);
			final String respString1 = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getResponseData, respDto));
			testQuestionDto = objectMapper.readValue(respString1, BranchEDDResponseDto.class);

			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setUsername(user.getUsername());
			userDto.setFileName(root);
			EddSummaryPdfExport eddExport = new EddSummaryPdfExport(testQuestionDto, userDto);
			eddExport.export(fileName.replace("\\~", "~"));
			List<String> fileList = new ArrayList<>();
			fileDto.getFileDtoList().stream().forEach(p -> fileList.add(p.getFileName()));
			fileList.add(fileName.replace("\\~", "~"));

			commonUtility.saveFileWithZip(testQuestionDto.getRequestId().replace("\\/", "~").replace("\\~", "~"),
					fileList);
			fileDto.setFileName(testQuestionDto.getRequestId().replace("\\/", "~").replace("\\~", "~") + ".zip");

			File file = new File(root + "//" + fileDto.getFileName());
			if (file.exists()) {
				// Set the content type and attachment header
				response.setContentType("application/octet-stream");
				response.setHeader("Content-Disposition", "attachment;filename=" + file.getName());

				// Get the file input stream
				FileInputStream inputStream = new FileInputStream(file);
				OutputStream outputStream = response.getOutputStream();

				// Copy the file content to the response output stream
				byte[] buffer = new byte[1024];
				int length;
				while ((length = inputStream.read(buffer)) != -1) {
					outputStream.write(buffer, 0, length);
				}

				outputStream.flush();
				outputStream.close();
				inputStream.close();
			} else {
				// Handle file not found
				response.getWriter().println("File not found: " + fileName);
			}

		} catch (

		Exception e) {
			e.printStackTrace();
		}

	}
	
	@PostMapping("/eddRequestTransfer")
	public String eddRequestTransfer(HttpServletRequest request, @AuthenticationPrincipal User user, Model model,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			RedirectAttributes redirectAttributes,
			HttpServletResponse response) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		EDDBranchRequestMasterDto testQuestionDto = new EDDBranchRequestMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> workflowString = null;
		try {
			String pageValJson = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			testQuestionDto = objectMapper.readValue(pageValJson, EDDBranchRequestMasterDto.class);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setChannelId(user.getChannelId());
			userDto.setChannelCode(user.getChannelCode());
			userDto.setUserRole(user.getUserPosition());
			testQuestionDto.setUserDto(userDto);
			respDto = commonUtility.objectToJson(testQuestionDto);
			// User Validation
			workflowString = commonUtility.webserviceConsume(uri + eddRequestTransfer, respDto);
			resHeaders = workflowString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Request Transfered");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}
		return "redirect:/EddRequestBranchSummary";
	}


}
