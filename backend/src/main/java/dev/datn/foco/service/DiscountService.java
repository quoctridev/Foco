package dev.datn.foco.service;

import dev.datn.foco.dto.request.DiscountRequest;
import dev.datn.foco.dto.respone.DiscountResponse;

import java.util.List;

public interface DiscountService {

    DiscountResponse createDiscount(DiscountRequest request);

    DiscountResponse getDiscountById(Long id);

    DiscountResponse getDiscountByCode(String code);

    List<DiscountResponse> getAllDiscounts();

    List<DiscountResponse> getValidDiscounts();

    DiscountResponse updateDiscount(Long id, DiscountRequest request);

    DiscountResponse applyDiscount(String code, String orderType, java.math.BigDecimal orderAmount);

    void deleteDiscount(Long id);
}
