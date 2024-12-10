package com.idbi.intech.erm.service;

public interface ErmPrimaryKeyGeneratorService {
	public String getAppPrimaryKey();
	public String getAppUserPrimaryKey();
	public String getModulePrimaryKey(String moduleName);
	public String getIMPrimaryKey(String moduleName,String ofcType);
}
