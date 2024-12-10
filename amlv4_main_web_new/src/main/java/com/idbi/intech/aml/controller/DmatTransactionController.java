package com.idbi.intech.aml.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.DmatClientDto;
import com.idbi.intech.aml.domain.app.DmatTransactionDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class DmatTransactionController {

	@Value("${app-url.uri}")
	private String uri;

	@Value("${app-url.viewDmatModel}")
	private String viewDmatModel;

	@Value("${app-url.context-path}")
	private String contextPath;

	@Value("${app-url.viewDmatAccountModel}")
	private String viewDmatAccountModel;

	RequestResponseJsonDto respDto = null;

	@Autowired
	private CommonUtility commonUtility;

	@RequestMapping("/viewDmatTransactionModel")
	@ResponseBody
	public DmatClientDto viewModel(HttpServletRequest request, Model model, @AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		DmatClientDto dto = new DmatClientDto();

		try {
			String pageValJson = request.getParameter("pageValJson");

			dto = objectMapper.readValue(pageValJson, DmatClientDto.class);

			respDto = commonUtility.objectToJson(dto);
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + viewDmatModel, respDto));
			dto = objectMapper.readValue(respString, DmatClientDto.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dto;
	}

	@RequestMapping("/viewDmatAccountModel")
	@ResponseBody
	public DmatTransactionDto viewAccountModel(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		DmatClientDto dto = new DmatClientDto();
		DmatTransactionDto tranDto = new DmatTransactionDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			dto = objectMapper.readValue(pageValJson, DmatClientDto.class);

			respDto = commonUtility.objectToJson(dto);

			final String respString = commonUtility.decryptedResToString(
					commonUtility.webserviceConsume(uri + contextPath + viewDmatAccountModel, respDto));
			tranDto = objectMapper.readValue(respString, DmatTransactionDto.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return tranDto;
	}
}
