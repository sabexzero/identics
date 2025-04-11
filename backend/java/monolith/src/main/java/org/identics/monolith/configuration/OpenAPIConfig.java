package org.identics.monolith.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearer-key";
        
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Введите JWT-токен от KeyCloak в формате: Bearer {token}. " +
                                                "Важно: токен должен содержать ID пользователя в claim 'user_id' или 'sub'. " +
                                                "Пользователь может выполнять операции только с ресурсами, " +
                                                "к которым имеет доступ по ID.")))
                .info(new Info()
                        .title("Антиплагиат API")
                        .description("API для сервиса проверки текстов на плагиат. " +
                                "Для авторизации используйте токен от KeyCloak. " +
                                "Все запросы к ресурсам пользователя должны содержать соответствующий userId в URL, " +
                                "который должен совпадать с ID пользователя в JWT-токене.")
                        .version("1.0")
                        .contact(new Contact()
                                .name("Identics Support")
                                .email("support@identics.org")
                                .url("https://identics.org"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
} 