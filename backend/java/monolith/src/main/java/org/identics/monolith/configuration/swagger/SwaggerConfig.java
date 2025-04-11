package org.identics.monolith.configuration.swagger;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        Server devServer = new Server();
        devServer.setDescription("Development Server");
        devServer.setUrl("http://193.108.115.65:9091");

        Info info = new Info();
        info.setTitle("Plagiarism Checker API");

        OpenAPI openAPI = new OpenAPI();
        openAPI.setServers(Arrays.asList(devServer));
        openAPI.setInfo(info);
        return openAPI;
    }
}