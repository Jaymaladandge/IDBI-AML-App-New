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

public class EncryptionDecryptionPerformer {
	static String sessionKey = "";
	static String json = "";
	static String encryptedText = "";

	public void encryptInputJson(String actualString) throws InvalidKeyException, IllegalBlockSizeException,
			BadPaddingException, NoSuchAlgorithmException, NoSuchProviderException, NoSuchPaddingException,
			InvalidAlgorithmParameterException, CertificateException, IOException {
		String key = "12345678901234567890123456789012";

		String dir = System.getProperty("user.dir");
		System.out.println(dir);
		// Perform encryption for json string
		ErmAesEncryptor aes = new ErmAesEncryptor();
		encryptedText = aes.encrypt(actualString, key);
		System.out.println("EncryptedText  :: " + encryptedText);
		// Encrypt key using public key
		SessionKeyEncryptorImpl keyEncryptor = new SessionKeyEncryptorImpl();
		sessionKey = keyEncryptor.encryptsessionKeyUsingpubkey(key, dir + "/certs/ermpub.cer");
		System.out.println("Session Key  :: " + sessionKey);

	}

	public String decryptOutputJson(String encrypted, String key) throws Exception {
		System.out.println(encrypted);
		System.out.println(key);
		// decrpting session key
		String dir = System.getProperty("user.dir");
		SessionKeyEncryptorImpl keyDecryptor = new SessionKeyEncryptorImpl();
		sessionKey = keyDecryptor.decryptSessionKeyUsingprvkey(key, dir +"/certs/ermKeyStore.p12");
		System.out.println("SessionKey :: " + sessionKey);
		// perform decryption for json String
		ErmAesEncryptor aes = new ErmAesEncryptor();
		json = aes.decrypt(encrypted, sessionKey);
		System.out.println("Json :: " + json);
		return json;
	}

	public static void main(String[] args) {
		Security.addProvider(new BouncyCastleProvider());

		EncryptionDecryptionPerformer obj = new EncryptionDecryptionPerformer();
		try {
			obj.encryptInputJson(
					"{\n" + "    \"userId\":\"INT2929\",\n" + "    \"userPassword\":\"P@ssw0rd123\"\n" + "}");
			String key = "j0iksFIrMuR2ROuF5yaGxWU3WhUMKkihk2cobYunFcFwlxhCkpkvzasoXznpNd+ViAFbhmyD9zWoyZ635J9N+yAdxtGKwOkwT72Krdyeu3On8AzDs0qTbiyArHBIGhet0qKWRoHiJYjiYkKCqf+xVEWwmoHMCLO+NQRD2f9oiDiZ492ziS5Qg3N/6FHNKNccFPKU8pYnVvk7scwHzrRbrkkVChTLd+VmmeJ//8Od0cXCXESlxdEoydPXdRPSJ1wwU4m5GTSpIDoELQkYJPkJf3sdZdWZHNlpGO2EnYvERgz89fTOIHgCDE4XgH644O5dLFLJYCPyCvPQrDR9ZO5UYq10NluYm0DNLMt5pJK15XR5B5/SYUS5Vo0n4X0wh65MqcFXOL3fMbmjknFfk0gRoVgLP050Eig9OI00VPvZBpeOX76O1xubO4cG/U5ZymAWHxq/YEctpihcGJnAmLtmH4BQ70On9Hwsq1sugAW4pJyVzfxFe5fC9RbyAplhRwUit7xsHTu3X3YTp3NKkEm6OJbBEm/She00JA/n2sC/+uBil+PGeFrmYVWS5GYNtfL/27qHr2B1crvjURJbRNmlv2j6dgvNPu6E9BT/DiBdKLW8ElqfzkXos5ofDL2qEd4gMotwp0agiFxV+dQ0RnmoacYLoGHJ5U+tlUoz/M1FfPc=";
			String text = "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.t2JM2IBSKL1Tnoc2CZv/6w==";
			String decryptJson = null;
			try {
				decryptJson = obj.decryptOutputJson(text, key);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println(decryptJson);

		} catch (InvalidKeyException | IllegalBlockSizeException | BadPaddingException | NoSuchAlgorithmException
				| NoSuchProviderException | NoSuchPaddingException | InvalidAlgorithmParameterException
				| CertificateException | IOException e) {
			e.printStackTrace();
		}

	}
}
