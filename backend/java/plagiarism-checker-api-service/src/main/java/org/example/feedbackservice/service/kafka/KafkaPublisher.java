package org.example.feedbackservice.service.kafka;

import lombok.RequiredArgsConstructor;
import org.shuttle.kafka.feedback.UserFeedbackMessage;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class KafkaPublisher {
    private final KafkaTemplate<String, UserFeedbackMessage> userFeedbackKafkaTemplate;


    public void publishBatch(UserFeedbackMessage message, String topic){
        userFeedbackKafkaTemplate.send(topic, message);
    }

    public void publish(UserFeedbackMessage message, String topic) {
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
