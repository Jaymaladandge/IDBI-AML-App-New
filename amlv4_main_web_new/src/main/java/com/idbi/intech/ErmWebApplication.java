package com.idbi.intech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class ErmWebApplication extends SpringBootServletInitializer{
	
	 @Override
	    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		   return application.sources(ErmWebApplication.class);
	    }
	 
	      

	public static void main(String[] args) {
		SpringApplication.run(ErmWebApplication.class, args);
	}

}
