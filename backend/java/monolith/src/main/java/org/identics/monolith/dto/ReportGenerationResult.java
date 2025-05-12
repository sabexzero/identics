package org.identics.monolith.dto;

import org.identics.monolith.domain.user.ReportFileFormat;

public record ReportGenerationResult(
    String url,
    ReportFileFormat actualFormat
) {
}
