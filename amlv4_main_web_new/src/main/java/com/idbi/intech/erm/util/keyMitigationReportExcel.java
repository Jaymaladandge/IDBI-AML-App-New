package com.idbi.intech.erm.util;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

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
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.RegionUtil;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idbi.intech.erm.domain.app.KeyMitigationPlanDto;
import com.idbi.intech.erm.domain.app.UserDto;

public class keyMitigationReportExcel {
	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	UserDto userDto = new UserDto();
	private KeyMitigationPlanDto keyMitigationPlanDtoObj;

	public keyMitigationReportExcel(KeyMitigationPlanDto keyMitigationPlanDtoObj)
			throws JsonMappingException, JsonProcessingException {

		this.keyMitigationPlanDtoObj = keyMitigationPlanDtoObj;

		workbook = new XSSFWorkbook();
	}

	// this method is for common header with User Details
	private void writeCommonHeaderLine(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Key Mitigation Report");

			InputStream inputStream = getClass().getResourceAsStream("../LIC-Logo-Too-Small.png");

			// Get the contents of an InputStream as a byte[].
			byte[] bytes = IOUtils.toByteArray(inputStream);
			// Adds a picture to the workbook
			int pictureIdx = workbook.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
			// close the input stream
			inputStream.close();

			CreationHelper helper = workbook.getCreationHelper();

			// Creates the top-level drawing patriarch.
			Drawing drawing = sheet.createDrawingPatriarch();

			ClientAnchor anchor = helper.createClientAnchor();

			// set top-left corner for the image

			anchor.setCol1(0); // Column B
			anchor.setRow1(0); // Row 3
			anchor.setCol2(1); // Column C
			anchor.setRow2(1); // Row 4

			// Creates a picture
			Picture pict = drawing.createPicture(anchor, pictureIdx);
			// Reset the image to the original size
			pict.resize();

			sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, 0));

			// row 0
			Row rowFirst = sheet.createRow(4);

			Cell tittleData = null;

			// Set Font
			Font headingFont = workbook.createFont();
			headingFont.setFontHeightInPoints((short) 14);
			headingFont.setFontName("Times Roman");
			headingFont.setColor(IndexedColors.BLACK.getIndex());
			headingFont.setBold(true);
			headingFont.setItalic(false);

			Font reportDataFont = workbook.createFont();
			reportDataFont.setFontHeightInPoints((short) 11);
			reportDataFont.setFontName("Times Roman");
			reportDataFont.setColor(IndexedColors.BLACK.getIndex());
			reportDataFont.setBold(true);
			reportDataFont.setItalic(false);

			// Report Details Section
			CellStyle cellStyle = workbook.createCellStyle();
			reportDataFont.setFontHeightInPoints((short) 11);
			cellStyle.setFont(reportDataFont);
			cellStyle.setWrapText(true);

			Row row = sheet.createRow(4);
			Cell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(userDto.getSearchParam());
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			// User Details - User Name
			cell = row.createCell(5);
			cell.setCellValue("User name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(userDto.getUsername().toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 7, 8));

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("User Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(userDto.getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			// User Details - User Department
			cell = row.createCell(5);
			cell.setCellValue("Report Extraction Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 5, 6));
			cell = row.createCell(7);
			DateFormat outputFormatter1 = new SimpleDateFormat("dd/MM/yyyy hh.mm aa");
			String todaysDate = outputFormatter1.format(new Date());
			cell.setCellValue(todaysDate.toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 7, 9));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("User Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(userDto.getUserOfficeType());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 2, 3));

			// User Details - User Office
			cell = row.createCell(5);
			cell.setCellValue("Assessment Period");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(keyMitigationPlanDtoObj.getSelectedAssessmentPeriod());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 7, 9));
			
			row = sheet.createRow(7);
			cell = row.createCell(0);
			cell.setCellValue("Report Extracted for Office");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(keyMitigationPlanDtoObj.getApplicableOffice());
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 2, 3));


		

			int numMerged = sheet.getNumMergedRegions();

			for (int i = 0; i < numMerged; i++) {
				CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
				RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
				RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
				RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
				RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
			}

		} catch (Exception e) {
			System.out.println(e);
		}

	}

	private void writeHeaderLine() {
		Row row = sheet.createRow(8);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontName("Times New Roman");
		font.setFontHeight(14);
		style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
		style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setFont(font);
		style.setBorderBottom(BorderStyle.THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderRight(BorderStyle.THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(BorderStyle.THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(BorderStyle.THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setWrapText(true);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
		createCell(row, 0, "Department Name", style);
		sheet.setColumnWidth(0, 25 * 260);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 2, 3));
		createCell(row, 2, "Medium Risk Count", style);
		sheet.setColumnWidth(2, 25 * 205);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 4, 5));
		createCell(row, 4, "High Risk Count", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 6, 7));
		createCell(row, 6, "Action Plan Count", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 8, 9));
		createCell(row, 8, "Implementation Count", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 10, 11));
		createCell(row, 10, "Not Due", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 12, 13));
		createCell(row, 12, "Pending Less than six Month", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 14, 15));
		createCell(row, 14, "Pending More than six Month", style);

		int numMerged = sheet.getNumMergedRegions();

		for (int i = 0; i < numMerged; i++) {
			CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
			RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
		}

	}

	private void writeDataLines() {
		int rowCount = 9;

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setFontName("Times New Roman");
		font.setFontHeight(12);

		style.setFont(font);
		style.setBorderBottom(BorderStyle.THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderRight(BorderStyle.THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(BorderStyle.THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(BorderStyle.THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());

		for (KeyMitigationPlanDto kmpDto : keyMitigationPlanDtoObj.getKeyMitigationList()) {

			Row row = sheet.createRow(rowCount);
			int columnCount = 0;
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 0, 1));
			createCell(row, columnCount, kmpDto.getDeptName(), style);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 2, 3));
			createCell(row, 2 + columnCount, kmpDto.getMediumRiskCount(), style);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 4, 5));
			createCell(row, 4 + columnCount, kmpDto.getHighRiskCount(), style);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 6, 7));
			createCell(row, 6 + columnCount, kmpDto.getActionIdCount(), style);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 8, 9));
			createCell(row, 8 + columnCount, kmpDto.getImplementedCount(), style);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 10, 11));
			createCell(row, 10 + columnCount, kmpDto.getNotDue(), style);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 12, 13));
			createCell(row, 12 + columnCount, kmpDto.getPendingLessThan6Mon(), style);
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 14, 15));
			createCell(row, 14 + columnCount, kmpDto.getPendingGreaterThan6Mon(), style);

			rowCount++;

		}
		int numMerged = sheet.getNumMergedRegions();

		for (int i = 0; i < numMerged; i++) {
			CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
			RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
		}
	}

	private void createCell(Row row, int columnCount, Object value, CellStyle style) {
		sheet.autoSizeColumn(columnCount);
		Cell cell = row.createCell(columnCount);
		if (value instanceof Integer) {
			cell.setCellValue((Integer) value);
		} else if (value instanceof Boolean) {
			cell.setCellValue((Boolean) value);
		} else if (value instanceof Date) {
			cell.setCellValue((Date) value);

		} else {
			cell.setCellValue((String) value);
		}
		cell.setCellStyle(style);

	}

	public void exportRCSAReport(HttpServletResponse response, UserDto userDto) throws IOException {

		this.userDto = userDto;

		try {
			writeCommonHeaderLine(userDto);
			writeDataLines();
			writeHeaderLine();

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
