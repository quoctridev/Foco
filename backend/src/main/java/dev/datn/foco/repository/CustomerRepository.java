package dev.datn.foco.repository;

import dev.datn.foco.dto.respone.CustomerResponse;
import dev.datn.foco.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByPhone(String phone);
    Optional<Customer> findByEmail(String email);
    List<Customer> findAllByTier_Id(Long tierId);
}
