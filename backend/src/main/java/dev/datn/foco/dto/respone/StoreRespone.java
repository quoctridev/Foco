package dev.datn.foco.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreRespone {
    private Long storeId;
    private String name;
    private String address;
    private String phone;
    private String email;
    private boolean isActive;
    private LocalDateTime createdAt;
}
