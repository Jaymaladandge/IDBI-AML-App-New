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
import com.idbi.intech.aml.domain.app.StateWiseReportDto;
import com.idbi.intech.aml.domain.app.AlertDumpDto;
import com.idbi.intech.aml.domain.app.StateWiseExportDto;
import com.idbi.intech.aml.util.StateWiseReportExport;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class StateWiseReportController {

	
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.viewRequestsList}")
	private String viewRequestsList;
	@Value("${app-url.viewStateList}")
	private String viewStateList;
	@Value("${app-url.viewStateWiseAlertList}")
	private String viewStateWiseAlertList;
	@Value("${app-url.cancelXStateRequest}")
	private String cancelXStateRequest;
	@Value("${app-url.fetchStateWiseCountList}")
	private String fetchStateWiseCountList;
	@Value("${app-url.fetchStateWiseStatus}")
	private String fetchStateWiseStatus;
	@Value("${app-url.insertStateWiseRequest}")
	private String insertStateWiseRequest;
	@Value("${file-location.unprocessedFilePath}")
	private String unprocessedFilePath;
	

	RequestResponseJsonDto respDto = null;

	@RequestMapping("/fetchStateWiseReport") // inital
	public String fetchUserList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		StateWiseReportDto stateWiseReportDto = new StateWiseReportDto();
		//System.out.println("user.getUserId():"+user.getUserId());
		stateWiseReportDto.setUserId(user.getUserId());
		try {
		
			respDto = commonUtility.objectToJson(stateWiseReportDto);
			final String respStringState = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewStateList, respDto));
			stateWiseReportDto = objectMapper.readValue(respStringState, StateWiseReportDto.class);
			
			model.addAttribute("viewRuleRequest", stateWiseReportDto.getViewRequestList());
			model.addAttribute("viewStateRequest", stateWiseReportDto.getViewStateList());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		model.addAttribute("setTimeOut", stateWiseReportDto.getTime());
		model.addAttribute("sessionUserid", user.getUserId());
		model.addAttribute("sessionUserRole", user.getUserPosition());
		model.addAttribute("sessionUsername", user.getUsername());
		

		return "stateWiseReport";
		//return "redirect:/fetchUserReport";
	}
	
	@RequestMapping("/fetchStateWiseCount") // inital
	@ResponseBody
	public StateWiseReportDto fetchAlertCount(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		
		StateWiseReportDto stateWiseReportDto = new StateWiseReportDto();
		
		try {
			
			String pageValJson = request.getParameter("pageValJson");
			
			stateWiseReportDto = objectMapper.readValue(pageValJson, StateWiseReportDto.class);
			
			stateWiseReportDto.setRequestParameters(pageValJson);

			respDto = commonUtility.objectToJson(stateWiseReportDto);
			
			final String respStringState = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewStateWiseAlertList, respDto));
			stateWiseReportDto = objectMapper.readValue(respStringState, StateWiseReportDto.class);
			
			//System.out.println(stateWiseReportDto.getAlertCount());
			//System.out.println(stateWiseReportDto.getStrCount());
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	

		return stateWiseReportDto;
		//return "redirect:/fetchUserReport";
	}
	
	@RequestMapping("/insertStateWiseRequest") // inital
	@ResponseBody
	public StateWiseReportDto insertStateWiseRequest(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		
		StateWiseReportDto stateWiseReportDto = new StateWiseReportDto();
		
		try {
			
			String pageValJson = request.getParameter("pageValJson");
			
			stateWiseReportDto = objectMapper.readValue(pageValJson, StateWiseReportDto.class);
			
			stateWiseReportDto.setRequestParameters(pageValJson);

			respDto = commonUtility.objectToJson(stateWiseReportDto);
			
			final String respStringState = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + insertStateWiseRequest, respDto));
			stateWiseReportDto = objectMapper.readValue(respStringState, StateWiseReportDto.class);
			
			//System.out.println(stateWiseReportDto.getAlertCount());
			//System.out.println(stateWiseReportDto.getStrCount());
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	

		return stateWiseReportDto;
		//return "redirect:/fetchUserReport";
	}
	
	@RequestMapping("/cancelStateRequest") // onclick of get report
	@ResponseBody
	public StateWiseReportDto cancleRequest(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		StateWiseReportDto activityReport = new StateWiseReportDto();

		try {

			//System.out.println("In cancleRequest ");
			String pageValJson = request.getParameter("pageValJson");

			activityReport = objectMapper.readValue(pageValJson, StateWiseReportDto.class);

			activityReport.setRequestId(activityReport.getRequestId());
			//System.out.println(activityReport.getRequestId());
			respDto = commonUtility.objectToJson(activityReport);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + cancelXStateRequest, respDto));
			activityReport = objectMapper.readValue(respString, StateWiseReportDto.class);

			// System.out.println("activityReport " + activityReport);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}


	@PostMapping("/fetchStateWiseReportCount") // inital
	public String fetchReportCountList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		UserDto userObj = new UserDto();
		StateWiseReportDto activityReportDto = new StateWiseReportDto();
		String requestString = "";
		try {
			
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			activityReportDto = objectMapper.readValue(requestString, StateWiseReportDto.class);
		
			activityReportDto.setRequestId(activityReportDto.getRequestId());
			respDto = commonUtility.objectToJson(activityReportDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchStateWiseCountList, respDto));
			activityReportDto = objectMapper.readValue(respString, StateWiseReportDto.class);
			model.addAttribute("sessionRequestId",activityReportDto.getRequestId() );
			
			model.addAttribute("stateWiseCountListBody", activityReportDto.getFinalList());


		} catch (Exception e) {
			e.printStackTrace();
		}

		return "stateWiseCountReport";
		// return "redirect:/alertCountList";
	}
	
	@RequestMapping("/exportStateWiseAlerttest")
	public void exportStateWiseAlertTest(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request,
			HttpServletResponse response) throws JsonProcessingException {
		//System.out.println("IN WEB exportAlertActivityReport");

		
		StateWiseReportDto activityReportDto = new StateWiseReportDto();
		UserDto userDto = new UserDto();
		StateWiseExportDto stateWiseExport=new StateWiseExportDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
		
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			
			activityReportDto = objectMapper.readValue(requestString, StateWiseReportDto.class);
			
			activityReportDto.setRequestId(activityReportDto.getRequestId());

			//System.out.println(activityReportDto.getRequestId());
			respDto = commonUtility.objectToJson(activityReportDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchStateWiseCountList, respDto));
			activityReportDto = objectMapper.readValue(respString, StateWiseReportDto.class);
			
			//System.out.println(activityReportDto.getFinalList());

			for (StateWiseReportDto s : activityReportDto.getFinalList()) {

				stateWiseExport.setAlertStartDate(s.getAlertStartDate());
				stateWiseExport.setAlertEndDate(s.getAlertEndDate());
				stateWiseExport.setBranchState(s.getBranchState());

			}
			
			String dateAsString = new SimpleDateFormat("yyyyMMddHHmm").format(new Date());
			String fileName = "State_Wise_Alert_Report_" + dateAsString + ".xlsx";
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

			activityReportDto.setStateWiseExportDto(stateWiseExport);
			//System.out.println("activityReportDto: " + activityReportDto);
			StateWiseReportExport ativityReport = new StateWiseReportExport();
			ativityReport.stateWiseReportExport(response, activityReportDto);

		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();
		}

	}
	
	@RequestMapping("/fetchStateWiseStatus") // onclick of get report
	@ResponseBody
	public StateWiseReportDto fetchStateWiseStatus(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		StateWiseReportDto activityReport = new StateWiseReportDto();

		try {

			String pageValJson = request.getParameter("pageValJson");
			// System.out.println("pageValJson " + pageValJson);
			activityReport = objectMapper.readValue(pageValJson, StateWiseReportDto.class);

			activityReport.setRequestId(activityReport.getRequestId());
			// System.out.println(activityReport.getRequestId());
			respDto = commonUtility.objectToJson(activityReport);
			// System.out.println("respDto: "+respDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchStateWiseStatus, respDto));
			activityReport = objectMapper.readValue(respString, StateWiseReportDto.class);

			// System.out.println("activityReport " + activityReport);
			// System.out.println("Test::2");

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}

	@PostMapping(value = "/exportOfflineStateAlert")
	public void fileDownloadState(@ModelAttribute(name = "encryptedJson") EncryptedRequestDto encryptedRequest,
			HttpServletRequest request, HttpServletResponse response, @AuthenticationPrincipal User user)
			throws IOException {
		final ObjectMapper map = new ObjectMapper();

		StateWiseReportDto fileDto = new StateWiseReportDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			fileDto = map.readValue(requestString, StateWiseReportDto.class);

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
