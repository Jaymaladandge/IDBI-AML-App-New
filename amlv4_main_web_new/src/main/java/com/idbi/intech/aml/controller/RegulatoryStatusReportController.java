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
import com.idbi.intech.aml.domain.app.RegulatoryStatusReportDto;
import com.idbi.intech.aml.domain.app.StateWiseExportDto;
import com.idbi.intech.aml.domain.app.StateWiseReportDto;
import com.idbi.intech.aml.domain.app.AlertDumpTableDto;
import com.idbi.intech.aml.domain.app.DumpDto;
import com.idbi.intech.aml.util.RegulatoryStatusReportExport;
import com.idbi.intech.aml.util.StateWiseReportExport;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;
import java.io.File;
import java.io.DataInputStream;

@Controller
public class RegulatoryStatusReportController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.insertRegulatoryRequest}")
	private String insertRegulatoryRequest;
	@Value("${app-url.cancelRegulatoryRequest}")
	private String cancelRegulatoryRequest;
	@Value("${app-url.viewRegulatoryRequests}")
	private String viewRegulatoryRequests;
	@Value("${app-url.fetchRegulatoryStatus}")
	private String fetchRegulatoryStatus;
	@Value("${app-url.fetchRegulatoryStatusReport}")
	private String fetchRegulatoryStatusReport;
	@Value("${file-location.unprocessedFilePath}")
	private String unprocessedFilePath;

	RequestResponseJsonDto respDto = null;

	@RequestMapping("/regulatoryStatus") // inital
	public String fetchUserList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		UserDto userObj = new UserDto();
		RegulatoryStatusReportDto alertDumpDto = new RegulatoryStatusReportDto();
		alertDumpDto.setUserId(user.getUserId());

		try {
			respDto = commonUtility.objectToJson(alertDumpDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewRegulatoryRequests, respDto));
			alertDumpDto = objectMapper.readValue(respString, RegulatoryStatusReportDto.class);
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

		return "regulatoryStatusReport";
		// return "redirect:/fetchUserReport";
	}

	@RequestMapping("/insertRegulatoryRequest") // onclick of get report
	@ResponseBody
	public RegulatoryStatusReportDto insertRequest(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		// System.out.println("fetchUserReportN");
		UserDto userObj = new UserDto();

		// System.out.println(user.getOmsUserPosition());
		RegulatoryStatusReportDto ruleWiseDto = new RegulatoryStatusReportDto();
		// ActivityReportDto activityReport = new ActivityReportDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			// System.out.println("pageValJson: " + pageValJson);
			ruleWiseDto = objectMapper.readValue(pageValJson, RegulatoryStatusReportDto.class);

			ruleWiseDto.setRequestParameters(pageValJson);
			// System.out.println(ruleWiseDto.getRequestParameters());
			ruleWiseDto.setStatus("I");

			respDto = commonUtility.objectToJson(ruleWiseDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + insertRegulatoryRequest, respDto));
			ruleWiseDto = objectMapper.readValue(respString, RegulatoryStatusReportDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return ruleWiseDto;

	}

	@RequestMapping("/fetchRegulatoryStatus") // onclick of get report
	@ResponseBody
	public RegulatoryStatusReportDto fetchRequestCount(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		RegulatoryStatusReportDto activityReport = new RegulatoryStatusReportDto();

		try {

			String pageValJson = request.getParameter("pageValJson");
			// System.out.println("pageValJson " + pageValJson);
			activityReport = objectMapper.readValue(pageValJson, RegulatoryStatusReportDto.class);

			activityReport.setRequestId(activityReport.getRequestId());
			// System.out.println(activityReport.getRequestId());
			respDto = commonUtility.objectToJson(activityReport);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRegulatoryStatus, respDto));
			activityReport = objectMapper.readValue(respString, RegulatoryStatusReportDto.class);

			// System.out.println("activityReport " + activityReport);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}

	@PostMapping("/fetchRegulatoryStatusReport") // inital
	public String fetchReportCountList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		// System.out.println("in web controller");
		UserDto userObj = new UserDto();
		// AlertDumpDto alertDump = new AlertDumpDto();
		RegulatoryStatusReportDto activityReportDto = new RegulatoryStatusReportDto();
		// System.out.println("in web");
		String requestString = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			activityReportDto = objectMapper.readValue(requestString, RegulatoryStatusReportDto.class);

			// System.out.println(activityReportDto.getRequestId());

			respDto = commonUtility.objectToJson(activityReportDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRegulatoryStatusReport, respDto));
			activityReportDto = objectMapper.readValue(respString, RegulatoryStatusReportDto.class);
			// System.out.println("json: " + new Gson().toJson(activityReportDto));
			// System.out.println(activityReportDto.getFinalList());
			model.addAttribute("sessionRequestId", activityReportDto.getRequestId());

			model.addAttribute("regulatoryStatusListBody", activityReportDto.getFinalList());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "RegulatoryStatusCountReport";
		// return "redirect:/alertCountList";
	}

	@RequestMapping("/exportRegStatusReporttest")
	public void exportRegulatoryStatusTest(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request,
			HttpServletResponse response) throws JsonProcessingException {
		//System.out.println("IN WEB exportAlertActivityReport");

		
		RegulatoryStatusReportDto activityReportDto = new RegulatoryStatusReportDto();
		UserDto userDto = new UserDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
		
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			
			activityReportDto = objectMapper.readValue(requestString, RegulatoryStatusReportDto.class);
			
			activityReportDto.setRequestId(activityReportDto.getRequestId());

			//System.out.println(activityReportDto.getRequestId());
			respDto = commonUtility.objectToJson(activityReportDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRegulatoryStatusReport, respDto));
			activityReportDto = objectMapper.readValue(respString, RegulatoryStatusReportDto.class);
			
			//System.out.println(activityReportDto.getFinalList());

			String dateAsString = new SimpleDateFormat("yyyyMMddHHmm").format(new Date());
			String fileName = "Regulatory_Status_Report_" + dateAsString + ".xlsx";
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName + "");
			

			// System.out.println(userDto.getAlertStartDate());
			String reportDate = new SimpleDateFormat("dd.MM.yyyy").format(new Date());
			String reportExtractDate = new SimpleDateFormat("dd.MM.yyyy hh:mm a").format(new Date());

			activityReportDto.setUsername(user.getUsername().toUpperCase());
			activityReportDto.setUserDeptName(user.getUserDeptName());
			activityReportDto.setUserOfficeName(user.getUserOfficeType());
			activityReportDto.setUserOfficeType(user.getUserOfficeType());
			activityReportDto.setReportDate(reportDate);
			activityReportDto.setReportExtractionDate(reportExtractDate);

			//System.out.println("activityReportDto: " + activityReportDto);
			RegulatoryStatusReportExport ativityReport = new RegulatoryStatusReportExport();
			ativityReport.regStatusReportExport(response, activityReportDto);

		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

	}

	@RequestMapping("/RegulatoryRequestCancel") // onclick of get report
	@ResponseBody
	public RegulatoryStatusReportDto RequestCancel(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		RegulatoryStatusReportDto activityReport = new RegulatoryStatusReportDto();

		try {

			// System.out.println("In cancleRequest ");
			String pageValJson = request.getParameter("pageValJson");

			activityReport = objectMapper.readValue(pageValJson, RegulatoryStatusReportDto.class);

			activityReport.setRequestId(activityReport.getRequestId());
			// System.out.println(activityReport.getRequestId());
			respDto = commonUtility.objectToJson(activityReport);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + cancelRegulatoryRequest, respDto));
			activityReport = objectMapper.readValue(respString, RegulatoryStatusReportDto.class);

			// System.out.println("activityReport " + activityReport);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}

	@PostMapping(value = "/exportOfflineRegulatoryStatus")
	public void fileDownloadDump(@ModelAttribute(name = "encryptedJson") EncryptedRequestDto encryptedRequest,
			HttpServletRequest request, HttpServletResponse response, @AuthenticationPrincipal User user)
			throws IOException {
		final ObjectMapper map = new ObjectMapper();

		RegulatoryStatusReportDto fileDto = new RegulatoryStatusReportDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			fileDto = map.readValue(requestString, RegulatoryStatusReportDto.class);

			String inputFile = fileDto.getRequestId();
			String result = inputFile.replace("/", "");

			// System.out.println("unprocessedFilePath+fileDto.getRequestId(): " +
			// unprocessedFilePath + result);
			File processedFile = new File(unprocessedFilePath + result + ".xlsx");

			String excelFileName = result + ".xlsx";
			// C:\Users\User\OfflineAlert\Unprocessed
			// System.out.println("processedFile: " + processedFile);
			File selectedFile;

			// System.out.println("processedFile.exists(): " + processedFile.exists());

			if (processedFile.exists()) {
				selectedFile = processedFile;

			} else { // File not found in either location
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.getWriter().write("File not found for fileDto: " + excelFileName);
				// System.out.println("File not found for fileDto: " + excelFileName);
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
