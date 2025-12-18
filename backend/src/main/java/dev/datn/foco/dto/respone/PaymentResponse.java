package dev.datn.foco.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long orderId;
    private String orderNumber;
    private String paymentMethod;
    private BigDecimal amountPaid;
    private String paymentStatus;
    private String transactionId;
    private String paymentGateway;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}

