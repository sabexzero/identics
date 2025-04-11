package org.identics.monolith.service.check;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.check.ai.AiCheckStatus;
import org.identics.monolith.domain.check.plagiarism.PlagiarismCheckStatus;
import org.identics.monolith.domain.kafka.CheckRequestMessage;
import org.identics.monolith.dto.CheckCompleteMessage;
import org.identics.monolith.json.JsonUtils;
import org.identics.monolith.repository.CheckRepository;
import org.identics.monolith.service.redis.CheckQueueService;
import org.identics.monolith.web.requests.CheckRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckService {
    private final CheckRepository checkRepository;
    private final CheckQueueService checkQueueService;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public Check getCheckByContentId(Long contentId) {
        return checkRepository.findByContentId(contentId)
            .orElseThrow(() -> new IllegalArgumentException("Проверка для документа с ID " + contentId + " не найдена"));
    }

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

    public void handleCheckResult(Long checkId, CheckCompleteMessage result) {
        // Обновляем статус проверки
        Check check = checkRepository.findById(checkId)
            .orElseThrow(() -> new IllegalArgumentException("Check not found"));

        boolean isAiCheck = result.getAiCheckResult() != null;
        boolean isPlagiarismCheck = result.getOverallPlagiarism() != null;

        Check.CheckBuilder updatedCheckBuilder = check.toBuilder();

        if (isAiCheck) {
            updatedCheckBuilder.aiCheckStatus(AiCheckStatus.COMPLETE);
            updatedCheckBuilder.aiCheckLevel(result.getAiCheckResult());
        }

        if (isPlagiarismCheck) {
            updatedCheckBuilder.plagiarismCheckStatus(PlagiarismCheckStatus.COMPLETE);
            updatedCheckBuilder.plagiarismLevel(result.getOverallPlagiarism());
        }

        checkRepository.save(updatedCheckBuilder.build());
    }
}
