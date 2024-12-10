package com.idbi.intech.erm.util;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
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
import com.idbi.intech.erm.domain.app.NotificationDto;
import com.idbi.intech.erm.domain.app.UserDto;

public class KeyRiskIndicatorReportExport {

	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	UserDto userDto = new UserDto();
	private NotificationDto notificationDto;

	public KeyRiskIndicatorReportExport(NotificationDto notificationDto)
			throws JsonMappingException, JsonProcessingException {

		this.notificationDto = notificationDto;

		workbook = new XSSFWorkbook();
	}

	// this method is for common header with User Details
	private void writeCommonHeaderLine(UserDto userDto) {
		try {
			sheet = workbook.createSheet("KRI Report");

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
			cell.setCellValue(userDto.getUsername());
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
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 7, 8));

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
			cell.setCellValue("Report Extracted for Department");
			cell.setCellStyle(cellStyle);
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 5, 6));
			cell = row.createCell(7);
			cell.setCellValue(userDto.getUserDeptName());
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 7, 8));

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

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 2));
		createCell(row, 0, "Pending", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 3, 5));
		createCell(row, 3, "Captured", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 6, 8));
		createCell(row, 6, "Pending For Verification", style);

		int numMerged = sheet.getNumMergedRegions();

		for (int i = 0; i < numMerged; i++) {
			CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
			RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
		}

	}

	private void writeHeaderLine2() {
		Row row = sheet.createRow(11);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontName("Times New Roman");
		font.setFontHeight(14);
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

		sheet.addMergedRegion(new CellRangeAddress(11, 11, 0, 1));
		createCell(row, 0, "Module Id", style);

		sheet.addMergedRegion(new CellRangeAddress(11, 11, 2, 3));
		createCell(row, 2, "Department Name", style);

		sheet.addMergedRegion(new CellRangeAddress(11, 11, 4, 5));
		createCell(row, 4, "KRI Value Description", style);

		createCell(row, 6, "Status", style);

		sheet.addMergedRegion(new CellRangeAddress(11, 11, 7, 8));
		createCell(row, 7, "Office Code", style);

		int numMerged = sheet.getNumMergedRegions();

		for (int i = 0; i < numMerged; i++) {
			CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
			RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
		}

	}

	private void writeDataLines2() {
		int rowCount = 12;

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
		List<NotificationDto> ntfDtoList=new ArrayList<>();
	  notificationDto.getNtfDtoList().stream().sorted((data1,data2)->data1.getDeptName().compareTo(data2.getDeptName())).forEach(ntfDtoList::add);

		for (NotificationDto notificationDto : ntfDtoList) {
			
			Row row = sheet.createRow(rowCount);
			int columnCount = 0;
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 0, 1));
			createCell(row, columnCount, notificationDto.getNtfModuleId(), style);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 2, 3));
			createCell(row, 2 + columnCount, notificationDto.getDeptName(), style1);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 4, 5));
			createCell(row, 4 + columnCount, notificationDto.getNtfModuleDesc(), style2);

			createCell(row, 6 + columnCount, notificationDto.getNtfValue(), style2);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 7, 8));
			createCell(row, 7 + columnCount, notificationDto.getOfcCode(), style2);

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
		
		List<Integer> test=null;
		Map<String,Integer> count = new HashMap<String,Integer>();
		count.putAll(notificationDto.getStatusCount());
		

		Row row = sheet.createRow(rowCount);
		int columnCount = 0;
		sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 0, 2));
		createCell(row, columnCount, count.get("p"), style);

		sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 3, 5));
		createCell(row, 3 + columnCount, count.get("c"), style1);

		sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 6, 8));
		createCell(row, 6 + columnCount, count.get("v"), style2);

		rowCount++;

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

	public void exportKriReport(HttpServletResponse response, UserDto userDto) throws IOException {

		this.userDto = userDto;

		try {
			writeCommonHeaderLine(userDto);
			writeHeaderLine();
			writeDataLines();

			writeHeaderLine2();
			writeDataLines2();

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
