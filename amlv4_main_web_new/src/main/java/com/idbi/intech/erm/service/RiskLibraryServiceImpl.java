package com.idbi.intech.erm.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Picture;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.RegionUtil;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.ControlIndexGraphDto;
import com.idbi.intech.erm.domain.app.NotificationDto;
import com.idbi.intech.erm.domain.app.RequestResponseJsonDto;
import com.idbi.intech.erm.domain.app.RiskAssessmentDto;
import com.idbi.intech.erm.domain.app.RiskCategoryDto;
import com.idbi.intech.erm.domain.app.RiskLibraryMasterDto;
import com.idbi.intech.erm.domain.app.RiskRegisterDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.util.CommonUtility;

@Service
public class RiskLibraryServiceImpl implements RiskLibraryService {

	static {
		CommonUtility.disableSslVerification();
		Security.addProvider(new BouncyCastleProvider());
	}

	@Autowired
	private CommonUtility commonUtility;
	@Autowired
	private ErmPrimaryKeyGeneratorService pkGenerator;

	RequestResponseJsonDto respDto = null;
	// private for erm application
	@Value("${erm-app.privatekeycertpath}")
	private String privateKeyPath;
	@Value("${app-url.uri}")
	private String uri;
	@Value("${app-url.riskRegister}")
	private String riskRegister;
	// SessionKeyEncryptor Object
	@Autowired
	private SessionKeyEncryptorService sessionKeyEncrypt;

	public RiskRegisterDto exportRegister(RiskRegisterDto registerDto)
			throws JsonParseException, JsonMappingException, IOException {
		// TODO Auto-generated method stub
		final ObjectMapper objectMapper = new ObjectMapper();
		try {
			respDto = commonUtility.objectToJson(registerDto);
			// send request for closing risk appetite

			final String respString = commonUtility
					.decryptedResToString(commonUtility.webserviceConsume(uri + riskRegister, respDto));
			registerDto = objectMapper.readValue(respString, RiskRegisterDto.class);
			exportRegisterWithImage(registerDto);
		} catch (InvalidKeyException | UnrecoverableKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| CertificateException | KeyStoreException | IllegalBlockSizeException | BadPaddingException
				| IOException | NoSuchProviderException | InvalidAlgorithmParameterException e) {

		}
		return registerDto;
	}

