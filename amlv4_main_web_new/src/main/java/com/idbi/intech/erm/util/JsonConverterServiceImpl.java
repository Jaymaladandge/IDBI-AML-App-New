package com.idbi.intech.erm.util;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.cert.CertificateException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.service.JsonConverterService;

@Service
public class JsonConverterServiceImpl implements JsonConverterService {

	@Value("${application.erm-app.privatekeycertpath}")
	private static String privatekeycertpath;

	/**
	 * Method is used to encrpypt JSON string and it returns encrypted text and
	 * session key
	 * 
	 * 
	 * 
	 */
	public RequestResponseJsonDto getEncryptedJson(Object jsonObject, String channelId) throws InvalidKeyException,
			IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchProviderException,
			NoSuchPaddingException, InvalidAlgorithmParameterException, CertificateException, IOException {

		Security.addProvider(new BouncyCastleProvider());

		// JSON mapper
		final ObjectMapper objMapper = new ObjectMapper();
		// AES encryption object
		final ErmAesEncryptor encryptor = new ErmAesEncryptor();
		// Response json object
		final RequestResponseJsonDto respDto = new RequestResponseJsonDto();
		// RSA encryption object
		final SessionKeyEncryptorImpl sessionKeyEncryptor = new SessionKeyEncryptorImpl();

		String jsonString = objMapper.writeValueAsString(jsonObject);

		String sessionKey = String.valueOf(ErmPrimaryKeyGenerator.getAlphaNumericString(32));

		String encryptedJson = encryptor.encrypt(jsonString, sessionKey);

		respDto.setEncryptedJson(encryptedJson);

		// AppParameterDto param = appParameterService.getParameterValue(channelId);
		String dir = System.getProperty("user.dir");
		respDto.setSessionKey(sessionKeyEncryptor.encryptsessionKeyUsingpubkey(sessionKey, dir + "/certs/ermpub.cer"));

		return respDto;
	}

	/**
	 * Method is used to perform decryption of user JSON
	 * 
	 * @throws Exception
	 * 
	 */
	public String getDecryptedJson(String userRequest, String sessionKeyEncrypt) throws Exception {
		Security.addProvider(new BouncyCastleProvider());

		// RSA encryption object
		final SessionKeyEncryptorImpl sessionKeyEncryptor = new SessionKeyEncryptorImpl();

		// AES encryption object
		final ErmAesEncryptor decryptor = new ErmAesEncryptor();
		String dir = System.getProperty("user.dir");
		String sessionKey = sessionKeyEncryptor.decryptSessionKeyUsingprvkey(sessionKeyEncrypt,
				dir + "/certs/ermKeyStore.p12");

		String requestJsonDecrypt = decryptor.decrypt(userRequest, sessionKey);

		return requestJsonDecrypt;
	}

}
