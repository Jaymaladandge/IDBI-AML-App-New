package com.idbi.intech.erm.domain.app;

import java.util.List;

import lombok.Data;

@Data
public class ControlEffectiveDto {

	private String effectiveNess;
	private String effectiveValue;
	private String colorCode;

	private List<ControlEffectiveDto> listCntrlEffectiveDto;
}
