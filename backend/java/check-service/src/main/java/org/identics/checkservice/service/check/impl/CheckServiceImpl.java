package org.identics.checkservice.service.check.impl;

import lombok.RequiredArgsConstructor;
import org.identics.checkservice.domain.check.Check;
import org.identics.checkservice.domain.check.ContentType;
import org.identics.checkservice.domain.check.plagiarism.PlagiarismCheckStatus;
import org.identics.checkservice.domain.kafka.CheckCompleteMessage;
import org.identics.checkservice.repository.CheckRepository;
import org.identics.checkservice.service.check.CheckService;
import org.identics.checkservice.service.kafka.KafkaPublisher;
import org.identics.checkservice.web.requests.CheckRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CheckServiceImpl implements CheckService {
    private final CheckRepository checkRepository;
    private final KafkaPublisher kafkaPublisher;

    @Override
    public void check(CheckRequest request) {
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
                "topic"
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
}
