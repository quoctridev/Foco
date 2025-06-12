package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.AuthRequest;
import dev.datn.foco.dto.request.CustomerCreateRequest;
import dev.datn.foco.dto.respone.AuthResponse;
import dev.datn.foco.dto.respone.CustomerResponse;
import dev.datn.foco.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION + "/public/customer")
public class CustomerAuthController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/create")
    public ApiResponse<CustomerResponse> createCustomer(@RequestBody CustomerCreateRequest request) {
        return ApiResponse.<CustomerResponse>builder()
                .code(200)
                .message("Bạn đã tạo tài khoản thành công")
                .data(customerService.create(request))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> authenticate(@RequestBody AuthRequest authRequest) {
        return ApiResponse.<AuthResponse>builder()
                .code(200)
                .message("Bạn đã đăng nhập thành công")
                .data(customerService.authenticate(authRequest))
                .build();
    }

    @GetMapping("/refreshToken")
    public ApiResponse<AuthResponse> refreshToken(@RequestParam String token) {
        return ApiResponse.<AuthResponse>builder()
                .code(200)
                .message("Lấy token thành công")
                .data(customerService.refreshToken(token))
                .build();
    }
}

