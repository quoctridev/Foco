package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.UserCreateRequest;
import dev.datn.foco.dto.request.UserUpdateRequest;
import dev.datn.foco.dto.respone.UserResponse;
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
    ApiResponse<List<UserResponse>> getAllUser() {
        return ApiResponse.<List<UserResponse>>builder()
                .data(userService.findAll()).code(200).message("Lấy danh sách dữ liệu thành công").build();
    }
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/{id}")
    ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        return ApiResponse.<UserResponse>builder()
                .data(userService.findById(id)).code(200).message("Lấy dữ liệu thành công").build();
    }
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CHEF','ORDER')")
    @PutMapping("/{id}")
    ApiResponse<UserResponse> updateUser(@RequestBody UserUpdateRequest request, @PathVariable Long id) {
        return ApiResponse.<UserResponse>builder().data(userService.update(request, id)).code(200).message("Cập nhật thành công").build();
    }
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody UserCreateRequest user) {
        return ApiResponse.<UserResponse>builder().data(userService.create(user)).code(200).message("Tạo người dùng thành công").build();
    }
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/store")
    ApiResponse<List<UserResponse>> findByStoreId(@RequestParam Long storeId) {
        return ApiResponse.<List<UserResponse>>builder().data(userService.findByStoreId(storeId)).code(200).message("Lấy danh sách dữ liệu thành công").build();

    }

}
