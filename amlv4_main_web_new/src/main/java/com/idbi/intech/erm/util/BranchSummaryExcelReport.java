package com.idbi.intech.erm.util;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Picture;
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

import com.idbi.intech.erm.domain.app.UserDto;
import com.idbi.intech.oms.domain.app.ConsolidatedViewDto;
import com.idbi.intech.oms.domain.app.OmsAlertMasterDto;

public class BranchSummaryExcelReport {

	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	OmsAlertMasterDto alertDto;
	UserDto userDto = new UserDto();

	public BranchSummaryExcelReport(OmsAlertMasterDto alertDto) {
		this.alertDto = alertDto;
		workbook = new XSSFWorkbook();
	}

	public void export(HttpServletResponse response, UserDto userDto) throws IOException {

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

	// this method is for common header with User Details
	private void writeCommonHeaderLine(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Alert Count Report");

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
			Drawing<?> drawing = sheet.createDrawingPatriarch();

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
			cell2.setCellValue("BRANCH SUMMARY REPORT");
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

			XSSFCell cell6 = row1.createCell(2);
			cell6.setCellValue(alertDto.getStartDate() + " To " + alertDto.getEndDate());
			cell6.setCellStyle(styleData);
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
			// Row 3
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

	// this method is for header
	private void writeHeaderLine() {
		// sheet = workbook.createSheet("Incident Type Count Report");

		XSSFRow headerRow = sheet.createRow(13);
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
		cell.setCellValue("Sr No");

		XSSFCell cell1 = headerRow.createCell(1);
		cell1.setCellValue("Branch");
		cell1.setCellStyle(style);

		XSSFCell cell2 = headerRow.createCell(2);
		cell2.setCellValue("Alert Status");
		cell2.setCellStyle(style);

		XSSFCell cell3 = headerRow.createCell(3);
		cell3.setCellValue("Reoccurance Count");
		cell3.setCellStyle(style);

		XSSFCell cell4 = headerRow.createCell(4);
		cell4.setCellValue("Region");
		cell4.setCellStyle(style);

		XSSFCell cell5 = headerRow.createCell(5);
		cell5.setCellValue("Zone");
		cell5.setCellStyle(style);

		XSSFCell cell6 = headerRow.createCell(6);
		cell6.setCellValue("Rule Id");
		cell6.setCellStyle(style);

		XSSFCell cell7 = headerRow.createCell(7);
		cell7.setCellValue("Exception Description");
		cell7.setCellStyle(style);

		XSSFCell cell8 = headerRow.createCell(8);
		cell8.setCellValue("Rule Frequency");
		cell8.setCellStyle(style);

		XSSFCell cell9 = headerRow.createCell(9);
		cell9.setCellValue("Rule TAT");
		cell9.setCellStyle(style);

		XSSFCell cell10 = headerRow.createCell(10);
		cell10.setCellValue("Rule Category");
		cell10.setCellStyle(style);

		XSSFCell cell11 = headerRow.createCell(11);
		cell11.setCellValue("Risk Severity");
		cell11.setCellStyle(style);
		
		XSSFCell cell12 = headerRow.createCell(12);
		cell12.setCellValue("Customer Id");
		cell12.setCellStyle(style);
		
		XSSFCell cell13 = headerRow.createCell(13);
		cell13.setCellValue("Account Number");
		cell13.setCellStyle(style);
		
		XSSFCell cell14 = headerRow.createCell(14);
		cell14.setCellValue("Account Name");
		cell14.setCellStyle(style);
		
		XSSFCell cell15 = headerRow.createCell(15);
		cell15.setCellValue("Generated Time");
		cell15.setCellStyle(style);
		
		XSSFCell cell16 = headerRow.createCell(16);
		cell16.setCellValue("Vertical");
		cell16.setCellStyle(style);
		
		XSSFCell cell17 = headerRow.createCell(17);
		cell17.setCellValue("Scheme Type");
		cell17.setCellStyle(style);
		
		XSSFCell cell18 = headerRow.createCell(18);
		cell18.setCellValue("Scheme Code");
		cell18.setCellStyle(style);
		
		XSSFCell cell19 = headerRow.createCell(19);
		cell19.setCellValue("Transaction Id");
		cell19.setCellStyle(style);
		
		XSSFCell cell20 = headerRow.createCell(20);
		cell20.setCellValue("Transaction Date");
		cell20.setCellStyle(style);
		
		XSSFCell cell21 = headerRow.createCell(21);
		cell21.setCellValue("Transaction Type");
		cell21.setCellStyle(style);
		
		XSSFCell cell22 = headerRow.createCell(22);
		cell22.setCellValue("Transaction Amount");
		cell22.setCellStyle(style);
		
		XSSFCell cell23 = headerRow.createCell(23);
		cell23.setCellValue("Transaction Particulars");
		cell23.setCellStyle(style);
		
		XSSFCell cell24 = headerRow.createCell(24);
		cell24.setCellValue("Entry User Id");
		cell24.setCellStyle(style);
		
		XSSFCell cell25 = headerRow.createCell(25);
		cell25.setCellValue("Entry User Name");
		cell25.setCellStyle(style);
		
		XSSFCell cell26 = headerRow.createCell(26);
		cell26.setCellValue("Entry User Vertical");
		cell26.setCellStyle(style);
		
		XSSFCell cell27 = headerRow.createCell(27);
		cell27.setCellValue("Entry User Position");
		cell27.setCellStyle(style);
		
		XSSFCell cell28 = headerRow.createCell(28);
		cell28.setCellValue("Verify User Id");
		cell28.setCellStyle(style);
		
		XSSFCell cell29 = headerRow.createCell(29);
		cell29.setCellValue("Verify User Name");
		cell29.setCellStyle(style);
		
		XSSFCell cell30 = headerRow.createCell(30);
		cell30.setCellValue("Verify User Vertical");
		cell30.setCellStyle(style);
		
		XSSFCell cell31 = headerRow.createCell(31);
		cell31.setCellValue("Verify User Position");
		cell31.setCellStyle(style);
		
		XSSFCell cell32 = headerRow.createCell(32);
		cell32.setCellValue("Bill Id");
		cell32.setCellStyle(style);
		
		XSSFCell cell33 = headerRow.createCell(33);
		cell33.setCellValue("INIT Sol Id");
		cell33.setCellStyle(style);
		
		XSSFCell cell34 = headerRow.createCell(34);
		cell34.setCellValue("Finacle User Id");
		cell34.setCellStyle(style);
		
		XSSFCell cell35 = headerRow.createCell(35);
		cell35.setCellValue("Device Id");
		cell35.setCellStyle(style);
		
		XSSFCell cell36 = headerRow.createCell(36);
		cell11.setCellValue("Login Log Time");
		cell11.setCellStyle(style);
		
		XSSFCell cell37 = headerRow.createCell(37);
		cell37.setCellValue("Position");
		cell37.setCellStyle(style);
		
		XSSFCell cell38 = headerRow.createCell(38);
		cell38.setCellValue("Location");
		cell38.setCellStyle(style);
		
		XSSFCell cell39 = headerRow.createCell(39);
		cell39.setCellValue("Comment Date");
		cell39.setCellStyle(style);
		
		XSSFCell cell40 = headerRow.createCell(40);
		cell40.setCellValue("Alert Comment");
		cell40.setCellStyle(style);
		
		XSSFCell cell41 = headerRow.createCell(41);
		cell41.setCellValue("To be Complied By Date");
		cell41.setCellStyle(style);
		
		XSSFCell cell42 = headerRow.createCell(42);
		cell42.setCellValue("Maker Name");
		cell42.setCellStyle(style);
		
		XSSFCell cell43 = headerRow.createCell(43);
		cell43.setCellValue("Checker Name");
		cell43.setCellStyle(style);
		
		
		
		
		
		
		/*
		 * style.setWrapText(true); createCell(row, 0, "Sr No", style); createCell(row,
		 * 1, "Branch", style); createCell(row, 2, "Alert Status", style);
		 * createCell(row, 3, "Reoccurance Count", style); createCell(row, 4, "Region",
		 * style); createCell(row, 5, "Zone", style); createCell(row, 6, "Rule Id",
		 * style); createCell(row, 7, "Exception Description", style); createCell(row,
		 * 8, "Rule Frequency", style); createCell(row, 9, "Rule TAT", style);
		 * createCell(row, 10, "Rule Category", style); createCell(row, 11,
		 * "Risk Severity", style); createCell(row, 12, "Customer Id", style);
		 * createCell(row, 13, "Account Number", style); createCell(row, 14,
		 * "Account Name", style); createCell(row, 15, "Generated Time", style);
		 * createCell(row, 16, "Vertical", style); createCell(row, 17, "Scheme Type",
		 * style); createCell(row, 18, "Scheme Code", style); createCell(row, 19,
		 * "Transaction Id", style); createCell(row, 20, "Transaction Date", style);
		 * createCell(row, 21, "Transaction Type", style); createCell(row, 22,
		 * "Transaction Amount", style); createCell(row, 23, "Transaction Particulars",
		 * style); createCell(row, 24, "Entry User Id", style); createCell(row, 25,
		 * "Entry User Name", style); createCell(row, 26, "Entry User Vertical", style);
		 * createCell(row, 27, "Entry User Position", style); createCell(row, 28,
		 * "Verify User Id", style); createCell(row, 29, "Verify User Name", style);
		 * createCell(row, 30, "Verify User Vertical", style); createCell(row, 31,
		 * "Verify User Position", style); createCell(row, 32, "Bill Id", style);
		 * createCell(row, 33, "INIT Sol Id", style); createCell(row, 34,
		 * "Finacle User Id", style); createCell(row, 35, "Device Id", style);
		 * createCell(row, 36, "Login Log Time", style); createCell(row, 37, "Position",
		 * style); createCell(row, 38, "Location", style); createCell(row, 39,
		 * "Comment Date", style); createCell(row, 40, "Alert Comment", style);
		 * createCell(row, 41, "To be Complied By Date", style); createCell(row, 42,
		 * "Maker Name", style); createCell(row, 43, "Checker Name", style);
		 */
		
	}

	// this method is to write data to excel
	private void writeDataLines() {
		int rowCount = 14;

		XSSFCellStyle style = workbook.createCellStyle();
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

		// style for incident Name
		XSSFCellStyle styleName = workbook.createCellStyle();
		XSSFFont fontNaming = workbook.createFont();
		fontNaming.setFontName("Times New Roman");
		fontNaming.setFontHeight(12);
		styleName.setFont(font);
		styleName.setBorderBottom(BorderStyle.THIN);
		styleName.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styleName.setBorderRight(BorderStyle.THIN);
		styleName.setRightBorderColor(IndexedColors.BLACK.getIndex());
		styleName.setBorderLeft(BorderStyle.THIN);
		styleName.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		styleName.setBorderTop(BorderStyle.THIN);
		styleName.setTopBorderColor(IndexedColors.BLACK.getIndex());
		styleName.setWrapText(true);

		// style.setWrapText(true);
		int srNo = 1;
		for (ConsolidatedViewDto alertObj : alertDto.getConsolidatedReportList()) {
			XSSFRow row = sheet.createRow(rowCount++);
			int columnCount = 0;
			
			XSSFCell cell = row.createCell(columnCount++);
			cell.setCellStyle(style);
			cell.setCellValue(srNo);
			
			XSSFCell cell1 = row.createCell(columnCount++);
			cell1.setCellStyle(style);
			cell1.setCellValue(alertObj.getBranch());
			
			XSSFCell cell2 = row.createCell(columnCount++);
			cell2.setCellStyle(style);
			cell2.setCellValue(alertObj.getAlertStatus());
			
			XSSFCell cell3 = row.createCell(columnCount++);
			cell3.setCellStyle(style);
			cell3.setCellValue(Integer.parseInt(alertObj.getReoccuranceCount()));
			
			XSSFCell cell4 = row.createCell(columnCount++);
			cell4.setCellStyle(style);
			cell4.setCellValue(alertObj.getRegion());
			
			XSSFCell cell5 = row.createCell(columnCount++);
			cell5.setCellStyle(style);
			cell5.setCellValue(alertObj.getZone());
			
			XSSFCell cell6 = row.createCell(columnCount++);
			cell6.setCellStyle(style);
			cell6.setCellValue(alertObj.getRuleId());
			
			XSSFCell cell7 = row.createCell(columnCount++);
			cell7.setCellStyle(style);
			cell7.setCellValue(alertObj.getExceptionDescription());
			
			XSSFCell cell8 = row.createCell(columnCount++);
			cell8.setCellStyle(style);
			cell8.setCellValue(alertObj.getRuleFrequency());
			
			XSSFCell cell9 = row.createCell(columnCount++);
			cell9.setCellStyle(style);
			cell9.setCellValue(Integer.parseInt(alertObj.getRuleTAT()));
			
			XSSFCell cell10 = row.createCell(columnCount++);
			cell10.setCellStyle(style);
			cell10.setCellValue(alertObj.getRuleCategory());
			
			XSSFCell cell11 = row.createCell(columnCount++);
			cell11.setCellStyle(style);
			cell11.setCellValue(alertObj.getRiskSeverity());
			
			XSSFCell cell12 = row.createCell(columnCount++);
			cell12.setCellStyle(style);
			cell12.setCellValue(alertObj.getCustomerId());
			
			XSSFCell cell13 = row.createCell(columnCount++);
			cell13.setCellStyle(style);
			cell13.setCellValue(alertObj.getAccountNumber());
			
			XSSFCell cell14 = row.createCell(columnCount++);
			cell14.setCellStyle(style);
			cell14.setCellValue(alertObj.getAccountName());
			
			XSSFCell cell15 = row.createCell(columnCount++);
			cell15.setCellStyle(style);
			cell15.setCellValue(alertObj.getGeneratedTime());
			
			XSSFCell cell16 = row.createCell(columnCount++);
			cell16.setCellStyle(style);
			cell16.setCellValue(alertObj.getVertical());
			
			XSSFCell cell17 = row.createCell(columnCount++);
			cell17.setCellStyle(style);
			cell17.setCellValue(alertObj.getSchemeType());
			
			XSSFCell cell18 = row.createCell(columnCount++);
			cell18.setCellStyle(style);
			cell18.setCellValue(alertObj.getSchemeCode());
			
			XSSFCell cell19 = row.createCell(columnCount++);
			cell19.setCellStyle(style);
			cell19.setCellValue(alertObj.getTransactionId());
			
			XSSFCell cell20 = row.createCell(columnCount++);
			cell20.setCellStyle(style);
			cell20.setCellValue(alertObj.getTransactionDate());
			
			XSSFCell cell21 = row.createCell(columnCount++);
			cell21.setCellStyle(style);
			cell21.setCellValue(alertObj.getTransactionType());
			
			XSSFCell cell22 = row.createCell(columnCount++);
			cell22.setCellStyle(style);
			cell22.setCellValue(alertObj.getTransactionAmount());
			
			XSSFCell cell23 = row.createCell(columnCount++);
			cell23.setCellStyle(style);
			cell23.setCellValue(alertObj.getTransactionParticulars());
			
			XSSFCell cell24 = row.createCell(columnCount++);
			cell24.setCellStyle(style);
			cell24.setCellValue(alertObj.getEntryUserId());
			
			XSSFCell cell25 = row.createCell(columnCount++);
			cell25.setCellStyle(style);
			cell25.setCellValue(alertObj.getEntryUserName());
			
			XSSFCell cell26 = row.createCell(columnCount++);
			cell26.setCellStyle(style);
			cell26.setCellValue(alertObj.getEntryUserVertical());
			
			XSSFCell cell27 = row.createCell(columnCount++);
			cell27.setCellStyle(style);
			cell27.setCellValue(alertObj.getEntryUserPosition());
			
			XSSFCell cell28 = row.createCell(columnCount++);
			cell28.setCellStyle(style);
			cell28.setCellValue(alertObj.getVerifyUserId());
			
			XSSFCell cell29 = row.createCell(columnCount++);
			cell29.setCellStyle(style);
			cell29.setCellValue(alertObj.getVerifyUserName());
			
			XSSFCell cell30 = row.createCell(columnCount++);
			cell30.setCellStyle(style);
			cell30.setCellValue(alertObj.getVerifyUserVertical());
			
			XSSFCell cell31 = row.createCell(columnCount++);
			cell31.setCellStyle(style);
			cell31.setCellValue(alertObj.getVerifyUserPosition());
			
			XSSFCell cell32 = row.createCell(columnCount++);
			cell32.setCellStyle(style);
			cell32.setCellValue(alertObj.getBillId());
			
			XSSFCell cell33 = row.createCell(columnCount++);
			cell33.setCellStyle(style);
			cell33.setCellValue(alertObj.getInitSolId());
			
			XSSFCell cell34 = row.createCell(columnCount++);
			cell34.setCellStyle(style);
			cell34.setCellValue(alertObj.getFinacleUserId());
			
			XSSFCell cell35 = row.createCell(columnCount++);
			cell35.setCellStyle(style);
			cell35.setCellValue(alertObj.getDeviceId());
			
			XSSFCell cell36 = row.createCell(columnCount++);
			cell36.setCellStyle(style);
			cell36.setCellValue(alertObj.getLoginLogTime());
			
			XSSFCell cell37 = row.createCell(columnCount++);
			cell37.setCellStyle(style);
			cell37.setCellValue(alertObj.getPosition());
			
			XSSFCell cell38 = row.createCell(columnCount++);
			cell38.setCellStyle(style);
			cell38.setCellValue(alertObj.getLocation());
			
			XSSFCell cell39 = row.createCell(columnCount++);
			cell39.setCellStyle(style);
			cell39.setCellValue(alertObj.getCommentDate());
			
			XSSFCell cell40 = row.createCell(columnCount++);
			cell40.setCellStyle(style);
			cell40.setCellValue(alertObj.getAlertComment());
			
			XSSFCell cell41 = row.createCell(columnCount++);
			cell41.setCellStyle(style);
			cell41.setCellValue(alertObj.getCompliedByDate());
			
			XSSFCell cell42 = row.createCell(columnCount++);
			cell42.setCellStyle(style);
			cell42.setCellValue(alertObj.getMakerName());
			
			XSSFCell cell43 = row.createCell(columnCount++);
			cell43.setCellStyle(style);
			cell43.setCellValue(alertObj.getCheckerName());
			
			
			
			srNo++;
			
			

			/*
			 * createCell(row, columnCount++, srNo, style); createCell(row, columnCount++,
			 * alertObj.getBranch(), style); createCell(row, columnCount++,
			 * alertObj.getAlertStatus(), styleName); createCell(row, columnCount++,
			 * Integer.parseInt(alertObj.getReoccuranceCount()), style); createCell(row,
			 * columnCount++, alertObj.getRegion(), style); createCell(row, columnCount++,
			 * alertObj.getZone(),style); createCell(row,
			 * columnCount++,alertObj.getRuleId(), style); createCell(row, columnCount++,
			 * alertObj.getExceptionDescription(), style); createCell(row, columnCount++,
			 * alertObj.getRuleFrequency(), style); createCell(row, columnCount++,
			 * Integer.parseInt(alertObj.getRuleTAT()), style); createCell(row,
			 * columnCount++, alertObj.getRuleCategory(), style); createCell(row,
			 * columnCount++, alertObj.getRiskSeverity(), style); createCell(row,
			 * columnCount++, alertObj.getCustomerId(), style); createCell(row,
			 * columnCount++, alertObj.getAccountNumber(), style); createCell(row,
			 * columnCount++, alertObj.getAccountName(), style); createCell(row,
			 * columnCount++, alertObj.getGeneratedTime(), style); createCell(row,
			 * columnCount++, alertObj.getVertical(), style); createCell(row, columnCount++,
			 * alertObj.getSchemeType(), style); createCell(row, columnCount++,
			 * alertObj.getSchemeCode(), style); createCell(row, columnCount++,
			 * alertObj.getTransactionId(), style); createCell(row, columnCount++,
			 * alertObj.getTransactionDate(), style); createCell(row, columnCount++,
			 * alertObj.getTransactionType(), style); createCell(row, columnCount++,
			 * alertObj.getTransactionAmount(), style); createCell(row, columnCount++,
			 * alertObj.getTransactionParticulars(), style); createCell(row, columnCount++,
			 * alertObj.getEntryUserId(), style); createCell(row, columnCount++,
			 * alertObj.getEntryUserName(), style); createCell(row, columnCount++,
			 * alertObj.getEntryUserVertical(), style); createCell(row, columnCount++,
			 * alertObj.getEntryUserPosition(), style); createCell(row, columnCount++,
			 * alertObj.getVerifyUserId(), style); createCell(row, columnCount++,
			 * alertObj.getVerifyUserName(), style); createCell(row, columnCount++,
			 * alertObj.getVerifyUserVertical(), style); createCell(row, columnCount++,
			 * alertObj.getVerifyUserPosition(), style); createCell(row, columnCount++,
			 * alertObj.getBillId(), style); createCell(row, columnCount++,
			 * alertObj.getInitSolId(), style); createCell(row, columnCount++,
			 * alertObj.getFinacleUserId(), style); createCell(row, columnCount++,
			 * alertObj.getDeviceId(), style); createCell(row, columnCount++,
			 * alertObj.getLoginLogTime(), style); createCell(row, columnCount++,
			 * alertObj.getPosition(), style); createCell(row, columnCount++,
			 * alertObj.getLocation(), style); createCell(row, columnCount++,
			 * alertObj.getCommentDate(), style); createCell(row, columnCount++,
			 * alertObj.getAlertComment(), style); createCell(row, columnCount++,
			 * alertObj.getCompliedByDate(), style); createCell(row, columnCount++,
			 * alertObj.getMakerName(), style); createCell(row, columnCount++,
			 * alertObj.getCheckerName(), style);
			 */

			

		}
	}

	private void createCell(XSSFRow row, int columnCount, Object value, XSSFCellStyle style) {
		sheet.autoSizeColumn(columnCount);
		XSSFCell cell = row.createCell(columnCount);
		if (value instanceof Integer) {
			cell.setCellValue((Integer) value);
		} else if (value instanceof Boolean) {
			cell.setCellValue((Boolean) value);
		} else {
			cell.setCellValue((String) value);
		}
		cell.setCellStyle(style);
	}
	
}
