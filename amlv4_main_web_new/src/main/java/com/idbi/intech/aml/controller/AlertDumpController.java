package com.idbi.intech.aml.controller;

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
import org.springframework.http.HttpHeaders;

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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.AlertDumpDto;
import com.idbi.intech.aml.domain.app.AlertDumpTableDto;
import com.idbi.intech.aml.domain.app.DumpDto;
import com.idbi.intech.aml.util.AlertDumpReportExport;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;
import java.io.File;
import java.io.DataInputStream;

@Controller
public class AlertDumpController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchRules}")
	private String fetchRules;
	@Value("${app-url.insertRequest}")
	private String insertRequest;
	@Value("${app-url.cancelRequest}")
	private String cancelRequest;
	@Value("${app-url.viewRequests}")
	private String viewRequests;
	@Value("${app-url.fetchStatus}")
	private String fetchStatus;
	@Value("${app-url.fetchAlertDump}")
	private String fetchAlertDump;
	@Value("${file-location.unprocessedFilePath}")
	private String unprocessedFilePath;

	RequestResponseJsonDto respDto = null;

	@RequestMapping("/ruleWiseAlertCount") // inital
	public String fetchUserList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		UserDto userObj = new UserDto();
		AlertDumpDto alertDumpDto = new AlertDumpDto();
		alertDumpDto.setUserId(user.getUserId());

		try {
			respDto = commonUtility.objectToJson(alertDumpDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewRequests, respDto));
			alertDumpDto = objectMapper.readValue(respString, AlertDumpDto.class);
			// System.out.println("activityReportDto: " + activityReportDto);
