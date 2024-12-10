package com.idbi.intech.erm.controller;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Arrays;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.FeedbackDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class FeedbackController {
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	@Value("${app-url.uri}")
	private String uri;
	@Autowired
	private CommonUtility commonUtility;
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;
	@Value("${app-url.fetchFeedBackData}")
	private String fetchFeedBackData;
	@Value("${app-url.getFeedbackFilterData}")
	private String getFeedbackFilterData;

	RequestResponseJsonDto respDto = null;
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	@Value("${app-url.getDeptOfficeWiseFilterFeedback}")
	private String getDeptOfficeWiseFilterFeedback;
	@Value("${app-url.createFeedbackPage}")
	private String createFeedbackPage;
	@Value("${app-url.fetchFeedbackDataById}")
	private String fetchFeedbackDataById;
	@Value("${app-url.actionFeedbackPage}")
	private String actionFeedbackPage;
	@Value("${app-url.closeOrRejectFeedbackPage}")
	private String closeOrRejectFeedbackPage;
	@Value("${app-url.escalateFeedbackPage}")
	private String escalateFeedbackPage;
	
	@RequestMapping("/feedbackSummaryPage")
	public String feedbackSummary(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			HttpSession session) throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException,
			NoSuchPaddingException, CertificateException, KeyStoreException, IllegalBlockSizeException,
			BadPaddingException, NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		String sourceText = "";
		sourceText = source == null ? "" : source;

		String messageText = "";
		FeedbackDto feedbackDto=new FeedbackDto();
		boolean ermIdFlg = false;
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			UserDto userDto=new UserDto();
			userDto.setUserDept(user.getUserDept());
			userDto.setUserOffice(user.getUserOffice());
			userDto.setUserOfficeType(user.getSelectedOfficeType());
			userDto.setOfficeCode(user.getOfficeCode());
			userDto.setMakerId(user.getUserId());
			feedbackDto.setUserDto(userDto);
			feedbackDto.setSearchParam("ALL");
			respDto = commonUtility.objectToJson(feedbackDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchFeedBackData, respDto));
			feedbackDto=objectMapper.readValue(respString, FeedbackDto.class);
			model.addAttribute("feedbackDtoList", feedbackDto.getFeedbackDtoList());
			model.addAttribute("user", user);
			
		//	System.out.println("erm user test " + user.getErmTitle());
			if (null != sourceText && sourceText.equals("CREATE")) {
				messageText = "Feedback Created Successfully";
			} else if (null != sourceText && sourceText.equals("EDIT")) {
				messageText = "Feedback Modified Successfully";
			} else if (null != sourceText && sourceText.equals("ERROR")) {
				messageText = "Error occured in the request";
			}
			model.addAttribute("userRole", user.getUserPosition());
			
			String modulename = "SA";
			model.addAttribute("modulename", modulename);
			
			model.addAttribute("message", messageText);
			
			if (user.getUserDept().equalsIgnoreCase(userDto.getErmDeptId())) {
				ermIdFlg = true;
			}
			model.addAttribute("ermDeptFlg", ermIdFlg);
			
			

		} catch (Exception e) {
			// Logger needs to ADD
			e.printStackTrace();

		}
		return "feedbackSummary";
}
	@RequestMapping("/createFeedback")
	public String createUser(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		FeedbackDto feedbackDto=new FeedbackDto();
		boolean ermIdFlg = false;
		
		userDto.setDeptId(user.getUserDept());
		userDto.setUserOfficeType(user.getSelectedOfficeType());
		userDto.setUserOffice(user.getUserOffice());
		feedbackDto.setUserDto(userDto);
		feedbackDto.setFeedbackId(pkGenerator.getModulePrimaryKey("FDB"));
		model.addAttribute("userId", userDto.getUserId());
		model.addAttribute("recordStatus", "Create Feedback");
		respDto = commonUtility.objectToJson(feedbackDto);
		final String respString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + getFeedbackFilterData, respDto));
		feedbackDto=objectMapper.readValue(respString, FeedbackDto.class);
		
		model.addAttribute("userOffice", user.getSelectedOfficeType());
		model.addAttribute("officeNameList", feedbackDto.getOfficeNameList());
		model.addAttribute("userDept", user.getUserDeptName());
		model.addAttribute("feedbackId",feedbackDto.getFeedbackId());
		// model.addAttribute("userDeptId", user.getUserDept());
		model.addAttribute("user", user);
		
		if (user.getUserDept().equalsIgnoreCase(userDto.getErmDeptId())) {
			ermIdFlg = true;
		}
		model.addAttribute("ermDeptFlg", ermIdFlg);

		return "createFeedback";

	}
	
	@RequestMapping(value = "/DeptOfficeWiseFilterFeedback")
	@ResponseBody
	public FeedbackDto DeptOfficeWiseFilterFeedback(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		FeedbackDto feedbackDto=new FeedbackDto();

		
		try {
			String pageValJson = request.getParameter("pageValJson");
			feedbackDto=objectMapper.readValue(pageValJson, FeedbackDto.class);
			UserDto userDto=new UserDto();
			userDto.setUserDept(user.getUserDept());
			userDto.setUserRole(user.getUserPosition().toUpperCase());
			userDto.setUserOfficeType(user.getSelectedOfficeType());
			userDto.setUserOffice(user.getUserOffice());
			userDto.setMakerId(user.getUserId());
			feedbackDto.setUserDto(userDto);
			
			// riskDto.setOfficeId(user.getUserOffice());

			respDto = commonUtility.objectToJson(feedbackDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getDeptOfficeWiseFilterFeedback, respDto));
			feedbackDto = objectMapper.readValue(respString, FeedbackDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		

		return feedbackDto;
	}
	
	
	@PostMapping("/createfeedbackPage")
	public String createfeedBackPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		UserDto userDto = new UserDto();
		FeedbackDto feedbackDto=new FeedbackDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;
		String requestString = "";
		String returnPage = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
				
				feedbackDto=objectMapper.readValue(requestString, FeedbackDto.class);
				userDto.setUserActionName("create");
				userDto.setMakerId(user.getUserId().toUpperCase());
				userDto.setUserDept(user.getUserDept());
				userDto.setUserPosition(user.getUserPosition());
				userDto.setUserOffice(user.getUserOffice());
				userDto.setUserId(user.getUserId().toUpperCase());
				userDto.setUserOfficeType(user.getSelectedOfficeType());
				feedbackDto.setUserDto(userDto);
				

				feedbackDto.getFiledetails().stream().forEach(e -> {
					Arrays.asList(multipartFile).stream().forEach(file -> {
						if (e.getFileName().equals(file.getOriginalFilename())) {
							if(!e.getFileName().equalsIgnoreCase("No Data Available")) {
								commonUtility.uploadFile(file);
							}
							
						}
					});
				});

				respDto = commonUtility.objectToJson(feedbackDto);
				apString = commonUtility.webserviceConsume(uri + createFeedbackPage, respDto);
				
				resHeaders = apString.getHeaders();
			

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "CREATE");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/feedbackSummaryPage";

	}
	
	@RequestMapping("/viewFeedback")
	public String viewFeedback(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model,@ModelAttribute(name = "sourceName") String sourceName,
			@ModelAttribute(name = "sourceId") String sourceId)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		FeedbackDto feedbackDto=new FeedbackDto();
		FeedbackDto feedbackDto1=new FeedbackDto();

		boolean ermIdFlg = false;
		
		userDto.setDeptId(user.getUserDept());
		userDto.setUserOfficeType(user.getSelectedOfficeType());
		userDto.setUserOffice(user.getUserOffice());
		userDto.setUserDept(user.getUserDept());
		userDto.setMakerId(user.getUserId());
		userDto.setUserId(user.getUserId());
		feedbackDto.setUserDto(userDto);
		
		//feedbackDto.setOfficeId(sourceId.toUpperCase());
	feedbackDto.setOfficeTagId(sourceId.toUpperCase());
		model.addAttribute("userId", userDto.getUserId());
		model.addAttribute("recordStatus", "Create Feedback");
		respDto = commonUtility.objectToJson(feedbackDto);
		final String respString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + fetchFeedbackDataById, respDto));
		feedbackDto=objectMapper.readValue(respString, FeedbackDto.class);
		
		final String respString1 = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + getFeedbackFilterData, respDto));
		feedbackDto1=objectMapper.readValue(respString1, FeedbackDto.class);
		
		model.addAttribute("userOffice", user.getSelectedOfficeType());
		model.addAttribute("officeNameList", feedbackDto1.getOfficeNameList());
		model.addAttribute("userDept", user.getUserDeptName());
		//model.addAttribute("feedbackId",feedbackDto .getFeedbackId());
		model.addAttribute("feedbackDto",feedbackDto);
		// model.addAttribute("userDeptId", user.getUserDept());
		model.addAttribute("user", user);
		
		if (user.getUserDept().equalsIgnoreCase(userDto.getErmDeptId())) {
			ermIdFlg = true;
		}
		model.addAttribute("ermDeptFlg", ermIdFlg);

		return "viewFeedback";

	}
	
	@PostMapping("/actionfeedbackPage")
	public String actionfeedBackPage(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			@RequestParam("files[]") MultipartFile[] multipartFile) throws JsonProcessingException {
		HttpHeaders resHeaders = null;
		UserDto userDto = new UserDto();
		FeedbackDto feedbackDto=new FeedbackDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> apString = null;
		String requestString = "";
		String returnPage = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
				
				feedbackDto=objectMapper.readValue(requestString, FeedbackDto.class);
				userDto.setUserActionName("create");
				userDto.setMakerId(user.getUserId().toUpperCase());
				userDto.setUserDept(user.getUserDept());
				userDto.setUserPosition(user.getUserPosition());
				userDto.setUserOffice(user.getUserOffice());
				userDto.setUserId(user.getUserId().toUpperCase());
				userDto.setUserOfficeType(user.getSelectedOfficeType());
				userDto.setOfficeCode(user.getOfficeCode());
				feedbackDto.setUserDto(userDto);
				

				feedbackDto.getFiledetails().stream().forEach(e -> {
					Arrays.asList(multipartFile).stream().forEach(file -> {
						if (e.getFileName().equals(file.getOriginalFilename())) {
							if(!e.getFileName().equalsIgnoreCase("No Data Available")) {
								commonUtility.uploadFile(file);
							}
							
						}
					});
				});

				respDto = commonUtility.objectToJson(feedbackDto);
				if(feedbackDto.getRecordStatus()!=null) {
				if(feedbackDto.getRecordStatus()!=null && feedbackDto.getRecordStatus().equalsIgnoreCase("C") || feedbackDto.getRecordStatus().equalsIgnoreCase("R")) {
					apString = commonUtility.webserviceConsume(uri + closeOrRejectFeedbackPage, respDto);
				}
				else if(feedbackDto.getRecordStatus()!=null && feedbackDto.getRecordStatus().equalsIgnoreCase("E")) {
					apString = commonUtility.webserviceConsume(uri + escalateFeedbackPage, respDto);
				}
				}
				else {
					apString = commonUtility.webserviceConsume(uri + actionFeedbackPage, respDto);
					
				}
				
				
				resHeaders = apString.getHeaders();
			

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				if(feedbackDto.getRecordStatus()!=null) {
				 if(feedbackDto.getRecordStatus().equalsIgnoreCase("C")){
					 redirectAttributes.addFlashAttribute("source", "FEEDBACKCLOSE");
				 }
				 else if(feedbackDto.getRecordStatus().equalsIgnoreCase("R")){
					 redirectAttributes.addFlashAttribute("source", "FEEDBACKREJECT");
				 }
				 else if(feedbackDto.getRecordStatus().equalsIgnoreCase("E")){
					 redirectAttributes.addFlashAttribute("source", "FEEDBACKESCALATE");
				 }
				}
				 else{
					 redirectAttributes.addFlashAttribute("source", "FEEDBACKESCALATE");
				 }
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/home";

	}
	@RequestMapping("/searchFeedbackList")
	public String searchRaList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) {
		UserDto userDto = new UserDto();
		FeedbackDto feedbackDto=new FeedbackDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String messageText = "";

		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			feedbackDto = objectMapper.readValue(requestString, FeedbackDto.class);
			//UserDto userDto=new UserDto();
			userDto.setUserDept(user.getUserDept());
			userDto.setUserOffice(user.getUserOffice());
			userDto.setUserOfficeType(user.getSelectedOfficeType());
			userDto.setOfficeCode(user.getOfficeCode());
			userDto.setUserId(user.getUserId());
			feedbackDto.setUserDto(userDto);
			//feedbackDto.setSearchParam("test");
			respDto = commonUtility.objectToJson(feedbackDto);
			// Fetch Risk Appetite List
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchFeedBackData, respDto));
			feedbackDto = objectMapper.readValue(respString, FeedbackDto.class);
			
			model.addAttribute("userRole", user.getUserPosition());
			model.addAttribute("user", user);
			model.addAttribute("feedbackDtoList", feedbackDto.getFeedbackDtoList());
			//System.out.println("feedbackDtoList "+);
			
			String modulename = "SA";
			model.addAttribute("modulename", modulename);
			
			model.addAttribute("message", messageText);
			
			
			ArrayList<String> subMenuButtonList = commonUtility.getSubMenuBtnData(modulename, session);
			model.addAttribute("btnName", subMenuButtonList);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			// Logger needs to ADD
		}

		return "feedbackSummary";
	}

	

}
