package com.idbi.intech.erm.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

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
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idbi.intech.erm.domain.app.BenchmarkValueCaptureDto;
import com.idbi.intech.erm.domain.app.ModuleValueCaptureDto;
import com.idbi.intech.erm.domain.app.NotificationDto;
import com.idbi.intech.erm.domain.app.TopRiskMasterDto;
import com.idbi.intech.erm.domain.app.User;

@Service
public class KeyRiskMasterServiceImpl implements KeyRiskMasterService {

	@Override
	public ByteArrayInputStream exportReportWithImage(List<NotificationDto> ntfDtoList, User user,
			String AssessmentPeriod) throws JsonParseException, JsonMappingException, IOException {
		// TODO Auto-generated method stub
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
			cellDate.setCellValue(AssessmentPeriod);
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

			String[] strArr = { "Module Id", "Department Name", "KRI Value Description", "Status", "Office Code" };

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

				data.put(j,
						new Object[] { ntfDto.getNtfModuleId().toString(), ntfDto.getDeptName().toString(),
								ntfDto.getNtfModuleDesc().toString(), ntfDto.getNtfValue().toString(),
								ntfDto.getOfcCode().toString() });

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
					// System.out.println(columnIndex);
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
					sheet.setColumnWidth(2, 25 * 260);
					sheet.setColumnWidth(3, 25 * 200);
					sheet.setColumnWidth(4, 25 * 200);
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

						Style.setAlignment(HorizontalAlignment.LEFT);

						cell.setCellStyle(Style); // Apply style to cell

					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						Style.setAlignment(HorizontalAlignment.CENTER);
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

	@Override
	public ByteArrayInputStream exportReportWithImageCaptureBMData(List<BenchmarkValueCaptureDto> benmarkDtoList,
			User user, String AssessmentPeriod) throws JsonParseException, JsonMappingException, IOException {
		// TODO Auto-generated method stub
		try {

			Workbook wb = new XSSFWorkbook();

			ByteArrayOutputStream stream = new ByteArrayOutputStream();

			Sheet sheet = wb.createSheet("Captured Benchmark List");

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

			cellDate.setCellValue("Captured Benchmark Details");
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
			cellDate.setCellValue(AssessmentPeriod);
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

			String[] strArr = { "BenchMark Statement", "Department Name", "Assessment Value", "OfficeCode" };

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

			for (BenchmarkValueCaptureDto bmDto : benmarkDtoList) {

				j++;
				String counter = "" + j;

				data.put(j, new Object[] { bmDto.getBmName().toString(), bmDto.getDeptName().toString(),
						bmDto.getAssessmentValue().toString(), bmDto.getOfficeCode().toString() });

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
					// System.out.println(columnIndex);
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
					sheet.setColumnWidth(1, 25 * 200);
					sheet.setColumnWidth(2, 25 * 200);
					sheet.setColumnWidth(3, 25 * 200);
					sheet.setColumnWidth(4, 25 * 200);
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

						Style.setAlignment(HorizontalAlignment.LEFT);

						cell.setCellStyle(Style); // Apply style to cell

					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						Style.setAlignment(HorizontalAlignment.CENTER);
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

	@Override
	public ByteArrayInputStream exportTopriskReportData(List<TopRiskMasterDto> trmDtoList, User user,
			String AssessmentPeriod) throws JsonParseException, JsonMappingException, IOException {
		// TODO Auto-generated method stub
		// TODO Auto-generated method stub
		try {

			Workbook wb = new XSSFWorkbook();

			ByteArrayOutputStream stream = new ByteArrayOutputStream();

			Sheet sheet = wb.createSheet("Captured Benchmark List");

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

			cellDate.setCellValue("Selected Top Risk of Corporation");
			cellDate = rowSecond.createCell(3);
			cellDate.setCellValue("User Name");
			cellDate.setCellStyle(style);
			cellDate = rowSecond.createCell(4);

			cellDate.setCellValue(user.getUsername().toUpperCase());
			Row rowThird = sheet.createRow(4);
			cellDate = rowThird.createCell(0);
			cellDate.setCellValue("Assessment Period");
			cellDate.setCellStyle(style);
			cellDate = rowThird.createCell(1);
			String pattern = "dd-MM-yyyy";
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
			if (!AssessmentPeriod.split(" and ")[1].equalsIgnoreCase("NA")) {
				cellDate.setCellValue(AssessmentPeriod);
			} else {
				cellDate.setCellValue(AssessmentPeriod.split(" and ")[0]);
			}

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
			// style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
			style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			style.setAlignment(HorizontalAlignment.CENTER);
			style.setFont(font);
			String Assesment1 = AssessmentPeriod.split(" and")[0];
			String Assesment2 = AssessmentPeriod.split(" and")[1];

			String[] strArr = new String[5];

			if (!AssessmentPeriod.split(" and ")[1].equalsIgnoreCase("NA")) {

				strArr[0] = "Sr.Number";
				strArr[1] = "Department Name";
				strArr[2] = "Top Risk Description";
				strArr[3] = Assesment1;
				strArr[4] = Assesment2;
				style.setFillForegroundColor(IndexedColors.GOLD.getIndex());

			} else {
				strArr[0] = "Sr.Number";
				strArr[1] = "Department Name";
				strArr[2] = "Top Risk Description";
				strArr[3] = Assesment1;
				style.setFillForegroundColor(IndexedColors.GOLD.getIndex());

			}

			// String[] strArr = { "Sr.Number", "Department Name", "Top Risk Description",
			// Assesment1,Assesment2 };

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
			int i = 0;

			for (TopRiskMasterDto tprMasterDto : trmDtoList) {

				j++;
				String counter = "" + j;
				if (!AssessmentPeriod.split(" and ")[1].equalsIgnoreCase("NA")) {
					data.put(j,
							new Object[] { ++i, tprMasterDto.getUserDept().toString(),
									tprMasterDto.getTopRiskDescription().toString(),
									tprMasterDto.getAsstStatus().toString(), tprMasterDto.getAsstStatus2() });
				} else {
					data.put(j, new Object[] { ++i, tprMasterDto.getUserDept().toString(),
							tprMasterDto.getTopRiskDescription().toString(), tprMasterDto.getAsstStatus().toString() });
				}

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
					// System.out.println(columnIndex);
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

					sheet.setColumnWidth(0, 25 * 150);
					sheet.setColumnWidth(1, 25 * 200);
					sheet.setColumnWidth(2, 25 * 330);
					sheet.setColumnWidth(3, 25 * 200);
					sheet.setColumnWidth(4, 25 * 200);
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

						Style.setAlignment(HorizontalAlignment.LEFT);

						cell.setCellStyle(Style); // Apply style to cell

					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						Style.setAlignment(HorizontalAlignment.CENTER);
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

	@Override
	public ByteArrayInputStream exportValueCapturePendingForVerificationWithImage(
			List<ModuleValueCaptureDto> mvcDtoList, User user, String AssessmentPeriod)
			throws JsonParseException, JsonMappingException, IOException {
		// TODO Auto-generated method stub
		// TODO Auto-generated method stub
		try {

			Workbook wb = new XSSFWorkbook();
			ByteArrayOutputStream stream = new ByteArrayOutputStream();
			Sheet sheet = wb.createSheet("Value Captured Pending For Verification List");

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

			cellDate.setCellValue("Value Captured Pending For Verification List");
			cellDate = rowSecond.createCell(3);
			cellDate.setCellValue("User Name");
			cellDate.setCellStyle(style);
			cellDate = rowSecond.createCell(4);

			cellDate.setCellValue(user.getUsername().toUpperCase());
			Row rowThird = sheet.createRow(4);
			cellDate = rowThird.createCell(0);
			cellDate.setCellValue("Report Extraction Date  ");
			cellDate.setCellStyle(style);
			cellDate = rowThird.createCell(1);
			String pattern = "dd-MM-yyyy";
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

			cellDate.setCellValue((simpleDateFormat.format(new Date())));

			cellDate = rowThird.createCell(3);
			cellDate.setCellValue("User Department");
			cellDate.setCellStyle(style);
			cellDate = rowThird.createCell(4);
			cellDate.setCellValue(user.getUserDeptName().toUpperCase());
			Row rowFour = sheet.createRow(5);
//			cellDate = rowFour.createCell(0);
//			cellDate.setCellValue("Report Extraction Date  ");
//			cellDate.setCellStyle(style);
//			cellDate = rowFour.createCell(1);
//			cellDate.setCellValue(simpleDateFormat.format(new Date()));
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
			// style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
			style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			style.setAlignment(HorizontalAlignment.CENTER);
			style.setFont(font);

			String[] strArr = new String[7];
			strArr[0] = "Sr. no ";
			strArr[1] = "Module Id";
			strArr[2] = "Assessment Description";
			strArr[3] = "Assessment Value";
			strArr[4] = "Captured By";
			strArr[5] = "Captured Time";
			strArr[6] = "Assessment Period";
			style.setFillForegroundColor(IndexedColors.GOLD.getIndex());

			// String[] strArr = { "Sr.Number", "Department Name", "Top Risk Description",
			// Assesment1,Assesment2 };

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
			int i = 0;

			for (ModuleValueCaptureDto mvcDto : mvcDtoList) {

				j++;
				String counter = "" + j;

				data.put(j, new Object[] { ++i, mvcDto.getModuleId(),mvcDto.getAssessmentDesc(), mvcDto.getAssessmentValue().toString(),
						mvcDto.getCaptureUserId().toUpperCase().toString(), mvcDto.getCaptureTime().toString(),mvcDto.getAssessmentPeriod() });

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
					// System.out.println(columnIndex);
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

					sheet.setColumnWidth(0, 25 * 150);
					sheet.setColumnWidth(1, 25 * 250);
					sheet.setColumnWidth(2, 25 * 280);
					sheet.setColumnWidth(3, 25 * 200);
					sheet.setColumnWidth(4, 25 * 200);
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

						Style.setAlignment(HorizontalAlignment.LEFT);

						cell.setCellStyle(Style); // Apply style to cell

					} else if (obj instanceof Integer) {
						cell.setCellValue((Integer) obj);
						Style.setAlignment(HorizontalAlignment.CENTER);
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
	
	@Override
	public ByteArrayInputStream exportTopriskReportModelData(
			TopRiskMasterDto tpMasterDto, User user, String AssessmentPeriod)
			throws JsonParseException, JsonMappingException, IOException {
		// TODO Auto-generated method stub
		// TODO Auto-generated method stub
		try {

			Workbook wb = new XSSFWorkbook();
			ByteArrayOutputStream stream = new ByteArrayOutputStream();
			Sheet sheet = wb.createSheet("Top-Risk Link KRI Assessment Value And Benchmark Value");

			String usingSystemProperty = System.getProperty("user.dir");
			

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
			CellStyle style1 = wb.createCellStyle();

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
			style1.setFont(font);

			// cellDate.setCellStyle(cellStyle);

			Row rowSecond = sheet.createRow(3);
			cellDate = rowSecond.createCell(0);
			cellDate.setCellValue("Report Name ");
			cellDate.setCellStyle(style);
			cellDate = rowSecond.createCell(1);

			cellDate.setCellValue("Top-Risk Link KRI Assessment Value And Benchmark Value");
			cellDate = rowSecond.createCell(3);
			cellDate.setCellValue("User Name");
			cellDate.setCellStyle(style);
			cellDate = rowSecond.createCell(4);

			cellDate.setCellValue(user.getUsername().toUpperCase());
			Row rowThird = sheet.createRow(4);
			cellDate = rowThird.createCell(0);
			cellDate.setCellValue("Report Extraction Date  ");
			cellDate.setCellStyle(style);
			cellDate = rowThird.createCell(1);
			String pattern = "dd-MM-yyyy";
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

			cellDate.setCellValue((simpleDateFormat.format(new Date())));

			cellDate = rowThird.createCell(3);
			cellDate.setCellValue("User Department");
			cellDate.setCellStyle(style);
			cellDate = rowThird.createCell(4);
			cellDate.setCellValue(user.getUserDeptName().toUpperCase());
			Row rowFour = sheet.createRow(5);
//			cellDate = rowFour.createCell(0);
//			cellDate.setCellValue("Report Extraction Date  ");
//			cellDate.setCellStyle(style);
//			cellDate = rowFour.createCell(1);
//			cellDate.setCellValue(simpleDateFormat.format(new Date()));
			cellDate = rowFour.createCell(3);
			cellDate.setCellValue("User Office");
			cellDate.setCellStyle(style);
			cellDate = rowFour.createCell(4);
			cellDate.setCellValue(user.getUserOfficeType().toUpperCase());
			
			Row rowFive=sheet.createRow(7);
			rowFive.setHeight((short) 800);
			style.setWrapText(true);
			style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			style.setAlignment(HorizontalAlignment.CENTER);
			style.setFont(font);
			String[] strArrTemp = { "Top Risk Id", "Top Risk Description", "Department", "Assessment Period"};
			style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
			Cell celltemp = null;
			int itrtemp = 0;
			for (String str : strArrTemp) {
				celltemp = rowFive.createCell(itrtemp);

				style.setBorderBottom(BorderStyle.THIN);
				style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderRight(BorderStyle.THIN);
				style.setRightBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderLeft(BorderStyle.THIN);
				style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				style.setBorderTop(BorderStyle.THIN);
				style.setTopBorderColor(IndexedColors.BLACK.getIndex());
				style.setWrapText(true);

				rowFive.setHeight((short) 700);

				celltemp.setCellValue(str);
				celltemp.setCellStyle(style);

				int numMerged = sheet.getNumMergedRegions();

				for (int i = 0; i < numMerged; i++) {
					CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
				}

				itrtemp++;
			}
			
			

		
				String topriskId=tpMasterDto.getTopRiskId();
				String topriskDescription=tpMasterDto.getTopRiskDescription();
				String Department= tpMasterDto.getUserDept();
				String AssesmentPeriod=tpMasterDto.getAsstPeriod();
				
				
				
				
				
				Row rowSix=sheet.createRow(8);
				rowSix.setHeight((short) 800);
				style1.setWrapText(true);
				style1.setFillPattern(FillPatternType.SOLID_FOREGROUND);
				style1.setAlignment(HorizontalAlignment.CENTER);
				style1.setFont(font);
				String[] strArrTemp1 = { topriskId, topriskDescription, Department, AssesmentPeriod};
				style1.setFillForegroundColor(IndexedColors.WHITE.getIndex());
				Cell celltemp1 = null;
				int itrtemp1 = 0;
				for (String str : strArrTemp1) {
					celltemp1 = rowSix.createCell(itrtemp1);


					style1.setBorderBottom(BorderStyle.THIN);
					style1.setBottomBorderColor(IndexedColors.BLACK.getIndex());
					style1.setBorderRight(BorderStyle.THIN);
					style1.setRightBorderColor(IndexedColors.BLACK.getIndex());
					style1.setBorderLeft(BorderStyle.THIN);
					style1.setLeftBorderColor(IndexedColors.BLACK.getIndex());
					style1.setBorderTop(BorderStyle.THIN);
					style1.setTopBorderColor(IndexedColors.BLACK.getIndex());
					style1.setWrapText(true);

					style1.setWrapText(true);

					rowSix.setHeight((short) 700);

					celltemp1.setCellValue(str);
					celltemp1.setCellStyle(style1);

					int numMerged = sheet.getNumMergedRegions();

					for (int i = 0; i < numMerged; i++) {
						CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
						RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
						RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
					}

					itrtemp1++;
				}
				/*
				 * sheet.setColumnWidth(0, 25 * 250); sheet.setColumnWidth(1, 25 * 250);
				 * sheet.setColumnWidth(2, 25 * 280); sheet.setColumnWidth(3, 25 * 300);
				 * sheet.setColumnWidth(4, 25 * 200);
				 */
				Row row = sheet.createRow(10);
				row.setHeight((short) 800);
				style.setWrapText(true); 
				style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
				style.setAlignment(HorizontalAlignment.CENTER);
				style.setFont(font);
				String[] strArr = { "KRI Description", "KRI Benchmark Value", "KRI Real Time Value", "Threshold Value"};
				style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
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
				int i = 0;

				for (String vcData : tpMasterDto.getAsstValueList()) {
					String kriDesc=vcData.split("\\^")[0];
					
					String bmValue=vcData.split("\\^")[1];
					String kriRealTimeValue= vcData.split("\\^")[2];
					String threshold=vcData.split("\\^")[3];

					j++;
					String counter = "" + j;

					data.put(j,
							new Object[] { kriDesc, bmValue,
									kriRealTimeValue, threshold
									 });

				}

				// Iterate over data and write to sheet

				Set<Integer> keyset = data.keySet();
				int rownum = 11;

				for (Integer key : keyset) {
					row = sheet.createRow(rownum++);

					Object[] objArr = data.get(key);
					int columnIndex = 0;
					int cellnum = 0;

					for (Object obj : objArr) {

						columnIndex++;
						// System.out.println(columnIndex);
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

						sheet.setColumnWidth(0, 25 * 250);
						sheet.setColumnWidth(1, 25 * 250);
						sheet.setColumnWidth(2, 25 * 280);
						sheet.setColumnWidth(3, 25 * 300);
						sheet.setColumnWidth(4, 25 * 200);
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

							Style.setAlignment(HorizontalAlignment.LEFT);

							cell.setCellStyle(Style); // Apply style to cell

						} else if (obj instanceof Integer) {
							cell.setCellValue((Integer) obj);
							Style.setAlignment(HorizontalAlignment.CENTER);
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

}
