package com.idbi.intech.aml.util;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idbi.intech.aml.domain.app.ActivityReportDto;
import com.idbi.intech.aml.domain.app.AlertActivityReportDto;
import com.idbi.intech.erm.domain.app.UserDto;

public class AlertActivityReportExport {

	XSSFWorkbook workbook;
	XSSFSheet sheet;
	private ActivityReportDto activityReportDto;

	/*
	 * public AlertActivityReportExport(ActivityReportDto activityReportDto) throws
	 * JsonMappingException, JsonProcessingException {
	 * 
	 * this.activityReportDto = activityReportDto; workbook = new XSSFWorkbook(); }
	 */

	// this method is for common header with User Details
	private void writeCommonHeaderLine(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Alert Investigation Activity Report");

			//System.out.println("Get Class " + getClass());
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

			Row row = sheet.createRow(4);
			Cell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("Alert Investigation Activity Report");
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("User name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(userDto.getUsername());
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("AML CELL");
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 2, 3));

			row = sheet.createRow(7);
			cell = row.createCell(0);
			cell.setCellValue("Report Extraction Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 0, 1));
			cell = row.createCell(2);
			DateFormat outputFormatter1 = new SimpleDateFormat("dd/MM/yyyy hh.mm aa");
			String todaysDate = outputFormatter1.format(new Date());
			cell.setCellValue(todaysDate.toUpperCase());
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 2, 3));

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

	// this method is for common header with User Details
	// this method is for common header with User Details
	private void writeCommonHeaderLine(String currentDate) {
		try {

			sheet = workbook.createSheet("Alert Investigation Activity Report");

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
			cell.setCellValue("Alert Investigation Activity Report-" + currentDate);
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
			XSSFRow headerRow = sheet.createRow(10);
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
			cell.setCellValue("USER ID");

			XSSFCell cell1 = headerRow.createCell(1);
			cell1.setCellValue("USER NAME");
			cell1.setCellStyle(style);

			XSSFCell cell2 = headerRow.createCell(2);
			cell2.setCellValue("USER ROLE");
			cell2.setCellStyle(style);

			XSSFCell cell3 = headerRow.createCell(3);
			cell3.setCellValue("ALERT STATUS");
			cell3.setCellStyle(style);

			XSSFCell cell4 = headerRow.createCell(4);
			cell4.setCellValue("FROM DATE");
			cell4.setCellStyle(style);

			XSSFCell cell5 = headerRow.createCell(5);
			cell5.setCellValue("TO DATE");
			cell5.setCellStyle(style);

			XSSFCell cell6 = headerRow.createCell(6);
			cell6.setCellValue("UCIC COUNT");
			cell6.setCellStyle(style);

			XSSFCell cell7 = headerRow.createCell(7);
			cell7.setCellValue("CUSTOMER INVOLVED COUNT");
			cell7.setCellStyle(style);

			XSSFCell cell8 = headerRow.createCell(8);
			cell8.setCellValue("ALERT COUNT");
			cell8.setCellStyle(style);

			XSSFCell cell9 = headerRow.createCell(9);
			cell9.setCellValue("ACTION COUNT");
			cell9.setCellStyle(style);

			XSSFCell cell10 = headerRow.createCell(10);
			cell10.setCellValue("TOTAL UCIC COUNT");
			cell10.setCellStyle(style);

			XSSFCell cell11 = headerRow.createCell(11);
			cell11.setCellValue("TOTAL CUSTOMER INVOLVED COUNT");
			cell11.setCellStyle(style);

			XSSFCell cell12 = headerRow.createCell(12);
			cell12.setCellValue("TOTAL ALERT COUNT");
			cell12.setCellStyle(style);

			XSSFCell cell13 = headerRow.createCell(13);
			cell13.setCellValue("TOTAL ACTION COUNT");
			cell13.setCellStyle(style);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void writeDataLines(ActivityReportDto activityDto) {

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
			int rowCount = 11;
			Row currentRow = sheet.createRow(rowCount);

			for (ActivityReportDto activityDtoItr : activityDto.getActivityReportDtoList()) {

				// make list based on user
				int roleListCount = activityDtoItr.getActivityReportDtoNewList().size() - 1;

				currentRow = sheet.createRow(rowCount);
				

				if(roleListCount==0) {
					
					
					Cell srNoCell = currentRow.createCell(0);
					srNoCell.setCellValue(activityDtoItr.getUserId());
					srNoCell.setCellStyle(style);
					
					Cell userNameCell = currentRow.createCell(1);
					userNameCell.setCellValue(activityDtoItr.getUserName());
					userNameCell.setCellStyle(style);
				
				
				}
				else 
				{
					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 0, 0));
					Cell srNoCell = currentRow.createCell(0);
					srNoCell.setCellValue(activityDtoItr.getUserId());
					srNoCell.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 1, 1));
					Cell userNameCell = currentRow.createCell(1);
					userNameCell.setCellValue(activityDtoItr.getUserName());
					userNameCell.setCellStyle(style);
					
				}

				int internalRowCount = rowCount;
				int counter = 0;

				for (AlertActivityReportDto activityItrNew : activityDtoItr.getActivityReportDtoNewList()) {
					counter++;

					if (counter == 1) {
						Cell userRole = currentRow.createCell(2);
						userRole.setCellValue(activityItrNew.getUserRole());
						userRole.setCellStyle(style);

						Cell alertStatus = currentRow.createCell(3);
						alertStatus.setCellValue(activityItrNew.getAlertStatus());
						alertStatus.setCellStyle(style);
						
						/*
						 * if (activityItrNew.getAlertStatus().equalsIgnoreCase("H")) {
						 * 
						 * alertStatus.setCellValue("Hold"); alertStatus.setCellStyle(style); } else if
						 * (activityItrNew.getAlertStatus().equalsIgnoreCase("C")) {
						 * 
						 * alertStatus.setCellValue("Not Suspicious"); alertStatus.setCellStyle(style);
						 * } else if (activityItrNew.getAlertStatus().equalsIgnoreCase("M")) {
						 * 
						 * alertStatus.setCellValue("Marked Customer"); alertStatus.setCellStyle(style);
						 * } else if (activityItrNew.getAlertStatus().equalsIgnoreCase("U")) {
						 * 
						 * alertStatus.setCellValue("Suspicious"); alertStatus.setCellStyle(style); }
						 * else if (activityItrNew.getAlertStatus().equalsIgnoreCase("E")) {
						 * 
						 * alertStatus.setCellValue("Escalate Back"); alertStatus.setCellStyle(style); }
						 * else if (activityItrNew.getAlertStatus().equalsIgnoreCase("NA")) {
						 * 
						 * alertStatus.setCellValue("NA"); alertStatus.setCellStyle(style); } else if
						 * (activityItrNew.getAlertStatus().equalsIgnoreCase("O")) {
						 * 
						 * alertStatus.setCellValue("Open"); alertStatus.setCellStyle(style); } else if
						 * (activityItrNew.getAlertStatus().equalsIgnoreCase("R")) {
						 * 
						 * alertStatus.setCellValue("Report STR"); alertStatus.setCellStyle(style);
						 * }else {
						 * 
						 * alertStatus.setCellValue("NA"); alertStatus.setCellStyle(style);
						 * 
						 * }
						 */

						Cell startDate = currentRow.createCell(4);
						startDate.setCellValue(activityItrNew.getStartDate());
						startDate.setCellStyle(style);

						Cell endDate = currentRow.createCell(5);
						endDate.setCellValue(activityItrNew.getEndDate());
						endDate.setCellStyle(style);

						Cell ucicCount = currentRow.createCell(6);
						ucicCount.setCellValue(activityItrNew.getUcicCount());
						ucicCount.setCellStyle(style);

						Cell customerCount = currentRow.createCell(7);
						customerCount.setCellValue(activityItrNew.getCustomerCount());
						customerCount.setCellStyle(style);

						Cell alertCount = currentRow.createCell(8);
						alertCount.setCellValue(activityItrNew.getAlertCount());
						alertCount.setCellStyle(style);

						Cell activityCount = currentRow.createCell(9);
						activityCount.setCellValue(activityItrNew.getActivityCount());
						activityCount.setCellStyle(style);

					} else {
						Row internalRow = sheet.createRow(internalRowCount);

						Cell userRole = internalRow.createCell(2);
						userRole.setCellValue(activityItrNew.getUserRole());
						userRole.setCellStyle(style);

						Cell alertStatus = internalRow.createCell(3);
						alertStatus.setCellValue(activityItrNew.getAlertStatus());
						alertStatus.setCellStyle(style);
						/*
						 * if (activityItrNew.getAlertStatus().equalsIgnoreCase("H")) {
						 * 
						 * alertStatus.setCellValue("Hold"); alertStatus.setCellStyle(style); } else if
						 * (activityItrNew.getAlertStatus().equalsIgnoreCase("C")) {
						 * 
						 * alertStatus.setCellValue("Not Suspicious"); alertStatus.setCellStyle(style);
						 * } else if (activityItrNew.getAlertStatus().equalsIgnoreCase("M")) {
						 * 
						 * alertStatus.setCellValue("Marked Customer"); alertStatus.setCellStyle(style);
						 * } else if (activityItrNew.getAlertStatus().equalsIgnoreCase("U")) {
						 * 
						 * alertStatus.setCellValue("Suspicious"); alertStatus.setCellStyle(style); }
						 * else if (activityItrNew.getAlertStatus().equalsIgnoreCase("E")) {
						 * 
						 * alertStatus.setCellValue("Escalate Back"); alertStatus.setCellStyle(style); }
						 * else if (activityItrNew.getAlertStatus().equalsIgnoreCase("NA")) {
						 * 
						 * alertStatus.setCellValue("NA"); alertStatus.setCellStyle(style); } else if
						 * (activityItrNew.getAlertStatus().equalsIgnoreCase("O")) {
						 * 
						 * alertStatus.setCellValue("Open"); alertStatus.setCellStyle(style); } else if
						 * (activityItrNew.getAlertStatus().equalsIgnoreCase("R")) {
						 * 
						 * alertStatus.setCellValue("Report STR"); alertStatus.setCellStyle(style);
						 * }else {
						 * 
						 * alertStatus.setCellValue("NA"); alertStatus.setCellStyle(style); }
						 */

						Cell startDate = internalRow.createCell(4);
						startDate.setCellValue(activityItrNew.getStartDate());
						startDate.setCellStyle(style);

						Cell endDate = internalRow.createCell(5);
						endDate.setCellValue(activityItrNew.getEndDate());
						endDate.setCellStyle(style);

						Cell ucicCount = internalRow.createCell(6);
						ucicCount.setCellValue(activityItrNew.getUcicCount());
						ucicCount.setCellStyle(style);

						Cell customerCount = internalRow.createCell(7);
						customerCount.setCellValue(activityItrNew.getCustomerCount());
						customerCount.setCellStyle(style);

						Cell alertCount = internalRow.createCell(8);
						alertCount.setCellValue(activityItrNew.getAlertCount());
						alertCount.setCellStyle(style);

						Cell activityCount = internalRow.createCell(9);
						activityCount.setCellValue(activityItrNew.getActivityCount());
						activityCount.setCellStyle(style);
					}

					internalRowCount++;
				}

				if(roleListCount==0) {
					
					Cell totalUcic = currentRow.createCell(10);
					totalUcic.setCellValue(activityDtoItr.getUcicSum());
					totalUcic.setCellStyle(style);
					
					Cell totalCustomer = currentRow.createCell(11);
					totalCustomer.setCellValue(activityDtoItr.getCustomerSum());
					totalCustomer.setCellStyle(style);
					
					Cell totalAlert = currentRow.createCell(12);
					totalAlert.setCellValue(activityDtoItr.getAlertSum());
					totalAlert.setCellStyle(style);
					
					Cell totalActivitySum = currentRow.createCell(13);
					totalActivitySum.setCellValue(activityDtoItr.getActionSum());
					totalActivitySum.setCellStyle(style);
				
				}
				else {
					
					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 10, 10));
					Cell totalUcic = currentRow.createCell(10);
					totalUcic.setCellValue(activityDtoItr.getUcicSum());
					totalUcic.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 11, 11));
					Cell totalCustomer = currentRow.createCell(11);
					totalCustomer.setCellValue(activityDtoItr.getCustomerSum());
					totalCustomer.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 12, 12));
					Cell totalAlert = currentRow.createCell(12);
					totalAlert.setCellValue(activityDtoItr.getAlertSum());
					totalAlert.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 13, 13));
					Cell totalActivitySum = currentRow.createCell(13);
					totalActivitySum.setCellValue(activityDtoItr.getActionSum());
					totalActivitySum.setCellStyle(style);
				}
				
				int numMerged = sheet.getNumMergedRegions();

				for (int j = 0; j < numMerged; j++) {

					CellRangeAddress mergedRegions = sheet.getMergedRegion(j);
					RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
					RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
				}

				/* next row count will be merge rows */
				rowCount = rowCount + roleListCount;

				/* next row */
				rowCount++;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public void alertActivityReportExport(HttpServletResponse response, ActivityReportDto activityDto)
			throws IOException {

		try {
			List<ActivityReportDto> activityDtoList = new ArrayList<>();
			workbook = new XSSFWorkbook();
			LocalDate localDate1 = LocalDate.now();
			LocalDate localDate = LocalDate.now().minusDays(1);
			DateTimeFormatter df = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
			String date1 = localDate.format(df);

			// for report information header
			//System.out.println("");
			writeCommonHeaderLine(activityDto.getUserDto());
			// writeCommonHeaderLine(date1);

			// for table headers
			writeHeaderLine();

			// for table cells
			writeDataLines(activityDto);
			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
