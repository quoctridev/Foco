package dev.datn.foco.dto.request;

import dev.datn.foco.model.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRequest {
    private String name;
    private String username;
    private String email;
    private String password;
    private String phone;
    private Role role;
    private Long storeId;
}
