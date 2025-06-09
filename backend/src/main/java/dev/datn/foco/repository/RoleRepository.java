package dev.datn.foco.repository;

import dev.datn.foco.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role save(Role role);
    Optional<Role> findById(Long id);
}
