package org.identics.monolith.service;

import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.apikey.ApiKey;
import org.identics.monolith.repository.ApiKeyRepository;
import org.identics.monolith.web.advice.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class PublicApiService {
    private static final String API_KEY_HEADER = "X-API-Key";
    
    private final ApiKeyRepository apiKeyRepository;
    
    /**
     * Проверяет API-ключ и возвращает ID пользователя, если ключ действителен
     * и не превышен лимит запросов.
     *
     * @param apiKey значение API-ключа
     * @return ID пользователя, которому принадлежит ключ
     * @throws ResponseStatusException если ключ недействителен или превышен лимит запросов
     */
    public Long validateApiKeyAndGetUserId(String apiKey) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "API-ключ отсутствует");
        }
        
        ApiKey keyEntity = apiKeyRepository.findByKeyValueAndEnabledTrue(apiKey)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Недействительный API-ключ"));
        
        LocalDateTime now = LocalDateTime.now();
        
        // Проверка ограничения частоты запросов: не более 1 запроса в секунду
        if (keyEntity.getLastUsedAt() != null) {
            long millisSinceLastRequest = ChronoUnit.MILLIS.between(keyEntity.getLastUsedAt(), now);
            
            if (millisSinceLastRequest < 1000) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, 
                        "Превышен лимит запросов. Максимум 1 запрос в секунду.");
            }
        }
        
        // Обновляем время последнего использования
        keyEntity.setLastUsedAt(now);
        apiKeyRepository.save(keyEntity);
        
        return keyEntity.getUserId();
    }
} 