package dev.datn.foco.dto.request;

import dev.datn.foco.model.CustomerTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomerCreateRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private boolean gender;
    private Long tier;
}
