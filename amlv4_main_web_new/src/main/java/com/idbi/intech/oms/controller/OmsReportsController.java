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
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.ReportMasterDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.AlertCategorywiseReportExcel;
import com.idbi.intech.erm.util.AlertExcelReporter;
import com.idbi.intech.erm.util.AlertRiskwiseExcelReport;
import com.idbi.intech.erm.util.BranchSummaryExcelReport;
import com.idbi.intech.erm.util.BranchWiseTatReportExcel;
import com.idbi.intech.erm.util.BranchwiseAgeAnalysisExcelExport;
import com.idbi.intech.erm.util.ClosureTatReportExcel;
import com.idbi.intech.erm.util.CommonUtility;
import com.idbi.intech.erm.util.ROMReportExcel;
import com.idbi.intech.erm.util.RegionWiseAgeAnalysisExcelReport;
import com.idbi.intech.erm.util.RuleExecutionExcelReport;
import com.idbi.intech.erm.util.RulewiseAgegingExcelExport;
import com.idbi.intech.erm.util.TatReportOfficeWise;
import com.idbi.intech.erm.util.VgdZoneWiseReportExcel;
import com.idbi.intech.oms.domain.app.AlertTatMasterDto;
import com.idbi.intech.oms.domain.app.OmsAlertMasterDto;
import com.idbi.intech.oms.domain.app.OmsBranchMasterDto;
import com.idbi.intech.oms.domain.app.ReportRequestMasterDto;
import com.idbi.intech.oms.domain.app.RomReportDto;

