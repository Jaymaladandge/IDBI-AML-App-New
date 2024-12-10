
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
import java.text.SimpleDateFormat;
import java.util.Date;

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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.RuleWiseReportDto;
import com.idbi.intech.aml.domain.app.StateWiseReportDto;
import com.idbi.intech.aml.domain.app.RuleWiseExportDto;
import com.idbi.intech.aml.util.RuleWiseReportExport;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class RuleWiseReportController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;

	@Value("${app-url.uri}")
	private String uri;

	@Value("${app-url.fetchAllRules}")
	private String fetchAllRules;
	@Value("${app-url.viewRuleWiseRequests}")
	private String viewRuleWiseRequests;
	@Value("${app-url.insertRuleWiseRequest}")
	private String insertRuleWiseRequest;
	@Value("${app-url.cancelRuleRequest}")
	private String cancelRuleRequest;
	@Value("${app-url.fetchRuleWiseStatus}")
	private String fetchRuleWiseStatus;
	@Value("${app-url.fetchRuleWiseCountList}")
	private String fetchRuleWiseCountList;
	@Value("${file-location.unprocessedFilePath}")
	private String unprocessedFilePath;

	RequestResponseJsonDto respDto = null;

	@RequestMapping("/ruleWiseReport") // inital
	public String fetchUserList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		RuleWiseReportDto alertDumpDto = new RuleWiseReportDto();
		alertDumpDto.setUserId(user.getUserId());

		try {

			respDto = commonUtility.objectToJson(alertDumpDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewRuleWiseRequests, respDto));
			alertDumpDto = objectMapper.readValue(respString, RuleWiseReportDto.class); //
			
			// System.out.println(alertDumpDto.getTime());
			model.addAttribute("viewRuleRequest", alertDumpDto.getViewRequestList());

		} catch (Exception e) {
			e.printStackTrace();
		}
		model.addAttribute("setTimeOut", alertDumpDto.getTime());
		model.addAttribute("sessionUserid", user.getUserId());
		model.addAttribute("sessionUserRole", user.getUserPosition());
		model.addAttribute("sessionUsername", user.getUsername());

		return "ruleWiseReport"; // return "redirect:/fetchUserReport";
	}

	@RequestMapping("/fetchAllRules") // onclick of get report
	@ResponseBody // onclick of get report
	public RuleWiseReportDto fetchAllRulesList(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		// System.out.println("fetchRulesList");
		final ObjectMapper objectMapper = new ObjectMapper();

		// System.out.println("in ruleWiseAlertCount");

		RuleWiseReportDto ruleMasterDto = new RuleWiseReportDto();
		ruleMasterDto.setUserId(user.getUserId());
		// System.out.println("in ruleWiseAlertCount");

		try {

			respDto = commonUtility.objectToJson(ruleMasterDto);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAllRules, respDto));
			ruleMasterDto = objectMapper.readValue(respString, RuleWiseReportDto.class);

			// System.out.println("activityReport " + ruleMasterDto);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return ruleMasterDto;

	}
	
	@RequestMapping("/insertRuleWiseRequest") // onclick of get report
	@ResponseBody
	public RuleWiseReportDto insertRuleWiseRequest(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		// System.out.println(user.getOmsUserPosition());
		RuleWiseReportDto ruleWiseDto = new RuleWiseReportDto();
		// ActivityReportDto activityReport = new ActivityReportDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			
			ruleWiseDto = objectMapper.readValue(pageValJson, RuleWiseReportDto.class);

			ruleWiseDto.setOmsUserId(user.getOmsUserPosition());

			ruleWiseDto.setRequestParameters(pageValJson);
			//System.out.println(ruleWiseDto.getRequestParameters());
			ruleWiseDto.setStatus("I");

			respDto = commonUtility.objectToJson(ruleWiseDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + insertRuleWiseRequest, respDto));
			ruleWiseDto = objectMapper.readValue(respString, RuleWiseReportDto.class);


		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return ruleWiseDto;

	}
	
	@RequestMapping("/cancelRuleRequest") // onclick of get report
	@ResponseBody
	public RuleWiseReportDto cancleRuleRequest(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		RuleWiseReportDto activityReport = new RuleWiseReportDto();

		try {

			//System.out.println("In cancleRequest ");
			String pageValJson = request.getParameter("pageValJson");

			activityReport = objectMapper.readValue(pageValJson, RuleWiseReportDto.class);

			activityReport.setRequestId(activityReport.getRequestId());
			//System.out.println(activityReport.getRequestId());
			respDto = commonUtility.objectToJson(activityReport);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + cancelRuleRequest, respDto));
			activityReport = objectMapper.readValue(respString, RuleWiseReportDto.class);

			// System.out.println("activityReport " + activityReport);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}
	
	@RequestMapping("/fetchRuleStatus") // onclick of get report
	@ResponseBody
	public RuleWiseReportDto fetchRuleWiseStatus(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		RuleWiseReportDto activityReport = new RuleWiseReportDto();

		try {

			String pageValJson = request.getParameter("pageValJson");
			// System.out.println("pageValJson " + pageValJson);
			activityReport = objectMapper.readValue(pageValJson, RuleWiseReportDto.class);

			activityReport.setRequestId(activityReport.getRequestId());
			// System.out.println(activityReport.getRequestId());
			respDto = commonUtility.objectToJson(activityReport);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRuleWiseStatus, respDto));
			activityReport = objectMapper.readValue(respString, RuleWiseReportDto.class);

			// System.out.println("activityReport " + activityReport);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}

	@PostMapping("/fetchRuleWiseReport") // inital
	public String fetchRuleWiseReport(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		RuleWiseReportDto activityReportDto = new RuleWiseReportDto();
		String requestString = "";
		try {
			
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			activityReportDto = objectMapper.readValue(requestString, RuleWiseReportDto.class);
		
			activityReportDto.setRequestId(activityReportDto.getRequestId());
			respDto = commonUtility.objectToJson(activityReportDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRuleWiseCountList, respDto));
			activityReportDto = objectMapper.readValue(respString, RuleWiseReportDto.class);
			model.addAttribute("sessionRequestId",activityReportDto.getRequestId() );
			
			model.addAttribute("ruleWiseCountListBody", activityReportDto.getFinalList());


		} catch (Exception e) {
			e.printStackTrace();
		}

		return "ruleWiseCountReport";
		// return "redirect:/alertCountList";
	}
	
	@RequestMapping("/exportRuleWiseAlerttest")
	public void exportRuleWiseAlerttest(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request,
			HttpServletResponse response) throws JsonProcessingException {
		//System.out.println("IN WEB exportAlertActivityReport");

		
		RuleWiseReportDto activityReportDto = new RuleWiseReportDto();
		RuleWiseExportDto stateWiseExport=new RuleWiseExportDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
		
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			
			activityReportDto = objectMapper.readValue(requestString, RuleWiseReportDto.class);
			
			activityReportDto.setRequestId(activityReportDto.getRequestId());

			//System.out.println(activityReportDto.getRequestId());
			respDto = commonUtility.objectToJson(activityReportDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRuleWiseCountList, respDto));
			activityReportDto = objectMapper.readValue(respString, RuleWiseReportDto.class);
			
			//System.out.println(activityReportDto.getFinalList());

			for (RuleWiseReportDto s : activityReportDto.getFinalList()) {

				stateWiseExport.setAlertStartDate(s.getAlertStartDate());
				stateWiseExport.setAlertEndDate(s.getAlertEndDate());
				

			}
			
			String dateAsString = new SimpleDateFormat("yyyyMMddHHmm").format(new Date());
			String fileName = "Rule_Wise_Alert_Report_" + dateAsString + ".xlsx";
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName + "");
			

			// System.out.println(userDto.getAlertStartDate());
			String reportDate = new SimpleDateFormat("dd.MM.yyyy").format(new Date());
			String reportExtractDate = new SimpleDateFormat("dd.MM.yyyy hh:mm a").format(new Date());

			stateWiseExport.setUsername(user.getUsername().toUpperCase());
			stateWiseExport.setUserDeptName(user.getUserDeptName());
			stateWiseExport.setUserOfficeName(user.getUserOfficeType());
			stateWiseExport.setUserOfficeType(user.getUserOfficeType());
			activityReportDto.setReportDate(reportDate);
			activityReportDto.setReportExtractionDate(reportExtractDate);

			activityReportDto.setRuleWiseExportDto(stateWiseExport);
			//System.out.println("activityReportDto: " + activityReportDto);
			RuleWiseReportExport ativityReport = new RuleWiseReportExport();
			ativityReport.ruleWiseReportExport(response, activityReportDto);

		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

	}
	
	@PostMapping(value = "/exportOfflineRuleAlert")
	public void fileDownloadRule(@ModelAttribute(name = "encryptedJson") EncryptedRequestDto encryptedRequest,
			HttpServletRequest request, HttpServletResponse response, @AuthenticationPrincipal User user)
			throws IOException {
		final ObjectMapper map = new ObjectMapper();

		RuleWiseReportDto fileDto = new RuleWiseReportDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			fileDto = map.readValue(requestString, RuleWiseReportDto.class);

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
