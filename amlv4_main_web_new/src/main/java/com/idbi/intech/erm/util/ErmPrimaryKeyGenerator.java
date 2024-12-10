package com.idbi.intech.erm.util;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.idbi.intech.erm.service.ErmPrimaryKeyGeneratorService;

@Service
public class ErmPrimaryKeyGenerator implements ErmPrimaryKeyGeneratorService {
	@Value("${organisation.name}")
	private String orgName;
	@Value("${organisation.usrname}")
	private String usrName;

	public String getAppPrimaryKey() {
		long currentTimestamp = Instant.now().toEpochMilli();
		long randNumFirst = generateRandomDigits(5);
		long randNumSecond = generateRandomDigits(4);
		return orgName + String.valueOf(currentTimestamp) + String.valueOf(randNumFirst)
				+ String.valueOf(randNumSecond);
	}

	@Override
	public String getAppUserPrimaryKey() {
		long currentTimestamp = Instant.now().toEpochMilli();
		long randNumFirst = generateRandomDigits(5);
		long randNumSecond = generateRandomDigits(1);

		return usrName + String.valueOf(currentTimestamp) + String.valueOf(randNumFirst)
				+ String.valueOf(randNumSecond);

		// return usrName + String.valueOf(randNumFirst);
	}

	static int generateRandomDigits(int n) {
		int m = (int) Math.pow(10, n - 1);
		return m + new Random().nextInt(9 * m);
	}

	// function to generate a random string of length n
	static String getAlphaNumericString(int n) {

		// chose a Character random from this String
		String AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789";

		// create StringBuffer size of AlphaNumericString
		StringBuilder sb = new StringBuilder(n);

		for (int i = 0; i < n; i++) {

			// generate a random number between
			// 0 to AlphaNumericString variable length
			int index = (int) (AlphaNumericString.length() * Math.random());

			// add Character one by one in end of sb
			sb.append(AlphaNumericString.charAt(index));
		}

		return sb.toString();
	}

	public static void main(String[] args) {
		System.out.println(new ErmPrimaryKeyGenerator().getIMPrimaryKey("IMR","CO"));
	}

	@Override
	public String getModulePrimaryKey(String moduleName) {
		LocalDate currentdate = LocalDate.now();
		String day = "", month = "";
		int currentDay = currentdate.getDayOfMonth();
		int currentMonth = currentdate.getMonthValue();
		if (currentDay < 10) {
			day = "0" + currentDay;
		} else {
			day = String.valueOf(currentDay);
		}
		if (currentMonth < 10) {
			month = "0" + currentMonth;
		} else {
			month = String.valueOf(currentMonth);
		}
		int year = currentdate.getYear();
		String date = day + month;
		long randNumFirst = generateRandomDigits(4);
		long randNumSecond = generateRandomDigits(4);
		return moduleName + "/" + year + "/" + date + "/" + randNumFirst + randNumSecond;
	}

	@Override
	public String getIMPrimaryKey(String moduleName, String ofcType) {
		LocalDate currentdate = LocalDate.now();
		String day = "", month = "";
		int currentDay = currentdate.getDayOfMonth();
		int currentMonth = currentdate.getMonthValue();
		if (currentDay < 10) {
			day = "0" + currentDay;
		} else {
			day = String.valueOf(currentDay);
		}
		if (currentMonth < 10) {
			month = "0" + currentMonth;
		} else {
			month = String.valueOf(currentMonth);
		}
		int year = currentdate.getYear();
		String date = day + month;
		long randNumFirst = generateRandomDigits(4);
		long randNumSecond = generateRandomDigits(4);
		return moduleName + "/" + ofcType + "/" + year + "/" + date + "/" + randNumFirst + randNumSecond;
	}

}
