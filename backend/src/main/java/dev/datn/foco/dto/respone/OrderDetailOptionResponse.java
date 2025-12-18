package dev.datn.foco.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailOptionResponse {
    private Long id;
    private Long valueId;
    private String valueName;
    private Integer quantity;
    private BigDecimal extraPrice;
}

