package dev.datn.foco.repository;

import dev.datn.foco.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByStore_StoreId(Long storeId);

    List<Order> findByCustomer_Id(Long customerId);

    List<Order> findByStatus(String status);

    List<Order> findByTable_Id(Long tableId);

    @Query("SELECT o FROM Order o WHERE o.store.storeId = :storeId AND o.status = :status")
    List<Order> findByStoreIdAndStatus(@Param("storeId") Long storeId, @Param("status") String status);

    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o FROM Order o WHERE o.store.storeId = :storeId AND o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findByStoreIdAndDateRange(@Param("storeId") Long storeId, @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
