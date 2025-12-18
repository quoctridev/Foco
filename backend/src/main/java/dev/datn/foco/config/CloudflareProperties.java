package dev.datn.foco.config;

import lombok.*;
import org.springframework.boot.context.properties.ConfigurationProperties;


@Getter
@Setter
@ConfigurationProperties(prefix = "cloudflare.r2")
public class CloudflareProperties {
    private String accountId;
    private String accessKeyId;
    private String secretAccessKey;
    private String bucketName;
    private String publicUrl;
    
    public String getEndpoint() {
        if (accountId != null && !accountId.isEmpty()) {
            return "https://" + accountId + ".r2.cloudflarestorage.com";
        }
        return null;
    }
    
    public String getAccessKey() {
        return accessKeyId;
    }
    
    public String getSecretKey() {
        return secretAccessKey;
    }
    
    public String getBucket() {
        return bucketName;
    }
}
