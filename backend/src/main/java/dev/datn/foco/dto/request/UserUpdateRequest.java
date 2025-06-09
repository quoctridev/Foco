package dev.datn.foco.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import dev.datn.foco.model.Role;
import dev.datn.foco.model.Store;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserUpdateRequest {
    private String username;
    private String name;
    private String password;
    private String phone;
    private String email;
    private Role roleId;
    private Store storeId;
    private boolean isActive;
}
