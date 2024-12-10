package com.idbi.intech.aml.controller;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.Date;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
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
import com.idbi.intech.aml.domain.app.ActivityReportDto;
import com.idbi.intech.aml.domain.app.AlertDumpTableDto;
import com.idbi.intech.aml.domain.app.MisDto;
import com.idbi.intech.aml.domain.app.StrMisInsertReportBean;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class StrMisController {

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
	@Value("${app-url.fetchStrMisRequestList}")
	private String fetchStrMisRequestList;
	// saveStrRequest
	@Value("${app-url.saveStrRequest}")
	private String saveStrRequest;
	// showSTRReport
	@Value("${app-url.showSTRReport}")
	private String showSTRReport;

	RequestResponseJsonDto respDto = null;

	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;

	@RequestMapping("/fetchStrMisReport")
	public String fetchStrMisReport(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		MisDto misDto = new MisDto();
		misDto.setUserId(user.getUserId());
		try {
			misDto.setReportType("StrMisReport");
			respDto = commonUtility.objectToJson(misDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchStrMisRequestList, respDto));
			misDto = objectMapper.readValue(respString, MisDto.class);
			model.addAttribute("viewRequest", misDto.getViewRequestList());

		} catch (Exception e) {
			e.printStackTrace();
		}

		model.addAttribute("setTimeOut", misDto.getTime());
		model.addAttribute("sessionUserid", user.getUserId());
		model.addAttribute("sessionUserRole", user.getUserPosition());
		model.addAttribute("sessionUsername", user.getUsername());

		return "StrMisRequest";
	}

	@RequestMapping("/fetchUserReportList") // onclick of get report
	@ResponseBody
	public ActivityReportDto fetchUserReportList(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		MisDto misDto = new MisDto();
		ActivityReportDto activityReport = new ActivityReportDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			misDto = objectMapper.readValue(pageValJson, MisDto.class);

			misDto.setAlertStartDate(misDto.getAlertStartDate());
			misDto.setOmsUserId(user.getOmsUserPosition());
			misDto.setAlertEndDate(misDto.getAlertEndDate());
			misDto.setRequestedBy(misDto.getRequestedBy());
			misDto.setRequestParameters(pageValJson);
			misDto.setStatus("I");
			misDto.setRequestedTime(new Date().toString());
			misDto.setRequestId(misDto.getRequestId());
			misDto.setUserId(misDto.getUserId());
			misDto.setReportType("StrMisReport");
			respDto = commonUtility.objectToJson(misDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + saveStrRequest, respDto));
			misDto = objectMapper.readValue(respString, MisDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return activityReport;

	}

	// showSTRReport
	@PostMapping("/showSTRReport") // inital
	public String showSTRReport(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {

		final ObjectMapper objectMapper = new ObjectMapper();
		AlertDumpTableDto activityReportDto = new AlertDumpTableDto();
		StrMisInsertReportBean strMisInsertReportBean = new StrMisInsertReportBean();
		String requestString = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			activityReportDto = objectMapper.readValue(requestString, AlertDumpTableDto.class);
			activityReportDto.setRequestId(activityReportDto.getRequestId());

			respDto = commonUtility.objectToJson(activityReportDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + showSTRReport, respDto));
			strMisInsertReportBean = objectMapper.readValue(respString, StrMisInsertReportBean.class);

			model.addAttribute("sessionRequestId", activityReportDto.getRequestId());

			System.out.println("strMisInsertReportBean " + strMisInsertReportBean);
			model.addAttribute("alertCountListBody", strMisInsertReportBean);
			model.addAttribute("requestId", activityReportDto.getRequestId());

			model.addAttribute("startDate", activityReportDto.getStartDate());
			model.addAttribute("endDate", activityReportDto.getEndDate());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "strMisReportPage";
		// return "redirect:/alertCountList";
	}

}
