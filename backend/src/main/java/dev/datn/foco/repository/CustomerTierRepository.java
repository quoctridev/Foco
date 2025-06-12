package dev.datn.foco.repository;

import dev.datn.foco.model.CustomerTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerTierRepository extends JpaRepository<CustomerTier, Long> {

}
