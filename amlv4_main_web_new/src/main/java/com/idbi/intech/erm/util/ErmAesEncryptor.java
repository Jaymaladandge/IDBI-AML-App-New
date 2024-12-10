package com.idbi.intech.erm.util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;
import java.security.Security;
import java.util.Base64;
import java.util.Random;
import java.util.regex.Pattern;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

/**
 * Symmetric key encryption AES 256
 * 
 * @author sharath
 *
 */
public class ErmAesEncryptor {

	/**
	 * To Generate IV using SecureRandom class
	 * 
	 * @return byte array of IV
	 */
	private byte[] generateIv() {
		SecureRandom random = new SecureRandom();
		byte[] ivBytes = new byte[16];
		random.nextBytes(ivBytes);
		return ivBytes;
	}

	/**
	 * Method is to convert the key into Cipher so that it can be used for
	 * encryption
	 *
	 * @param key
	 * @return Cipher object containing key
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchProviderException
	 * @throws NoSuchPaddingException
	 * @throws InvalidKeyException
	 * @throws InvalidAlgorithmParameterException
	 */
	public Cipher getEncryptionCipher(final String key) throws NoSuchAlgorithmException, NoSuchProviderException,
			NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {
		final Key aesKey = new SecretKeySpec(Base64.getDecoder().decode(key), "AES");
		final Cipher encryptionCipher = Cipher.getInstance("AES/CBC/PKCS7Padding", "BC");
		IvParameterSpec ivParameterSpec = new IvParameterSpec(generateIv());
		encryptionCipher.init(Cipher.ENCRYPT_MODE, aesKey, ivParameterSpec);
		return encryptionCipher;
	}

	/**
	 * Method to get encrypted string using Cipher object returned from @getEncryptionCipher method
	 * 
	 * return String containing encrypted text and IV seperated by .
	 */
	public String encrypt(String plainValue, final String key) throws IllegalBlockSizeException, BadPaddingException,
			UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException, NoSuchProviderException,
			NoSuchPaddingException, InvalidAlgorithmParameterException {
		Cipher cipher = getEncryptionCipher(key);
		byte[] encryptedBytes = cipher.doFinal(plainValue.getBytes("UTF-8"));
		byte[] iV = cipher.getIV();
		return new String(Base64.getEncoder().encode(encryptedBytes)) + "."
				+ new String(Base64.getEncoder().encode(iV));
	}
	
	/**
	 * Method is used to Cipher object for decryption
	 * 
	 * @param key
	 * @param iv
	 * @param pks7Flag
	 * @return Object of Cipher
	 * @throws NoSuchPaddingException 
	 * @throws NoSuchProviderException 
	 * @throws NoSuchAlgorithmException 
	 * @throws InvalidAlgorithmParameterException 
	 * @throws InvalidKeyException 
	 * @throws Exception
	 */
	private Cipher getDecryptCipher(String key, byte[] iv) throws NoSuchAlgorithmException, NoSuchProviderException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {
		Key aesKey = new SecretKeySpec(Base64.getDecoder().decode(key), "AES");
		Cipher decryptionCipher;
		
		decryptionCipher = Cipher.getInstance("AES/CBC/PKCS7Padding", "BC");
		
		IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);
		decryptionCipher.init(2, aesKey, ivParameterSpec);
		return decryptionCipher;
	}
	
	/**
	 * Method is used to decrypt the encrypted text using key
	 * 
	 * @param encryptedValue
	 * @param key
	 * @return String with decrypted text
	 * @throws BadPaddingException 
	 * @throws IllegalBlockSizeException 
	 * @throws UnsupportedEncodingException 
	 * @throws InvalidAlgorithmParameterException 
	 * @throws NoSuchPaddingException 
	 * @throws NoSuchProviderException 
	 * @throws NoSuchAlgorithmException 
	 * @throws InvalidKeyException 
	 * @throws Exception
	 */
	public String decrypt(String encryptedValue, String key) throws IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException, NoSuchProviderException, NoSuchPaddingException, InvalidAlgorithmParameterException
			 {
		String[] str = encryptedValue.split(Pattern.quote("."));
		// System.out.println(str[0]);
		// System.out.println(str[1]);
		// System.out.println(key);
		byte[] decodedValue = Base64.getDecoder().decode(str[0]);
		byte[] decodedIV = Base64.getDecoder().decode(str[1]);
		byte[] unencryptedBytes = getDecryptCipher(key, decodedIV).doFinal(decodedValue);
		return new String(unencryptedBytes, "UTF-8");
	}
	
	/**
	 * Method is used to generate 16 digit random number
	 * 
	 * @return 16 digit random key
	 */
	public String generateRandom() {
		StringBuffer sb = new StringBuffer();
		Random random = new Random();
		for(int i=0;i<32;i++) {
			sb.append((char) ('0'+random.nextInt(10)));
		}
		return sb.toString();
	}
	
	public static void main(String args[]) throws Exception {

		Security.addProvider(new BouncyCastleProvider());
		ErmAesEncryptor obj =  new ErmAesEncryptor();
		
		String plaintext = "P@ssw0rd123";
		// Encryption key for developer profile
		String key  = "F60MUB9ZK0CWWQZEYIBVJQ7GIQ6F918W";
		
		System.out.println("Session Key :: "+key);

		String encryptedtext = "";
		String decryptedText = "";
		
		try {
			 encryptedtext = obj.encrypt(plaintext, key);
		} catch (InvalidKeyException | IllegalBlockSizeException | BadPaddingException | UnsupportedEncodingException
				| NoSuchAlgorithmException | NoSuchProviderException | NoSuchPaddingException
				| InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		
		System.out.println("Encrypted Text  :: "+encryptedtext);
		
		decryptedText = obj.decrypt(encryptedtext, key);
		
		System.out.println("Decrypted Text :: "+decryptedText);
		
	}

}
