package com.idbi.intech.erm.controller;

import java.io.IOException;
import java.security.Security;

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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.HomeDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class homeAction {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;

	RequestResponseJsonDto respDto = null;

	@Autowired
	private CommonUtility commonUtility;

	@PostMapping("/homeAction")
	public String homeActionDistribution(
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes, HttpSession session) {
		HomeDto homeDto = new HomeDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String requestString = "";

		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			homeDto = objectMapper.readValue(requestString, HomeDto.class);

			if ("Action Plan".equalsIgnoreCase(homeDto.getModuleName())) {
				if ("AQ".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "Update Action Plan");
					redirectAttributes.addFlashAttribute("actionId", homeDto.getModuleId());
					return "redirect:/fetchAactionPlanData";
				}
				if ("AX".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "Update Action Plan");
					redirectAttributes.addFlashAttribute("actionId", homeDto.getModuleId());
					return "redirect:/fetchCloseAactionPlanData";
				}
			} else if ("User Master".equalsIgnoreCase(homeDto.getModuleName())) {
				if ("CR".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "create");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/ReviewUser";
				}
				if ("ER".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "edit");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/ReviewEditUser";
				} else if ("EZ".equalsIgnoreCase(homeDto.getModuleAction())
						|| "ZR".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "editlistUser");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/editlistUser";
				}

			} else if ("ROLE MASTER".equalsIgnoreCase(homeDto.getModuleName())) {

				if ("CR".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "create");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/actionRole";
				} else if ("ER".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "editverify");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/actionRole";
				} else if ("ZR".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "createRejectRM");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/editRejectRole";
				} else if ("EZ".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "editRejectRM");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/editRejectRole";
				}

			} else if ("App Parameter".equalsIgnoreCase(homeDto.getModuleName())) {

				if ("CR".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "create");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/reviewParameter";
				}
				if ("ER".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "edit");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/reviewEditParameter";
				} else if ("EZ".equalsIgnoreCase(homeDto.getModuleAction())
						|| "ZR".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "editlistUser");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/editParameter";
				}
			} else if ("Menu Master".equalsIgnoreCase(homeDto.getModuleName())) {
				if ("CR".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "create");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/actionMenu";
				}
				if ("ER".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "edit");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/actionMenu";
				} else if ("ZR".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "createReject");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/createRejectMenu";
				} else if ("EZ".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "editReject");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/createRejectMenu";
				}
			} else if ("FEEDBACK".equalsIgnoreCase(homeDto.getModuleName())) {

				if ("O".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "Feedback");
					redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
					return "redirect:/viewFeedback";
				}

			} else if ("TRANSACTION MONITORING".equalsIgnoreCase(homeDto.getModuleName())) {
				String returnPage = "";
				String sourceName = "";
				if ("AI".equalsIgnoreCase(homeDto.getModuleAction())) {
					sourceName = "alertInvestigate";
					returnPage = "redirect:/alertInvestigate";
				}
				redirectAttributes.addFlashAttribute("sourceName", sourceName);
				redirectAttributes.addFlashAttribute("sourceId", homeDto.getModuleId());
				redirectAttributes.addFlashAttribute("ruleId", homeDto.getRuleId());
				redirectAttributes.addFlashAttribute("alertStatus", homeDto.getAlertStatus());
				return returnPage;
			}else if ("LQTS".equalsIgnoreCase(homeDto.getModuleName())) {
				if ("O".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("sourceName", "Modify Query");
					redirectAttributes.addFlashAttribute("moduleId", homeDto.getModuleId());
					return "redirect:/viewAssignedQuery";
				}
				else if ("E".equalsIgnoreCase(homeDto.getModuleAction())) {
					redirectAttributes.addFlashAttribute("action", "Verify Query");
					redirectAttributes.addFlashAttribute("moduleId", homeDto.getModuleId());
					return "redirect:/actionAssignedQuery";
				}
			}

		} catch (IOException e) {
			e.printStackTrace();
		} 
		return "redirect:/home";
	}

	@RequestMapping(value = "/addSessionFunction")
	@ResponseBody
	public String addSessionFunction(HttpServletRequest request, Model model, HttpSession session,
			@AuthenticationPrincipal User user) throws IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			userDto = objectMapper.readValue(pageValJson, UserDto.class);
			respDto = commonUtility.objectToJson(userDto);
			user.setUserPosition(userDto.getRoleName());
			user.setModuleCode(userDto.getModuleCode());
			session.setAttribute("rolePosition", userDto.getRoleName());
			session.setAttribute("moduleCode", userDto.getModuleCode());

		} catch (Exception e) {

			e.printStackTrace();
		}

		return "header";
	}

	@RequestMapping(value = "/removeSessionFunction")
	@ResponseBody
	public String removeSessionFunction(HttpServletRequest request, Model model, HttpSession session,
			@AuthenticationPrincipal User user) throws  IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		UserDto userDto = new UserDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			userDto = objectMapper.readValue(pageValJson, UserDto.class);
			respDto = commonUtility.objectToJson(userDto);
			user.setUserPosition("");
			user.setModuleCode("");
			session.removeAttribute("rolePosition");
			session.removeAttribute("moduleCode");
		} catch (Exception e) {

			e.printStackTrace();
		}

		return "header";
	}

}
