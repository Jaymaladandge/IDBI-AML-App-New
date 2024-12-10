package com.idbi.intech.oms.controller;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.Date;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.DocumentMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;
import com.idbi.intech.oms.domain.app.ExemptionPageDto;

@Controller
public class ExemptionController {

	@Value("${app-url.uri}")
	private String uri;
	
	@Value("${app-url.fetchRuleidListData}")
	private String fetchRuleidListData;
	
	@Value("${app-url.fetchAccountNumberData}")
	private String fetchAccountNumberData;
	
	@Value("${app-url.createExemptionData}")
	private String createExemptionData;
	
	@Value("${app-url.fetchExemptionSummaryData}")
	private String fetchExemptionSummaryData;

	@Value("${app-url.fetchverifyformData}")
	private String fetchverifyformData;

	@Value("${app-url.approveformData}")
	private String approveData;
	
	@Value("${app-url.fetchrejectstatusData}")
	private String fetchrejectstatusData;
	
	@Value("${app-url.fetchuserData}")
	private String fetchuserData;

	@Value("${app-url.fetchdashboardData}")
	private String fetchdashboardData;



	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;
	
	@Autowired
	private CommonUtility commonUtility;

	RequestResponseJsonDto respDto = null;

     //To display drop-down rule-id list on load
	//main create page
	@RequestMapping("/exemptionmodule")
	public String exemptionModule(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {

		HttpHeaders resHeaders = null;
		ExemptionPageDto exemptionPageDto = new ExemptionPageDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String respString = "";
		try {
			exemptionPageDto.setCustId("fetch");
			respDto = commonUtility.objectToJson(exemptionPageDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRuleidListData, respDto));
			exemptionPageDto = objectMapper.readValue(respString, ExemptionPageDto.class);
			//for recordid
			exemptionPageDto.setRecordId(pkGenerator.getAppUserPrimaryKey());				
			model.addAttribute("DocPk", exemptionPageDto);
			model.addAttribute("ruleList", exemptionPageDto.getRuleList());
		 } catch (Exception e) 
		{
			e.printStackTrace();
		}

		return "ExemptionPage";
	}

//fetchAccountNumber
	@RequestMapping(value = "/fetchAccountNumberlist")
	@ResponseBody
	public ExemptionPageDto fetchAccountNumberslist(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		ExemptionPageDto exemptionPageDto = new ExemptionPageDto();

		try {
           
           
			String pageValJson = request.getParameter("pageValJson");
			exemptionPageDto = objectMapper.readValue(pageValJson, ExemptionPageDto.class);
			
			respDto = commonUtility.objectToJson(exemptionPageDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAccountNumberData, respDto));
			exemptionPageDto = objectMapper.readValue(respString, ExemptionPageDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return exemptionPageDto;
	}

	// For submit button (data goes to database to summarypage)
	@PostMapping("/createexemptionpage")
	public String createexemptionpage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes ,MultipartFile[] multipartFile)
		 throws JsonProcessingException {
		
		HttpHeaders resHeaders=null;
		
		ExemptionPageDto exemptionpageDto = new ExemptionPageDto();
		//to get json values
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;
		UserDto userDto = new UserDto();
		
		String requestString = "";
		String returnPage = "";
		try {
						
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			exemptionpageDto = objectMapper.readValue(requestString, ExemptionPageDto.class);// pass output class
			
			exemptionpageDto.setRecordId(pkGenerator.getAppPrimaryKey());			
			exemptionpageDto.setRecordId(exemptionpageDto.getRecordId());
			
			exemptionpageDto.setMakerId(user.getUserId());
			exemptionpageDto.setMakerTimestamp(new Date());
			exemptionpageDto.setRecordStatus("O");			
			userDto.setUserRole(user.getUserPosition());
			
			exemptionpageDto.setUserDto(userDto);
			respDto = commonUtility.objectToJson(exemptionpageDto);
			//apicall
			apString = commonUtility.webserviceConsume(uri + createExemptionData, respDto);
              
			
			resHeaders=apString.getHeaders();
			
		}
		catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
			
		}
		return "redirect:/viewdashboard";
	}
