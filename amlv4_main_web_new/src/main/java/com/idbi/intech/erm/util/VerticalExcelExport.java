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
import com.idbi.intech.oms.domain.app.OmsAuditDto;
import com.idbi.intech.oms.domain.app.VerticalExcelExportDto;

public class VerticalExcelExport {

	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	OmsAlertMasterDto alertDto;
	UserDto userDto = new UserDto();

	public VerticalExcelExport(OmsAlertMasterDto alertDto) {
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
			sheet = workbook.createSheet("Rule Priority Report");

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
			cell2.setCellValue("RULE PRIORITY REPORT");
			cell2.setCellStyle(styleData);
			XSSFCell cell3 = row.createCell(4);
			cell3.setCellValue("User Name");
			cell3.setCellStyle(style);
			XSSFCell cell4 = row.createCell(5);
			cell4.setCellValue(userDto.getUsername().toUpperCase());
			cell4.setCellStyle(styleData);
			// Row 1
			/*
			 * XSSFRow row1 = sheet.createRow(6); XSSFCell cell5 = row1.createCell(0);
			 * cell5.setCellValue("Report Date"); sheet.addMergedRegion(new
			 * CellRangeAddress(6, 6, 0, 1)); cell5.setCellStyle(style);
			 */

			XSSFRow row1 = sheet.createRow(6);
			XSSFCell cell9 = row1.createCell(0);
			cell9.setCellValue("Report Extraction Date");
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell9.setCellStyle(style);
			XSSFCell cell10 = row1.createCell(2);
			DateFormat outputFormatter1 = new SimpleDateFormat("dd/MM/yyyy hh.mm aa");
			String todaysDate = outputFormatter1.format(new Date());

			cell10.setCellValue(todaysDate.toUpperCase());
			cell10.setCellStyle(styleData);

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
			/*
			 * XSSFRow row2 = sheet.createRow(7); XSSFCell cell9 = row2.createCell(0);
			 * cell9.setCellValue("Report Extraction Date"); sheet.addMergedRegion(new
			 * CellRangeAddress(7, 7, 0, 1)); cell9.setCellStyle(style); XSSFCell cell10 =
			 * row2.createCell(2); DateFormat outputFormatter1 = new
			 * SimpleDateFormat("dd/MM/yyyy hh.mm aa"); String todaysDate =
			 * outputFormatter1.format(new Date());
			 */

			cell10.setCellValue(todaysDate.toUpperCase());
			cell10.setCellStyle(styleData);

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

		// Sheet for Merged Header
		XSSFRow rowH = sheet.createRow(13);
		XSSFCellStyle styleH = workbook.createCellStyle();
		XSSFFont fontH = workbook.createFont();
		fontH.setBold(true);
		fontH.setFontName("Times New Roman");
		fontH.setFontHeight(14);
		styleH.setFont(fontH);
		styleH.setBorderBottom(BorderStyle.THIN);
		styleH.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styleH.setBorderRight(BorderStyle.THIN);
		styleH.setBorderBottom(BorderStyle.THIN);
		styleH.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styleH.setRightBorderColor(IndexedColors.BLACK.getIndex());
		styleH.setBorderLeft(BorderStyle.THIN);
		styleH.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		styleH.setBorderTop(BorderStyle.THIN);
		styleH.setTopBorderColor(IndexedColors.BLACK.getIndex());
		//styleH.setWrapText(true);
		
		
		XSSFCellStyle styleR = workbook.createCellStyle();
		XSSFFont fontR = workbook.createFont();
		fontR.setBold(true);
		fontR.setFontName("Times New Roman");
		fontR.setFontHeight(14);
		fontR.setColor(IndexedColors.BLACK.getIndex());
		styleR.setFont(fontR);
		styleR.setBorderBottom(BorderStyle.THIN);
		styleR.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styleR.setBorderRight(BorderStyle.THIN);
		styleR.setRightBorderColor(IndexedColors.BLACK.getIndex());
		styleR.setBorderLeft(BorderStyle.THIN);
		styleR.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		styleR.setBorderTop(BorderStyle.THIN);
		styleR.setTopBorderColor(IndexedColors.BLACK.getIndex());
		styleR.setWrapText(true);

		XSSFCell cellH = rowH.createCell(0);
		cellH.setCellValue("Vertical");
		sheet.addMergedRegion(new CellRangeAddress(13, 14, 0, 0));
		cellH.setCellStyle(styleR);

		XSSFCell cell2 = rowH.createCell(1);
		cell2.setCellValue("Open");
		sheet.addMergedRegion(new CellRangeAddress(13, 13, 1, 3));
		cell2.setCellStyle(styleR);

		XSSFCell cell3 = rowH.createCell(4);
		cell3.setCellValue("Verification");
		sheet.addMergedRegion(new CellRangeAddress(13, 14, 4, 4));
		cell3.setCellStyle(styleH);

		XSSFCell cell4 = rowH.createCell(5);
		cell4.setCellValue("Close");
		sheet.addMergedRegion(new CellRangeAddress(13, 14, 5, 5));
		cell4.setCellStyle(styleH);

		int numMerged = sheet.getNumMergedRegions();

		for (int i = 0; i < numMerged; i++) {
			CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
			RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
		}

		XSSFRow row = sheet.createRow(14);

		XSSFCellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontName("Times New Roman");
		font.setFontHeight(14);
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

		createCell(row, 1, " < 30 Days ", style);
		createCell(row, 2, " >= 30 & <= 45 Days ", style);
		createCell(row, 3, " > 45 Days ", style);
		

	}

	
	// this method is to write data to excel
				private void writeDataLines() { 
					
					// Open _Red Color 
							XSSFCellStyle styleR = workbook.createCellStyle();
							XSSFFont fontR = workbook.createFont();
							fontR.setBold(true);
							fontR.setFontName("Times New Roman");
							fontR.setFontHeight(14);
							fontR.setColor(IndexedColors.BLACK.getIndex());
							styleR.setFont(fontR);
							styleR.setBorderBottom(BorderStyle.THIN);
							styleR.setBottomBorderColor(IndexedColors.BLACK.getIndex());
							styleR.setBorderRight(BorderStyle.THIN);
							styleR.setRightBorderColor(IndexedColors.BLACK.getIndex());
							styleR.setBorderLeft(BorderStyle.THIN);
							styleR.setLeftBorderColor(IndexedColors.BLACK.getIndex());
							styleR.setBorderTop(BorderStyle.THIN);
							styleR.setTopBorderColor(IndexedColors.BLACK.getIndex());
							
							
							// Open _Orange Color 
							/*
							 * XSSFCellStyle styleY = workbook.createCellStyle(); XSSFFont fontY =
							 * workbook.createFont(); fontY.setBold(true);
							 * fontY.setFontName("Times New Roman"); fontY.setFontHeight(14);
							 * fontY.setColor(IndexedColors.ORANGE.getIndex()); styleY.setFont(fontY);
							 * styleY.setBorderBottom(BorderStyle.THIN);
							 * styleY.setBottomBorderColor(IndexedColors.BLACK.getIndex());
							 * styleY.setBorderRight(BorderStyle.THIN);
							 * styleY.setRightBorderColor(IndexedColors.BLACK.getIndex());
							 * styleY.setBorderLeft(BorderStyle.THIN);
							 * styleY.setLeftBorderColor(IndexedColors.BLACK.getIndex());
							 * styleY.setBorderTop(BorderStyle.THIN);
							 * styleY.setTopBorderColor(IndexedColors.BLACK.getIndex());
							 * 
							 * 
							 * // Open _Green Color XSSFCellStyle styleG = workbook.createCellStyle();
							 * XSSFFont fontG = workbook.createFont(); fontG.setBold(true);
							 * fontG.setFontName("Times New Roman"); fontG.setFontHeight(14);
							 * fontG.setColor(IndexedColors.GREEN.getIndex()); styleG.setFont(fontG);
							 * styleG.setBorderBottom(BorderStyle.THIN);
							 * styleG.setBottomBorderColor(IndexedColors.BLACK.getIndex());
							 * styleG.setBorderRight(BorderStyle.THIN);
							 * styleG.setRightBorderColor(IndexedColors.BLACK.getIndex());
							 * styleG.setBorderLeft(BorderStyle.THIN);
							 * styleG.setLeftBorderColor(IndexedColors.BLACK.getIndex());
							 * styleG.setBorderTop(BorderStyle.THIN);
							 * styleG.setTopBorderColor(IndexedColors.BLACK.getIndex());
							 * 
							 * // Open Blue Color XSSFCellStyle styleB = workbook.createCellStyle();
							 * XSSFFont fontB = workbook.createFont(); fontB.setBold(true);
							 * fontB.setFontName("Times New Roman"); fontB.setFontHeight(14);
							 * fontB.setColor(IndexedColors.BLUE.getIndex()); styleB.setFont(fontB);
							 * styleB.setBorderBottom(BorderStyle.THIN);
							 * styleB.setBottomBorderColor(IndexedColors.BLACK.getIndex());
							 * styleB.setBorderRight(BorderStyle.THIN);
							 * styleB.setRightBorderColor(IndexedColors.BLACK.getIndex());
							 * styleB.setBorderLeft(BorderStyle.THIN);
							 * styleB.setLeftBorderColor(IndexedColors.BLACK.getIndex());
							 * styleB.setBorderTop(BorderStyle.THIN);
							 * styleB.setTopBorderColor(IndexedColors.BLACK.getIndex());
							 */	
									
									
					
					int rowCount = 15;
					  
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
					  //int srNo = 1; 
					  for (VerticalExcelExportDto alertObj : alertDto.getVerticalExportDto()) {
						  XSSFRow row = sheet.createRow(rowCount++); 
						  int columnCount = 0;
					  
					 // createCell(row, columnCount++, srNo, style);
					  createCell(row, columnCount++, alertObj.getVertical(), styleR); 
					  createCell(row, columnCount++, alertObj.getL30days(), styleR); 
					  createCell(row, columnCount++, alertObj.getG30l45days(), styleR);
					  createCell(row, columnCount++, alertObj.getG45days(), styleR); 
					  createCell(row, columnCount++, alertObj.getVerification(), styleR); 
					  createCell(row, columnCount++, alertObj.getClose(), styleR);
					  
					  
					  //srNo++;
					  
					  } }
	
	
	
	
	
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
