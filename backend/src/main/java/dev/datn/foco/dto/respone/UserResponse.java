package dev.datn.foco.dto.respone;

import dev.datn.foco.model.Store;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String phone;
    private Long roleId;
    private String roleName;
    private Store storeId;
    private boolean isActive;
    private LocalDateTime createdAt;
}
