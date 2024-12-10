package com.idbi.intech.erm.controller;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idbi.intech.erm.domain.app.EncryptedRequestDto;
import com.idbi.intech.erm.domain.app.FileMasterDto;
import com.idbi.intech.erm.domain.app.User;
import com.idbi.intech.erm.service.FileManagementService;
import com.idbi.intech.erm.util.CommonUtility;

@Controller
public class FileManagementController {

	@Value("${file-location.loc}")
	private String root;
	
	@Autowired
	private FileManagementService fileService;
	
	@Autowired
	private CommonUtility commonUtility;

//	private final Path root = Paths.get("D://AML//");

	@PostMapping("/download")
	public ResponseEntity<Resource> downloadFile(@AuthenticationPrincipal User user, HttpServletRequest request) {
		final ObjectMapper objectMapper = new ObjectMapper();
		FileMasterDto fileDto = new FileMasterDto();
		String pageValJson = request.getParameter("pageValJson");
		try {
			fileDto = objectMapper.readValue(pageValJson, FileMasterDto.class);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Resource file = fileService.load(fileDto.getFileName());
		System.out.println("fileDto.getFileName() = " + fileDto.getFileName());
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "application/octet-stream")
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDto.getFileName() + "\"")
				.body(file);

	}

	@PostMapping(value = "/fileDownload")
	public void fileDownload(@ModelAttribute(name = "encryptedRequest") EncryptedRequestDto encryptedRequest,
			HttpServletRequest request, HttpServletResponse response, @AuthenticationPrincipal User user)
			throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper map = new ObjectMapper();
		String requestString = "";
		FileMasterDto fileDto = new FileMasterDto();
		try {
			requestString = commonUtility.encryptedReqToString(encryptedRequest.getEncryptedJson());
			fileDto = map.readValue(requestString, FileMasterDto.class);
			String fullPath = root + "//" + fileDto.getFileName().replace("+", "/");
			// String fullPath = path + obj.getFilename();

			File downladFile = new File(fullPath);
			DataInputStream input = new DataInputStream(new FileInputStream(downladFile));
			int length = 0;
			ServletOutputStream outputstream = response.getOutputStream();
			response.setContentType("application/octet-stream");
			response.setContentLength((int) downladFile.length());
			response.setHeader("Content-Disposition", "attachment;filename=" + fileDto.getFileName());
			byte[] buffer = new byte[1024];
			while ((input != null) && (length = input.read(buffer)) != -1) {
				outputstream.write(buffer, 0, length);
				outputstream.flush();
			}
			input.close();
			outputstream.close();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
