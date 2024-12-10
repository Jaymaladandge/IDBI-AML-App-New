package com.idbi.intech.erm.util;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
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
import org.apache.poi.ss.usermodel.FillPatternType;
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
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.BenchmarkNotificationMasterDto;
import com.idbi.intech.erm.domain.app.DepartmentMasterDto;
import com.idbi.intech.erm.domain.app.TopRiskBizzDto;
import com.idbi.intech.erm.domain.app.TopRiskMasterDto;
import com.idbi.intech.erm.domain.app.TopRiskTrendDto;
import com.idbi.intech.erm.domain.app.TpAndKriReportDto;
import com.idbi.intech.erm.domain.app.UserDto;

public class DeptTrendReportExcelExport {

	private TopRiskBizzDto topRiskDto;
	private TopRiskMasterDto topRiskMasterDto;
	List<DepartmentMasterDto> deptList = new ArrayList<>();
	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	UserDto userDto = new UserDto();
	private BenchmarkNotificationMasterDto notificationDto;
	private TpAndKriReportDto kriMasterDto;

	public DeptTrendReportExcelExport(String requestJson) throws JsonMappingException, JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		topRiskDto = objectMapper.readValue(requestJson, TopRiskBizzDto.class);
		// this.userDto=userDto;

		workbook = new XSSFWorkbook();
	}
	
	public DeptTrendReportExcelExport(BenchmarkNotificationMasterDto notificationDto) throws JsonMappingException, JsonProcessingException {
		
		 this.notificationDto=notificationDto;

		workbook = new XSSFWorkbook();
	}
	
	public DeptTrendReportExcelExport(TpAndKriReportDto kriMasterDto) throws JsonMappingException, JsonProcessingException {
		
		 this.kriMasterDto=kriMasterDto;

		workbook = new XSSFWorkbook();
	}
	
	public DeptTrendReportExcelExport(String requestJsonString ,String requestJson) throws JsonMappingException, JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		topRiskMasterDto = objectMapper.readValue(requestJsonString, TopRiskMasterDto.class);
		deptList = objectMapper.readValue(requestJson, new TypeReference<List<DepartmentMasterDto>>() {
		});
		

		workbook = new XSSFWorkbook();
	}

	private void writeHeaderLine() {
		Row row = sheet.createRow(8);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontName("Times New Roman");
		font.setFontHeight(14);
		style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
		style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
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
		createCell(row, 0, "Department Name", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 3, 4));
		createCell(row, 3, topRiskDto.getAsstPeriod(), style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 5, 6));
		createCell(row, 5, topRiskDto.getAsstPeriodComp(), style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 7, 8));
		createCell(row, 7, "Trend", style);
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
		Row row = sheet.createRow(8);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontName("Times New Roman");
		font.setFontHeight(14);
		style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
		style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
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

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
		createCell(row, 0, "Statement Description", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 2, 3));
		createCell(row, 2, "Department Name", style);
		
		int Size=topRiskMasterDto.getQaInfo().size();

		for(int i=0; i<Size;i++) {
			
		int colCount = 4;
		createCell(row, colCount+i, topRiskMasterDto.getQaInfo().get(i).getQuarterDetails(), style);
		
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
	
	private void writeHeaderLine3() {
		Row row = sheet.createRow(8);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontName("Times New Roman");
		font.setFontHeight(14);
		style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
		style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
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

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 0, 1));
		createCell(row, 0,"Benchmark Id", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 2, 3));
		createCell(row, 2, "Department Name", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 4,5));
		createCell(row, 4, "Assessment value", style);

		sheet.addMergedRegion(new CellRangeAddress(8, 8, 6, 7));
		createCell(row, 6, "Date", style);
		
		createCell(row, 8, "Office Code", style);
		int numMerged = sheet.getNumMergedRegions();

		for (int i = 0; i < numMerged; i++) {
			CellRangeAddress mergedRegions = sheet.getMergedRegion(i);
			RegionUtil.setBorderTop(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderLeft(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderRight(BorderStyle.THIN, mergedRegions, sheet);
			RegionUtil.setBorderBottom(BorderStyle.THIN, mergedRegions, sheet);
		}

	}
	
	private void writeHeaderLine4() {
		Row row = sheet.createRow(8);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontName("Times New Roman");
		font.setFontHeight(14);
		style.setFillForegroundColor(IndexedColors.GOLD.getIndex());
		style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
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

		createCell(row, 0,"KRI ID",style);
		createCell(row, 1, "Department Name", style);
		createCell(row, 2, "KRI Name", style);
		createCell(row, 3, "KRI Value Description", style);
		createCell(row, 4, "Benchmark Description", style);
		createCell(row, 5, "Green Threshold", style);
		createCell(row, 6, "Amber Threshold", style);
		createCell(row, 7, "Red Threshold", style);
		createCell(row, 8, "Action Plan Details", style);
		

	}

	// this method is for common header with User Details
	private void writeCommonHeaderLine(UserDto userDto) {
		try {
			sheet = workbook.createSheet("Trend Report");

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

		for (TopRiskTrendDto trend : topRiskDto.getTrendResult()) {

			Row row = sheet.createRow(rowCount);
			int columnCount = 0;
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 0, 2));
			createCell(row, columnCount, trend.getDeptName(), style);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 3, 4));
			createCell(row, 3 + columnCount, trend.getAsstPeriod1Result() + "(" + trend.getResult1() + ")", style1);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 5, 6));
			createCell(row, 5 + columnCount, trend.getAsstPeriod2Result() + "(" + trend.getResult2() + ")", style2);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 7, 8));
			createCell(row, 7 + columnCount, trend.getTrend(), style);

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
	
	
	private void writeDataLines2() {
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
		style.setWrapText(true);

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

		for (TopRiskMasterDto trend : topRiskMasterDto.getTopRiskList()) {

			Row row = sheet.createRow(rowCount);
			int columnCount = 0;
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 0, 1));
			createCell(row, columnCount, trend.getTopRiskDescription(), style);

			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 2, 3));
			createCell(row, 2 + columnCount, trend.getUserDept(), style);
			

			int size=trend.getValueList().size();
			System.out.println(size);
			for(int i=0; i<size;i++) {
				
				int colCount = 4;
				createCell(row, colCount+i, trend.getValueList().get(i).getAssessmentStatus(), style);
				
				}

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

	private void writeDataLines3() {
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
		style.setWrapText(true);

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

		for (BenchmarkNotificationMasterDto bmNftDto : notificationDto.getBmNtfDtoList()) {
			Row row = sheet.createRow(rowCount);
			int columnCount = 0;
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 0, 1));
			createCell(row, columnCount, bmNftDto.getBmId(), style);
			
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 2, 3));
			createCell(row, 2+columnCount, bmNftDto.getDeptName(), style);
			
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 4, 5));
			createCell(row, 4+columnCount, bmNftDto.getAssessmentValue().toUpperCase(), style);
			
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount, 6, 7));
			createCell(row, 6+columnCount, bmNftDto.getAssessmentDate(), style);
			
			
			createCell(row, 8+columnCount, bmNftDto.getOfcCode(), style);
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
	
	private void writeDataLines4() {
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
		style.setWrapText(true);

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
		

		for (TpAndKriReportDto kriDto : kriMasterDto.getKriList()) {
			
			Row row = sheet.createRow(rowCount);
			int columnCount = 0;
			int size2=kriDto.getActionPlanList().size();
			if(size2==0) {
			createCell(row, columnCount, kriDto.getKriId(), style);
			createCell(row, 1+columnCount, kriDto.getDeptProvidingDataName(), style);
			createCell(row, 2+columnCount, kriDto.getKriName(), style);
			createCell(row, 3+columnCount, kriDto.getKriThresholdDescription(), style);
			createCell(row, 4+columnCount, kriDto.getBmDesc(), style);
			int size=kriDto.getThreshouldDetailsList().size();
			for (int i = 0; i < size; i++) {

				int colCount = 5;
				createCell(row, colCount + i, kriDto.getThreshouldDetailsList().get(i).getAsstType() + ","
						+ kriDto.getThreshouldDetailsList().get(i).getAsstType(), style);

			}
			
			
			if(size2!=0) {
			for(int i=0; i<size2;i++) {
				
				int colCount = 8;
				createCell(row, colCount, "ActionPlan Name -\n"+kriDto.getActionPlanList().get(i).getActionName()+",\n ActionPlan Owner-\n"+kriDto.getActionPlanList().get(i).getActionOwner()+",\n ActionPlan Description-\n"+kriDto.getActionPlanList().get(i).getActionDescription()+",\n ActionPlan Completion Date- -\n"+kriDto.getActionPlanList().get(i).getActionDate()+"\n"+",ActionPlan Completion Percent -"+kriDto.getActionPlanList().get(i).getActionCompPercent()+"\n", style);
				
				}
			}else {
				int colCount = 8;
				createCell(row, colCount,"NA",style);
			}

		} else {
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount +( size2-1), 0, 0));
			createCell(row, columnCount, kriDto.getKriId(), style);
			
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount +( size2-1), 1, 1));
			createCell(row, 1+columnCount, kriDto.getDeptProvidingDataName(), style);
			
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + ( size2-1), 2, 2));
			createCell(row, 2+columnCount, kriDto.getKriName(), style);
			
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + ( size2-1), 3, 3));
			createCell(row, 3+columnCount, kriDto.getKriThresholdDescription(), style);
			
			sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + ( size2-1), 4, 4));
			createCell(row, 4+columnCount, kriDto.getBmDesc(), style);
			
			int size=kriDto.getThreshouldDetailsList().size();
			for (int i = 0; i < size; i++) {

				int colCount = 5;
				sheet.addMergedRegion(new CellRangeAddress(rowCount, rowCount + ( size2-1), colCount+i,  colCount+i));
				createCell(row, colCount + i, kriDto.getThreshouldDetailsList().get(i).getAsstType() + ","
						+ kriDto.getThreshouldDetailsList().get(i).getAsstType(), style);

			}
			
			if(size2!=0) {
				for(int i=0; i<size2;i++) {
					Row row1 = sheet.createRow(rowCount);
					int colCount = 8;
					createCell(row1, colCount, "ActionPlan Name -\n"+kriDto.getActionPlanList().get(i).getActionName()+",\n ActionPlan Owner-\n"+kriDto.getActionPlanList().get(i).getActionOwner()+",\n ActionPlan Description-\n"+kriDto.getActionPlanList().get(i).getActionDescription()+",\n ActionPlan Completion Date- -\n"+kriDto.getActionPlanList().get(i).getActionDate()+"\n"+",ActionPlan Completion Percent -"+kriDto.getActionPlanList().get(i).getActionCompPercent()+"\n", style);
					rowCount++;
					}
				rowCount--;
				}else {
					int colCount = 8;
					createCell(row, colCount,"NA",style);
				}
			

		}

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

	

	private void createCell(Row row, int columnCount, Object value, CellStyle style) {
		sheet.autoSizeColumn(columnCount);
		Cell cell = row.createCell(columnCount);
		if (value instanceof Integer) {
			cell.setCellValue((Integer) value);
		} else if (value instanceof Boolean) {
			cell.setCellValue((Boolean) value);
		} else if(value instanceof Date){
			cell.setCellValue((Date) value);
			
		}else {
			cell.setCellValue((String) value);
		}
		cell.setCellStyle(style);
		
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
			e.printStackTrace();
		}

	}
	
	
	public void exportReport(HttpServletResponse response, UserDto userDto) throws IOException {
		
		
		this.userDto = userDto;

		try {
			writeCommonHeaderLine(userDto);
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
	
public void exportBenchmarkReport(HttpServletResponse response, UserDto userDto) throws IOException {
		
		
		this.userDto = userDto;

		try {
			writeCommonHeaderLine(userDto);
			writeDataLines3();
			writeHeaderLine3();

			ServletOutputStream outputStream = response.getOutputStream();
			workbook.write(outputStream);
			workbook.close();

			outputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		
	}

public void exportKriReport(HttpServletResponse response, UserDto userDto) throws IOException {
	
	
	this.userDto = userDto;

	try {
		writeCommonHeaderLine(userDto);
		writeDataLines4();
		writeHeaderLine4();

		ServletOutputStream outputStream = response.getOutputStream();
		workbook.write(outputStream);
		workbook.close();

		outputStream.close();
	} catch (Exception e) {
		e.printStackTrace();
	}

	
}
	

}
