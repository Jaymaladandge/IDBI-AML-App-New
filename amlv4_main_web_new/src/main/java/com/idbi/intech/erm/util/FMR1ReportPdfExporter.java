package com.idbi.intech.erm.util;

import java.awt.Color;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.Locale;

import javax.servlet.http.HttpServletResponse;

import com.idbi.intech.erm.domain.app.IncidentDto;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

public class FMR1ReportPdfExporter {

	IncidentDto incidentDto;

	public FMR1ReportPdfExporter(IncidentDto incidentDto) {
		this.incidentDto = incidentDto;

	}

	private void writeTableHeaderMain(PdfPTable table1) {
		PdfPCell cell = new PdfPCell();
		// Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

		cell.setPadding(5);

		cell.setPhrase(new Phrase("Name Of The Insurer: Life Insurance Corporation of India"));
		table1.addCell(cell);

		cell.setPhrase(new Phrase("Report For The Year Ending: " + incidentDto.getFinancialYear()));
		table1.addCell(cell);

	}

	private void writeTableHeader(PdfPTable table) {
		PdfPCell cell = new PdfPCell();
		cell.setRowspan(2);
		cell.setHorizontalAlignment(cell.ALIGN_CENTER);
		cell.setPhrase(new Phrase("Sl.No"));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Description of Fraud"));
		table.addCell(cell);
		PdfPCell cell2 = new PdfPCell();
		cell2.setColspan(2);
		cell2.setHorizontalAlignment(cell2.ALIGN_CENTER);
		cell2.setPhrase(new Phrase("Unresolved Cases at the beginning of the year"));
		table.addCell(cell2);
		cell2.setPhrase(new Phrase("New cases detected during the year"));
		table.addCell(cell2);
		cell2.setPhrase(new Phrase("Cases closed during the year"));
		table.addCell(cell2);
		cell2.setPhrase(new Phrase("Unresolved Cases at the end of the year"));
		table.addCell(cell2);
		PdfPCell cell3 = new PdfPCell();
		cell3.setHorizontalAlignment(cell3.ALIGN_CENTER);
		cell3.setPhrase(new Phrase("No."));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("Amount Rupees"));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("No."));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("Amount Rupees"));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("No."));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("Amount Rupees"));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("No."));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("Amount Rupees"));
		table.addCell(cell3);
	}

	//NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
	
	Locale loc = new Locale("", "in");
	NumberFormat indiacurrency = NumberFormat.getCurrencyInstance(loc);
	//String result = indiacurrency.format(num);

	// String moneyString = formatter.format(amount);
	
	private void writeTableData(PdfPTable table) {

		for (String str : incidentDto.getFmrPart1list()) {

			table.addCell(String.valueOf(str.split("~")[0]));
			table.addCell(String.valueOf(str.split("~")[1]));
			table.addCell(String.valueOf(str.split("~")[2]));
			table.addCell(indiacurrency.format(Double.parseDouble(str.valueOf(str.split("~")[3]))));
			table.addCell(String.valueOf(str.split("~")[4]));
			table.addCell(String.valueOf(str.split("~")[5]));
			table.addCell(String.valueOf(str.split("~")[6]));
			table.addCell(String.valueOf(str.split("~")[7]));
			table.addCell(String.valueOf(str.split("~")[8]));
			table.addCell(String.valueOf(str.split("~")[9]));
		}
		table.addCell(String.valueOf(""));
		table.addCell(String.valueOf("Total"));
		table.addCell(String.valueOf(incidentDto.getTotalFmr().split("~")[0]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr().split("~")[1]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr().split("~")[2]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr().split("~")[3]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr().split("~")[4]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr().split("~")[5]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr().split("~")[6]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr().split("~")[7]));
	}

	// writeTableData2
	private void writeTableData2(PdfPTable table) {

		for (String str : incidentDto.getFmrPart2list()) {

			table.addCell(String.valueOf(str.split("~")[0]));
			table.addCell(String.valueOf(str.split("~")[1]));
			table.addCell(String.valueOf(str.split("~")[2]));
			table.addCell(String.valueOf(str.split("~")[3]));
		}
		table.addCell(String.valueOf(""));
		table.addCell(String.valueOf("Total"));
		table.addCell(String.valueOf(incidentDto.getTotalFmr2().split("~")[0]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr2().split("~")[1]));
	}

	// writeTableHeaderPart2
	private void writeTableHeaderPart2(PdfPTable table) {

		PdfPCell cell = new PdfPCell();
		cell.setPadding(5);
		cell.setPhrase(new Phrase("Sr.No"));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Description Of Fraud"));
		table.addCell(cell);

		cell.setPhrase(new Phrase("No. of cases"));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Amount Involved(Rupees)"));
		table.addCell(cell);
	}

	//writeTableHeaderPart3
	private void writeTableHeaderPart3(PdfPTable table) {
		
		PdfPCell cell = new PdfPCell();
		cell.setPadding(5);
		cell.setPhrase(new Phrase("Sr.No"));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Description Of Fraud"));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Preventive/Corrective action taken"));
		table.addCell(cell);

	}
	
	//writeTableData3
	private void writeTableData3(PdfPTable table) {
		
		for (String str : incidentDto.getFmrPart3list()) {

			table.addCell(String.valueOf(str.split("~")[0]));
			table.addCell(String.valueOf(str.split("~")[1]));
			table.addCell(String.valueOf(str.split("~")[2]));
			
		}
	}
	
	//writeTableHeaderPart4
	private void writeTableHeaderPart4(PdfPTable table) {
		PdfPCell cell = new PdfPCell();
		cell.setRowspan(2);
		cell.setHorizontalAlignment(cell.ALIGN_CENTER);
		cell.setPhrase(new Phrase("Sl.No"));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Description"));
		table.addCell(cell);
		PdfPCell cell2 = new PdfPCell();
		cell2.setColspan(2);
		cell2.setHorizontalAlignment(cell2.ALIGN_CENTER);
		cell2.setPhrase(new Phrase("Unresolved Cases at the beginning of the year"));
		table.addCell(cell2);
		cell2.setPhrase(new Phrase("New cases detected during the year"));
		table.addCell(cell2);
		cell2.setPhrase(new Phrase("Cases closed during the year"));
		table.addCell(cell2);
		cell2.setPhrase(new Phrase("Unresolved Cases at the end of the year"));
		table.addCell(cell2);
		PdfPCell cell3 = new PdfPCell();
		cell3.setHorizontalAlignment(cell3.ALIGN_CENTER);
		cell3.setPhrase(new Phrase("No."));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("Amount Rupees"));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("No."));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("Amount Rupees"));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("No."));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("Amount Rupees"));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("No."));
		table.addCell(cell3);
		cell3.setPhrase(new Phrase("Amount Rupees"));
		table.addCell(cell3);
	}
	
	//writeTableData4
	private void writeTableData4(PdfPTable table) {

		for (String str : incidentDto.getFmrPart4list()) {

			table.addCell(String.valueOf(str.split("~")[0]));
			table.addCell(String.valueOf(str.split("~")[1]));
			table.addCell(String.valueOf(str.split("~")[2]));
			table.addCell(String.valueOf(str.split("~")[3]));
			table.addCell(String.valueOf(str.split("~")[4]));
			table.addCell(String.valueOf(str.split("~")[5]));
			table.addCell(String.valueOf(str.split("~")[6]));
			table.addCell(String.valueOf(str.split("~")[7]));
			table.addCell(String.valueOf(str.split("~")[8]));
			table.addCell(String.valueOf(str.split("~")[9]));
		}
		table.addCell(String.valueOf(""));
		table.addCell(String.valueOf("Total"));
		table.addCell(String.valueOf(incidentDto.getTotalFmr4().split("~")[0]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr4().split("~")[1]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr4().split("~")[2]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr4().split("~")[3]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr4().split("~")[4]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr4().split("~")[5]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr4().split("~")[6]));
		table.addCell(String.valueOf(incidentDto.getTotalFmr4().split("~")[7]));
	}
	
	private void writeTableFooter(PdfPTable table2) {
		PdfPCell cell = new PdfPCell();

		cell.setPadding(5);

		cell.setPhrase(new Phrase("Date: "));
		cell.setBorder(Rectangle.NO_BORDER);
		table2.addCell(cell);

		cell.setPhrase(new Phrase("Signed/-"));
		cell.setBorder(Rectangle.NO_BORDER);
		cell.setHorizontalAlignment(cell.ALIGN_CENTER);
		table2.addCell(cell);

		cell.setPhrase(new Phrase("Place: "));
		cell.setBorder(Rectangle.NO_BORDER);
		cell.setHorizontalAlignment(cell.ALIGN_LEFT);
		table2.addCell(cell);

		cell.setPhrase(new Phrase("Name of the Chief Executive Officer of the Insurer"));
		cell.setBorder(Rectangle.NO_BORDER);
		cell.setHorizontalAlignment(cell.ALIGN_CENTER);
		table2.addCell(cell);

	}

	public void export(HttpServletResponse response) throws DocumentException, IOException {
		Document document = new Document(PageSize.A2);
		PdfWriter.getInstance(document, response.getOutputStream());

		document.open();
		Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
		font.setSize(12);
		Font font1 = FontFactory.getFont(FontFactory.HELVETICA);
		font1.setSize(10);
		font1.setColor(Color.black);
		font.setColor(Color.black);

		Paragraph p1 = new Paragraph("FMR-1", font);
		Paragraph p2 = new Paragraph("Fraud Monitoring Report", font);
		Paragraph p3 = new Paragraph("Part I", font);
		Paragraph p4 = new Paragraph("Fraud Outstanding Business Segment wise :", font);
		Paragraph p5 = new Paragraph("Part II", font);
		Paragraph p6 = new Paragraph(
				"Statistical details: (unresolved cases as at end of the year) –Business segment wise", font);
		Paragraph p7 = new Paragraph("Part III", font);
		Paragraph p8 = new Paragraph("Preventive and Corrective steps taken during the year- Business segment wise*",
				font);
		Paragraph p9 = new Paragraph("Part IV", font);
		Paragraph p10 = new Paragraph("Cases Reported to Law Enforcement Agencies :", font);
		Paragraph p11 = new Paragraph(
				"* Business segments shall be as indicated under IRDA (Preparation of Financial Statements and Auditor’s Report of Insurance Companies) Regulations, 2002",
				font1);
		Paragraph p12 = new Paragraph("CERTIFICATION", font);
		Paragraph p13 = new Paragraph(
				"Certified that the details given above are correct and complete to the best of my knowledge and belief and nothing has been concealed or suppressed.",
				font);

		p1.setAlignment(Paragraph.ALIGN_CENTER);
		p2.setAlignment(Paragraph.ALIGN_CENTER);
		p12.setAlignment(Paragraph.ALIGN_CENTER);
		p13.setAlignment(Paragraph.ALIGN_CENTER);

		document.add(p1);
		document.add(p2);

		PdfPTable table1 = new PdfPTable(1);
		table1.setWidthPercentage(100f);
		table1.setSpacingBefore(5);
		writeTableHeaderMain(table1);
		
		PdfPTable table2 = new PdfPTable(10);
		table2.setWidthPercentage(100f);
		table2.setSpacingBefore(10);
		//table2.setSpacingAfter(5);
		writeTableHeader(table2);
		table2.setHorizontalAlignment(100);
		
		PdfPTable table3 = new PdfPTable(10);
		table3.setWidthPercentage(100f);
		//table3.setSpacingBefore(10);
		table3.setSpacingAfter(5);
		writeTableData(table3);

		PdfPTable table4 = new PdfPTable(4);
		table4.setWidthPercentage(100f);
		table4.setSpacingBefore(10);
		//table4.setSpacingAfter(5);
		writeTableHeaderPart2(table4);

		PdfPTable table5 = new PdfPTable(4);
		table5.setWidthPercentage(100f);
		//table5.setSpacingBefore(10);
		table5.setSpacingAfter(5);
		writeTableData2(table5);
		
		PdfPTable table6 = new PdfPTable(3);
		table6.setWidthPercentage(100f);
		table6.setSpacingBefore(10);
	//	table6.setSpacingAfter(5);
		writeTableHeaderPart3(table6);
		
		PdfPTable table7 = new PdfPTable(3);
		table7.setWidthPercentage(100f);
		//table7.setSpacingBefore(10);
		table7.setSpacingAfter(5);
		writeTableData3(table7);
		
		PdfPTable table8 = new PdfPTable(10);
		table8.setWidthPercentage(100f);
		table8.setSpacingBefore(10);
		//table8.setSpacingAfter(5);
		writeTableHeaderPart4(table8);
		
		PdfPTable table9 = new PdfPTable(10);
		table9.setWidthPercentage(100f);
		//table9.setSpacingBefore(10);
		table9.setSpacingAfter(5);
		writeTableData4(table9);
		
		PdfPTable table10= new PdfPTable(2);
		table10.setWidthPercentage(100f);
		table10.setSpacingBefore(20);
		table10.setSpacingAfter(5);
		writeTableFooter(table10);
		

		document.add(table1);
		document.add(p3);
		document.add(p4);
		document.add(table2);
		document.add(table3);
		document.add(p5);
		document.add(p6);
		document.add(table4);
		document.add(table5);
		document.add(p7);
		document.add(p8);
		document.add(table6);
		document.add(table7);
		document.add(p9);
		document.add(p10);
		document.add(table8);
		document.add(table9);
		document.add(p11);
		document.add(p12);
		document.add(p13);
		document.add(table10);
		document.close();

	}
	
	
		
	
	
}

