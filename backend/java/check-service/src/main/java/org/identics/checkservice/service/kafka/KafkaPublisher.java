package org.identics.checkservice.service.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.identics.checkservice.domain.kafka.CheckCompleteMessage;
import org.identics.checkservice.domain.kafka.CheckRequestMessage;
import static org.identics.checkservice.utils.json.JsonUtils.writeJson;
import org.identics.checkservice.web.requests.CheckRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class KafkaPublisher {
    private final KafkaTemplate<String, String> checkRequestMessageKafkaTemplate;

    public void publish(CheckRequestMessage message, String topic)
        throws JsonProcessingException {
        checkRequestMessageKafkaTemplate.send(topic, writeJson(message));
    }
}
