package com.idbi.intech.aml.domain.app;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class AlertCategoryCalDto {

    private String recId;
    private String ucicId;
    private String ruleCat;
    private Double cateWt;
    private String riskJson;
    private String penaliseJson;
    private Double percentage;
    private Double calWt;
    private Date calCate;
    private Double finalWt;
    private String ragStatus;
    private String refId;
    private String custRisk;
    private String allCatRisk;
    private String totCatRisk;
    private String derivedRisk;
    private String calMatrixRisk;
    private Integer strDays;
    private String strRisk;
    private String finalRisk;
    List<AlertCategoryCalDto> alertCatList;
}
