package com.idbi.intech.erm.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.multipart.support.MultipartFilter;

import com.idbi.intech.erm.service.RestApiAuthenticationProvider;
import com.idbi.intech.erm.util.RequestResponseLoggingFilter;

/**
 * This is overridden method from WebSecurityConfigurerAdapter, It is used to
 * configure user access, session management and invalid session URL
 * 
 * @author arnoldanthony
 *
 */

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private RestApiAuthenticationProvider restAuthProvider;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.headers().contentSecurityPolicy("object-src 'self'");

		http
        .headers()
            .httpStrictTransportSecurity()
                .includeSubDomains(true)
                .maxAgeInSeconds(31536000);

		http.addFilterBefore(multipartFilter(), CsrfFilter.class).authorizeRequests().antMatchers("/")
				.access("permitAll").and().formLogin().loginPage("/login").defaultSuccessUrl("/RolePage")
				.failureUrl("/loginFailure").and().logout().logoutUrl("/logout").invalidateHttpSession(true)
				.deleteCookies("JSESSIONID")
				.and().sessionManagement().maximumSessions(1)
	            .maxSessionsPreventsLogin(true);
	}

	/**
	 * @author arnoldanthony
	 * @param auth
	 * @throws Exception This is a method to setup the authentication provider
	 */
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(restAuthProvider);
	}

	/**
	 * handles security for File transfer
	 * 
	 * @return
	 */
	@Bean(name = "commonsMultipartResolver")
	public CommonsMultipartResolver commonsMultipartResolver() {
		final CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
		commonsMultipartResolver.setMaxUploadSize(-1);

		return commonsMultipartResolver;
	}

	@Bean
	@Order(0)
	public MultipartFilter multipartFilter() {
		MultipartFilter multipartFilter = new MultipartFilter();
		multipartFilter.setMultipartResolverBeanName("commonsMultipartResolver");
		return multipartFilter;
	}

	@Bean
	public HttpFirewall configureFirewall() {
		StrictHttpFirewall strictHttpFirewall = new StrictHttpFirewall();
		strictHttpFirewall.setAllowedHttpMethods(Arrays.asList("GET", "POST"));
		return strictHttpFirewall;
	}
	
	@Bean
	public FilterRegistrationBean<RequestResponseLoggingFilter> loggingFilter() {
		FilterRegistrationBean<RequestResponseLoggingFilter> registrationBean = new FilterRegistrationBean<>();

		registrationBean.setFilter(new RequestResponseLoggingFilter());
		registrationBean.addUrlPatterns("/aml-v4/*");
		registrationBean.setOrder(1);

		return registrationBean;
	}

}
