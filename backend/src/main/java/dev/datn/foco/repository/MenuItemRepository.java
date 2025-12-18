package dev.datn.foco.repository;

import dev.datn.foco.model.MenuItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItems, Long> {
    List<MenuItems> findByCategoryId(Long categoryId);
    
    List<MenuItems> findByAvailable(boolean available);
    
    List<MenuItems> findByNameContainingIgnoreCase(String name);
}

