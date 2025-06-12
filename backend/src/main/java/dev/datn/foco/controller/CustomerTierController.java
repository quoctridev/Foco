package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.CustomerTierRequest;
import dev.datn.foco.model.CustomerTier;
import dev.datn.foco.service.CustomerTierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION)
public class CustomerTierController {
    @Autowired
    private CustomerTierService customerTierService;
    @GetMapping("/public/customerTier")
    public ApiResponse<List<CustomerTier>> getAllCustomerTiers() {
        return ApiResponse.<List<CustomerTier>>builder().code(200).message("Lấy dữ liệu thành công").data(customerTierService.findAll()).build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/customerTier")
    public ApiResponse<CustomerTier> createCustomerTier(@RequestBody CustomerTierRequest customerTier) {
        return ApiResponse.<CustomerTier>builder().code(200).message("Tạo thành công mức hạng").data(customerTierService.create(customerTier)).build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/customerTier")
    public ApiResponse<CustomerTier> updateCustomerTier(@RequestBody CustomerTierRequest customerTier, @RequestParam Long id) {
        return ApiResponse.<CustomerTier>builder().code(200).message("Sửa thành công mức hạng").data(customerTierService.update(id,customerTier)).build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/customerTier")
    public ApiResponse<CustomerTier> deleteCustomerTier(@RequestParam Long id) {
        return ApiResponse.<CustomerTier>builder().code(200).message("Sửa thành công mức hạng").data(customerTierService.delete(id)).build();
    }
}