	@Override
	public ByteArrayInputStream exportRegisterWithImage(RiskRegisterDto registerDto) {
		try {

			Workbook wb = new XSSFWorkbook();

			ByteArrayOutputStream stream = new ByteArrayOutputStream();

			Sheet sheet = wb.createSheet("Risk Register");

			String usingSystemProperty = System.getProperty("user.dir");
			// System.out.println("Current directory path using system property:- " +
			// usingSystemProperty);

			InputStream inputStream = getClass().getResourceAsStream("../LIC-Logo-Too-Small.png");

			// System.out.println("Get Class "+ getClass().getCanonicalName());
			// System.out.println("Get Path "+ getClass().getResourceAsStream("../../"));

			// FileInputStream obtains input bytes from the image file
			// InputStream inputStream = new
			// FileInputStream("C:\\\\Users\\\\Admin\\\\LIC-Logo-Too-Small.png");

			// Get the contents of an InputStream as a byte[].
			byte[] bytes = IOUtils.toByteArray(inputStream);
			// Adds a picture to the workbook
			int pictureIdx = wb.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
			// close the input stream
			inputStream.close();

			// Returns an object that handles instantiating concrete classes
			CreationHelper helper = wb.getCreationHelper();

			// Creates the top-level drawing patriarch.
			Drawing drawing = sheet.createDrawingPatriarch();

			// Create an anchor that is attached to the worksheet
			ClientAnchor anchor = helper.createClientAnchor();
			// set top-left corner for the image

			anchor.setCol1(0); // Column B
			anchor.setRow1(0); // Row 3
			anchor.setCol2(2); // Column C
			anchor.setRow2(2); // Row 4

			// Creates a picture
			Picture pict = drawing.createPicture(anchor, pictureIdx);
			// Reset the image to the original size
			pict.resize();

			// This data needs to be written (Object[])
			Map<Integer, Object[]> data = new TreeMap<Integer, Object[]>();

			TreeMap<String, Object[]> treeMap = new TreeMap<String, Object[]>();
			Row rowFirst = sheet.createRow(0);

			Cell cellDate = null;
			CellStyle style = wb.createCellStyle();

			// cellDate = row.createCell(10);
			// cellDate.setCellValue("Risk Register As On Date "+
			// registerDto.getRegisterDate().toString());

			CellStyle cellStyle = wb.createCellStyle();
			CreationHelper createHelper = wb.getCreationHelper();
			// cellStyle.setDataFormat(createHelper.createDataFormat().getFormat("m/d/yy
			// h:mm"));
			cellDate = rowFirst.createCell(6);
			cellDate.setCellValue("Risk Register As On Date " + registerDto.getRegisterDate().toString());
			cellDate.setCellStyle(cellStyle);

			Row row = sheet.createRow(4);

			row.setHeight((short) 800);
			style.setWrapText(true); // Set wordwrap
			// Set Font
			Font font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName("Times Roman");
			font.setColor(IndexedColors.BLACK.getIndex());
			font.setBold(true);
			font.setItalic(false);

			// Setting Background color
			style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
			style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			style.setAlignment(HorizontalAlignment.CENTER);
			style.setFont(font);

			String[] strArr = { "Sr. No", "Department", "Function", "Risk Description", "Root Cause/Trigger", "Impact",
					"Risk Classification", "Sub Risk", "Inherent Risk", "Inherent Risk rating",
					"Applicability for Operating Offices*", "Existing Control", "Control Owner",
					"Control Effectiveness", "Residual risk rating", "Control Gaps/ Process Improvements",
					"Key Mitigation Measures", "Interdepartmental dependencies" };

			Cell cell = null;
			int itr = 0;

			Row inherentRiskRow = sheet.createRow(5);

			for (String str : strArr) {
				cell = row.createCell(itr);

				style.setBorderBottom(BorderStyle.THIN);
				style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderRight(BorderStyle.THIN);
				style.setRightBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderLeft(BorderStyle.THIN);
				style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderTop(BorderStyle.THIN);
				style.setTopBorderColor(IndexedColors.BLACK.getIndex());
				style.setWrapText(true);

				row.setHeight((short) 700);

				cell.setCellValue(str);
				cell.setCellStyle(style);

				if (itr == 8) {
					sheet.addMergedRegion(new CellRangeAddress(4, 4, 8, 9));

					style.setFont(font);
					Cell newCell = inherentRiskRow.createCell(8);
					newCell.setCellValue("Probability");
					newCell.setCellStyle(style);

					newCell = inherentRiskRow.createCell(9);
					newCell.setCellValue("Impact");
					newCell.setCellStyle(style);

					itr++;
				} else if (itr == 11) {
					sheet.addMergedRegion(new CellRangeAddress(4, 4, 11, 14));

					Cell cell2 = inherentRiskRow.createCell(11);
					cell2.setCellValue("Central Office");
					cell2.setCellStyle(style);
					cell2 = inherentRiskRow.createCell(12);
					cell2.setCellValue("Zonal Office");
					cell2.setCellStyle(style);
					cell2 = inherentRiskRow.createCell(13);
					cell2.setCellValue("Divisional Office");
					cell2.setCellStyle(style);
					cell2 = inherentRiskRow.createCell(14);
					cell2.setCellValue("Branch Office");
					cell2.setCellStyle(style);

					itr = itr + 3;

				} else {
					sheet.addMergedRegion(new CellRangeAddress(4, 5, itr, itr));
				}

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
				}

				itr++;
			}

			int j = 0;

			for (RiskRegisterDto riskRegister : registerDto.getRegisterList()) {

				j++;
				String counter = "" + j;
				System.out.println("Counter " + counter);
				data.put(j,
						new Object[] { riskRegister.getSrNo(), riskRegister.getRiskDept().toUpperCase(),
								riskRegister.getRiskFunction(), riskRegister.getRiskDescription(),
								riskRegister.getRootCauseOrTrigger(), riskRegister.getRiskImpact(),
								riskRegister.getRiskClassification(), riskRegister.getSubRiskClassification(),
								riskRegister.getProbRiskEvent(), riskRegister.getFinanceImpact(),
								riskRegister.getSeverityLevel(), riskRegister.getCentralOfc(),
								riskRegister.getZonalOfc(), riskRegister.getDivisionalOfc(),
								riskRegister.getBranchOfc(), riskRegister.getControlDescription(),
								riskRegister.getCntrlOwner(), riskRegister.getCntrlEffectiveness(),
								riskRegister.getResidualRiskRating(), riskRegister.getControlGaps(),
								riskRegister.getKeyMitigationMeasures(), riskRegister.getInterDeparmentDependencies()

						});

			}

			// Iterate over data and write to sheet

			Set<Integer> keyset = data.keySet();
			int rownum = 6;
			for (Integer key : keyset) {
				row = sheet.createRow(rownum++);

				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					CellStyle Style = wb.createCellStyle();

					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 25 * 256);
					sheet.setColumnWidth(1, 25 * 256);
					sheet.setColumnWidth(2, 25 * 256);
					sheet.setColumnWidth(3, 25 * 256);
					sheet.setColumnWidth(4, 25 * 256);
					sheet.setColumnWidth(5, 25 * 256);
					sheet.setColumnWidth(6, 25 * 256);
					sheet.setColumnWidth(7, 25 * 256);
					sheet.setColumnWidth(8, 25 * 256);
					sheet.setColumnWidth(9, 25 * 256);
					sheet.setColumnWidth(10, 25 * 256);
					sheet.setColumnWidth(11, 25 * 256);

					sheet.setColumnWidth(12, 20 * 256);
					sheet.setColumnWidth(13, 20 * 256);
					sheet.setColumnWidth(14, 20 * 256);
					sheet.setColumnWidth(15, 20 * 256);

					sheet.setColumnWidth(16, 25 * 256);
					sheet.setColumnWidth(17, 25 * 256);
					sheet.setColumnWidth(18, 25 * 256);
					sheet.setColumnWidth(19, 25 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					Style.setAlignment(HorizontalAlignment.CENTER);
					Style.setFont(dataFont);

					if (columnIndex == 9 || columnIndex == 10 || columnIndex == 11 || columnIndex == 18
							|| columnIndex == 19) {
						// Setting Background color
						Style.setFillForegroundColor(IndexedColors.WHITE.getIndex());
						Style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
					}
					// Creating Header
					cell = row.createCell(cellnum++);

					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					}
				}
			}

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			wb.write(outputStream);
			return new ByteArrayInputStream(outputStream.toByteArray());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	public ByteArrayInputStream exportClassificationReport(RiskRegisterDto registerDto) {

		try {
int rowNumber=0;
			Workbook wb = new XSSFWorkbook();
			// ByteArrayOutputStream stream = new ByteArrayOutputStream();
			Sheet sheet = wb.createSheet("Risk Classification Report");
			// String usingSystemProperty = System.getProperty("user.dir");

			InputStream inputStream = getClass().getResourceAsStream("../LIC-Logo-Too-Small.png");

			// Get the contents of an InputStream as a byte[].
			byte[] bytes = IOUtils.toByteArray(inputStream);
			// Adds a picture to the workbook
			int pictureIdx = wb.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
			// close the input stream
			inputStream.close();

			// Returns an object that handles instantiating concrete classes
			CreationHelper helper = wb.getCreationHelper();

			// Creates the top-level drawing patriarch.
			Drawing drawing = sheet.createDrawingPatriarch();

			// Create an anchor that is attached to the worksheet
			ClientAnchor anchor = helper.createClientAnchor();
			// set top-left corner for the image

			anchor.setCol1(0); // Column B
			anchor.setRow1(0); // Row 3
			anchor.setCol2(0); // Column C
			anchor.setRow2(0); // Row 4

			// Creates a picture
			Picture pict = drawing.createPicture(anchor, pictureIdx);
			// Reset the image to the original size
			pict.resize();

			// This data needs to be written (Object[])
			Map<Integer, Object[]> data = new TreeMap<Integer, Object[]>();

			// TreeMap<String, Object[]> treeMap = new TreeMap<String, Object[]>();
			Row rowFirst = sheet.createRow(0);

			Cell tittleData = null;

			// Set Font
			Font headingFont = wb.createFont();
			headingFont.setFontHeightInPoints((short) 14);
			headingFont.setFontName("Times Roman");
			headingFont.setColor(IndexedColors.BLACK.getIndex());
			headingFont.setBold(true);
			headingFont.setItalic(false);

			// For Printing Date Of Risk Register
			CellStyle cellHedingStyle = wb.createCellStyle();
			tittleData = rowFirst.createCell(4);
			tittleData.setCellValue(" Risk Classification Report ");
			tittleData.setCellStyle(cellHedingStyle);
			cellHedingStyle.setFont(headingFont);
			// Tittle Part is Over

			Font reportDataFont = wb.createFont();
			reportDataFont.setFontHeightInPoints((short) 11);
			reportDataFont.setFontName("Times Roman");
			reportDataFont.setColor(IndexedColors.BLACK.getIndex());
			reportDataFont.setBold(true);
			reportDataFont.setItalic(false);

			// Report Details Section
			CellStyle cellStyle = wb.createCellStyle();
			reportDataFont.setFontHeightInPoints((short) 11);
			cellStyle.setFont(reportDataFont);

			Row row = sheet.createRow(4);
			Cell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("Risk Classification Report");
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			// User Details - User Name
			cell = row.createCell(5);
			cell.setCellValue("User name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(registerDto.getUserDto().getUsername());
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 7, 8));

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("Report Date");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(registerDto.getReportDate());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			// User Details - User Department
			cell = row.createCell(5);
			cell.setCellValue("User Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(registerDto.getUserDto().getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 7, 8));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("Report Extraction Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(registerDto.getReportExtractedDate());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 2, 3));

			// User Details - User Office
			cell = row.createCell(5);
			cell.setCellValue("User Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(registerDto.getUserDto().getUserOfficeType().toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 7, 8));

			row = sheet.createRow(7);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(registerDto.getUserDto().getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 2, 3));

			String reportExtractedOfc = null;
			if (registerDto.getSelectOfficeType() != null) {
				reportExtractedOfc = registerDto.getSelectOfficeType()+" - "+registerDto.getSelectedOfcCode();
			} else {
				reportExtractedOfc = registerDto.getUserDto().getUserOfficeType()+" - "+registerDto.getUserDto().getOfficeCode();
			}

			row = sheet.createRow(8);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(reportExtractedOfc.toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 2, 3));

			String assPeriod1 = null;
			if (registerDto.getSelectedAssessmentPeriod() != null) {
				assPeriod1 = registerDto.getSelectedAssessmentPeriod();
			} else {
				assPeriod1 = registerDto.getCurrentAssDate();
			}
			row = sheet.createRow(9);
			cell = row.createCell(0);
			cell.setCellValue("Current Assessment");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(assPeriod1);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 2, 3));

			String assPeriod2 = null;
			if (registerDto.getSelectedAssessmentPeriod2() != null) {
				assPeriod2 = registerDto.getSelectedAssessmentPeriod2();
			} else {
				assPeriod2 = registerDto.getPreviousAssDate();
			}

			row = sheet.createRow(10);
			cell = row.createCell(0);
			cell.setCellValue("Previous Assessment");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(10, 10, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(assPeriod2);
			sheet.addMergedRegion(new CellRangeAddress(10, 10, 2, 3));

			// User Details

			// Main Table Started
			Row classficationRow = sheet.createRow(13);
			Row assessmentRow = sheet.createRow(12);

			CellStyle style = wb.createCellStyle();
			style.setWrapText(true); // Set wordwrap
			// Set Font
			Font font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName("Times Roman");
			font.setColor(IndexedColors.BLACK.getIndex());
			font.setBold(true);
			font.setItalic(false);

			// Setting Background color
			// style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
			// style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			style.setAlignment(HorizontalAlignment.CENTER);
			style.setFont(font);

			String[] strOfcArr = { "Serial Number", "Office Type", "Risk Classification", "Count",
					"Total Number of Risk Assessed", "High", "Medium", "Low", "Total Number of Risk Assessed", "High",
					"Medium", "Low" };

			Cell tblCell0 = null;
			int itrOfc = 0;
			int itr = 0;

			for (String str : strOfcArr) {
				tblCell0 = classficationRow.createCell(itrOfc);

				style.setBorderBottom(BorderStyle.THIN);
				style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderRight(BorderStyle.THIN);
				style.setRightBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderLeft(BorderStyle.THIN);
				style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderTop(BorderStyle.THIN);
				style.setTopBorderColor(IndexedColors.BLACK.getIndex());
				style.setWrapText(true);

				classficationRow.setHeight((short) 700);

				tblCell0.setCellValue(str);
				tblCell0.setCellStyle(style);

				if (itrOfc == 4) {

					sheet.addMergedRegion(new CellRangeAddress(12, 12, 4, 7));
					style.setFont(font);
					Cell newCell = assessmentRow.createCell(4);
					newCell.setCellValue(registerDto.getCurrentAssDate());
					newCell.setCellStyle(style);
				}

				if (itrOfc == 8) {

					sheet.addMergedRegion(new CellRangeAddress(12, 12, 8, 11));
					style.setFont(font);
					Cell newCell = assessmentRow.createCell(8);
					newCell.setCellValue(registerDto.getPreviousAssDate());
					newCell.setCellStyle(style);
				}

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
				}

				itrOfc++;

			}

			// For Corporation ofc Data
			// Till here Correct

			// Table Cells
			int j = 0;
			// System.out.println(registerDto);
			for (RiskRegisterDto riskRegister : registerDto.getCorporationList()) {

				// int classificationList = riskRegister.getRiskCatDtoList().size();
				j++;
				String counter = "" + j;
				// System.out.println("Counter " + counter);
				data.put(j, new Object[] { riskRegister.getRiskCatDtoList()

				});

			}

			// Iterate over data and write to sheet

			Set<Integer> keyset = data.keySet();
			int rownum = 0;
			int nextRowNum = 14;
			for (Integer key : keyset) {
				rownum = 0;
				rownum = rownum + nextRowNum;
				nextRowNum = rownum;
				row = sheet.createRow(rownum);

				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					System.out.println("Object " + obj);

					int categoryList = 0;
					if (columnIndex == 0) {

						List<RiskCategoryDto> riskCatList = new ArrayList<>();
						if (obj instanceof ArrayList<?>) {
							((ArrayList) obj).forEach(datat -> riskCatList.add((RiskCategoryDto) datat));
						}

						CellStyle style1 = wb.createCellStyle();
						style1.setBorderBottom(BorderStyle.THIN);
						style1.setBottomBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderRight(BorderStyle.THIN);
						style1.setRightBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderLeft(BorderStyle.THIN);
						style1.setLeftBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderTop(BorderStyle.THIN);
						style1.setTopBorderColor(IndexedColors.BLACK.getIndex());
						style1.setAlignment(HorizontalAlignment.LEFT);
						style1.setWrapText(true);

						CellStyle style2 = wb.createCellStyle();
						style2.setBorderBottom(BorderStyle.THIN);
						style2.setBottomBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderRight(BorderStyle.THIN);
						style2.setRightBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderLeft(BorderStyle.THIN);
						style2.setLeftBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderTop(BorderStyle.THIN);
						style2.setTopBorderColor(IndexedColors.BLACK.getIndex());
						style2.setWrapText(true);
						style2.setAlignment(HorizontalAlignment.RIGHT);

						// System.out.println("Original Current Row Value is " + row.getRowNum());
						// int previousNum = row.getRowNum() -1;
						Row currentRow = sheet.createRow(rownum);
						int i = 0;
						int initialRow = currentRow.getRowNum();

						categoryList = riskCatList.size();
						categoryList = categoryList - 1;
						sheet.addMergedRegion(new CellRangeAddress(nextRowNum, nextRowNum + categoryList, 0, 0));
						style.setFont(font);
						sheet.addMergedRegion(new CellRangeAddress(nextRowNum, nextRowNum + categoryList, 1, 1));
						sheet.addMergedRegion(new CellRangeAddress(nextRowNum, nextRowNum + categoryList, 4, 4));
						sheet.addMergedRegion(new CellRangeAddress(nextRowNum, nextRowNum + categoryList, 8, 8));
int temp=0;
						for (RiskCategoryDto obj1 : riskCatList) {

							Cell srNoCell = currentRow.createCell(0);
							srNoCell.setCellValue(obj1.getSrNo());
							srNoCell.setCellStyle(style2);

							Cell deptCell = currentRow.createCell(1);
							deptCell.setCellValue(obj1.getDeptName());
							deptCell.setCellStyle(style1);

//							Cell countCell = currentRow.createCell(2);
//							countCell.setCellValue(obj1.getCurrentRiskCount());
//							countCell.setCellStyle(style2);

							// System.out.println("current Row " + currentRow.getRowNum());

							Cell newCell = currentRow.createCell(2);
							newCell.setCellValue(obj1.getRiskClassification());
							newCell.setCellStyle(style1);

							Cell classificationCountCell = currentRow.createCell(3);
							classificationCountCell.setCellValue(obj1.getClassificationCount());
							classificationCountCell.setCellStyle(style1);

							// currentRiskCount

							Cell newCell2 = currentRow.createCell(4);
							newCell2.setCellValue(obj1.getCurrentRiskCount());
							newCell2.setCellStyle(style2);

							// currentHigh

							Cell currentHigh = currentRow.createCell(5);
							currentHigh.setCellValue(obj1.getCurrHigh());
							currentHigh.setCellStyle(style2);
							// sheet.addMergedRegion(new CellRangeAddress(initialRow, 18, 5, 5));

							// currentMedium

							Cell currentMedium = currentRow.createCell(6);
							currentMedium.setCellValue(obj1.getCurrMedium());
							currentMedium.setCellStyle(style2);

							// currentLow

							Cell currentLow = currentRow.createCell(7);
							currentLow.setCellValue(obj1.getCurrLow());
							currentLow.setCellStyle(style2);

							// prevRiskCount

							Cell prevRiskCountCell = currentRow.createCell(8);
							prevRiskCountCell.setCellValue(obj1.getPrviousRiskCount());
							prevRiskCountCell.setCellStyle(style2);

							// prevHigh

							Cell prevHigh = currentRow.createCell(9);
							prevHigh.setCellValue(obj1.getPrevHigh());
							prevHigh.setCellStyle(style2);

							// prevMedium

							Cell prevMedium = currentRow.createCell(10);
							prevMedium.setCellValue(obj1.getPrevMedium());
							prevMedium.setCellStyle(style2);

							// prevLow

							Cell prevLow = currentRow.createCell(11);
							prevLow.setCellValue(obj1.getPrevLow());
							prevLow.setCellStyle(style2);

							i++;
							currentRow = sheet.createRow(row.getRowNum() + i);
temp=row.getRowNum() + i;
						}

						nextRowNum = nextRowNum + categoryList;
						rowNumber=temp+1;
						
					}
					// else {
					// nextRowNum = nextRowNum + 3;
					// }

					// Creating Header
					cell = row.createCell(cellnum++);
					CellStyle Style = wb.createCellStyle();

					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					}

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 15 * 256);
					sheet.setColumnWidth(1, 25 * 256);
					sheet.setColumnWidth(2, 25 * 256);
					sheet.setColumnWidth(3, 25 * 256);
					sheet.setColumnWidth(4, 25 * 256);

					sheet.setColumnWidth(5, 20 * 256);
					sheet.setColumnWidth(6, 20 * 256);
					sheet.setColumnWidth(7, 20 * 256);
					sheet.setColumnWidth(8, 20 * 256);
					sheet.setColumnWidth(9, 20 * 256);
					sheet.setColumnWidth(10, 20 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					Style.setAlignment(HorizontalAlignment.RIGHT);
					Style.setFont(dataFont);

					int numMerged = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged; i++) {

						// System.out.println("Itrator " + i);
						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}

					itr++;
				}
			}

			// Departmental View

			String[] strDeptArr = { "Serial Number", "Department Name", "Risk Classification", "Count",
					"Total Number of Risk Assessed", "High", "Medium", "Low", "Total Number of Risk Assessed", "High",
					"Medium", "Low" };

			//Row departmentHeaderRow = sheet.createRow(30);
			//rowNumber
			Row departmentHeaderRow = sheet.createRow(rowNumber+5);
			Row departmentHeaderAssRow = sheet.createRow(29);
			Cell tblCell01 = null;
			int itrDept = 0;
			int itr1 = 0;

			for (String str : strDeptArr) {
				tblCell01 = departmentHeaderRow.createCell(itrDept);

				style.setBorderBottom(BorderStyle.THIN);
				style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderRight(BorderStyle.THIN);
				style.setRightBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderLeft(BorderStyle.THIN);
				style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderTop(BorderStyle.THIN);
				style.setTopBorderColor(IndexedColors.BLACK.getIndex());
				style.setWrapText(true);

				departmentHeaderRow.setHeight((short) 700);

				tblCell01.setCellValue(str);
				tblCell01.setCellStyle(style);

				if (itrDept == 4) {

					sheet.addMergedRegion(new CellRangeAddress(29, 29, 4, 7));
					style.setFont(font);
					Cell newCell = departmentHeaderAssRow.createCell(4);
					newCell.setCellValue(registerDto.getCurrentAssDate());
					newCell.setCellStyle(style);
				}

				if (itrDept == 8) {

					sheet.addMergedRegion(new CellRangeAddress(29, 29, 8, 11));
					style.setFont(font);
					Cell newCell = departmentHeaderAssRow.createCell(8);
					newCell.setCellValue(registerDto.getPreviousAssDate());
					newCell.setCellStyle(style);
				}

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
				}

				itrDept++;

			}

			// Table Cells
			int k = 0;
			// System.out.println(registerDto);
			for (RiskRegisterDto riskRegister : registerDto.getRegisterList()) {

				// int classificationList = riskRegister.getRiskCatDtoList().size();
				k++;
				String counter = "" + k;
				// System.out.println("Counter " + counter);
				data.put(k, new Object[] { riskRegister.getRiskCatDtoListForDept()

				});

			}

			// Iterate over data and write to sheet

			keyset = data.keySet();
			rownum = 0;
			nextRowNum = 31;
			for (Integer key : keyset) {
				rownum = 0;
				rownum = rownum + nextRowNum;
				nextRowNum = rownum;
				row = sheet.createRow(rownum);

				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					System.out.println("Object " + obj);

					int categoryList = 0;
					if (columnIndex == 0) {

						List<RiskCategoryDto> riskCatList = new ArrayList<>();
						if (obj instanceof ArrayList<?>) {
							((ArrayList) obj).forEach(datat -> riskCatList.add((RiskCategoryDto) datat));
						}

						CellStyle style1 = wb.createCellStyle();
						style1.setBorderBottom(BorderStyle.THIN);
						style1.setBottomBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderRight(BorderStyle.THIN);
						style1.setRightBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderLeft(BorderStyle.THIN);
						style1.setLeftBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderTop(BorderStyle.THIN);
						style1.setTopBorderColor(IndexedColors.BLACK.getIndex());
						style1.setAlignment(HorizontalAlignment.LEFT);
						style1.setWrapText(true);

						CellStyle style2 = wb.createCellStyle();
						style2.setBorderBottom(BorderStyle.THIN);
						style2.setBottomBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderRight(BorderStyle.THIN);
						style2.setRightBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderLeft(BorderStyle.THIN);
						style2.setLeftBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderTop(BorderStyle.THIN);
						style2.setTopBorderColor(IndexedColors.BLACK.getIndex());
						style2.setWrapText(true);
						style2.setAlignment(HorizontalAlignment.RIGHT);

						// System.out.println("Original Current Row Value is " + row.getRowNum());
						// int previousNum = row.getRowNum() -1;
						Row currentRow = sheet.createRow(rownum);
						int i = 0;
						int initialRow = currentRow.getRowNum();

						categoryList = riskCatList.size();

						categoryList = categoryList - 1;
						System.out.println("Category List " + categoryList);
						// nextRowNum = nextRowNum + 1;

						int temp = nextRowNum + categoryList;
						System.out.println("Temp " + temp);
						System.out.println("nextRowNum " + nextRowNum);

						if (categoryList >= 1) {

							sheet.addMergedRegion(new CellRangeAddress(nextRowNum, temp, 0, 0));
							style.setFont(font);
							sheet.addMergedRegion(new CellRangeAddress(nextRowNum, temp, 1, 1));
							sheet.addMergedRegion(new CellRangeAddress(nextRowNum, temp, 4, 4));
							sheet.addMergedRegion(new CellRangeAddress(nextRowNum, temp, 8, 8));

						}
						for (RiskCategoryDto obj1 : riskCatList) {

							System.out.println("Obejcts " + obj1);

							Cell srNoCell = currentRow.createCell(0);
							srNoCell.setCellValue(obj1.getSrNo());
							srNoCell.setCellStyle(style2);

							Cell deptCell = currentRow.createCell(1);
							System.out.println("Department Name " + obj1.getDeptName());
							deptCell.setCellValue(obj1.getDeptName());
							deptCell.setCellStyle(style1);

//										Cell countCell = currentRow.createCell(2);
//										countCell.setCellValue(obj1.getCurrentRiskCount());
//										countCell.setCellStyle(style2);

							// System.out.println("current Row " + currentRow.getRowNum());

							Cell newCell = currentRow.createCell(2);
							newCell.setCellValue(obj1.getRiskClassification());
							newCell.setCellStyle(style1);

							Cell classificationCountCell = currentRow.createCell(3);
							classificationCountCell.setCellValue(obj1.getClassificationCount());
							classificationCountCell.setCellStyle(style1);

							// System.out.println("current Row " + currentRow.getRowNum());

							// currentRiskCount

							Cell newCell2 = currentRow.createCell(4);
							newCell2.setCellValue(obj1.getCurrentRiskCount());
							newCell2.setCellStyle(style2);

							// currentHigh

							Cell currentHigh = currentRow.createCell(5);
							currentHigh.setCellValue(obj1.getCurrHigh());
							currentHigh.setCellStyle(style2);
							// sheet.addMergedRegion(new CellRangeAddress(initialRow, 18, 5, 5));

							// currentMedium

							Cell currentMedium = currentRow.createCell(6);
							currentMedium.setCellValue(obj1.getCurrMedium());
							currentMedium.setCellStyle(style2);

							// currentLow

							Cell currentLow = currentRow.createCell(7);
							currentLow.setCellValue(obj1.getCurrLow());
							currentLow.setCellStyle(style2);

							// prevRiskCount

							Cell prevRiskCountCell = currentRow.createCell(8);
							prevRiskCountCell.setCellValue(obj1.getPrviousRiskCount());
							prevRiskCountCell.setCellStyle(style2);

							// prevHigh

							Cell prevHigh = currentRow.createCell(9);
							prevHigh.setCellValue(obj1.getPrevHigh());
							prevHigh.setCellStyle(style2);

							// prevMedium

							Cell prevMedium = currentRow.createCell(10);
							prevMedium.setCellValue(obj1.getPrevMedium());
							prevMedium.setCellStyle(style2);

							// prevLow

							Cell prevLow = currentRow.createCell(11);
							prevLow.setCellValue(obj1.getPrevLow());
							prevLow.setCellStyle(style2);

							i++;
							currentRow = sheet.createRow(row.getRowNum() + i);

						}

						nextRowNum = nextRowNum + riskCatList.size();
					}
					// else {
					// nextRowNum = nextRowNum + 3;
					// }

					// Creating Header
					cell = row.createCell(cellnum++);
					CellStyle Style = wb.createCellStyle();

					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					}

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 15 * 256);
					sheet.setColumnWidth(1, 25 * 256);
					sheet.setColumnWidth(2, 25 * 256);
					sheet.setColumnWidth(3, 25 * 256);
					sheet.setColumnWidth(4, 25 * 256);

					sheet.setColumnWidth(5, 20 * 256);
					sheet.setColumnWidth(6, 20 * 256);
					sheet.setColumnWidth(7, 20 * 256);
					sheet.setColumnWidth(8, 20 * 256);
					sheet.setColumnWidth(9, 20 * 256);
					sheet.setColumnWidth(10, 20 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					Style.setAlignment(HorizontalAlignment.RIGHT);
					Style.setFont(dataFont);

					int numMerged = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged; i++) {

						// System.out.println("Itrator " + i);
						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}

					itr++;
				}
			}

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			wb.write(outputStream);
			return new ByteArrayInputStream(outputStream.toByteArray());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	@Override
	public ByteArrayInputStream exportReportWithImage(List<NotificationDto> ntfDtoList, User user,
			String AssesmmentPeriod) {
		try {

			Workbook wb = new XSSFWorkbook();

			ByteArrayOutputStream stream = new ByteArrayOutputStream();

			Sheet sheet = wb.createSheet("Pending KRI List");

			String usingSystemProperty = System.getProperty("user.dir");
			// System.out.println("Current directory path using system property:- " +
			// usingSystemProperty);

			InputStream inputStream = getClass().getResourceAsStream("../LIC-Logo-Too-Small.png");

			// System.out.println("Get Class "+ getClass().getCanonicalName());
			// System.out.println("Get Path "+ getClass().getResourceAsStream("../../"));

			// FileInputStream obtains input bytes from the image file
			// InputStream inputStream = new
			// FileInputStream("C:\\\\Users\\\\Admin\\\\LIC-Logo-Too-Small.png");

			// Get the contents of an InputStream as a byte[].
			byte[] bytes = IOUtils.toByteArray(inputStream);
			// Adds a picture to the workbook
			int pictureIdx = wb.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
			// close the input stream
			inputStream.close();

			// Returns an object that handles instantiating concrete classes
			CreationHelper helper = wb.getCreationHelper();

			// Creates the top-level drawing patriarch.
			Drawing drawing = sheet.createDrawingPatriarch();

			// Create an anchor that is attached to the worksheet
			ClientAnchor anchor = helper.createClientAnchor();
			// set top-left corner for the image

			anchor.setCol1(0); // Column B
			anchor.setRow1(0); // Row 3
			anchor.setCol2(2); // Column C
			anchor.setRow2(2); // Row 4

			// Creates a picture
			Picture pict = drawing.createPicture(anchor, pictureIdx);
			// Reset the image to the original size
			pict.resize();

			// This data needs to be written (Object[])
			Map<Integer, Object[]> data = new TreeMap<Integer, Object[]>();

			TreeMap<String, Object[]> treeMap = new TreeMap<String, Object[]>();
			Row rowFirst = sheet.createRow(0);

			Cell cellDate = null;
			CellStyle style = wb.createCellStyle();

			// cellDate = row.createCell(10);
			// cellDate.setCellValue("Risk Register As On Date "+
			// registerDto.getRegisterDate().toString());
			// Set Font
			Font headingFont = wb.createFont();
			headingFont.setFontHeightInPoints((short) 10);
			headingFont.setFontName("Times New Roman");
			headingFont.setColor(IndexedColors.RED.getIndex());
			headingFont.setBold(true);
			headingFont.setItalic(false);

			// For Printing Date Of Risk Register

			// cellStyle.setDataFormat(createHelper.createDataFormat().getFormat("m/d/yy
			// h:mm"));
			Font font = wb.createFont();
			font.setFontHeightInPoints((short) 10);
			font.setFontName("Times New Roman");
			// font.setColor(IndexedColors.BLACK.getIndex());
			font.setBold(true);
			font.setItalic(false);
			style.setFont(font);

			// cellDate.setCellStyle(cellStyle);

			Row rowSecond = sheet.createRow(3);
			cellDate = rowSecond.createCell(0);
			cellDate.setCellValue("Report Name ");
			cellDate.setCellStyle(style);
			cellDate = rowSecond.createCell(1);

			cellDate.setCellValue("Pending Report Value Capture KRI");
			cellDate = rowSecond.createCell(3);
			cellDate.setCellValue("User Name");
			cellDate.setCellStyle(style);
			cellDate = rowSecond.createCell(4);

			cellDate.setCellValue(user.getUsername().toUpperCase());
			Row rowThird = sheet.createRow(4);
			cellDate = rowThird.createCell(0);
			cellDate.setCellValue("Report Date ");
			cellDate.setCellStyle(style);
			cellDate = rowThird.createCell(1);
			String pattern = "dd-MM-yyyy";
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
			cellDate.setCellValue(AssesmmentPeriod);
			cellDate = rowThird.createCell(3);
			cellDate.setCellValue("User Department");
			cellDate.setCellStyle(style);
			cellDate = rowThird.createCell(4);
			cellDate.setCellValue(user.getUserDeptName().toUpperCase());
			Row rowFour = sheet.createRow(5);
			cellDate = rowFour.createCell(0);
			cellDate.setCellValue("Report Extraction Date  ");
			cellDate.setCellStyle(style);
			cellDate = rowFour.createCell(1);
			cellDate.setCellValue(simpleDateFormat.format(new Date()));
			cellDate = rowFour.createCell(3);
			cellDate.setCellValue("User Office");
			cellDate.setCellStyle(style);
			cellDate = rowFour.createCell(4);
			cellDate.setCellValue(user.getUserOfficeType().toUpperCase());

			Row row = sheet.createRow(7);

			row.setHeight((short) 800);
			style.setWrapText(true); // Set wordwrap
			// Set Font

			// Setting Background color
			style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
			style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			style.setAlignment(HorizontalAlignment.CENTER);
			style.setFont(font);

			String[] strArr = { "Module Id", "Department Name", "Status", "Office Code", "KRI Value Description" };

			Cell cell = null;
			int itr = 0;

			for (String str : strArr) {
				cell = row.createCell(itr);

				style.setBorderBottom(BorderStyle.THIN);
				style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderRight(BorderStyle.THIN);
				style.setRightBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderLeft(BorderStyle.THIN);
				style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderTop(BorderStyle.THIN);
				style.setTopBorderColor(IndexedColors.BLACK.getIndex());
				style.setWrapText(true);

				row.setHeight((short) 700);

				cell.setCellValue(str);
				cell.setCellStyle(style);

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
				}

				itr++;
			}

			int j = 0;

			for (NotificationDto ntfDto : ntfDtoList) {

				j++;
				String counter = "" + j;
				System.out.println("Counter " + counter);
				data.put(j,
						new Object[] { ntfDto.getNtfModuleId().toString(), ntfDto.getDeptName().toString(),
								ntfDto.getNtfValue().toString(), ntfDto.getOfcCode().toString(),
								ntfDto.getNtfModuleDesc().toString() });

			}

			// Iterate over data and write to sheet

			Set<Integer> keyset = data.keySet();
			int rownum = 8;
			for (Integer key : keyset) {
				row = sheet.createRow(rownum++);

				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					CellStyle Style = wb.createCellStyle();

					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 25 * 200);
					sheet.setColumnWidth(1, 25 * 256);
					sheet.setColumnWidth(2, 25 * 200);
					sheet.setColumnWidth(3, 25 * 200);
					sheet.setColumnWidth(4, 25 * 256);
					sheet.setColumnWidth(5, 25 * 200);
					sheet.setColumnWidth(6, 25 * 200);
					sheet.setColumnWidth(7, 25 * 200);
					sheet.setColumnWidth(8, 25 * 200);
					sheet.setColumnWidth(9, 25 * 200);
					sheet.setColumnWidth(10, 25 * 200);
					sheet.setColumnWidth(11, 25 * 200);

					sheet.setColumnWidth(12, 20 * 200);
					sheet.setColumnWidth(13, 20 * 200);
					sheet.setColumnWidth(14, 20 * 200);
					sheet.setColumnWidth(15, 20 * 200);

					sheet.setColumnWidth(16, 25 * 200);
					sheet.setColumnWidth(17, 25 * 200);
					sheet.setColumnWidth(18, 25 * 200);
					sheet.setColumnWidth(19, 25 * 200);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 8);
					dataFont.setFontName("Times New Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					Style.setAlignment(HorizontalAlignment.CENTER);
					Style.setFont(dataFont);

					if (columnIndex == 9 || columnIndex == 10 || columnIndex == 11 || columnIndex == 18
							|| columnIndex == 19) {
						// Setting Background color
						Style.setFillForegroundColor(IndexedColors.WHITE.getIndex());
						Style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
					}
					// Creating Header
					cell = row.createCell(cellnum++);

					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					}
				}
			}

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			wb.write(outputStream);
			return new ByteArrayInputStream(outputStream.toByteArray());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// exportControlIndexReport
	public ByteArrayInputStream exportControlIndexReport(ControlIndexGraphDto cntrlIndexDto) {

		try {

			Workbook wb = new XSSFWorkbook();
			// ByteArrayOutputStream stream = new ByteArrayOutputStream();
			Sheet sheet = wb.createSheet("Control Index Report");
			// String usingSystemProperty = System.getProperty("user.dir");

			InputStream inputStream = getClass().getResourceAsStream("../LIC-Logo-Too-Small.png");

			// Get the contents of an InputStream as a byte[].
			byte[] bytes = IOUtils.toByteArray(inputStream);
			// Adds a picture to the workbook
			int pictureIdx = wb.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
			// close the input stream
			inputStream.close();

			// Returns an object that handles instantiating concrete classes
			CreationHelper helper = wb.getCreationHelper();

			// Creates the top-level drawing patriarch.
			Drawing drawing = sheet.createDrawingPatriarch();

			// Create an anchor that is attached to the worksheet
			ClientAnchor anchor = helper.createClientAnchor();
			// set top-left corner for the image

			anchor.setCol1(0); // Column B
			anchor.setRow1(0); // Row 3
			anchor.setCol2(0); // Column C
			anchor.setRow2(0); // Row 4

			// Creates a picture
			Picture pict = drawing.createPicture(anchor, pictureIdx);
			// Reset the image to the original size
			pict.resize();

			// This data needs to be written (Object[])
			Map<Integer, Object[]> data = new TreeMap<Integer, Object[]>();

			// TreeMap<String, Object[]> treeMap = new TreeMap<String, Object[]>();
			Row rowFirst = sheet.createRow(0);

			Cell tittleData = null;

			// Set Font
			Font headingFont = wb.createFont();
			headingFont.setFontHeightInPoints((short) 14);
			headingFont.setFontName("Times Roman");
			headingFont.setColor(IndexedColors.BLACK.getIndex());
			headingFont.setBold(true);
			headingFont.setItalic(false);

			// For Printing Date Of Risk Register
			CellStyle cellHedingStyle = wb.createCellStyle();
			tittleData = rowFirst.createCell(4);
			tittleData.setCellValue(" Control Index Report ");
			tittleData.setCellStyle(cellHedingStyle);
			cellHedingStyle.setFont(headingFont);
			// Tittle Part is Over

			Font reportDataFont = wb.createFont();
			reportDataFont.setFontHeightInPoints((short) 11);
			reportDataFont.setFontName("Times Roman");
			reportDataFont.setColor(IndexedColors.BLACK.getIndex());
			reportDataFont.setBold(true);
			reportDataFont.setItalic(false);

			// Report Details Section
			CellStyle cellStyle = wb.createCellStyle();
			reportDataFont.setFontHeightInPoints((short) 11);
			cellStyle.setFont(reportDataFont);

			Row row = sheet.createRow(4);
			Cell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("Control Index Report");
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			// User Details - User Name
			cell = row.createCell(5);
			cell.setCellValue("User name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(cntrlIndexDto.getUserDto().getUsername());
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 7, 8));

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("Report Date");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(cntrlIndexDto.getReportDate());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			// User Details - User Department
			cell = row.createCell(5);
			cell.setCellValue("User Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(cntrlIndexDto.getUserDto().getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 7, 8));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("Report Extraction Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(cntrlIndexDto.getReportExtractedDate());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 2, 3));

			// User Details - User Office
			cell = row.createCell(5);
			cell.setCellValue("User Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(cntrlIndexDto.getUserDto().getUserOfficeType().toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 7, 8));

			row = sheet.createRow(7);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue((cntrlIndexDto.getUserDto().getUserDeptName().equalsIgnoreCase("ERM")) ? "ALL"
					: cntrlIndexDto.getUserDto().getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 2, 3));

			String reportExtractedOfc = null;
			if (cntrlIndexDto.getSelectedOfficeType() != null) {
				reportExtractedOfc = cntrlIndexDto.getSelectedOfficeType();
			} else {
				reportExtractedOfc = cntrlIndexDto.getUserDto().getUserOfficeType();
			}

			row = sheet.createRow(8);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(reportExtractedOfc.toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 2, 3));

			// User Details

			// Formula will starte
			Font formulaFont = wb.createFont();
			formulaFont.setFontHeightInPoints((short) 14);
			formulaFont.setFontName("Times Roman");
			formulaFont.setColor(IndexedColors.BLACK.getIndex());
			formulaFont.setBold(true);
			formulaFont.setItalic(false);

			CellStyle cellStyle2 = wb.createCellStyle();
			formulaFont.setFontHeightInPoints((short) 12);
			cellStyle2.setFont(formulaFont);

			cellStyle2.setBorderBottom(BorderStyle.THIN);
			cellStyle2.setBottomBorderColor(IndexedColors.BLACK.getIndex());
			cellStyle2.setBorderRight(BorderStyle.THIN);
			cellStyle2.setRightBorderColor(IndexedColors.BLACK.getIndex());
			cellStyle2.setBorderLeft(BorderStyle.THIN);
			cellStyle2.setLeftBorderColor(IndexedColors.BLACK.getIndex());
			cellStyle2.setBorderTop(BorderStyle.THIN);
			cellStyle2.setTopBorderColor(IndexedColors.BLACK.getIndex());
			cellStyle2.setWrapText(true);

			Row formulaRow = sheet.createRow(11);
			Cell formuleCell = null;
			formuleCell = formulaRow.createCell(0);
			formuleCell.setCellValue("Effective");
			formuleCell.setCellStyle(cellStyle2);
			formuleCell = formulaRow.createCell(1);
			formuleCell.setCellValue("100%");
			formuleCell.setCellStyle(cellStyle2);

			formulaRow = sheet.createRow(12);
			formuleCell = formulaRow.createCell(0);
			formuleCell.setCellValue("Partially Effective");
			formuleCell.setCellStyle(cellStyle2);
			formuleCell = formulaRow.createCell(1);
			formuleCell.setCellValue("50%");
			formuleCell.setCellStyle(cellStyle2);

			formulaRow = sheet.createRow(13);
			formuleCell = formulaRow.createCell(0);
			formuleCell.setCellValue("Ineffective");
			formuleCell.setCellStyle(cellStyle2);
			formuleCell = formulaRow.createCell(1);
			formuleCell.setCellValue("0%");
			formuleCell.setCellStyle(cellStyle2);

			formulaRow = sheet.createRow(14);
			formuleCell = formulaRow.createCell(0);
			formuleCell.setCellValue(
					"Effectiveness of Controls= (Number of Control Effective Controls* 100%)+ (Number of Partially Effective Controls* 50%) + (Number of of Ineffective Controls* 0%)");
			formuleCell.setCellStyle(cellStyle2);
			sheet.addMergedRegion(new CellRangeAddress(14, 14, 0, 7));

			formulaRow = sheet.createRow(15);
			formuleCell = formulaRow.createCell(0);
			formuleCell.setCellValue(
					"Control Effectiveness Index Pass % = (Effectiveness of Controls/Number of Controls)* 100");
			formuleCell.setCellStyle(cellStyle2);
			sheet.addMergedRegion(new CellRangeAddress(15, 15, 0, 7));

			// Main Table Started
			Row classficationRow = sheet.createRow(18);

			CellStyle style = wb.createCellStyle();
			style.setWrapText(true); // Set wordwrap
			// Set Font
			Font font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName("Times Roman");
			font.setColor(IndexedColors.BLACK.getIndex());
			font.setBold(true);
			font.setItalic(false);

			// Setting Background color
			// style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
			// style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			style.setAlignment(HorizontalAlignment.CENTER);
			style.setFont(font);

			String[] orgArr = { "Serial Number", "Office Type", "Assessment Period", "Total Number Of Risks",
					"Control Assessment Status ", "Effectiveness of Controls",
					"Control Effectiveness index Pass Percentage" };

			Cell tblCellOrg = null;
			int itrOrg = 0;
			Row orgAssessmentRow = sheet.createRow(19);

			for (String strOrg : orgArr) {
				tblCellOrg = classficationRow.createCell(itrOrg);

				style.setBorderBottom(BorderStyle.THIN);
				style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderRight(BorderStyle.THIN);
				style.setRightBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderLeft(BorderStyle.THIN);
				style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderTop(BorderStyle.THIN);
				style.setTopBorderColor(IndexedColors.BLACK.getIndex());
				style.setWrapText(true);

				classficationRow.setHeight((short) 700);

				tblCellOrg.setCellValue(strOrg);
				tblCellOrg.setCellStyle(style);

				if (itrOrg == 4) {
					sheet.addMergedRegion(new CellRangeAddress(18, 18, 4, 6));

					Cell cell2 = orgAssessmentRow.createCell(4);
					cell2.setCellValue(" Effective ");
					cell2.setCellStyle(style);
					cell2 = orgAssessmentRow.createCell(5);
					cell2.setCellValue(" Partially Effective ");
					cell2.setCellStyle(style);
					cell2 = orgAssessmentRow.createCell(6);
					cell2.setCellValue(" Ineffective ");
					cell2.setCellStyle(style);

					itrOrg = itrOrg + 2;
				} else {
					sheet.addMergedRegion(new CellRangeAddress(18, 19, itrOrg, itrOrg));
				}

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
				}

				itrOrg++;
			}

			// Till here Correct
			int j = 0;

			for (ControlIndexGraphDto cntrlIndex : cntrlIndexDto.getCorporationList()) {

				j++;
				String counter = "" + j;
				System.out.println("Counter " + counter);
				data.put(j, new Object[] { j, cntrlIndex.getCorporationalOfc(), cntrlIndex.getCorporationalAssPeriod(),
						cntrlIndex.getCorporationalTotalNoRisk(), cntrlIndex.getCorporationEffectiveCount(),
						cntrlIndex.getCorporationPartialEffectiveCount(), cntrlIndex.getCorporationIneffectiveCount(),
						cntrlIndex.getCorporationEffectivenessOfContrl(),
						cntrlIndex.getCorporationContrlEffectivenessIndex() });

			}

			// Iterate over data and write to sheet

			Set<Integer> keyset = data.keySet();
			int rownum = 20;

			for (Integer key : keyset) {

				row = sheet.createRow(rownum++);

				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					System.out.println("columnIndex Position " + columnIndex);
					System.out.println("Object Value is " + obj);

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					CellStyle Style = wb.createCellStyle();
					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 20 * 256);
					sheet.setColumnWidth(1, 20 * 256);
					sheet.setColumnWidth(2, 20 * 256);
					sheet.setColumnWidth(3, 20 * 256);
					sheet.setColumnWidth(4, 20 * 256);
					sheet.setColumnWidth(5, 20 * 256);
					sheet.setColumnWidth(6, 20 * 256);
					sheet.setColumnWidth(7, 20 * 256);
					sheet.setColumnWidth(8, 20 * 256);
					sheet.setColumnWidth(9, 20 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					// Style.setAlignment(HorizontalAlignment.RIGHT);
					Style.setFont(dataFont);

					// Creating Header
					cell = row.createCell(cellnum++);

					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					} else if (obj instanceof Double) {
						cell.setCellValue((Double) obj);
						cell.setCellStyle(Style);
					}

					int numMerged = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged; i++) {

						// System.out.println("Itrator " + i);
						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}
				}
			}

			//////////
			Row departmentRow = sheet.createRow(25);

			String[] strArr = { "Serial Number", "Department", "Assessment Period", "Total Number Of Risks",
					"Control Assessment Status ", "Effectiveness of Controls",
					"Control Effectiveness index Pass Percentage", "Office Code" };

			Cell tblCell = null;
			int itr = 0;
			Row cntrlAssessmentRow = sheet.createRow(26);

			for (String str : strArr) {
				tblCell = departmentRow.createCell(itr);

				style.setBorderBottom(BorderStyle.THIN);
				style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderRight(BorderStyle.THIN);
				style.setRightBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderLeft(BorderStyle.THIN);
				style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderTop(BorderStyle.THIN);
				style.setTopBorderColor(IndexedColors.BLACK.getIndex());
				style.setWrapText(true);

				departmentRow.setHeight((short) 700);

				tblCell.setCellValue(str);
				tblCell.setCellStyle(style);

				if (itr == 4) {
					sheet.addMergedRegion(new CellRangeAddress(25, 25, 4, 6));

					Cell cell2 = cntrlAssessmentRow.createCell(4);
					cell2.setCellValue(" Effective ");
					cell2.setCellStyle(style);
					cell2 = cntrlAssessmentRow.createCell(5);
					cell2.setCellValue(" Partially Effective ");
					cell2.setCellStyle(style);
					cell2 = cntrlAssessmentRow.createCell(6);
					cell2.setCellValue(" Ineffective ");
					cell2.setCellStyle(style);

					itr = itr + 2;
				} else {
					sheet.addMergedRegion(new CellRangeAddress(25, 26, itr, itr));
				}

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
				}

				itr++;
			}

			// Till here Correct
			j = 0;

			for (ControlIndexGraphDto cntrlIndex : cntrlIndexDto.getContrlIndexList()) {

				j++;
				String counter = "" + j;
				System.out.println("Counter " + counter);
				data.put(j,
						new Object[] { j, cntrlIndex.getDeptName(), cntrlIndex.getSelectedAssessmentPeriod(),
								cntrlIndex.getTotalNoRisk(), cntrlIndex.getEffectiveCount(),
								cntrlIndex.getPartialEffectiveCount(), cntrlIndex.getIneffectiveCount(),
								cntrlIndex.getEffectivenessOfContrl(), cntrlIndex.getContrlEffectivenessIndex(),
								cntrlIndex.getOfficeCode() });

			}

			// Iterate over data and write to sheet

			keyset = data.keySet();
			rownum = 27;

			for (Integer key : keyset) {

				row = sheet.createRow(rownum++);

				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					// System.out.println("columnIndex Position " + columnIndex);
					// System.out.println("Object Value is " + obj);

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					CellStyle Style = wb.createCellStyle();
					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 20 * 256);
					sheet.setColumnWidth(1, 20 * 256);
					sheet.setColumnWidth(2, 20 * 256);
					sheet.setColumnWidth(3, 20 * 256);
					sheet.setColumnWidth(4, 20 * 256);
					sheet.setColumnWidth(5, 20 * 256);
					sheet.setColumnWidth(6, 20 * 256);
					sheet.setColumnWidth(7, 20 * 256);
					sheet.setColumnWidth(8, 20 * 256);
					sheet.setColumnWidth(9, 20 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					// Style.setAlignment(HorizontalAlignment.RIGHT);
					Style.setFont(dataFont);

					// Creating Header
					cell = row.createCell(cellnum++);

					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					} else if (obj instanceof Double) {
						cell.setCellValue((Double) obj);
						cell.setCellStyle(Style);
					}

					int numMerged = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged; i++) {

						// System.out.println("Itrator " + i);
						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}
				}
			}

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			wb.write(outputStream);
			return new ByteArrayInputStream(outputStream.toByteArray());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	public ByteArrayInputStream exportComparisionReport(ControlIndexGraphDto cntrlIndexDto) {

		try {

			Workbook wb = new XSSFWorkbook();
			// ByteArrayOutputStream stream = new ByteArrayOutputStream();
			Sheet sheet = wb.createSheet("Risk Comparision Report");
			// String usingSystemProperty = System.getProperty("user.dir");

			InputStream inputStream = getClass().getResourceAsStream("../LIC-Logo-Too-Small.png");

			// Get the contents of an InputStream as a byte[].
			byte[] bytes = IOUtils.toByteArray(inputStream);
			// Adds a picture to the workbook
			int pictureIdx = wb.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
			// close the input stream
			inputStream.close();

			// Returns an object that handles instantiating concrete classes
			CreationHelper helper = wb.getCreationHelper();

			// Creates the top-level drawing patriarch.
			Drawing drawing = sheet.createDrawingPatriarch();

			// Create an anchor that is attached to the worksheet
			ClientAnchor anchor = helper.createClientAnchor();
			// set top-left corner for the image

			anchor.setCol1(0); // Column B
			anchor.setRow1(0); // Row 3
			anchor.setCol2(0); // Column C
			anchor.setRow2(0); // Row 4

			// Creates a picture
			Picture pict = drawing.createPicture(anchor, pictureIdx);
			// Reset the image to the original size
			pict.resize();

			// This data needs to be written (Object[])
			Map<Integer, Object[]> corpdata = new TreeMap<Integer, Object[]>();
			Map<Integer, Object[]> data = new TreeMap<Integer, Object[]>();

			TreeMap<String, Object[]> treeMap = new TreeMap<String, Object[]>();
			Row rowFirst = sheet.createRow(0);

			Cell tittleData = null;

			// Set Font
			Font headingFont = wb.createFont();
			headingFont.setFontHeightInPoints((short) 14);
			headingFont.setFontName("Times Roman");
			headingFont.setColor(IndexedColors.BLACK.getIndex());
			headingFont.setBold(true);
			headingFont.setItalic(false);

			// For Printing Date Of Risk Register
			/*
			 * CellStyle cellHedingStyle = wb.createCellStyle(); tittleData =
			 * rowFirst.createCell(4); tittleData.setCellValue(" Risk Comparision Report ");
			 * tittleData.setCellStyle(cellHedingStyle);
			 * cellHedingStyle.setFont(headingFont);
			 */
			// Tittle Part is Over

			Font reportDataFont = wb.createFont();
			reportDataFont.setFontHeightInPoints((short) 11);
			reportDataFont.setFontName("Times Roman");
			reportDataFont.setColor(IndexedColors.BLACK.getIndex());
			reportDataFont.setBold(true);
			reportDataFont.setItalic(false);

			// Report Details Section
			CellStyle cellStyle = wb.createCellStyle();
			reportDataFont.setFontHeightInPoints((short) 11);
			cellStyle.setFont(reportDataFont);

			Row row = sheet.createRow(4);
			Cell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("RISK COMPARISION REPORT");
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			// User Details - User Name
			cell = row.createCell(5);
			cell.setCellValue("User Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(cntrlIndexDto.getUserDto().getUsername());
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 7, 8));

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("Report Date");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(cntrlIndexDto.getReportDate());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			// User Details - User Department
			cell = row.createCell(5);
			cell.setCellValue("User Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(cntrlIndexDto.getUserDto().getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 7, 8));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("Report Extraction Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(cntrlIndexDto.getReportExtractedDate().toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 2, 3));

			// User Details - User Office
			cell = row.createCell(5);
			cell.setCellValue("User Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(cntrlIndexDto.getUserDto().getUserOfficeType().toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 7, 8));

			row = sheet.createRow(7);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(cntrlIndexDto.getUserDto().getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 2, 3));

			String reportExtractedOfc = null;
			if (cntrlIndexDto.getSelectedOfficeType() != null) {
				reportExtractedOfc = cntrlIndexDto.getSelectedOfficeType();
			} else {
				reportExtractedOfc = cntrlIndexDto.getUserDto().getUserOfficeType();
			}

			row = sheet.createRow(8);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(cntrlIndexDto.getOfficeName()+" - "+cntrlIndexDto.getSelectedOfficeCode());
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 2, 3));

			String assPeriod1 = null;
			if (cntrlIndexDto.getSelectedAssessmentPeriod() != null) {
				assPeriod1 = cntrlIndexDto.getSelectedAssessmentPeriod();
			}
			/*
			 * else { assPeriod1 = cntrlIndexDto.getCurrentAssDate(); }
			 */
			row = sheet.createRow(9);
			cell = row.createCell(0);
			cell.setCellValue("Current Assessment");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(assPeriod1);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 2, 3));

			String assPeriod2 = null;
			if (cntrlIndexDto.getSelectedAssessmentPeriod2() != null) {
				assPeriod2 = cntrlIndexDto.getSelectedAssessmentPeriod2();
			}
			/*
			 * else { assPeriod2 = registerDto.getPreviousAssDate(); }
			 */

			row = sheet.createRow(10);
			cell = row.createCell(0);
			cell.setCellValue("Previous Assessment");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(10, 10, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(assPeriod2);
			sheet.addMergedRegion(new CellRangeAddress(10, 10, 2, 3));

			// User Details

			// Corporation View

			Row corporationRow = sheet.createRow(16);
			Row assessmentCorpRows = sheet.createRow(17);

			CellStyle corpstyle = wb.createCellStyle();
			corpstyle.setWrapText(true); // Set wordwrap
			// Set Font
			Font corpfont = wb.createFont();
			corpfont.setFontHeightInPoints((short) 12);
			corpfont.setFontName("Times Roman");
			corpfont.setColor(IndexedColors.BLACK.getIndex());
			corpfont.setBold(true);
			corpfont.setItalic(false);
			// corpstyle.setAlignment(HorizontalAlignment.CENTER);
			corpstyle.setFont(corpfont);

			String[] strCorpArr = { "Serial No", "Office Type", "Assessment Period", "Total No. Of Risks",
					"Total No. Of Risks Assessed", "Inherent Risk Assessment", "Residual Risk Assessment" };

			Cell tblCellCorp = null;
			int itrcorp = 0;

			for (String str : strCorpArr) {

				corpstyle.setBorderBottom(BorderStyle.THIN);
				corpstyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setBorderRight(BorderStyle.THIN);
				corpstyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setBorderLeft(BorderStyle.THIN);
				corpstyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setBorderTop(BorderStyle.THIN);
				corpstyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setWrapText(true);

				// classficationRow.setHeight((short) 700);
				tblCellCorp = corporationRow.createCell(itrcorp);
				tblCellCorp.setCellStyle(corpstyle);

				if (itrcorp == 5) {

					sheet.addMergedRegion(new CellRangeAddress(16, 16, 5, 7));
					tblCellCorp.setCellValue(str);

					tblCellCorp = assessmentCorpRows.createCell(5);
					tblCellCorp.setCellValue("Severe");
					tblCellCorp.setCellStyle(corpstyle);

					tblCellCorp = assessmentCorpRows.createCell(6);
					tblCellCorp.setCellValue("Moderate");
					tblCellCorp.setCellStyle(corpstyle);

					tblCellCorp = assessmentCorpRows.createCell(7);
					tblCellCorp.setCellValue("Minor");
					tblCellCorp.setCellStyle(corpstyle);
					itrcorp = itrcorp + 2;

				} else if (itrcorp == 8) {

					sheet.addMergedRegion(new CellRangeAddress(16, 16, 8, 10));
					tblCellCorp.setCellValue(str);

					tblCellCorp = assessmentCorpRows.createCell(8);
					tblCellCorp.setCellValue("High");
					tblCellCorp.setCellStyle(corpstyle);

					tblCellCorp = assessmentCorpRows.createCell(9);
					tblCellCorp.setCellValue("Medium");
					tblCellCorp.setCellStyle(corpstyle);

					tblCellCorp = assessmentCorpRows.createCell(10);
					tblCellCorp.setCellValue("Low");
					tblCellCorp.setCellStyle(corpstyle);
					// itrcorp = itrcorp + 2;
				}

				else {
					sheet.addMergedRegion(new CellRangeAddress(16, 17, itrcorp, itrcorp));
					tblCellCorp.setCellValue(str);
				}

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);

				}

				itrcorp++;
			}

			// corporation Data
			// Table Cells

			int j = 0;
			// System.out.println(registerDto);
			for (ControlIndexGraphDto ctrlDto : cntrlIndexDto.getCorporationList()) {

				j++;
				String counter = "" + j;
				// System.out.println("Counter " + counter);
				corpdata.put(j,
						new Object[] { j, ctrlDto.getCorporationalOfc(),
								ctrlDto.getCorporationalAssPeriod().toUpperCase(),
								ctrlDto.getCorporationalTotalNoRisk(), ctrlDto.getCorporationalTotalNoRiskAssessed(),
								ctrlDto.getCorporationSevereCount(), ctrlDto.getCorporationModerateCount(),
								ctrlDto.getCorporationMinorCount(), ctrlDto.getCorporationHighCount(),
								ctrlDto.getCorporationMediumCount(), ctrlDto.getCorporationLowCount() });

			}

			// Iterate over data and write to sheet

			Set<Integer> keyset = corpdata.keySet();
			int rownum = 18;
			// int nextRowNum = 18;
			for (Integer key : keyset) {

				row = sheet.createRow(rownum++);

				Object[] objArr = corpdata.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					// Creating Header
					cell = row.createCell(cellnum++);

					CellStyle Style = wb.createCellStyle();
					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					}

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					Style.setWrapText(false); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 15 * 256);
					sheet.setColumnWidth(1, 25 * 256);
					sheet.setColumnWidth(2, 25 * 256);
					sheet.setColumnWidth(3, 25 * 256);
					sheet.setColumnWidth(4, 25 * 256);

					sheet.setColumnWidth(5, 20 * 256);
					sheet.setColumnWidth(6, 20 * 256);
					sheet.setColumnWidth(7, 20 * 256);
					sheet.setColumnWidth(8, 20 * 256);
					sheet.setColumnWidth(9, 20 * 256);
					sheet.setColumnWidth(10, 20 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					// Style.setAlignment(HorizontalAlignment.RIGHT);
					Style.setFont(dataFont);

					int numMerged = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged; i++) {

						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}

					itrcorp++;
				}
			}

			// Main Table Started

			Row classficationRow = sheet.createRow(25);
			Row assessmentRows = sheet.createRow(26);

			CellStyle style = wb.createCellStyle();
			style.setWrapText(true);
			// Setwordwrap // Set Font
			Font font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName("Times Roman");
			font.setColor(IndexedColors.BLACK.getIndex());
			font.setBold(true);
			font.setItalic(false);

			// Setting Background color //
			style.setFillForegroundColor(IndexedColors.WHITE.getIndex()); //
			style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			// style.setAlignment(HorizontalAlignment.CENTER);
			style.setFont(font);

			String[] strArr = { "Serial No", "Assessment Period", "Department", "Total No. Of Risks",
					"Total No. Of Risks Assessed", "Inherent Risk Assessment", "Residual Risk Assessment" };

			Cell tblCell = null;
			int itr = 0;

			for (String str : strArr) {

				style.setBorderBottom(BorderStyle.THIN);
				style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderRight(BorderStyle.THIN);
				style.setRightBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderLeft(BorderStyle.THIN);
				style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderTop(BorderStyle.THIN);
				style.setTopBorderColor(IndexedColors.BLACK.getIndex());
				style.setWrapText(false);

				// classficationRow.setHeight((short) 700);
				tblCell = classficationRow.createCell(itr);
				tblCell.setCellStyle(style);

				if (itr == 5) {

					sheet.addMergedRegion(new CellRangeAddress(25, 25, 5, 7));
					tblCell.setCellValue(str);

					tblCell = assessmentRows.createCell(5);
					tblCell.setCellValue("Severe");
					tblCell.setCellStyle(style);

					tblCell = assessmentRows.createCell(6);
					tblCell.setCellValue("Moderate");
					tblCell.setCellStyle(style);

					tblCell = assessmentRows.createCell(7);
					tblCell.setCellValue("Minor");
					tblCell.setCellStyle(style);
					itr = itr + 2;

				} else if (itr == 8) {

					sheet.addMergedRegion(new CellRangeAddress(25, 25, 8, 10));
					tblCell.setCellValue(str);

					tblCell = assessmentRows.createCell(8);
					tblCell.setCellValue("High");
					tblCell.setCellStyle(style);

					tblCell = assessmentRows.createCell(9);
					tblCell.setCellValue("Medium");
					tblCell.setCellStyle(style);

					tblCell = assessmentRows.createCell(10);
					tblCell.setCellValue("Low");
					tblCell.setCellStyle(style);
					// itr = itr + 2;

				} else {
					sheet.addMergedRegion(new CellRangeAddress(25, 26, itr, itr));
					tblCell.setCellValue(str);
				}

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);

				}

				itr++;
			}
			// Till here Correct

			// Table Cells

			int k = 0;
			// System.out.println(registerDto);
			for (RiskAssessmentDto riskDto : cntrlIndexDto.getRiskAssessmentDtoList()) {

				k++;
				String counter = "" + k;
				// System.out.println("Counter " + counter);
				data.put(k,
						new Object[] { k, riskDto.getAssessmentPeriod(), riskDto.getDeptName().toUpperCase(),
								riskDto.getTotalNoOfRisk(), riskDto.getTotalNoRiskAssessed(), riskDto.getSevere(),
								riskDto.getModerate(), riskDto.getMinor(), riskDto.getHigh(), riskDto.getMedium(),
								riskDto.getLow() });

			}

			// Iterate over data and write to sheet
			String colorVal = "W";
			int countVar = 0;
			Set<Integer> keyset1 = data.keySet();
			int rownum1 = 27; // int nextRowNum = 18;
			for (Integer key : keyset1) {
				row = sheet.createRow(rownum1++);
				CellStyle Style = wb.createCellStyle();
				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				if (countVar == 0) {

					if ("W".equalsIgnoreCase(colorVal)) {
						Style.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex()); //
						Style.setFillPattern(FillPatternType.SOLID_FOREGROUND);

					} else {
						Style.setFillForegroundColor(IndexedColors.WHITE.getIndex()); //
						Style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
					}
				} else {
					if ("W".equalsIgnoreCase(colorVal)) {
						Style.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex()); //
						Style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
						colorVal = "B";

					} else if ("B".equalsIgnoreCase(colorVal)) {
						Style.setFillForegroundColor(IndexedColors.WHITE.getIndex()); //
						Style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
						colorVal = "W";

					}
				}

				for (Object obj : objArr) {

					// Creating Header
					cell = row.createCell(cellnum++);

					if (obj instanceof String) {
						// String cellValue = (String) obj;

						cell.setCellValue((String) obj);
						cell.setCellStyle(Style);

						// Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					}

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 15 * 256);
					sheet.setColumnWidth(1, 25 * 256);
					sheet.setColumnWidth(2, 25 * 256);
					sheet.setColumnWidth(3, 25 * 256);
					sheet.setColumnWidth(4, 25 * 256);

					sheet.setColumnWidth(5, 20 * 256);
					sheet.setColumnWidth(6, 20 * 256);
					sheet.setColumnWidth(7, 20 * 256);
					sheet.setColumnWidth(8, 20 * 256);
					sheet.setColumnWidth(9, 20 * 256);
					sheet.setColumnWidth(10, 20 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					// Style.setAlignment(HorizontalAlignment.RIGHT);
					Style.setFont(dataFont);

					int numMerged1 = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged1; i++) {

						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}

					itr++;

				}
				if (countVar == 1) {
					countVar = 0;
				} else {
					countVar++;
				}
			}

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			wb.write(outputStream);
			return new ByteArrayInputStream(outputStream.toByteArray());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	// High Residual and Severe Inherent Report
	public ByteArrayInputStream exportHighResidualAndSevereInherent(RiskLibraryMasterDto riskLibDto) {

		try {

			Workbook wb = new XSSFWorkbook();
			// ByteArrayOutputStream stream = new ByteArrayOutputStream();
			Sheet sheet = wb.createSheet("High Residual And Severe Inherent Risk");
			// String usingSystemProperty = System.getProperty("user.dir");

			InputStream inputStream = getClass().getResourceAsStream("../LIC-Logo-Too-Small.png");

			// Get the contents of an InputStream as a byte[].
			byte[] bytes = IOUtils.toByteArray(inputStream);
			// Adds a picture to the workbook
			int pictureIdx = wb.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
			// close the input stream
			inputStream.close();

			// Returns an object that handles instantiating concrete classes
			CreationHelper helper = wb.getCreationHelper();

			// Creates the top-level drawing patriarch.
			Drawing drawing = sheet.createDrawingPatriarch();

			// Create an anchor that is attached to the worksheet
			ClientAnchor anchor = helper.createClientAnchor();
			// set top-left corner for the image

			anchor.setCol1(0); // Column B
			anchor.setRow1(0); // Row 3
			anchor.setCol2(0); // Column C
			anchor.setRow2(0); // Row 4

			// Creates a picture
			Picture pict = drawing.createPicture(anchor, pictureIdx);
			// Reset the image to the original size
			pict.resize();

			// This data needs to be written (Object[])
			Map<Integer, Object[]> corpdata = new TreeMap<Integer, Object[]>();
			Map<Integer, Object[]> data = new TreeMap<Integer, Object[]>();

			TreeMap<String, Object[]> treeMap = new TreeMap<String, Object[]>();
			Row rowFirst = sheet.createRow(0);

			Cell tittleData = null;

			// Set Font
			Font headingFont = wb.createFont();
			headingFont.setFontHeightInPoints((short) 14);
			headingFont.setFontName("Times Roman");
			headingFont.setColor(IndexedColors.BLACK.getIndex());
			headingFont.setBold(true);
			headingFont.setItalic(false);

			// For Printing Date Of Risk Register
			CellStyle cellHedingStyle = wb.createCellStyle();
			tittleData = rowFirst.createCell(4);
			tittleData.setCellValue(" High Residual And Severe Inherent Risk ");
			tittleData.setCellStyle(cellHedingStyle);
			cellHedingStyle.setFont(headingFont);
			// Tittle Part is Over

			Font reportDataFont = wb.createFont();
			reportDataFont.setFontHeightInPoints((short) 11);
			reportDataFont.setFontName("Times Roman");
			reportDataFont.setColor(IndexedColors.BLACK.getIndex());
			reportDataFont.setBold(true);
			reportDataFont.setItalic(false);

			// Report Details Section
			CellStyle cellStyle = wb.createCellStyle();
			reportDataFont.setFontHeightInPoints((short) 11);
			cellStyle.setFont(reportDataFont);

			Row row = sheet.createRow(4);
			Cell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("High Inherent Risk & High Residual Risks");
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			// User Details - User Name
			cell = row.createCell(5);
			cell.setCellValue("User Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(riskLibDto.getUserDto().getUsername());
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 7, 8));

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("Report Date");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(riskLibDto.getReportDate());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			// User Details - User Department
			cell = row.createCell(5);
			cell.setCellValue("User Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(riskLibDto.getUserDto().getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 7, 8));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("Report Extraction Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(riskLibDto.getReportExtractedDate().toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 2, 3));

			// User Details - User Office
			cell = row.createCell(5);
			cell.setCellValue("User Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(riskLibDto.getUserDto().getUserOfficeType().toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 7, 8));

			row = sheet.createRow(7);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(riskLibDto.getUserDto().getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 2, 3));

			String reportExtractedOfc = null;
			if (riskLibDto.getSelectedOfficeType() != null) {
				reportExtractedOfc = riskLibDto.getSelectedOfficeType();
			} else {
				reportExtractedOfc = riskLibDto.getUserDto().getUserOfficeType();
			}

			row = sheet.createRow(8);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(riskLibDto.getOfficeName().toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 2, 3));

			row = sheet.createRow(9);
			cell = row.createCell(0);
			cell.setCellValue("Assessment Period");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(riskLibDto.getSelectedAssessmentPeriod());
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 2, 3));

			// User Details

			// Corporation View

			Row corporationRow = sheet.createRow(14);
			Row assessmentCorpRows = sheet.createRow(15);

			CellStyle corpstyle = wb.createCellStyle();
			corpstyle.setWrapText(true); // Set wordwrap
			// Set Font
			Font corpfont = wb.createFont();
			corpfont.setFontHeightInPoints((short) 12);
			corpfont.setFontName("Times Roman");
			corpfont.setColor(IndexedColors.BLACK.getIndex());
			corpfont.setBold(true);
			corpfont.setItalic(false);
			// corpstyle.setAlignment(HorizontalAlignment.CENTER);
			corpstyle.setFont(corpfont);

			String[] strCorpArr = { "Risk Id",  "Risk Description", "Department Name",
					"Inherent Risk Rating", "Residual Risk Rating" };

			Cell tblCellCorp = null;
			int itrcorp = 0;

			for (String str : strCorpArr) {

				corpstyle.setBorderBottom(BorderStyle.THIN);
				corpstyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setBorderRight(BorderStyle.THIN);
				corpstyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setBorderLeft(BorderStyle.THIN);
				corpstyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setBorderTop(BorderStyle.THIN);
				corpstyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setWrapText(true);

				// classficationRow.setHeight((short) 700);
				tblCellCorp = corporationRow.createCell(itrcorp);
				tblCellCorp.setCellStyle(corpstyle);

				tblCellCorp.setCellValue(str);
				tblCellCorp.setCellStyle(corpstyle);

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);

				}

				itrcorp++;
			}

			// corporation Data
			// Table Cells
			int k = 0;
			// System.out.println(registerDto);
			for (RiskLibraryMasterDto riskDto : riskLibDto.getRiskLibDtoList()) {

				k++;
				String counter = "" + k;
				// System.out.println("Counter " + counter);
				data.put(k,
						new Object[] { riskDto.getRiskId(),  riskDto.getRiskDescription(),
								riskDto.getDeptName().toUpperCase(), riskDto.getRiskAssessmentValue(),
								riskDto.getResidualAssessmentValue() });

			}

			// Iterate over data and write to sheet
			Set<Integer> keyset = data.keySet();
			int rownum = 15;

			for (Integer key : keyset) {

				row = sheet.createRow(rownum++);

				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					// System.out.println("columnIndex Position " + columnIndex);
					// System.out.println("Object Value is " + obj);

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					CellStyle Style = wb.createCellStyle();
					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 20 * 256);
					sheet.setColumnWidth(1, 20 * 256);
					sheet.setColumnWidth(2, 20 * 256);
					sheet.setColumnWidth(3, 20 * 256);
					sheet.setColumnWidth(4, 20 * 256);
					sheet.setColumnWidth(5, 20 * 256);
					sheet.setColumnWidth(6, 20 * 256);
					sheet.setColumnWidth(7, 20 * 256);
					sheet.setColumnWidth(8, 20 * 256);
					sheet.setColumnWidth(9, 20 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					// Style.setAlignment(HorizontalAlignment.RIGHT);
					Style.setFont(dataFont);

					// Creating Header
					cell = row.createCell(cellnum++);

					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					} else if (obj instanceof Double) {
						cell.setCellValue((Double) obj);
						cell.setCellStyle(Style);
					}

					int numMerged = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged; i++) {

						// System.out.println("Itrator " + i);
						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}
				}
			}

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			wb.write(outputStream);
			return new ByteArrayInputStream(outputStream.toByteArray());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	@Override
	public ByteArrayInputStream exportHighResidualAndSevereInherentRisk(RiskRegisterDto riskRegisterDto,String AssessmentPeriod,User user)
			throws JsonParseException, JsonMappingException, IOException {
		// TODO Auto-generated method stub

		try {
			Date date = new Date();  
			SimpleDateFormat sdf=new SimpleDateFormat("dd/MM/yyyy");
			String dates=sdf.format(date);

			Workbook wb = new XSSFWorkbook();
			// ByteArrayOutputStream stream = new ByteArrayOutputStream();
			Sheet sheet = wb.createSheet("Severe Inherent and High Residual Report ");
			// String usingSystemProperty = System.getProperty("user.dir");

			InputStream inputStream = getClass().getResourceAsStream("../LIC-Logo-Too-Small.png");

			// Get the contents of an InputStream as a byte[].
			byte[] bytes = IOUtils.toByteArray(inputStream);
			// Adds a picture to the workbook
			int pictureIdx = wb.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
			// close the input stream
			inputStream.close();

			// Returns an object that handles instantiating concrete classes
			CreationHelper helper = wb.getCreationHelper();

			// Creates the top-level drawing patriarch.
			Drawing drawing = sheet.createDrawingPatriarch();

			// Create an anchor that is attached to the worksheet
			ClientAnchor anchor = helper.createClientAnchor();
			// set top-left corner for the image

			anchor.setCol1(0); // Column B
			anchor.setRow1(0); // Row 3
			anchor.setCol2(0); // Column C
			anchor.setRow2(0); // Row 4

			// Creates a picture
			Picture pict = drawing.createPicture(anchor, pictureIdx);
			// Reset the image to the original size
			pict.resize();

			// This data needs to be written (Object[])
			Map<Integer, Object[]> corpdata = new TreeMap<Integer, Object[]>();
			Map<Integer, Object[]> data = new TreeMap<Integer, Object[]>();

			TreeMap<String, Object[]> treeMap = new TreeMap<String, Object[]>();
			Row rowFirst = sheet.createRow(0);

			Cell tittleData = null;

			// Set Font
			Font headingFont = wb.createFont();
			headingFont.setFontHeightInPoints((short) 14);
			headingFont.setFontName("Times Roman");
			headingFont.setColor(IndexedColors.BLACK.getIndex());
			headingFont.setBold(true);
			headingFont.setItalic(false);

			// For Printing Date Of Risk Register
			CellStyle cellHedingStyle = wb.createCellStyle();
			tittleData = rowFirst.createCell(4);
			tittleData.setCellValue(" High Residual And Severe Inherent Risk ");
			tittleData.setCellStyle(cellHedingStyle);
			cellHedingStyle.setFont(headingFont);
			// Tittle Part is Over

			Font reportDataFont = wb.createFont();
			reportDataFont.setFontHeightInPoints((short) 11);
			reportDataFont.setFontName("Times Roman");
			reportDataFont.setColor(IndexedColors.BLACK.getIndex());
			reportDataFont.setBold(true);
			reportDataFont.setItalic(false);

			// Report Details Section
			CellStyle cellStyle = wb.createCellStyle();
			reportDataFont.setFontHeightInPoints((short) 11);
			cellStyle.setFont(reportDataFont);

			Row row = sheet.createRow(4);
			Cell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("High Inherent Risk & High Residual Risks");
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			// User Details - User Name
			cell = row.createCell(5);
			cell.setCellValue("User Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(user.getUsername());
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 7, 8));

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("Report Date");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(dates);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			// User Details - User Department
			cell = row.createCell(5);
			cell.setCellValue("User Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(user.getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 7, 8));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("Report Extraction Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(dates);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 2, 3));

			// User Details - User Office
			cell = row.createCell(5);
			cell.setCellValue("User Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(user.getUserOfficeType());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 7, 8));

			row = sheet.createRow(7);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(user.getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 2, 3));

			
			row = sheet.createRow(8);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(riskRegisterDto.getSelectOfficeType());
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 2, 3));

			row = sheet.createRow(9);
			cell = row.createCell(0);
			cell.setCellValue("Assessment Period");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(AssessmentPeriod);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 2, 3));

			// User Details

			// Corporation View

			Row corporationRow = sheet.createRow(14);
			Row assessmentCorpRows = sheet.createRow(15);

			CellStyle corpstyle = wb.createCellStyle();
			corpstyle.setWrapText(true); // Set wordwrap
			// Set Font
			Font corpfont = wb.createFont();
			corpfont.setFontHeightInPoints((short) 12);
			corpfont.setFontName("Times Roman");
			corpfont.setColor(IndexedColors.BLACK.getIndex());
			corpfont.setBold(true);
			corpfont.setItalic(false);
			// corpstyle.setAlignment(HorizontalAlignment.CENTER);
			corpstyle.setFont(corpfont);

			String[] strCorpArr = { "Risk Id",  "Risk Description", "Department Name",
					"Inherent Risk Rating", "Residual Risk Rating" };

			Cell tblCellCorp = null;
			int itrcorp = 0;

			for (String str : strCorpArr) {

				corpstyle.setBorderBottom(BorderStyle.THIN);
				corpstyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setBorderRight(BorderStyle.THIN);
				corpstyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setBorderLeft(BorderStyle.THIN);
				corpstyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setBorderTop(BorderStyle.THIN);
				corpstyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
				corpstyle.setWrapText(true);

				// classficationRow.setHeight((short) 700);
				tblCellCorp = corporationRow.createCell(itrcorp);
				tblCellCorp.setCellStyle(corpstyle);

				tblCellCorp.setCellValue(str);
				tblCellCorp.setCellStyle(corpstyle);

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);

				}

				itrcorp++;
			}

			// corporation Data
			// Table Cells
			int k = 0;
			// System.out.println(registerDto);
			for (String riskDto : riskRegisterDto.getRegisterStatusList()) {

				k++;
				String counter = "" + k;
				// System.out.println("Counter " + counter);
				data.put(k,
						new Object[] { riskDto.split("~")[0],  riskDto.split("~")[1],
								riskDto.split("~")[2], riskDto.split("~")[3],
								riskDto.split("~")[4] });

			}

			// Iterate over data and write to sheet
			Set<Integer> keyset = data.keySet();
			int rownum = 15;

			for (Integer key : keyset) {

				row = sheet.createRow(rownum++);

				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					// System.out.println("columnIndex Position " + columnIndex);
					// System.out.println("Object Value is " + obj);

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					CellStyle Style = wb.createCellStyle();
					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 20 * 256);
					sheet.setColumnWidth(1, 20 * 256);
					sheet.setColumnWidth(2, 20 * 256);
					sheet.setColumnWidth(3, 20 * 256);
					sheet.setColumnWidth(4, 20 * 256);
					sheet.setColumnWidth(5, 20 * 256);
					sheet.setColumnWidth(6, 20 * 256);
					sheet.setColumnWidth(7, 20 * 256);
					sheet.setColumnWidth(8, 20 * 256);
					sheet.setColumnWidth(9, 20 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					// Style.setAlignment(HorizontalAlignment.RIGHT);
					Style.setFont(dataFont);

					// Creating Header
					cell = row.createCell(cellnum++);

					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					} else if (obj instanceof Double) {
						cell.setCellValue((Double) obj);
						cell.setCellStyle(Style);
					}

					int numMerged = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged; i++) {

						// System.out.println("Itrator " + i);
						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}
				}
			}

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			wb.write(outputStream);
			return new ByteArrayInputStream(outputStream.toByteArray());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	@Override
	public ByteArrayInputStream exportClassificationInherentReport(RiskRegisterDto registerDto)
			throws JsonParseException, JsonMappingException, IOException {
		// TODO Auto-generated method stub


		try {
int rowNumber=0;
			Workbook wb = new XSSFWorkbook();
			// ByteArrayOutputStream stream = new ByteArrayOutputStream();
			Sheet sheet = wb.createSheet("Inherent Risk Classification Report");
			// String usingSystemProperty = System.getProperty("user.dir");

			InputStream inputStream = getClass().getResourceAsStream("../LIC-Logo-Too-Small.png");

			// Get the contents of an InputStream as a byte[].
			byte[] bytes = IOUtils.toByteArray(inputStream);
			// Adds a picture to the workbook
			int pictureIdx = wb.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
			// close the input stream
			inputStream.close();

			// Returns an object that handles instantiating concrete classes
			CreationHelper helper = wb.getCreationHelper();

			// Creates the top-level drawing patriarch.
			Drawing drawing = sheet.createDrawingPatriarch();

			// Create an anchor that is attached to the worksheet
			ClientAnchor anchor = helper.createClientAnchor();
			// set top-left corner for the image

			anchor.setCol1(0); // Column B
			anchor.setRow1(0); // Row 3
			anchor.setCol2(0); // Column C
			anchor.setRow2(0); // Row 4

			// Creates a picture
			Picture pict = drawing.createPicture(anchor, pictureIdx);
			// Reset the image to the original size
			pict.resize();

			// This data needs to be written (Object[])
			Map<Integer, Object[]> data = new TreeMap<Integer, Object[]>();

			// TreeMap<String, Object[]> treeMap = new TreeMap<String, Object[]>();
			Row rowFirst = sheet.createRow(0);

			Cell tittleData = null;

			// Set Font
			Font headingFont = wb.createFont();
			headingFont.setFontHeightInPoints((short) 14);
			headingFont.setFontName("Times Roman");
			headingFont.setColor(IndexedColors.BLACK.getIndex());
			headingFont.setBold(true);
			headingFont.setItalic(false);

			// For Printing Date Of Risk Register
			CellStyle cellHedingStyle = wb.createCellStyle();
			tittleData = rowFirst.createCell(4);
			tittleData.setCellValue(" Risk Classification Report ");
			tittleData.setCellStyle(cellHedingStyle);
			cellHedingStyle.setFont(headingFont);
			// Tittle Part is Over

			Font reportDataFont = wb.createFont();
			reportDataFont.setFontHeightInPoints((short) 11);
			reportDataFont.setFontName("Times Roman");
			reportDataFont.setColor(IndexedColors.BLACK.getIndex());
			reportDataFont.setBold(true);
			reportDataFont.setItalic(false);

			// Report Details Section
			CellStyle cellStyle = wb.createCellStyle();
			reportDataFont.setFontHeightInPoints((short) 11);
			cellStyle.setFont(reportDataFont);

			Row row = sheet.createRow(4);
			Cell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("Risk Classification Report");
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			// User Details - User Name
			cell = row.createCell(5);
			cell.setCellValue("User name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(registerDto.getUserDto().getUsername());
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 7, 8));

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("Report Date");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(registerDto.getReportDate());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			// User Details - User Department
			cell = row.createCell(5);
			cell.setCellValue("User Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(registerDto.getUserDto().getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 7, 8));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("Report Extraction Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(registerDto.getReportExtractedDate());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 2, 3));

			// User Details - User Office
			cell = row.createCell(5);
			cell.setCellValue("User Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(registerDto.getUserDto().getUserOfficeType().toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 7, 8));

			row = sheet.createRow(7);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(registerDto.getUserDto().getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 2, 3));

			String reportExtractedOfc = null;
			if (registerDto.getSelectOfficeType() != null) {
				reportExtractedOfc = registerDto.getSelectOfficeType()+" - "+registerDto.getSelectedOfcCode();
			} else {
				reportExtractedOfc = registerDto.getUserDto().getUserOfficeType()+" - "+registerDto.getUserDto().getOfficeCode();
			}

			row = sheet.createRow(8);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(reportExtractedOfc.toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 2, 3));

			String assPeriod1 = null;
			if (registerDto.getSelectedAssessmentPeriod() != null) {
				assPeriod1 = registerDto.getSelectedAssessmentPeriod();
			} else {
				assPeriod1 = registerDto.getCurrentAssDate();
			}
			row = sheet.createRow(9);
			cell = row.createCell(0);
			cell.setCellValue("Current Assessment");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(assPeriod1);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 2, 3));

			String assPeriod2 = null;
			if (registerDto.getSelectedAssessmentPeriod2() != null) {
				assPeriod2 = registerDto.getSelectedAssessmentPeriod2();
			} else {
				assPeriod2 = registerDto.getPreviousAssDate();
			}

			row = sheet.createRow(10);
			cell = row.createCell(0);
			cell.setCellValue("Previous Assessment");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(10, 10, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(assPeriod2);
			sheet.addMergedRegion(new CellRangeAddress(10, 10, 2, 3));

			// User Details

			// Main Table Started
			Row classficationRow = sheet.createRow(13);
			Row assessmentRow = sheet.createRow(12);

			CellStyle style = wb.createCellStyle();
			style.setWrapText(true); // Set wordwrap
			// Set Font
			Font font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName("Times Roman");
			font.setColor(IndexedColors.BLACK.getIndex());
			font.setBold(true);
			font.setItalic(false);

			// Setting Background color
			// style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
			// style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			style.setAlignment(HorizontalAlignment.CENTER);
			style.setFont(font);

			String[] strOfcArr = { "Serial Number", "Office Type", "Risk Classification", "Count",
					"Total Number of Risk Assessed", "Severe", "Moderate", "Minor", "Total Number of Risk Assessed", "Severe",
					"Moderate", "Minor" };

			Cell tblCell0 = null;
			int itrOfc = 0;
			int itr = 0;

			for (String str : strOfcArr) {
				tblCell0 = classficationRow.createCell(itrOfc);

				style.setBorderBottom(BorderStyle.THIN);
				style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderRight(BorderStyle.THIN);
				style.setRightBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderLeft(BorderStyle.THIN);
				style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderTop(BorderStyle.THIN);
				style.setTopBorderColor(IndexedColors.BLACK.getIndex());
				style.setWrapText(true);

				classficationRow.setHeight((short) 700);

				tblCell0.setCellValue(str);
				tblCell0.setCellStyle(style);

				if (itrOfc == 4) {

					sheet.addMergedRegion(new CellRangeAddress(12, 12, 4, 7));
					style.setFont(font);
					Cell newCell = assessmentRow.createCell(4);
					newCell.setCellValue(registerDto.getCurrentAssDate());
					newCell.setCellStyle(style);
				}

				if (itrOfc == 8) {

					sheet.addMergedRegion(new CellRangeAddress(12, 12, 8, 11));
					style.setFont(font);
					Cell newCell = assessmentRow.createCell(8);
					newCell.setCellValue(registerDto.getPreviousAssDate());
					newCell.setCellStyle(style);
				}

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
				}

				itrOfc++;

			}

			// For Corporation ofc Data
			// Till here Correct

			// Table Cells
			int j = 0;
			// System.out.println(registerDto);
			for (RiskRegisterDto riskRegister : registerDto.getCorporationList()) {

				// int classificationList = riskRegister.getRiskCatDtoList().size();
				j++;
				String counter = "" + j;
				// System.out.println("Counter " + counter);
				data.put(j, new Object[] { riskRegister.getRiskCatDtoList()

				});

			}

			// Iterate over data and write to sheet

			Set<Integer> keyset = data.keySet();
			int rownum = 0;
			int nextRowNum = 14;
			for (Integer key : keyset) {
				rownum = 0;
				rownum = rownum + nextRowNum;
				nextRowNum = rownum;
				row = sheet.createRow(rownum);

				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					System.out.println("Object " + obj);

					int categoryList = 0;
					if (columnIndex == 0) {

						List<RiskCategoryDto> riskCatList = new ArrayList<>();
						if (obj instanceof ArrayList<?>) {
							((ArrayList) obj).forEach(datat -> riskCatList.add((RiskCategoryDto) datat));
						}

						CellStyle style1 = wb.createCellStyle();
						style1.setBorderBottom(BorderStyle.THIN);
						style1.setBottomBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderRight(BorderStyle.THIN);
						style1.setRightBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderLeft(BorderStyle.THIN);
						style1.setLeftBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderTop(BorderStyle.THIN);
						style1.setTopBorderColor(IndexedColors.BLACK.getIndex());
						style1.setAlignment(HorizontalAlignment.LEFT);
						style1.setWrapText(true);

						CellStyle style2 = wb.createCellStyle();
						style2.setBorderBottom(BorderStyle.THIN);
						style2.setBottomBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderRight(BorderStyle.THIN);
						style2.setRightBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderLeft(BorderStyle.THIN);
						style2.setLeftBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderTop(BorderStyle.THIN);
						style2.setTopBorderColor(IndexedColors.BLACK.getIndex());
						style2.setWrapText(true);
						style2.setAlignment(HorizontalAlignment.RIGHT);

						// System.out.println("Original Current Row Value is " + row.getRowNum());
						// int previousNum = row.getRowNum() -1;
						Row currentRow = sheet.createRow(rownum);
						int i = 0;
						int initialRow = currentRow.getRowNum();

						categoryList = riskCatList.size();
						categoryList = categoryList - 1;
						sheet.addMergedRegion(new CellRangeAddress(nextRowNum, nextRowNum + categoryList, 0, 0));
						style.setFont(font);
						sheet.addMergedRegion(new CellRangeAddress(nextRowNum, nextRowNum + categoryList, 1, 1));
						sheet.addMergedRegion(new CellRangeAddress(nextRowNum, nextRowNum + categoryList, 4, 4));
						sheet.addMergedRegion(new CellRangeAddress(nextRowNum, nextRowNum + categoryList, 8, 8));
int temp=0;
						for (RiskCategoryDto obj1 : riskCatList) {

							Cell srNoCell = currentRow.createCell(0);
							srNoCell.setCellValue(obj1.getSrNo());
							srNoCell.setCellStyle(style2);

							Cell deptCell = currentRow.createCell(1);
							deptCell.setCellValue(obj1.getDeptName());
							deptCell.setCellStyle(style1);

//							Cell countCell = currentRow.createCell(2);
//							countCell.setCellValue(obj1.getCurrentRiskCount());
//							countCell.setCellStyle(style2);

							// System.out.println("current Row " + currentRow.getRowNum());

							Cell newCell = currentRow.createCell(2);
							newCell.setCellValue(obj1.getRiskClassification());
							newCell.setCellStyle(style1);

							Cell classificationCountCell = currentRow.createCell(3);
							classificationCountCell.setCellValue(obj1.getClassificationCount());
							classificationCountCell.setCellStyle(style1);

							// currentRiskCount

							Cell newCell2 = currentRow.createCell(4);
							newCell2.setCellValue(obj1.getCurrentRiskCount());
							newCell2.setCellStyle(style2);

							// currentHigh

							Cell currentHigh = currentRow.createCell(5);
							currentHigh.setCellValue(obj1.getCurrHigh());
							currentHigh.setCellStyle(style2);
							// sheet.addMergedRegion(new CellRangeAddress(initialRow, 18, 5, 5));

							// currentMedium

							Cell currentMedium = currentRow.createCell(6);
							currentMedium.setCellValue(obj1.getCurrMedium());
							currentMedium.setCellStyle(style2);

							// currentLow

							Cell currentLow = currentRow.createCell(7);
							currentLow.setCellValue(obj1.getCurrLow());
							currentLow.setCellStyle(style2);

							// prevRiskCount

							Cell prevRiskCountCell = currentRow.createCell(8);
							prevRiskCountCell.setCellValue(obj1.getPrviousRiskCount());
							prevRiskCountCell.setCellStyle(style2);

							// prevHigh

							Cell prevHigh = currentRow.createCell(9);
							prevHigh.setCellValue(obj1.getPrevHigh());
							prevHigh.setCellStyle(style2);

							// prevMedium

							Cell prevMedium = currentRow.createCell(10);
							prevMedium.setCellValue(obj1.getPrevMedium());
							prevMedium.setCellStyle(style2);

							// prevLow

							Cell prevLow = currentRow.createCell(11);
							prevLow.setCellValue(obj1.getPrevLow());
							prevLow.setCellStyle(style2);

							i++;
							currentRow = sheet.createRow(row.getRowNum() + i);
temp=row.getRowNum() + i;
						}

						nextRowNum = nextRowNum + categoryList;
						rowNumber=temp+1;
						
					}
					// else {
					// nextRowNum = nextRowNum + 3;
					// }

					// Creating Header
					cell = row.createCell(cellnum++);
					CellStyle Style = wb.createCellStyle();

					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					}

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 15 * 256);
					sheet.setColumnWidth(1, 25 * 256);
					sheet.setColumnWidth(2, 25 * 256);
					sheet.setColumnWidth(3, 25 * 256);
					sheet.setColumnWidth(4, 25 * 256);

					sheet.setColumnWidth(5, 20 * 256);
					sheet.setColumnWidth(6, 20 * 256);
					sheet.setColumnWidth(7, 20 * 256);
					sheet.setColumnWidth(8, 20 * 256);
					sheet.setColumnWidth(9, 20 * 256);
					sheet.setColumnWidth(10, 20 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					Style.setAlignment(HorizontalAlignment.RIGHT);
					Style.setFont(dataFont);

					int numMerged = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged; i++) {

						// System.out.println("Itrator " + i);
						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}

					itr++;
				}
			}

			// Departmental View

			String[] strDeptArr = { "Serial Number", "Department Name", "Risk Classification", "Count",
					"Total Number of Risk Assessed", "High", "Medium", "Low", "Total Number of Risk Assessed", "High",
					"Medium", "Low" };

			//Row departmentHeaderRow = sheet.createRow(30);
			//rowNumber
			Row departmentHeaderRow = sheet.createRow(rowNumber+5);
			Row departmentHeaderAssRow = sheet.createRow(29);
			Cell tblCell01 = null;
			int itrDept = 0;
			int itr1 = 0;

			for (String str : strDeptArr) {
				tblCell01 = departmentHeaderRow.createCell(itrDept);

				style.setBorderBottom(BorderStyle.THIN);
				style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderRight(BorderStyle.THIN);
				style.setRightBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderLeft(BorderStyle.THIN);
				style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderTop(BorderStyle.THIN);
				style.setTopBorderColor(IndexedColors.BLACK.getIndex());
				style.setWrapText(true);

				departmentHeaderRow.setHeight((short) 700);

				tblCell01.setCellValue(str);
				tblCell01.setCellStyle(style);

				if (itrDept == 4) {

					sheet.addMergedRegion(new CellRangeAddress(29, 29, 4, 7));
					style.setFont(font);
					Cell newCell = departmentHeaderAssRow.createCell(4);
					newCell.setCellValue(registerDto.getCurrentAssDate());
					newCell.setCellStyle(style);
				}

				if (itrDept == 8) {

					sheet.addMergedRegion(new CellRangeAddress(29, 29, 8, 11));
					style.setFont(font);
					Cell newCell = departmentHeaderAssRow.createCell(8);
					newCell.setCellValue(registerDto.getPreviousAssDate());
					newCell.setCellStyle(style);
				}

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
				}

				itrDept++;

			}

			// Table Cells
			int k = 0;
			// System.out.println(registerDto);
			for (RiskRegisterDto riskRegister : registerDto.getRegisterList()) {

				// int classificationList = riskRegister.getRiskCatDtoList().size();
				k++;
				String counter = "" + k;
				// System.out.println("Counter " + counter);
				data.put(k, new Object[] { riskRegister.getRiskCatDtoListForDept()

				});

			}

			// Iterate over data and write to sheet

			keyset = data.keySet();
			rownum = 0;
			nextRowNum = 31;
			for (Integer key : keyset) {
				rownum = 0;
				rownum = rownum + nextRowNum;
				nextRowNum = rownum;
				row = sheet.createRow(rownum);

				Object[] objArr = data.get(key);
				int columnIndex = 0;
				int cellnum = 0;

				for (Object obj : objArr) {

					System.out.println("Object " + obj);

					int categoryList = 0;
					if (columnIndex == 0) {

						List<RiskCategoryDto> riskCatList = new ArrayList<>();
						if (obj instanceof ArrayList<?>) {
							((ArrayList) obj).forEach(datat -> riskCatList.add((RiskCategoryDto) datat));
						}

						CellStyle style1 = wb.createCellStyle();
						style1.setBorderBottom(BorderStyle.THIN);
						style1.setBottomBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderRight(BorderStyle.THIN);
						style1.setRightBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderLeft(BorderStyle.THIN);
						style1.setLeftBorderColor(IndexedColors.BLACK.getIndex());
						style1.setBorderTop(BorderStyle.THIN);
						style1.setTopBorderColor(IndexedColors.BLACK.getIndex());
						style1.setAlignment(HorizontalAlignment.LEFT);
						style1.setWrapText(true);

						CellStyle style2 = wb.createCellStyle();
						style2.setBorderBottom(BorderStyle.THIN);
						style2.setBottomBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderRight(BorderStyle.THIN);
						style2.setRightBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderLeft(BorderStyle.THIN);
						style2.setLeftBorderColor(IndexedColors.BLACK.getIndex());
						style2.setBorderTop(BorderStyle.THIN);
						style2.setTopBorderColor(IndexedColors.BLACK.getIndex());
						style2.setWrapText(true);
						style2.setAlignment(HorizontalAlignment.RIGHT);

						// System.out.println("Original Current Row Value is " + row.getRowNum());
						// int previousNum = row.getRowNum() -1;
						Row currentRow = sheet.createRow(rownum);
						int i = 0;
						int initialRow = currentRow.getRowNum();

						categoryList = riskCatList.size();

						categoryList = categoryList - 1;
						System.out.println("Category List " + categoryList);
						// nextRowNum = nextRowNum + 1;

						int temp = nextRowNum + categoryList;
						System.out.println("Temp " + temp);
						System.out.println("nextRowNum " + nextRowNum);

						if (categoryList >= 1) {

							sheet.addMergedRegion(new CellRangeAddress(nextRowNum, temp, 0, 0));
							style.setFont(font);
							sheet.addMergedRegion(new CellRangeAddress(nextRowNum, temp, 1, 1));
							sheet.addMergedRegion(new CellRangeAddress(nextRowNum, temp, 4, 4));
							sheet.addMergedRegion(new CellRangeAddress(nextRowNum, temp, 8, 8));

						}
						for (RiskCategoryDto obj1 : riskCatList) {

							System.out.println("Obejcts " + obj1);

							Cell srNoCell = currentRow.createCell(0);
							srNoCell.setCellValue(obj1.getSrNo());
							srNoCell.setCellStyle(style2);

							Cell deptCell = currentRow.createCell(1);
							System.out.println("Department Name " + obj1.getDeptName());
							deptCell.setCellValue(obj1.getDeptName());
							deptCell.setCellStyle(style1);

//										Cell countCell = currentRow.createCell(2);
//										countCell.setCellValue(obj1.getCurrentRiskCount());
//										countCell.setCellStyle(style2);

							// System.out.println("current Row " + currentRow.getRowNum());

							Cell newCell = currentRow.createCell(2);
							newCell.setCellValue(obj1.getRiskClassification());
							newCell.setCellStyle(style1);

							Cell classificationCountCell = currentRow.createCell(3);
							classificationCountCell.setCellValue(obj1.getClassificationCount());
							classificationCountCell.setCellStyle(style1);

							// System.out.println("current Row " + currentRow.getRowNum());

							// currentRiskCount

							Cell newCell2 = currentRow.createCell(4);
							newCell2.setCellValue(obj1.getCurrentRiskCount());
							newCell2.setCellStyle(style2);

							// currentHigh

							Cell currentHigh = currentRow.createCell(5);
							currentHigh.setCellValue(obj1.getCurrHigh());
							currentHigh.setCellStyle(style2);
							// sheet.addMergedRegion(new CellRangeAddress(initialRow, 18, 5, 5));

							// currentMedium

							Cell currentMedium = currentRow.createCell(6);
							currentMedium.setCellValue(obj1.getCurrMedium());
							currentMedium.setCellStyle(style2);

							// currentLow

							Cell currentLow = currentRow.createCell(7);
							currentLow.setCellValue(obj1.getCurrLow());
							currentLow.setCellStyle(style2);

							// prevRiskCount

							Cell prevRiskCountCell = currentRow.createCell(8);
							prevRiskCountCell.setCellValue(obj1.getPrviousRiskCount());
							prevRiskCountCell.setCellStyle(style2);

							// prevHigh

							Cell prevHigh = currentRow.createCell(9);
							prevHigh.setCellValue(obj1.getPrevHigh());
							prevHigh.setCellStyle(style2);

							// prevMedium

							Cell prevMedium = currentRow.createCell(10);
							prevMedium.setCellValue(obj1.getPrevMedium());
							prevMedium.setCellStyle(style2);

							// prevLow

							Cell prevLow = currentRow.createCell(11);
							prevLow.setCellValue(obj1.getPrevLow());
							prevLow.setCellStyle(style2);

							i++;
							currentRow = sheet.createRow(row.getRowNum() + i);

						}

						nextRowNum = nextRowNum + riskCatList.size();
					}
					// else {
					// nextRowNum = nextRowNum + 3;
					// }

					// Creating Header
					cell = row.createCell(cellnum++);
					CellStyle Style = wb.createCellStyle();

					if (obj instanceof String) {
						// String cellValue = (String) obj;
						cell.setCellValue((String) obj);
						cell.setCellStyle(Style); // Apply style to cell
					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						cell.setCellStyle(Style);
					}

					columnIndex++;
					sheet.autoSizeColumn(columnIndex);
					sheet.setColumnWidth(0, 1000);

					Style.setWrapText(true); // Set wordwrap
					Style.setBorderBottom(BorderStyle.THIN);
					Style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderRight(BorderStyle.THIN);
					Style.setRightBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderLeft(BorderStyle.THIN);
					Style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					Style.setBorderTop(BorderStyle.THIN);
					Style.setTopBorderColor(IndexedColors.BLACK.getIndex());

					sheet.setColumnWidth(0, 15 * 256);
					sheet.setColumnWidth(1, 25 * 256);
					sheet.setColumnWidth(2, 25 * 256);
					sheet.setColumnWidth(3, 25 * 256);
					sheet.setColumnWidth(4, 25 * 256);

					sheet.setColumnWidth(5, 20 * 256);
					sheet.setColumnWidth(6, 20 * 256);
					sheet.setColumnWidth(7, 20 * 256);
					sheet.setColumnWidth(8, 20 * 256);
					sheet.setColumnWidth(9, 20 * 256);
					sheet.setColumnWidth(10, 20 * 256);

					// Set Font
					Font dataFont = wb.createFont();
					dataFont.setFontHeightInPoints((short) 12);
					dataFont.setFontName("Times Roman");
					dataFont.setColor(IndexedColors.BLACK.getIndex());
					dataFont.setBold(false);
					dataFont.setItalic(false);
					Style.setAlignment(HorizontalAlignment.RIGHT);
					Style.setFont(dataFont);

					int numMerged = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged; i++) {

						// System.out.println("Itrator " + i);
						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}

					itr++;
				}
			}

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			wb.write(outputStream);
			return new ByteArrayInputStream(outputStream.toByteArray());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	
	}

}
