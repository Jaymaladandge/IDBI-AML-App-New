package com.idbi.intech.aml.util;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.Font;
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

import com.idbi.intech.aml.domain.app.AlertMasterDto;
import com.idbi.intech.aml.domain.app.AlertPendencyReportDto;
import com.idbi.intech.aml.domain.app.StrRequestDtlsDto;

public class AgeingPendencyListExport {

	XSSFWorkbook workbook;
	XSSFSheet sheet;

	// this method is for common header with User Details
	private void writeCommonHeaderLine(AlertPendencyReportDto alertPenDto) {
		try {
			sheet = workbook.createSheet("AgeWise Pendency Report");
			XSSFCellStyle styleNew = workbook.createCellStyle();
			// System.out.println("Get Class " + getClass());
			InputStream inputStream = getClass().getResourceAsStream("IDBI-Bank-Logo1.png");

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
			headingFont.setFontName("Bookman Old Style");
			headingFont.setColor(IndexedColors.BLACK.getIndex());
			headingFont.setBold(true);
			headingFont.setItalic(false);

			Font reportDataFont = workbook.createFont();
			reportDataFont.setFontHeightInPoints((short) 11);
			reportDataFont.setFontName("Bookman Old Style");
			reportDataFont.setColor(IndexedColors.BLACK.getIndex());
			reportDataFont.setBold(true);
			reportDataFont.setItalic(false);

			// Report Details Section
			CellStyle cellStyle = workbook.createCellStyle();
			reportDataFont.setFontHeightInPoints((short) 11);
			cellStyle.setFont(reportDataFont);
			cellStyle.setWrapText(true);

			XSSFFont fontNew = workbook.createFont();
			fontNew.setFontName("Bookman Old Style");
			fontNew.setFontHeight(10);
			styleNew.setFont(fontNew);
			styleNew.setBorderBottom(BorderStyle.THIN);
			styleNew.setBottomBorderColor(IndexedColors.BLACK.getIndex());
			styleNew.setBorderRight(BorderStyle.THIN);
			styleNew.setRightBorderColor(IndexedColors.BLACK.getIndex());
			styleNew.setBorderLeft(BorderStyle.THIN);
			styleNew.setLeftBorderColor(IndexedColors.BLACK.getIndex());
			styleNew.setBorderTop(BorderStyle.THIN);
			styleNew.setTopBorderColor(IndexedColors.BLACK.getIndex());

			Row row = sheet.createRow(4);
			Cell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("AgeWise Pendency Report");
			cell.setCellStyle(styleNew);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			/*
			 * row = sheet.createRow(5); cell = row.createCell(0);
			 * cell.setCellValue("User name"); cell.setCellStyle(cellStyle);
			 * sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1)); cell =
			 * row.createCell(2); cell.setCellValue(stateWiseExportDto.getUsername());
			 * cell.setCellStyle(styleNew); sheet.addMergedRegion(new CellRangeAddress(5, 5,
			 * 2, 3));
			 */

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("AML CELL");
			cell.setCellStyle(styleNew);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("Report Extraction Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			DateFormat outputFormatter1 = new SimpleDateFormat("dd/MM/yyyy hh.mm aa");
			String todaysDate = outputFormatter1.format(new Date());
			cell.setCellValue(todaysDate.toUpperCase());
			cell.setCellStyle(styleNew);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 2, 3));

			/*
			 * row = sheet.createRow(8); cell = row.createCell(0);
			 * cell.setCellValue("Report Start Date "); cell.setCellStyle(cellStyle);
			 * sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1)); cell =
			 * row.createCell(2); // DateFormat outputFormatter1 = new
			 * SimpleDateFormat("dd/MM/yyyy hh.mm aa"); // String todaysDate =
			 * outputFormatter1.format(new Date());
			 * cell.setCellValue(stateWiseExportDto.getAlertStartDate());
			 * cell.setCellStyle(styleNew); sheet.addMergedRegion(new CellRangeAddress(8, 8,
			 * 2, 3));
			 * 
			 * row = sheet.createRow(9); cell = row.createCell(0);
			 * cell.setCellValue("Report End Date "); cell.setCellStyle(cellStyle);
			 * sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1)); cell =
			 * row.createCell(2); // DateFormat outputFormatter1 = new
			 * SimpleDateFormat("dd/MM/yyyy hh.mm aa"); // String todaysDate =
			 * outputFormatter1.format(new Date());
			 * cell.setCellValue(stateWiseExportDto.getAlertEndDate());
			 * cell.setCellStyle(styleNew); sheet.addMergedRegion(new CellRangeAddress(9, 9,
			 * 2, 3));
			 * 
			 * row = sheet.createRow(10); cell = row.createCell(0);
			 * cell.setCellValue("State Name "); cell.setCellStyle(cellStyle);
			 * sheet.addMergedRegion(new CellRangeAddress(10, 10, 0, 1)); cell =
			 * row.createCell(2); cell.setCellValue(stateWiseExportDto.getBranchState());
			 * cell.setCellStyle(styleNew); sheet.addMergedRegion(new CellRangeAddress(10,
			 * 10, 2, 3));
			 */

			// User Details - User Office

			int numMerged = sheet.getNumMergedRegions();

			for (int i = 0; i < numMerged; i++) {
				CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
				RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
				RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
				RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
				RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void writeCommonHeaderLine(String currentDate) {
		try {

			sheet = workbook.createSheet("State Wise Alert Report");

			// row 0
			XSSFRow row = sheet.createRow(1);
			XSSFCellStyle style = workbook.createCellStyle();
			XSSFFont font = workbook.createFont();
			font.setFontName("Bookman Old Style");
			font.setFontHeight(12);
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
			dataFont.setFontName("Bookman Old Style");
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
			cell.setCellValue("Agewise_Pendency_Report-" + currentDate);
			sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 11));
			cell.setCellStyle(style);
			int numMerged = sheet.getNumMergedRegions();

			for (int i = 0; i < numMerged; i++) {
				CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
				RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
				RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
				RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
				RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void writeHeaderLine() {

		try {
			XSSFRow headerRow = sheet.createRow(12);
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

			XSSFCell cell = headerRow.createCell(0);
			cell.setCellStyle(style);
			cell.setCellValue("Alert Id");

			XSSFCell cellBranch = headerRow.createCell(1);
			cellBranch.setCellStyle(style);
			cellBranch.setCellValue("Alert Agg Val");

			XSSFCell cellRegion = headerRow.createCell(2);
			cellRegion.setCellStyle(style);
			cellRegion.setCellValue("Rule Id");

			XSSFCell cellCust = headerRow.createCell(3);
			cellCust.setCellValue("Alert Value");
			cellCust.setCellStyle(style);

			XSSFCell cellstatus = headerRow.createCell(4);
			cellstatus.setCellValue("Alert Status");
			cellstatus.setCellStyle(style);

			XSSFCell cellage = headerRow.createCell(5);
			cellage.setCellValue("Alert Age");
			cellage.setCellStyle(style);
			
			XSSFCell cellUserId = headerRow.createCell(6);
			cellUserId.setCellValue("User Id");
			cellUserId.setCellStyle(style);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void writeDataLines(AlertPendencyReportDto agingreportDto) {

		try {
			XSSFCellStyle style = workbook.createCellStyle();
			XSSFFont font = workbook.createFont();
			font.setFontName("Bookman Old Style");
			font.setFontHeight(10);
			style.setFont(font);
			style.setBorderBottom(BorderStyle.THIN);
			style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
			style.setBorderRight(BorderStyle.THIN);
			style.setRightBorderColor(IndexedColors.BLACK.getIndex());
			style.setBorderLeft(BorderStyle.THIN);
			style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
			style.setBorderTop(BorderStyle.THIN);
			style.setTopBorderColor(IndexedColors.BLACK.getIndex());

			/* Set Initial Row For Starting of Table Data */
			int rowCount = 13;
			Row currentRow = sheet.createRow(rowCount);

			// System.out.println("activityDto.getFinalList():
			// "+activityDto.getFinalList());

			for (AlertMasterDto agingDtoItr : agingreportDto.getAlertMasterList()) {

				currentRow = sheet.createRow(rowCount);

				Cell branchCell = currentRow.createCell(0);
				branchCell.setCellValue(agingDtoItr.getAlertId());
				branchCell.setCellStyle(style);

				Cell cellName = currentRow.createCell(1);
				cellName.setCellValue(agingDtoItr.getAlertAggVal());
				cellName.setCellStyle(style);

				Cell cellRegion = currentRow.createCell(2);
				cellRegion.setCellValue(agingDtoItr.getAlertRuleId());
				cellRegion.setCellStyle(style);

				Cell custCell = currentRow.createCell(3);
				custCell.setCellValue(agingDtoItr.getAlertVal());
				custCell.setCellStyle(style);

				Cell cellStatus = currentRow.createCell(4);
				cellStatus.setCellValue(agingDtoItr.getAlertStatus());
				cellStatus.setCellStyle(style);

				Cell custAge = currentRow.createCell(5);
				custAge.setCellValue(agingDtoItr.getAlertAge());
				custAge.setCellStyle(style);
				
				Cell custuserId = currentRow.createCell(6);
				custuserId.setCellValue(agingDtoItr.getUserId());
				custuserId.setCellStyle(style);

				rowCount++;

			}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public void agingAlertReportListExport(HttpServletResponse response, AlertPendencyReportDto agingreportDto)
			throws IOException {

		try {

			workbook = new XSSFWorkbook();
			LocalDate localDate1 = LocalDate.now();
			LocalDate localDate = LocalDate.now().minusDays(1);
			DateTimeFormatter df = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
			String date1 = localDate.format(df);

			// System.out.println("Export List :"+agingreportDto.getAlertPendencyList());

			writeCommonHeaderLine(agingreportDto);

			// for table headers
			writeHeaderLine();

			// for table cells
			writeDataLines(agingreportDto);

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void writeStrHeaderLine() {

		try {
			XSSFRow headerRow = sheet.createRow(12);
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

			XSSFCell cell = headerRow.createCell(0);
			cell.setCellStyle(style);
			cell.setCellValue("Request Id");

			XSSFCell cellMonth = headerRow.createCell(1);
			cellMonth.setCellStyle(style);
			cellMonth.setCellValue("Month");

			XSSFCell cellYear = headerRow.createCell(2);
			cellYear.setCellStyle(style);
			cellYear.setCellValue("Year");

			XSSFCell cellUserId = headerRow.createCell(3);
			cellUserId.setCellValue("User Id");
			cellUserId.setCellStyle(style);

			XSSFCell cellRoleId = headerRow.createCell(4);
			cellRoleId.setCellStyle(style);
			cellRoleId.setCellValue("Role Id");

			XSSFCell cellAmlRefNo = headerRow.createCell(5);
			cellAmlRefNo.setCellStyle(style);
			cellAmlRefNo.setCellValue("Aml Ref No");

			XSSFCell cellReqTime = headerRow.createCell(6);
			cellReqTime.setCellValue("Request Time");
			cellReqTime.setCellStyle(style);

			XSSFCell cellReqStatus = headerRow.createCell(7);
			cellReqStatus.setCellValue("Request Status");
			cellReqStatus.setCellStyle(style);

			XSSFCell cellReqAge = headerRow.createCell(8);
			cellReqAge.setCellValue("Request Age");
			cellReqAge.setCellStyle(style);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void writeStrDataLines(AlertPendencyReportDto agingreportDto) {

		try {
			XSSFCellStyle style = workbook.createCellStyle();
			XSSFFont font = workbook.createFont();
			font.setFontName("Bookman Old Style");
			font.setFontHeight(10);
			style.setFont(font);
			style.setBorderBottom(BorderStyle.THIN);
			style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
			style.setBorderRight(BorderStyle.THIN);
			style.setRightBorderColor(IndexedColors.BLACK.getIndex());
			style.setBorderLeft(BorderStyle.THIN);
			style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
			style.setBorderTop(BorderStyle.THIN);
			style.setTopBorderColor(IndexedColors.BLACK.getIndex());

			/* Set Initial Row For Starting of Table Data */
			int rowCount = 13;
			Row currentRow = sheet.createRow(rowCount);

			// System.out.println("activityDto.getFinalList():
			// "+activityDto.getFinalList());

			for (StrRequestDtlsDto strDtoItr : agingreportDto.getStrReqList()) {

				currentRow = sheet.createRow(rowCount);

				Cell reqIdCell = currentRow.createCell(0);
				reqIdCell.setCellValue(strDtoItr.getReqId());
				reqIdCell.setCellStyle(style);

				Cell cellMonth = currentRow.createCell(1);
				cellMonth.setCellValue(strDtoItr.getMonth());
				cellMonth.setCellStyle(style);

				Cell cellYear = currentRow.createCell(2);
				cellYear.setCellValue(strDtoItr.getYear());
				cellYear.setCellStyle(style);

				Cell userIdCell = currentRow.createCell(3);
				userIdCell.setCellValue(strDtoItr.getUserId());
				userIdCell.setCellStyle(style);

				Cell cellroleId = currentRow.createCell(4);
				cellroleId.setCellValue(strDtoItr.getUserRoleId());
				cellroleId.setCellStyle(style);

				Cell cellAmlRefNo = currentRow.createCell(5);
				cellAmlRefNo.setCellValue(strDtoItr.getAmlRefNo());
				cellAmlRefNo.setCellStyle(style);

				Cell reqTimeCell = currentRow.createCell(6);
				reqTimeCell.setCellValue(strDtoItr.getReqTime());
				reqTimeCell.setCellStyle(style);

				Cell cellReqStatus = currentRow.createCell(7);
				cellReqStatus.setCellValue(strDtoItr.getReqStatus());
				cellReqStatus.setCellStyle(style);

				Cell reqAgeCell = currentRow.createCell(8);
				reqAgeCell.setCellValue(strDtoItr.getReqAge());
				reqAgeCell.setCellStyle(style);

				rowCount++;

			}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public void agingStrReportListExport(HttpServletResponse response, AlertPendencyReportDto agingreportDto)
			throws IOException {

		try {

			workbook = new XSSFWorkbook();
			LocalDate localDate1 = LocalDate.now();
			LocalDate localDate = LocalDate.now().minusDays(1);
			DateTimeFormatter df = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
			String date1 = localDate.format(df);

			writeCommonHeaderLine(agingreportDto);
			writeStrHeaderLine();
			writeStrDataLines(agingreportDto);

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
