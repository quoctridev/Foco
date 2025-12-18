package dev.datn.foco.repository;

import dev.datn.foco.model.MenuItemOptionValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemOptionValueRepository extends JpaRepository<MenuItemOptionValues, Long> {
    List<MenuItemOptionValues> findByOption_Id(Long optionId);
    
    List<MenuItemOptionValues> findByActive(boolean active);
}

