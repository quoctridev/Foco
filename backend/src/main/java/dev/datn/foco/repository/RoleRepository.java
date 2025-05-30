package dev.datn.foco.repository;

import dev.datn.foco.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role save(Role role);
}
