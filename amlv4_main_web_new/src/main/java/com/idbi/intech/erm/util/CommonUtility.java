package com.idbi.intech.erm.util;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Random;
import java.util.stream.Collectors;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.WorkflowActionDto;
import com.idbi.intech.erm.domain.app.DepartmentMasterDto;
import com.idbi.intech.erm.domain.app.IncidentDto;
import com.idbi.intech.erm.domain.app.MenuDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.service.FileManagementService;
import com.idbi.intech.erm.service.JsonConverterService;
import com.idbi.intech.erm.service.SessionKeyEncryptorService;

@Component
public class CommonUtility {
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.checkWorkFlowExist}")
	private String checkWorkFlowExist;
	@Value("${app-url.fetchDept}")
	private String fetchDept;
	@Value("${app-url.viewIncidentDetails}")
	private String viewIncidentDetails;
	// SessionKeyEncryptor Object
	@Autowired
	private SessionKeyEncryptorService sessionKeyEncrypt;
	@Autowired
	private JsonConverterService jsonConvertService;
	@Autowired
	private FileManagementService fileService;

	RequestResponseJsonDto respDto = null;

	public RequestResponseJsonDto objectToJson(Object obj) {
		RequestResponseJsonDto respDto = null;
		// ObjectMapper objectMap = new ObjectMapper();
		// String userRequestString = null;
		try {
			// userRequestString = objectMap.writeValueAsString(obj);
			respDto = jsonConvertService.getEncryptedJson(obj, "ERM-WEB");

		} catch (IOException | InvalidKeyException | IllegalBlockSizeException | BadPaddingException
				| NoSuchAlgorithmException | NoSuchProviderException | NoSuchPaddingException
				| InvalidAlgorithmParameterException | CertificateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return respDto;
	}

	public ResponseEntity<String> webserviceConsume(String url, RequestResponseJsonDto respDto)
			throws InvalidKeyException, UnrecoverableKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			CertificateException, KeyStoreException, IllegalBlockSizeException, BadPaddingException, IOException,
			NoSuchProviderException, InvalidAlgorithmParameterException {

		System.out.println("===========webserviceConsume() respDto============"+respDto);
		
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.TEXT_PLAIN));
		headers.set("SESSION-KEY", respDto.getSessionKey());
		headers.set("CHANNEL-ID", "WEB_APP_ERM");
		HttpEntity<String> entity = new HttpEntity<String>(respDto.getEncryptedJson(), headers);
		
		System.out.println("===========webserviceConsume()============"+entity.getBody()+"======url====="+url);
		return restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
}

	public String decryptedResToString(ResponseEntity<String> response) {
		String resultString = response.getBody().toString();
		String responseString = "";
		HttpHeaders resHeaders = response.getHeaders();

		final ErmAesEncryptor ermEncryptObj = new ErmAesEncryptor();

		try {
			String decryptionKey = sessionKeyEncrypt
					.decryptSessionKeyUsingprvkey(resHeaders.get("SESSION-KEY").toString(), privateKeyPath);
			responseString = ermEncryptObj.decrypt(resultString, decryptionKey);
		} catch (InvalidKeyException | IllegalBlockSizeException | BadPaddingException | IOException
				| NoSuchAlgorithmException | NoSuchProviderException | NoSuchPaddingException
				| InvalidAlgorithmParameterException | UnrecoverableKeyException | CertificateException
				| KeyStoreException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return responseString;
	}

	public String encryptedReqToString(String encryptedJson) {
		int iterationCount = 1000;
		int keySize = 128;
		String decryptedJson = "";
		AesUtil aesUtil = new AesUtil(keySize, iterationCount);
		String credArr[] = encryptedJson.split(":~:");
		decryptedJson = aesUtil.decrypt(credArr[1], credArr[0]);

		return decryptedJson;

	}

	public List<DepartmentMasterDto> fetchDeptList() throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		List<DepartmentMasterDto> deptList = new ArrayList<DepartmentMasterDto>();
		try {
			String deptResponse = "Fetch";
			respDto = objectToJson(deptResponse);
			

			final String deptListStr = decryptedResToString(webserviceConsume(uri + fetchDept, respDto));

			deptList = objectMapper.readValue(deptListStr, new TypeReference<List<DepartmentMasterDto>>() {
			});
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| NoSuchProviderException | InvalidAlgorithmParameterException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return deptList;

	}

	

	

	public String getRolePrimaryKey() {

		final String orgName = "LICROLE";
		long currentTimestamp = Instant.now().toEpochMilli();
		long randNumFirst = generateRandomDigits(3);
		long randNumSecond = generateRandomDigits(2);
		return orgName + String.valueOf(currentTimestamp) + String.valueOf(randNumFirst)
				+ String.valueOf(randNumSecond);
	}

	static int generateRandomDigits(int n) {
		int m = (int) Math.pow(10, n - 1);
		return m + new Random().nextInt(9 * m);

	}

	public void uploadFiles(MultipartFile[] multipartFile) {

		Arrays.asList(multipartFile).stream().forEach(file -> {
			uploadFile(file);
		});

	}

	public String uploadFile(MultipartFile file) {
		String message = "";
		try {
			fileService.save(file);

			message = "UPLOADED";
			return message;
		} catch (Exception e) {
			message = "FAILED";
			return message;
		}
	}

	public static void disableSslVerification() {
		try {
			TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {

				@Override
				public X509Certificate[] getAcceptedIssuers() {
					// TODO Auto-generated method stub
					return null;
				}

				@Override
				public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
					// TODO Auto-generated method stub

				}

				@Override
				public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
					// TODO Auto-generated method stub

				}

			}

			};

			SSLContext sc = SSLContext.getInstance("SSL");
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

			HostnameVerifier allHostsValid = new HostnameVerifier() {
				public boolean verify(String hostname, SSLSession session) {
					return true;
				}
			};
			HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);

		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception ex) {
			// TODO Auto-generated catch block
			ex.printStackTrace();
		}

	}

	public ArrayList<String> getMenuBtnData(String moduleCode, HttpSession session) {
		HashMap<String, List<MenuDto>> menuMapList = (HashMap<String, List<MenuDto>>) session
				.getAttribute("menuButtonData");
		ArrayList<String> menuButtonList = new ArrayList<String>();
		if(menuMapList.get(session.getAttribute("rolePosition"))!=null) {
			
		List<MenuDto> menuList = menuMapList.get(session.getAttribute("rolePosition")).stream()
				.filter(position -> Objects.nonNull(position)).collect(Collectors.toList());
		if (menuList != null) {
			menuList.forEach(menuButton -> {
				if (menuButton.getButtonMenuList().get(moduleCode) != null) {

					menuButton.getButtonMenuList().get(moduleCode).stream().forEach(buttonName -> {
						menuButtonList.add(buttonName);

					});

				}
			});
		}
		}
		
		return menuButtonList;
		

	}

	public ArrayList<String> getSubMenuBtnData(String moduleCode, HttpSession session) {
		HashMap<String, List<MenuDto>> menuMapList = (HashMap<String, List<MenuDto>>) session.getAttribute("menuButtonData");
		ArrayList<String> subMenuButtonList = new ArrayList<String>();
		
		if (menuMapList.get(session.getAttribute("rolePosition"))!=null) {
			List<MenuDto> menuList = menuMapList.get(session.getAttribute("rolePosition")).stream()
					.filter(position -> Objects.nonNull(position)).collect(Collectors.toList());
			if (menuList != null) {

				menuList.forEach(menu -> {
					if (menu.getSubMenus() != null) {
						menu.getSubMenus().stream().forEach(submenuButton -> {
							
							if (submenuButton.getButtonSubmenuList() != null) {
								if (submenuButton.getButtonSubmenuList().get(moduleCode) != null) {

									submenuButton.getButtonSubmenuList().get(moduleCode).stream()
											.forEach(subMenuBtn -> {
												subMenuButtonList.add(subMenuBtn);

											});

								}
							}

						});
					}

				});

			}
		}
		return subMenuButtonList;

	}

	public WorkflowActionDto checkWorkFlowExist(WorkflowActionDto workflowActionDto)
			throws JsonParseException, JsonMappingException, IOException {
		final ObjectMapper objectMapper = new ObjectMapper();

		try {
			respDto = objectToJson(workflowActionDto);
			final String respString = decryptedResToString(webserviceConsume(uri + checkWorkFlowExist, respDto));
			workflowActionDto = objectMapper.readValue(respString, WorkflowActionDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}
		return workflowActionDto;
	}
	
	public String getQuarterByDate(String date) {
		String qrtYear;
		int quarter,year;
		DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		
		LocalDate localDt = LocalDate.parse(date, df);
		LocalDate firstDayOfQuarter = localDt.with(IsoFields.DAY_OF_QUARTER,1L);
		LocalDate lastDayOfQuarter = firstDayOfQuarter.plusMonths(2).with(TemporalAdjusters.lastDayOfMonth());
		
		quarter = firstDayOfQuarter.get(IsoFields.QUARTER_OF_YEAR);
		year = lastDayOfQuarter.getYear();
		
		if(quarter==1) {
			quarter=quarter+3;
		}else {
			quarter=quarter-1;
		}
		
		qrtYear = (String.valueOf(quarter)+"-"+String.valueOf(year));
		
		return qrtYear;
		
	}
	
	public IncidentDto fetchIncidentDetails(IncidentDto incidentDto)
			throws JsonParseException, JsonMappingException, IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			respDto = objectToJson(incidentDto);
			final String respString = decryptedResToString(webserviceConsume(uri + viewIncidentDetails, respDto));
			incidentDto = objectMapper.readValue(respString, IncidentDto.class);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {
			e.printStackTrace();
		}

		return incidentDto;
	}
	public String getRulePrimaryKey() {

		final String orgName = "RULE";
		long currentTimestamp = Instant.now().toEpochMilli();
		long randNumFirst = generateRandomDigits(3);
		long randNumSecond = generateRandomDigits(2);
		return orgName + String.valueOf(currentTimestamp) + String.valueOf(randNumFirst)
				+ String.valueOf(randNumSecond);
	}
	
	public String saveFileWithZip( String newFileName, List<String> fileList) {
		String message = "";
		try {
			fileService.saveFileWithZip( newFileName, fileList);

			message = "UPLOADED";
			return message;
		} catch (Exception e) {
			e.printStackTrace();
			message = "FAILED";
			return message;
		}
	}
	
	
}
