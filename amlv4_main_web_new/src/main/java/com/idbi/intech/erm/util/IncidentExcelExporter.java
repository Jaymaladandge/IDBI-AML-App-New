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
import org.apache.poi.ss.usermodel.HorizontalAlignment;
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

import com.idbi.intech.erm.domain.app.IncidentDto;
import com.idbi.intech.erm.domain.app.IncidentReportDto;
import com.idbi.intech.erm.domain.app.NotificationDto;
import com.idbi.intech.erm.domain.app.UserDto;

public class IncidentExcelExporter {

	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	IncidentDto incidentDto;
	UserDto userDto = new UserDto();

	public IncidentExcelExporter(IncidentDto incidentDto) {
		this.incidentDto = incidentDto;
		workbook = new XSSFWorkbook();
	}

	
	
	// this method is for header
	private void writeHeaderLine() {
		// sheet = workbook.createSheet("Incident Type Count Report");

		XSSFRow row = sheet.createRow(13);

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
		style.setWrapText(true);
		createCell(row, 0, "Sr No.", style);
		createCell(row, 1, "Incident ID", style);
		createCell(row, 2, "Incident Name", style);
		createCell(row, 3, "Department", style);
		createCell(row, 4, "Office Code", style);
		createCell(row, 5, "Office Zone", style);
		createCell(row, 6, "Date", style);
		createCell(row, 7, "Recovery Status", style);

	}

