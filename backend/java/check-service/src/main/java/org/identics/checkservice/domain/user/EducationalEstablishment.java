package org.identics.checkservice.domain.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "educational_establishments")
public class EducationalEstablishment {
    @Id
    private String id;

    private String title;
}
