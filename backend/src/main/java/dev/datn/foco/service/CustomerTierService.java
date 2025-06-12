package dev.datn.foco.service;

import dev.datn.foco.dto.request.CustomerTierRequest;
import dev.datn.foco.model.CustomerTier;

import java.util.List;

public interface CustomerTierService {
    CustomerTier create(CustomerTierRequest customerTier);
    List<CustomerTier> findAll();
    CustomerTier update(Long id,CustomerTierRequest customerTier);
    CustomerTier delete(Long id);
}
