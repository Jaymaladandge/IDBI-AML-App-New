package com.idbi.intech.aml.domain.app;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import lombok.Data;

@ConfigurationProperties(prefix = "available-product-list")
@Configuration
@Component
@Data
public class ProductMasterDto {

	private List<ChannelConfiguration> configurations;

}
