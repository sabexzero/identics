package org.identics.monolith.service.s3;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URL;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ChecksumAlgorithm;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.InputStream;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    /**
     * Загружает файл из MultipartFile в S3.
     * (Ваш существующий метод)
     */
    public String uploadDocument(String objectKey, MultipartFile file) throws IOException {
        String contentType = determineContentType(file);
        log.info("Uploading MultipartFile with key '{}' and content type '{}'", objectKey, contentType);
        return uploadToS3(objectKey, file.getInputStream(), file.getSize(), contentType);
    }

    /**
     * НОВЫЙ МЕТОД: Загружает файл из байтового массива в S3.
     *
     * @param objectKey     Полный ключ объекта в S3 (например, "reports/Textsource-report-uuid.pdf").
     * @param contentBytes  Содержимое файла в виде байтового массива.
     * @param contentType   MIME-тип контента (например, "application/pdf").
     * @return Публичный URL загруженного объекта.
     * @throws RuntimeException Если произошла ошибка при загрузке в S3.
     */
    public String uploadGeneratedReport(String objectKey, byte[] contentBytes, String contentType) {
        log.info("Uploading generated report with key '{}' and content type '{}'", objectKey, contentType);
        long contentLength = contentBytes.length;
        try (InputStream inputStream = new ByteArrayInputStream(contentBytes)) {
            return uploadToS3(objectKey, inputStream, contentLength, contentType);
        } catch (IOException e) {
            // IOException от ByteArrayInputStream маловероятен, но для полноты картины
            log.error("Unexpected IOException while creating InputStream from byte array for key {}", objectKey, e);
            throw new RuntimeException("Failed to create InputStream for S3 upload for key: " + objectKey, e);
        }
    }


    /**
     * Приватный метод для выполнения фактической загрузки в S3 из InputStream.
     */
    private String uploadToS3(String objectKey, InputStream inputStream, long contentLength, String contentType) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .acl(ObjectCannedACL.PUBLIC_READ)
            .contentType(contentType)
            .contentLength(contentLength) // Указываем длину контента
            .checksumAlgorithm(ChecksumAlgorithm.CRC32_C) // Опционально
            .checksumCRC32C("when_required")
            .build();

        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, contentLength));
            log.info("Successfully uploaded file to s3://{}/{}", bucketName, objectKey);
            return getObjectPublicUrl(objectKey); // Возвращаем URL
        } catch (S3Exception e) {
            log.error("Failed to upload to S3 key {}: {}", objectKey, e.getMessage(), e);
            throw new RuntimeException("S3 upload failed for key: " + objectKey, e);
        }
    }

    /**
     * Определяет ContentType (MIME type) файла.
     * Сначала пытается использовать тип, предоставленный клиентом (браузером).
     * Если он отсутствует или общий (octet-stream), пытается определить по расширению файла.
     *
     * @param file Загружаемый файл.
     * @return Определенный ContentType или "application/octet-stream" по умолчанию.
     */
    private String determineContentType(MultipartFile file) {
        String providedContentType = file.getContentType();

        // Доверяем ContentType от клиента, если он есть и не является общим 'octet-stream'
        if (providedContentType != null && !providedContentType.isBlank()
            && !providedContentType.equalsIgnoreCase("application/octet-stream")) {
            log.debug("Using provided content type: {}", providedContentType);
            return providedContentType;
        }

        // Если тип от клиента не подходит, пытаемся определить по расширению
        String filename = file.getOriginalFilename();
        log.debug("Provided content type is null or generic, determining from filename: {}", filename);
        return determineContentTypeFromExtension(filename);
    }

    /**
     * Определяет ContentType по расширению файла.
     *
     * @param filename Имя файла.
     * @return MIME тип или "application/octet-stream" по умолчанию.
     */
    private String determineContentTypeFromExtension(String filename) {
        String extension = StringUtils.getFilenameExtension(filename);
        if (extension == null) {
            log.warn("Cannot determine extension for filename: {}, using default content type.", filename);
            return "application/octet-stream"; // Тип по умолчанию, если расширения нет
        }

        // Простой switch для самых распространенных типов
        return switch (extension.toLowerCase()) {
            case "pdf" -> "application/pdf";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "txt" -> "text/plain";
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "gif" -> "image/gif";
            case "xls" -> "application/vnd.ms-excel";
            case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "zip" -> "application/zip";
            case "html", "htm" -> "text/html";
            case "css" -> "text/css";
            case "js" -> "application/javascript";
            // Добавьте другие нужные типы
            default -> {
                log.debug("Unknown extension '{}', using default content type.", extension);
                yield "application/octet-stream"; // Тип по умолчанию для неизвестных расширений
            }
        };
    }

    /**
     * Генерирует публичный URL для объекта в S3.
     * Работает корректно, если ACL объекта установлен в public-read.
     *
     * @param objectKey Ключ объекта в S3.
     * @return Строковое представление URL.
     * @throws RuntimeException если произошла ошибка при получении URL из S3.
     */
    public String getObjectPublicUrl(String objectKey) {
        try {
            GetUrlRequest request = GetUrlRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

            URL url = s3Client.utilities().getUrl(request);
            log.debug("Generated public URL for key {}: {}", objectKey, url);
            return url.toString();
        } catch (S3Exception e) {
            log.error("Failed to get public URL for S3 key {}: {}", objectKey, e.getMessage(), e);
            throw new RuntimeException("S3 get URL failed for key: " + objectKey, e);
        }
    }

    private String generatePresignedUrl(String objectKey) {
        GetUrlRequest request = GetUrlRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .build();

        return s3Client.utilities().getUrl(request).toString();
    }

    public String generatePublicUrl(String objectKey) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s",
            bucketName, region, objectKey);
    }
}