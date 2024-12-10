package com.idbi.intech.aml.domain.app;

import lombok.Data;

@Data
public class StrMisDto {

    private String requestId;
    private String ucicId;
    private String customerId;
    private String customerName;
    private String accountNumber;
    private String accountName;
    private String openDate;
    private String accountStatus;
    private String riskCode;
    private String ruleId;
    private String ruleDescription;
    private String currentStatus;
    private String analystId;
    private String analystComment;
    private String reviewerId;
    private String reviewerComment;
    private String verifierId;
    private String verifierComment;
    private String userId;
}

