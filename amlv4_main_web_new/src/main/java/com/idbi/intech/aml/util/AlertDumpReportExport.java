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

import com.idbi.intech.aml.domain.app.ActivityReportDto;
import com.idbi.intech.aml.domain.app.AlertActivityReportDto;
import com.idbi.intech.aml.domain.app.AlertDumpTableDto;
import com.idbi.intech.aml.domain.app.DumpDto;
import com.idbi.intech.erm.domain.app.UserDto;

public class AlertDumpReportExport {

	XSSFWorkbook workbook;
	XSSFSheet sheet;
	private AlertDumpTableDto activityReportDto;

	// this method is for common header with User Details
	private void writeCommonHeaderLine(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Alert Investigation Dump Report");

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

			Row row = sheet.createRow(4);
			Cell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("Alert Investigation Dump Report");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("User name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(userDto.getUsername());
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("AML CELL");
			cell.setCellStyle(cellStyle);
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
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 2, 3));

			row = sheet.createRow(8);
			cell = row.createCell(0);
			cell.setCellValue("Report Start Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell = row.createCell(2);
			// DateFormat outputFormatter1 = new SimpleDateFormat("dd/MM/yyyy hh.mm aa");
			// String todaysDate = outputFormatter1.format(new Date());
			cell.setCellValue(userDto.getAlertStartDate());
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 2, 3));

			row = sheet.createRow(9);
			cell = row.createCell(0);
			cell.setCellValue("Report End Date ");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
			cell = row.createCell(2);
			// DateFormat outputFormatter1 = new SimpleDateFormat("dd/MM/yyyy hh.mm aa");
			// String todaysDate = outputFormatter1.format(new Date());
			cell.setCellValue(userDto.getAlertEndDate());
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 2, 3));

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

			sheet = workbook.createSheet("Alert Investigation Dump Report");

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
			cell.setCellValue("Alert Investigation Dump Report-" + currentDate);
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
			cell.setCellValue("CUSTOMER ID");

			XSSFCell cell1 = headerRow.createCell(1);
			cell1.setCellValue("ACCOUNT NO");
			cell1.setCellStyle(style);

			XSSFCell cell2 = headerRow.createCell(2);
			cell2.setCellValue("UCIC NO");
			cell2.setCellStyle(style);

			XSSFCell cell3 = headerRow.createCell(3);
			cell3.setCellValue("TICKET ID");
			cell3.setCellStyle(style);

			XSSFCell cell4 = headerRow.createCell(4);
			cell4.setCellValue("RULE ID");
			cell4.setCellStyle(style);

			XSSFCell cell5 = headerRow.createCell(5);
			cell5.setCellValue("RULE DESC");
			cell5.setCellStyle(style);

			XSSFCell cell6 = headerRow.createCell(6);
			cell6.setCellValue("USER ID");
			cell6.setCellStyle(style);

			XSSFCell cell7 = headerRow.createCell(7);
			cell7.setCellValue("USER ROLE");
			cell7.setCellStyle(style);

			XSSFCell cell8 = headerRow.createCell(8);
			cell8.setCellValue("ACTIVITY STATUS");
			cell8.setCellStyle(style);

			XSSFCell cell9 = headerRow.createCell(9);
			cell9.setCellValue("ACTIVITY COMMENT");
			cell9.setCellStyle(style);

			XSSFCell cell10 = headerRow.createCell(10);
			cell10.setCellValue("ACTIVITY DATE");
			cell10.setCellStyle(style);

			XSSFCell cell11 = headerRow.createCell(11);
			cell11.setCellValue("ALERT TAT");
			cell11.setCellStyle(style);

			XSSFCell cell12 = headerRow.createCell(12);
			cell12.setCellValue("STR REQUESTED");
			cell12.setCellStyle(style);

			XSSFCell cell13 = headerRow.createCell(13);
			cell13.setCellValue("STR REQUEST ID");
			cell13.setCellStyle(style);

			XSSFCell cell14 = headerRow.createCell(14);
			cell14.setCellValue("STR STATUS");
			cell14.setCellStyle(style);
			
			XSSFCell cell15 = headerRow.createCell(15);
			cell15.setCellValue("STR SOURCE OF ALERT");
			cell15.setCellStyle(style);

			XSSFCell cell16 = headerRow.createCell(16);
			cell16.setCellValue("CTR COUNT");
			cell16.setCellStyle(style);

			XSSFCell cell17 = headerRow.createCell(17);
			cell17.setCellValue("NTR COUNT");
			cell17.setCellStyle(style);

			XSSFCell cell18 = headerRow.createCell(18);
			cell18.setCellValue("CBWTR COUNT");
			cell18.setCellStyle(style);

			XSSFCell cell19 = headerRow.createCell(19);
			cell19.setCellValue("CCR COUNT");
			cell19.setCellStyle(style);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void writeDataLines(AlertDumpTableDto activityDto) {

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

			for (AlertDumpTableDto activityDtoItr : activityDto.getFinalList()) {

				// make list based on user
				int roleListCount = activityDtoItr.getAlertDumpTableList().size() - 1;

				currentRow = sheet.createRow(rowCount);

				if (roleListCount == 0) {

					Cell srNoCell = currentRow.createCell(0);
					srNoCell.setCellValue(activityDtoItr.getCustomerId());
					srNoCell.setCellStyle(style);

					Cell accountNoCell = currentRow.createCell(1);
					accountNoCell.setCellValue(activityDtoItr.getAccountNo());
					accountNoCell.setCellStyle(style);

					Cell userNameCell = currentRow.createCell(2);
					userNameCell.setCellValue(activityDtoItr.getUcicNo());
					userNameCell.setCellStyle(style);

				} else {
					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 0, 0));
					Cell srNoCell = currentRow.createCell(0);
					srNoCell.setCellValue(activityDtoItr.getCustomerId());
					srNoCell.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 1, 1));
					Cell accountNoCell = currentRow.createCell(1);
					accountNoCell.setCellValue(activityDtoItr.getAccountNo());
					accountNoCell.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 2, 2));
					Cell userNameCell = currentRow.createCell(2);
					userNameCell.setCellValue(activityDtoItr.getUcicNo());
					userNameCell.setCellStyle(style);

				}

				int internalRowCount = rowCount;
				int counter = 0;

				for (DumpDto activityItrNew : activityDtoItr.getAlertDumpTableList()) {
					counter++;

					if (counter == 1) {

						Cell ticketId = currentRow.createCell(3);
						ticketId.setCellValue(activityItrNew.getTicketId());
						ticketId.setCellStyle(style);

						Cell ruleId = currentRow.createCell(4);
						ruleId.setCellValue(activityItrNew.getRuleId());
						ruleId.setCellStyle(style);

						Cell ruleDesc = currentRow.createCell(5);
						ruleDesc.setCellValue(activityItrNew.getRuleDesc());
						ruleDesc.setCellStyle(style);

						Cell userId = currentRow.createCell(6);
						userId.setCellValue(activityItrNew.getUserId());
						userId.setCellStyle(style);

						Cell userRole = currentRow.createCell(7);
						userRole.setCellValue(activityItrNew.getUserRole());
						userRole.setCellStyle(style);

						Cell alertStatus = currentRow.createCell(8);
						alertStatus.setCellValue(activityItrNew.getActStatus());
						alertStatus.setCellStyle(style);

						Cell actComment = currentRow.createCell(9);
						actComment.setCellValue(activityItrNew.getActComment());
						actComment.setCellStyle(style);

						Cell actDate = currentRow.createCell(10);
						actDate.setCellValue(activityItrNew.getActDate());
						actDate.setCellStyle(style);

						Cell alertTat = currentRow.createCell(11);
						alertTat.setCellValue(activityItrNew.getAlertTat());
						alertTat.setCellStyle(style);

					} else {
						Row internalRow = sheet.createRow(internalRowCount);

						Cell ticketId = internalRow.createCell(3);
						ticketId.setCellValue(activityItrNew.getTicketId());
						ticketId.setCellStyle(style);

						Cell ruleId = internalRow.createCell(4);
						ruleId.setCellValue(activityItrNew.getRuleId());
						ruleId.setCellStyle(style);

						Cell ruleDesc = internalRow.createCell(5);
						ruleDesc.setCellValue(activityItrNew.getRuleDesc());
						ruleDesc.setCellStyle(style);

						Cell userId = internalRow.createCell(6);
						userId.setCellValue(activityItrNew.getUserId());
						userId.setCellStyle(style);

						Cell userRole = internalRow.createCell(7);
						userRole.setCellValue(activityItrNew.getUserRole());
						userRole.setCellStyle(style);

						Cell alertStatus = internalRow.createCell(8);
						alertStatus.setCellValue(activityItrNew.getActStatus());
						alertStatus.setCellStyle(style);

						Cell actComment = internalRow.createCell(9);
						actComment.setCellValue(activityItrNew.getActComment());
						actComment.setCellStyle(style);

						Cell actDate = internalRow.createCell(10);
						actDate.setCellValue(activityItrNew.getActDate());
						actDate.setCellStyle(style);

						Cell alertTat = internalRow.createCell(11);
						alertTat.setCellValue(activityItrNew.getAlertTat());
						alertTat.setCellStyle(style);

					}

					internalRowCount++;
				}

				if (roleListCount == 0) {

					Cell strRequested = currentRow.createCell(12);
					strRequested.setCellValue(activityDtoItr.getStrRequested());
					strRequested.setCellStyle(style);

					Cell strRequestedId = currentRow.createCell(13);
					strRequestedId.setCellValue(activityDtoItr.getStrRequestedId());
					strRequestedId.setCellStyle(style);

					Cell strStatus = currentRow.createCell(14);
					strStatus.setCellValue(activityDtoItr.getStrStatus());
					strStatus.setCellStyle(style);
					
					Cell strSource = currentRow.createCell(15);
					strSource.setCellValue(activityDtoItr.getStrSource());
					strSource.setCellStyle(style);

					Cell ctr = currentRow.createCell(16);
					ctr.setCellValue(activityDtoItr.getCtr());
					ctr.setCellStyle(style);

					Cell ntr = currentRow.createCell(17);
					ntr.setCellValue(activityDtoItr.getNtr());
					ntr.setCellStyle(style);

					Cell cbwtr = currentRow.createCell(18);
					cbwtr.setCellValue(activityDtoItr.getCbwtr());
					cbwtr.setCellStyle(style);

					Cell ccr = currentRow.createCell(19);
					ccr.setCellValue(activityDtoItr.getCcr());
					ccr.setCellStyle(style);

				} else {

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 12, 12));
					Cell strRequested = currentRow.createCell(12);
					strRequested.setCellValue(activityDtoItr.getStrRequested());
					strRequested.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 13, 13));
					Cell strRequestedId = currentRow.createCell(13);
					strRequestedId.setCellValue(activityDtoItr.getStrRequestedId());
					strRequestedId.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 14, 14));
					Cell strStatus = currentRow.createCell(14);
					strStatus.setCellValue(activityDtoItr.getStrStatus());
					strStatus.setCellStyle(style);
					
					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 15, 15));
					Cell strSource = currentRow.createCell(15);
					strSource.setCellValue(activityDtoItr.getStrSource());
					strSource.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 16, 16));
					Cell ctr = currentRow.createCell(16);
					ctr.setCellValue(activityDtoItr.getCtr());
					ctr.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 17, 17));
					Cell ntr = currentRow.createCell(17);
					ntr.setCellValue(activityDtoItr.getNtr());
					ntr.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 18, 18));
					Cell cbwtr = currentRow.createCell(18);
					cbwtr.setCellValue(activityDtoItr.getCbwtr());
					cbwtr.setCellStyle(style);

					sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + roleListCount, 19, 19));
					Cell ccr = currentRow.createCell(19);
					ccr.setCellValue(activityDtoItr.getCcr());
					ccr.setCellStyle(style);
					
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

	public void alertDumpReportExport(HttpServletResponse response, AlertDumpTableDto activityDto) throws IOException {

		try {
			List<AlertDumpTableDto> activityDtoList = new ArrayList<>();
			workbook = new XSSFWorkbook();
			LocalDate localDate1 = LocalDate.now();
			LocalDate localDate = LocalDate.now().minusDays(1);
			DateTimeFormatter df = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
			String date1 = localDate.format(df);

			// for report information header
			// System.out.println("In alertDumpReportExport");
			// System.out.println("activityDto: "+activityDto);
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
