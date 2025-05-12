package org.identics.monolith.domain.check;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "document_registry")
public class DocumentRegistry {
    @Id
    @Column(name = "doc_uuid", nullable = false, updatable = false)
    private UUID docUuid; // Имя поля совпадает с column name после преобразования

    @Column(name = "title", nullable = false, length = 1024)
    private String title;

    @Column(name = "article_url", nullable = false, length = 1024)
    private String articleUrl;

    @Column(name = "pdf_url", nullable = false, length = 1024)
    private String pdfUrl;

    @Column(name = "processed_sentence_count", nullable = false, length = 1024)
    private String processedSentenceCount;

    @Column(name = "source_info", columnDefinition = "TEXT") // Явно указываем TEXT
    private String sourceInfo;

    @Column(name = "word_count")
    private Integer wordCount;

    @Column(name = "import_timestamp", nullable = false, updatable = false) // Стандартный JPA: позволяет БД установить значение
    private OffsetDateTime importTimestamp;

    @Column(name = "last_updated_timestamp")
    private OffsetDateTime lastUpdatedTimestamp;
}