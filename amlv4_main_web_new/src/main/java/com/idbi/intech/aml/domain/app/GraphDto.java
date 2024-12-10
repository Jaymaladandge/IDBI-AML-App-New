package com.idbi.intech.aml.domain.app;

import java.util.List;

import com.idbi.intech.oms.domain.app.AccountStatementDto;

import lombok.Data;

@Data
public class GraphDto {

	private String neftRtgs;
	private String cashAtBranch;
	private String cashAtATM;
	private String imps;
	private String upi;
	private String cbwtr;
	private String genTransaction;
	private String neftRtgsCount;
	private String cashAtBranchCount;
	private String cashAtATMCount;
	private String impsCount;
	private String upiCount;
	private String cbwtrCount;
	private String genTransactionCount;
	private String neftRtgsSumValue;
	private String cashAtBranchSumValue;
	private String cashAtATMSumValue;
	private String impsSumValue;
	private String upiSumValue;
	private String cbwtrSumValue;
	private String genTransactionSumValue;
	private List<TransactionChannelDto> tranChannelCredit;
	private List<TransactionChannelDto> tranChannelDebit;
	private List<String> labelList;
	private List<String> trendChartCredDebt;
	private String tranAcid;
	private String startDate;
	private String endDate;
    private String accountId;
	private List<String> debt3MonthList;
	private List<String> credit3MonthList;
	private String totCrdtCount;
	private String totCrdtValue;
	private String totCrdtValueFrmt;
	private String totDbtCount;
	private String totDbtValue;
	private String totDbtValueFrmt;
	private String credDebtFlag;
	private String channelType;
	private List<AccountStatementDto> accountDtoList;
}
