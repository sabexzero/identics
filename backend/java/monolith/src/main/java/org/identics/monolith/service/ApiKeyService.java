package org.identics.monolith.service;

import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.apikey.ApiKey;
import org.identics.monolith.domain.user.User;
import org.identics.monolith.dto.ApiKeyDTO;
import org.identics.monolith.repository.ApiKeyRepository;
import org.identics.monolith.repository.UserRepository;
import org.identics.monolith.web.advice.ResourceNotFoundException;
import org.identics.monolith.web.requests.CreateApiKeyRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApiKeyService {
    private static final String KEY_PREFIX = "id_";
    private static final int KEY_BYTES_LENGTH = 32;
    
    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;
    private final SecureRandom secureRandom = new SecureRandom();
    
    public List<ApiKeyDTO> getUserApiKeys(Long userId) {
        validateUserExists(userId);
        return apiKeyRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ApiKeyDTO createApiKey(Long userId, CreateApiKeyRequest request) {
        validateUserExists(userId);
        
        String keyValue = generateApiKey();
        
        ApiKey apiKey = ApiKey.builder()
                .userId(userId)
                .keyValue(keyValue)
                .name(request.getName())
                .createdAt(LocalDateTime.now())
                .enabled(true)
                .build();
        
        return mapToDto(apiKeyRepository.save(apiKey));
    }
    
    @Transactional
    public void revokeApiKey(Long userId, Long keyId) {
        ApiKey apiKey = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("API Key", keyId));
        
        if (!apiKey.getUserId().equals(userId)) {
            throw new IllegalArgumentException("API Key does not belong to user");
        }
        
        apiKey.setEnabled(false);
        apiKeyRepository.save(apiKey);
    }
    
    private String generateApiKey() {
        byte[] randomBytes = new byte[KEY_BYTES_LENGTH];
        secureRandom.nextBytes(randomBytes);
        return KEY_PREFIX + Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
    
    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", userId);
        }
    }
    
    private ApiKeyDTO mapToDto(ApiKey apiKey) {
        return ApiKeyDTO.builder()
                .id(apiKey.getId())
                .userId(apiKey.getUserId())
                .keyValue(apiKey.getKeyValue())
                .name(apiKey.getName())
                .createdAt(apiKey.getCreatedAt())
                .lastUsedAt(apiKey.getLastUsedAt())
                .expiresAt(apiKey.getExpiresAt())
                .enabled(apiKey.isEnabled())
                .build();
    }
} 