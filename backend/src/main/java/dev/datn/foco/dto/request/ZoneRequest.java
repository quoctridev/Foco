package dev.datn.foco.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ZoneRequest {
    private String name;
    private Long storeId;
    private String description;
    private boolean active;
}
