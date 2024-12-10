package com.idbi.intech.erm.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.util.IOUtils;
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
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.ActivityLogDto;
import com.idbi.intech.erm.domain.app.BenchmarkDto;
import com.idbi.intech.erm.domain.app.BenchmarkValueCaptureDto;
import com.idbi.intech.erm.domain.app.CalculationDto;
import com.idbi.intech.erm.domain.app.CodeMasterDto;
import com.idbi.intech.erm.domain.app.DepartmentMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.KeyRiskIndicatorMasterDto;
import com.idbi.intech.erm.domain.app.ModuleDeptMasterDto;
import com.idbi.intech.erm.domain.app.ModuleDeptThresholdDto;
import com.idbi.intech.erm.domain.app.ModuleValueCaptureDto;
import com.idbi.intech.erm.domain.app.NotificationDto;
import com.idbi.intech.erm.domain.app.OfficeMasterDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.RiskAppetiteMasterDto;
import com.idbi.intech.erm.domain.app.TpAndKriReportDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.domain.app.ValueCaptureDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.service.KeyRiskMasterService;
import com.idbi.intech.erm.service.RiskLibraryService;
import com.idbi.intech.erm.service.SessionKeyEncryptorService;
import com.idbi.intech.erm.util.CommonUtility;
import com.idbi.intech.erm.util.DeptTrendReportExcelExport;
import com.idbi.intech.erm.util.ErmAesEncryptor;
import com.idbi.intech.erm.util.KeyRiskIndicatorReportExport;
import com.idbi.intech.erm.util.PendencyReportExport;

