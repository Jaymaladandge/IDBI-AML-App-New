package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class DashboardVerifierDto {

	
	private String totAlertCount;
	private String totAlertOpen;
	private String totAlertDisposed;
	private String strPendigCount;
	private AlertDisposedDto alertDisposedDto;
}
