package dev.datn.foco.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Long storeId;
    private Long tableId;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String orderType; // dine_in, takeaway, delivery
    private Integer pointsUsed;
    private String notes;
    private List<OrderDetailRequest> orderDetails;
}

