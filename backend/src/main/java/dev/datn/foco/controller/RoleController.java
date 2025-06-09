package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiRespone;
import dev.datn.foco.model.Role;
import dev.datn.foco.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION +"/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    ApiRespone<Role> create(@RequestBody Role role) {
        return ApiRespone.<Role>builder().code(200).data(roleService.create(role)).message("Tạo vai trò dùng thành công").build();
    }
}
