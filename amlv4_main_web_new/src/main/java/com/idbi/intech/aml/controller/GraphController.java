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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.GraphDto;
import com.idbi.intech.aml.domain.app.RegReportDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class GraphController {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.fetchGraphData}")
	private String fetchGraphData;
	@Value("${app-url.fetchGraphTranDetails}")
	private String fetchGraphTranDetails;
	
	
	
	RequestResponseJsonDto respDto = null;

	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;
	@Autowired
	private CommonUtility commonUtility;

	@RequestMapping("/mainGraphPage") // inital
	public String fetchGraphDtls(@AuthenticationPrincipal User user, Model model, HttpSession session)
			throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		GraphDto graphDto = new GraphDto();

		try {
			// System.out.println("alert");
			respDto = commonUtility.objectToJson(graphDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchGraphData, respDto));
			graphDto = objectMapper.readValue(respString, GraphDto.class);

			model.addAttribute("debt3mnthList", graphDto.getDebt3MonthList());
			model.addAttribute("debt3mnthList12", graphDto.getTranChannelDebit());
			model.addAttribute("credit3mnthList", graphDto.getCredit3MonthList());
			model.addAttribute("credit3mnthList12", graphDto.getTranChannelCredit());
			model.addAttribute("labelList", graphDto.getLabelList());
			model.addAttribute("trendChartCredDebt", graphDto.getTrendChartCredDebt());
			
			

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "graphReportPage";

	}
	
	@RequestMapping("/fetchGraphDetails") // onclick of get report
	@ResponseBody
	public GraphDto fetchGraphDetailsList(@AuthenticationPrincipal User user, Model model, HttpSession session,
			HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		// System.out.println("fetchUserReportN");

		// System.out.println(user.getOmsUserPosition());
		GraphDto graphDto = new GraphDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			graphDto = objectMapper.readValue(pageValJson, GraphDto.class);

			respDto = commonUtility.objectToJson(graphDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchGraphData, respDto));
			graphDto = objectMapper.readValue(respString, GraphDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return graphDto;

	}	
	
	//fetchGraphTranDtls	
	@RequestMapping("/fetchGraphTranDtls") // onclick of get report
	@ResponseBody
	public GraphDto fetchGraphTranDtlsList(@AuthenticationPrincipal User user, Model model, HttpSession session,
			HttpServletRequest request) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		// System.out.println("fetchUserReportN");

		// System.out.println(user.getOmsUserPosition());
		GraphDto graphDto = new GraphDto();

		try {
			String pageValJson = request.getParameter("pageValJson");
			graphDto = objectMapper.readValue(pageValJson, GraphDto.class);

			respDto = commonUtility.objectToJson(graphDto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + fetchGraphTranDetails, respDto));
			graphDto = objectMapper.readValue(respString, GraphDto.class);

		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}

		return graphDto;

	}

}
