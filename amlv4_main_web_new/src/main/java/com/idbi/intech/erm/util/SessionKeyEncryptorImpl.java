package com.idbi.intech.erm.util;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.idbi.intech.erm.service.SessionKeyEncryptorService;

@Service
// Class is used to encrypt session key (String) using asymmetric key
public class SessionKeyEncryptorImpl implements SessionKeyEncryptorService {
	// @Value("${erm-app.keystore}")
	// private String keyStoreName;
	// @Value("${erm-app.password}")
	// private String keyStorePassword;

	/*
	 * for testing
	 * 
	 */
	private String keyStoreName = "erm";
	private String keyStorePassword = "P@ssw0rd";

	// Getting public key from cer file
	public PublicKey getPublicKey(String filename)
			throws FileNotFoundException, CertificateException, NoSuchAlgorithmException, InvalidKeySpecException {

		String cer = filename;
		FileInputStream fileInputStream = new FileInputStream(cer);

		CertificateFactory cf = CertificateFactory.getInstance("X.509");
		X509Certificate cert = (X509Certificate) cf.generateCertificate(fileInputStream);
		PublicKey publicKey = cert.getPublicKey();
		byte[] encoded = publicKey.getEncoded();

		X509EncodedKeySpec x509EncodedKeySpec = new X509EncodedKeySpec(encoded);

		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
		PublicKey key = keyFactory.generatePublic(x509EncodedKeySpec);

		return key;
	}

	// Encrypting session key
	public String encryptSessionKey(final String sessionKey, final PublicKey publicKey)
			throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException,
			BadPaddingException, UnsupportedEncodingException {
		Cipher encryptCipher = Cipher.getInstance("RSA");
		encryptCipher.init(Cipher.ENCRYPT_MODE, publicKey);

		byte[] cipherText = encryptCipher.doFinal(sessionKey.getBytes("UTF-8"));

		return Base64.getEncoder().encodeToString(cipherText);
	}

	// Encrypting session key
	public String encryptsessionKeyUsingpubkey(String sessionkey, String clientPublicKeypath)
			throws CertificateException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException,
			IllegalBlockSizeException, BadPaddingException, IOException {
		FileInputStream fin = new FileInputStream(clientPublicKeypath);
		CertificateFactory f = CertificateFactory.getInstance("X.509");
		Certificate certificate = f.generateCertificate(fin);
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.ENCRYPT_MODE, certificate);
		byte[] data = cipher.doFinal(sessionkey.getBytes());
		fin.close();
		String encrySessionkey = Base64.getEncoder().encodeToString(data);
		return encrySessionkey;
	}

	// Getting private key
	public PrivateKey getPrivateKey(String filename) throws NoSuchAlgorithmException, CertificateException, IOException,
			KeyStoreException, UnrecoverableKeyException {
//		System.out.println("Key Store password :: "+ keyStorePassword);
//		System.out.println("Key Store :: "+keyStoreName);

		KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
		FileInputStream fis = new FileInputStream(filename);
		keyStore.load(fis, keyStorePassword.toCharArray());
		PrivateKey privateKey = (PrivateKey) keyStore.getKey(keyStoreName, keyStorePassword.toCharArray());
		return privateKey;
	}

	// descrypting using private key
	public String decryptSessionKeyUsingprvkey(String encryptedSessionKey, String keyFileName)
			throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, UnrecoverableKeyException,
			CertificateException, KeyStoreException, IOException, IllegalBlockSizeException, BadPaddingException {
		byte[] decodedEncryptedSecondString = Base64.getMimeDecoder().decode(encryptedSessionKey.getBytes());
		Cipher privateDecryptCipher = Cipher.getInstance("RSA");
		privateDecryptCipher.init(Cipher.DECRYPT_MODE, getPrivateKey(keyFileName));
		byte[] decryptedSecondStringByte = privateDecryptCipher.doFinal(decodedEncryptedSecondString);
		return new String(decryptedSecondStringByte);
	}

	public static void main(String args[]) {
		try {
			SessionKeyEncryptorImpl obj = new SessionKeyEncryptorImpl();
			String actualText = "Hello";
			// Encrypting session key
			String dir = System.getProperty("user.dir");
			String encryptedText = obj.encryptsessionKeyUsingpubkey(actualText, dir + "/certs/ermwebpub.cer");
			// System.out.println(encryptedText);
			// Decypting using private key
			String decryptedText = obj.decryptSessionKeyUsingprvkey(encryptedText, dir + "/certs//ermWebKeyStore.p12");
			// System.out.println(decryptedText);
		} catch (Exception ex) {
			ex.printStackTrace();
		}

	}

}
