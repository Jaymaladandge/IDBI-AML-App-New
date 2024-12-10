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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.AccountFreezeDtlsDto;
import com.idbi.intech.aml.domain.app.AccountMasterDto;
import com.idbi.intech.aml.domain.app.AlertMasterDto;
import com.idbi.intech.aml.domain.app.AlertSummaryTabDto;
import com.idbi.intech.aml.domain.app.CustomerDto;
import com.idbi.intech.aml.domain.app.DmatClientDto;
import com.idbi.intech.aml.domain.app.EmailDetailsDto;
import com.idbi.intech.aml.domain.app.RuleMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;
import com.idbi.intech.oms.domain.app.AccountStatementDto;

@Controller
public class AlertInvestigationController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	// CommonUtility Object
	@Autowired
	private CommonUtility commonUtility;

	@Value("${app-url.uri}")
	private String uri;
	RequestResponseJsonDto respDto = null;
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	@Value("${app-url.fetchAMLAlertList}")
	private String fetchAMLAlertList;
	@Value("${app-url.fetchAMLAlertData}")
	private String fetchAMLAlertData;
	@Value("${app-url.viewRuleModel}")
	private String viewRuleModel;
	@Value("${app-url.alertCompliance}")
	private String alertCompliance;
	@Value("${app-url.checkTMRoles}")
	private String checkTMRoles;
	@Value("${app-url.fetchALertComments}")
	private String fetchALertComments;
	@Value("${app-url.fetchTranDetails}")
	private String fetchTranDetails;
	@Value("${app-url.fetchRelatedPersonDetails}")
	private String fetchRelatedPersonDetails;
	@Value("${app-url.fetchALertDataForModel}")
	private String fetchALertDataForModel;
	@Value("${app-url.getAcStatementFilterWise}")
	private String getAcStatementFilterWise;
	@Value("${app-url.viewCustomerDetails}")
	private String viewCustomerDetails;
	@Value("${app-url.getAccountList}")
	private String getAccountList;
	@Value("${app-url.fetchSummaryAlertList}")
	private String fetchSummaryAlertList;
	@Value("${app-url.fetchAlertSummaryData}")
	private String fetchAlertSummaryData;
	@Value("${app-url.sendMail}")
	private String sendMail;
	@Value("${app-url.validateSession}")
	private String validateSession;
	@Value("${app-url.getLedgerStmtFilterWise}")
	private String getLedgerStmtFilterWise;
	@Value("${app-url.context-path}")
	private String contextPath;
	@Value("${app-url.viewFreezeStatusModel}")
	private String viewFreezeStatusModel;

	@RequestMapping("/fetchAlertListOld")
	public String fetchAlertList(@AuthenticationPrincipal User user, Model model,
			@ModelAttribute(name = "source") String source, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			UserDto userObj = new UserDto();
			userObj.setUserRole(user.getUserPosition());
			userObj.setUserId(user.getUserId());
			String aggFlg = (String) session.getAttribute("alertAggFlg");
			String alertStatus = (String) session.getAttribute("alertStatus");
			if (aggFlg == null) {
				user.setAlertAggFlg("U");
				if (user.getUserPosition().equalsIgnoreCase("Analyst")) {
					user.setAlertStatus("O");
				} else {
					user.setAlertStatus("U");
				}
			} else {
				user.setAlertAggFlg(aggFlg);
				user.setAlertStatus(alertStatus);
			}
			if (source != null) {
				model.addAttribute("msg", source);
			} else {
				model.addAttribute("msg", "success");
			}
			userObj.setAlertAggFlg(user.getAlertAggFlg());
			userObj.setAlertStatus(user.getAlertStatus());
			respDto = commonUtility.objectToJson(userObj);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAMLAlertList, respDto));
			AlertMasterDto alertMasterDto = objectMapper.readValue(respString, AlertMasterDto.class);

			model.addAttribute("alertList", alertMasterDto.getAlertList());
			model.addAttribute("filterStatus", user.getAlertStatus());
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return "checkAlert";
	}

	@RequestMapping("/fetchAlertDtls")
	public String fetchAlertDtls(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, Model model)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		AlertMasterDto alertMasterDto = new AlertMasterDto();
		UserDto userDto = new UserDto();
		String returnString = "";
		UserDto userDtoObject = new UserDto();
		try {
			userDtoObject.setUserSession(user.getUserSession());
			userDtoObject.setUserId(user.getUserId());
			respDto = commonUtility.objectToJson(userDtoObject);
			String responseString = "";
			responseString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateSession, respDto));
			userDtoObject = objectMapper.readValue(responseString, UserDto.class);
			if (userDtoObject.isLogin()) {
				requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
				alertMasterDto = objectMapper.readValue(requestString, AlertMasterDto.class);
				alertMasterDto.setUserRole(user.getUserPosition());
				alertMasterDto.setUserId(user.getUserId());
				alertMasterDto.setUserMobile(user.getUserMobile());
				alertMasterDto.setUserPosition(user.getOmsUserPosition());
				alertMasterDto.setUserName(user.getUsername());
				alertMasterDto.setChannelId(user.getChannelId());
				respDto = commonUtility.objectToJson(alertMasterDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAMLAlertData, respDto));
				alertMasterDto = objectMapper.readValue(respString, AlertMasterDto.class);
				if (alertMasterDto.getAlertLockFlg().equals("H")) {
					redirectAttributes.addFlashAttribute("source",
							"Alert Is Already Opened By " + alertMasterDto.getLockId());
					returnString = "redirect:/fetchAlertList";
				} else if (alertMasterDto.getAlertLockFlg().equals("Y")) {
					redirectAttributes.addFlashAttribute("source", "Alert Is Already Attended By Other User");
					returnString = "redirect:/fetchAlertList";
				} else {
					model.addAttribute("alertData", alertMasterDto);
					model.addAttribute("alertStatus", user.getAlertStatus());
					userDto.setRaiseStrFlg(user.isRaiseStrFlg());
					userDto.setEscBackFlg(user.isEscBackFlg());
					userDto.setUserEmail(user.getUserEmail());
					userDto.setUsername(user.getUsername());
					userDto.setMailContent(alertMasterDto.getMailContent());
					userDto.setEddDto(user.getEddDto());
					String mailCc="amlcell@idbi.co.in";
					model.addAttribute("userDto", userDto);
					model.addAttribute("mailcc",mailCc);
					// respDto = commonUtility.objectToJson(alertMasterDto);
					// final String respString1 =
					// commonUtility.decryptedResToString(commonUtility.webserviceConsume(uri +
					// fetchALertComments, respDto));
					// alertMasterDto = objectMapper.readValue(respString1, AlertMasterDto.class);
					model.addAttribute("commentData", alertMasterDto.getAlertCommentList());
					returnString = "alertInvestigatePage";
				}
			} else {
				returnString = "multipleLogin";
			}
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return returnString;
	}

	@RequestMapping(value = "/RuleViewModel")
	@ResponseBody
	public RuleMasterDto ruleListViewModel(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		RuleMasterDto ruleMasterDto = new RuleMasterDto();
		try {

			String pageValJson = request.getParameter("pageValJson");
			ruleMasterDto = objectMapper.readValue(pageValJson, RuleMasterDto.class);
			ruleMasterDto.setChannelId(user.getChannelId());
			respDto = commonUtility.objectToJson(ruleMasterDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewRuleModel, respDto));
			ruleMasterDto = objectMapper.readValue(respString, RuleMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return ruleMasterDto;
	}

	//
	@PostMapping("/alertCompliance")
	public String alertCompliance(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {
		AlertMasterDto alertMasterDto = new AlertMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String returnString = "";
		UserDto userDto = new UserDto();
		UserDto userDtoObject = new UserDto();
		try {
			// Encrypted JSON Request
			userDtoObject.setUserSession(user.getUserSession());
			userDtoObject.setUserId(user.getUserId());
			respDto = commonUtility.objectToJson(userDtoObject);
			String responseString = "";
			responseString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateSession, respDto));
			userDtoObject = objectMapper.readValue(responseString, UserDto.class);
			if (userDtoObject.isLogin()) {
				requestString = encryptedRequest.getEncryptedJson();
				alertMasterDto = objectMapper.readValue(requestString, AlertMasterDto.class);
				alertMasterDto.setUserRole(user.getUserPosition());
				alertMasterDto.setUserId(user.getUserId());
				alertMasterDto.setFilterAggFlg(user.getAlertAggFlg());
				alertMasterDto.setFilterAlertStatus(user.getAlertStatus());
				alertMasterDto.setChannelId(user.getChannelId());
				respDto = commonUtility.objectToJson(alertMasterDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + alertCompliance, respDto));
				alertMasterDto = objectMapper.readValue(respString, AlertMasterDto.class);
				if (alertMasterDto.isAlertPresentFlg()) {
					alertMasterDto.setUserRole(user.getUserPosition());
					alertMasterDto.setUserId(user.getUserId());
					alertMasterDto.setUserMobile(user.getUserMobile());
					alertMasterDto.setUserPosition(user.getOmsUserPosition());
					alertMasterDto.setUserName(user.getUsername());
					alertMasterDto.setChannelId(user.getChannelId());
					respDto = commonUtility.objectToJson(alertMasterDto);
					final String response = commonUtility
							.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAMLAlertData, respDto));
					alertMasterDto = objectMapper.readValue(response, AlertMasterDto.class);
					model.addAttribute("alertData", alertMasterDto);
					model.addAttribute("alertStatus", user.getAlertStatus());
					model.addAttribute("filterStatus", user.getAlertStatus());
					userDto.setRaiseStrFlg(user.isRaiseStrFlg());
					userDto.setEddDto(user.getEddDto());
					userDto.setEscBackFlg(user.isEscBackFlg());
					model.addAttribute("userDto", userDto);
					model.addAttribute("commentData", alertMasterDto.getAlertCommentList());
					returnString = "alertInvestigatePage";
				} else {
					returnString = "redirect:/fetchAlertList";
				}
			} else {
				returnString = "multipleLogin";
			}
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException | NullPointerException e) {
			e.printStackTrace();
		}
		return returnString;

	}

	/* FetchALertListBasedOnFilters */
	@RequestMapping("/filterAlertList")
	public String filterAlertList(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		UserDto userObj = new UserDto();
		String returnString = "";
		UserDto userDtoObject = new UserDto();
		try {
			userDtoObject.setUserSession(user.getUserSession());
			userDtoObject.setUserId(user.getUserId());
			respDto = commonUtility.objectToJson(userDtoObject);
			String responseString = "";
			responseString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateSession, respDto));
			userDtoObject = objectMapper.readValue(responseString, UserDto.class);
			if (userDtoObject.isLogin()) {
				if (encryptedRequest.getEncryptedJson() != null) {
					requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
					userObj = objectMapper.readValue(requestString, UserDto.class);
				}
				userObj.setUserRole(user.getUserPosition());
				userObj.setUserId(user.getUserId());
				userObj.setChannelId(user.getChannelId());
				userObj.setChannelCode(user.getChannelCode());
				respDto = commonUtility.objectToJson(userObj);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAMLAlertList, respDto));
				AlertMasterDto alertMasterDto = objectMapper.readValue(respString, AlertMasterDto.class);
				session.setAttribute("alertStatus", userObj.getAlertStatus());
				model.addAttribute("filterStatus", userObj.getAlertStatus());
				session.setAttribute("alertAggFlg", userObj.getAlertAggFlg());
				model.addAttribute("alertList", alertMasterDto.getAlertList());
				user.setAlertAggFlg(userObj.getAlertAggFlg());
				user.setAlertStatus(userObj.getAlertStatus());
				returnString = "checkAlert";
			} else {
				returnString = "multipleLogin";
			}
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException |

				IOException e) {
			e.printStackTrace();
		}
		return returnString;
	}

	@RequestMapping("/fetchTransactionDetails")
	@ResponseBody
	public AccountMasterDto fetchTransactionDetails(@AuthenticationPrincipal User user,
			RedirectAttributes redirectAttributes,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, HttpServletRequest request,
			Model model) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AccountMasterDto acctDto = new AccountMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			acctDto = objectMapper.readValue(pageValJson, AccountMasterDto.class);
			acctDto.setChannelId(user.getChannelId());
			respDto = commonUtility.objectToJson(acctDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchTranDetails, respDto));
			acctDto = objectMapper.readValue(respString, AccountMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acctDto;
	}

	@RequestMapping("/fetchRelatedPersonDetails")
	@ResponseBody
	public AccountMasterDto fetchRelatedPersonDetails(@AuthenticationPrincipal User user,
			RedirectAttributes redirectAttributes,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, HttpServletRequest request,
			Model model) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AccountMasterDto acctDto = new AccountMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			acctDto = objectMapper.readValue(pageValJson, AccountMasterDto.class);
			acctDto.setChannelId(user.getChannelId());
			respDto = commonUtility.objectToJson(acctDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRelatedPersonDetails, respDto));
			acctDto = objectMapper.readValue(respString, AccountMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acctDto;
	}

	@RequestMapping(value = "/AlertViewModel")
	@ResponseBody
	public AlertMasterDto alertDtlsViewModel(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		AlertMasterDto alertMasterDto = new AlertMasterDto();
		try {

			String pageValJson = request.getParameter("pageValJson");
			alertMasterDto = objectMapper.readValue(pageValJson, AlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertMasterDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchALertDataForModel, respDto));
			alertMasterDto = objectMapper.readValue(respString, AlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertMasterDto;
	}

	@RequestMapping(value = "/getAcStatementFilterWise")
	@ResponseBody
	public List<AccountStatementDto> getAcStatementFilterWise(@AuthenticationPrincipal User user,
			HttpServletRequest request) throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AccountStatementDto> acctStmtList = new ArrayList<>();
		AccountStatementDto accountStatementDto = new AccountStatementDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			accountStatementDto = objectMapper.readValue(pageValJson, AccountStatementDto.class);
			accountStatementDto.setSearchParam("fromSearch");
			respDto = commonUtility.objectToJson(accountStatementDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getAcStatementFilterWise, respDto));
			acctStmtList = objectMapper.readValue(respString, new TypeReference<List<AccountStatementDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acctStmtList;
	}

	@RequestMapping(value = "/CustViewModel")
	@ResponseBody
	public CustomerDto custListViewModel(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		CustomerDto custDto = new CustomerDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			custDto = objectMapper.readValue(pageValJson, CustomerDto.class);
			respDto = commonUtility.objectToJson(custDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + viewCustomerDetails, respDto));
			custDto = objectMapper.readValue(respString, CustomerDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return custDto;
	}

	@RequestMapping(value = "/getAccountList")
	@ResponseBody
	public List<AccountMasterDto> getAccountList(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AccountMasterDto> acctStmtList = new ArrayList<>();
		AccountMasterDto accountDto = new AccountMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			accountDto = objectMapper.readValue(pageValJson, AccountMasterDto.class);
			respDto = commonUtility.objectToJson(accountDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getAccountList, respDto));
			acctStmtList = objectMapper.readValue(respString, new TypeReference<List<AccountMasterDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acctStmtList;
	}

	@RequestMapping("/fetchAlertList")
	public String fetchSummaryAlertList(@AuthenticationPrincipal User user, Model model,
			@ModelAttribute(name = "source") String source, HttpSession session, HttpServletRequest request)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userObj = new UserDto();
		String returnString = "";
		UserDto userDtoObject = new UserDto();
		try {
			userDtoObject.setUserSession(user.getUserSession());
			userDtoObject.setUserId(user.getUserId());
			respDto = commonUtility.objectToJson(userDtoObject);
			String responseString = "";
			responseString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateSession, respDto));
			userDtoObject = objectMapper.readValue(responseString, UserDto.class);
			if (userDtoObject.isLogin()) {
				String pageValJson = request.getParameter("encryptedJson");
				if (pageValJson == null) {
					String aggFlg = (String) session.getAttribute("alertAggFlg");
					String alertStatus = (String) session.getAttribute("alertStatus");
					if (aggFlg == null) {
						user.setAlertAggFlg("U");
						if (user.getUserPosition().equalsIgnoreCase("Analyst")) {
							user.setAlertStatus("O");
						} else {
							user.setAlertStatus("U");
						}
					} else {
						user.setAlertAggFlg(aggFlg);
						user.setAlertStatus(alertStatus);
					}
					if (source != null) {
						model.addAttribute("msg", source);
					} else {
						model.addAttribute("msg", "success");
					}

				} else {
					userObj = objectMapper.readValue(pageValJson, UserDto.class);
					if (userObj.getAlertStatus() == null) {
						if (user.getUserPosition().equalsIgnoreCase("Analyst")) {
							user.setAlertStatus("O");
						} else {
							user.setAlertStatus("U");
						}
					} else {
						user.setAlertStatus(userObj.getAlertStatus());
					}
					user.setAlertAggFlg(userObj.getAlertAggFlg());
				}
				userObj.setAlertAggFlg(user.getAlertAggFlg());
				userObj.setAlertStatus(user.getAlertStatus());
				userObj.setUserRole(user.getUserPosition());
				userObj.setChannelId(user.getChannelId());
				userObj.setChannelCode(user.getChannelCode());
				userObj.setUserId(user.getUserId());
				userObj.setTmRoleAction(user.getTmRoleAction());
				respDto = commonUtility.objectToJson(userObj);
				model.addAttribute("aggKey", userObj.getAlertAggFlg());
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchSummaryAlertList, respDto));
				AlertSummaryTabDto alertMasterDto = objectMapper.readValue(respString, AlertSummaryTabDto.class);
				model.addAttribute("alertList", alertMasterDto.getAlertList());
				model.addAttribute("statusList", alertMasterDto.getStatusList());
				model.addAttribute("filterStatus", user.getAlertStatus());
				model.addAttribute("userRole", userObj.getUserRole());
				session.setAttribute("alertStatus", user.getAlertStatus());
				session.setAttribute("alertAggFlg", user.getAlertAggFlg());
				model.addAttribute("alertSummaryObj", alertMasterDto);
				returnString = "AlertList";
			} else {
				returnString = "multipleLogin";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return returnString;
	}

	@RequestMapping(value = "/fetchAlertSummaryData")
	@ResponseBody
	public AlertMasterDto fetchAlertSummaryData(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AlertMasterDto alertMasterDto = new AlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertMasterDto = objectMapper.readValue(pageValJson, AlertMasterDto.class);
			alertMasterDto.setUserRole(user.getUserPosition());
			alertMasterDto.setChannelId(user.getChannelId());
			respDto = commonUtility.objectToJson(alertMasterDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertSummaryData, respDto));
			alertMasterDto = objectMapper.readValue(respString, AlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertMasterDto;
	}

	@RequestMapping(value = "/sendMail")
	@ResponseBody
	public EmailDetailsDto sendMail(@AuthenticationPrincipal User user, HttpServletRequest request) throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		EmailDetailsDto emailDto = new EmailDetailsDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			emailDto = objectMapper.readValue(pageValJson, EmailDetailsDto.class);
			emailDto.setMakerId(user.getUserId());
			respDto = commonUtility.objectToJson(emailDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + sendMail, respDto));
			emailDto = objectMapper.readValue(respString, EmailDetailsDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return emailDto;
	}

	@RequestMapping(value = "/getLedgerStmtFilterWise")
	@ResponseBody
	public List<AccountStatementDto> getLedgerStmtFilterWise(@AuthenticationPrincipal User user,
			HttpServletRequest request) throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AccountStatementDto> acctStmtList = new ArrayList<>();
		AccountStatementDto accountStatementDto = new AccountStatementDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			accountStatementDto = objectMapper.readValue(pageValJson, AccountStatementDto.class);
			accountStatementDto.setSearchParam("fromSearch");
			respDto = commonUtility.objectToJson(accountStatementDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + getLedgerStmtFilterWise, respDto));
			acctStmtList = objectMapper.readValue(respString, new TypeReference<List<AccountStatementDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acctStmtList;
	}
	
	
	@RequestMapping("/viewFreezeStatusModel")
	@ResponseBody
	public AccountFreezeDtlsDto viewModel(HttpServletRequest request, Model model, @AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		AccountFreezeDtlsDto dto = new AccountFreezeDtlsDto();

		try {
			String pageValJson = request.getParameter("pageValJson");

			dto = objectMapper.readValue(pageValJson, AccountFreezeDtlsDto.class);

			respDto = commonUtility.objectToJson(dto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + viewFreezeStatusModel, respDto));
			dto = objectMapper.readValue(respString, AccountFreezeDtlsDto.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dto;
	}

}
