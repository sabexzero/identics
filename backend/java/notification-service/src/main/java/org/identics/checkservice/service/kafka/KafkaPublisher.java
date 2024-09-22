package org.identics.checkservice.service.kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class KafkaPublisher {
    private final KafkaTemplate<String, String> userFeedbackKafkaTemplate;

    public void publishBatch(String message, String topic){
        userFeedbackKafkaTemplate.send(topic, message);
    }

    public void publish(String message, String topic) {
        // Количество потоков
        int NUM_THREADS = 10;
        try (ExecutorService executorService = Executors.newFixedThreadPool(NUM_THREADS)) {
            for (int i = 0; i < 10000; i++) {
                executorService.submit(() -> publishBatch(message, topic));
            }
            executorService.shutdown();
        }
    }

}
