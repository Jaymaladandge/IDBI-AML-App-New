package com.idbi.intech.erm.util;

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
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Picture;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.RegionUtil;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.oms.domain.app.OmsAlertMasterDto;

public class BranchWiseTatReportExcel {

	final ObjectMapper objectMapper = new ObjectMapper();
	OmsAlertMasterDto alertDto = new OmsAlertMasterDto();
	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	UserDto userDto = new UserDto();

	public BranchWiseTatReportExcel(OmsAlertMasterDto alertDto) {

		this.alertDto = alertDto;

		workbook = new XSSFWorkbook();
	}

	// this method is for common header with User Details
	private void writeCommonHeaderLine(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Branch-Wise TAT Report");

			/*
			 * String usingSystemProperty = System.getProperty("user.dir");
			 * System.out.println("Current directory path using system property:- " +
			 * usingSystemProperty); System.out.
			 * println("getClass().getResourceAsStream(\"../idbiLogoExcel.png\") = " +
			 * getClass().getResourceAsStream("../IDBI-Bank-Logo1.png"));
			 */

			InputStream inputStream = getClass().getResourceAsStream("../IDBI-Bank-Logo1.png");

			// Get the contents of an InputStream as a byte[].
			byte[] bytes = IOUtils.toByteArray(inputStream);
			// Adds a picture to the workbook
			int pictureIdx = workbook.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
			// close the input stream
			inputStream.close();

			// Returns an object that handles instantiating concrete classes
			CreationHelper helper = workbook.getCreationHelper();

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

			sheet.addMergedRegion(new CellRangeAddress(0, 2, 0, 1));

			// row 0
			XSSFRow row = sheet.createRow(5);
			XSSFCellStyle style = workbook.createCellStyle();
			XSSFFont font = workbook.createFont();
			font.setFontName("Times New Roman");
			font.setFontHeight(14);
			font.setBold(true);
			style.setFont(font);
			style.setBorderBottom(BorderStyle.THIN);
			style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
			style.setBorderRight(BorderStyle.THIN);
			style.setRightBorderColor(IndexedColors.BLACK.getIndex());
			style.setBorderLeft(BorderStyle.THIN);
			style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
			style.setBorderTop(BorderStyle.THIN);
			style.setTopBorderColor(IndexedColors.BLACK.getIndex());
			// style.setWrapText(true);

			XSSFCellStyle styleData = workbook.createCellStyle();
			XSSFFont dataFont = workbook.createFont();
			dataFont.setBold(false);
			dataFont.setFontName("Times New Roman");
			dataFont.setFontHeight(12);
			styleData.setFont(dataFont);
			styleData.setBorderBottom(BorderStyle.THIN);
			styleData.setBottomBorderColor(IndexedColors.BLACK.getIndex());
			styleData.setBorderRight(BorderStyle.THIN);
			styleData.setRightBorderColor(IndexedColors.BLACK.getIndex());
			styleData.setBorderLeft(BorderStyle.THIN);
			styleData.setLeftBorderColor(IndexedColors.BLACK.getIndex());
			styleData.setBorderTop(BorderStyle.THIN);
			styleData.setTopBorderColor(IndexedColors.BLACK.getIndex());
			// styleData.setWrapText(true);

			XSSFCell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell.setCellStyle(style);
			XSSFCell cell2 = row.createCell(2);
			cell2.setCellValue("Branch-Wise TAT REPORT");
			cell2.setCellStyle(styleData);
			XSSFCell cell3 = row.createCell(4);
			cell3.setCellValue("User Name");
			cell3.setCellStyle(style);
			XSSFCell cell4 = row.createCell(5);
			cell4.setCellValue(userDto.getUsername().toUpperCase());
			cell4.setCellStyle(styleData);
			// Row 1
			XSSFRow row1 = sheet.createRow(6);
			XSSFCell cell5 = row1.createCell(0);
			cell5.setCellValue("Report Date");
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell5.setCellStyle(style);
			XSSFCell cell16 = row1.createCell(4);
			cell16.setCellValue("Branch");
			cell16.setCellStyle(style);
			XSSFCell cell7 = row1.createCell(5);
			cell7.setCellValue(userDto.getBranchName().toUpperCase());
			cell7.setCellStyle(styleData);

			// start date and end date formatting

			DateFormat outputFormatter = new SimpleDateFormat("dd/MM/yyyy");
			/*
			 * String sDate = outputFormatter.format("19/07/2022"); String eDate =
			 * outputFormatter.format("19/07/2022");
			 */

			String sDate = alertDto.getStartDate();
			String eDate = alertDto.getEndDate();

			XSSFCell cell6 = row1.createCell(2);
			cell6.setCellValue(sDate + "-" + eDate);
			cell6.setCellStyle(styleData);
			/*
			 * XSSFCell cell7 = row1.createCell(4); cell7.setCellValue("User Department");
			 * cell7.setCellStyle(style);
			 */
			/*
			 * XSSFCell cell8 = row1.createCell(5); cell8.setCellValue("OMS");
			 * cell8.setCellStyle(styleData);
			 */
			// Row 2
			XSSFRow row2 = sheet.createRow(7);
			XSSFCell cell9 = row2.createCell(0);
			cell9.setCellValue("Report Extraction Date");
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 0, 1));
			cell9.setCellStyle(style);
			XSSFCell cell10 = row2.createCell(2);
			DateFormat outputFormatter1 = new SimpleDateFormat("dd/MM/yyyy hh.mm aa");
			String todaysDate = outputFormatter1.format(new Date());

			cell10.setCellValue(todaysDate.toUpperCase());
			cell10.setCellStyle(styleData);
			/*
			 * XSSFCell cell11 = row2.createCell(4); cell11.setCellValue("User Office");
			 * cell11.setCellStyle(style); XSSFCell cell12 = row2.createCell(5);
			 * cell12.setCellValue("Office Type"); cell12.setCellStyle(styleData);
			 */
			// Row 3
			/*
			 * XSSFRow row3 = sheet.createRow(8); XSSFCell cell15 = row3.createCell(0);
			 * cell15.setCellValue("Report Extracted for Department");
			 * sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			 * cell15.setCellStyle(style); XSSFCell cell16 = row3.createCell(2);
			 * cell16.setCellValue("OMS DEPT"); cell16.setCellStyle(styleData);
			 */

			/*
			 * // Row 4 XSSFRow row4 = sheet.createRow(9); XSSFCell cell17 =
			 * row4.createCell(0); cell17.setCellValue("Report Extracted for Office");
			 * sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
			 * cell17.setCellStyle(style); XSSFCell cell18 = row4.createCell(2);
			 * cell18.setCellValue("OFFICE"); cell18.setCellStyle(styleData);
			 */
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

	private void writeDataLines() {
		int rowCount = 10;

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

		CellStyle style1 = workbook.createCellStyle();
		XSSFFont font1 = workbook.createFont();
		font1.setFontName("Times New Roman");
		font1.setFontHeight(12);

		style1.setFont(font1);
		style1.setBorderBottom(BorderStyle.THIN);
		style1.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style1.setBorderRight(BorderStyle.THIN);
		style1.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style1.setBorderLeft(BorderStyle.THIN);
		style1.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style1.setBorderTop(BorderStyle.THIN);
		style1.setTopBorderColor(IndexedColors.BLACK.getIndex());

		CellStyle style2 = workbook.createCellStyle();
		XSSFFont font2 = workbook.createFont();
		font2.setFontName("Times New Roman");
		font2.setFontHeight(12);

		style2.setFont(font);
		style2.setBorderBottom(BorderStyle.THIN);
		style2.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style2.setBorderRight(BorderStyle.THIN);
		style2.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style2.setBorderLeft(BorderStyle.THIN);
		style2.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style2.setBorderTop(BorderStyle.THIN);
		style2.setTopBorderColor(IndexedColors.BLACK.getIndex());

		for (OmsAlertMasterDto alertDto : alertDto.getAlertRuleList()) {

			Row row = sheet.createRow(rowCount);
			int columnCount = 0;
			createCell(row, columnCount++, alertDto.getBranchId(), style);
			createCell(row, columnCount++, alertDto.getBranchName(), style);
			createCell(row, columnCount++, alertDto.getRegion(), style);
			createCell(row, columnCount++, alertDto.getZone(), style);
			createCell(row, columnCount++, alertDto.getInMonthCount(), style);
			createCell(row, columnCount++, alertDto.getBeforeMonthCount(), style);
			createCell(row, columnCount++, alertDto.getTotalCount(), style);
			createCell(row, columnCount++, alertDto.getInTat(), style);
			createCell(row, columnCount++, alertDto.getInTatPer(), style);
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

	private void writeHeaderLine() {

		XSSFRow headerRow = sheet.createRow(9);
		XSSFCellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontName("Bookman Old Style");
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

		XSSFCell cell1 = headerRow.createCell(0);
		cell1.setCellValue("BRANCH ID");
		cell1.setCellStyle(style);

		XSSFCell cell2 = headerRow.createCell(1);
		cell2.setCellValue("BRANCH NAME");
		cell2.setCellStyle(style);

		XSSFCell cell3 = headerRow.createCell(2);
		cell3.setCellValue("REGION NAME");
		cell3.setCellStyle(style);

		XSSFCell cell4 = headerRow.createCell(3);
		cell4.setCellValue("ZONE NAME");
		cell4.setCellStyle(style);

		XSSFCell cell5 = headerRow.createCell(4);
		cell5.setCellValue("Alert due for closure during the month(A)");
		cell5.setCellStyle(style);

		XSSFCell cell8 = headerRow.createCell(5);
		cell8.setCellValue("Unattended/reopened alerts of previous months(B)");
		cell8.setCellStyle(style);

		XSSFCell cell9 = headerRow.createCell(6);
		cell9.setCellValue("Total no. of alert to be closed during the month(C=A+B)");
		cell9.setCellStyle(style);

		XSSFCell cell6 = headerRow.createCell(7);
		cell6.setCellValue("Alerts closed within TAT");
		cell6.setCellStyle(style);

		XSSFCell cell7 = headerRow.createCell(8);
		cell7.setCellValue("In Tat Percentage");
		cell7.setCellStyle(style);
	}

	public void export(HttpServletResponse response, UserDto userDto) {

		this.userDto = userDto;
		try {
			writeCommonHeaderLine(userDto);
			writeHeaderLine();
			writeDataLines();

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			System.out.println(e);
		}

	}

}
