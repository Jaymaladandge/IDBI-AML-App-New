package com.idbi.intech.erm.domain.app;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.GrantedAuthority;

import lombok.Data;

/**
 * This class is used inject authority details
 * @author arnoldanthony
 *
 */
@ConfigurationProperties(prefix="roles")
@Configuration("roles")
@Data
public class Role implements GrantedAuthority {
	private static final long serialVersionUID = 1L;
	private String name;
	private String admin;
	private String branch;

	@Override
	public String getAuthority() {
		return this.name;
	}

}
