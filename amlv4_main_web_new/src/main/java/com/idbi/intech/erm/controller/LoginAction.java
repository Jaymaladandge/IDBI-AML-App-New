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
import java.util.List;

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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.ProductMasterDto;
import com.idbi.intech.erm.domain.app.CodeMasterDto;
import com.idbi.intech.erm.domain.app.DashBoardDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.NotificationDto;
import com.idbi.intech.erm.domain.app.OfficeMasterDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;

/**
 * This controller is to handle login action and failure
 * 
 * @author arnoldanthony
 *
 */
@Controller
public class LoginAction {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;

	RequestResponseJsonDto respDto = null;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.viewDashBoardByOffice}")
	private String viewDashBoardByOffice;
	@Value("${app-url.fetchOfcByLevel}")
	private String fetchOfcByLevel;
	@Value("${app-url.viewDashBoard}")
	private String viewDashBoard;
	@Value("${app-url.closeNtf}")
	private String closeNtf;
	@Value("${app-url.getDeptAndOfficeCodeListByOfcType}")
	private String getDeptAndOfficeCodeListByOfcType;
	@Value("${app-url.viewInfoNotification}")
	private String viewInfoNotification;
	@Value("${app-url.sendInfoNotification}")
	private String sendInfoNotification;
	@Value("${app-url.viewFeedbackDashBoard}")
	private String viewFeedbackDashBoard;
	@Value("${app-url.getUserList}")
	private String getUserList;
	@Value("${app-url.fetchIsLandingPage}")
	private String fetchIsLandingPage;
	@Value("${app-url.fetchAlertList}")
	private String fetchAlertList;
	@Value("${app-url.fetchAlertCounts}")
	private String fetchAlertCounts;
	@Value("${app-url.getRMList}")
	private String getRMList;
	@Value("${app-url.checkTMRoles}")
	private String checkTMRoles;
	@Value("${app-url.validateSession}")
	private String validateSession;
	@Value("${app-url.viewRequesterDashBoard}")
	private String viewRequesterDashBoard;

	@Autowired
	private CommonUtility commonUtility;

	@Autowired
	ProductMasterDto productDto;

	@RequestMapping("/loginFailure")
	public String loginfailure(@ModelAttribute(name = "sourceId") String sourceId, @AuthenticationPrincipal User user,
			@ModelAttribute(name = "sourceName") String sourceName, RedirectAttributes redirectAttributes, Model model,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest) {

		return "redirect:/";

	}

	// Login Page After Selecting Office Type
	@RequestMapping(value = "/loginPage")
	public String loginPage(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			@RequestParam(value = "requestSource", required = false, defaultValue = "") String requestSource
			)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {

		String requestString = "";
		OfficeMasterDto ofcDto = new OfficeMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			// Encrypted JSON Request
		//	System.out.println("requestSource "+requestSource);
			if(requestSource.equalsIgnoreCase("lea")) {
				return "lealogin";
			}
			String encryRequest = encryptedRequest.getEncryptedJson();
			if (encryRequest == null) {
				String OfficeType = "";
				model.addAttribute("officesType", OfficeType);
				
			} else {
				requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
				ofcDto = objectMapper.readValue(requestString, OfficeMasterDto.class);
				model.addAttribute("officesType", ofcDto.getOfficeType());
				System.out.println(ofcDto.getOfficeType());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "login";
	}

	@RequestMapping(value = "/")
	public String welcome(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@ModelAttribute(name = "source") String source, Model model,
			@ModelAttribute(name = "sourceName") String sourceName)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException,
			NoSuchProviderException, InvalidAlgorithmParameterException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		CodeMasterDto codeDto = new CodeMasterDto();
		respDto = commonUtility.objectToJson(codeDto);
		final String responsString = commonUtility
				.decryptedResToString(commonUtility.webserviceConsume(uri + fetchIsLandingPage, respDto));
		codeDto = objectMapper.readValue(responsString, CodeMasterDto.class);
		String isladingPage = codeDto.getCodeValue();
		String returnPage = "";
		try {
			String messageText = "";
			String licenseText = "";

			if (isladingPage.equalsIgnoreCase("Login")) {
				returnPage = "pageBeforeLogin";
				model.addAttribute("productList", productDto.getConfigurations());

				if (null != sourceName && sourceName.equals("OFFICE MISMATCH")) {
					messageText = "Sorry You Have Selected Wrong Office";
				}
			} else if (isladingPage.equalsIgnoreCase("Login1")) {
				returnPage = "login";
			} else {
				returnPage = "pageBeforeLogin";
			}

			if (null != sourceName && sourceName.equals("OFFICE MISMATCH")) {
				messageText = "Sorry You Have Selected Wrong Office";
			}
			if (null != sourceName && sourceName.equals("Authentication failed")) {
				messageText = "Invalid User";
			}
			// Password Expired
			if (null != sourceName && sourceName.equals("Password Expired")) {
				messageText = "Sorry Your Password Expired";
			}
			if (null != sourceName && sourceName.equals("Office Not Present")) {
				messageText = "Office Not Present For Department";
			}
			if (null != sourceName && sourceName.equals("Role Not Present")) {
				messageText = "User Does Not Have Access. Kindly Contact System Administrator";
			}
			if (null != sourceName && sourceName.equals("Logout")) {
				messageText = "Logout";
			}
			if (null != sourceName && sourceName.equals("License Expiry")) {
				licenseText = "Your license is expired.";
				// messageText = "Your license is expired";
				model.addAttribute("licenseText", licenseText);
			}

			model.addAttribute("message", messageText);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return returnPage;
	}

	@RequestMapping("/logout")
	public String logout(HttpSession session) {
		session.removeAttribute("menuButtonData");
		session.removeAttribute("rolePosition");
		session.removeAttribute("moduleCode");
		session.invalidate();
		return "redirect:/";
	}

	@RequestMapping("/home")
	public String home(@ModelAttribute(name = "message") String message, @ModelAttribute(name = "source") String source,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			HttpSession session) {
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		DashBoardDto dashBoardDtoObj = new DashBoardDto();
		List<DashBoardDto> dashBoardDto = new ArrayList<>();
		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		UserDto userDtoObject = new UserDto();
		String returnString = "";
		try {
		
			userDto.setUserId(user.getUserId());
			userDtoObject.setUserSession(user.getUserSession());
			userDtoObject.setUserId(user.getUserId());
			userDto.setUserPosition(user.getUserPosition());
			if (userDto.getUserPosition() == null) {
				userDto.setUserPosition(user.getUserPosition());
			}
			userDto.setUserDept(user.getUserDept());
			userDto.setUserOfficeType(user.getUserOfficeType());
			userDto.setUserOffice(user.getUserOffice());
			if (user.getMenuMapList() != null) {
				userDto.setMenuMapList(user.getMenuMapList());
				session.setAttribute("menuButtonData", userDto.getMenuMapList());
			}
			userDto.setUserOfficeType(user.getUserOfficeType());
			userDto.setModuleCode(user.getModuleCode());

			if (user.getUserPosition().equalsIgnoreCase("Notification Closure")) {
				userDto.setOfficeCode("All");
			}
			userDto.setNtfStatus("open");

			if (null != sourceText && sourceText.equals("SENDALERT")) {
				messageText = "Alert Transfered Successfully";
			} else if (null != sourceText && sourceText.equals("ESCALATEUP")) {
				messageText = "Alert Escalate Up to Checker Successfully";
			} else if (null != sourceText && sourceText.equals("HOLD")) {
				messageText = "Alert Status Successfully Changes to HOlD";
			} else if (null != sourceText && sourceText.equals("CLOSEDALERT")) {
				messageText = "Alert Closed Successfully";
			} else if (null != sourceText && sourceText.equals("REJECTEDALERT")) {
				messageText = "Alert Has Been Re-Opened Successfully";
			}
			respDto = commonUtility.objectToJson(userDtoObject);

			String respString = "";

			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateSession, respDto));
			userDtoObject = objectMapper.readValue(respString, UserDto.class);
			if (userDtoObject.isLogin()) {
				respDto = commonUtility.objectToJson(userDto);

				if (user.getUserPosition().equalsIgnoreCase("FeedBack")) {
					respString = commonUtility.decryptedResToString(
							commonUtility.webserviceConsume(uri + viewFeedbackDashBoard, respDto));
					dashBoardDtoObj = objectMapper.readValue(respString, DashBoardDto.class);
					model.addAttribute("dashBoardList", dashBoardDtoObj.getDashBoardDto());
				}else {
				
					respString = commonUtility
							.decryptedResToString(commonUtility.webserviceConsume(uri + viewDashBoard, respDto));
					dashBoardDtoObj = objectMapper.readValue(respString, DashBoardDto.class);
					dashBoardDtoObj.setOfficeType(user.getUserOfficeType());
					dashBoardDtoObj.setFlg(true);
					dashBoardDto = fetchNotificationData(user, dashBoardDtoObj);
					respString = commonUtility
							.decryptedResToString(commonUtility.webserviceConsume(uri + checkTMRoles, respDto));
					UserDto userDtoObj = objectMapper.readValue(respString, UserDto.class);
					user.setRaiseStrFlg(userDtoObj.isRaiseStrFlg());
					user.setEscBackFlg(userDtoObj.isEscBackFlg());
					user.setTmRoleAction(userDtoObj.getTmRoleAction());
					model.addAttribute("dashBoardList", dashBoardDto);
					model.addAttribute("dashBoardCnt", dashBoardDtoObj);
					model.addAttribute("officeTypeList", dashBoardDtoObj.getOfficeList());
				}

				if (null != sourceText && sourceText.equals("APPROVEDUM")) {
					messageText = "User Master Create Request Approved Successfully";
				} else if (null != sourceText && sourceText.equals("REJECTEDUM")) {
					messageText = "User Master Create Request Rejected Successfully";
				} else if (null != sourceText && sourceText.equals("APPROVEEDITDUM")) {
					messageText = "User Master Edit Request Approved Successfully";
				} else if (null != sourceText && sourceText.equals("REJECTEDEDITUM")) {
					messageText = "User Master Edit Request Rejected Successfully";
				} else if (null != sourceText && sourceText.equals("APPROVEDRM")) {
					messageText = "Role Approved Successfully";
				} else if (null != sourceText && sourceText.equals("REJECTEDRM")) {
					messageText = "Role Rejected Successfully";
				} else if (null != sourceText && sourceText.equals("APPROVEDERM")) {
					messageText = "Role Edit Request Approved Successfully";
				} else if (null != sourceText && sourceText.equals("REJECTEDERM")) {
					messageText = "Role Edit Request Rejected Successfully";
				} else if (null != sourceText && sourceText.equals("APPROVEDPM")) {
					messageText = "App Parameter Create Request Approved Successfully";
				} else if (null != sourceText && sourceText.equals("REJECTEDPM")) {
					messageText = "App Parameter Create Request Rejected Successfully";
				} else if (null != sourceText && sourceText.equals("APPROVEEDITPM")) {
					messageText = "App Parameter Edit Request Approved Successfully";
				} else if (null != sourceText && sourceText.equals("REJECTEDEDITPM")) {
					messageText = "App Parameter Edit Request Rejected Successfully";
				} else if (null != sourceText && sourceText.equals("SWITCHOFC")) {
					messageText = "Office Changed Successfully";
				} else if (null != sourceText && sourceText.equals("Update Password")) {
					messageText = "Password Updated successfully";
				} else if (null != sourceText && sourceText.equals("CLOSENTF")) {
					messageText = "Notifaction Closed Successfully";
				} else if (null != sourceText && sourceText.equals("FEEDBACKCLOSE")) {
					messageText = "Feedback Closed Successfully";
				} else if (null != sourceText && sourceText.equals("FEEDBACKREJECT")) {
					messageText = "Feedback Rejected Successfully";
				} else if (null != sourceText && sourceText.equals("FEEDBACKESCALATE")) {
					messageText = "Feedback Escalate to Office Successfully";
				} else if (null != sourceText && sourceText.equals("Record Save")) {
					messageText = "Record Save";
				}
				else if (null != sourceText && sourceText.equals("APPROVELEA")) {
					messageText = "Enquiry Approved Successfully ";
				}else if (null != sourceText && sourceText.equals("REJECTLEA")) {
					messageText = "Enquiry Rejected Successfully";
				}
				else if (null != sourceText && sourceText.equals("ENRICH")) {
					messageText = "Enquiry Enriched Successfully";
				}

				else if (null != sourceText && sourceText.equals("ERROR")) {
					messageText = "Error Occured While Performing Action. Please Contact Your System Adminitrator";
				}
				model.addAttribute("message", messageText);
				model.addAttribute("userOffice", user.getUserOfficeType());
				if (user.getUserPosition().equalsIgnoreCase("FeedBack")) {
					return "requestQueue";
				}else if(user.getUserPosition().equalsIgnoreCase("Requester") || user.getUserPosition().equalsIgnoreCase("Enricher")) {
					model.addAttribute("userPosition",user.getUserPosition());
					return "leaViewPage";
				} 
				returnString = "home";
			} else {
				returnString = "multipleLogin";
			}
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return returnString;
	}

	@RequestMapping(value = "/viewDashBoardByOffice")
	@ResponseBody
	public List<DashBoardDto> viewDashBoardByOffice(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		DashBoardDto dashBoardDtoObj = new DashBoardDto();
		List<DashBoardDto> dashBoardDto = new ArrayList<>();

		try {
			String pageValJson = request.getParameter("pageValJson");
			dashBoardDtoObj = objectMapper.readValue(pageValJson, DashBoardDto.class);

			dashBoardDtoObj.setFlg(false);
			dashBoardDto = fetchNotificationData(user, dashBoardDtoObj);

		} catch (Exception e) {

			e.printStackTrace();
		}

		return dashBoardDto;
	}

	public List<DashBoardDto> fetchNotificationData(@AuthenticationPrincipal User user, DashBoardDto dashboardDtoObj)
			throws IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		List<DashBoardDto> alDto = new ArrayList<DashBoardDto>();
		DashBoardDto dashboardDto = new DashBoardDto();

		List<DashBoardDto> dashBoardDtoFilteredData = new ArrayList<DashBoardDto>();
		UserDto userDto = new UserDto();
		final String respString;
		try {

			userDto.setUserId(user.getUserId());
			userDto.setUserPosition(user.getUserPosition());
			userDto.setUserDept(user.getUserDept());
			userDto.setModuleCode(user.getModuleCode());
			userDto.setUserOfficeType(dashboardDtoObj.getOfficeType());
			if (user.getUserPosition().equalsIgnoreCase("Notification Closure")) {
				userDto.setNtfStatus(dashboardDtoObj.getNtfStatus());
			}

			respDto = commonUtility.objectToJson(userDto);

			if (Boolean.FALSE.equals(dashboardDtoObj.getFlg())) {

				respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + viewDashBoard, respDto));
				dashboardDto = objectMapper.readValue(respString, DashBoardDto.class);
			} else {

				dashboardDto = dashboardDtoObj;
			}

			alDto = dashboardDto.getDashBoardDto();

			alDto.stream().forEach(data -> {

				if (user.getUserOfficeType().toUpperCase().equalsIgnoreCase(data.getOfficeLevel().get("level1"))) {
					if (data.getOfficeType().equals(data.getOfficeLevel().get("level1"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level2"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level3"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level4"))) {

						dashBoardDtoFilteredData.add(data);
					}
				} else if (user.getUserOfficeType().toUpperCase()
						.equalsIgnoreCase(data.getOfficeLevel().get("level2"))) {
					if (data.getOfficeType().equals(data.getOfficeLevel().get("level2"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level3"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level4"))) {

						if (data.getOfficeId() != null) {
							if (data.getOfficeId().equals(user.getUserOffice())) {
								dashBoardDtoFilteredData.add(data);
							}
						}
					}

				} else if (user.getUserOfficeType().toUpperCase()
						.equalsIgnoreCase(data.getOfficeLevel().get("level3"))) {

					if (data.getOfficeType().equals(data.getOfficeLevel().get("level3"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level4"))) {
						if (data.getOfficeId() != null) {

							if (data.getOfficeId().equals(user.getUserOffice())) {
								dashBoardDtoFilteredData.add(data);
							}

						}

						// }
						// dashBoardDtoFilteredData.add(data);
					}

				} else if (user.getUserOfficeType().toUpperCase()
						.equalsIgnoreCase(data.getOfficeLevel().get("level4"))) {
					if (data.getOfficeType().equals(data.getOfficeLevel().get("level4"))) {
						if (data.getOfficeId() != null) {
							if (data.getOfficeId().equals(user.getUserOffice())) {
								dashBoardDtoFilteredData.add(data);
							}
						}
					}
				}
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return dashBoardDtoFilteredData;
	}

	@PostMapping("/ntfAction")
	public String closeNotificationList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, HttpSession session)
			throws JsonProcessingException {
		NotificationDto ntfDto = new NotificationDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		HttpHeaders resHeaders = null;
		ResponseEntity<String> apString = null;

		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			ntfDto = objectMapper.readValue(requestString, NotificationDto.class);
			ntfDto.setNtfCheckerId(user.getUserId());
			ntfDto.setNtfStatus("O");

			respDto = commonUtility.objectToJson(ntfDto);
			apString = commonUtility.webserviceConsume(uri + closeNtf, respDto);

			resHeaders = apString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "CLOSENTF");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}

		return "redirect:/home";

	}

	@RequestMapping(value = "/getDeptAndOfficeCodeByOfficeType")
	@ResponseBody
	public DashBoardDto getDeptAndOfficeCodeByOfficeType(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		DashBoardDto dashboardDto = new DashBoardDto();
		RequestResponseJsonDto respDto = null;
		try {
			String pageValJson = request.getParameter("pageValJson");
			dashboardDto = objectMapper.readValue(pageValJson, DashBoardDto.class);
			respDto = commonUtility.objectToJson(dashboardDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + getDeptAndOfficeCodeListByOfcType, respDto));

			dashboardDto = objectMapper.readValue(respString, DashBoardDto.class);

		} catch (Exception e) {

			e.printStackTrace();
		}

		return dashboardDto;
	}

	@PostMapping("/searchNtf")
	public String searchNtf(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes, HttpSession session)
			throws JsonProcessingException {

		final ObjectMapper objectMapper = new ObjectMapper();

		DashBoardDto dashBoardDtoObj = new DashBoardDto();
		List<DashBoardDto> dashBoardDto = new ArrayList<DashBoardDto>();
		UserDto userDto = new UserDto();
		String requestString = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			dashBoardDtoObj = objectMapper.readValue(requestString, DashBoardDto.class);
			userDto.setUserId(user.getUserId());

			userDto.setUserPosition(user.getUserPosition());

			if (userDto.getUserPosition() == null) {

				userDto.setUserPosition(user.getUserPosition());
			}
			userDto.setUserDept(dashBoardDtoObj.getDeptId());
			userDto.setUserOfficeType(dashBoardDtoObj.getOfficeType());

			userDto.setModuleCode(user.getModuleCode());
			if (user.getUserPosition().equalsIgnoreCase("Notification Closure")) {
				userDto.setOfficeCode(dashBoardDtoObj.getOfficeCode());
			}
			userDto.setNtfStatus("open");
			respDto = commonUtility.objectToJson(userDto);

			String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewDashBoard, respDto));
			dashBoardDtoObj = objectMapper.readValue(respString, DashBoardDto.class);
			dashBoardDtoObj.setOfficeType(user.getUserOfficeType());

			dashBoardDtoObj.setFlg(true);
			dashBoardDto = fetchNotificationCloseData(user, dashBoardDtoObj);

			model.addAttribute("dashBoardList", dashBoardDto);
			model.addAttribute("dashBoardCnt", dashBoardDtoObj);
			model.addAttribute("officeTypeList", dashBoardDtoObj.getOfficeList());

			model.addAttribute("openNtfCount", dashBoardDtoObj.getCloseNotificationStatusCount().get("open"));
			model.addAttribute("pendingVerficationNtfCount",
					dashBoardDtoObj.getCloseNotificationStatusCount().get("pendingVerification"));
			model.addAttribute("pendingApprovalNtfCount",
					dashBoardDtoObj.getCloseNotificationStatusCount().get("pendingApproval"));
			model.addAttribute("officeTypeTemp", userDto.getUserOfficeType().toLowerCase());
			model.addAttribute("deptIdTemp", userDto.getUserDept());
			model.addAttribute("officeCodeTemp", userDto.getOfficeCode());

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return "closeNotification";

	}

	@RequestMapping(value = "/getNtfClose")
	@ResponseBody
	public List<DashBoardDto> getNtfClose(HttpServletRequest request, Model model, @AuthenticationPrincipal User user)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();

		DashBoardDto dashBoardDtoObj = new DashBoardDto();
		List<DashBoardDto> dashBoardDto = new ArrayList<DashBoardDto>();

		try {
			String pageValJson = request.getParameter("pageValJson");
			dashBoardDtoObj = objectMapper.readValue(pageValJson, DashBoardDto.class);
			dashBoardDtoObj.setFlg(false);

			dashBoardDto = fetchNotificationCloseData(user, dashBoardDtoObj);

		} catch (Exception e) {

			e.printStackTrace();
		}

		return dashBoardDto;
	}

	public List<DashBoardDto> fetchNotificationCloseData(@AuthenticationPrincipal User user,
			DashBoardDto dashboardDtoObj) throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		List<DashBoardDto> alDto = new ArrayList<DashBoardDto>();
		DashBoardDto dashboardDto = new DashBoardDto();

		List<DashBoardDto> dashBoardDtoFilteredData = new ArrayList<DashBoardDto>();
		UserDto userDto = new UserDto();
		final String respString;
		try {
			userDto.setUserId(user.getUserId());
			userDto.setUserPosition(user.getUserPosition());
			userDto.setUserDept(dashboardDtoObj.getDeptId());
			userDto.setModuleCode(user.getModuleCode());
			userDto.setUserOfficeType(dashboardDtoObj.getOfficeType());
			userDto.setOfficeCode(dashboardDtoObj.getOfficeCode());
			if (user.getUserPosition().equalsIgnoreCase("Notification Closure")) {
				userDto.setNtfStatus(dashboardDtoObj.getNtfStatus());
			}
			respDto = commonUtility.objectToJson(userDto);
			if (!dashboardDtoObj.getFlg()) {
				respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + viewDashBoard, respDto));
				dashboardDto = objectMapper.readValue(respString, DashBoardDto.class);
			} else {

				dashboardDto = dashboardDtoObj;
			}
			alDto = dashboardDto.getDashBoardDto();
			alDto.stream().forEach(data -> {
				if (user.getUserOfficeType().toUpperCase().equals(data.getOfficeLevel().get("level1"))) {
					if (data.getOfficeType().equals(data.getOfficeLevel().get("level1"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level2"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level3"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level4"))) {

						dashBoardDtoFilteredData.add(data);
					}
				} else if (user.getUserOfficeType().toUpperCase().equals(data.getOfficeLevel().get("level2"))) {
					if (data.getOfficeType().equals(data.getOfficeLevel().get("level2"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level3"))
							|| data.getOfficeType().equals(data.getOfficeLevel().get("level4"))) {

						if (data.getOfficeId() != null) {
							if (data.getOfficeId().equals(user.getUserOffice())) {
								dashBoardDtoFilteredData.add(data);
							}
						}
					}
				} else if (user.getUserOfficeType().toUpperCase().equals(data.getOfficeLevel().get("level3"))) {
					if (data.getNotifyAllLevelModuleCode().contains(data.getModuleCode())) {
						if (data.getOfficeType().equals(data.getOfficeLevel().get("level3"))
								|| data.getOfficeType().equals(data.getOfficeLevel().get("level4")))
							if (data.getOfficeId() != null) {
								if (data.getOfficeId().equals(user.getUserOffice())) {
									dashBoardDtoFilteredData.add(data);
								}
							}
					}
				} else if (user.getUserOfficeType().toUpperCase().equals(data.getOfficeLevel().get("level4"))) {
					if (data.getNotifyAllLevelModuleCode().contains(data.getModuleCode())) {
						if (data.getOfficeType().equals(data.getOfficeLevel().get("level4")))
							if (data.getOfficeId() != null) {
								if (data.getOfficeId().equals(user.getUserOffice())) {
									dashBoardDtoFilteredData.add(data);
								}
							}
					}
				}

			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return dashBoardDtoFilteredData;
	}

	// getUserList
	@RequestMapping(value = "/getUserList")
	@ResponseBody
	public UserDto getUserList(@AuthenticationPrincipal User user, HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			userDto = objectMapper.readValue(pageValJson, UserDto.class);
			respDto = commonUtility.objectToJson(userDto);
			// send request for closing risk appetite
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getUserList, respDto));
			userDto = objectMapper.readValue(respString, UserDto.class);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return userDto;
	}

	@RequestMapping("/golive")
	public String golive(HttpSession session) {
		return "GoLive";

	}

	
	@RequestMapping("/redirectToMultipleLogin")
	public String redirectToMultipleLogin(HttpSession session) {
		return "multipleLogin";

	}
	
	
	

}
