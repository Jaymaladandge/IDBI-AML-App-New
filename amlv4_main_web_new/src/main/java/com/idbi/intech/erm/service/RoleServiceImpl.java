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

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.RoleMasterDto;
import com.idbi.intech.erm.util.CommonUtility;

@Service
public class RoleServiceImpl implements RoleService{
	
	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;
	
	
	RequestResponseJsonDto respDto = null;
	// private for erm application
	
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.viewModalRole}")
	private String viewModalRole;
	

	@Override
	public RoleMasterDto fetchDetails(RoleMasterDto roleDto)
			throws JsonParseException, JsonMappingException, IOException {
		
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			
			respDto = commonUtility.objectToJson(roleDto);
			
			final String respString = commonUtility.decryptedResToString(commonUtility.webserviceConsume(uri+viewModalRole, respDto));
			roleDto = objectMapper.readValue(respString, RoleMasterDto.class);
			
		}catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			
					e.printStackTrace();
		}
		
		
		return roleDto;
	}

}
