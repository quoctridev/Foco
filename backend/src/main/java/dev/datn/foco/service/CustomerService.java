package dev.datn.foco.service;

import dev.datn.foco.dto.request.AuthRequest;
import dev.datn.foco.dto.request.CustomerCreateRequest;
import dev.datn.foco.dto.request.CustomerUpdateRequest;
import dev.datn.foco.dto.respone.AuthResponse;
import dev.datn.foco.dto.respone.CustomerResponse;

import java.util.List;

public interface CustomerService {
    CustomerResponse create(CustomerCreateRequest customer);
    AuthResponse authenticate(AuthRequest authRequest);
    AuthResponse refreshToken(String token);
    CustomerResponse findById(String token);
    List<CustomerResponse> findAll();
    CustomerResponse updateCustomerByToken(String token, CustomerUpdateRequest customer);
    List<CustomerResponse> findByTierId(Long tierId);
    CustomerResponse deleteCustomerByToken(String token);
    CustomerResponse updateCustomerById(Long id, CustomerUpdateRequest customer);
    CustomerResponse deleteCustomerById(Long id);
}
