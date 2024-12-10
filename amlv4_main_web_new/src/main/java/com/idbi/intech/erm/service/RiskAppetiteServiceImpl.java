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
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.DepartmentMasterDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.RiskAppetiteMasterDto;
import com.idbi.intech.erm.util.CommonUtility;

@Service
public class RiskAppetiteServiceImpl implements RiskAppetiteService {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.viewModalRaUserDept}")
	private String viewModalRaUserDept;


	RequestResponseJsonDto respDto = null;
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	// SessionKeyEncryptor Object
	@Autowired
	private SessionKeyEncryptorService sessionKeyEncrypt;

	public RiskAppetiteMasterDto fetchDetails(RiskAppetiteMasterDto riskAppDto)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			respDto = commonUtility.objectToJson(riskAppDto);
			// send request for closing risk appetite
			
			final String respString = commonUtility.decryptedResToString(commonUtility.webserviceConsume(uri+viewModalRaUserDept, respDto));
			riskAppDto = objectMapper.readValue(respString, RiskAppetiteMasterDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

		}
		return riskAppDto;
	}

}
