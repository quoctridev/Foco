package dev.datn.foco.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomerTierRequest {
    private String name;
    private Long minPoint;
    private Double discountRate;
    private String color;
    private boolean isActive;
}
