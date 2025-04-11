package org.identics.monolith.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

@Component
public class JwtUtils {
    private static final String USER_ID_CLAIM = "user_id";
    private static final String REALM_ACCESS_CLAIM = "realm_access";
    private static final String ROLES_CLAIM = "roles";

    /**
     * Извлекает идентификатор пользователя из токена
     * @param authentication Объект аутентификации
     * @return идентификатор пользователя или null, если не найден
     */
    public Long extractUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Jwt jwt) {
            // Пробуем получить user_id из claims
            String userIdStr = jwt.getClaimAsString(USER_ID_CLAIM);
            if (userIdStr != null) {
                try {
                    return Long.parseLong(userIdStr);
                } catch (NumberFormatException e) {
                    // В случае ошибки парсинга, логируем и продолжаем
                }
            }
            
            // Если нет user_id, пробуем использовать sub
            String subject = jwt.getSubject();
            if (subject != null) {
                try {
                    return Long.parseLong(subject);
                } catch (NumberFormatException e) {
                    // В случае ошибки парсинга, просто возвращаем null
                }
            }
        }
        
        return null;
    }

    /**
     * Получает роли пользователя из токена
     * @param authentication Объект аутентификации
     * @return массив ролей или пустой массив
     */
    public String[] extractRoles(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return new String[0];
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Jwt jwt) {
            return Optional.ofNullable(jwt.getClaimAsMap(REALM_ACCESS_CLAIM))
                    .map(realmAccess -> (Map<String, Object>) realmAccess.get(ROLES_CLAIM))
                    .map(roles -> roles.keySet().toArray(new String[0]))
                    .orElse(new String[0]);
        }
        
        return new String[0];
    }
} 