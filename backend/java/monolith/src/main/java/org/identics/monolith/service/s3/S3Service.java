package org.identics.monolith.service.s3;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class S3Service {
    private final S3Client s3Client;
    private final String bucketName = "fe90981d-d577a2de-92c5-478c-aa92-b653e9fa0a2e";

    public String uploadFile(String key, InputStream inputStream, long contentLength) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, contentLength));

        return generatePublicUrl(key);
    }

    private String generatePublicUrl(String key) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, "ru-1", key);
    }
}