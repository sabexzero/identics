package org.identics.monolith.domain.check;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * <ul>
 *     <li>
 *         Если тип контента {@link ContentType}, является текстом, то {@link #text}
 *         будет являться буквально текстовым контентом.
 *      </li>
 *     <li>
 *         Если тип контента {@link ContentType}, является файлом, то {@link #text}
 *         будет являться ссылкой на файл.
 *      </li>
 * </ul>
 */
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String title;
    private ContentType contentType;
    @Column(columnDefinition = "TEXT")
    private String text;
}
