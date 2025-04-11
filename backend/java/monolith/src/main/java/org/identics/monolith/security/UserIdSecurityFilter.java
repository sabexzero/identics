package org.identics.monolith.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class UserIdSecurityFilter extends OncePerRequestFilter {
    // Новый паттерн для поиска userId сразу после /api/v{number}/
    private static final Pattern USER_ID_PATH_PATTERN =
        Pattern.compile("^/api/v\\d+/(?<userId>\\d+)(/.*)?$");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        if (isPublicPath(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        Long urlUserId = extractUserIdFromPath(requestURI);

        if (urlUserId != null) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                if (!hasUserAccess(authentication, urlUserId)) {
                    throw new AccessDeniedException("Доступ запрещен: нельзя работать с данными другого пользователя");
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicPath(String path) {
        return path.startsWith("/v3/api-docs") ||
            path.startsWith("/swagger-ui") ||
            path.startsWith("/swagger-resources") ||
            path.startsWith("/webjars") ||
            path.equals("/swagger-ui.html") ||
            path.startsWith("/api/v1/auth") ||
            path.contains("/webhook");
    }

    private Long extractUserIdFromPath(String path) {
        Matcher matcher = USER_ID_PATH_PATTERN.matcher(path);
        if (matcher.matches()) {
            try {
                return Long.parseLong(matcher.group("userId"));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private boolean hasUserAccess(Authentication authentication, Long urlUserId) {
        JwtUtils jwtUtils = new JwtUtils();
        Long tokenUserId = jwtUtils.extractUserId(authentication);

        return tokenUserId != null && tokenUserId.equals(urlUserId);
    }
}