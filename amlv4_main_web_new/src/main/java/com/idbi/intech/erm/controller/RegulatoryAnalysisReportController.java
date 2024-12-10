package com.idbi.intech.erm.controller;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.MisDto;
import com.idbi.intech.aml.domain.app.RegReportAnalysisDto;
import com.idbi.intech.aml.domain.app.RegReportAnalysisFinalDto;
import com.idbi.intech.aml.domain.app.RegReportMasterDto;
import com.idbi.intech.aml.domain.app.RequestReportDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;
import com.idbi.intech.oms.domain.app.OmsAlertMasterDto;

@Controller
public class RegulatoryAnalysisReportController {
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.RequestReport}")
	private String RequestReport;

	@Value("${app-url.RequestMonth}")
	private String RequestMonth;

	@Value("${app-url.fetchreports}")
	private String fetchreports;

	@Value("${app-url.fetchViewReport}")
	private String fetchViewReport;

	@Value("${app-url.fetchGeneratedData}")
	private String fetchGeneratedData;

	RequestResponseJsonDto respDto = null;
	/* CommonUtility commonUtility = new CommonUtility(); */
	
	
	  @Autowired
	  private CommonUtility commonUtility;
	 

	@GetMapping("/regAnalysisReport") // inital
	public String fetchUserList(@AuthenticationPrincipal User user, Model model) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		System.out.println("in requestreport");
		// System.out.println("in fetchUserReport");
		UserDto userObj = new UserDto();
		// System.out.println(user.getUserId());
		/* MisDto misDto = new MisDto(); */
		
		
		// System.out.println(misDto.getUserId());
		
			RequestReportDto dto = new RequestReportDto();
			dto.setUser(user.getUsername());
			dto.setUserPosition(user.getUserPosition());
			System.out.println("position" + dto.getUserPosition());
			dto.setStatus("I");
			try {
			// System.out.println("alert");
			respDto = commonUtility.objectToJson(dto);
			
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchViewReport, respDto));
			dto = objectMapper.readValue(respString, RequestReportDto.class);
			// System.out.println("activityReportDto: " + activityReportDto);

			model.addAttribute("viewRequest", dto.getDtoList());

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "regulatoryAnalysisReport";
	}

	@RequestMapping("/fetch")
	@ResponseBody
	public RequestReportDto fetchYear(HttpServletRequest request, Model model, @AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		System.out.println("in frntend");
		RequestReportDto dto = new RequestReportDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			dto = objectMapper.readValue(pageValJson, RequestReportDto.class);
			respDto = commonUtility.objectToJson(dto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + RequestReport, respDto));
			dto = objectMapper.readValue(respString, RequestReportDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return dto;

	}

	@RequestMapping(value = "/fetchMonth")
	@ResponseBody
	public RequestReportDto fetchMonth(HttpServletRequest request, Model model, @AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		System.out.println("in frntend for month");
		RequestReportDto dto = new RequestReportDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			dto = objectMapper.readValue(pageValJson, RequestReportDto.class);
			respDto = commonUtility.objectToJson(dto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + RequestMonth, respDto));
			dto = objectMapper.readValue(respString, RequestReportDto.class);
			System.out.println("Month" + dto.getMonthList());
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return dto;

	}

	@RequestMapping(value = "/fetchReports")
	@ResponseBody
	public RequestReportDto fetchReport(HttpServletRequest request, Model model, @AuthenticationPrincipal User user) {
		System.out.println("in fetchReports controller");
		final ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		RequestReportDto dto = new RequestReportDto();
		try {

			System.out.println("in try catch block");
			String pageValJson = request.getParameter("pageValJson");
			System.out.println("pageValJson:" + pageValJson);
			dto = objectMapper.readValue(pageValJson, RequestReportDto.class);
			dto.setUser(user.getUsername());
			System.out.println("username:" + dto.getUser());
			dto.setUserPosition(user.getUserPosition());
			System.out.println("position" + dto.getUserPosition());
			dto.setStatus("I");
			/* dto.setView(dto.getStatus()); */
			System.out.println(dto.getRequestId());

			System.out.println("Month" + dto.getMonth());
			respDto = commonUtility.objectToJson(dto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchreports, respDto));
			dto = objectMapper.readValue(respString, RequestReportDto.class);
			List<RequestReportDto> list = dto.getDtoList();
			if (list == null) {
				// List is null
				System.out.println("List is null");
			} else if (list.isEmpty()) {
				// List is empty
				System.out.println("List is empty");
			} else {
				// List is populated
				System.out.println("List is populated");
			}

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return dto;

	}

	@PostMapping("/fetchgenerateddata") // inital
	public String fetchDataGenerated(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// System.out.println("in fetchUserReport");
		UserDto userObj = new UserDto();
		// System.out.println(user.getUserId());
		/* MisDto misDto = new MisDto(); */
		RequestReportDto dto = new RequestReportDto();
		RegReportMasterDto mainDto = new RegReportMasterDto();
		/*
		 * dto.setUser(user.getUsername()); dto.setUserPosition(user.getUserPosition());
		 * System.out.println("position"+dto.getUserPosition()); dto.setStatus("I");
		 */
		// System.out.println(misDto.getUserId());
		String requestString = "";
		try {
			// System.out.println("alert");

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			dto = objectMapper.readValue(requestString, RequestReportDto.class);
			respDto = commonUtility.objectToJson(dto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchGeneratedData, respDto));
			mainDto = objectMapper.readValue(respString, RegReportMasterDto.class);
			// System.out.println("activityReportDto: " + activityReportDto);
			// System.out.println("regAnalysisFinal"+mainDto.getRegReportFinal().toString()):
			System.out.println("after rrecieving dto");
			List<RegReportAnalysisDto> regReportList = mainDto.getRegReportList();
			List<RegReportAnalysisFinalDto> regReportList2 = mainDto.getRegReportFinalList();
			for (RegReportAnalysisFinalDto dto1 : regReportList2) {
				System.out.println(dto1.getReportType());
				System.out.println(dto1.getRequestId());
				System.out.println(dto1.getThreshold());
			}
			model.addAttribute("reportType", dto.getReportType());
			model.addAttribute("month", dto.getMonth());
			model.addAttribute("year", dto.getYear());
			model.addAttribute("regAnalysisFinal", mainDto.getRegReportFinalList());
			model.addAttribute("regAnalysis", mainDto.getRegReportList());
			System.out.println("after adding model dto");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "reportFile";
	}
}
