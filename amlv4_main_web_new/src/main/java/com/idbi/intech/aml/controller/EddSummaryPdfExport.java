package com.idbi.intech.aml.controller;

import java.awt.Color;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.aml.domain.app.BranchEDDResponseDto;
import com.idbi.intech.aml.domain.app.EDDBranchRequestMasterDto;
import com.idbi.intech.erm.domain.app.UserDto;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.ColumnText;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;

public class EddSummaryPdfExport {

	@Value("${file-location.loc}")
	private String root;

	final ObjectMapper objectMapper = new ObjectMapper();
	BranchEDDResponseDto testQuestionDto = new BranchEDDResponseDto();
	UserDto userDto = new UserDto();

	public EddSummaryPdfExport(BranchEDDResponseDto testQuestionDto, UserDto userDto) {

		this.testQuestionDto = testQuestionDto;
		this.userDto = userDto;
	}

	private void writeTableData(PdfPTable table) {
		for (EDDBranchRequestMasterDto raDto : testQuestionDto.getRequestList()) {
			Font font2 = FontFactory.getFont(FontFactory.HELVETICA);
			font2.setSize(10);
			font2.setColor(Color.black);
			font2.setColor(Color.black);
			PdfPCell cell = new PdfPCell();
			cell.setPadding(5);
			cell.setPhrase(new Phrase(raDto.getCustUCIC(), font2));
			table.addCell(cell);

			cell.setPhrase(new Phrase(raDto.getCustId(), font2));
			table.addCell(cell);

			cell.setPhrase(new Phrase(raDto.getCustName(), font2));
			table.addCell(cell);

			cell.setPhrase(new Phrase(raDto.getBranchId(), font2));
			table.addCell(cell);

			cell.setPhrase(new Phrase(raDto.getLastUserId(), font2));
			table.addCell(cell);

			cell.setPhrase(new Phrase(raDto.getLastChangeTime(), font2));
			table.addCell(cell);
		}
	}

	private void writeTableHeader(PdfPTable table) {
		Font font2 = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
		font2.setSize(10);
		PdfPCell cell1 = new PdfPCell();
		cell1.setColspan(6);
		cell1.setHorizontalAlignment(Element.ALIGN_CENTER); // Align text to the center horizontally
		cell1.setPhrase(new Phrase("Enhanced Due Diligence Request Details", font2));
		table.addCell(cell1);
		
		Font font1 = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
		font1.setSize(10);

		PdfPCell cell = new PdfPCell();
		cell.setPadding(5);
		// cell.setHorizontalAlignment(cell.ALIGN_CENTER);
		cell.setPhrase(new Phrase("UCIC ID", font1));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Customer ID", font1));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Customer Name", font1));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Branch ID", font1));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Inhanced By", font1));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Last Inhancement Date", font1));
		table.addCell(cell);
	}

	public void export(String fileName) throws DocumentException, IOException {
		Document document = new Document(PageSize.A4, 36, 36, 36, 36);
		PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream("D://OfficeDocs//" + fileName));
		document.open();

		Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
		font.setSize(14);
		Font font1 = FontFactory.getFont(FontFactory.HELVETICA);
		font1.setSize(10);
		font1.setColor(Color.black);
		font.setColor(Color.black);
		
		
		Image img1 = Image.getInstance(userDto.getFileName()+"//IDBI-Bank-1.png");
		img1.setWidthPercentage(0);
		img1.scaleAbsolute(100f, 30f);
		//cell.addElement(img1);
		document.add(img1);

		Paragraph p = new Paragraph("Enhanced Due Diligence Summary", font);
		p.setAlignment(Paragraph.ALIGN_CENTER);
		p.setSpacingAfter(15);
		document.add(p);

		PdfPTable table = new PdfPTable(6);
		table.setWidthPercentage(100f);
		table.setWidths(new float[] { 5f, 5f, 5f, 5f, 5f, 5f });
		table.setSpacingBefore(10);
		table.setSpacingAfter(5);
		writeTableHeader(table);
		writeTableData(table);
		document.add(table);
		
		Paragraph p1 = new Paragraph(" ");
		p1.setAlignment(Paragraph.ALIGN_CENTER);
		document.add(p1);

		int srNo = 1;
		List<BranchEDDResponseDto> responseList = testQuestionDto.getEddResponceList();
		if (responseList != null) {
		    PdfPTable table1 = new PdfPTable(1);
		    table1.setWidthPercentage(100f);
		    table1.setWidths(new float[] { 5f });
		    for (BranchEDDResponseDto responseDto : responseList) {
		        String question = responseDto.getQuestion();
		        String answer = responseDto.getQuestionAns();

		        if (question != null && answer != null) { // Check for null values
		            PdfPCell cell1 = new PdfPCell();
		            // Use HTML tags to make the question text bold
		            cell1.setPhrase(new Phrase( srNo + ". " + question + "\n   Answer:  " + answer, font1));
		            cell1.setPadding(8);
		            // Set cell content to interpret HTML
		            cell1.setHorizontalAlignment(Element.ALIGN_LEFT);
		            table1.addCell(cell1);
		            srNo++;
		        }
		    }
		    document.add(table1);
		}

		document.close();
	}

}
