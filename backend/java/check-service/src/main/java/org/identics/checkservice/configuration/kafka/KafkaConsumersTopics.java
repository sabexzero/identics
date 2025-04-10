package org.identics.checkservice.configuration.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConsumersTopics {
    @Bean
    public NewTopic checkCompleteTopic() {
        return new NewTopic("check-complete-topic", 10, (short) 1);
    }
}
