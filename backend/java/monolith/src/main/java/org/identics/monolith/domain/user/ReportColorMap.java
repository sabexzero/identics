package org.identics.monolith.domain.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReportColorMap {
    BLUE_GREEN_ORANGE("", "", "");

    private final String hexFirstColor;
    private final String hexSecondColor;
    private final String hexThirdColor;
}
