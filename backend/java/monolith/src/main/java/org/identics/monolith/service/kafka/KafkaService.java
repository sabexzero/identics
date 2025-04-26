package org.identics.monolith.service.kafka;// KafkaService.java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.service.check.CheckService;
import org.identics.monolith.web.dto.kafka.TaskRequest;
import org.identics.monolith.web.dto.kafka.TaskResult;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaService {
    private static final String TASK_RESULT_TOPIC = "plagiarism_results";
    private final CheckService checkService;

    @KafkaListener(topics = TASK_RESULT_TOPIC, groupId = "task-result-group")
    public void handleTaskResult(String message) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        TaskResult taskResult = objectMapper.readValue(message, TaskResult.class);

        checkService.handleCompletedCheck(taskResult);
    }
}