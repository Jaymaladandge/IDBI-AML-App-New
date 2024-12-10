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

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
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
import com.idbi.intech.erm.domain.app.DepartmentMasterDto;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.OtpGerneratorDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class OtpGeneratorController {
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.otpGeneratorById}")
	private String otpGeneratorById;
	@Value("${app-url.otpValidate}")
	private String otpValidate;
	@Value("${app-url.resendOtpById}")
	private String resendOtpById;
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;
	@Autowired
	private CommonUtility commonUtility;
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	
	
	RequestResponseJsonDto respDto = null;
	
	@RequestMapping("/generateOtp")
	public String generateOtp(@AuthenticationPrincipal User user, RedirectAttributes redirectAttributes,
			Model model) throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException,
			NoSuchPaddingException, CertificateException, KeyStoreException, IllegalBlockSizeException,
			BadPaddingException, NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		
	OtpGerneratorDto otpDto=new OtpGerneratorDto();
	otpDto.setOtpId(pkGenerator.getAppPrimaryKey());
	model.addAttribute("otpId",otpDto.getOtpId());
	model.addAttribute("otpDto",otpDto);
	//System.out.println(user.isHrmsFlg());
	model.addAttribute("hrmsFlg",user.isHrmsFlg());
	
	if(user.isHrmsFlg()) {
	List<DepartmentMasterDto> deptListMaster = new ArrayList<DepartmentMasterDto>();
	List<DepartmentMasterDto> deptList = new ArrayList<DepartmentMasterDto>();
	
	deptListMaster= commonUtility.fetchDeptList();
	deptList.addAll(deptListMaster);
	model.addAttribute("deptList",deptList);
	}
	else {
		model.addAttribute("deptId",user.getUserDept());
	}

	
		
		
		return "generateOtp";

	}
	
	@RequestMapping("/validateOtp")
	public String validateOtp(@RequestParam(value = "message", required = false, defaultValue = "") String message,
			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			@AuthenticationPrincipal User user, @ModelAttribute(name = "source") String source, Model model, RedirectAttributes redirectAttributes) throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException,
			NoSuchPaddingException, CertificateException, KeyStoreException, IllegalBlockSizeException,
			BadPaddingException, NoSuchProviderException, InvalidAlgorithmParameterException, IOException {
		HttpHeaders resHeaders = null;
		OtpGerneratorDto otpDto = new OtpGerneratorDto();
		final ObjectMapper objectMapper = new ObjectMapper();
		String otpString = null;

		String requestString = "";
		String redirectPage="";
		try {
			// Encrypted JSON Request

			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			otpDto = objectMapper.readValue(requestString, OtpGerneratorDto.class);
			otpDto.setEmailId(user.getUserEmail());
			otpDto.setHrmsFlg(user.isHrmsFlg());
			if(user.isHrmsFlg()) {
				otpDto.setOfficeCode(user.getOfficeCode());
				otpDto.setUserOfficeType(user.getUserOfficeType().toUpperCase());
			}
			respDto = commonUtility.objectToJson(otpDto);

			// User Validation
			otpString =  commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + otpValidate, respDto));
			otpDto = objectMapper.readValue(otpString, OtpGerneratorDto.class);
			model.addAttribute("hrmsFlg",user.isHrmsFlg());
			if(otpDto.getOtpRequestStatus().equals("00")) {
				user.setIsAdStatus("");
				redirectPage="redirect:/RolePage";
			}
			else if(otpDto.getOtpRequestStatus().equals("01")) {
				
				otpDto.setOtpId(pkGenerator.getAppPrimaryKey());
				model.addAttribute("otpId",otpDto.getOtpId());
				redirectPage="generateOtp";
			}
			else if(otpDto.getOtpRequestStatus().equals("02")){
				otpDto.setOtpId(pkGenerator.getAppPrimaryKey());
				model.addAttribute("otpId",otpDto.getOtpId());
				redirectPage="generateOtp";
			}
			else if(otpDto.getOtpRequestStatus().equals("03")){
				 //System.out.println(otpDto.getOtpRequestStatus());
				 //System.out.println(otpDto.getOtpMessage());
				otpDto.setOtpId(pkGenerator.getAppPrimaryKey());
				model.addAttribute("otpId",otpDto.getOtpId());
				redirectPage="generateOtp";
			}
			else {
				redirectPage="generateOtp";
			}
			 if(!otpDto.getOtpRequestStatus().equals("00")) {
					if(user.isHrmsFlg()) {
						List<DepartmentMasterDto> deptListMaster = new ArrayList<DepartmentMasterDto>();
						List<DepartmentMasterDto> deptList = new ArrayList<DepartmentMasterDto>();
						
						deptListMaster= commonUtility.fetchDeptList();
						deptList.addAll(deptListMaster);
						model.addAttribute("deptList",deptList);
						}
						else {
							model.addAttribute("deptId",user.getUserDept());
						}
			 }
			
			model.addAttribute("otpDto",otpDto);
			
			
			//resHeaders = otpString.getHeaders();
			// Logger needs to ADD
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 

		
		return redirectPage;

		
	}
	
	@RequestMapping("/otpGeneratorById")
	@ResponseBody
	public OtpGerneratorDto sendOTP(@AuthenticationPrincipal User user,
			RedirectAttributes redirectAttributes,

			@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest, HttpServletRequest request,
			Model model) throws JsonProcessingException {
		final ObjectMapper objectMapper = new ObjectMapper();
		
		OtpGerneratorDto otpDto = new OtpGerneratorDto();
		try {
			String pageValJson = request.getParameter("pageValJson");
			otpDto = objectMapper.readValue(pageValJson, OtpGerneratorDto.class);
			
			otpDto.setEmailId(user.getUserEmail());
			respDto = commonUtility.objectToJson(otpDto);
			
			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + otpGeneratorById, respDto));
			otpDto = objectMapper.readValue(respString, OtpGerneratorDto.class);
		
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

			e.printStackTrace();
		}
		
		return otpDto;
	}
	
		

	
}
