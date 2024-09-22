package org.identics.checkservice.domain.check;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * <ul>
 *     <li>
 *         Если тип контента {@link ContentType}, является текстом, то {@link #content}
 *         будет является буквально текстовым контентом.
 *      </li>
 *     <li>
 *         Если тип контента {@link ContentType}, является файлом, то {@link #content}
 *         будет являться ссылкой на файл.
 *      </li>
 * </ul>
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckContent {
    private String title;
    private String content;
}
