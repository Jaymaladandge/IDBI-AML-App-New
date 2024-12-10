package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class CardTransactionDto {
private String custId;
private String cardNumber;
private String cmsAccountNumber;
private String txnReferenceNumber;
private String txnDate;
private String txnCode;
private String txnAmount;
private String txnCurrency;
private String transactionDescription;
private String mcc;
private String setDate;
private String cdIndi;
private String approvalCode;
private String channelId;
}
