package com.idbi.intech.erm.util;

import java.awt.Color;
import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.IncidentClosureLinkDto;
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

public class FMRReportPdfExport {

	private IncidentClosureLinkDto incidentDto;

	public FMRReportPdfExport(String checkListDtoList) throws IOException {

		final ObjectMapper objectMapper = new ObjectMapper();
		incidentDto = objectMapper.readValue(checkListDtoList, IncidentClosureLinkDto.class);
	}

	private void writeTableHeaderMain(PdfPTable table1) {
		PdfPCell cell = new PdfPCell();
		//Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

		cell.setPadding(5);

		cell.setPhrase(new Phrase("Name Of The Insurer: Life Insurance Corporation of India"));
		table1.addCell(cell);

		cell.setPhrase(new Phrase("Report For The Year Ending: " + incidentDto.getFinancialYear()));
		table1.addCell(cell);

	}

	private void writeTableHeader(PdfPTable table) {
		PdfPCell cell = new PdfPCell();

		cell.setPadding(5);

		cell.setPhrase(new Phrase("Sr.No"));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Basis of closing a case"));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Number of cases closed"));
		table.addCell(cell);

	}

	private void writeTableData(PdfPTable table) {

		table.addCell(incidentDto.getCheckListCount().get(0).getSrNo());
		table.addCell(incidentDto.getCheckListCount().get(0).getCheckListNmae());
		table.addCell(incidentDto.getCheckListCount().get(0).getCheckListCout());

		table.addCell(incidentDto.getCheckListCount().get(1).getSrNo());
		table.addCell(incidentDto.getCheckListCount().get(1).getCheckListNmae());
		table.addCell(incidentDto.getCheckListCount().get(1).getCheckListCout());

		table.addCell(incidentDto.getCheckListCount().get(2).getSrNo());
		table.addCell(incidentDto.getCheckListCount().get(2).getCheckListNmae());
		table.addCell(incidentDto.getCheckListCount().get(2).getCheckListCout());

		table.addCell(incidentDto.getCheckListCount().get(3).getSrNo());
		table.addCell(incidentDto.getCheckListCount().get(3).getCheckListNmae());
		table.addCell(incidentDto.getCheckListCount().get(3).getCheckListCout());

		PdfPCell cell1 = new PdfPCell(new Phrase("5"));
		cell1.setRowspan(2);
		table.addCell(cell1);
		table.addCell(incidentDto.getCheckListCount().get(4).getCheckListNmae());
		table.addCell(incidentDto.getCheckListCount().get(4).getCheckListCout());

		table.addCell(incidentDto.getCheckListCount().get(5).getSrNo());
		table.addCell(incidentDto.getCheckListCount().get(5).getCheckListNmae());

		PdfPCell cell2 = new PdfPCell(new Phrase("6"));
		cell2.setRowspan(2);
		table.addCell(cell2);
		table.addCell(incidentDto.getCheckListCount().get(6).getCheckListNmae());
		table.addCell(incidentDto.getCheckListCount().get(6).getCheckListCout());

		table.addCell(incidentDto.getCheckListCount().get(7).getSrNo());
		table.addCell(incidentDto.getCheckListCount().get(7).getCheckListNmae());

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
		Document document = new Document(PageSize.A4);
		PdfWriter.getInstance(document, response.getOutputStream());

		document.open();
		Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
		font.setSize(12);
		Font font1 = FontFactory.getFont(FontFactory.HELVETICA);
		font1.setSize(10);
		font1.setColor(Color.black);
		font.setColor(Color.black);

		Paragraph p = new Paragraph("FMR-2", font);
		Paragraph p2 = new Paragraph("Fraud Cases Closed During The Year", font);
		Paragraph p3 = new Paragraph("CERTIFICATION", font);
		Paragraph p4 = new Paragraph("Certified that the details given above are correct and complete to the best of my knowledge and belief and nothing has been concealed or suppressed.",font1);
		
		p.setAlignment(Paragraph.ALIGN_CENTER);
		p2.setAlignment(Paragraph.ALIGN_CENTER);
		p3.setAlignment(Paragraph.ALIGN_CENTER);
		p2.setSpacingAfter(10);
		p4.setSpacingAfter(10);
		p3.setSpacingAfter(10);
		p4.setAlignment(Paragraph.ALIGN_CENTER);

		document.add(p);
		document.add(p2);

		PdfPTable table = new PdfPTable(3);
		PdfPTable table1 = new PdfPTable(1);
		PdfPTable table2 = new PdfPTable(2);

		table1.setWidthPercentage(100f);
		table1.setSpacingBefore(5);
		
		table2.setWidthPercentage(100f);
		table2.setSpacingBefore(10);
		

		table.setWidthPercentage(100f);
		table.setWidths(new float[] { 1.5f, 8.0f, 3.0f });
		table.setSpacingBefore(10);
		table.setSpacingAfter(5);

		writeTableFooter(table2);
		writeTableHeaderMain(table1);
		writeTableHeader(table);
		writeTableData(table);

		document.add(table1);
		document.add(table);
		document.add(p3);
		document.add(p4);
		document.add(table2);

		document.close();

	}
}
