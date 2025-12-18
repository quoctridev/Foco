package dev.datn.foco.repository;

import dev.datn.foco.model.Inventory;
import dev.datn.foco.model.InventoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, InventoryId> {
    List<Inventory> findByStoreId(Long storeId);

    List<Inventory> findByItemId(Long itemId);

    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.minStockLevel")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.storeId = :storeId AND i.quantity <= i.minStockLevel")
    List<Inventory> findLowStockItemsByStore(@Param("storeId") Long storeId);
}
