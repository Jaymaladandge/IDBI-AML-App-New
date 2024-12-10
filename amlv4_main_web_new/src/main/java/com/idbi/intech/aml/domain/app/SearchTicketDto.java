package com.idbi.intech.aml.domain.app;

import java.util.List;

 
import lombok.Data;

@Data
public class SearchTicketDto {

	private String searchParam;
	private String searchValue;
	private String noOfCust;
	private String oldAlertCnt;
	private String strStatus;
	private String regStatus;
	private String ucicRisk;
	private String ucicRiskBg;
	private String newAlertCnt;
	private String ucicNo;
	private String respFlg;
	private String respMsg;
	private String custName;
	private List<SearchAlertDto> alertDtoList;
	private List<CustUcicMasterDto> custList;
	private List<SearchTicketDto> searchDataList;
	private boolean actionFlg;
	private String userRole;
	private CustomerDataDto custData;

}
