package dev.datn.foco.dto.respone;

import dev.datn.foco.model.CustomerTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private boolean gender;
    private Double points;
    private CustomerTier tier;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
