package dev.datn.foco.repository;

import dev.datn.foco.model.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {

    Optional<Discount> findByCode(String code);

    List<Discount> findByActive(Boolean active);

    @Query("SELECT d FROM Discount d WHERE d.active = true " +
            "AND d.startDate <= :now AND d.endDate >= :now " +
            "AND (d.usageLimit IS NULL OR d.usedCount < d.usageLimit)")
    List<Discount> findValidDiscounts(@Param("now") LocalDateTime now);

    List<Discount> findByApplicableTo(String applicableTo);
}
