package com.idbi.intech.oms.domain.app;

import lombok.Data;

@Data
public class OmsBranchMasterDto {

	private String branchId;
	private String branchName;
	private String zoneName;
	private String zoneId;
	private String regionName;
	private String regionId;
	private String delFlg;
}
