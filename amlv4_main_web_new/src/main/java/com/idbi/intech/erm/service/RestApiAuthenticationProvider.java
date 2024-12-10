package com.idbi.intech.erm.service;

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
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.OfficeMasterDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.Role;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.erm.util.AesUtil;
import com.idbi.intech.erm.util.CommonUtility;

/**
 * Authentication provider class for managing authentication using RestFul API
 * 
 * @author arnoldanthony
 *
 */
@Component
public class RestApiAuthenticationProvider implements AuthenticationProvider {

	@Value("${url.validate}")
	private static String validateService;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.validate-user}")
	private String validateUser;
	@Value("${erm-title.title}")
	private String ermTitle;
	@Value("${app-url.fetchofficeType}")
	private String fetchofficeType;
	// logger object
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;

	@Autowired
	private Role role;

	@Autowired
	private CommonUtility commonUtility;

	RestTemplate rest = new RestTemplate();

	/**
	 * @author arnoldanthony This method returns object of authentication after
	 *         validating the user using RESTFul API
	 */
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		logger.debug("Authnetication | Inside authenticate() | " + new Date());

		RequestResponseJsonDto respDto = null;

		UserDto userDto = new UserDto();
		User userCred = new User();
		String password = authentication.getCredentials().toString();

		String userArr[] = authentication.getName().split(":~:");
		String username = userArr[0];
		String userOfficeType = userArr[1];
		String deviceToken = userArr[2];

		try {
			commonUtility.encryptedReqToString(password);
			int iterationCount = 1000;
			int keySize = 128;

			AesUtil aesUtil = new AesUtil(keySize, iterationCount);

			String credArr[] = password.split(":~:");
			userCred.setUserId(aesUtil.decrypt(credArr[1], username));
			userCred.setUserOfficeType(aesUtil.decrypt(credArr[1], userOfficeType));
			String passTxt = "";
			String passArray[] = aesUtil.decrypt(credArr[1], credArr[0]).split(",");

			for (int i = 1; i < passArray.length; i++) {
				passTxt += aesUtil.decrypt(passArray[0], passArray[i]);
			}
 			userCred.setPassword(passTxt); 
			if (aesUtil.decrypt(credArr[1], userOfficeType).equalsIgnoreCase("")) {
				final ObjectMapper objectMapper = new ObjectMapper();

				OfficeMasterDto officeMaster = new OfficeMasterDto();
				officeMaster.setUserId(userCred.getUserId());
				respDto = commonUtility.objectToJson(officeMaster);
				final String responsString = commonUtility
						.decryptedResToString(commonUtility.webserviceConsume(uri + fetchofficeType, respDto));
				officeMaster = objectMapper.readValue(responsString, OfficeMasterDto.class);
				userCred.setUserOfficeType(officeMaster.getOfficeType());
			} else {
				userCred.setUserOfficeType(aesUtil.decrypt(credArr[1], userOfficeType));
			}
			userDto.setDeviceToken(deviceToken);
			userDto.setUserId(userCred.getUserId());
			userDto.setUserOfficeType(userCred.getUserOfficeType());
			userDto.setPassword(userCred.getPassword());
			userDto.setUserSession(RequestContextHolder.currentRequestAttributes().getSessionId());
			respDto = commonUtility.objectToJson(userDto);

			final ObjectMapper objectMapper = new ObjectMapper();
			// User Validation
			final String userString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + validateUser, respDto));

			userDto = objectMapper.readValue(userString, UserDto.class);
			// User Validation
			if (userDto.getRequestStatus().equals("00")) {
				// setting values in required format of Spring security
				userCred.setUserId(userDto.getUserId().toUpperCase());
				userCred.setUsername(userDto.getUsername().toLowerCase());
				userCred.setEnabled(true);
				userCred.setUserCurrentLoginTime(userDto.getUserCurrentLoginTime());
				userCred.setUserFailLoginAttempt(userDto.getUserFailLoginAttempt());
				userCred.setNtf15Days(userDto.getNtf15Days());
				userCred.setUserRegion(userDto.getUserRegion());
				userCred.setUserVertical(userDto.getVertical());
				userCred.setVertical(userDto.getVertical());
				userCred.setSupEin(userDto.getSupEin());
				userCred.setSupFullName(userDto.getSupFullName());
				userCred.setZone(userDto.getUserZone());
				userCred.setOmsOfficeType(userDto.getOmsOfficeType());
				userCred.setOmsUserPosition(userDto.getOmsUserPosition());
				userCred.setBranchName(userDto.getBranchName());
				userCred.setLocationName(userDto.getLocationName().toLowerCase());
				userCred.setHrmsRegion(userDto.getHrmsRegion());
				userCred.setHrmsZone(userDto.getHrmsZone());
				userCred.setAdminFlg(userDto.getAdminFlg());
				userCred.setMailContent(userDto.getMailContent());
				if (userDto.getUserDept() != null) {
					userCred.setUserDept(userDto.getUserDept().toLowerCase());
				}
				userCred.setUserEmail(userDto.getUserEmail());
				userCred.setUserMobile(userDto.getUserMobile());
				userCred.setUserPosition(userDto.getUserPosition());
				if (userDto.getUserOffice() != null) {
					userCred.setUserOffice(userDto.getUserOffice());
				}
				userCred.setUserOfficeType(userDto.getBranchId());
				userCred.setUserDeptName(userDto.getUserDeptName());
				userCred.setSelectedOfficeType(userDto.getSelectedOfcType());
				userCred.setOfficeCode(userDto.getOfficeCode());
				userCred.setUserSession(userDto.getUserSession());
				userCred.setDeviceToken(deviceToken);
				if (userDto.getBranchId() != null) {
					userCred.setBranchId(userDto.getBranchId());
				}

				if (userDto.getOfficePinCode() != null) {
					userCred.setOfficePinCode(userDto.getOfficePinCode());
				}

				if (userDto.getUserValidateRequestStatus() != null) {
					userCred.setUserValidateRequestStatus(userDto.getUserValidateRequestStatus());
				}
				userCred.setUserSupRole("102699");
				userCred.setIsAdStatus(userDto.getIsAdStatus());
				userCred.setHrmsFlg(userDto.isHrmsFlg());
				userCred.setChannelCode(userDto.getChannelCode());
				userCred.setChannelId(userDto.getChannelId());
				userCred.setRequestStatus(userDto.getRequestStatus());
				if (userDto.getRoleNameList() != null) {
					userCred.setRoleNameList(userDto.getRoleNameList());

				}
				if (!userDto.getMaintenanceDtoList().isEmpty()) {
					if (userDto.getMaintenanceDtoList() != null) {

						userCred.setMaintenanceDtoList(userDto.getMaintenanceDtoList());
						userCred.setStartDate(userDto.getMaintenanceDtoList().get(0).getStartDate());
						userCred.setStartTime(userDto.getMaintenanceDtoList().get(0).getStartTime());
						userCred.setEndDate(userDto.getMaintenanceDtoList().get(0).getEndDate());
						userCred.setEndTime(userDto.getMaintenanceDtoList().get(0).getEndTime());
						userCred.setMassegeColor(userDto.getMaintenanceDtoList().get(0).getMassegeColor());
					}
				}

				// Role Menu Map
				if (userDto.getMenuMapList() != null) {
					userCred.setMenuMapList(userDto.getMenuMapList());
				}
				if (userDto.getAllRolesDtoList() != null) {
					userCred.setAllRolesDtoList(userDto.getAllRolesDtoList());
				}
				if (userDto.getRoleModuleMap() != null) {
					userCred.setRoleModuleMap(userDto.getRoleModuleMap());
				}
				if (userDto.getEmailFlgStatus() != null) {
					userCred.setEmailFlgStatus(userDto.getEmailFlgStatus());
				}
				if (userDto.getDefaultRoleList() != null) {
					userCred.setDefaultRoleList(userDto.getDefaultRoleList());
				}
				if (userDto.getSwitchAccessFlg() != null) {
					if (userDto.getSwitchAccessFlg().equalsIgnoreCase("Y")) {
						userCred.setSwitchAccessFlg(true);
					} else {
						userCred.setSwitchAccessFlg(false);
					}

				}
				if (userDto.getModuleDtoList() != null) {
					userCred.setModuleDtoList(userDto.getModuleDtoList());

				}
				userCred.setErmTitle(ermTitle);

				role.setName("ROLE_USER");

				List<Role> roles = new ArrayList<>();

				roles.add(role);

				userCred.setAuthorities(roles);
				Collection<? extends GrantedAuthority> authorities = userCred.getAuthorities();

				return new UsernamePasswordAuthenticationToken(userCred, userDto.getPassword(), authorities);

			} else {
				userCred.setUserId(userDto.getUserId().toUpperCase());
				userCred.setRequestStatus(userDto.getRequestStatus());
				role.setName("ROLE_USER");

				List<Role> roles = new ArrayList<Role>();

				roles.add(role);

				userCred.setAuthorities(roles);
				Collection<? extends GrantedAuthority> authorities = userCred.getAuthorities();

				return new UsernamePasswordAuthenticationToken(userCred, userDto.getPassword(), authorities);
				// throw new BadCredentialsException("Authentication failed");
			}
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
			throw new BadCredentialsException("Authentication failed");
		}

	}

	@Override
	public boolean supports(Class<?> authentication) {
		return true;
	}

}
