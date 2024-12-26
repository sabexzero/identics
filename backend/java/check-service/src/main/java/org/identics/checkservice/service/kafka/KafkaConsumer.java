package org.identics.checkservice.service.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.NewTopic;
import org.identics.checkservice.domain.kafka.CheckCompleteMessage;
import org.identics.checkservice.service.check.CheckService;
import static org.identics.checkservice.utils.json.JsonUtils.readJson;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumer {
    private final CheckService checkService;

    @KafkaListener(topics = "check-complete-topic", groupId = "check-complete-group",
            containerFactory = "checkCompleteKafkaListenerContainerFactory")
    public void listenCheckCompleteTopic(String checkCompleteMessage) throws IOException {
        log.info("Received message through MessageConverterPilotListener [{}]", checkCompleteMessage);
        checkService.handleCheckResult(
            readJson(checkCompleteMessage, CheckCompleteMessage.class)
        );
    }
}
