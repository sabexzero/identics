package org.identics.monolith.domain.check;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ContentType {
    PDF("pdf"),
    DOCX("docx"),
    TXT("txt"),
    PLAIN("plain");

    private final String value;

    public static ContentType fromValue(String value) {
        for (ContentType ct : ContentType.values()) {
            if (ct.value.equals(value)) {
                return ct;
            }
        }
        return null;
    }
}
