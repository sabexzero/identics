package org.identics.monolith.service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CheckQueueService {
    private final StringRedisTemplate redisTemplate;
    private final String CHECKS_QUEUE = "checkQueue";

    public void addToQueue(String message) {
        redisTemplate.opsForList().leftPush(CHECKS_QUEUE, message);
    }
}