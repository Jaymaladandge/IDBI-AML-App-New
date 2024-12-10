package com.idbi.intech.erm.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileManagementServiceImpl implements FileManagementService{
	
	@Value("${file-location.loc}")
	private static String uploads;
	
	 private final Path root = Paths.get("D://testDocs//");

	@Override
	public void init() {
		   try {
			      Files.createDirectory(root);
			    } catch (IOException e) {
			      throw new RuntimeException("Could not initialize folder for upload!");
			    }
	}

	@Override
	public void save(MultipartFile file) {

	    try {
	        Files.copy(file.getInputStream(), this.root.resolve(file.getOriginalFilename()));
	      } catch (Exception e) {
	        throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
	      }
	}

	@Override
	public Resource load(String filename) {

	    try {
	        Path file = root.resolve(filename);
	        Resource resource = new UrlResource(file.toUri());

	        if (resource.exists() || resource.isReadable()) {
	          return resource;
	        } else {
	          throw new RuntimeException("Could not read the file!");
	        }
	      } catch (MalformedURLException e) {
	        throw new RuntimeException("Error: " + e.getMessage());
	      }
	}

	@Override
	public void deleteAll() {

		FileSystemUtils.deleteRecursively(root.toFile());
	}

	@Override
	public Stream<Path> loadAll() {
		  try {
		      return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
		    } catch (IOException e) {
		      throw new RuntimeException("Could not load the files!");
		    }
	}
	
	@Override
	public void saveFileWithZip(String folderName, List<String> fileList) {
		try {
			// Directory where the uploaded files will be stored temporarily
			String uploadDir = "D://OfficeDocs";

			// Create a new folder
			String folderPath = createFolder(uploadDir, folderName);

			// Save the files to the created folder
			saveFilesToFolder(folderPath, fileList);

			// Zip the folder
			zipFolder(folderPath, uploadDir + "//" + folderName + ".zip");

			removeFolder(folderPath);

			System.out.println("Files zipped successfully!");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	// Create a new folder
		private static String createFolder(String parentDirectory, String folderName) throws IOException {
			String folderPath = parentDirectory + File.separator + folderName;
			Files.createDirectories(Paths.get(folderPath));
			return folderPath;
		}

		// Save files to the specified folder
		private static void saveFilesToFolder(String folderPath, List<String> fileList) {

			for (String fileName : fileList) {
				File sourceFile = new File("D://OfficeDocs//" + fileName);

				if (sourceFile.exists() && sourceFile.isFile()) { // Check if source file exists and is a file
					Path destinationPath = Paths.get(folderPath, fileName);

					try {
						Files.copy(sourceFile.toPath(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
					} catch (IOException e) {
						e.printStackTrace();
					}
				} else {
					System.out.println("Source file does not exist or is not a file: D://OfficeDocs//" + fileName);
				}
			}
		}

		// Zip the folder
		private static void zipFolder(String sourceFolderPath, String zipFilePath) throws IOException {
			try (FileOutputStream fos = new FileOutputStream(zipFilePath);
					ZipOutputStream zipOut = new ZipOutputStream(fos);) {
				Path sourcePath = Paths.get(sourceFolderPath);
				Files.walk(sourcePath).filter(path -> !Files.isDirectory(path)).forEach(path -> {
					ZipEntry zipEntry = new ZipEntry(sourcePath.relativize(path).toString());
					try {
						zipOut.putNextEntry(zipEntry);
						Files.copy(path, zipOut);
						zipOut.closeEntry();
					} catch (IOException e) {
						e.printStackTrace();
					}
				});
			}
		}

		// Save files to the specified folder
		private static void removeFolder(String folderPath) {
			File directory = new File(folderPath);
			System.out.println(folderPath);
			System.out.println(directory);
			if (directory.exists()) {
				if (directory.isDirectory()) {
					if (directory.delete()) {
						System.out.println("Folder deleted successfully.");
					} else {
						System.out.println("Failed to delete the folder.");
					}
				} else {
					System.out.println("Specified path is not a directory.");
				}
			} else {
				System.out.println("Specified folder does not exist.");
			}
		}

}
