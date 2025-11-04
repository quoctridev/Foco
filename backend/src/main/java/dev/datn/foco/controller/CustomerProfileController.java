package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.CustomerUpdateRequest;
import dev.datn.foco.dto.respone.CustomerResponse;
import dev.datn.foco.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION+"/customer")
public class CustomerProfileController {
    @Autowired
    private CustomerService customerService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me")
    public ApiResponse<CustomerResponse> getProfile(@RequestHeader("Authorization") String token) {
        return ApiResponse.<CustomerResponse>builder()
                .code(200)
                .message("Thông tin khách hàng")
                .data(customerService.findById(extractToken(token)))
                .build();
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/me")
    public ApiResponse<CustomerResponse> updateMyProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CustomerUpdateRequest request) {
        return ApiResponse.<CustomerResponse>builder()
                .code(200)
                .message("Cập nhật thành công")
                .data(customerService.updateCustomerByToken(extractToken(token), request))
                .build();
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/me")
    public ApiResponse<CustomerResponse> deleteMyAccount(@RequestHeader("Authorization") String token) {
        return ApiResponse.<CustomerResponse>builder()
                .code(200)
                .message("Xoá thành công")
                .data(customerService.deleteCustomerByToken(extractToken(token)))
                .build();
    }

    private String extractToken(String bearerToken) {
        return bearerToken.replace("Bearer ", "");
    }

}

