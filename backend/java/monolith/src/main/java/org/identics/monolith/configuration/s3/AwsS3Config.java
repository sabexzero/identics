package org.identics.monolith.configuration.s3;

import java.net.URI;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AwsS3Config {
    private final String accessKey = "TEWUR6MR05EF1B94GP3O";
    private final String secretKey = "EQslVgqbSRGaSlQ1oKIysGUUfwFrLMu7KxoCiouc";
    private final String region = "ru-1"; // Например: "us-east-1"
    private final String endpoint = "https://s3.twcstorage.ru"; // Например: "us-east-1"

    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);
        return S3Client.builder()
            .region(Region.of(region))
            .endpointOverride(URI.create(endpoint))
            .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
            .build();
    }
}