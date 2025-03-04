package org.identics.checkservice.configuration.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConsumersTopics {
    @Bean
    public NewTopic userRatingChangerTopic(){
        return new NewTopic("user-rating-changer-topic", 10, (short) 1);
    }
}
