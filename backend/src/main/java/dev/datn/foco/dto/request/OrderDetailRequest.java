package dev.datn.foco.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailRequest {
    private Long itemId;
    private Integer quantity;
    private String specialInstructions;
    private List<OrderDetailOptionRequest> options;
}

