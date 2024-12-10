package com.idbi.intech.aml.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.CardListTransactionDto;
import com.idbi.intech.aml.domain.app.CardTransactionDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class CardTransactionController {

	@Value("${app-url.uri}")
	private String uri;

	@Value("${app-url.viewModel}")
	private String viewModel;
	
	@Value("${app-url.context-path}")
	private String contextPath;

	RequestResponseJsonDto respDto = null;

	@Autowired
	private CommonUtility commonUtility;

	@GetMapping("/cardTransaction")
	public String cardTransactions(@AuthenticationPrincipal User user, Model model, HttpSession session)
			throws JsonProcessingException {

		return "cardTransaction";

	}

	@RequestMapping("/viewTransactionModel")
	@ResponseBody
	public CardListTransactionDto viewModel(HttpServletRequest request, Model model,
			@AuthenticationPrincipal User user) {
		final ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		CardTransactionDto dto = new CardTransactionDto();
		CardListTransactionDto dtoList = new CardListTransactionDto();
		try {
			String pageValJson = request.getParameter("pageValJson");

			dto = objectMapper.readValue(pageValJson, CardTransactionDto.class);

			respDto = commonUtility.objectToJson(dto);

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + contextPath + viewModel, respDto));
			dtoList = objectMapper.readValue(respString, CardListTransactionDto.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dtoList;
	}

}
