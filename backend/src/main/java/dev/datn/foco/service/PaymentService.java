package dev.datn.foco.service;

import dev.datn.foco.dto.request.PaymentRequest;
import dev.datn.foco.dto.respone.PaymentResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(PaymentRequest request);

    PaymentResponse getPaymentById(Long id);

    List<PaymentResponse> getPaymentsByOrder(Long orderId);

    PaymentResponse getPaymentByTransactionId(String transactionId);

    PaymentResponse updatePaymentStatus(Long id, String status);

    PaymentResponse confirmPayment(Long id);

    void deletePayment(Long id);
}
