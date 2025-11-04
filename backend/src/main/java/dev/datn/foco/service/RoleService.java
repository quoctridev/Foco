package dev.datn.foco.service;

import dev.datn.foco.model.Role;
import dev.datn.foco.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Role create(Role role) {
        return roleRepository.save(role);
    }
}