	// this method is for common header with User Details
	private void writeCommonHeaderLine(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Incident Type Count Report");

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
			anchor.setCol2(2); // Column C
			anchor.setRow2(2); // Row 4

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
			cell2.setCellValue(userDto.getSearchParam());
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
			// start date and end date formatting
			Date date1 = incidentDto.getStartDate();
			Date date2 = incidentDto.getEndDate();
			DateFormat outputFormatter = new SimpleDateFormat("dd/MM/yyyy");
			String sDate = outputFormatter.format(date1);
			String eDate = outputFormatter.format(date2);
			XSSFCell cell6 = row1.createCell(2);
			cell6.setCellValue(sDate + " To " + eDate);
			cell6.setCellStyle(styleData);
			XSSFCell cell7 = row1.createCell(4);
			cell7.setCellValue("User Department");
			cell7.setCellStyle(style);
			XSSFCell cell8 = row1.createCell(5);
			cell8.setCellValue(userDto.getUserDeptName().toUpperCase());
			cell8.setCellStyle(styleData);
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
			XSSFCell cell11 = row2.createCell(4);
			cell11.setCellValue("User Office");
			cell11.setCellStyle(style);
			XSSFCell cell12 = row2.createCell(5);
			cell12.setCellValue(userDto.getUserOfficeType().toUpperCase());
			cell12.setCellStyle(styleData);
			// Row 3
			XSSFRow row3 = sheet.createRow(8);
			XSSFCell cell15 = row3.createCell(0);
			cell15.setCellValue("Report Extracted for Department");
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell15.setCellStyle(style);
			XSSFCell cell16 = row3.createCell(2);
			cell16.setCellValue(incidentDto.getDepartment().toUpperCase());
			cell16.setCellStyle(styleData);

			// Row 4
			XSSFRow row4 = sheet.createRow(9);
			XSSFCell cell17 = row4.createCell(0);
			cell17.setCellValue("Report Extracted for Office");
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
			cell17.setCellStyle(style);
			XSSFCell cell18 = row4.createCell(2);
			cell18.setCellValue(incidentDto.getSelectedOfcType());
			cell18.setCellStyle(styleData);

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
		for (IncidentDto incidentDto : incidentDto.getIncidentList()) {
			XSSFRow row = sheet.createRow(rowCount++);
			int columnCount = 0;

			createCell(row, columnCount++, srNo, style);
			createCell(row, columnCount++, incidentDto.getIncidentId(), style);
			createCell(row, columnCount++, incidentDto.getIncidentName(), styleName);
			createCell(row, columnCount++, incidentDto.getDepartment(), style);
			createCell(row, columnCount++, incidentDto.getOfficeCode(), style);
			createCell(row, columnCount++, incidentDto.getOfficeZone(), style);
			createCell(row, columnCount++, incidentDto.getIncidentRecordDate(), style);
			createCell(row, columnCount++, incidentDto.getRecoveryStatus(), style);
			srNo++;

		}
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

	/* Detailed Incident Report */

	public void exportIncidentDetailedReport(HttpServletResponse response, UserDto userDto) throws IOException {

		this.userDto = userDto;
		try {
			writeHeaderLineDetailedIncident(userDto);
			writeHeaderLineDetailedIncident();
			writeDataLinesDetailedIncident();

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			System.out.println(e);
		}
	}

	// this method is for header with User Details
	private void writeHeaderLineDetailedIncident(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Incident Type Count Report");

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
			anchor.setCol2(2); // Column C
			anchor.setRow2(2); // Row 4

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
			cell2.setCellValue(userDto.getSearchParam());
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
			// start date and end date formatting
			Date date1 = incidentDto.getStartDate();
			Date date2 = incidentDto.getEndDate();
			DateFormat outputFormatter = new SimpleDateFormat("dd/MM/yyyy");
			String sDate = outputFormatter.format(date1);
			String eDate = outputFormatter.format(date2);
			XSSFCell cell6 = row1.createCell(2);
			cell6.setCellValue(sDate + " To " + eDate);
			cell6.setCellStyle(styleData);
			XSSFCell cell7 = row1.createCell(4);
			cell7.setCellValue("User Department");
			cell7.setCellStyle(style);
			XSSFCell cell8 = row1.createCell(5);
			cell8.setCellValue(userDto.getUserDeptName().toUpperCase());
			cell8.setCellStyle(styleData);
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
			XSSFCell cell11 = row2.createCell(4);
			cell11.setCellValue("User Office");
			cell11.setCellStyle(style);
			XSSFCell cell12 = row2.createCell(5);
			cell12.setCellValue(userDto.getUserOfficeType().toUpperCase());
			cell12.setCellStyle(styleData);
			// Row 3
			XSSFRow row3 = sheet.createRow(8);
			XSSFCell cell15 = row3.createCell(0);
			cell15.setCellValue("Report Extracted for Office");
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell15.setCellStyle(style);
			XSSFCell cell16 = row3.createCell(2);
			cell16.setCellValue(incidentDto.getUserOfc());
			cell16.setCellStyle(styleData);

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
	private void writeHeaderLineDetailedIncident() {
		// sheet = workbook.createSheet("Incident Type Count Report");

		XSSFRow row = sheet.createRow(13);

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
		style.setWrapText(true);
		createCell(row, 0, "Sr No.", style);
		createCell(row, 1, "Incident ID", style);
		createCell(row, 2, "Incident Name", style);
		createCell(row, 3, "Department", style);
		createCell(row, 4, "Incident Status", style);
		createCell(row, 5, "Office Code", style);
		createCell(row, 6, "Incident Report Date", style);

	}

	// this method is to write data to excel
	private void writeDataLinesDetailedIncident() {
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
		for (IncidentDto incidentDto : incidentDto.getIncidentList()) {
			XSSFRow row = sheet.createRow(rowCount++);
			int columnCount = 0;

			createCell(row, columnCount++, srNo, style);
			createCell(row, columnCount++, incidentDto.getIncidentId(), style);
			createCell(row, columnCount++, incidentDto.getIncidentName(), styleName);
			createCell(row, columnCount++, incidentDto.getDepartment(), style);
			createCell(row, columnCount++, incidentDto.getIncidentStatus(), style);
			createCell(row, columnCount++, incidentDto.getOfficeCode(), style);
			createCell(row, columnCount++, incidentDto.getIncidentRecordDate(), style);

			srNo++;

		}
	}
	/* Detailed Incident Report */

	/* Category Wise Incident Report */
	public void exportIncidentCategoryWiseReport(HttpServletResponse response, UserDto userDto) throws IOException {

		this.userDto = userDto;
		try {
			writeHeaderLineDetailedIncidentCategoryWise(userDto);
			writeHeaderLineDetailedIncidentCategoryWise();
			writeDataLinesDetailedIncidentCategoryWise();

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			System.out.println(e);
		}
	}

	// this method is for header with User Details
	private void writeHeaderLineDetailedIncidentCategoryWise(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Incident Type Count Report");

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
			anchor.setCol2(2); // Column C
			anchor.setRow2(2); // Row 4

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
			cell2.setCellValue(userDto.getSearchParam());
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
			// start date and end date formatting
			Date date1 = incidentDto.getStartDate();
			Date date2 = incidentDto.getEndDate();
			DateFormat outputFormatter = new SimpleDateFormat("dd/MM/yyyy");
			String sDate = outputFormatter.format(date1);
			String eDate = outputFormatter.format(date2);
			XSSFCell cell6 = row1.createCell(2);
			cell6.setCellValue(sDate + " To " + eDate);
			cell6.setCellStyle(styleData);
			XSSFCell cell7 = row1.createCell(4);
			cell7.setCellValue("User Department");
			cell7.setCellStyle(style);
			XSSFCell cell8 = row1.createCell(5);
			cell8.setCellValue(userDto.getUserDeptName().toUpperCase());
			cell8.setCellStyle(styleData);
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
			XSSFCell cell11 = row2.createCell(4);
			cell11.setCellValue("User Office");
			cell11.setCellStyle(style);
			XSSFCell cell12 = row2.createCell(5);
			cell12.setCellValue(userDto.getUserOfficeType().toUpperCase());
			cell12.setCellStyle(styleData);
			// Row 3
			XSSFRow row3 = sheet.createRow(8);
			XSSFCell cell15 = row3.createCell(0);
			cell15.setCellValue("Report Extracted for Department");
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell15.setCellStyle(style);
			XSSFCell cell16 = row3.createCell(2);
			cell16.setCellValue(incidentDto.getDepartment().toUpperCase());
			cell16.setCellStyle(styleData);

			// Row 4
			XSSFRow row4 = sheet.createRow(9);
			XSSFCell cell17 = row4.createCell(0);
			cell17.setCellValue("Report Extracted for Office");
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
			cell17.setCellStyle(style);
			XSSFCell cell18 = row4.createCell(2);
			cell18.setCellValue(incidentDto.getSelectedOfcType());
			cell18.setCellStyle(styleData);

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
	private void writeHeaderLineDetailedIncidentCategoryWise() {
		// sheet = workbook.createSheet("Incident Type Count Report");

		XSSFRow row = sheet.createRow(13);

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
		style.setWrapText(true);
		createCell(row, 0, "Sr No.", style);
		createCell(row, 1, "Event Type Categories", style);
		createCell(row, 2, "No Of Incidents", style);
		createCell(row, 3, "Amount", style);

	}

	// this method is to write data to excel
	private void writeDataLinesDetailedIncidentCategoryWise() {
		int rowCount = 14;

		XSSFCellStyle style = workbook.createCellStyle();
		XSSFCellStyle style1 = workbook.createCellStyle();
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
		style1.setFont(font);
		style1.setBorderBottom(BorderStyle.THIN);
		style1.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style1.setBorderRight(BorderStyle.THIN);
		style1.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style1.setBorderLeft(BorderStyle.THIN);
		style1.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style1.setBorderTop(BorderStyle.THIN);
		style1.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style1.setAlignment(HorizontalAlignment.RIGHT);

		// style for incident Name
		XSSFCellStyle styleName = workbook.createCellStyle();
		XSSFFont fontNaming = workbook.createFont();
		fontNaming.setFontName("Times New Roman");
		fontNaming.setFontHeight(12);
		fontNaming.setBold(true);
		styleName.setFont(fontNaming);
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

		XSSFRow row = sheet.createRow(rowCount);
		int columnCount = 0;

		createCell(row, 0, 1, style);
		createCell(row, 1, incidentDto.getInternalFraudCountAndAmount().split("~")[0], style);
		createCell(row, 2, incidentDto.getInternalFraudCountAndAmount().split("~")[1], style1);
		createCell(row, 3, incidentDto.getInternalFraudCountAndAmount().split("~")[2], style1);

		XSSFRow row1 = sheet.createRow(15);
		createCell(row1, 0, 2, style);
		createCell(row1, 1, incidentDto.getExternalFraudCountAndAmount().split("~")[0], style);
		createCell(row1, 2, incidentDto.getExternalFraudCountAndAmount().split("~")[1], style1);
		createCell(row1, 3, incidentDto.getExternalFraudCountAndAmount().split("~")[2], style1);

		XSSFRow row2 = sheet.createRow(16);
		createCell(row2, 0, 3, style);
		createCell(row2, 1, incidentDto.getEmpAndWorkCountAndAmount().split("~")[0], style);
		createCell(row2, 2, incidentDto.getEmpAndWorkCountAndAmount().split("~")[1], style1);
		createCell(row2, 3, incidentDto.getEmpAndWorkCountAndAmount().split("~")[2], style1);

		XSSFRow row3 = sheet.createRow(17);
		createCell(row3, 0, 4, style);
		createCell(row3, 1, incidentDto.getClientProductBusinessPractiseCountAndAmount().split("~")[0], style);
		createCell(row3, 2, incidentDto.getClientProductBusinessPractiseCountAndAmount().split("~")[1], style1);
		createCell(row3, 3, incidentDto.getClientProductBusinessPractiseCountAndAmount().split("~")[2], style1);

		XSSFRow row4 = sheet.createRow(18);
		createCell(row4, 0, 5, style);
		createCell(row4, 1, incidentDto.getDamageToPhyAssetsCountAndAmount().split("~")[0], style);
		createCell(row4, 2, incidentDto.getDamageToPhyAssetsCountAndAmount().split("~")[1], style1);
		createCell(row4, 3, incidentDto.getDamageToPhyAssetsCountAndAmount().split("~")[2], style1);

		XSSFRow row5 = sheet.createRow(19);
		createCell(row5, 0, 6, style);
		createCell(row5, 1, incidentDto.getBusinessDisSysFailure().split("~")[0], style);
		createCell(row5, 2, incidentDto.getBusinessDisSysFailure().split("~")[1], style1);
		createCell(row5, 3, incidentDto.getBusinessDisSysFailure().split("~")[2], style1);

		XSSFRow row6 = sheet.createRow(20);
		createCell(row6, 0, 7, style);
		createCell(row6, 1, incidentDto.getExeDelAndPm().split("~")[0], style);
		createCell(row6, 2, incidentDto.getExeDelAndPm().split("~")[1], style1);
		createCell(row6, 3, incidentDto.getExeDelAndPm().split("~")[2], style1);

		XSSFRow row7 = sheet.createRow(21);
		createCell(row7, 0, 8, style);
		createCell(row7, 1, incidentDto.getIntermediaryCountAndAmount().split("~")[0], style);
		createCell(row7, 2, incidentDto.getIntermediaryCountAndAmount().split("~")[1], style1);
		createCell(row7, 3, incidentDto.getIntermediaryCountAndAmount().split("~")[2], style1);

		XSSFRow row8 = sheet.createRow(22);
		createCell(row8, 0, 9, style);
		createCell(row8, 1, incidentDto.getPolicyCountAndAmount().split("~")[0], style);
		createCell(row8, 2, incidentDto.getPolicyCountAndAmount().split("~")[1], style1);
		createCell(row8, 3, incidentDto.getPolicyCountAndAmount().split("~")[2], style1);

		XSSFRow row9 = sheet.createRow(23);
		createCell(row9, 0, "", style);
		createCell(row9, 1, "Total", styleName);
		createCell(row9, 2, incidentDto.getCategoryTotal().split("~")[0], style1);
		createCell(row9, 3, incidentDto.getCategoryTotal().split("~")[1], style1);

	}

	/* Category Wise Incident Report */

	/* Branch Wise Incident Report */

	public void exportBranchWiseReport(HttpServletResponse response, UserDto userDto) throws IOException {

		this.userDto = userDto;
		try {
			writeCommonHeaderLineBranchWise(userDto);
			writeHeaderLineBranchWise();
			writeDataLinesBranchWise();

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			System.out.println(e);
		}
	}

	// this method is for common header with User Details
	private void writeCommonHeaderLineBranchWise(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Incident Branch Wise Report");

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
			anchor.setCol2(2); // Column C
			anchor.setRow2(2); // Row 4

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
			style.setWrapText(true);

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
			styleData.setWrapText(true);

			XSSFCell cell = row.createCell(0);
			cell.setCellValue("Report Name");
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 1));
			cell.setCellStyle(style);
			XSSFCell cell2 = row.createCell(2);
			cell2.setCellValue(userDto.getSearchParam());
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
			// start date and end date formatting
			Date date1 = incidentDto.getStartDate();
			Date date2 = incidentDto.getEndDate();
			DateFormat outputFormatter = new SimpleDateFormat("dd/MM/yyyy");
			String sDate = outputFormatter.format(date1);
			String eDate = outputFormatter.format(date2);
			XSSFCell cell6 = row1.createCell(2);
			cell6.setCellValue(sDate + " To " + eDate);
			cell6.setCellStyle(styleData);
			XSSFCell cell7 = row1.createCell(4);
			cell7.setCellValue("User Department");
			cell7.setCellStyle(style);
			XSSFCell cell8 = row1.createCell(5);
			cell8.setCellValue(userDto.getUserDeptName().toUpperCase());
			cell8.setCellStyle(styleData);
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

			XSSFCell cell11 = row2.createCell(4);
			cell11.setCellValue("User Office");
			cell11.setCellStyle(style);
			XSSFCell cell12 = row2.createCell(5);
			cell12.setCellValue(userDto.getUserOfficeType().toUpperCase());
			cell12.setCellStyle(styleData);
			// Row 3

			XSSFRow row4 = sheet.createRow(8);
			XSSFCell cell15 = row4.createCell(0);
			cell15.setCellValue("Report Extracted for Office");
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell15.setCellStyle(style);
			XSSFCell cell16 = row4.createCell(2);
			cell16.setCellValue(incidentDto.getSelectedOfcType());
			cell16.setCellStyle(styleData);

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
	private void writeHeaderLineBranchWise() {
		// sheet = workbook.createSheet("Incident Type Count Report");

		XSSFRow row = sheet.createRow(13);

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
		style.setWrapText(true);
		createCell(row, 0, "Sr No.", style);
		createCell(row, 1, "Region", style);
		createCell(row, 2, "Office Code", style);
		createCell(row, 3, "Previous Year", style);
		createCell(row, 4, "Current Year", style);
		createCell(row, 5, "Status", style);

	}

	// this method is to write data to excel
	private void writeDataLinesBranchWise() {
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
		styleName.setAlignment(HorizontalAlignment.RIGHT);
		// style.setWrapText(true);
		int srNo = 1;
		for (String incidentDto : incidentDto.getBranchCountWithYear()) {
			XSSFRow row = sheet.createRow(rowCount++);
			int columnCount = 0;

			createCell(row, columnCount++, srNo, style);
			createCell(row, columnCount++, incidentDto.split("~")[3], style);
			createCell(row, columnCount++, incidentDto.split("~")[0], style);
			createCell(row, columnCount++, incidentDto.split("~")[1], styleName);
			createCell(row, columnCount++, incidentDto.split("~")[2], styleName);
			createCell(row, columnCount++, incidentDto.split("~")[4], style);

			srNo++;

		}
	}

	/* Branch Wise Incident Report */

	/* Division Wise Incident Report */

	public void exportDivisionReport(HttpServletResponse response, UserDto userDto) throws IOException {

		this.userDto = userDto;
		try {
			writeCommonHeaderLineDivisionWise(userDto);
			writeHeaderLineDivisionWise();
			writeDataLinesDivisionWise();

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			System.out.println(e);
		}
	}

	// this method is for common header with User Details
	private void writeCommonHeaderLineDivisionWise(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Incident Division wise Report");

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
			anchor.setCol2(2); // Column C
			anchor.setRow2(2); // Row 4

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
			style.setWrapText(true);

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
			cell2.setCellValue(userDto.getSearchParam());
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
			// start date and end date formatting
			Date date1 = incidentDto.getStartDate();
			Date date2 = incidentDto.getEndDate();
			DateFormat outputFormatter = new SimpleDateFormat("dd/MM/yyyy");
			String sDate = outputFormatter.format(date1);
			String eDate = outputFormatter.format(date2);
			XSSFCell cell6 = row1.createCell(2);
			cell6.setCellValue(sDate + " To " + eDate);
			cell6.setCellStyle(styleData);
			XSSFCell cell7 = row1.createCell(4);
			cell7.setCellValue("User Department");
			cell7.setCellStyle(style);
			XSSFCell cell8 = row1.createCell(5);
			cell8.setCellValue(userDto.getUserDeptName().toUpperCase());
			cell8.setCellStyle(styleData);
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
			XSSFCell cell11 = row2.createCell(4);
			cell11.setCellValue("User Office");
			cell11.setCellStyle(style);
			XSSFCell cell12 = row2.createCell(5);
			cell12.setCellValue(userDto.getUserOfficeType().toUpperCase());
			cell12.setCellStyle(styleData);
			// Row 3
			XSSFRow row3 = sheet.createRow(8);
			XSSFCell cell15 = row3.createCell(0);
			cell15.setCellValue("Report Extracted for Department");
			sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
			cell15.setCellStyle(style);
			XSSFCell cell16 = row3.createCell(2);
			cell16.setCellValue(incidentDto.getDepartment().toUpperCase());
			cell16.setCellStyle(styleData);

			// Row 4
			XSSFRow row4 = sheet.createRow(9);
			XSSFCell cell17 = row4.createCell(0);
			cell17.setCellValue("Report Extracted for Office");
			sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
			cell17.setCellStyle(style);
			XSSFCell cell18 = row4.createCell(2);
			cell18.setCellValue(incidentDto.getOfcLoc());
			cell18.setCellStyle(styleData);

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
	private void writeHeaderLineDivisionWise() {
		// sheet = workbook.createSheet("Incident Type Count Report");

		XSSFRow row = sheet.createRow(13);

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
		style.setWrapText(true);
		createCell(row, 0, "Sr No.", style);
		createCell(row, 1, "Region", style);
		createCell(row, 2, "Office Code", style);
		createCell(row, 3, "No Of Incidents", style);
		createCell(row, 4, "Amount", style);

	}

	
	// this method is to write data to excel
	private void writeDataLinesDivisionWise() {
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
		styleName.setAlignment(HorizontalAlignment.RIGHT);
		// style.setWrapText(true);
		int srNo = 1;
		for (String incidentDto : incidentDto.getDivisionCountAndAmount()) {
			XSSFRow row = sheet.createRow(rowCount++);
			int columnCount = 0;

			  createCell(row, columnCount++, srNo, style);
			  createCell(row, columnCount++, incidentDto.split("~")[3], style);
			  createCell(row, columnCount++, incidentDto.split("~")[0], style);
			  createCell(row, columnCount++, incidentDto.split("~")[1], styleName);
			  createCell(row, columnCount++, incidentDto.split("~")[2], styleName);

			srNo++;

		}
	}		
	
	/* Division Wise Incident Report */
	
	
	/* Pending Status Incident Report */
	
	public void exportImPendingReport(HttpServletResponse response, UserDto userDto) throws IOException {

		this.userDto = userDto;
		try {
			writeCommonHeaderLinePendingStatusIM(userDto);
			writeHeaderLinePendingStatusIM();
			writeDataLinesPendingStatusIM();

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			System.out.println(e);
		}
	}
	
	
	// this method is for common header with User Details
		private void writeCommonHeaderLinePendingStatusIM(UserDto userDto) {
			try {
				sheet = workbook.createSheet("Incident Type Count Report");

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
				anchor.setCol2(2); // Column C
				anchor.setRow2(2); // Row 4

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
				cell2.setCellValue(userDto.getSearchParam());
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
				// start date and end date formatting
				Date date1 = incidentDto.getNotificationDto().getStartDate();
				Date date2 = incidentDto.getNotificationDto().getEndDate();
				DateFormat outputFormatter = new SimpleDateFormat("dd/MM/yyyy");
				String sDate = outputFormatter.format(date1);
				String eDate = outputFormatter.format(date2);
				XSSFCell cell6 = row1.createCell(2);
				cell6.setCellValue(sDate + " To " + eDate);
				cell6.setCellStyle(styleData);
				XSSFCell cell7 = row1.createCell(4);
				cell7.setCellValue("User Department");
				cell7.setCellStyle(style);
				XSSFCell cell8 = row1.createCell(5);
				cell8.setCellValue(userDto.getUserDeptName().toUpperCase());
				cell8.setCellStyle(styleData);
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
				XSSFCell cell11 = row2.createCell(4);
				cell11.setCellValue("User Office");
				cell11.setCellStyle(style);
				XSSFCell cell12 = row2.createCell(5);
				cell12.setCellValue(userDto.getUserOfficeType().toUpperCase());
				cell12.setCellStyle(styleData);
				// Row 3
				XSSFRow row3 = sheet.createRow(8);
				XSSFCell cell15 = row3.createCell(0);
				cell15.setCellValue("Report Extracted for Department");
				sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
				cell15.setCellStyle(style);
				XSSFCell cell16 = row3.createCell(2);
				cell16.setCellValue(incidentDto.getNotificationDto().getTargetDept().toUpperCase());
				cell16.setCellStyle(styleData);

				// Row 4
				XSSFRow row4 = sheet.createRow(9);
				XSSFCell cell17 = row4.createCell(0);
				cell17.setCellValue("Report Extracted for Office");
				sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
				cell17.setCellStyle(style);
				XSSFCell cell18 = row4.createCell(2);
				String ofcType="";
				if(incidentDto.getNotificationDto().getSearchParam().toUpperCase().equalsIgnoreCase("CO")) {
					ofcType = "CENTRAL OFFICE";
				}else if(incidentDto.getNotificationDto().getSearchParam().toUpperCase().equalsIgnoreCase("ZO")) {
					ofcType = "ZONAL OFFICE";
				} else if(incidentDto.getNotificationDto().getSearchParam().toUpperCase().equalsIgnoreCase("DO")) {
					ofcType = "DIVISIONAL OFFICE";
				} else if(incidentDto.getNotificationDto().getSearchParam().toUpperCase().equalsIgnoreCase("BO")) {
					ofcType = "BRANCH OFFICE";
				}
				cell18.setCellValue(ofcType);
				cell18.setCellStyle(styleData);

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
		private void writeHeaderLinePendingStatusIM() {
			// sheet = workbook.createSheet("Incident Type Count Report");

			XSSFRow row = sheet.createRow(13);

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
			style.setWrapText(true);
			createCell(row, 0, "Sr No.", style);
			createCell(row, 1, "Incident ID", style);
			createCell(row, 2, "Department", style);
			createCell(row, 3, "Status", style);
			createCell(row, 4, "Pending At", style);
			createCell(row, 5, "Office Code", style);

		}
	
		// this method is to write data to excel
		private void writeDataLinesPendingStatusIM() {
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
			for (NotificationDto ntfDto : incidentDto.getNotificationDto().getNtfDtoList()) {
				XSSFRow row = sheet.createRow(rowCount++);
				int columnCount = 0;

				createCell(row, columnCount++, srNo, style);
				createCell(row, columnCount++, ntfDto.getNtfModuleId(), style);
				createCell(row, columnCount++, ntfDto.getDeptName().toUpperCase(), styleName);
				createCell(row, columnCount++, ntfDto.getNtfStatus().toUpperCase(), style);
				createCell(row, columnCount++, ntfDto.getTargetId(), style);
				createCell(row, columnCount++, ntfDto.getOfcCode(), style);
				srNo++;

			}
		}
		
	
	/* Pending Status Incident Report */
	
	
	
	
	/* Incident RCA Report */	
	
		public void exportIncidentRCAReport(HttpServletResponse response, UserDto userDto) throws IOException {

			this.userDto = userDto;
			try {
				writeCommonHeaderLineRCAReport(userDto);
				writeHeaderLineRCAReport();
				writeDataLinesRCAReport();

				ServletOutputStream outputStream = response.getOutputStream();
				workbook.write(outputStream);
				workbook.close();

				outputStream.close();
			} catch (Exception e) {
				System.out.println(e);
			}
		}
		
		// this method is for common header with User Details
		private void writeCommonHeaderLineRCAReport(UserDto userDto) {
			try {
				sheet = workbook.createSheet("Incident Type Count Report");

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
				anchor.setCol2(2); // Column C
				anchor.setRow2(2); // Row 4

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
				cell2.setCellValue(userDto.getSearchParam());
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
				// start date and end date formatting
				Date date1 = incidentDto.getStartDate();
				Date date2 = incidentDto.getEndDate();
				DateFormat outputFormatter = new SimpleDateFormat("dd/MM/yyyy");
				String sDate = outputFormatter.format(date1);
				String eDate = outputFormatter.format(date2);
				XSSFCell cell6 = row1.createCell(2);
				cell6.setCellValue(sDate + " To " + eDate);
				cell6.setCellStyle(styleData);
				XSSFCell cell7 = row1.createCell(4);
				cell7.setCellValue("User Department");
				cell7.setCellStyle(style);
				XSSFCell cell8 = row1.createCell(5);
				cell8.setCellValue(userDto.getUserDeptName().toUpperCase());
				cell8.setCellStyle(styleData);
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
				XSSFCell cell11 = row2.createCell(4);
				cell11.setCellValue("User Office");
				cell11.setCellStyle(style);
				XSSFCell cell12 = row2.createCell(5);
				cell12.setCellValue(userDto.getUserOfficeType().toUpperCase());
				cell12.setCellStyle(styleData);
				// Row 3
				XSSFRow row3 = sheet.createRow(8);
				XSSFCell cell15 = row3.createCell(0);
				cell15.setCellValue("Report Extracted for Department");
				sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
				cell15.setCellStyle(style);
				XSSFCell cell16 = row3.createCell(2);
				cell16.setCellValue(incidentDto.getDepartment().toUpperCase());
				cell16.setCellStyle(styleData);

				// Row 4
				XSSFRow row4 = sheet.createRow(9);
				XSSFCell cell17 = row4.createCell(0);
				cell17.setCellValue("Report Extracted for Office");
				sheet.addMergedRegion(new CellRangeAddress(9, 9, 0, 1));
				cell17.setCellStyle(style);
				String ofcType="";
				if(incidentDto.getOfcLoc().toUpperCase().equalsIgnoreCase("CO")) {
					ofcType = "CENTRAL OFFICE";
				}else if(incidentDto.getOfcLoc().toUpperCase().equalsIgnoreCase("ZO")) {
					ofcType = "ZONAL OFFICE";
				} else if(incidentDto.getOfcLoc().toUpperCase().equalsIgnoreCase("DO")) {
					ofcType = "DIVISIONAL OFFICE";
				} else if(incidentDto.getOfcLoc().toUpperCase().equalsIgnoreCase("BO")) {
					ofcType = "BRANCH OFFICE";
				}
				XSSFCell cell18 = row4.createCell(2);
				cell18.setCellValue(ofcType);
				cell18.setCellStyle(styleData);

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
		private void writeHeaderLineRCAReport() {
			// sheet = workbook.createSheet("Incident Type Count Report");

			XSSFRow row = sheet.createRow(13);

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
			style.setWrapText(true);
			createCell(row, 0, "Sr No.", style);
			createCell(row, 1, "Date Of Event", style);
			createCell(row, 2, "Loss Location", style);
			createCell(row, 3, "Operating Office No.", style);
			createCell(row, 4, "Department", style);
			createCell(row, 5, "Category Of Operational Loss", style);
			createCell(row, 6, "Description Of Loss", style);
			createCell(row, 7, "Root Cause", style);
			createCell(row, 8, "Impact Value", style);
			createCell(row, 9, "Remarks", style);

		}
		
		
		// this method is to write data to excel
		private void writeDataLinesRCAReport() {
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
			for (IncidentReportDto incidentDto : incidentDto.getReportDtoList()) {
				XSSFRow row = sheet.createRow(rowCount++);
				int columnCount = 0;

				createCell(row, columnCount++, srNo, style);
				createCell(row, columnCount++, incidentDto.getIncidentRecordDate(), style);
				createCell(row, columnCount++, incidentDto.getOperatingOfcLocation(), styleName);
				createCell(row, columnCount++, incidentDto.getOperatingOfcNo(), style);
				createCell(row, columnCount++, incidentDto.getDepartment(), style);
				createCell(row, columnCount++, incidentDto.getPrimaryLossEvent(), style);
				createCell(row, columnCount++, incidentDto.getRootCauseDescription(), style);
				createCell(row, columnCount++, incidentDto.getRootCauseIncident(), style);
				createCell(row, columnCount++, incidentDto.getAssessedImpactValue(), style);
				createCell(row, columnCount++, "", style);
				srNo++;

			}
		}	
		
	/* Incident RCA Report */
	

	/* Incident Quarter Wise Report */
		
		public void exportIncidentQuarterReport(HttpServletResponse response, UserDto userDto) throws IOException {

			this.userDto = userDto;
			try {
				writeCommonHeaderLineQuarterReport(userDto);
				writeHeaderLineQuarterReport();
				writeDataLinesQuarterReport();

				ServletOutputStream outputStream = response.getOutputStream();
				workbook.write(outputStream);
				workbook.close();

				outputStream.close();
			} catch (Exception e) {
				System.out.println(e);
			}
		}
		
		// this method is for common header with User Details
				private void writeCommonHeaderLineQuarterReport(UserDto userDto) {
					try {
						sheet = workbook.createSheet("Incident Type Count Report");

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
						anchor.setCol2(2); // Column C
						anchor.setRow2(2); // Row 4

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
						cell2.setCellValue(userDto.getSearchParam());
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
						// start date and end date formatting
						Date date1 = incidentDto.getStartDate();
						Date date2 = incidentDto.getEndDate();
						DateFormat outputFormatter = new SimpleDateFormat("dd/MM/yyyy");
						String sDate = outputFormatter.format(date1);
						String eDate = outputFormatter.format(date2);
						XSSFCell cell6 = row1.createCell(2);
						cell6.setCellValue(sDate + " To " + eDate);
						cell6.setCellStyle(styleData);
						XSSFCell cell7 = row1.createCell(4);
						cell7.setCellValue("User Department");
						cell7.setCellStyle(style);
						XSSFCell cell8 = row1.createCell(5);
						cell8.setCellValue(userDto.getUserDeptName().toUpperCase());
						cell8.setCellStyle(styleData);
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
						XSSFCell cell11 = row2.createCell(4);
						cell11.setCellValue("User Office");
						cell11.setCellStyle(style);
						XSSFCell cell12 = row2.createCell(5);
						cell12.setCellValue(userDto.getUserOfficeType().toUpperCase());
						cell12.setCellStyle(styleData);
						// Row 3

						XSSFRow row4 = sheet.createRow(8);
						XSSFCell cell15 = row4.createCell(0);
						cell15.setCellValue("Report Extracted for Office");
						sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
						cell15.setCellStyle(style);
						String ofcType="";
						if(incidentDto.getSearchParam().toUpperCase().equalsIgnoreCase("CO")) {
							ofcType = "CENTRAL OFFICE";
						}else if(incidentDto.getSearchParam().toUpperCase().equalsIgnoreCase("ZO")) {
							ofcType = "ZONAL OFFICE";
						} else if(incidentDto.getSearchParam().toUpperCase().equalsIgnoreCase("DO")) {
							ofcType = "DIVISIONAL OFFICE";
						} else if(incidentDto.getSearchParam().toUpperCase().equalsIgnoreCase("BO")) {
							ofcType = "BRANCH OFFICE";
						}
						XSSFCell cell16 = row4.createCell(2);
						cell16.setCellValue(ofcType);
						cell16.setCellStyle(styleData);

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
				private void writeHeaderLineQuarterReport() {
					// sheet = workbook.createSheet("Incident Type Count Report");

					XSSFRow row = sheet.createRow(13);

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
					style.setWrapText(true);
					createCell(row, 0, "Sr No.", style);
					createCell(row, 1, "Period", style);
					createCell(row, 2, "Number of Internal Fraud", style);
					createCell(row, 3, "Number of External Fraud", style);

				}
		
				// this method is to write data to excel
				private void writeDataLinesQuarterReport() {
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
					styleName.setAlignment(HorizontalAlignment.RIGHT);

					// style.setWrapText(true);
					int srNo = 1;
					for (String str : incidentDto.getQuaterList()) {
						XSSFRow row = sheet.createRow(rowCount++);
						int columnCount = 0;

						createCell(row, columnCount++, srNo, style);
						createCell(row, columnCount++, 'Q'+str.split("~")[1], style);
						createCell(row, columnCount++, str.split("~")[2], styleName);
						createCell(row, columnCount++, str.split("~")[3], styleName);
						srNo++;

					}
				}
		
	/* Incident Quarter Wise Report */	
		
	
}
