package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiRespone;
import dev.datn.foco.dto.request.UserCreateRequest;
import dev.datn.foco.dto.request.UserUpdateRequest;
import dev.datn.foco.dto.respone.UserRespone;
import dev.datn.foco.model.User;
import dev.datn.foco.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION +"/user")
public class UserController {
    @Autowired
    private UserService userService;
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    ApiRespone<List<UserRespone>> getAllUser() {
        return ApiRespone.<List<UserRespone>>builder()
                .data(userService.findAll()).code(200).message("Lấy danh sách dữ liệu thành công").build();
    }
    @GetMapping("/{id}")
    ApiRespone<UserRespone> getUserById(@PathVariable Long id) {
        return ApiRespone.<UserRespone>builder()
                .data(userService.findById(id)).code(200).message("Lấy dữ liệu thành công").build();
    }
    @PutMapping("/{id}")
    ApiRespone<UserRespone> updateUser(@RequestBody UserUpdateRequest request, @PathVariable Long id) {
        return ApiRespone.<UserRespone>builder().data(userService.update(request, id)).code(200).message("Cập nhật thành công").build();
    }
    @PostMapping
    ApiRespone<UserRespone> createUser(@RequestBody UserCreateRequest user) {
        return ApiRespone.<UserRespone>builder().data(userService.create(user)).code(200).message("Tạo người dùng thành công").build();
    }

}
