package com.idbi.intech.erm.util;



import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

@Component
public class RequestResponseLoggingFilter implements Filter{
	
	
	@Override
    public void doFilter(ServletRequest request, ServletResponse response,  FilterChain chain) throws ServletException, IOException {
 
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
       // System.out.println("Method Filer=====>" + httpRequest.getMethod());
       // httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
       // httpResponse.setHeader("X-Content-Security-Policy", "script-src 'self'");
        httpResponse.setHeader("Cache-Control", "no-chche. no-store, multi-revalidate");
        httpResponse.setHeader("Pragma", "no-cache");
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
          httpResponse.getWriter().write("OPTIONS method is not allowed");
          httpResponse.setContentType("text/plain");
          httpResponse.setStatus(403);
        } else if ("TRACE".equalsIgnoreCase(httpRequest.getMethod())) {
          httpResponse.getWriter().write("TRACE method is not allowed");
          httpResponse.setContentType("text/plain");
          httpResponse.setStatus(403);
        } else if ("DELETE".equalsIgnoreCase(httpRequest.getMethod())) {
          httpResponse.getWriter().write("DELETE method is not allowed");
          httpResponse.setContentType("text/plain");
          httpResponse.setStatus(403);
        } else if ("PUT".equalsIgnoreCase(httpRequest.getMethod())) {
          httpResponse.getWriter().write("PUT method is not allowed");
          httpResponse.setContentType("text/plain");
          httpResponse.setStatus(403);
        } else if ("PATCH".equalsIgnoreCase(httpRequest.getMethod())) {
          httpResponse.getWriter().write("PATCH method is not allowed");
          httpResponse.setContentType("text/plain");
          httpResponse.setStatus(403);
        } else if ("HEAD".equalsIgnoreCase(httpRequest.getMethod())) {
          httpResponse.getWriter().write("HEAD method is not allowed");
          httpResponse.setContentType("text/plain");
          httpResponse.setStatus(403);
        } else {
          chain.doFilter(httpRequest,httpResponse);
        } 
      }
    }

