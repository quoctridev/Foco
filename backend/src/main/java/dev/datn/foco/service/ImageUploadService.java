package dev.datn.foco.service;

import dev.datn.foco.config.CloudflareProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service
@RequiredArgsConstructor

public class ImageUploadService {
    private final S3Client s3Client;
    private final CloudflareProperties cloudflareProperties;

    public String upload(MultipartFile file, String folder, String id, String number) {
        String fileName = folder + "/" + id + "-" + number;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(cloudflareProperties.getBucket())
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            byte[] bytes = file.getBytes();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(bytes));

            String publicUrl = cloudflareProperties.getPublicUrl();
            if (publicUrl != null && !publicUrl.isEmpty()) {
                return publicUrl + "/" + fileName;
            } else {
                return cloudflareProperties.getEndpoint() + "/" + cloudflareProperties.getBucket() + "/" + fileName;
            }
        } catch (IOException e) {
            throw new RuntimeException("Gửi ảnh lên thất bại: " + e.getMessage(), e);
        }
    }
}
