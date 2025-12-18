package dev.datn.foco.repository;

import dev.datn.foco.model.MenuItemOptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemOptionRepository extends JpaRepository<MenuItemOptions, Long> {
    List<MenuItemOptions> findByMenuItem_Id(Long itemId);

    List<MenuItemOptions> findByActive(boolean active);
}
