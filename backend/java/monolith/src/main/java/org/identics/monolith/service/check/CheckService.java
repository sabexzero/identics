package org.identics.monolith.service.check;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.dto.CheckCompleteMessage;
import org.identics.monolith.repository.CheckRepository;
import org.identics.monolith.service.redis.CheckQueueService;
import org.identics.monolith.web.requests.CheckRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckService {
    private final CheckRepository checkRepository;
    private final CheckQueueService checkQueueService;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void check(CheckRequest request) throws JsonProcessingException {
        // Создаем запись проверки
        Check check = request.toDomain();
        checkRepository.save(check);

        long checkId = check.getId();
        long contentId = check.getContentId();

        // Отправляем запрос в Kafka
        String message = objectMapper.writeValueAsString(
            request.toMessage(checkId, 1, contentId)
        );

        kafkaTemplate.send("check-request", message);
    }
}
