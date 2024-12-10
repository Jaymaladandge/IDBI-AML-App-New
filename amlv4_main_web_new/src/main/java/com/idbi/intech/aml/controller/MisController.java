package com.idbi.intech.aml.controller;

import java.io.ByteArrayInputStream;
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
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.poi.util.IOUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.idbi.intech.aml.domain.app.ActivityReportDto;
import com.idbi.intech.aml.domain.app.AlertPendencyReportDto;
import com.idbi.intech.aml.domain.app.MisDto;
import com.idbi.intech.aml.util.AgeingPendencyListExport;
import com.idbi.intech.aml.util.AgeingReportExport;
import com.idbi.intech.aml.util.AlertActivityReportExport;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class MisController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchUserList}")
	private String fetchUserList;
	@Value("${app-url.fetchRequestList}")
	private String fetchRequestList;
	@Value("${app-url.fetchAlertCount}")
	private String fetchAlertCount;
	@Value("${app-url.fetchAlertsList}")
	private String fetchAlertsList;
	@Value("${app-url.fetchViewRequest}")
	private String fetchViewRequest;
	@Value("${app-url.fetchCountList}")
	private String fetchCountList;
	@Value("${app-url.cancelRequestStatus}")
	private String cancelRequestStatus;
	@Value("${app-url.fetchAlertPendencyCount}")
	private String fetchAlertPendencyCount;
	@Value("${app-url.getCurrentRoleList}")
	private String getCurrentRoleList;
	@Value("${app-url.fetchAlertPendencyList}")
	private String fetchAlertPendencyList;
	@Value("${file-location.unprocessedFilePath}")
	private String unprocessedFilePath;

	RequestResponseJsonDto respDto = null;

	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;

	@RequestMapping("/fetchUserReport") // inital
	public String fetchUserList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		// System.out.println("in fetchUserReport");
		UserDto userObj = new UserDto();
		// System.out.println(user.getUserId());
		MisDto misDto = new MisDto();
		misDto.setUserId(user.getUserId());
		// System.out.println(misDto.getUserId());
		try {
			// System.out.println("alert");
			respDto = commonUtility.objectToJson(misDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchViewRequest, respDto));
			misDto = objectMapper.readValue(respString, MisDto.class);
			// System.out.println("activityReportDto: " + activityReportDto);

			model.addAttribute("viewRequest", misDto.getViewRequestList());

		} catch (Exception e) {
			e.printStackTrace();
		}

		model.addAttribute("setTimeOut", misDto.getTime());
		model.addAttribute("sessionUserid", user.getUserId());
		model.addAttribute("sessionUserRole", user.getUserPosition());
		model.addAttribute("sessionUsername", user.getUsername());

		return "MisData";
		// return "redirect:/fetchUserReport";
	}

	@RequestMapping("/fetchUserReportN") // onclick of get report
	@ResponseBody
	public ActivityReportDto fetchUserReportN(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		// System.out.println("fetchUserReportN");
		UserDto userObj = new UserDto();

		// System.out.println(user.getOmsUserPosition());
		MisDto misDto = new MisDto();
		ActivityReportDto activityReport = new ActivityReportDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			misDto = objectMapper.readValue(pageValJson, MisDto.class);

			misDto.setOmsUserId(user.getOmsUserPosition());
			misDto.setRequestParameters(pageValJson);
			misDto.setStatus("I");
			respDto = commonUtility.objectToJson(misDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchUserList, respDto));
			misDto = objectMapper.readValue(respString, MisDto.class);
			

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}

	@RequestMapping("/fetchReportCount") // onclick of get report
	@ResponseBody
	public MisDto fetchRequestCount(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		MisDto activityReport = new MisDto();

		try {

			String pageValJson = request.getParameter("pageValJson");
			// System.out.println("pageValJson " + pageValJson);
			activityReport = objectMapper.readValue(pageValJson, MisDto.class);

			activityReport.setRequestId(activityReport.getRequestId());
			// System.out.println(activityReport.getRequestId());
			respDto = commonUtility.objectToJson(activityReport);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertCount, respDto));
			activityReport = objectMapper.readValue(respString, MisDto.class);

			// System.out.println("activityReport " + activityReport);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}

	@PostMapping("/fetchReportCountList") // inital
	public String fetchReportCountList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		// System.out.println("in web controller");
		UserDto userObj = new UserDto();
		ActivityReportDto activityReportDto = new ActivityReportDto();
		String requestString = "";
		try {

			/*
			 * String pageValJson = request.getParameter("pageValJson");
			 * 
			 * activityReportDto = objectMapper.readValue(pageValJson,
			 * ActivityReportDto.class);
			 */
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			activityReportDto = objectMapper.readValue(requestString, ActivityReportDto.class);
			// System.out.println("activityReportDto.getRequestId(): " +
			// activityReportDto.getRequestId());
			activityReportDto.setRequestId(activityReportDto.getRequestId());
			respDto = commonUtility.objectToJson(activityReportDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchCountList, respDto));
			activityReportDto = objectMapper.readValue(respString, ActivityReportDto.class);

			model.addAttribute("activityReportGson", new Gson().toJson(activityReportDto));
			/*
			 * System.out.println("activityReportDto: " + activityReportDto);
			 * System.out.println("StartDate: "+ activityReportDto.getStartDate());
			 * System.out.println("EndDate: "+ activityReportDto.getEndDate());
			 */
			
			//System.out.println("activityReportDto.getActivityReportDtoList(): "+activityReportDto.getActivityReportDtoList());
			model.addAttribute("alertCountListBody", activityReportDto.getActivityReportDtoList());

			model.addAttribute("alertCount", activityReportDto.getAlertCountList());
			model.addAttribute("actionCount", activityReportDto.getActionCountList());
			model.addAttribute("customerCount", activityReportDto.getCustomerCountList());
			model.addAttribute("ucicCount", activityReportDto.getUcicCountList());
			model.addAttribute("userCount", activityReportDto.getUserCountList());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "alertCountList";
		// return "redirect:/alertCountList";
	}

	// exportClassificationReport
	@RequestMapping("/exportAlertActivityReport")
	public void exportAlertActivityReport(HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			@ModelAttribute(name = "encryptedJson") EncryptedRequestDto encryptedRequest) throws IOException {
		// System.out.println("IN WEB exportAlertActivityReport");
		ActivityReportDto activityReportDto = new ActivityReportDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		try {

			String requestString = "";
			String dateAsString = new SimpleDateFormat("yyyyMMddHHmm").format(new Date());
			String fileName = "Alert_Investigation_Activity_Report_" + dateAsString + ".xlsx";
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName + "");

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			// System.out.println("Request String " + requestString);
			activityReportDto = objectMapper.readValue(requestString, ActivityReportDto.class);
			// System.out.println("activityReportDto: "+activityReportDto);
			String reportDate = new SimpleDateFormat("dd.MM.yyyy").format(new Date());
			String reportExtractDate = new SimpleDateFormat("dd.MM.yyyy hh:mm a").format(new Date());

			UserDto userDto = new UserDto();
			userDto.setUsername(user.getUsername().toUpperCase());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserOfficeName(user.getUserOfficeType());
			userDto.setUserOfficeType(user.getUserOfficeType());
			activityReportDto.setReportDate(reportDate);
			activityReportDto.setReportExtractionDate(reportExtractDate);

			activityReportDto.setUserDto(userDto);
			// System.out.println("activityReportDto: "+activityReportDto);
			AlertActivityReportExport ativityReport = new AlertActivityReportExport();
			ativityReport.alertActivityReportExport(response, activityReportDto);

		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

	}

	@RequestMapping("/cancleRequest") // onclick of get report
	@ResponseBody
	public MisDto cancleRequest(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		MisDto activityReport = new MisDto();

		try {

			// System.out.println("In cancleRequest ");
			String pageValJson = request.getParameter("pageValJson");

			activityReport = objectMapper.readValue(pageValJson, MisDto.class);

			activityReport.setRequestId(activityReport.getRequestId());
			// System.out.println(activityReport.getRequestId());
			respDto = commonUtility.objectToJson(activityReport);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + cancelRequestStatus, respDto));
			activityReport = objectMapper.readValue(respString, MisDto.class);

			// System.out.println("activityReport " + activityReport);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}

	@PostMapping(value = "/exportOfflineAlertActivity")
	public void fileDownloadActivity(@ModelAttribute(name = "encryptedJson") EncryptedRequestDto encryptedRequest,
			HttpServletRequest request, HttpServletResponse response, @AuthenticationPrincipal User user)
			throws IOException {
		final ObjectMapper map = new ObjectMapper();

		ActivityReportDto fileDto = new ActivityReportDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			fileDto = map.readValue(requestString, ActivityReportDto.class);

			String inputFile = fileDto.getRequestId();
			String result = inputFile.replace("/", "");

			//System.out.println("unprocessedFilePath+fileDto.getRequestId(): " + unprocessedFilePath + result);
			File processedFile = new File(unprocessedFilePath + result + ".xlsx");

			String excelFileName = result + ".xlsx";
			// C:\Users\User\OfflineAlert\Unprocessed
			//System.out.println("processedFile: " + processedFile);
			File selectedFile;

			//System.out.println("processedFile.exists(): " + processedFile.exists());

			if (processedFile.exists()) {
				selectedFile = processedFile;

			} else { // File not found in either location
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.getWriter().write("File not found for fileDto: " + excelFileName);
				//System.out.println("File not found for fileDto: " + excelFileName);
				return;
			}

			DataInputStream input = new DataInputStream(new FileInputStream(selectedFile));
			int length = 0;
			ServletOutputStream outputstream = response.getOutputStream();
			response.setContentType("application/octet-stream");
			response.setContentLength((int) selectedFile.length());
			response.setHeader("Content-Disposition", "attachment;filename=" + excelFileName);
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
	
	@RequestMapping("/alertPendencyReport") // inital
	public String fetchAlertPendencyReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AlertPendencyReportDto rulePendencyDto = new AlertPendencyReportDto();
		// System.out.println("here");
		try {

			respDto = commonUtility.objectToJson(rulePendencyDto);
			final String respStringState = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getCurrentRoleList, respDto));
			// System.out.println("respStringState :"+respStringState);
			rulePendencyDto = objectMapper.readValue(respStringState, AlertPendencyReportDto.class);

			model.addAttribute("currentRoleList", rulePendencyDto.getRoleList());

		} catch (Exception e) {
			e.printStackTrace();
		}
		// model.addAttribute("setTimeOut", stateWiseReportDto.getTime());
		model.addAttribute("sessionUserid", user.getUserId());
		model.addAttribute("sessionUserRole", user.getUserPosition());
		model.addAttribute("sessionUsername", user.getUsername());

		return "alertPendencyReport";
		// return "redirect:/fetchUserReport";
	}

	@RequestMapping("/fetchAlertPendencyCount") // onclick of get report @ResponseBody
	public String fetchAlertPendencyCount(@ModelAttribute(name = "encryptedJson") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model)
			throws JsonProcessingException {
		// System.out.println("fetchAlertPendencyCount controller
		// :"+encryptedRequest.getEncryptedJson());
		final ObjectMapper objectMapper = new ObjectMapper();

		AlertPendencyReportDto rulePendencyDto = new AlertPendencyReportDto();

		try {
			String pageValJson = encryptedRequest.getEncryptedJson();

			rulePendencyDto = objectMapper.readValue(pageValJson, AlertPendencyReportDto.class);

			respDto = commonUtility.objectToJson(rulePendencyDto);
			final String respStringState = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getCurrentRoleList, respDto));
			// System.out.println("respStringState :"+respStringState);
			rulePendencyDto = objectMapper.readValue(respStringState, AlertPendencyReportDto.class);

			model.addAttribute("currentRoleList", rulePendencyDto.getRoleList());

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertPendencyCount, respDto));

			// System.out.println("fetchAlertPendencyCount respString :"+respString);

			rulePendencyDto = objectMapper.readValue(respString, AlertPendencyReportDto.class);

			// System.out.println("fetchAlertPendencyCount getAlertPendencyList
			// :"+rulePendencyDto.getAlertPendencyList());

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		model.addAttribute("alertPendencyList", rulePendencyDto.getAlertPendencyList());
		model.addAttribute("roleId", rulePendencyDto.getRoleId());

		// return rulePendencyDto;
		return "alertPendencyReport";
	}

	@RequestMapping("/fetchAlertPendencyList") // onclick of get report
	@ResponseBody
	public AlertPendencyReportDto fetchAlertPendencyList(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		// System.out.println("fetchAlertPendencyList controller
		// :"+request.getParameter("pageValJson"));
		final ObjectMapper objectMapper = new ObjectMapper();

		AlertPendencyReportDto alertPendencyDto = new AlertPendencyReportDto();

		try {
			String pageValJson = request.getParameter("pageValJson");

			alertPendencyDto = objectMapper.readValue(pageValJson, AlertPendencyReportDto.class);

			respDto = commonUtility.objectToJson(alertPendencyDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertPendencyList, respDto));

			alertPendencyDto = objectMapper.readValue(respString, AlertPendencyReportDto.class);

			// System.out.println("fetchAlertPendencyList AlertMasterList
			// :"+alertPendencyDto.getAlertMasterList());

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		// model.addAttribute("alertPendencyList",
		// rulePendencyDto.getAlertPendencyList());

		return alertPendencyDto;

	}

	@RequestMapping("/exportFetchAlertPendencyCount")
	public void exportFetchAlertPendencyCount(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request,
			HttpServletResponse response) throws JsonProcessingException {

		final ObjectMapper objectMapper = new ObjectMapper();
		AlertPendencyReportDto rulePenDtoExport = new AlertPendencyReportDto();
		AlertPendencyReportDto rulePendencyDto = new AlertPendencyReportDto();
		try {

			String pageValJson = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());

			rulePendencyDto = objectMapper.readValue(pageValJson, AlertPendencyReportDto.class);

			respDto = commonUtility.objectToJson(rulePendencyDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertPendencyCount, respDto));

			rulePendencyDto = objectMapper.readValue(respString, AlertPendencyReportDto.class);

			String dateAsString = new SimpleDateFormat("yyyyMMddHHmm").format(new Date());
			String fileName = "Aging_Report" + dateAsString + ".xlsx";
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName + "");

			// System.out.println(userDto.getAlertStartDate());
			String reportDate = new SimpleDateFormat("dd.MM.yyyy").format(new Date());
			String reportExtractDate = new SimpleDateFormat("dd.MM.yyyy hh:mm a").format(new Date());

			rulePendencyDto.setReportDate(reportDate);
			rulePendencyDto.setReportExtractionDate(reportExtractDate);

			AgeingReportExport agingReport = new AgeingReportExport();
			agingReport.agingReportExport(response, rulePendencyDto);

		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

	}

	@RequestMapping("/exportFetchAlertPendencyList")
	public void exportFetchAlertPendencyList(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request,
			HttpServletResponse response) throws JsonProcessingException {
		
		final ObjectMapper objectMapper = new ObjectMapper();
		AlertPendencyReportDto alertPendencyDto = new AlertPendencyReportDto();
		try {

			String pageValJson = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());

			alertPendencyDto = objectMapper.readValue(pageValJson, AlertPendencyReportDto.class);

			String reportType=alertPendencyDto.getReportType();
			respDto = commonUtility.objectToJson(alertPendencyDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertPendencyList, respDto));

			alertPendencyDto = objectMapper.readValue(respString, AlertPendencyReportDto.class);

			String dateAsString = new SimpleDateFormat("yyyyMMddHHmm").format(new Date());
			String fileName = "Aging_Report" + dateAsString + ".xlsx";
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName + "");

			// System.out.println(userDto.getAlertStartDate());
			String reportDate = new SimpleDateFormat("dd.MM.yyyy").format(new Date());
			String reportExtractDate = new SimpleDateFormat("dd.MM.yyyy hh:mm a").format(new Date());

			alertPendencyDto.setReportDate(reportDate);
			alertPendencyDto.setReportExtractionDate(reportExtractDate);

			AgeingPendencyListExport agingReport = new AgeingPendencyListExport();
			
			if(reportType.equalsIgnoreCase("ALERT")) {
				
			 agingReport.agingAlertReportListExport(response, alertPendencyDto);
			 
			}else if (reportType.equalsIgnoreCase("STR")){
				
			 agingReport.agingStrReportListExport(response, alertPendencyDto);
			 
			}

		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

	}
}