@Controller
public class KeyRiskController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.mainKri}")
	private String mainKri;
	@Value("${app-url.viewKriDetails}")
	private String viewKriDetails;
	@Value("${app-url.viewAuditTrail}")
	private String viewAuditTrail;
	@Value("${app-url.createNewKri}")
	private String createNewKri;
	@Value("${app-url.editKri}")
	private String editKri;
	@Value("${app-url.fetchDept}")
	private String fetchDept;
	@Value("${app-url.kri-editedfetch}")
	private String editedfetch;
	@Value("${app-url.approveRejectKri}")
	private String approveRejectKri;
	@Value("${app-url.closeKRI}")
	private String closeKRI;
	@Value("${app-url.captureValueKri}")
	private String captureValueKri;
	@Value("${app-url.updateNotification}")
	private String updateNotification;
	@Value("${app-url.fetchVCKriDetails}")
	private String fetchVCKriDetails;
	@Value("${app-url.reCreateKri}")
	private String reCreateKri;
	@Value("${app-url.fetchScaleDetails}")
	private String fetchScaleDetails;
	@Value("${app-url.fetchOfficeList}")
	private String fetchOfficeList;
	@Value("${app-url.getCalculatedData}")
	private String getCalculatedData;
	@Value("${app-url.fetchRAGStatus}")
	private String fetchRAGStatus;
	@Value("${app-url.fetchBenchmarkList}")
	private String fetchBenchmarkList;
	@Value("${app-url.fetchOfficeNameList}")
	private String fetchOfficeNameList;
	@Value("${app-url.fetchKRIAssessmentValue}")
	private String fetchKRIAssessmentValue;
	@Value("${app-url.fetchValueCaptureData}")
	private String fetchValueCaptureData;
	@Value("${app-url.kriVcVerification}")
	private String kriVcVerification;
	@Value("${app-url.fetchKriReportDetails}")
	private String fetchKriReportDetails;
	@Value("${app-url.fetchOfficeAndDeptWiseList}")
	private String fetchOfficeAndDeptWiseList;

	@Autowired
	private CommonUtility commonUtility;
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;
	@Autowired
	private RiskLibraryService riskLibService;
	@Autowired
	private KeyRiskMasterService kriService;
	// SessionKeyEncryptor Object
	@Autowired
	private SessionKeyEncryptorService sessionKeyEncrypt;

	RequestResponseJsonDto respDto = null;

	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;

	// Method for fetching KRI List for Main Page
	@RequestMapping("/mainKriPage")
	public String mainKriPage(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			@ModelAttribute(name = "sourceName") String sourceName, @ModelAttribute(name = "sourceId") String sourceId,
			HttpSession session) {
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		KeyRiskIndicatorMasterDto kriMasterDto = new KeyRiskIndicatorMasterDto();
		kriMasterDto.setSearchParam("ALL");
		kriMasterDto.setUserDept(user.getUserDept());
		kriMasterDto.setUserRole(user.getUserPosition());
		kriMasterDto.setUserId(user.getUserId());

		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			if (sourceName.equalsIgnoreCase("closereject")) {
				NotificationDto notificationDto = new NotificationDto();
				notificationDto.setNtfCheckerId(user.getUserId());
				notificationDto.setNtfModuleId(sourceId);
				notificationDto.setTargetDept("ALL");
				notificationDto.setNtfTarget("KRI CREATOR");
				notificationDto.setNtfStatus("O");
				respDto = commonUtility.objectToJson(notificationDto);
				commonUtility.webserviceConsume(uri + updateNotification, respDto);
			}
			respDto = commonUtility.objectToJson(kriMasterDto);
			// Fetch KRI List
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + mainKri, respDto));
			kriMasterDto = objectMapper.readValue(respString, KeyRiskIndicatorMasterDto.class);
			model.addAttribute("kriList", kriMasterDto.getKriList());
			model.addAttribute("user", user);
			model.addAttribute("userRole", user.getUserPosition());
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

		if (null != sourceText && sourceText.equals("CREATE")) {
			messageText = "KRI Created Successfully And Sent For Verification";
		} else if (null != sourceText && sourceText.equals("EDIT")) {
			messageText = "KRI Modified Successfully And Sent For Verification";
		} else if (null != sourceText && sourceText.equals("CLOSE")) {
			messageText = "KRI Close Request Sent For Verification";
		} else if (null != sourceText && sourceText.equals("ERROR")) {
			messageText = "Error Occured While Performing Action. Please Contact Your System Adminitrator";
		} else if (null != sourceText && sourceText.equals("UNAUTHORIZE")) {
			messageText = "WorkFlow Not Available. Please Contact Your System Adminitrator";
		}
		model.addAttribute("message", messageText);
		ArrayList<String> menuButtonList = new ArrayList<>();
		String modulename = "KI";
		menuButtonList = commonUtility.getSubMenuBtnData(modulename, session);
		model.addAttribute("btnName", menuButtonList);
		return "mainKriPage";
	}

	// Common method for fetching KRI details
	public KeyRiskIndicatorMasterDto fetchKriDetails(KeyRiskIndicatorMasterDto kriMasterDto)
			throws IOException, InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException,
			NoSuchPaddingException, CertificateException, KeyStoreException, IllegalBlockSizeException,
			BadPaddingException, NoSuchProviderException, InvalidAlgorithmParameterException {
		final ObjectMapper objectMapper = new ObjectMapper();
		respDto = commonUtility.objectToJson(kriMasterDto);
		final String respString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + viewKriDetails, respDto));
		kriMasterDto = objectMapper.readValue(respString, KeyRiskIndicatorMasterDto.class);

		return kriMasterDto;
	}

	@RequestMapping(value = "/viewKriModal")
	@ResponseBody
	public KeyRiskIndicatorMasterDto viewKriModal(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		KeyRiskIndicatorMasterDto kriDto = new KeyRiskIndicatorMasterDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			kriDto = objectMapper.readValue(pageValJson, KeyRiskIndicatorMasterDto.class);
			kriDto.setUserDept(user.getUserDept());
			kriDto.setUserRole(user.getUserPosition());
			kriDto.setUserId(user.getUserId());
			kriDto = fetchKriDetails(kriDto);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

		}
		return kriDto;
	}

	@RequestMapping("/createKri")
	public String createKri(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		KeyRiskIndicatorMasterDto kriMasterDto = new KeyRiskIndicatorMasterDto();
		List<DepartmentMasterDto> deptList = new ArrayList<>();
		List<OfficeMasterDto> officeList = new ArrayList<>();
		BenchmarkDto benchMarkObj = new BenchmarkDto();
		List<BenchmarkDto> benchMarkList = new ArrayList<>();
		String returnPage = "";
		try {

			String deptResponse = "Fetch";
			respDto = commonUtility.objectToJson(deptResponse);

			final String deptListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDept, respDto));

			deptList = objectMapper.readValue(deptListStr, new TypeReference<List<DepartmentMasterDto>>() {
			});

			final String officeListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchOfficeList, respDto));

			officeList = objectMapper.readValue(officeListStr, new TypeReference<List<OfficeMasterDto>>() {
			});

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchScaleDetails, respDto));
			kriMasterDto = objectMapper.readValue(respString, KeyRiskIndicatorMasterDto.class);
			BenchmarkDto bmDto = new BenchmarkDto();
			bmDto.setSearchParam("ALL");
			bmDto.setDepartmentId(user.getUserDept());
			UserDto userObj = new UserDto();
			userObj.setUsername(user.getUsername());
			userObj.setUserDept(user.getUserDept());
			userObj.setUserPosition(user.getUserPosition());
			userObj.setUserId(user.getUserId());
			bmDto.setUser(userObj);
			respDto = commonUtility.objectToJson(bmDto);
			final String benchMarkListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchBenchmarkList, respDto));

			benchMarkObj = objectMapper.readValue(benchMarkListStr, BenchmarkDto.class);
			for (BenchmarkDto benchmarkDto : benchMarkObj.getBenchmarkList()) {
				if (benchmarkDto.getBmRecordStatus().equals("O")) {
					benchMarkList.add(benchmarkDto);
				}
			}

			model.addAttribute("deptList", deptList);
			model.addAttribute("benchmarkList", benchMarkList);
			model.addAttribute("officeList", officeList);
			kriMasterDto.setKriId(pkGenerator.getModulePrimaryKey("KRI"));
			model.addAttribute("kriMaster", kriMasterDto);
			returnPage = "createKri";

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return returnPage;
	}

	@PostMapping("/saveNewKRI")
	public String saveNewKRI(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		KeyRiskIndicatorMasterDto kriMasterDto = new KeyRiskIndicatorMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> kriString = null;
		String requestString = "";
		UserDto userDto = new UserDto();
		try {
			// Encrypted JSON Request
			commonUtility.uploadFiles(multipartFile);

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			kriMasterDto = objectMapper.readValue(requestString, KeyRiskIndicatorMasterDto.class);
			kriMasterDto.setMakerId(user.getUserId().toUpperCase());
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			kriMasterDto.setUser(userDto);
			respDto = commonUtility.objectToJson(kriMasterDto);
			// User Validation
			kriString = commonUtility.webserviceConsume(uri + createNewKri, respDto);
			resHeaders = kriString.getHeaders();
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "CREATE");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}
		return "redirect:/mainKriPage";

	}

	@PostMapping("/saveEditKRI")
	public String saveEditKRI(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		KeyRiskIndicatorMasterDto kriMasterDto = new KeyRiskIndicatorMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> kriString = null;
		UserDto userDto = new UserDto();
		String requestString = "";
		try {

			commonUtility.uploadFiles(multipartFile);

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			kriMasterDto = objectMapper.readValue(requestString, KeyRiskIndicatorMasterDto.class);
			ActivityLogDto activityDto = new ActivityLogDto();
			activityDto.setUserId(user.getUserId().toUpperCase());
			activityDto.setUserComments(kriMasterDto.getCommentDto().getComment());
			kriMasterDto.setActivityLogDto(activityDto);
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			kriMasterDto.setUser(userDto);
			respDto = commonUtility.objectToJson(kriMasterDto);
			if (kriMasterDto.getKriRecordStatus().equals("CR")) {
				kriString = commonUtility.webserviceConsume(uri + reCreateKri, respDto);
			} else {
				kriString = commonUtility.webserviceConsume(uri + editKri, respDto);
			}
			resHeaders = kriString.getHeaders();
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "EDIT");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}
		return "redirect:/mainKriPage";

	}

	@RequestMapping("/actionKri")
	public String actionKri(@AuthenticationPrincipal User user, @ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "sourceId") String sourceId, Model model) {
		KeyRiskIndicatorMasterDto kriMasterDto = new KeyRiskIndicatorMasterDto();
		KeyRiskIndicatorMasterDto kriDto = new KeyRiskIndicatorMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			kriMasterDto.setUserDept(user.getUserDept().toUpperCase());
			kriMasterDto.setUserRole(user.getUserPosition());
			kriMasterDto.setUserName(user.getUsername());
			if (sourceName.equals("") && sourceId.equals("")) {
				model.addAttribute("sourceName", "");
				model.addAttribute("sourceId", "nullvalue");
			} else {
				model.addAttribute("sourceName", sourceName);
				model.addAttribute("sourceId", sourceId);
				kriMasterDto.setKriId(sourceId);
			}
			if (sourceName.equalsIgnoreCase("EDIT") || sourceName.equalsIgnoreCase("EDITVERIFY")
					|| sourceName.equalsIgnoreCase("EDITREJECT")) {
				respDto = commonUtility.objectToJson(kriMasterDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + editedfetch, respDto));
				kriDto = objectMapper.readValue(respString, KeyRiskIndicatorMasterDto.class);
			} else {
				kriDto = fetchKriDetails(kriMasterDto);
			}
			model.addAttribute("kriMaster", kriDto);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return "actionKriPage";
	}

	@RequestMapping("/reviewKri")
	public String reviewKri(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) {
		String sourceTxt = "";
		KeyRiskIndicatorMasterDto kriMasterDto = new KeyRiskIndicatorMasterDto();
		ActivityLogDto logDto = new ActivityLogDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		StringBuilder initJson = new StringBuilder("{\"kriActionStatus\":");
		StringBuilder newJson = new StringBuilder("{\"kriActionStatus\":");
		ResponseEntity<String> rasString = null;
		HttpHeaders resHeaders = null;
		UserDto userDto = new UserDto();
		try {
			// Encrypted JSON Request
			commonUtility.uploadFiles(multipartFile);
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			kriMasterDto = objectMapper.readValue(requestString, KeyRiskIndicatorMasterDto.class);
			kriMasterDto.setUserDept(user.getUserDept());
			kriMasterDto.setUserRole(user.getUserPosition());
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			kriMasterDto.setUser(userDto);
			if ("AR".equalsIgnoreCase(kriMasterDto.getKriActionStatus())) {
				initJson.append("\"" + kriMasterDto.getKriActionStatusOld() + "\"");
				newJson.append("\"AR\"");
				logDto.setUserComments("NA");
				logDto.setActivityType("AR");
				kriMasterDto.setApproverId(user.getUserId());
				sourceTxt = "APPROVEDKI";
			} else if ("VR".equalsIgnoreCase(kriMasterDto.getKriActionStatus())) {
				initJson.append("\"" + kriMasterDto.getKriActionStatusOld() + "\"");
				newJson.append("\"VR\"");
				logDto.setUserComments("NA");
				logDto.setActivityType("VR");
				kriMasterDto.setCheckerId(user.getUserId());
				sourceTxt = "VERIFIEDKI";
			} else if ("XV".equalsIgnoreCase(kriMasterDto.getKriActionStatus())) {
				initJson.append("\"" + kriMasterDto.getKriActionStatusOld() + "\"");
				newJson.append("\"XV\"");
				logDto.setUserComments("NA");
				logDto.setActivityType("XV");
				kriMasterDto.setCheckerId(user.getUserId());
				sourceTxt = "VERIFIEDCKI";
			} else if ("XX".equalsIgnoreCase(kriMasterDto.getKriActionStatus())) {
				initJson.append("\"" + kriMasterDto.getKriActionStatusOld() + "\"");
				newJson.append("\"XX\"");
				logDto.setUserComments("NA");
				logDto.setActivityType("XX");
				kriMasterDto.setCheckerId(user.getUserId());
				sourceTxt = "APPROVEDCKI";
			} else if ("ZR".equalsIgnoreCase(kriMasterDto.getKriActionStatus())) {
				initJson.append("\"" + kriMasterDto.getKriActionStatusOld() + "\"");
				newJson.append("\"ZR\"");
				logDto.setUserComments("NA");
				logDto.setActivityType("ZR");
				kriMasterDto.getCommentDto().setCommentBy(user.getUserId());
				kriMasterDto.getCommentDto().setModuleId(kriMasterDto.getKriId());
				kriMasterDto.getCommentDto().setModuleName("KI");
				kriMasterDto.getCommentDto().setCommentBy(user.getUserId());
				kriMasterDto.setCheckerId(user.getUserId());
				sourceTxt = "REJECTEDKI";
			} else if ("XZ".equalsIgnoreCase(kriMasterDto.getKriActionStatus())) {
				initJson.append("\"" + kriMasterDto.getKriActionStatusOld() + "\"");
				newJson.append("\"XZ\"");
				logDto.setUserComments("NA");
				logDto.setActivityType("XZ");
				kriMasterDto.getCommentDto().setCommentBy(user.getUserId());
				kriMasterDto.getCommentDto().setModuleId(kriMasterDto.getKriId());
				kriMasterDto.getCommentDto().setModuleName("KI");
				kriMasterDto.getCommentDto().setCommentBy(user.getUserId());
				kriMasterDto.setCheckerId(user.getUserId());
				sourceTxt = "REJECTECKI";
			} else if ("EV".equalsIgnoreCase(kriMasterDto.getKriActionStatus())) {
				initJson.append("\"" + kriMasterDto.getKriActionStatusOld() + "\"");
				newJson.append("\"EV\"");
				logDto.setUserComments("NA");
				logDto.setActivityType("EV");
				kriMasterDto.setApproverId(user.getUserId());
				sourceTxt = "VERIFIEDEKI";
			} else if ("EA".equalsIgnoreCase(kriMasterDto.getKriActionStatus())) {
				initJson.append("\"" + kriMasterDto.getKriActionStatusOld() + "\"");
				newJson.append("\"EA\"");
				logDto.setUserComments("NA");
				logDto.setActivityType("EA");
				kriMasterDto.setApproverId(user.getUserId());
				sourceTxt = "APPROVEDEKI";
			} else if ("EZ".equalsIgnoreCase(kriMasterDto.getKriActionStatus())) {
				initJson.append("\"" + kriMasterDto.getKriActionStatusOld() + "\"");
				newJson.append("\"EZ\"");
				logDto.setUserComments(kriMasterDto.getCommentDto().getComment());
				logDto.setActivityType("EZ");
				kriMasterDto.getCommentDto().setCommentBy(user.getUserId());
				kriMasterDto.getCommentDto().setModuleId(kriMasterDto.getKriId());
				kriMasterDto.getCommentDto().setModuleName("KI");
				kriMasterDto.getCommentDto().setCommentBy(user.getUserId());
				kriMasterDto.setCheckerId(user.getUserId());
				sourceTxt = "REJECTEDEKI";
			}
			initJson.append("}");
			newJson.append("}");
			logDto.setActivityImpactTblKey(kriMasterDto.getKriId());
			logDto.setInitJson(initJson.toString());
			logDto.setModJson(newJson.toString());
			logDto.setUserId(user.getUserId().toString());
			logDto.setTableName("KEY_RISK_MASTER");
			kriMasterDto.setActivityLogDto(logDto);
			respDto = commonUtility.objectToJson(kriMasterDto);
			rasString = commonUtility.webserviceConsume(uri + approveRejectKri, respDto);
			resHeaders = rasString.getHeaders();
			model.addAttribute("kriMaster", fetchKriDetails(kriMasterDto));
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", sourceTxt);
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}
		return "redirect:/home";
	}

	@RequestMapping("/modifyKri")
	public String modifyKri(@ModelAttribute(name = "sourceId") String sourceId,
			@ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model) {

		final ObjectMapper objectMapper = new ObjectMapper();
		KeyRiskIndicatorMasterDto kriMasterDto = new KeyRiskIndicatorMasterDto();
		List<DepartmentMasterDto> deptList = new ArrayList<>();
		// List<DepartmentMasterDto> deptProvidingList = new ArrayList<>();
		String requestString = "";
		List<DepartmentMasterDto> deptListSelected = new ArrayList<>();
		// List<DepartmentMasterDto> deptProvidingListSelected = new ArrayList<>();
		BenchmarkDto benchMarkObj = new BenchmarkDto();
		List<BenchmarkDto> benchMarkList = new ArrayList<>();
		Boolean flg = true;
		try {
			String deptResponse = "Fetch";
			respDto = commonUtility.objectToJson(deptResponse);
			final String deptListStr = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDept, respDto));

			deptList = objectMapper.readValue(deptListStr, new TypeReference<List<DepartmentMasterDto>>() {
			});
			// deptProvidingList = deptList;
			if (sourceName.equalsIgnoreCase("createreject")) {
				kriMasterDto.setKriId(sourceId);
				kriMasterDto.setUserDept(user.getUserDept());
				kriMasterDto.setUserRole(user.getUserPosition());
				kriMasterDto = fetchKriDetails(kriMasterDto);
				kriMasterDto.setKriRecordStatus("Rejected Create Request");
			} else if (sourceName.equalsIgnoreCase("editreject")) {
				kriMasterDto.setKriId(sourceId);
				kriMasterDto.setUserDept(user.getUserDept());
				kriMasterDto.setUserRole(user.getUserPosition());
				respDto = commonUtility.objectToJson(kriMasterDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + editedfetch, respDto));
				kriMasterDto = objectMapper.readValue(respString, KeyRiskIndicatorMasterDto.class);
				kriMasterDto.setKriRecordStatus("Rejected Edit Request");
			} else {
				requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
				kriMasterDto = objectMapper.readValue(requestString, KeyRiskIndicatorMasterDto.class);
				kriMasterDto.setUserDept(user.getUserDept());
				kriMasterDto.setUserRole(user.getUserPosition());
				kriMasterDto = fetchKriDetails(kriMasterDto);
				for (ModuleDeptMasterDto mdmDto : kriMasterDto.getMdmDtoList()) {
					for (ModuleDeptThresholdDto mdtDto : mdmDto.getMdtDtoList()) {
						mdtDto.setDeptThresholdValue(mdtDto.getDeptThreshValue());
					}
				}
			}
			if (flg) {
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchScaleDetails, respDto));
				KeyRiskIndicatorMasterDto kriDto = objectMapper.readValue(respString, KeyRiskIndicatorMasterDto.class);
				String[] existingDeptList = kriMasterDto.getKriLinkedDept().split(",");
				for (String existingDept : existingDeptList) {
					for (DepartmentMasterDto dept : deptList) {
						if (dept.getDeptId().equalsIgnoreCase(existingDept)) {
							deptListSelected.add(dept);
						}
					}
				}
				/*
				 * String[] existingDeptProvdList =
				 * kriMasterDto.getDeptProvidingData().split(","); for (String existingDept :
				 * existingDeptProvdList) { for (DepartmentMasterDto dept : deptProvidingList) {
				 * if (dept.getDeptId().equalsIgnoreCase(existingDept)) {
				 * deptProvidingListSelected.add(dept); } } }
				 */
				deptList.removeAll(deptListSelected);
				// deptProvidingList.removeAll(deptProvidingListSelected);
				for (CodeMasterDto cmDto : kriDto.getCodeList()) {
					if (cmDto.getCodeValue().equalsIgnoreCase(kriMasterDto.getKriFormula())) {
						cmDto.setFlg("true");
					}
				}
				BenchmarkDto bmDto = new BenchmarkDto();
				bmDto.setSearchParam("ALL");
				bmDto.setDepartmentId(user.getUserDept());
				UserDto userObj = new UserDto();
				userObj.setUsername(user.getUsername());
				userObj.setUserDept(user.getUserDept());
				userObj.setUserPosition(user.getUserPosition());
				userObj.setUserId(user.getUserId());
				bmDto.setUser(userObj);
				respDto = commonUtility.objectToJson(bmDto);
				final String benchMarkListStr = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchBenchmarkList, respDto));
				benchMarkObj = objectMapper.readValue(benchMarkListStr, BenchmarkDto.class);
				for (BenchmarkDto benchmarkDto : benchMarkObj.getBenchmarkList()) {
					if (benchmarkDto.getBmRecordStatus().equals("O")) {
						if (benchmarkDto.getBmName().equalsIgnoreCase(kriMasterDto.getKriBenchmark())) {
							benchmarkDto.setFlg("true");
						}
						benchMarkList.add(benchmarkDto);
					}
				}
				model.addAttribute("benchmarkList", benchMarkList);
				kriMasterDto.setCodeList(kriDto.getCodeList());
				model.addAttribute("deptList", deptList);
				model.addAttribute("deptListSelected", deptListSelected);
				model.addAttribute("kriMaster", kriMasterDto);
				// model.addAttribute("deptProvdList", deptProvidingList);
				// model.addAttribute("deptProvdListSelected", deptProvidingListSelected);

			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "modifyKri";

	}

	@RequestMapping("/closeKri")
	public String closeKri(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model) {
		final ObjectMapper objectMapper = new ObjectMapper();
		KeyRiskIndicatorMasterDto kriMasterDto = new KeyRiskIndicatorMasterDto();
		String requestString = "";
		ResponseEntity<String> respString = null;
		HttpHeaders resHeaders = null;
		String sourceTxt = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			kriMasterDto = objectMapper.readValue(requestString, KeyRiskIndicatorMasterDto.class);
			kriMasterDto.getCommentDto().setCommentBy(user.getUserId());
			kriMasterDto.getCommentDto().setModuleId(kriMasterDto.getKriId());
			kriMasterDto.getCommentDto().setModuleName("KI");
			kriMasterDto.getCommentDto().setCommentBy(user.getUserId());
			String initJson = "{\"kriRecordStatus\":\"O\"}";
			String modJson = "{\"kriRecordStatus\":\"C\"}";
			ActivityLogDto activityLogDto = new ActivityLogDto();
			kriMasterDto.setKriRecordStatus("E");
			activityLogDto.setActivityType("XQ");
			activityLogDto.setInitJson(initJson);
			activityLogDto.setModJson(modJson);
			kriMasterDto.setActivityLogDto(activityLogDto);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			kriMasterDto.setUser(userDto);
			respDto = commonUtility.objectToJson(kriMasterDto);
			// send request for closing KRI
			respString = commonUtility.webserviceConsume(uri + closeKRI, respDto);
			resHeaders = respString.getHeaders();
			sourceTxt = "CLOSE";
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", sourceTxt);
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}
		return "redirect:/mainKriPage";
	}

	@PostMapping("/kriValueAdd")
	public String rasValueAdd(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		HttpHeaders resHeaders = null;
		ResponseEntity<String> rasString = null;
		ModuleValueCaptureDto mvcDto = new ModuleValueCaptureDto();
		final ErmAesEncryptor ermEncryptObj = new ErmAesEncryptor();
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			mvcDto = objectMapper.readValue(requestString, ModuleValueCaptureDto.class);
			mvcDto.setMakerId(user.getUserId());
			mvcDto.setCaptureUserId(user.getUserId());
			mvcDto.setDeptId(user.getUserDept());
			mvcDto.setCapturerOfficeId(user.getUserOffice());
			mvcDto.setOfcType(user.getUserOfficeType());
			respDto = commonUtility.objectToJson(mvcDto);
			rasString = commonUtility.webserviceConsume(uri + captureValueKri, respDto);
			resHeaders = rasString.getHeaders();
			String decryptionKey = sessionKeyEncrypt
					.decryptSessionKeyUsingprvkey(resHeaders.get("SESSION-KEY").toString(), privateKeyPath);
			mvcDto = objectMapper.readValue(ermEncryptObj.decrypt(rasString.getBody().toString(), decryptionKey),
					ModuleValueCaptureDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				if ("00".equalsIgnoreCase(mvcDto.getRespCode())) {
					redirectAttributes.addFlashAttribute("source", "VALUECAPTUREKRI");
				} else {
					redirectAttributes.addFlashAttribute("source", "ALREADYCAPTURED");
				}

			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}
		return "redirect:/home";

	}

	@RequestMapping("/valueCaptureKri")
	public String valueCaptureKri(@ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "moduleName") String moduleName, @AuthenticationPrincipal User user,
			@ModelAttribute(name = "sourceId") String sourceId, Model model) {
		RiskAppetiteMasterDto rasDto = new RiskAppetiteMasterDto();
		KeyRiskIndicatorMasterDto kriDto = new KeyRiskIndicatorMasterDto();
		UserDto userDto = new UserDto();
		try {
			if (sourceName.equals("") && sourceId.equals("")) {

				model.addAttribute("sourceName", "");
				model.addAttribute("sourceId", "nullvalue");
			} else {
				model.addAttribute("sourceName", sourceName);
				model.addAttribute("sourceId", sourceId);
				rasDto.setRaStmtId(sourceId);
				rasDto.setUserDept(user.getUserDept());
			}
			model.addAttribute("moduleName", moduleName.toUpperCase());
			model.addAttribute("userId", user.getUserId());
			final ObjectMapper objectMapper = new ObjectMapper();
			kriDto.setKriId(sourceId);
			userDto.setUserDept(user.getUserDept().toUpperCase());
			userDto.setUserOffice(user.getUserOffice().toUpperCase());
			userDto.setUserOfficeType(user.getUserOfficeType().toUpperCase());
			kriDto.setUserDept(user.getUserDept().toUpperCase());
			kriDto.setUserRole(user.getUserPosition());
			kriDto.setUserObj(userDto);
			respDto = commonUtility.objectToJson(kriDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchVCKriDetails, respDto));
			ValueCaptureDto vcDto = objectMapper.readValue(respString, ValueCaptureDto.class);
			vcDto.setUserName(user.getUsername());
			model.addAttribute("valueCapture", vcDto);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "valueCapture";

	}

	@RequestMapping(value = "/getCalculatedData")
	@ResponseBody
	public ModuleValueCaptureDto getCalculatedData(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		CalculationDto calculationDto = new CalculationDto();
		ModuleValueCaptureDto captureDto = new ModuleValueCaptureDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			calculationDto = objectMapper.readValue(pageValJson, CalculationDto.class);
			captureDto.setModuleId(calculationDto.getModuleId());
			captureDto.setDeptId(user.getUserDept().toUpperCase());
			respDto = commonUtility.objectToJson(calculationDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getCalculatedData, respDto));
			// fetchRAGStatus
			calculationDto = objectMapper.readValue(respString, CalculationDto.class);
			captureDto.setAssessmentValue(calculationDto.getCalculatedResult());
			respDto = commonUtility.objectToJson(captureDto);
			final String newRespString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRAGStatus, respDto));
			captureDto = objectMapper.readValue(newRespString, ModuleValueCaptureDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

		}
		return captureDto;
	}

	// Method for fetching Top Risk based on search parameters
	@RequestMapping("/searchKriList")
	@ResponseBody
	public KeyRiskIndicatorMasterDto searchKriList(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpServletRequest request, HttpSession session) {
		KeyRiskIndicatorMasterDto keyRiskDto = new KeyRiskIndicatorMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// Encrypted JSON Request
			String pageValJson = request.getParameter("pageValJson");
			requestString = commonUtility.encryptedReqToString(pageValJson);

			keyRiskDto = objectMapper.readValue(requestString, KeyRiskIndicatorMasterDto.class);
			keyRiskDto.setUserDept(user.getUserDept());
			UserDto userObj = new UserDto();
			userObj.setUsername(user.getUsername());
			keyRiskDto.setUserObj(userObj);
			keyRiskDto.setUserDept(user.getUserDept());
			keyRiskDto.setUserRole(user.getUserPosition());
			keyRiskDto.setUserId(user.getUserId());
			respDto = commonUtility.objectToJson(keyRiskDto);
			// Fetch Top Risk List
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + mainKri, respDto));
			keyRiskDto = objectMapper.readValue(respString, KeyRiskIndicatorMasterDto.class);

			ArrayList<String> menuButtonList = new ArrayList<>();
			String modulename = "KI";
			menuButtonList = commonUtility.getSubMenuBtnData(modulename, session);
			keyRiskDto.setBtnList(menuButtonList);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// Logger needs to ADD
		}
		return keyRiskDto;
	}

	@RequestMapping("/PendingReportsKRIVC")
	public String PendingReportsKRIVC(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {

		BenchmarkValueCaptureDto benchmarkValueCaptureDto = new BenchmarkValueCaptureDto();
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			benchmarkValueCaptureDto.setDeptId(user.getUserDept());
			benchmarkValueCaptureDto.setOfficeType(user.getSelectedOfficeType());
			respDto = commonUtility.objectToJson(benchmarkValueCaptureDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchOfficeAndDeptWiseList, respDto));
			benchmarkValueCaptureDto = objectMapper.readValue(respString, BenchmarkValueCaptureDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		model.addAttribute("userOffice", user.getSelectedOfficeType());
		model.addAttribute("officeNameList", benchmarkValueCaptureDto.getOfficeCodeList());
		model.addAttribute("userDept", user.getUserDeptName());
		// model.addAttribute("userDeptId", user.getUserDept());
		model.addAttribute("user", user);
		model.addAttribute("assessmentPeriod", benchmarkValueCaptureDto.getAssessmentPeriod());

		return "PendingReportsKRIVC";
	}

	@RequestMapping(value = "/fetchKRIAssessmentValue")
	@ResponseBody
	public NotificationDto fetchKRIAssessmentValue(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		NotificationDto notificationDto = new NotificationDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			// String pageValJson =
			// commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			notificationDto = objectMapper.readValue(pageValJson, NotificationDto.class);
			UserDto userDto = new UserDto();
			userDto.setUserOffice(user.getUserOffice());
			userDto.setUserOfficeType(user.getSelectedOfficeType());
			userDto.setOfficeCode(user.getOfficeCode());
			userDto.setUserDept(user.getUserDept());
			notificationDto.setUser(userDto);
			respDto = commonUtility.objectToJson(notificationDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchKRIAssessmentValue, respDto));
			notificationDto = objectMapper.readValue(respString, NotificationDto.class);

			// System.out.println("notificationDto =" + notificationDto.toString());

		} catch (Exception e) {
			e.printStackTrace();
		}
		return notificationDto;
	}

	@RequestMapping("/verifyValueCapture")
	public String valueCaptureVerify(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes,
			Model model, @ModelAttribute(name = "sourceId") String sourceId) {

		final ObjectMapper objectMapper = new ObjectMapper();
		ModuleValueCaptureDto mvcDto = new ModuleValueCaptureDto();
		List<ModuleValueCaptureDto> mvcDtoList = new ArrayList<>();
		try {
			mvcDto.setMakerId(user.getUserId());
			mvcDto.setCaptureUserId(user.getUserId());
			mvcDto.setDeptId(user.getUserDept());
			mvcDto.setCapturerOfficeId(user.getUserOffice());
			mvcDto.setOfcType(user.getUserOfficeType());

			respDto = commonUtility.objectToJson(mvcDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchValueCaptureData, respDto));
			mvcDtoList = objectMapper.readValue(respString, new TypeReference<List<ModuleValueCaptureDto>>() {
			});

			mvcDto.setMvcDtoList(mvcDtoList);

			model.addAttribute("mvcDto", mvcDto);
			model.addAttribute("sourceId", sourceId);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return "verifyValueCapture";
	}

	@PostMapping("/kriVcVerification")
	public String createUserPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		ModuleValueCaptureDto mvcDto = new ModuleValueCaptureDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;
		String requestString = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			mvcDto = objectMapper.readValue(requestString, ModuleValueCaptureDto.class);
			mvcDto.setMakerId(user.getUserId());
			mvcDto.setCaptureUserId(user.getUserId());
			mvcDto.setDeptId(user.getUserDept());
			mvcDto.setCapturerOfficeId(user.getUserOffice());
			mvcDto.setOfcType(user.getSelectedOfficeType());
			mvcDto.setUserPosition(user.getUserPosition());
			respDto = commonUtility.objectToJson(mvcDto);
			apString = commonUtility.webserviceConsume(uri + kriVcVerification, respDto);
			resHeaders = apString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "VERIFIEDKIVC");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}
		return "redirect:/home";

	}

	// Method for fetching KRI List for Main Page
	@RequestMapping("/kriReport")
	public String kriReport(@AuthenticationPrincipal User user, Model model) throws JsonProcessingException {
		TpAndKriReportDto kriMasterDto = new TpAndKriReportDto();
		kriMasterDto.setSearchParam("ALL");
		kriMasterDto.setUserDept(user.getUserDept());

		kriMasterDto.setUserRole(user.getUserPosition());
		kriMasterDto.setUserId(user.getUserId());
		kriMasterDto.setUserOffice(user.getUserOffice());
		kriMasterDto.setSelectedOffice(user.getSelectedOfficeType());
		// System.out.println(kriMasterDto.getUserOffice() +
		// kriMasterDto.getSelectedOffice());

		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			respDto = commonUtility.objectToJson(kriMasterDto);
			// Fetch KRI List
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchKriReportDetails, respDto));
			kriMasterDto = objectMapper.readValue(respString, TpAndKriReportDto.class);
			model.addAttribute("kriList", kriMasterDto.getKriList());
			model.addAttribute("user", user);
			model.addAttribute("userRole", user.getUserPosition());
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

		return "mainKriReport";
	}

	@RequestMapping(value = "/getKriReportExcelExport")
	public void getBenchmarkPendingReportExcelExport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, HttpServletResponse response, Model model) {

		final ObjectMapper objectMapper = new ObjectMapper();
		TpAndKriReportDto kriMasterDto = new TpAndKriReportDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			kriMasterDto = objectMapper.readValue(requestString, TpAndKriReportDto.class);

			kriMasterDto.setSearchParam("ALL");
			kriMasterDto.setUserDept(user.getUserDept());

			kriMasterDto.setUserRole(user.getUserPosition());
			kriMasterDto.setUserId(user.getUserId());
			kriMasterDto.setUserOffice(user.getUserOffice());
			kriMasterDto.setSelectedOffice(user.getSelectedOfficeType());
			respDto = commonUtility.objectToJson(kriMasterDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchKriReportDetails, respDto));
			kriMasterDto = objectMapper.readValue(respString, TpAndKriReportDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Kri_Progress_Report" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			// Encrypted JSON Request
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setUsername(user.getUsername());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserOfficeType(user.getUserOfficeType().toUpperCase());
			userDto.setSearchParam("KeyRiskIndicator Progress Report");

			DeptTrendReportExcelExport deptTrendExportExcel = new DeptTrendReportExcelExport(kriMasterDto);
			deptTrendExportExcel.exportKriReport(response, userDto);

		} catch (Exception e) {
			e.printStackTrace();

		}

	}

	@RequestMapping(value = "/fetchKRIAssessmentValueExport")
	public void fetchKRIAssessmentValueExport(@AuthenticationPrincipal User user, HttpServletRequest request,
			HttpServletResponse response,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonParseException, JsonMappingException, IOException, InvalidKeyException,
			UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException, CertificateException,
			KeyStoreException, IllegalBlockSizeException, BadPaddingException, NoSuchProviderException,
			InvalidAlgorithmParameterException {
		final ObjectMapper objectMapper = new ObjectMapper();
		NotificationDto notificationDto = new NotificationDto();
		String requestString = "";
		String dateAsString = new SimpleDateFormat("yyyyMMddHHmm").format(new Date());
		String fileName = "KRI_Capture_Pending_Report" + dateAsString + ".xlsx";
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition", "attachment; filename=" + fileName + "");
		requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());

		notificationDto = objectMapper.readValue(requestString, NotificationDto.class);
		UserDto userDto = new UserDto();
		userDto.setUserOffice(user.getUserOffice());
		userDto.setUserOfficeType(user.getSelectedOfficeType());
		userDto.setOfficeCode(user.getOfficeCode());
		userDto.setUserDept(user.getUserDept());
		notificationDto.setUser(userDto);
		respDto = commonUtility.objectToJson(notificationDto);

		final String respString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + fetchKRIAssessmentValue, respDto));
		notificationDto = objectMapper.readValue(respString, NotificationDto.class);
		//System.out.println(notificationDto.toString());
		userDto.setUserId(user.getUserId());
		userDto.setUsername(user.getUsername());
		userDto.setUserDeptName(user.getUserDeptName());
		userDto.setUserOfficeType(user.getUserOfficeType().toUpperCase());
		userDto.setSearchParam("Pending KRI Value Capture Report");
		if(notificationDto.getNtfStatus().equalsIgnoreCase("countVC")) {
			PendencyReportExport deptTrendExportExcel=new PendencyReportExport(notificationDto);
		deptTrendExportExcel.exportKriReport(response, userDto);
		}else {
			KeyRiskIndicatorReportExport deptTrendExportExcel = new KeyRiskIndicatorReportExport(notificationDto);
			deptTrendExportExcel.exportKriReport(response, userDto);
		}
		
	}

	@RequestMapping(value = "/verifyValueCaptureExport")
	public void verifyValueCaptureExport(@AuthenticationPrincipal User user, HttpServletRequest request,
			HttpServletResponse response,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonParseException, JsonMappingException, IOException, InvalidKeyException,
			UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException, CertificateException,
			KeyStoreException, IllegalBlockSizeException, BadPaddingException, NoSuchProviderException,
			InvalidAlgorithmParameterException {
		final ObjectMapper objectMapper = new ObjectMapper();
		NotificationDto notificationDto = new NotificationDto();
		String requestString = "";
		String dateAsString = new SimpleDateFormat("yyyyMMddHHmm").format(new Date());
		String fileName = "Value Capture Pending For Verification" + dateAsString + ".xlsx";
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition", "attachment; filename=" + fileName + "");
		// requestString =
		// commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
		ModuleValueCaptureDto mvcDto = new ModuleValueCaptureDto();
		List<ModuleValueCaptureDto> mvcDtoList = new ArrayList<>();
		mvcDto.setMakerId(user.getUserId());
		mvcDto.setCaptureUserId(user.getUserId());
		mvcDto.setDeptId(user.getUserDept());
		mvcDto.setCapturerOfficeId(user.getUserOffice());
		mvcDto.setOfcType(user.getUserOfficeType());
		respDto = commonUtility.objectToJson(mvcDto);
		final String respString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + fetchValueCaptureData, respDto));
		mvcDtoList = objectMapper.readValue(respString, new TypeReference<List<ModuleValueCaptureDto>>() {
		});

		String AssessmentPeriod = "";
		// System.out.println("ntfDtoList " + ntfDtoList);
		

		ByteArrayInputStream stream = kriService.exportValueCapturePendingForVerificationWithImage(mvcDtoList, user,
				AssessmentPeriod);
		IOUtils.copy(stream, response.getOutputStream());
	}
}
