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
import com.idbi.intech.aml.domain.app.ActivityReportDto;
import com.idbi.intech.aml.domain.app.RegReportDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class RegulatoryReportController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchFiltersForRegReport}")
	private String fetchFiltersForRegReport;
	@Value("${app-url.fetchRegReportYearData}")
	private String fetchRegReportYearData;
	@Value("${app-url.fetchRegReportMonthData}")
	private String fetchRegReportMonthData;
	@Value("${app-url.fetchRegReportDtlsList}")
	private String fetchRegReportDtlsList;
	@Value("${app-url.saveRegReportRequest}")
	private String saveRegReportRequest;
	@Value("${app-url.fetchReportDtlList}")
	private String fetchReportDtlList;
	@Value("${file-location.unprocessedFilePath}")
	private String unprocessedFilePath;
	

	RequestResponseJsonDto respDto = null;

	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;
	@Autowired
	private CommonUtility commonUtility;
	
	
	
	@RequestMapping("/fetchRegReport") // inital
	public String fetchRegulatoryReportList(@AuthenticationPrincipal User user, Model model, HttpSession session)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		// System.out.println("in fetchUserReport");
		// System.out.println(user.getUserId());
		RegReportDto regReportDto = new RegReportDto();

		// System.out.println(misDto.getUserId());
		try {
			// System.out.println("alert");
			respDto = commonUtility.objectToJson(regReportDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchFiltersForRegReport, respDto));
			regReportDto = objectMapper.readValue(respString, RegReportDto.class);

			model.addAttribute("reqReportList", regReportDto.getRegReportList());
			model.addAttribute("reportTypeList", regReportDto.getReportTypeList());
			model.addAttribute("sessionUserid", user.getUserId());
			model.addAttribute("sessionUserRole", user.getUserPosition());
			model.addAttribute("sessionUsername", user.getUsername());
			model.addAttribute("reqIdGenerated", pkGenerator.getModulePrimaryKey("RQE"));
			
			

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "RegulatoryReportPage";	
		
	}	
	
	//fetchRegReportYearList	

		@RequestMapping("/fetchRegReportYearList") // onclick of get report
		@ResponseBody
		public RegReportDto fetchRegReportYearList(@AuthenticationPrincipal User user, Model model, HttpSession session,
				HttpServletRequest request) throws JsonProcessingException {
			final ObjectMapper objectMapper = new ObjectMapper();
			// System.out.println("fetchUserReportN");
			UserDto userObj = new UserDto();

			// System.out.println(user.getOmsUserPosition());
			RegReportDto regReportDto = new RegReportDto();

			try {
				String pageValJson = request.getParameter("pageValJson");
				regReportDto = objectMapper.readValue(pageValJson, RegReportDto.class);

				respDto = commonUtility.objectToJson(regReportDto);

				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRegReportYearData, respDto));
				regReportDto = objectMapper.readValue(respString, RegReportDto.class);

			} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
					| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
					| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
				e.printStackTrace();
			}

			return regReportDto;

		}

	//fetchRegReportMonthList	

		@RequestMapping("/fetchRegReportMonthList") // onclick of get report
		@ResponseBody
		public RegReportDto fetchRegReportMonthList(@AuthenticationPrincipal User user, Model model, HttpSession session,
				HttpServletRequest request) throws JsonProcessingException {
			final ObjectMapper objectMapper = new ObjectMapper();
			UserDto userObj = new UserDto();

			RegReportDto regReportDto = new RegReportDto();

			try {
				String pageValJson = request.getParameter("pageValJson");
				regReportDto = objectMapper.readValue(pageValJson, RegReportDto.class);

				respDto = commonUtility.objectToJson(regReportDto);

				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRegReportMonthData, respDto));
				regReportDto = objectMapper.readValue(respString, RegReportDto.class);

			} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
					| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
					| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
				e.printStackTrace();
			}

			return regReportDto;

		}

	//fetchRegReportDetailedData
		@RequestMapping("/fetchRegReportDetailedData") // onclick of get report
		@ResponseBody
		public RegReportDto fetchRegReportData(@AuthenticationPrincipal User user, Model model, HttpSession session,
				HttpServletRequest request) throws JsonProcessingException {
			final ObjectMapper objectMapper = new ObjectMapper();
			UserDto userObj = new UserDto();

			RegReportDto regReportDto = new RegReportDto();

			try {
				String pageValJson = request.getParameter("pageValJson");
				regReportDto = objectMapper.readValue(pageValJson, RegReportDto.class);

				respDto = commonUtility.objectToJson(regReportDto);

				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRegReportDtlsList, respDto));
				regReportDto = objectMapper.readValue(respString, RegReportDto.class);

			} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
					| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
					| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
				e.printStackTrace();
			}

			return regReportDto;

		}

	//fetchRegReportDtlList	
		@RequestMapping("/fetchReportDtl") // onclick of get report
		@ResponseBody
		public RegReportDto fetchRegReportDtl(@AuthenticationPrincipal User user, Model model, HttpSession session,
				HttpServletRequest request) throws JsonProcessingException {
			final ObjectMapper objectMapper = new ObjectMapper();
			UserDto userObj = new UserDto();

			RegReportDto regReportDto = new RegReportDto();

			try {
				String pageValJson = request.getParameter("pageValJson");
				regReportDto = objectMapper.readValue(pageValJson, RegReportDto.class);

				respDto = commonUtility.objectToJson(regReportDto);

				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchReportDtlList, respDto));
				regReportDto = objectMapper.readValue(respString, RegReportDto.class);

			} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
					| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
					| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
				e.printStackTrace();
			}

			return regReportDto;

		}	
		
		
	//reportActionURLSAVING TO REPORT ALERT REQUEST MASTER

		@RequestMapping("/regReportAction")
		@ResponseBody
		public RegReportDto reportActionData(@AuthenticationPrincipal User user, Model model, HttpSession session,
				HttpServletRequest request) throws JsonProcessingException {
			final ObjectMapper objectMapper = new ObjectMapper();
			UserDto userObj = new UserDto();
			RegReportDto regReportDto = new RegReportDto();
			
			try {
				// System.out.println("alert");
				String pageValJson = request.getParameter("pageValJson");
				//requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
				regReportDto = objectMapper.readValue(pageValJson, RegReportDto.class);
				userObj.setUserId(user.getUserId());
				userObj.setUserRole(user.getUserPosition());
				userObj.setUsername(user.getUsername().toUpperCase());
				regReportDto.setUserObj(userObj);
				respDto = commonUtility.objectToJson(regReportDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + saveRegReportRequest, respDto));
				regReportDto = objectMapper.readValue(respString, RegReportDto.class);


			} catch (Exception e) {
				e.printStackTrace();
			}

			return regReportDto;

		}
		
//exportRegulatoryReport
		
		@PostMapping(value = "/exportRegulatoryReport")
		public void fileDownloadActivity(@ModelAttribute(name = "encryptedJson") EncryptedRequestDto encryptedRequest,
				HttpServletRequest request, HttpServletResponse response, @AuthenticationPrincipal User user)
				throws IOException {
			final ObjectMapper map = new ObjectMapper();

			RegReportDto fileDto = new RegReportDto();
			String requestString = "";
			try {

				requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
				fileDto = map.readValue(requestString, RegReportDto.class);

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
