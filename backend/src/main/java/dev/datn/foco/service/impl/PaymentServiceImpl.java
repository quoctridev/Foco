package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.PaymentRequest;
import dev.datn.foco.dto.respone.PaymentResponse;
import dev.datn.foco.model.Order;
import dev.datn.foco.model.Payment;
import dev.datn.foco.model.Tables;
import dev.datn.foco.repository.OrderRepository;
import dev.datn.foco.repository.PaymentRepository;
import dev.datn.foco.repository.TableRepository;
import dev.datn.foco.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(request.getPaymentMethod())
                .amountPaid(request.getAmountPaid())
                .transactionId(request.getTransactionId())
                .paymentGateway(request.getPaymentGateway())
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    @Override
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thanh toán"));
        return mapToResponse(payment);
    }

    @Override
    public List<PaymentResponse> getPaymentsByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponse getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thanh toán"));
        return mapToResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thanh toán"));
        payment.setPaymentStatus(status);
        Payment updatedPayment = paymentRepository.save(payment);
        return mapToResponse(updatedPayment);
    }

    @Override
    @Transactional
    public PaymentResponse confirmPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thanh toán"));
        payment.setPaymentStatus("completed");
        payment.setPaidAt(LocalDateTime.now());
        Payment updatedPayment = paymentRepository.save(payment);

        // Cập nhật trạng thái đơn hàng thành "completed"
        Order order = payment.getOrder();
        order.setStatus("completed");
        orderRepository.save(order);

        // Nếu đơn hàng có bàn, đổi trạng thái bàn về "available"
        if (order.getTable() != null) {
            Tables table = order.getTable();
            table.setStatus("available");
            tableRepository.save(table);
        }

        return mapToResponse(updatedPayment);
    }

    @Override
    @Transactional
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .orderNumber(payment.getOrder().getOrderNumber())
                .paymentMethod(payment.getPaymentMethod())
                .amountPaid(payment.getAmountPaid())
                .paymentStatus(payment.getPaymentStatus())
                .transactionId(payment.getTransactionId())
                .paymentGateway(payment.getPaymentGateway())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
