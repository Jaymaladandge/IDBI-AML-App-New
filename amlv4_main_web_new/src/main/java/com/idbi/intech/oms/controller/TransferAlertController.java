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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.util.CommonUtility;
import com.idbi.intech.oms.domain.app.OmsAlertMasterDto;
import com.idbi.intech.oms.domain.app.OmsBranchMasterDto;

@Controller
public class TransferAlertController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchPositionWiseAlertsNew}")
	private String fetchPositionWiseAlertsNew;
	@Value("${app-url.fetchBranchListByRegionNameDataNew}")
	private String fetchBranchListByRegionNameDataNew;
	@Value("${app-url.transferAlertActionDataNew}")
	private String transferAlertActionDataNew;
	@Value("${app-url.fetchDistinctZoneList}")
	private String fetchDistinctZoneList;
	@Value("${app-url.fetchRegionByZoneNameListData}")
	private String fetchRegionByZoneNameListData;
	@Value("${app-url.fetchBranchListByRegionNameDataList}")
	private String fetchBranchListByRegionNameDataList;
	@Value("${app-url.fetchBranchWiseVerticalList}")
	private String fetchBranchWiseVerticalList;
	@Value("${app-url.fetchVerticalWiseRoleList}")
	private String fetchVerticalWiseRoleList;
	
	// CommonUtility Object
	@Autowired
	private CommonUtility commonUtility;

	RequestResponseJsonDto respDto = null;

	// transferAlertPage
	@RequestMapping("/transferAlertPageNew")
	public String transferAlertPage(
			@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source,
			RedirectAttributes redirectAttributes, Model model, HttpSession session) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();

		try {

			if (user.getOmsOfficeType().equalsIgnoreCase("CENTRAL")) {
				alertDto.setSearchParam("zone");

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			} else if (user.getOmsOfficeType().equalsIgnoreCase("ZONE")) {
				alertDto.setSearchParam("ZONE");
				alertDto.setZone(user.getHrmsZone());

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility.decryptedResToString(
						commonUtility.webserviceConsume(uri + fetchRegionByZoneNameListData, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			} else if (user.getOmsOfficeType().equalsIgnoreCase("REGION")) {
				alertDto.setSearchParam("REGION");
				alertDto.setRegion(user.getHrmsRegion());

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility.decryptedResToString(
						commonUtility.webserviceConsume(uri + fetchBranchListByRegionNameDataList, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			} else if (user.getOmsOfficeType().equalsIgnoreCase("BRANCH")) {

				OmsBranchMasterDto branchDtoObj = new OmsBranchMasterDto();
				List<OmsBranchMasterDto> branchDtoObjList = new ArrayList<>();

				branchDtoObj.setBranchId(user.getBranchName());
				branchDtoObj.setBranchName(user.getBranchName());
				branchDtoObjList.add(branchDtoObj);
				alertDto.setBranchDtoList(branchDtoObjList);

			}
			model.addAttribute("zone", user.getHrmsZone());
			model.addAttribute("regionList", alertDto.getRegionDtoList());
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("zoneList", alertDto.getBranchDtoList());
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", user.getOmsOfficeType());

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
		model.addAttribute("message", messageText);

		String redirectPage = "";
		if (user.getAdminFlg() != null && user.getAdminFlg().equalsIgnoreCase("Y")) {
			redirectPage = "TransferAlertPage";
		} else {
			redirectPage = "redirect:/logout";
		}

		return redirectPage;
	}

	// fetchAuditAlerts
	@RequestMapping(value = "/fetchAuditAlertsNew")
	@ResponseBody
	public OmsAlertMasterDto fetchAuditAlerts(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto omsAlertDto = new OmsAlertMasterDto();

		try {

			String pageValJson = request.getParameter("pageValJson");
			omsAlertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			omsAlertDto.setUserId(user.getUserId());
			omsAlertDto.setDealingVertical(user.getUserVertical());

			respDto = commonUtility.objectToJson(omsAlertDto);
			String requestString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchPositionWiseAlertsNew, respDto));
			omsAlertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return omsAlertDto;
	}

	@RequestMapping(value = "/fetchBranchAlertTransferListNew")
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
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchPositionWiseAlertsNew, respDto));
			omsAlertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return omsAlertDto;
	}

	// fetchBranchListByRegionName
	@RequestMapping(value = "/fetchBranchListByRegionNameNew")
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
					commonUtility.webserviceConsume(uri + fetchBranchListByRegionNameDataNew, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	// transferAlertAction
	@RequestMapping("/transferAlertActionNew")
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
			actionString = commonUtility.webserviceConsume(uri + transferAlertActionDataNew, respDto);
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

	// fetchBranchListByRegionName
	@RequestMapping(value = "/fetchBranchWiseVerticalList")
	@ResponseBody
	public OmsAlertMasterDto fetchBranchWiseVerticalList(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";

		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchBranchWiseVerticalList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	// fetchVerticalWiseRoleList
	@RequestMapping(value = "/fetchVerticalWiseRoleList")
	@ResponseBody
	public OmsAlertMasterDto fetchVerticalWiseRoleList(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";

		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchVerticalWiseRoleList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}
}
