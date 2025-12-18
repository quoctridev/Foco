package dev.datn.foco.repository;

import dev.datn.foco.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrderId(Long orderId);

    List<Payment> findByPaymentStatus(String status);

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findByPaymentMethod(String paymentMethod);
}
