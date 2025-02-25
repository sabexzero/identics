package org.identics.checkservice.service.check.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.NewTopic;
import org.identics.checkservice.domain.check.Check;
import org.identics.checkservice.domain.check.ContentType;
import org.identics.checkservice.domain.check.plagiarism.PlagiarismCheckStatus;
import org.identics.checkservice.domain.kafka.CheckCompleteMessage;
import org.identics.checkservice.repository.CheckRepository;
import org.identics.checkservice.service.check.CheckService;
import org.identics.checkservice.service.kafka.KafkaPublisher;
import org.identics.checkservice.web.requests.CheckRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckServiceImpl implements CheckService {
    private final CheckRepository checkRepository;
    private final KafkaPublisher kafkaPublisher;
    private final NewTopic checkRequestTopic;

    @Override
    public void check(CheckRequest request) throws JsonProcessingException {
        Check createdCheck = checkRepository.save(request.toDomain());
        kafkaPublisher.publish(
                request.toMessage(
                        createdCheck.getId(),
                        checkRepository.findByPlagiarismCheckResultStatus(
                                PlagiarismCheckStatus.IN_PROGRESS
                        ).size(),
                        request.contentType().equals(ContentType.RAW_TEXT)
                                ? request.content().getContent()
                                : "file_content"//TODO: GET_FILE_CONTENT
                ),
                checkRequestTopic.toString()
        );
    }

    @Override
    public void handleCheckResult(CheckCompleteMessage message) {
        Check checkToHandle = checkRepository.findById(message.getCheckId())
                .orElseThrow(() -> new IllegalArgumentException("Check to handle not found"));

        checkRepository.save(checkToHandle.updateResults(
                message.getPlagiarismCheckResult(),
                message.getAiCheckResult()
        ));
    }

    @Override
    // Метод для получения Check по userId с пагинацией
    public Page<Check> getAll(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return checkRepository.findByUserId(userId, pageable);
    }
}
