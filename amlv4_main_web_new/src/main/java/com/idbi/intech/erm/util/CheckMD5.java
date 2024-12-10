package com.idbi.intech.erm.util;

import java.security.MessageDigest;

public class CheckMD5 {
	
	public static String getMD5(String jsonString){
		byte[] defaultBytes = jsonString.getBytes();
		StringBuffer hexString = new StringBuffer();
		try {
			MessageDigest algorithm = MessageDigest.getInstance("MD5");
			algorithm.reset();
			algorithm.update(defaultBytes);
			byte messageDigest[] = algorithm.digest();

			for (int i = 0; i < messageDigest.length; i++) {
				hexString.append(Integer.toHexString(0xFF & messageDigest[i]));
			}
	}catch(Exception e){
		e.printStackTrace();
	}
		return hexString.toString();
	}
	
	public static boolean matchMD5(String json,String md5){
		byte[] defaultBytes = json.getBytes();
		StringBuffer hexString = new StringBuffer();
		try {
			MessageDigest algorithm = MessageDigest.getInstance("MD5");
			algorithm.reset();
			algorithm.update(defaultBytes);
			byte messageDigest[] = algorithm.digest();

			for (int i = 0; i < messageDigest.length; i++) {
				hexString.append(Integer.toHexString(0xFF & messageDigest[i]));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return hexString.toString().equals(md5);
	}
	
	
	public static void main(String[] args){
		
	System.out.println(getMD5("1234"));
	
	System.out.println(matchMD5("1234","81dc9bdb52d04dc2036dbd8313ed055"));
	
	
		
		
	}

}
