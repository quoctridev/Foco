package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.CustomerCreateRequest;
import dev.datn.foco.dto.request.CustomerUpdateRequest;
import dev.datn.foco.dto.respone.CustomerResponse;
import dev.datn.foco.model.Customer;
import dev.datn.foco.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION+"/admin/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<CustomerResponse> updateCustomer(@RequestParam Long id, @RequestBody CustomerUpdateRequest customer) {
        return ApiResponse.<CustomerResponse>builder()
                .code(200)
                .message("Cập nhật thành công")
                .data(customerService.updateCustomerById(id, customer))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public ApiResponse<CustomerResponse> deleteMyAccount(@RequestParam Long id) {
        return ApiResponse.<CustomerResponse>builder()
                .code(200)
                .message("Xoá thành công")
                .data(customerService.deleteCustomerById(id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/tier")
    public ApiResponse<List<CustomerResponse>> findAllCustomersByTier(@RequestParam Long id) {
        return ApiResponse.<List<CustomerResponse>>builder()
                .code(200)
                .message("Lấy danh sách thành công")
                .data(customerService.findByTierId(id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<List<CustomerResponse>> findAllCustomers() {
        return ApiResponse.<List<CustomerResponse>>builder()
                .code(200)
                .message("Lấy danh sách thành công")
                .data(customerService.findAll())
                .build();
    }
}
