package org.identics.monolith.domain.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReportFileFormat {
    HTML("html", "text/html"),
    PDF("pdf", "application/pdf");

    private final String extension;
    private final String contentType;
}
