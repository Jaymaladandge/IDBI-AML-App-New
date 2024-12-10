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
import javax.servlet.http.HttpSession;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.util.CommonUtility;
import com.idbi.intech.oms.domain.app.OmsAlertMasterDto;
import com.idbi.intech.oms.domain.app.OmsAuditDto;

@Controller
public class DashBoardCntroller {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Value("${app-url.uri}")
	private String uri;
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	@Autowired
	private CommonUtility commonUtility;
	RequestResponseJsonDto respDto = null;
	@Value("${app-url.getZoneWiseAlertCount}")
	private String getZoneWiseAlertCount;

	@RequestMapping(value = "/viewVigilanceReport")
	public String viewVigilanceReport(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, Model model, RedirectAttributes redirectAttributes, HttpSession session,
			@ModelAttribute(name = "source") String source) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		String returnPage = "";
		OmsAlertMasterDto alertdto = new OmsAlertMasterDto();
		List<String> zoneCountListForPie = new ArrayList<>();
		try {
			alertdto.setCustVertical(user.getVertical());
			alertdto.setAuditSearchParam("VgdMonitoring");
			alertdto.setSearchParam("fetch");
			alertdto.setUserPosition(user.getUserPosition());
			alertdto.setSourceTxt(user.getOmsUserPosition());
			respDto = commonUtility.objectToJson(alertdto);
			final String respString2 = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + getZoneWiseAlertCount, respDto));
			alertdto = objectMapper.readValue(respString2, OmsAlertMasterDto.class);

			for (OmsAuditDto auditDtoList : alertdto.getZoneAlertCountList()) {
				zoneCountListForPie.add(auditDtoList.getZoneName().toUpperCase() + "~" + auditDtoList.getTotalCount());
			}

			model.addAttribute("zoneCountListForPie", zoneCountListForPie);
			model.addAttribute("zoneCount", alertdto);
			model.addAttribute("defaultRole", user.getDefaultRoleList());

			returnPage = "HOVigilanceDashboard";
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			e.printStackTrace();
		}
		return returnPage;
	}

}
