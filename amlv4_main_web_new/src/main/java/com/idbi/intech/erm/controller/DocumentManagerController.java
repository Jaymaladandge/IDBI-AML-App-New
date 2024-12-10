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
import java.util.Arrays;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.CodeMasterDto;
import com.idbi.intech.erm.domain.app.DepartmentMasterDto;
import com.idbi.intech.erm.domain.app.DocumentMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class DocumentManagerController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchDept}")
	private String fetchDept;
	@Value("${app-url.fetchWorkflowList}")
	private String fetchWorkflowList;
	@Value("${app-url.workflowOfficetypeList}")
	private String workflowOfficetypeList;
	@Value("${app-url.fetchDocumentData}")
	private String fetchDocumentData;
	@Value("${app-url.UploadNewDocument}")
	private String uploadNewDocuments;
	@Value("${app-url.viewDocumentModel}")
	private String viewDocumentModel;
	@Value("${app-url.removeDocumentById}")
	private String removeDocumentById;
	// viewDocumentListOfcWise
	@Value("${app-url.viewDocumentListOfcWise}")
	private String viewDocumentListOfcWise;

	@Autowired
	private CommonUtility commonUtility;

	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;

	RequestResponseJsonDto respDto = null;
	RequestResponseJsonDto respoDto = null;
	RequestResponseJsonDto officerespDto = null;

	@RequestMapping("/UploadNewDocument")
	public String createWorkflow(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {
		List<DepartmentMasterDto> deptList = new ArrayList<DepartmentMasterDto>();
		List<DepartmentMasterDto> departmentList = new ArrayList<DepartmentMasterDto>();
		final ObjectMapper objectMapper = new ObjectMapper();
		DocumentMasterDto documentDto = new DocumentMasterDto();
		try {

			String deptResponse = "Fetch";
			CodeMasterDto codeMaster = new CodeMasterDto();
			codeMaster.setCodeName("APP MODULE");

			CodeMasterDto officecodeMaster = new CodeMasterDto();
			officecodeMaster.setCodeName("OFFICE TYPE");

			respDto = commonUtility.objectToJson(deptResponse);

			respoDto = commonUtility.objectToJson(codeMaster);

			officerespDto = commonUtility.objectToJson(officecodeMaster);

			final String deptListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDept, respDto));
			departmentList = objectMapper.readValue(deptListStr, new TypeReference<List<DepartmentMasterDto>>() {
			});

			final String WfListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchWorkflowList, respoDto));
			codeMaster = objectMapper.readValue(WfListStr, CodeMasterDto.class);
			model.addAttribute("wfList", codeMaster.getModuleNameList());

			final String officeSetList = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + workflowOfficetypeList, officerespDto));
			codeMaster = objectMapper.readValue(officeSetList, CodeMasterDto.class);
			model.addAttribute("cntrlLib", codeMaster);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		if (user.getSelectedOfficeType().contains("CO")) {
			documentDto.setDocumentId(pkGenerator.getIMPrimaryKey("DOC", "CO"));
			model.addAttribute("DocPk", documentDto);
		}
		if (user.getSelectedOfficeType().contains("DO")) {
			documentDto.setDocumentId(pkGenerator.getIMPrimaryKey("DOC", "DO"));
			model.addAttribute("DocPk", documentDto);
		}
		if (user.getSelectedOfficeType().contains("ZO")) {
			documentDto.setDocumentId(pkGenerator.getIMPrimaryKey("DOC", "ZO"));
			model.addAttribute("DocPk", documentDto);
		}
		if (user.getSelectedOfficeType().contains("BO")) {
			documentDto.setDocumentId(pkGenerator.getIMPrimaryKey("DOC", "BO"));
			model.addAttribute("DocPk", documentDto);
		}

		for (DepartmentMasterDto deptDto : departmentList) {
			deptDto.setDeptName(deptDto.getDeptName().toUpperCase());
			deptList.add(deptDto);
		}

		model.addAttribute("deptList", deptList);

		model.addAttribute("user", user);

		return "uploadnewdocument";
	}

	@PostMapping("/UploadNewDocumentAction")
	public String createWorkflowAction(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {

		HttpHeaders resHeaders = null;
		DocumentMasterDto documentDto = new DocumentMasterDto();
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> DocumentString = null;
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			documentDto = objectMapper.readValue(requestString, DocumentMasterDto.class);
			documentDto.setDocumentMakerId(user.getUserId().toUpperCase());

			documentDto.getFileDetailsList().stream().forEach(e -> {
				Arrays.asList(multipartFile).stream().forEach(file -> {
					if (e.getFileName().equals(file.getOriginalFilename())) {
						if (!e.getFileName().equalsIgnoreCase("No Data Available")) {
							commonUtility.uploadFile(file);
						}

					}
				});
			});

			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			documentDto.setUser(userDto);
			respDto = commonUtility.objectToJson(documentDto);
			// User Validation
			DocumentString = commonUtility.webserviceConsume(uri + uploadNewDocuments, respDto);
			resHeaders = DocumentString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {

			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "Document Submited");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/DocumentManagerSummary";
	}

	@RequestMapping("/DocumentManagerSummary")
	public String workflowSummary(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			HttpSession session, RedirectAttributes redirectAttributes)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		String sourceText = "";
		sourceText = source == null ? "" : source;

		String messageText = "";

		try {
			DocumentMasterDto documentDto = new DocumentMasterDto();
			documentDto.setDocSearchParam("ALL");
			UserDto userDto = new UserDto();
			userDto.setOmsOfficeType(user.getOmsOfficeType());
			userDto.setUserDept(user.getUserDept());
			documentDto.setUser(userDto);
			respDto = commonUtility.objectToJson(documentDto);

			final String documentListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDocumentData, respDto));
			documentDto = objectMapper.readValue(documentListStr, DocumentMasterDto.class);

			model.addAttribute("docList", documentDto);

			model.addAttribute("user", user);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		model.addAttribute("message", messageText);
		if (null != sourceText && sourceText.equals("Document Submited")) {
			messageText = "Document Submited Successfully";
		} else if (null != sourceText && sourceText.equals("ERROR")) {
			messageText = "Error occured in the request";
		}
		model.addAttribute("message", messageText);

		return "documentmanagersummary";
	}

	@RequestMapping(value = "/DocumentViewModel")
	@ResponseBody
	public DocumentMasterDto documentListViewModel(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		DocumentMasterDto documentDto = new DocumentMasterDto();
		try {

			String pageValJson = request.getParameter("pageValJson");
			documentDto = objectMapper.readValue(pageValJson, DocumentMasterDto.class);

			respDto = commonUtility.objectToJson(documentDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewDocumentModel, respDto));
			documentDto = objectMapper.readValue(respString, DocumentMasterDto.class);

			/*
			 * final String respoString = commonUtility
			 * .decryptedResToString(commonUtility.webserviceConsume(uri +
			 * fetchDistinctWorkflowData, respDto)); workflowDto =
			 * objectMapper.readValue(respoString, WorkflowMasterDto.class);
			 */

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return documentDto;
	}

	@RequestMapping("/searchDocumentList")
	public String searchDocumentList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) {

		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// Encrypted JSON Request
			DocumentMasterDto documentDto = new DocumentMasterDto();

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			documentDto = objectMapper.readValue(requestString, DocumentMasterDto.class);
			UserDto userDto = new UserDto();
			userDto.setSelectedOfcType(user.getSelectedOfficeType());
			userDto.setUserDept(user.getUserDept());
			documentDto.setUser(userDto);
			respDto = commonUtility.objectToJson(documentDto);
			// Fetch Risk Appetite List
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDocumentData, respDto));
			documentDto = objectMapper.readValue(respString, DocumentMasterDto.class);

			model.addAttribute("docList", documentDto);
			model.addAttribute("user", user);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// Logger needs to ADD
		}

		return "documentmanagersummary";
	}

	@RequestMapping(value = "/removeDocumentById")
	@ResponseBody
	public DocumentMasterDto removeDocumentById(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		DocumentMasterDto documentDto = new DocumentMasterDto();
		try {

			String pageValJson = request.getParameter("pageValJson");
			documentDto = objectMapper.readValue(pageValJson, DocumentMasterDto.class);

			respDto = commonUtility.objectToJson(documentDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + removeDocumentById, respDto));
			documentDto = objectMapper.readValue(respString, DocumentMasterDto.class);

			/*
			 * final String respoString = commonUtility
			 * .decryptedResToString(commonUtility.webserviceConsume(uri +
			 * fetchDistinctWorkflowData, respDto)); workflowDto =
			 * objectMapper.readValue(respoString, WorkflowMasterDto.class);
			 */

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return documentDto;
	}

	// viewDocumentListOfcWise
	@RequestMapping(value = "/viewDocumentListOfcWise")
	@ResponseBody
	public DocumentMasterDto viewDocumentListOfcWise(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		DocumentMasterDto documentDto = new DocumentMasterDto();
		try {

			documentDto.setDocumentOfficeType(user.getOmsOfficeType());
			respDto = commonUtility.objectToJson(documentDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewDocumentListOfcWise, respDto));
			documentDto = objectMapper.readValue(respString, DocumentMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return documentDto;
	}

}
