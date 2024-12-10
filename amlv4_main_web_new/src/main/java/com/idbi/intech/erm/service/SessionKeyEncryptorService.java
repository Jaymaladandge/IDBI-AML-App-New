package com.idbi.intech.erm.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

public interface SessionKeyEncryptorService {
	public PublicKey getPublicKey(String filename) throws FileNotFoundException, CertificateException, NoSuchAlgorithmException, InvalidKeySpecException;
	public String encryptSessionKey(final String sessionKey, final PublicKey publicKey) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException; 
	public String encryptsessionKeyUsingpubkey(String sessionkey, String clientPublicKeypath)  throws CertificateException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, IOException;
	public PrivateKey getPrivateKey(String filename) throws NoSuchAlgorithmException, CertificateException, IOException, KeyStoreException, UnrecoverableKeyException;
	public String decryptSessionKeyUsingprvkey(String encryptedSessionKey, String keyFileName) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, UnrecoverableKeyException, CertificateException, KeyStoreException, IOException, IllegalBlockSizeException, BadPaddingException;
}
