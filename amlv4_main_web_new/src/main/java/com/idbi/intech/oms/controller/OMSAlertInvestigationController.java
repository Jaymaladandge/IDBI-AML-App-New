package com.idbi.intech.oms.controller;

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
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.ActivityLogDto;
import com.idbi.intech.erm.domain.app.CommentDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.RoleMasterDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;
import com.idbi.intech.oms.domain.app.AMLCustAddressDto;
import com.idbi.intech.oms.domain.app.AMLCustMasterDto;
import com.idbi.intech.oms.domain.app.AMLCustPhoneEmailDto;
import com.idbi.intech.oms.domain.app.AccountStatementDto;
import com.idbi.intech.oms.domain.app.AmlAcMasterDto;
import com.idbi.intech.oms.domain.app.OmsAlertMasterAggDto;
import com.idbi.intech.oms.domain.app.OmsAlertMasterDto;
import com.idbi.intech.oms.domain.app.OmsAuditDto;
import com.idbi.intech.oms.domain.app.TranDetailsPieDto;

@Controller
public class OMSAlertInvestigationController {
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchCustomerData}")
	private String fetchCustomer;
	@Value("${app-url.checkMulcus}")
	private String checkMulcus;
	@Value("${app-url.fetchAccountDetails}")
	private String fetchAccountDetails;
	@Value("${app-url.fetchCustomerAddress}")
	private String fetchCustomerAddress;
	@Value("${app-url.fetchContactDetails}")
	private String fetchContactDetails;
	@Value("${app-url.fetchRelatedPerson}")
	private String fetchRelatedPerson;
	@Value("${app-url.fetchClosedAccounts}")
	private String fetchClosedAccounts;
	@Value("${app-url.fetchAssetsAccounts}")
	private String fetchAssetsAccounts;
	@Value("${app-url.fetchLiabilities}")
	private String fetchLiabilities;
	@Value("${app-url.fetchAcctStmt}")
	private String fetchAcctStmt;
	@Value("${app-url.fetchCommuDetails}")
	private String fetchCommuDetails;
	@Value("${app-url.fetchTranDetails}")
	private String fetchTranDetails;
	@Value("${app-url.fetchAlertDetails}")
	private String fetchAlertDetails;
	@Value("${app-url.reviewComplianceReq}")
	private String reviewComplianceReq;
	@Value("${app-url.fetchAlertHistory}")
	private String fetchAlertHistory;
	@Value("${app-url.fetchRuleComments}")
	private String fetchRuleComments;
	@Value("${app-url.fetchParamValueList}")
	private String fetchParamValueList;
	@Value("${app-url.searchDataList}")
	private String searchDataList;
	@Value("${app-url.getRuleEditData}")
	private String getRuleEditData;
	@Value("${app-url.getVerticalRoles}")
	private String getVerticalRoles;
	@Value("${app-url.getAccountWiseCount}")
	private String getAccountWiseCount;
	@Value("${app-url.fetchAlertList}")
	private String fetchAlertList;
	@Value("${app-url.sendAlert}")
	private String sendAlert;
	@Value("${app-url.fetchAlertCounts}")
	private String fetchAlertCounts;
	@Value("${app-url.alertCustomerWiseCount}")
	private String alertCustomerWiseCount;
	@Value("${app-url.closeAlertCount}")
	private String closeAlertCount;
	@Value("${app-url.alertAggrigation}")
	private String alertAggrigation;
	@Value("${app-url.getZoneWiseAlertCount}")
	private String getZoneWiseAlertCount;
	@Value("${app-url.getRegionWiseAlertCount}")
	private String getRegionWiseAlertCount;
	@Value("${app-url.getBranchWiseAlertCount}")
	private String getBranchWiseAlertCount;
	@Value("${app-url.getRuleWiseAlertCount}")
	private String getRuleWiseAlertCount;
	@Value("${app-url.getAccountWiseAlertCount}")
	private String getAccountWiseAlertCount;
	@Value("${app-url.fetchAlertCountRelatedDataList}")
	private String fetchAlertCountRelatedDataList;
	@Value("${app-url.fetchPositionWiseAlerts}")
	private String fetchPositionWiseAlerts;
	@Value("${app-url.fetchBranchListByRegionNameData}")
	private String fetchBranchListByRegionNameData;
	@Value("${app-url.transferAlertActionData}")
	private String transferAlertActionData;
	@Value("${app-url.fetchVerticalByRoleMapperList}")
	private String fetchVerticalByRoleMapperList;
	@Value("${app-url.fetchRoleByVerticalNameList}")
	private String fetchRoleByVerticalNameList;
	@Value("${app-url.fetchDistinctZoneList}")
	private String fetchDistinctZoneList;
	@Value("${app-url.fetchAlertDetailsById}")
	private String fetchAlertDetailsById;
	@Value("${app-url.fetchCommentHistory}")
	private String fetchCommentHistory;
	@Value("${app-url.fetchAlertDetailedDataList}")
	private String fetchAlertDetailedDataList;

	// CommonUtility Object
	@Autowired
	private CommonUtility commonUtility;

	RequestResponseJsonDto respDto = null;

	@RequestMapping("/alertInvestigate")
	public String alertInvestigate(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model,
			@ModelAttribute(name = "sourceName") String sourceName, @ModelAttribute(name = "sourceId") String sourceId,
			@ModelAttribute(name = "alertStatus") String alertStatus, @ModelAttribute(name = "ruleId") String ruleId,
			HttpSession session) throws JsonProcessingException {
		String returnPage = "";
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AmlAcMasterDto> acctList = new ArrayList<>();
		try {
			OmsAlertMasterDto alertMasterDto = new OmsAlertMasterDto();
			alertMasterDto.setAlertId(sourceId);
			alertMasterDto.setRuleId(ruleId);
			respDto = commonUtility.objectToJson(alertMasterDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertDetails, respDto));
			alertMasterDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
			AMLCustMasterDto custDto = new AMLCustMasterDto();
			custDto.setCustId(alertMasterDto.getCustId());
			respDto = commonUtility.objectToJson(custDto);
			final String custString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchCustomer, respDto));
			custDto = objectMapper.readValue(custString, AMLCustMasterDto.class);
			AmlAcMasterDto acMasterDto = new AmlAcMasterDto();
			acMasterDto.setCustId(alertMasterDto.getCustId());
			acMasterDto.setAcid(alertMasterDto.getCustAcid());
			respDto = commonUtility.objectToJson(acMasterDto);
			final String acctString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAccountDetails, respDto));
			acctList = objectMapper.readValue(acctString, new TypeReference<List<AmlAcMasterDto>>() {
			});

			model.addAttribute("acctList", acctList);
			model.addAttribute("alertData", alertMasterDto);
			List<String> data = new ArrayList<String>();
			List<String> value = new ArrayList<String>();
			for (String key : alertMasterDto.getAlertData().keySet()) {
				data.add(key);
				value.add(alertMasterDto.getAlertData().get(key));
			}

			model.addAttribute("listSize", alertMasterDto.getAlertData().keySet().size());
			model.addAttribute("datas", data);
			model.addAttribute("datasValue", value);
			model.addAttribute("user", user);
			model.addAttribute("userName", user.getUsername());
			model.addAttribute("alertDto", alertMasterDto);
			model.addAttribute("alertMasterDto", alertMasterDto.getCommentByName().get(0));
			model.addAttribute("custData", custDto);
			model.addAttribute("alertStatus", alertStatus);
			model.addAttribute("alertCategory", alertMasterDto.getAlertCat());
			returnPage = "alertInvestigatePage";
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return returnPage;
	}

	@RequestMapping(value = "/checkMulcus")
	@ResponseBody
	public AMLCustMasterDto checkMulcus(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AMLCustMasterDto custDto = new AMLCustMasterDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			custDto = objectMapper.readValue(pageValJson, AMLCustMasterDto.class);
			respDto = commonUtility.objectToJson(custDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + checkMulcus, respDto));
			custDto = objectMapper.readValue(respString, AMLCustMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return custDto;
	}

	@RequestMapping(value = "/fetchCommuDetails")
	@ResponseBody
	public List<AMLCustAddressDto> fetchCommuDetails(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AMLCustAddressDto> addrList = new ArrayList<>();
		AMLCustMasterDto custDto = new AMLCustMasterDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			custDto = objectMapper.readValue(pageValJson, AMLCustMasterDto.class);
			respDto = commonUtility.objectToJson(custDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchCommuDetails, respDto));
			addrList = objectMapper.readValue(respString, new TypeReference<List<AMLCustAddressDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return addrList;
	}

	@RequestMapping(value = "/fetchContactDetails")
	@ResponseBody
	public List<AMLCustPhoneEmailDto> fetchContactDetails(@AuthenticationPrincipal User user,
			HttpServletRequest request) throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AMLCustPhoneEmailDto> contactList = new ArrayList<>();
		AMLCustMasterDto custDto = new AMLCustMasterDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			custDto = objectMapper.readValue(pageValJson, AMLCustMasterDto.class);
			respDto = commonUtility.objectToJson(custDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchContactDetails, respDto));
			contactList = objectMapper.readValue(respString, new TypeReference<List<AMLCustPhoneEmailDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return contactList;
	}

	@RequestMapping(value = "/fetchRelatedPerson")
	@ResponseBody
	public List<AMLCustMasterDto> fetchRelatedPerson(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AMLCustMasterDto> relatedPersonList = new ArrayList<>();
		AMLCustMasterDto custDto = new AMLCustMasterDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			custDto = objectMapper.readValue(pageValJson, AMLCustMasterDto.class);
			respDto = commonUtility.objectToJson(custDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRelatedPerson, respDto));
			relatedPersonList = objectMapper.readValue(respString, new TypeReference<List<AMLCustMasterDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return relatedPersonList;
	}

	@RequestMapping(value = "/fetchClosedAccounts")
	@ResponseBody
	public List<AmlAcMasterDto> fetchClosedAccounts(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AmlAcMasterDto> acctList = new ArrayList<>();
		AmlAcMasterDto custDto = new AmlAcMasterDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			custDto = objectMapper.readValue(pageValJson, AmlAcMasterDto.class);
			respDto = commonUtility.objectToJson(custDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchClosedAccounts, respDto));
			acctList = objectMapper.readValue(respString, new TypeReference<List<AmlAcMasterDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acctList;
	}

	@RequestMapping(value = "/fetchAssetsAccounts")
	@ResponseBody
	public List<AmlAcMasterDto> fetchAssetsAccounts(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AmlAcMasterDto> acctList = new ArrayList<>();
		AmlAcMasterDto custDto = new AmlAcMasterDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			custDto = objectMapper.readValue(pageValJson, AmlAcMasterDto.class);
			respDto = commonUtility.objectToJson(custDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAssetsAccounts, respDto));
			acctList = objectMapper.readValue(respString, new TypeReference<List<AmlAcMasterDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acctList;
	}

	@RequestMapping(value = "/fetchLiabilities")
	@ResponseBody
	public List<AmlAcMasterDto> fetchLiabilities(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AmlAcMasterDto> acctList = new ArrayList<>();
		AmlAcMasterDto custDto = new AmlAcMasterDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			custDto = objectMapper.readValue(pageValJson, AmlAcMasterDto.class);
			respDto = commonUtility.objectToJson(custDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchLiabilities, respDto));
			acctList = objectMapper.readValue(respString, new TypeReference<List<AmlAcMasterDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acctList;
	}

	@RequestMapping(value = "/fetchAcctStmt")
	@ResponseBody
	public List<AccountStatementDto> fetchAcctStmt(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		List<AccountStatementDto> acctStmtList = new ArrayList<>();
		AccountStatementDto accountStatementDto = new AccountStatementDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));

			accountStatementDto = objectMapper.readValue(pageValJson, AccountStatementDto.class);
			accountStatementDto.setSearchParam("ALL");
			respDto = commonUtility.objectToJson(accountStatementDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAcctStmt, respDto));
			acctStmtList = objectMapper.readValue(respString, new TypeReference<List<AccountStatementDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acctStmtList;
	}

	@RequestMapping(value = "/getAccountStatementFilterWise")
	@ResponseBody
	public List<AccountStatementDto> getAccountStatementFilterWise(@AuthenticationPrincipal User user,
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
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAcctStmt, respDto));
			acctStmtList = objectMapper.readValue(respString, new TypeReference<List<AccountStatementDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acctStmtList;
	}

	@RequestMapping(value = "/fetchTranDetails")
	@ResponseBody
	public TranDetailsPieDto fetchTranDetails(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		TranDetailsPieDto pieDto = new TranDetailsPieDto();
		try {
			String pageValJson = commonUtility.encryptedReqToString(request.getParameter("pageValJson"));
			pieDto = objectMapper.readValue(pageValJson, TranDetailsPieDto.class);
			respDto = commonUtility.objectToJson(pieDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchTranDetails, respDto));
			pieDto = objectMapper.readValue(respString, TranDetailsPieDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return pieDto;
	}

	// saveComplianceReq
	@PostMapping("/saveComplianceReq")
	public String saveComplianceReq(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {

		String sourceTxt = "";
		OmsAlertMasterDto alertMasterDto = new OmsAlertMasterDto();
		ActivityLogDto logDto = new ActivityLogDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		UserDto userDto = new UserDto();
		StringBuilder initJson = new StringBuilder("{\"complianceActionStatus\"=");
		StringBuilder newJson = new StringBuilder("{\"complianceActionStatus\"=");
		ResponseEntity<String> rasString = null;
		HttpHeaders resHeaders = null;
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertMasterDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			userDto.setUserDept(user.getUserDept());
			userDto.setUserOffice(user.getUserOffice());
			userDto.setUserId(user.getUserId().toUpperCase());
			userDto.setUserDept(user.getUserDept());
			userDto.setDeptId(user.getUserDept());
			userDto.setUserDeptName(user.getUserDeptName());
			userDto.setUserRole(user.getUserPosition());
			userDto.setUserOfficeType(user.getUserOfficeType());
			alertMasterDto.setUserDto(userDto);

			if (alertMasterDto.getAction().equalsIgnoreCase("escalate")) {
				sourceTxt = "ESCALATEUP";
			} else if (alertMasterDto.getAction().equalsIgnoreCase("hold")) {
				sourceTxt = "HOLD";
			} else if (alertMasterDto.getAction().equalsIgnoreCase("closed")) {
				sourceTxt = "CLOSEDALERT";
			} else if (alertMasterDto.getAction().equalsIgnoreCase("reject")) {
				sourceTxt = "REJECTEDALERT";
			}
			initJson.append("}");
			newJson.append("}");
			logDto.setActivityImpactTblKey(alertMasterDto.getAlertId());
			logDto.setInitJson(initJson.toString());
			logDto.setModJson(newJson.toString());
			logDto.setUserId(user.getUserId().toString());
			logDto.setTableName("OMS_ALERT_MASTER");
			alertMasterDto.setActivityLogDto(logDto);
			alertMasterDto.setRegion(user.getUserRegion());

			respDto = commonUtility.objectToJson(alertMasterDto);
			rasString = commonUtility.webserviceConsume(uri + reviewComplianceReq, respDto);
			resHeaders = rasString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", sourceTxt);
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}

		}
		return "redirect:/home";

	}

	@RequestMapping(value = "/fetchAlertHistory")
	@ResponseBody
	public OmsAlertMasterDto searchOldAlerts(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertMasDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertMasDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertMasDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertHistory, respDto));
			alertMasDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return alertMasDto;
	}

	// fetchRuleComments
	@RequestMapping(value = "/fetchRuleComments")
	@ResponseBody
	public CommentDto fetchRuleComments(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		CommentDto commentDto = new CommentDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			commentDto = objectMapper.readValue(pageValJson, CommentDto.class);
			respDto = commonUtility.objectToJson(commentDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRuleComments, respDto));
			commentDto = objectMapper.readValue(respString, CommentDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return commentDto;
	}

	// seachParameter
	@RequestMapping(value = "/fetchParamValueList")
	@ResponseBody
	public OmsAlertMasterDto fetchParamValueList(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchParamValueList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	// searchData
	@RequestMapping(value = "/searchDataList")
	@ResponseBody
	public OmsAlertMasterDto searchDataList(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertMasterDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertMasterDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			alertMasterDto.setActRoleId(user.getUserPosition());
			alertMasterDto.setBranchId("216400");
			respDto = commonUtility.objectToJson(alertMasterDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + searchDataList, respDto));
			alertMasterDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertMasterDto;
	}

	// getVertical
	@RequestMapping(value = "/getVerticalRoles")
	@ResponseBody
	public RoleMasterDto getVerticalRoles(@AuthenticationPrincipal User user, HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		RoleMasterDto roleDto = new RoleMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			roleDto = objectMapper.readValue(pageValJson, RoleMasterDto.class);
			UserDto userDto = new UserDto();
			roleDto.setSearchParam(user.getBranchId());
			userDto.setUserRole(user.getUserPosition());
			userDto.setVertical(user.getVertical());
			roleDto.setUser(userDto);
			respDto = commonUtility.objectToJson(roleDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getVerticalRoles, respDto));
			roleDto = objectMapper.readValue(respString, RoleMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return roleDto;
	}

	// getAccountWiseCount
	@RequestMapping(value = "/getAccountWiseCount")
	@ResponseBody
	public OmsAlertMasterDto getAccountWiseCount(@AuthenticationPrincipal User user, HttpServletRequest request,
			Model model) throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertMasDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertMasDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			UserDto userDto = new UserDto();
			userDto.setUserRole(user.getUserPosition());
			userDto.setVertical(user.getVertical());
			userDto.setZone(user.getZone());
			userDto.setUserRegion(user.getUserRegion());
			userDto.setSearchFromDashboard(user.getSearchFromDashboard());
			// userDto.setSearchParam("SEARCHRMALERTS");
			if (alertMasDto.getVariable() != null) {
				userDto.setUserId(alertMasDto.getActUserId());
			} else {
				userDto.setBranchId(user.getBranchId());
				userDto.setUserId(user.getUserId());
			}
			alertMasDto.setUserDto(userDto);
			respDto = commonUtility.objectToJson(alertMasDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getAccountWiseCount, respDto));
			alertMasDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return alertMasDto;
	}

	@RequestMapping(value = "/getCustomerWiseCount")
	@ResponseBody
	public OmsAlertMasterDto getCustomerWiseCount(@AuthenticationPrincipal User user, HttpServletRequest request,
			Model model) throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertMasDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertMasDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			UserDto userDto = new UserDto();
			userDto.setUserRole(user.getUserPosition());
			userDto.setVertical(user.getVertical());
			userDto.setZone(user.getZone());
			userDto.setUserRegion(user.getUserRegion());
			userDto.setSearchFromDashboard(user.getSearchFromDashboard());
			// userDto.setSearchParam("SEARCHRMALERTS");
			if (alertMasDto.getVariable() != null) {
				userDto.setUserId(alertMasDto.getActUserId());
			} else {
				userDto.setBranchId(user.getBranchId());
				userDto.setUserId(user.getUserId());
			}
			alertMasDto.setUserDto(userDto);
			respDto = commonUtility.objectToJson(alertMasDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + alertCustomerWiseCount, respDto));
			alertMasDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return alertMasDto;
	}

	// alertSummary
	@PostMapping("/alertSummary")
	public String alertSummary(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes, HttpSession session)
			throws JsonProcessingException {

		OmsAlertMasterDto alertMasterDto = new OmsAlertMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String respString = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertMasterDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			alertMasterDto.setBranchId(user.getBranchId());
			alertMasterDto.setActRoleId(user.getUserPosition());
			if (alertMasterDto.getSearchValue() == null) {
				alertMasterDto.setSearchParam(String.valueOf(session.getAttribute("searchParam")));
				alertMasterDto.setSearchValue(String.valueOf(session.getAttribute("searchValue")));
				alertMasterDto.setSearchUserId(String.valueOf(session.getAttribute("searchUserId")));

			}
			session.setAttribute("searchParam", alertMasterDto.getSearchParam());
			session.setAttribute("searchValue", alertMasterDto.getSearchValue());
			session.setAttribute("searchUserId", alertMasterDto.getSearchUserId());
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setSearchFromDashboard(user.getSearchFromDashboard());
			userDto.setVertical(user.getVertical());
			userDto.setZone(user.getZone());
			// userDto.setSearchValue(user.getPeriod());
			userDto.setUserRegion(user.getUserRegion());
			alertMasterDto.setUserDto(userDto);
			alertMasterDto.setAgeValue(user.getPeriod());
			respDto = commonUtility.objectToJson(alertMasterDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertList, respDto));
			alertMasterDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
			model.addAttribute("alertList", alertMasterDto.getAlertList());
			model.addAttribute("ruleDetails", alertMasterDto);
			model.addAttribute("user", user);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return "alertSummary";
	}

	// sendAlert
	@RequestMapping("/sendAlert")
	public String sendAlert(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes,
			@ModelAttribute(name = "encryptedJson") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		HttpHeaders resHeaders = null;
		ResponseEntity<String> rasString = null;
		OmsAlertMasterDto omsAlertDto = new OmsAlertMasterDto();
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			omsAlertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setVertical(user.getVertical());
			userDto.setUserRole(user.getUserPosition());
			omsAlertDto.setUserDto(userDto);
			respDto = commonUtility.objectToJson(omsAlertDto);
			rasString = commonUtility.webserviceConsume(uri + sendAlert, respDto);
			resHeaders = rasString.getHeaders();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("SOURCE", "SENDALERT");
			} else {
				redirectAttributes.addFlashAttribute("SOURCE", "ERROR");
			}
		}

		return "redirect:/home";
	}

	@RequestMapping(value = "/fetchselectedRMAlertCount")
	@ResponseBody
	public OmsAlertMasterDto fetchselectedRMAlertCount(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";
		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			alertDto.setBranchId(user.getBranchId());
			UserDto userMasDto = new UserDto();
			userMasDto.setUserRole(user.getUserPosition());
			if (alertDto.getActUserId() != null) {
				userMasDto.setUserId(alertDto.getActUserId());
			} else {
				userMasDto.setUserId(user.getUserId());
			}
			userMasDto.setSearchFromDashboard(user.getSearchFromDashboard());
			userMasDto.setUserRegion(user.getUserRegion());
			userMasDto.setZone(user.getZone());
			userMasDto.setSearchParam("SEARCHRMALERTS");
			userMasDto.setVertical(user.getUserVertical());
			alertDto.setUserDto(userMasDto);
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertCounts, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	@RequestMapping(value = "/getCustDetailsById")
	@ResponseBody
	public AMLCustMasterDto getCustDetailsById(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AMLCustMasterDto custDto = new AMLCustMasterDto();
		try {

			String pageValJson = request.getParameter("pageValJson");
			custDto = objectMapper.readValue(pageValJson, AMLCustMasterDto.class);
			custDto.setCustId(custDto.getSearchValue());
			respDto = commonUtility.objectToJson(custDto);
			final String custString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchCustomer, respDto));
			custDto = objectMapper.readValue(custString, AMLCustMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return custDto;
	}

	@RequestMapping(value = "/getAccountsDetailsById")
	@ResponseBody
	public AmlAcMasterDto getAccountsDetailsById(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AmlAcMasterDto acDto = new AmlAcMasterDto();
		try {

			String pageValJson = request.getParameter("pageValJson");
			acDto = objectMapper.readValue(pageValJson, AmlAcMasterDto.class);
			acDto.setCustAcNo(acDto.getSearchValue());
			respDto = commonUtility.objectToJson(acDto);
			final String custString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAccountDetails, respDto));
			acDto = objectMapper.readValue(custString, AmlAcMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return acDto;
	}

	@RequestMapping("/closeCountAction")
	public String closeCountAction(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model)
			throws JsonProcessingException {
		String returnPage = "";
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertMasterDto = new OmsAlertMasterDto();
		String requestString = "";
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertMasterDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setUserRole(user.getUserPosition());
			userDto.setVertical(user.getVertical());
			userDto.setZone(user.getZone());
			userDto.setUserRegion(user.getUserRegion());
			alertMasterDto.setUserDto(userDto);
			alertMasterDto.setBranchId(user.getBranchId());
			respDto = commonUtility.objectToJson(alertMasterDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + closeAlertCount, respDto));
			alertMasterDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
			model.addAttribute("alertData", alertMasterDto);
			returnPage = "closeCountPage";
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return returnPage;
	}

	@RequestMapping(value = "/viewCloseModelData")
	@ResponseBody
	public OmsAlertMasterDto viewCloseModelData(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";
		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertDetails, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	@RequestMapping(value = "/getAlertAggView")
	@ResponseBody
	public OmsAlertMasterAggDto getAlertAggView(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterAggDto alertDto = new OmsAlertMasterAggDto();
		String respString = "";
		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterAggDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + alertAggrigation, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterAggDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	@RequestMapping(value = "/fetchZoneWiseCount")
	@ResponseBody
	public OmsAlertMasterDto fetchZoneWiseCount(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";
		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			alertDto.setCustVertical(user.getUserVertical());
			alertDto.setUserPosition(user.getUserPosition());
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getZoneWiseAlertCount, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			List<String> zoneCountList = new ArrayList<>();
			List<String> zonePieCountList = new ArrayList<>();
			for (OmsAuditDto auditDtoList : alertDto.getZoneAlertCountList()) {
				zoneCountList.add(auditDtoList.getZoneName() + "~" + auditDtoList.getOpenCount() + "~"
						+ auditDtoList.getCloseCount() + "~" + auditDtoList.getEscalateCount());
				zonePieCountList.add(auditDtoList.getZoneName().toUpperCase() + "~" + auditDtoList.getTotalCount());
			}
			alertDto.setZoneAlertCount(zoneCountList);
			alertDto.setZonePieGraphList(zonePieCountList);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	@RequestMapping(value = "/fetchRegionWiseCount")
	@ResponseBody
	public OmsAlertMasterDto fetchRegionWiseCount(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";
		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			alertDto.setCustVertical(user.getUserVertical());
			alertDto.setUserPosition(user.getUserPosition());
			alertDto.setSourceTxt(user.getOmsUserPosition());
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getRegionWiseAlertCount, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
			List<String> zoneCountList = new ArrayList<>();
			for (OmsAuditDto auditDtoList : alertDto.getRegionAlertCountList()) {
				zoneCountList.add(auditDtoList.getRegionName().toUpperCase() + "~" + auditDtoList.getTotalCount());
			}
			alertDto.setRegionAlertCount(zoneCountList);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	@RequestMapping(value = "/fetchBranchWiseCount")
	@ResponseBody
	public OmsAlertMasterDto fetchBranchWiseCount(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";
		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			alertDto.setCustVertical(user.getUserVertical());
			alertDto.setUserPosition(user.getUserPosition());
			alertDto.setOmsOfficeType(user.getOmsOfficeType());
			alertDto.setZomDashboardParam("fetch");
			alertDto.setRomDashboard("viewDashBoard");
			alertDto.setSourceTxt(user.getOmsUserPosition());
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getBranchWiseAlertCount, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	@RequestMapping(value = "/fetchRuleWiseCount")
	@ResponseBody
	public OmsAlertMasterDto fetchRuleWiseCount(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";
		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			alertDto.setCustVertical(user.getUserVertical());
			alertDto.setUserPosition(user.getUserPosition());
			alertDto.setZomDashboardParam("fetch");
			alertDto.setAuditSearchParam("branch");
			alertDto.setOmsOfficeType(user.getOmsOfficeType());
			alertDto.setSourceTxt(user.getOmsUserPosition());
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getRuleWiseAlertCount, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	@RequestMapping(value = "/fetchAccountWiseCount")
	@ResponseBody
	public OmsAlertMasterDto fetchAccountWiseCount(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";
		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			alertDto.setCustVertical(user.getUserVertical());
			alertDto.setUserPosition(user.getUserPosition());
			alertDto.setOmsOfficeType(user.getOmsOfficeType());
			alertDto.setSourceTxt(user.getOmsUserPosition());
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getAccountWiseAlertCount, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	/// fetchAlertCountRelatedData
	@RequestMapping(value = "/fetchAlertCountRelatedData")
	@ResponseBody
	public OmsAlertMasterDto fetchAlertCountRelatedData(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";

		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchAlertCountRelatedDataList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	// transferAlertPage
	@RequestMapping("/transferAlertPage")
	public String transferAlertPage(
			@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source,
			RedirectAttributes redirectAttributes, Model model, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		OmsAlertMasterDto omsAlertDto = new OmsAlertMasterDto();

		try {

			// set position of user from hrms
			// omsAlertDto.setUserPosition("Regional Manager");

			omsAlertDto.setSearchParam("zone");
			respDto = commonUtility.objectToJson(omsAlertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
			omsAlertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);


			omsAlertDto.setSearchParam(user.getOmsOfficeType());
			omsAlertDto.setRegion(user.getUserRegion());
			omsAlertDto.setBranchId(user.getBranchId());
			omsAlertDto.setUserId(user.getUserId());
			omsAlertDto.setDealingVertical(user.getUserVertical());
			omsAlertDto.setSearchValue("branchAlert");

			respDto = commonUtility.objectToJson(omsAlertDto);
			requestString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchPositionWiseAlerts, respDto));
			omsAlertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);

		} catch (Exception e) {
			e.printStackTrace();
		}
		if (null != sourceText && sourceText.equals("SUCESSAT")) {
			messageText = "Alert Transfered Successfully";
		} else if (null != sourceText && sourceText.equals("roleNot")) {
			messageText = "Role Not Present";
		} else if (null != sourceText && sourceText.equals("verticalNot")) {
			messageText = "Vertical Not Present";
		}
		model.addAttribute("alertList", omsAlertDto.getAlertList());
		model.addAttribute("searchParam", omsAlertDto.getSearchParam());
		model.addAttribute("branchId", omsAlertDto.getBranchId());
		model.addAttribute("region", omsAlertDto.getRegion());
		model.addAttribute("zoneList", omsAlertDto.getBranchDtoList());
		model.addAttribute("message", messageText);

		String redirectPage = "";
		if (user.getAdminFlg() != null && user.getAdminFlg().equalsIgnoreCase("Y")) {
			redirectPage = "TransferAlertPage";
		} else {
			redirectPage = "redirect:/logout";
		}

		return redirectPage;
	}

//fetchAuditAlerts
	@RequestMapping(value = "/fetchAuditAlerts")
	@ResponseBody
	public OmsAlertMasterDto fetchAuditAlerts(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto omsAlertDto = new OmsAlertMasterDto();

		try {

			String pageValJson = request.getParameter("pageValJson");
			omsAlertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			omsAlertDto.setSearchParam(user.getOmsOfficeType());
			omsAlertDto.setRegion(user.getUserRegion());
			omsAlertDto.setBranchId(user.getBranchId());
			omsAlertDto.setUserId(user.getUserId());
			omsAlertDto.setDealingVertical(user.getUserVertical());

			respDto = commonUtility.objectToJson(omsAlertDto);
			String requestString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchPositionWiseAlerts, respDto));
			omsAlertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return omsAlertDto;
	}

	@RequestMapping(value = "/fetchBranchAlertTransferList")
	@ResponseBody
	public OmsAlertMasterDto fetchBranchAlertTransferList(@AuthenticationPrincipal User user,
			HttpServletRequest request) throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto omsAlertDto = new OmsAlertMasterDto();
		try {

			String pageValJson = request.getParameter("pageValJson");
			omsAlertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			omsAlertDto.setSearchParam(user.getOmsOfficeType());
			omsAlertDto.setRegion(user.getUserRegion());
			omsAlertDto.setBranchId(user.getBranchId());
			omsAlertDto.setUserId(user.getUserId());
			omsAlertDto.setDealingVertical(user.getUserVertical());

			respDto = commonUtility.objectToJson(omsAlertDto);
			String requestString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchPositionWiseAlerts, respDto));
			omsAlertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return omsAlertDto;
	}

	// fetchBranchListByRegionName
	@RequestMapping(value = "/fetchBranchListByRegionName")
	@ResponseBody
	public OmsAlertMasterDto fetchBranchListByRegionName(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";

		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchBranchListByRegionNameData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	// transferAlertAction
	@RequestMapping("/transferAlertAction")
	public String transferAlertAction(
			@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes,
			HttpSession session) {

		HttpHeaders resHeaders = null;
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		ResponseEntity<String> actionString = null;
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());

			alertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			alertDto.setUserId(user.getUserId());

			alertDto.getCommentDto().setCommentBy(user.getUserId());
			alertDto.getCommentDto().setModuleName("TM");
			alertDto.getCommentDto().setComment(alertDto.getCommentDto().getComment());

			respDto = commonUtility.objectToJson(alertDto);
			actionString = commonUtility.webserviceConsume(uri + transferAlertActionData, respDto);
			resHeaders = actionString.getHeaders();

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		} finally {
			if (resHeaders.get("REQ-STATUS").contains("SUCCESS")) {
				redirectAttributes.addFlashAttribute("source", "SUCESSAT");
			} else {
				redirectAttributes.addFlashAttribute("source", "ERROR");
			}
		}

		return "redirect:/transferAlertPage";
	}

	// fetchVerticalByRoleMapper
	@RequestMapping(value = "/fetchVerticalByRoleMapper")
	@ResponseBody
	public OmsAlertMasterDto fetchVerticalByRoleMapper(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";

		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchVerticalByRoleMapperList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

//fetchRoleByVerticalName	
	@RequestMapping(value = "/fetchRoleByVerticalName")
	@ResponseBody
	public OmsAlertMasterDto fetchRoleByVerticalName(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";

		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRoleByVerticalNameList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	// viewAlertById
	@RequestMapping(value = "/viewAlertById")
	@ResponseBody
	public OmsAlertMasterDto viewAlertById(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertMasDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertMasDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertMasDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertDetailsById, respDto));
			alertMasDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return alertMasDto;
	}

	// fetchCommentHistory
	@RequestMapping(value = "/fetchCommentHistory")
	@ResponseBody
	public CommentDto fetchCommentHistory(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		CommentDto commentDto = new CommentDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			commentDto = objectMapper.readValue(pageValJson, CommentDto.class);
			respDto = commonUtility.objectToJson(commentDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchCommentHistory, respDto));
			commentDto = objectMapper.readValue(respString, CommentDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return commentDto;
	}

	// fetchAlertDetailedData
	@RequestMapping(value = "/fetchAlertDetailedData")
	@ResponseBody
	public OmsAlertMasterDto fetchAlertDetailedData(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertMasDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertMasDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertMasDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertDetailedDataList, respDto));
			alertMasDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}

		return alertMasDto;
	}

}
