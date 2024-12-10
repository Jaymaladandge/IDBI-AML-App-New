package com.idbi.intech.aml.util;

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

import com.idbi.intech.aml.domain.app.RegulatoryStatusReportDto;

public class RegulatoryStatusReportExport {
	
	XSSFWorkbook workbook;
	XSSFSheet sheet;

	// this method is for common header with User Details
	private void writeCommonHeaderLine(RegulatoryStatusReportDto stateWiseExportDto) {
		try {
			sheet = workbook.createSheet("Regulatory Status Report");
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
			cell.setCellValue("Regulatory Status Report");
			cell.setCellStyle(styleNew);
			sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 3));

			row = sheet.createRow(5);
			cell = row.createCell(0);
			cell.setCellValue("User name");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue(stateWiseExportDto.getUsername());
			cell.setCellStyle(styleNew);
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 2, 3));

			row = sheet.createRow(6);
			cell = row.createCell(0);
			cell.setCellValue("Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 1));
			cell = row.createCell(2);
			cell.setCellValue("AML CELL");
			cell.setCellStyle(styleNew);
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
			cell.setCellStyle(styleNew);
			sheet.addMergedRegion(new CellRangeAddress(7, 7, 2, 3));

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
			
			XSSFCell cellBranch = headerRow.createCell(1);
			cellBranch.setCellStyle(style);
			cellBranch.setCellValue("ACCOUNT NO");
			
			XSSFCell cellRegion = headerRow.createCell(2);
			cellRegion.setCellStyle(style);
			cellRegion.setCellValue("CTR COUNT");

			XSSFCell cellCust = headerRow.createCell(3);
			cellCust.setCellValue("NTR COUNT");
			cellCust.setCellStyle(style);
			
			XSSFCell cellAlert = headerRow.createCell(4);
			cellAlert.setCellValue("CBWTR COUNT");
			cellAlert.setCellStyle(style);

			XSSFCell cell2 = headerRow.createCell(5);
			cell2.setCellValue("STR REQUESTED");
			cell2.setCellStyle(style);

			XSSFCell cell3 = headerRow.createCell(6);
			cell3.setCellValue("STR REQUEST ID");
			cell3.setCellStyle(style);

			XSSFCell cell4 = headerRow.createCell(7);
			cell4.setCellValue("STR STATUS");
			cell4.setCellStyle(style);
			
			XSSFCell cell6 = headerRow.createCell(8);
			cell6.setCellValue("STR FINNET NUMBER");
			cell6.setCellStyle(style);


		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void writeDataLines(RegulatoryStatusReportDto activityDto) {

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

			//System.out.println("activityDto.getFinalList(): "+activityDto.getFinalList());
			
			for (RegulatoryStatusReportDto activityDtoItr : activityDto.getFinalList()) {
				
				currentRow = sheet.createRow(rowCount);

					Cell branchCell = currentRow.createCell(0);
					branchCell.setCellValue(activityDtoItr.getCustomerId());
					branchCell.setCellStyle(style);
					
					Cell cellName = currentRow.createCell(1);
					cellName.setCellValue(activityDtoItr.getAccountNo());
					cellName.setCellStyle(style);
					
					Cell cellRegion = currentRow.createCell(2);
					cellRegion.setCellValue(activityDtoItr.getCtr());
					cellRegion.setCellStyle(style);
					
					Cell custCell = currentRow.createCell(3);
					custCell.setCellValue(activityDtoItr.getNtr());
					custCell.setCellStyle(style);
					
					Cell custAlert = currentRow.createCell(4);
					custAlert.setCellValue(activityDtoItr.getCbwtr());
					custAlert.setCellStyle(style);

					Cell accountNoCell = currentRow.createCell(5);
					accountNoCell.setCellValue(activityDtoItr.getStrRequested());
					accountNoCell.setCellStyle(style);

					Cell userNameCell = currentRow.createCell(6);
					userNameCell.setCellValue(activityDtoItr.getStrRequestId());
					userNameCell.setCellStyle(style);
					
					Cell strRequested = currentRow.createCell(7);
					strRequested.setCellValue(activityDtoItr.getStrStatus());
					strRequested.setCellStyle(style);
					
					Cell strFinNo = currentRow.createCell(8);
					strFinNo.setCellValue(activityDtoItr.getStrFinNo());
					strFinNo.setCellStyle(style);

					rowCount++;
				
				}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	public void regStatusReportExport(HttpServletResponse response, RegulatoryStatusReportDto activityDto) throws IOException {

		try {
			
			 
			  workbook = new XSSFWorkbook(); 
			  
			  writeCommonHeaderLine(activityDto); 
			 
			  writeHeaderLine();
			  
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
