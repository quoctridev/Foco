package dev.datn.foco.repository;

import dev.datn.foco.model.Zone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findAllByStore_StoreIdAndActiveTrue(Long storeId);
}