//System.out.println(alertDumpDto.getTime());
			model.addAttribute("viewRuleRequest", alertDumpDto.getViewRequestList());

		} catch (Exception e) {
			e.printStackTrace();
		}
		model.addAttribute("setTimeOut", alertDumpDto.getTime());
		model.addAttribute("sessionUserid", user.getUserId());
		model.addAttribute("sessionUserRole", user.getUserPosition());
		model.addAttribute("sessionUsername", user.getUsername());

		return "ruleWiseAlertCount";
		// return "redirect:/fetchUserReport";
	}

	@RequestMapping("/fetchRules") // onclick of get report
	@ResponseBody // onclick of get report
	public AlertDumpDto fetchRulesList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		// System.out.println("fetchRulesList");
		final ObjectMapper objectMapper = new ObjectMapper();

		// System.out.println("in ruleWiseAlertCount");

		AlertDumpDto ruleMasterDto = new AlertDumpDto();
		ruleMasterDto.setUserId(user.getUserId());
		// System.out.println("in ruleWiseAlertCount");

		try {

			respDto = commonUtility.objectToJson(ruleMasterDto);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRules, respDto));
			ruleMasterDto = objectMapper.readValue(respString, AlertDumpDto.class);

			// System.out.println("activityReport " + ruleMasterDto);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return ruleMasterDto;

	}

	@RequestMapping("/insertRequest") // onclick of get report
	@ResponseBody
	public AlertDumpDto insertRequest(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		// System.out.println("fetchUserReportN");
		UserDto userObj = new UserDto();

		// System.out.println(user.getOmsUserPosition());
		AlertDumpDto ruleWiseDto = new AlertDumpDto();
		// ActivityReportDto activityReport = new ActivityReportDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			// System.out.println("pageValJson: " + pageValJson);
			ruleWiseDto = objectMapper.readValue(pageValJson, AlertDumpDto.class);

			ruleWiseDto.setOmsUserId(user.getOmsUserPosition());

			ruleWiseDto.setRequestParameters(pageValJson);
			// System.out.println(ruleWiseDto.getRequestParameters());
			ruleWiseDto.setStatus("I");

			respDto = commonUtility.objectToJson(ruleWiseDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + insertRequest, respDto));
			ruleWiseDto = objectMapper.readValue(respString, AlertDumpDto.class);

			/*
			 * misDto.setStatus("R"); respDto = commonUtility.objectToJson(misDto); final
			 * String requestString = commonUtility
			 * .decryptedResToString(commonUtility.webserviceConsume(uri + fetchRequestList,
			 * respDto)); misDto = objectMapper.readValue(requestString, MisDto.class);
			 * 
			 * respDto = commonUtility.objectToJson(misDto); final String dataString =
			 * commonUtility .decryptedResToString(commonUtility.webserviceConsume(uri +
			 * fetchAlertsList, respDto));
			 * 
			 * activityReport = objectMapper.readValue(dataString, ActivityReportDto.class);
			 */

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return ruleWiseDto;

	}

	@RequestMapping("/fetchStatus") // onclick of get report
	@ResponseBody
	public AlertDumpDto fetchRequestCount(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		AlertDumpDto activityReport = new AlertDumpDto();

		try {

			String pageValJson = request.getParameter("pageValJson");
			// System.out.println("pageValJson " + pageValJson);
			activityReport = objectMapper.readValue(pageValJson, AlertDumpDto.class);

			activityReport.setRequestId(activityReport.getRequestId());
			// System.out.println(activityReport.getRequestId());
			respDto = commonUtility.objectToJson(activityReport);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchStatus, respDto));
			activityReport = objectMapper.readValue(respString, AlertDumpDto.class);

			// System.out.println("activityReport " + activityReport);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}

	@PostMapping("/fetchAlertDumpReport") // inital
	public String fetchReportCountList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		// System.out.println("in web controller");
		UserDto userObj = new UserDto();
		// AlertDumpDto alertDump = new AlertDumpDto();
		AlertDumpTableDto activityReportDto = new AlertDumpTableDto();
		// System.out.println("in web");
		String requestString = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			activityReportDto = objectMapper.readValue(requestString, AlertDumpTableDto.class);

			activityReportDto.setRequestId(activityReportDto.getRequestId());

			respDto = commonUtility.objectToJson(activityReportDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertDump, respDto));
			activityReportDto = objectMapper.readValue(respString, AlertDumpTableDto.class);
			// System.out.println("json: " + new Gson().toJson(activityReportDto));
			// System.out.println(activityReportDto.getRequestId());
			model.addAttribute("sessionRequestId", activityReportDto.getRequestId());

			model.addAttribute("alertCountListBody", activityReportDto.getFinalList());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "AlertDumpList";
		// return "redirect:/alertCountList";
	}

	@RequestMapping("/exportAlertDumpReporttest")
	public void exportAlertDumpReportTest(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request,

			HttpServletResponse response) throws JsonProcessingException {
		// System.out.println("IN WEB exportAlertActivityReport");

		String encryptedJson = request.getParameter("encryptedJson");
		AlertDumpTableDto activityReportDto = new AlertDumpTableDto();
		AlertDumpDto alertDumpDto = new AlertDumpDto();
		DumpDto dumpDto = new DumpDto();
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			// System.out.println("till here correct");

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			activityReportDto = objectMapper.readValue(requestString, AlertDumpTableDto.class);

			// System.out.println(activityReportDto.getRequestId());
			respDto = commonUtility.objectToJson(activityReportDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertDump, respDto));
			activityReportDto = objectMapper.readValue(respString, AlertDumpTableDto.class);

			for (AlertDumpTableDto s : activityReportDto.getFinalList()) {

				for (DumpDto a : s.getAlertDumpTableList()) {

					userDto.setAlertStartDate(a.getStartDate());
					userDto.setAlertEndDate(a.getEndDate());

				}

			}

			String dateAsString = new SimpleDateFormat("yyyyMMddHHmm").format(new Date());
			String fileName = "Alert_Investigation_Dump_Report_" + dateAsString + ".xlsx";
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName + "");

			// System.out.println(userDto.getAlertStartDate());
			String reportDate = new SimpleDateFormat("dd.MM.yyyy").format(new Date());
			String reportExtractDate = new SimpleDateFormat("dd.MM.yyyy hh:mm a").format(new Date());

			userDto.setUsername(user.getUsername().toUpperCase());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserOfficeName(user.getUserOfficeType());
			userDto.setUserOfficeType(user.getUserOfficeType());
			activityReportDto.setReportDate(reportDate);
			activityReportDto.setReportExtractionDate(reportExtractDate);

			activityReportDto.setUserDto(userDto);
			// System.out.println("activityReportDto: " + activityReportDto);
			AlertDumpReportExport ativityReport = new AlertDumpReportExport();
			ativityReport.alertDumpReportExport(response, activityReportDto);

		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

	}

	@RequestMapping("/RequestCancel") // onclick of get report
	@ResponseBody
	public AlertDumpDto RequestCancel(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		AlertDumpDto activityReport = new AlertDumpDto();

		try {

			// System.out.println("In cancleRequest ");
			String pageValJson = request.getParameter("pageValJson");

			activityReport = objectMapper.readValue(pageValJson, AlertDumpDto.class);

			activityReport.setRequestId(activityReport.getRequestId());
			// System.out.println(activityReport.getRequestId());
			respDto = commonUtility.objectToJson(activityReport);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + cancelRequest, respDto));
			activityReport = objectMapper.readValue(respString, AlertDumpDto.class);

			// System.out.println("activityReport " + activityReport);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}

	@PostMapping(value = "/exportOfflineAlert")
	public void fileDownloadDump(@ModelAttribute(name = "encryptedJson") EncryptedRequestDto encryptedRequest,
			HttpServletRequest request, HttpServletResponse response, @AuthenticationPrincipal User user)
			throws IOException {
		final ObjectMapper map = new ObjectMapper();

		AlertDumpDto fileDto = new AlertDumpDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			fileDto = map.readValue(requestString, AlertDumpDto.class);

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

}
