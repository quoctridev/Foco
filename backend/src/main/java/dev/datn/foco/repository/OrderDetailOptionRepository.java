package dev.datn.foco.repository;

import dev.datn.foco.model.OrderDetailOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailOptionRepository extends JpaRepository<OrderDetailOption, Long> {
    List<OrderDetailOption> findByOrderDetailId(Long orderDetailId);
}