//summarypage
	@RequestMapping(value = "/exemptionsummary")
	public String exemptionsummary(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes, HttpSession session)
			throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		ExemptionPageDto exemptionPageDto = new ExemptionPageDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String respString = "";
		try {
			
			
			exemptionPageDto.setRecordStatus("V");
			

			exemptionPageDto.setDocSearchParam("All");
			respDto = commonUtility.objectToJson(exemptionPageDto);
           			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchExemptionSummaryData, respDto));
			exemptionPageDto = objectMapper.readValue(respString, ExemptionPageDto.class);
			
			model.addAttribute("userList", exemptionPageDto.getExemptionpageDtolist());
			System.out.println(exemptionPageDto.getExemptionpageDtolist());			
		} catch (Exception e)
		{
			e.printStackTrace();
		}

		return "Exemptionsummary";

	}

	@RequestMapping(value = "/summaryactionpage")
	public String summaryactionpage(@AuthenticationPrincipal User user, Model model,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		ExemptionPageDto exemptionPageDto = new ExemptionPageDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String respString = "";
		try {
            
			
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			exemptionPageDto = objectMapper.readValue(requestString, ExemptionPageDto.class);//dto mapping
             
			
			respDto = commonUtility.objectToJson(exemptionPageDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchverifyformData, respDto));
			exemptionPageDto = objectMapper.readValue(respString, ExemptionPageDto.class);

		 model.addAttribute("acctDetails", exemptionPageDto);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "verificationpage";
	}
	

	
	
	@RequestMapping("/approveformaction")
	public String approveformData(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes )
		 throws JsonProcessingException {
		
		HttpHeaders resHeaders=null;
		UserDto userDto = new UserDto();
		ExemptionPageDto exemptionpageDto = new ExemptionPageDto();
		//to get json values
		
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;
		
		String requestString = "";
		String returnPage = "";
		try {
			
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			exemptionpageDto = objectMapper.readValue(requestString, ExemptionPageDto.class);// pass output class
			
			exemptionpageDto.setRecordStatus("V");
			
			exemptionpageDto.setCheckerId(user.getUserId());
			exemptionpageDto.setCheckerTimestamp(new Date());
			exemptionpageDto.setActRoleId("SYSTEM ");
			
			userDto.setUserRole(user.getUserPosition());
			
			exemptionpageDto.setUserDto(userDto);
			respDto = commonUtility.objectToJson(exemptionpageDto);	
			apString = commonUtility.webserviceConsume(uri + approveData, respDto);          
			resHeaders = apString.getHeaders();		
		}
		catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		} 
		return "redirect:/viewdashboard";
	}	
	@PostMapping("/rejectformaction")
	public String fetchrejectstatus(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes )
		 throws JsonProcessingException
	{
		HttpHeaders resHeaders=null;
		UserDto userDto = new UserDto();
		ExemptionPageDto exemptionpageDto = new ExemptionPageDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;
		String requestString = "";
		String returnPage = "";
		try {
			
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			exemptionpageDto = objectMapper.readValue(requestString, ExemptionPageDto.class);// pass output class
			
			exemptionpageDto.setRecordStatus("R");
			
			exemptionpageDto.setActRoleId("SYSTEM ADMIN");
			
			userDto.setUserRole(user.getUserPosition());
			
			exemptionpageDto.setUserDto(userDto);
			respDto = commonUtility.objectToJson(exemptionpageDto);	
			apString = commonUtility.webserviceConsume(uri + fetchrejectstatusData, respDto);          
			resHeaders = apString.getHeaders();			
		    }
		catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		} 
		return "redirect:/viewdashboard";
		
	}
	
	@RequestMapping(value = "/viewdashboard")
	public String viewdashboard(@AuthenticationPrincipal User user, Model model,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		ExemptionPageDto exemptionPageDto = new ExemptionPageDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String respString = "";
		try {
			
			exemptionPageDto.setRecordStatus("O");		
			respDto = commonUtility.objectToJson(exemptionPageDto);
           
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchuserData, respDto));
			exemptionPageDto = objectMapper.readValue(respString, ExemptionPageDto.class);
			
			model.addAttribute("userList2", exemptionPageDto.getExemptionpageDtolist());
			
		} catch (Exception e)
		{
			e.printStackTrace();
		}
		
		return "viewexemptiondashboard";
	}
	
	@RequestMapping(value = "/dashboardpage")
	public String dashboardpage(@AuthenticationPrincipal User user, Model model,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		ExemptionPageDto exemptionPageDto = new ExemptionPageDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String respString = "";
		try {
            
			
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			exemptionPageDto = objectMapper.readValue(requestString, ExemptionPageDto.class);//dto mapping				
			respDto = commonUtility.objectToJson(exemptionPageDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchdashboardData, respDto));
			exemptionPageDto = objectMapper.readValue(respString, ExemptionPageDto.class);

		 model.addAttribute("acctDetail", exemptionPageDto);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "viewdatapage";
	}
	
	@RequestMapping(value = "/searchDocumentsList")
	@ResponseBody
	public String searchDocumentList(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		// Encrypted JSON Request
		ExemptionPageDto exemptionPageDto = new ExemptionPageDto();


		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		try {
			
			
			String pageValJson = request.getParameter("pageValJson");			
			exemptionPageDto = objectMapper.readValue(pageValJson, ExemptionPageDto.class);
			
			respDto = commonUtility.objectToJson(exemptionPageDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchExemptionSummaryData, respDto));
			exemptionPageDto = objectMapper.readValue(respString, ExemptionPageDto.class);
			
			
		 } catch (Exception e) 
		{
			e.printStackTrace();
		}

		return "ExemptionPage";
	}
	
	
}

