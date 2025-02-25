package org.identics.checkservice.configuration.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;

public class KafkaProducersTopics {
    @Bean
    public NewTopic checkRequestTopic(){
        return new NewTopic("check-request-topic", 10, (short) 1);
    }
}
