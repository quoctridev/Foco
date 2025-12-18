package dev.datn.foco.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;


@Configuration
@EnableConfigurationProperties(CloudflareProperties.class)
@RequiredArgsConstructor
public class CloudflareR2Config {

    private final CloudflareProperties cloudflareProperties;

    @Bean
    public S3Client s3Client(){
        S3Configuration serviceConfig = S3Configuration.builder()
                // path-style is required for R2
                .pathStyleAccessEnabled(true)
                // disable AWS4 chunked uploads
                .chunkedEncodingEnabled(false)
                .build();

        // Trim whitespace from credentials and endpoint
        String endpoint = cloudflareProperties.getEndpoint() != null ? cloudflareProperties.getEndpoint().trim() : "";
        String accessKey = cloudflareProperties.getAccessKey() != null ? cloudflareProperties.getAccessKey().trim() : "";
        String secretKey = cloudflareProperties.getSecretKey() != null ? cloudflareProperties.getSecretKey().trim() : "";

        return S3Client.builder()
                .httpClientBuilder(ApacheHttpClient.builder())
                .region(Region.of("auto"))
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .serviceConfiguration(serviceConfig)
                .build();
    }
}