@Controller
public class OmsReportsController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchAlertStatusCountReportData}")
	private String fetchAlertStatusCountReportData;
	@Value("${app-url.fetchDistinctZoneList}")
	private String fetchDistinctZoneList;
	@Value("${app-url.fetchRegionList}")
	private String fetchRegionList;
	@Value("${app-url.fetchRegionWiseBranchData}")
	private String fetchRegionWiseBranchData;
	@Value("${app-url.fetchBranchwiseRuleListData}")
	private String fetchBranchwiseRuleListData;
	@Value("${app-url.fetchTATCountReportData}")
	private String fetchTATCountReportData;
	@Value("${app-url.fetchTatStatusReportData}")
	private String fetchTatStatusReportData;
	@Value("${app-url.fetchAlertDetailsList}")
	private String fetchAlertDetailsList;
	@Value("${app-url.fetchBranchListByRegionNameDataList}")
	private String fetchBranchListByRegionNameDataList;
	@Value("${app-url.fetchAllRuleListDetailsList}")
	private String fetchAllRuleListDetailsList;
	@Value("${app-url.fetchRegionByZoneNameListData}")
	private String fetchRegionByZoneNameListData;
	@Value("${app-url.fetchRiskwiseAlertCountReportData}")
	private String fetchRiskwiseAlertCountReportData;
	@Value("${app-url.fetchCategorywiseAlertCountReportData}")
	private String fetchCategorywiseAlertCountReportData;
	@Value("${app-url.fetchAgeingReportDetails}")
	private String fetchAgeingReportDetails;
	@Value("${app-url.reportsList}")
	private String reportsList;
	@Value("${app-url.fetchConsolidatedReportList}")
	private String fetchConsolidatedReportList;
	@Value("${app-url.fetchRomReportDetails}")
	private String fetchRomReportDetails;
	@Value("${app-url.getBranchWiseTatData}")
	private String getBranchWiseTatData;
	@Value("${app-url.fetchBranchWiseReportCount}")
	private String fetchBranchWiseReportCount;
	@Value("${app-url.addNewReportRequest}")
	private String addNewReportRequest;
	@Value("${app-url.fetchZoneWiseVgdReportDetails}")
	private String fetchZoneWiseVgdReportDetails;
	@Value("${app-url.fetchFreqWiseAllRuleListDetailsList}")
	private String fetchFreqWiseAllRuleListDetailsList;
	@Value("${app-url.fetchOfficeWideTatReportData}")
	private String fetchOfficeWideTatReportData;
	@Value("${app-url.fetchBranchTATReport}")
	private String fetchBranchTATReport;
	@Value("${app-url.fetchVerticalList}")
	private String fetchVerticalList;

	@Autowired
	private CommonUtility commonUtility;

	RequestResponseJsonDto respDto = null;

	@RequestMapping("/alertStatusReport")
	public String alertStatusReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
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
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("zoneList", alertDto.getBranchDtoList());
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", user.getOmsOfficeType());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "AlertStatusReport";

	}

	// fetchRegionList
	@RequestMapping(value = "/fetchRegionList")
	@ResponseBody
	public OmsAlertMasterDto fetchRegionList(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto regionDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			regionDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(regionDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRegionList, respDto));
			regionDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return regionDto;
	}

	// fetchRegionWiseBranchList

	@RequestMapping(value = "/fetchRegionWiseBranchList")
	@ResponseBody
	public OmsAlertMasterDto fetchRegionWiseBranchList(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto branchDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			branchDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(branchDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRegionWiseBranchData, respDto));
			branchDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return branchDto;
	}

	// fetchAlertStatusCountReport
	@RequestMapping(value = "/fetchAlertStatusCountReport")
	@ResponseBody
	public OmsAlertMasterDto fetchAlertStatusCountReport(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);

			alertDto.setOmsOfficeType(user.getOmsOfficeType());

			if (alertDto.getSearchParam().equalsIgnoreCase("REGION")) {
				if ("All".equalsIgnoreCase(alertDto.getRegion())) {
					alertDto.setRegion(user.getHrmsRegion().toUpperCase());
					alertDto.setZone(user.getHrmsZone().toUpperCase());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("ZONE")) {
				if ("All".equalsIgnoreCase(alertDto.getZone())) {
					alertDto.setZone(user.getHrmsZone().toUpperCase());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("BRANCH")) {
				if ("All".equalsIgnoreCase(alertDto.getBranchId())) {
					alertDto.setBranchId(user.getBranchId());
				}
			}

			respDto = commonUtility.objectToJson(alertDto);

			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchAlertStatusCountReportData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	// export Excel Alert Status Report
	@RequestMapping(value = "/exportAlertCountReport")
	public String exportAlertStatusExcelReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes, HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {
			String pagevalJson = commonUtility.encryptedReqToString(request.getParameter("encryptedJson"));

			alertDto = objectMapper.readValue(pagevalJson, OmsAlertMasterDto.class);

			alertDto.setOmsOfficeType(user.getOmsOfficeType());

			if (alertDto.getSearchParam().equalsIgnoreCase("REGION")) {
				if ("All".equalsIgnoreCase(alertDto.getRegion())) {
					alertDto.setRegion(user.getHrmsRegion().toUpperCase());
					alertDto.setZone(user.getHrmsZone().toUpperCase());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("ZONE")) {
				if ("All".equalsIgnoreCase(alertDto.getZone())) {
					alertDto.setZone(user.getHrmsZone().toUpperCase());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("BRANCH")) {
				if ("All".equalsIgnoreCase(alertDto.getBranchId())) {
					alertDto.setBranchId(user.getBranchId());
				}
			}

			respDto = commonUtility.objectToJson(alertDto);

			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchAlertStatusCountReportData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Alert Status Count Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			userDto.setSearchParam("ALERT COUNT REPORT");

			AlertExcelReporter excelExporter = new AlertExcelReporter(alertDto);

			excelExporter.export(response, userDto);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();

		}
		return "redirect:/alertStatusReport";

	}

	@RequestMapping("/rulewiseAlertReport")
	public String riskwiseAlertReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			alertDto.setSearchParam("zone");
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
			model.addAttribute("alertDto", alertDto);

			model.addAttribute("zoneList", alertDto.getBranchDtoList());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "RulewiseAlertReport";

	}

	// fetchBranchwiseRuleList
	@RequestMapping(value = "/fetchBranchwiseRuleList")
	@ResponseBody
	public OmsAlertMasterDto fetchBranchwiseRuleList(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchBranchwiseRuleListData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	@RequestMapping("/tatwiseAlertReport")
	public String tatwiseAlertReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();

		try {
			alertDto.setSearchParam("zone");
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
			model.addAttribute("alertDto", alertDto);

			model.addAttribute("zoneList", alertDto.getBranchDtoList());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "TatwiseAlertReport";

	}

	// fetchTatCountReport
	@RequestMapping(value = "/fetchTatCountReport")
	@ResponseBody
	public OmsAlertMasterDto fetchTatCountReportData(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchTATCountReportData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	@RequestMapping("/drillDownReport")
	public String drillDownReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			alertDto.setSearchParam("zone");
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			model.addAttribute("alertDto", alertDto);

			model.addAttribute("zoneList", alertDto.getBranchDtoList());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "drillDownReport";

	}

	// Closure TAT Report
	@RequestMapping("/closureTatReport")
	public String closureTatReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {

			alertDto.setOfficeType(user.getOmsOfficeType());

			if (user.getOmsOfficeType().equalsIgnoreCase("CENTRAL")) {
				alertDto.setSearchParam("zone");

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

				model.addAttribute("zoneList", alertDto.getBranchDtoList());

			} else if (user.getOmsOfficeType().equalsIgnoreCase("REGION")) {
				alertDto.setSearchParam("REGION");
				alertDto.setRegion(user.getHrmsRegion());

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility.decryptedResToString(
						commonUtility.webserviceConsume(uri + fetchBranchListByRegionNameDataList, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

				model.addAttribute("branchList", alertDto.getBranchDtoList());

			} else if (user.getOmsOfficeType().equalsIgnoreCase("BRANCH")) {

				OmsBranchMasterDto branchDtoObj = new OmsBranchMasterDto();
				List<OmsBranchMasterDto> branchDtoObjList = new ArrayList<>();

				branchDtoObj.setBranchId(user.getBranchName().split("-")[0]);
				branchDtoObj.setBranchName(user.getBranchName().split("-")[1]);
				branchDtoObjList.add(branchDtoObj);
				alertDto.setBranchDtoList(branchDtoObjList);

				model.addAttribute("branchList", alertDto.getBranchDtoList());

			}
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", alertDto.getOfficeType());

			model.addAttribute("searchParam", alertDto.getOfficeType());
			model.addAttribute("branchId", alertDto.getBranchId());
			model.addAttribute("region", alertDto.getRegion());
			model.addAttribute("zone", user.getZone());
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "ClosureTatReport";

	}

	// fetchTatStatusReport
	@RequestMapping(value = "/fetchTatStatusReport")
	@ResponseBody
	public OmsAlertMasterDto fetchTatStatusReport(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchTatStatusReportData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	// fetchAlertDetails
	@RequestMapping(value = "/fetchAlertDetails")
	@ResponseBody
	public OmsAlertMasterDto fetchAlertDetails(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertDetailsList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	// fetchBranchListByRegionNameList

	@RequestMapping(value = "/fetchBranchListByRegionNameList")
	@ResponseBody
	public OmsAlertMasterDto fetchBranchListByRegionNameList(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto branchDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			branchDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(branchDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchBranchListByRegionNameDataList, respDto));
			branchDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return branchDto;
	}

	// ruleExecutionReport
	@RequestMapping("/ruleExecutionReport")
	public String ruleExecutionReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		try {

			model.addAttribute("searchParam", user.getOmsOfficeType());
			model.addAttribute("branchId", user.getBranchId());
			model.addAttribute("region", user.getUserRegion());
			model.addAttribute("zone", user.getZone());
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "RuleExecutionReport";
	}

	// fetchAllRuleListDetails
	@RequestMapping(value = "/fetchAllRuleListDetails")
	@ResponseBody
	public OmsAlertMasterDto fetchAllRuleListDetails(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto branchDto = new OmsAlertMasterDto();
		String firstDate = null;
		String secondDate = null;
		String thirdDate = null;
		try {
			String pageValJson = request.getParameter("pageValJson");

			branchDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(branchDto);

			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchFreqWiseAllRuleListDetailsList, respDto));
			branchDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
			// System.out.println(branchDto.getRuleAndDayWiseCount());
			for (OmsAlertMasterDto obj : branchDto.getRuleAndDayWiseCount()) {
				firstDate = obj.getFDate();
				secondDate = obj.getSDate();
				thirdDate = obj.getTDate();
			}
			System.out.println(firstDate);
			System.out.println(secondDate);
			System.out.println(thirdDate);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return branchDto;
	}

	// fetchRegionByZoneNameList
	@RequestMapping(value = "/fetchRegionByZoneNameList")
	@ResponseBody
	public OmsAlertMasterDto fetchRegionByZoneNameList(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto branchDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			branchDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(branchDto);

			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchRegionByZoneNameListData, respDto));
			branchDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return branchDto;
	}

	@RequestMapping("/alertRiskwiseReport")
	public String alertRiskwiseReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();

		try {
			alertDto.setOfficeType(user.getOmsOfficeType());

			if (user.getOmsOfficeType().equalsIgnoreCase("CENTRAL")) {
				alertDto.setSearchParam("zone");

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

				model.addAttribute("zoneList", alertDto.getBranchDtoList());

			} else if (user.getOmsOfficeType().equalsIgnoreCase("ZONE")) {

				alertDto.setSearchParam("ZONE");
				alertDto.setZone(user.getHrmsZone());

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility.decryptedResToString(
						commonUtility.webserviceConsume(uri + fetchRegionByZoneNameListData, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

				model.addAttribute("regionList", alertDto.getRegionDtoList());

			} else if (user.getOmsOfficeType().equalsIgnoreCase("REGION")) {
				alertDto.setSearchParam("REGION");
				alertDto.setRegion(user.getHrmsRegion());

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility.decryptedResToString(
						commonUtility.webserviceConsume(uri + fetchBranchListByRegionNameDataList, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

				model.addAttribute("branchList", alertDto.getBranchDtoList());

			} else if (user.getOmsOfficeType().equalsIgnoreCase("BRANCH")) {

				OmsBranchMasterDto branchDtoObj = new OmsBranchMasterDto();
				List<OmsBranchMasterDto> branchDtoObjList = new ArrayList<>();

				branchDtoObj.setBranchId(user.getBranchName().split("-")[0]);
				branchDtoObj.setBranchName(user.getBranchName().split("-")[1]);
				branchDtoObjList.add(branchDtoObj);
				alertDto.setBranchDtoList(branchDtoObjList);

				model.addAttribute("branchList", alertDto.getBranchDtoList());

			}
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", alertDto.getOfficeType());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "AlertRiskwiseReport";
	}

	// fetchRiskwiseAlertCountReport
	@RequestMapping(value = "/fetchRiskwiseAlertCountReport")
	@ResponseBody
	public OmsAlertMasterDto fetchRiskwiseAlertCountReport(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);

			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchRiskwiseAlertCountReportData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	@RequestMapping("/alertCategorywiseReport")
	public String alertCategorywiseReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
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
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("zoneList", alertDto.getBranchDtoList());
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", user.getOmsOfficeType());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "AlertCategorywiseReport";
	}

	// fetchCategorywiseAlertCountReport
	@RequestMapping(value = "/fetchCategorywiseAlertCountReport")
	@ResponseBody
	public OmsAlertMasterDto fetchCategorywiseAlertCountReport(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);

			if (alertDto.getSearchParam().equalsIgnoreCase("REGION")) {
				if ("All".equalsIgnoreCase(alertDto.getRegion())) {
					alertDto.setRegion(user.getHrmsRegion());
					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("ZONE")) {
				if ("All".equalsIgnoreCase(alertDto.getZone())) {
					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("BRANCH")) {
				if ("All".equalsIgnoreCase(alertDto.getBranchId())) {
					alertDto.setBranchId(user.getBranchId());
				}
			}

			respDto = commonUtility.objectToJson(alertDto);

			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchCategorywiseAlertCountReportData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	@RequestMapping("/agewiseAnalysisReport")
	public String agewiseAnalysisReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();

		try {

			alertDto.setSearchParam("zone");

			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			model.addAttribute("zoneList", alertDto.getBranchDtoList());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "AgewiseAnalysisReport";
	}

	// fetchAgeingReportDetails
	@RequestMapping(value = "/fetchAgeingReportDetails")
	@ResponseBody
	public OmsAlertMasterDto fetchAgeingReportDetails(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAgeingReportDetails, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	// Rule wise Excel Export

	@RequestMapping(value = "/exportRulewiseReport")
	public String exportRulewiseExcelReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchFreqWiseAllRuleListDetailsList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Rule Wise Execution Count Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			userDto.setSearchParam("ALERT COUNT REPORT");

			RuleExecutionExcelReport excelExporter = new RuleExecutionExcelReport(alertDto);

			excelExporter.export(response, userDto);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();

		}
		return "redirect:/ruleExecutionReport";

	}

	@RequestMapping(value = "/exportAlertCategorywiseReport")
	public String exportAlertCategorywiseReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchCategorywiseAlertCountReportData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Alert Category Wise Count Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			userDto.setSearchParam("ALERT CATEGORY WISE REPORT");

			AlertCategorywiseReportExcel excelExporter = new AlertCategorywiseReportExcel(alertDto);

			excelExporter.export(response, userDto);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();

		}
		return "redirect:/alertCategorywiseReport";

	}

	@RequestMapping(value = "/exportAlertRiskwiseReport")
	public String exportAlertRiskwiseReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchRiskwiseAlertCountReportData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Risk Wise Alert Count Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);

			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			userDto.setSearchParam("Risk Wise Alert Count Report");

			AlertRiskwiseExcelReport excelExporter = new AlertRiskwiseExcelReport(alertDto);

			excelExporter.export(response, userDto);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();

		}
		return "redirect:/alertRiskwiseReport";

	}

	// exportTATReport
	@RequestMapping(value = "/exportTATReport")
	public String exportTATReport(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAlertDetailsList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Closure Tat Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);

			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			userDto.setSearchParam("Closure Tat Report");

			ClosureTatReportExcel excelExporter = new ClosureTatReportExcel(alertDto);

			excelExporter.export(response, userDto);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();

		}
		return "redirect:/closureTatReport";

	}

	// exportRegionwiseReport
	@RequestMapping(value = "/exportRegionwiseReport")
	public String exportRegionwiseReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAgeingReportDetails, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Age Analysis Region Wise Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			userDto.setSearchParam("Age Analysis Region Wise Report");

			RegionWiseAgeAnalysisExcelReport excelExporter = new RegionWiseAgeAnalysisExcelReport(alertDto);

			excelExporter.export(response, userDto);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();

		}
		return "redirect:/agewiseAnalysisReport";

	}

	// exportBranchwiseReport
	@RequestMapping(value = "/exportBranchwiseReport")
	public String exportBranchwiseReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAgeingReportDetails, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Age Analysis Branch Wise Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			userDto.setSearchParam("Age Analysis Region Wise Report");

			BranchwiseAgeAnalysisExcelExport excelExporter = new BranchwiseAgeAnalysisExcelExport(alertDto);

			excelExporter.export(response, userDto);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();

		}
		return "redirect:/agewiseAnalysisReport";

	}

	// exportRulewiseAgegingReport
	@RequestMapping(value = "/exportRulewiseAgegingReport")
	public String exportRulewiseAgegingReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchAgeingReportDetails, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Age Analysis Rule Wise Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			userDto.setSearchParam("Age Analysis Rule Wise Report");

			RulewiseAgegingExcelExport excelExporter = new RulewiseAgegingExcelExport(alertDto);

			excelExporter.export(response, userDto);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();

		}
		return "redirect:/agewiseAnalysisReport";

	}

	@RequestMapping("/SelectReportsMainPage")
	public String selectReportsMainPage(@AuthenticationPrincipal User user,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, Model model) {

		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		try {
			ReportMasterDto reportDto = new ReportMasterDto();

			if (user.getModuleCode().equalsIgnoreCase("TM")) {
				reportDto.setReportModule("TRANSACTION MONITORING");
			} else if (user.getModuleCode().equalsIgnoreCase("SA")) {
				reportDto.setReportModule("SYSTEM ADMIN");
			} else if (user.getModuleCode().equalsIgnoreCase("RT")) {
				reportDto.setReportModule("REPORTS");
			}
			reportDto.setReportStatus("A");
			userDto.setUserOfficeType("CO");
			userDto.setSelectedOfcType(user.getSelectedOfficeType());
			userDto.setUserPosition(user.getUserPosition());
			userDto.setUserDept(user.getUserDept());
			reportDto.setUser(userDto);
			respDto = commonUtility.objectToJson(reportDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + reportsList, respDto));
			reportDto = objectMapper.readValue(respString, ReportMasterDto.class);
			model.addAttribute("incidentDto", reportDto);
		} catch (Exception e) {
			e.printStackTrace();
		}

		String redirectPage = "selectreportsmainpage";

		return redirectPage;
	}

	// consolidateReport
	@RequestMapping("/consolidateReport")
	public String consolidateReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
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
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("zoneList", alertDto.getBranchDtoList());
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", user.getOmsOfficeType());
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "ConsolidateReport";

	}

	// fetchConsolidatedReport
	@RequestMapping(value = "/fetchConsolidatedReport")
	@ResponseBody
	public OmsAlertMasterDto fetchConsolidatedReport(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);

			if (alertDto.getSearchParam().equalsIgnoreCase("REGION")) {
				if ("All".equalsIgnoreCase(alertDto.getRegion())) {
					alertDto.setRegion(user.getHrmsRegion());
					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("ZONE")) {
				if ("All".equalsIgnoreCase(alertDto.getZone())) {
					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("BRANCH")) {
				if ("All".equalsIgnoreCase(alertDto.getBranchId())) {
					alertDto.setBranchId(user.getBranchId());
				}
			}

			respDto = commonUtility.objectToJson(alertDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchConsolidatedReportList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	// exportBranchSummaryReport
	@RequestMapping(value = "/exportBranchSummaryReport")
	public String exportBranchSummaryReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes, HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {
			String pagevalJson = commonUtility.encryptedReqToString(request.getParameter("encryptedJson"));

			alertDto = objectMapper.readValue(pagevalJson, OmsAlertMasterDto.class);

			if (alertDto.getSearchParam().equalsIgnoreCase("REGION")) {
				if ("All".equalsIgnoreCase(alertDto.getRegion())) {
					alertDto.setRegion(user.getHrmsRegion());
					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("ZONE")) {
				if ("All".equalsIgnoreCase(alertDto.getZone())) {
					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("BRANCH")) {
				if ("All".equalsIgnoreCase(alertDto.getBranchId())) {
					alertDto.setBranchId(user.getBranchId());
				}
			}
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchConsolidatedReportList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Branch Summary Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			userDto.setSearchParam("Branch Summary Report");

			BranchSummaryExcelReport excelExporter = new BranchSummaryExcelReport(alertDto);

			excelExporter.export(response, userDto);

		} catch (Exception e) {
			e.printStackTrace();

		}
		return "redirect:/consolidateReport";

	}

	// romReport
	@RequestMapping("/romReport")
	public String romReport(@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();

		try {
			alertDto.setOfficeType(user.getOmsOfficeType());

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

				branchDtoObj.setBranchId(user.getBranchName().split("-")[0]);
				branchDtoObj.setBranchName(user.getBranchName().split("-")[1]);
				branchDtoObjList.add(branchDtoObj);
				alertDto.setBranchDtoList(branchDtoObjList);

			}
			model.addAttribute("zone", user.getHrmsZone());
			model.addAttribute("regionList", alertDto.getRegionDtoList());
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("zoneList", alertDto.getBranchDtoList());
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", user.getOmsOfficeType());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "RomReport";

	}

	// fetchRomReport
	@RequestMapping(value = "/fetchRomReport")
	@ResponseBody
	public RomReportDto fetchRomReport(HttpServletRequest request, Model model, @AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		RomReportDto romReportDto = new RomReportDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			romReportDto = objectMapper.readValue(pageValJson, RomReportDto.class);

			if (user.getOmsOfficeType().equalsIgnoreCase("Zone")) {
				if (romReportDto.getRegion().equalsIgnoreCase("All")) {
					romReportDto.setZone(user.getHrmsZone());
				}

			} else if (user.getOmsOfficeType().equalsIgnoreCase("REGION")) {
				if (romReportDto.getBranchId().equalsIgnoreCase("All")) {
					romReportDto.setRegion(user.getHrmsRegion());
					romReportDto.setZone(user.getHrmsZone());
				}

			}

			respDto = commonUtility.objectToJson(romReportDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRomReportDetails, respDto));
			romReportDto = objectMapper.readValue(respString, RomReportDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return romReportDto;
	}

	// exportROMReport
	@RequestMapping(value = "/exportROMReport")
	public String exportROMReport(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes, HttpServletRequest request) throws JsonProcessingException {

		final ObjectMapper objectMapper = new ObjectMapper();

		RomReportDto romReportDto = new RomReportDto();
		String requestString = "";

		try {
			String pagevalJson = commonUtility.encryptedReqToString(request.getParameter("encryptedJson"));

			romReportDto = objectMapper.readValue(pagevalJson, RomReportDto.class);

			if (user.getOmsOfficeType().equalsIgnoreCase("Zone")) {
				if (romReportDto.getRegion().equalsIgnoreCase("All")) {
					romReportDto.setZone(user.getHrmsZone());
				}

			} else if (user.getOmsOfficeType().equalsIgnoreCase("REGION")) {
				if (romReportDto.getBranchId().equalsIgnoreCase("All")) {
					romReportDto.setRegion(user.getHrmsRegion());
					romReportDto.setZone(user.getHrmsZone());
				}

			}
			respDto = commonUtility.objectToJson(romReportDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchRomReportDetails, respDto));
			romReportDto = objectMapper.readValue(respString, RomReportDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Staff_And_OBST_Report_" + currentDateTime + ".xlsx";

			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			userDto.setSearchParam("ROM Report");

			ROMReportExcel excelExporter = new ROMReportExcel(romReportDto);

			excelExporter.export(response, userDto);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();

		}
		return "redirect:/romReport";

	}

	@RequestMapping("/tatReport")
	public String tatReport(@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {

		AlertTatMasterDto tatAlertMasterDto = new AlertTatMasterDto();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String respString2 = "";
		try {

			if (user.getOmsOfficeType().equalsIgnoreCase("CENTRAL")) {
				alertDto.setSearchParam("zone");

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

				model.addAttribute("zoneList", alertDto.getBranchDtoList());

			} else if (user.getOmsOfficeType().equalsIgnoreCase("ZONE")) {
				tatAlertMasterDto.setZoneName(user.getHrmsZone());
				alertDto.setSearchParam("ZONE");
				alertDto.setZone(user.getHrmsZone());

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility.decryptedResToString(
						commonUtility.webserviceConsume(uri + fetchRegionByZoneNameListData, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

				model.addAttribute("regionList", alertDto.getRegionDtoList());

			} else if (user.getOmsOfficeType().equalsIgnoreCase("REGION")) {
				tatAlertMasterDto.setRegionName(user.getHrmsRegion());
				alertDto.setSearchParam("REGION");
				alertDto.setRegion(user.getHrmsRegion());

				respDto = commonUtility.objectToJson(alertDto);
				final String respString = commonUtility.decryptedResToString(
						commonUtility.webserviceConsume(uri + fetchBranchListByRegionNameDataList, respDto));
				alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

				model.addAttribute("branchList", alertDto.getBranchDtoList());

			} else if (user.getOmsOfficeType().equalsIgnoreCase("BRANCH")) {

				tatAlertMasterDto.setBranchId(user.getBranchId());
				alertDto.setSearchParam("BRANCH");
				OmsBranchMasterDto branchDtoObj = new OmsBranchMasterDto();
				List<OmsBranchMasterDto> branchDtoObjList = new ArrayList<>();

				branchDtoObj.setBranchId(user.getBranchName().split("-")[0]);
				branchDtoObj.setBranchName(user.getBranchName());
				branchDtoObjList.add(branchDtoObj);
				alertDto.setBranchDtoList(branchDtoObjList);

				model.addAttribute("branchList", alertDto.getBranchDtoList());

			}
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", alertDto.getSearchParam());

			respDto = commonUtility.objectToJson(tatAlertMasterDto);
			respString2 = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getBranchWiseTatData, respDto));
			tatAlertMasterDto = objectMapper.readValue(respString2, AlertTatMasterDto.class);
			model.addAttribute("tatAlertMasterDto", tatAlertMasterDto);
			model.addAttribute("user", user);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return "tatReport";
	}

	@RequestMapping(value = "/fetchBranchWiseReportCount")
	@ResponseBody
	public OmsAlertMasterDto fetchBranchWiseReportCount(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String respString = "";
		try {

			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchBranchWiseReportCount, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	@RequestMapping(value = "/fetchTatReportCount")
	@ResponseBody
	public AlertTatMasterDto fetchTatReportCount(@AuthenticationPrincipal User user, HttpServletRequest request)
			throws IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		AlertTatMasterDto tatAlertMasterDto = new AlertTatMasterDto();
		String respString = "";
		try {

			String pageValJson = request.getParameter("pageValJson");
			tatAlertMasterDto = objectMapper.readValue(pageValJson, AlertTatMasterDto.class);
			tatAlertMasterDto.setSearchParam("search");
			respDto = commonUtility.objectToJson(tatAlertMasterDto);
			respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getBranchWiseTatData, respDto));
			tatAlertMasterDto = objectMapper.readValue(respString, AlertTatMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return tatAlertMasterDto;
	}

	@RequestMapping("/GenerateReportRequest")
	public String getReportRequest(@ModelAttribute(name = "message") String message,
			@ModelAttribute(name = "source") String source, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		String sourceText = "";
		sourceText = source == null ? "" : source;
		String messageText = "";
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			// alertDto.setOfficeType(user.getOmsOfficeType());
			alertDto.setOfficeType("CENTRAL");
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

				branchDtoObj.setBranchId(user.getBranchName().split("-")[0]);
				branchDtoObj.setBranchName(user.getBranchName().split("-")[1]);
				branchDtoObjList.add(branchDtoObj);
				alertDto.setBranchDtoList(branchDtoObjList);

			}
			model.addAttribute("zone", user.getHrmsZone());
			model.addAttribute("regionList", alertDto.getRegionDtoList());
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("zoneList", alertDto.getBranchDtoList());
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", user.getOmsOfficeType());
			if (null != sourceText && sourceText.equals("REQUESTADD")) {
				messageText = "Request captured report will be sent on email";
			}
			model.addAttribute("message", messageText);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "reportRequestPage";
	}

	// saveComplianceReq
	@PostMapping("/addNewReportRequest")
	public String addNewReportRequest(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes)
			throws JsonProcessingException {

		String sourceTxt = "REQUESTADD";
		String requestString = "";
		ReportRequestMasterDto reportRequestMasterDto = new ReportRequestMasterDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		ResponseEntity<String> rasString = null;
		HttpHeaders resHeaders = null;
		try {
			// Encrypted JSON Request
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			reportRequestMasterDto = objectMapper.readValue(requestString, ReportRequestMasterDto.class);
			if ("NA".equalsIgnoreCase(reportRequestMasterDto.getZoneName())) {
				reportRequestMasterDto.setZoneName(user.getHrmsZone());
			}
			if ("NA".equalsIgnoreCase(reportRequestMasterDto.getRegionName())) {
				reportRequestMasterDto.setRegionName(user.getHrmsRegion());
				reportRequestMasterDto.setZoneName(user.getHrmsZone());
			}
			if ("NA".equalsIgnoreCase(reportRequestMasterDto.getBranchId())) {
				reportRequestMasterDto.setBranchId(user.getBranchId());
				reportRequestMasterDto.setRegionName(user.getHrmsRegion());
				reportRequestMasterDto.setZoneName(user.getHrmsZone());
			}
			reportRequestMasterDto.setEmail(user.getUserEmail());
			reportRequestMasterDto.setUserId(user.getUserId());
			respDto = commonUtility.objectToJson(reportRequestMasterDto);
			rasString = commonUtility.webserviceConsume(uri + addNewReportRequest, respDto);
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
		return "redirect:/GenerateReportRequest";

	}

	// VgoZoneWiseReport
	@RequestMapping("/VgdZoneWiseReport")
	public String VgdZoneWiseReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {

			alertDto.setSearchParam("zone");
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchDistinctZoneList, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);
			model.addAttribute("alertDto", alertDto);

			model.addAttribute("zoneList", alertDto.getBranchDtoList());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "VgdZoneWiseReport";
	}

	// fetchZoneWiseVgdReportDetails
	@RequestMapping(value = "/fetchZoneWiseVgdReportDetails")
	@ResponseBody
	public OmsAlertMasterDto fetchZoneWiseVgdReportDetails(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchZoneWiseVgdReportDetails, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	// exportVgdZoneWiseReport
	@RequestMapping(value = "/exportVgdZoneWiseReport")
	public OmsAlertMasterDto exportVgdZoneWiseReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);
			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + fetchZoneWiseVgdReportDetails, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Vgd zone Wise Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			// userDto.setSearchParam("Age Analysis Region Wise Report");

			VgdZoneWiseReportExcel excelExporter = new VgdZoneWiseReportExcel(alertDto);

			excelExporter.export(response, userDto);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	@RequestMapping("/officeWiseTatReport")
	public String OfficeWiseTatReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
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
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("zoneList", alertDto.getBranchDtoList());
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", user.getOmsOfficeType());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "TatReportOfficeWise";
	}

	@RequestMapping(value = "/fetchOfficeWideTatReport")
	@ResponseBody
	public OmsAlertMasterDto fetchOfficeWideTatReport(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);

			if (alertDto.getSearchParam().equalsIgnoreCase("REGION")) {
				if ("All".equalsIgnoreCase(alertDto.getRegionName())) {
					alertDto.setRegion(user.getHrmsRegion());
					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("ZONE")) {
				if ("All".equalsIgnoreCase(alertDto.getZoneName())) {

					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("BRANCH")) {
				if ("All".equalsIgnoreCase(alertDto.getBranchId())) {
					alertDto.setBranchId(user.getBranchId());
				}
			}

			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchOfficeWideTatReportData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	@RequestMapping(value = "/exportOfficeWideTatReport")
	public OmsAlertMasterDto exportOfficeWideTatReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes, HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();

		try {
			String pagevalJson = commonUtility.encryptedReqToString(request.getParameter("encryptedJson"));
			System.out.println("pagevalJson :" + pagevalJson);
			alertDto = objectMapper.readValue(pagevalJson, OmsAlertMasterDto.class);

			if (alertDto.getSearchParam().equalsIgnoreCase("REGION")) {
				if ("All".equalsIgnoreCase(alertDto.getRegionName())) {
					alertDto.setRegion(user.getHrmsRegion());
					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("ZONE")) {
				if ("All".equalsIgnoreCase(alertDto.getZoneName())) {

					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("BRANCH")) {
				if ("All".equalsIgnoreCase(alertDto.getBranchId())) {
					alertDto.setBranchId(user.getBranchId());
				}
			}

			respDto = commonUtility.objectToJson(alertDto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchOfficeWideTatReportData, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Office Wise Tat Report_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			TatReportOfficeWise tatReportOfficeWise = new TatReportOfficeWise(alertDto);
			tatReportOfficeWise.export(response, userDto);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

	// romReport
	@RequestMapping("/branchTatReport")
	public String branchTatReport(@AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes) {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();

		try {
			alertDto.setOfficeType(user.getOmsOfficeType());

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

				branchDtoObj.setBranchId(user.getBranchId());
				branchDtoObj.setBranchName(user.getBranchName());
				branchDtoObjList.add(branchDtoObj);
				alertDto.setBranchDtoList(branchDtoObjList);

			}
			HashMap<String, List<String>> verticalList = new HashMap<>();
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchVerticalList, respDto));
			verticalList = objectMapper.readValue(respString, new TypeReference<HashMap<String, List<String>>>() {
			});

			model.addAttribute("zone", user.getHrmsZone());
			model.addAttribute("regionList", alertDto.getRegionDtoList());
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("branchList", alertDto.getBranchDtoList());
			model.addAttribute("zoneList", alertDto.getBranchDtoList());
			model.addAttribute("alertDto", alertDto);
			model.addAttribute("searchParam", user.getOmsOfficeType());
			model.addAttribute("vertical", verticalList.get("Vertical"));
			model.addAttribute("year", verticalList.get("Year"));

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "branchTatReportPage";

	}

	// fetchRomReport
	@RequestMapping(value = "/fetchBranchTatReport")
	@ResponseBody
	public OmsAlertMasterDto fetchBranchTatReport(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();

		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			alertDto = objectMapper.readValue(pageValJson, OmsAlertMasterDto.class);
			System.out.println(alertDto.getSearchParam());
			if (alertDto.getSearchParam().equalsIgnoreCase("REGION")) {
				if ("All".equalsIgnoreCase(alertDto.getRegion())) {
					alertDto.setRegion(user.getHrmsRegion());
					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("ZONE")) {
				if ("All".equalsIgnoreCase(alertDto.getZone())) {
					alertDto.setZone(user.getHrmsZone());
				}
			}
			if (alertDto.getSearchParam().equalsIgnoreCase("BRANCH")) {
				if ("All".equalsIgnoreCase(alertDto.getBranchId())) {
					alertDto.setBranchId(user.getBranchId());
				}
			}

			respDto = commonUtility.objectToJson(alertDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchBranchTATReport, respDto));
			alertDto = objectMapper.readValue(respString, OmsAlertMasterDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return alertDto;
	}

	@RequestMapping(value = "/exportBrancheTatReport")
	public OmsAlertMasterDto exportBrancheTatReport(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletResponse response, @AuthenticationPrincipal User user, Model model,
			RedirectAttributes redirectAttributes, HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
		String requestString = "";
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			alertDto = objectMapper.readValue(requestString, OmsAlertMasterDto.class);

			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());

			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=Tat_Report_For_" + alertDto.getStartDate() + "_"
					+ alertDto.getEndDate() + ".xlsx";
			response.setHeader(headerKey, headerValue);
			UserDto userDto = new UserDto();
			userDto.setUserId(user.getUserId());
			userDto.setBranchId(user.getBranchId());
			userDto.setBranchName(user.getBranchName());
			userDto.setUsername(user.getUsername());

			BranchWiseTatReportExcel tatReportOfficeWise = new BranchWiseTatReportExcel(alertDto);
			tatReportOfficeWise.export(response, userDto);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return alertDto;
	}

}
