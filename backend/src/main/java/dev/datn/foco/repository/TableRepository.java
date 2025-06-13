package dev.datn.foco.repository;

import dev.datn.foco.model.Tables;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TableRepository extends JpaRepository<Tables, Long> {
    List<Tables> findAllByZone_IdAndActiveTrue(Long zoneId);
}
