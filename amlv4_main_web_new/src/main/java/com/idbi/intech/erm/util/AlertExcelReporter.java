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
import com.idbi.intech.oms.domain.app.OmsAlertMasterDto;

public class AlertExcelReporter {

	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	OmsAlertMasterDto alertDto;
	UserDto userDto = new UserDto();

	public AlertExcelReporter(OmsAlertMasterDto alertDto) {
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
			cell2.setCellValue("ALERT COUNT STATUS REPORT");
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

			String sDate = "19/07/2022";
			String eDate = "19/07/2022";

			XSSFCell cell6 = row1.createCell(2);
			cell6.setCellValue(alertDto.getStartDate() + " To " + alertDto.getEndDate());
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

	// this method is for header
	private void writeHeaderLine() {
		// sheet = workbook.createSheet("Incident Type Count Report");

		/*
		 * XSSFRow row = sheet.createRow(13);
		 * 
		 * XSSFCellStyle style = workbook.createCellStyle(); XSSFFont font =
		 * workbook.createFont(); font.setBold(true);
		 * font.setFontName("Times New Roman"); font.setFontHeight(14);
		 * style.setFont(font); style.setBorderBottom(BorderStyle.THIN);
		 * style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		 * style.setBorderRight(BorderStyle.THIN);
		 * style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		 * style.setBorderLeft(BorderStyle.THIN);
		 * style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		 * style.setBorderTop(BorderStyle.THIN);
		 * style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		 */




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
		cell1.setCellValue("Branch Id");
		cell1.setCellStyle(style);

		XSSFCell cell2 = headerRow.createCell(2);
		cell2.setCellValue("Branch Name");
		cell2.setCellStyle(style);

		XSSFCell cell3 = headerRow.createCell(3);
		cell3.setCellValue("Rule");
		cell3.setCellStyle(style);

		XSSFCell cell4 = headerRow.createCell(4);
		cell4.setCellValue("Rule Description");
		cell4.setCellStyle(style);

		XSSFCell cell5 = headerRow.createCell(5);
		cell5.setCellValue("Rule Category");
		cell5.setCellStyle(style);

		XSSFCell cell6 = headerRow.createCell(6);
		cell6.setCellValue("Risk Severity");
		cell6.setCellStyle(style);

		XSSFCell cell7 = headerRow.createCell(7);
		cell7.setCellValue("Frequency");
		cell7.setCellStyle(style);

		XSSFCell cell8 = headerRow.createCell(8);
		cell8.setCellValue("Total Count");
		cell8.setCellStyle(style);

		XSSFCell cell9 = headerRow.createCell(9);
		cell9.setCellValue("Open Count");
		cell9.setCellStyle(style);

		XSSFCell cell10 = headerRow.createCell(10);
		cell10.setCellValue("Close Count");
		cell10.setCellStyle(style);


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
		for (String alertObj : alertDto.getAlertReportRulewiseList()) {
			XSSFRow row = sheet.createRow(rowCount++);
			int columnCount = 0;



			XSSFCell cell = row.createCell(columnCount++);
			cell.setCellStyle(style);
			cell.setCellValue(srNo);

			XSSFCell cell1 = row.createCell(columnCount++);
			cell1.setCellStyle(style);
			cell1.setCellValue(Integer.parseInt(alertObj.split("~")[0]));

			XSSFCell cell2 = row.createCell(columnCount++);
			cell2.setCellStyle(style);
			cell2.setCellValue(alertObj.split("~")[1]);

			XSSFCell cell3 = row.createCell(columnCount++);
			cell3.setCellStyle(style);
			cell3.setCellValue(alertObj.split("~")[2]);

			XSSFCell cell4 = row.createCell(columnCount++);
			cell4.setCellStyle(style);
			cell4.setCellValue(alertObj.split("~")[3]);

			XSSFCell cell5 = row.createCell(columnCount++);
			cell5.setCellStyle(style);
			cell5.setCellValue(alertObj.split("~")[7]);

			XSSFCell cell6 = row.createCell(columnCount++);
			cell6.setCellStyle(style);
			cell6.setCellValue(alertObj.split("~")[8]);

			XSSFCell cell7 = row.createCell(columnCount++);
			cell7.setCellStyle(style);
			cell7.setCellValue(alertObj.split("~")[9]);

			XSSFCell cell8 = row.createCell(columnCount++);
			cell8.setCellStyle(style);
			cell8.setCellValue(Integer.parseInt(alertObj.split("~")[4]));

			XSSFCell cell9 = row.createCell(columnCount++);
			cell9.setCellStyle(style);
			cell9.setCellValue(Integer.parseInt(alertObj.split("~")[5]));

			XSSFCell cell10 = row.createCell(columnCount++);
			cell10.setCellStyle(style);
			cell10.setCellValue(Integer.parseInt(alertObj.split("~")[6]));

			srNo++;

			/*
			 * createCell(row, columnCount++, , style); createCell(row, columnCount++, ,
			 * style); createCell(row, columnCount++, , styleName); createCell(row,
			 * columnCount++, , style); createCell(row, columnCount++, , style);
			 * createCell(row, columnCount++, , style); createCell(row, columnCount++, ,
			 * style); createCell(row, columnCount++, , style); createCell(row,
			 * columnCount++, , style); createCell(row, columnCount++, , style);
			 * createCell(row, columnCount++, , style);
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
