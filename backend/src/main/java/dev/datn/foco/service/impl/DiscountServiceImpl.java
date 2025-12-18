package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.DiscountRequest;
import dev.datn.foco.dto.respone.DiscountResponse;
import dev.datn.foco.model.Discount;
import dev.datn.foco.repository.DiscountRepository;
import dev.datn.foco.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service xử lý nghiệp vụ liên quan đến mã giảm giá
 * Bao gồm xác thực, áp dụng và quản lý mã khuyến mãi
 */
@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {
    
    private final DiscountRepository discountRepository;

    /**
     * Tạo mã giảm giá mới
     */
    @Override
    @Transactional
    public DiscountResponse createDiscount(DiscountRequest request) {
        Discount discount = Discount.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .type(request.getType())
                .value(request.getValue())
                .minOrderAmount(request.getMinOrderAmount())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .usageLimit(request.getUsageLimit())
                .applicableTo(request.getApplicableTo())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        Discount savedDiscount = discountRepository.save(discount);
        return mapToResponse(savedDiscount);
    }

    @Override
    public DiscountResponse getDiscountById(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã giảm giá"));
        return mapToResponse(discount);
    }

    @Override
    public DiscountResponse getDiscountByCode(String code) {
        Discount discount = discountRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã giảm giá"));
        return mapToResponse(discount);
    }

    @Override
    public List<DiscountResponse> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DiscountResponse> getValidDiscounts() {
        return discountRepository.findValidDiscounts(LocalDateTime.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật thông tin mã giảm giá
     */
    @Override
    @Transactional
    public DiscountResponse updateDiscount(Long id, DiscountRequest request) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã giảm giá"));

        if (request.getCode() != null) discount.setCode(request.getCode());
        if (request.getName() != null) discount.setName(request.getName());
        if (request.getDescription() != null) discount.setDescription(request.getDescription());
        if (request.getType() != null) discount.setType(request.getType());
        if (request.getValue() != null) discount.setValue(request.getValue());
        if (request.getMinOrderAmount() != null) discount.setMinOrderAmount(request.getMinOrderAmount());
        if (request.getMaxDiscountAmount() != null) discount.setMaxDiscountAmount(request.getMaxDiscountAmount());
        if (request.getUsageLimit() != null) discount.setUsageLimit(request.getUsageLimit());
        if (request.getApplicableTo() != null) discount.setApplicableTo(request.getApplicableTo());
        if (request.getStartDate() != null) discount.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) discount.setEndDate(request.getEndDate());
        if (request.getActive() != null) discount.setActive(request.getActive());

        Discount updatedDiscount = discountRepository.save(discount);
        return mapToResponse(updatedDiscount);
    }

    /**
     * Xác thực và áp dụng mã giảm giá
     * Kiểm tra:
     * - Mã còn hiệu lực
     * - Đơn hàng đủ điều kiện
     * - Còn lượt sử dụng
     * - Loại đơn hàng phù hợp
     */
    @Override
    @Transactional
    public DiscountResponse applyDiscount(String code, String orderType, BigDecimal orderAmount) {
        Discount discount = discountRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

        LocalDateTime now = LocalDateTime.now();

        // Kiểm tra trạng thái hoạt động
        if (!discount.getActive()) {
            throw new RuntimeException("Mã giảm giá không còn hoạt động");
        }

        // Kiểm tra thời gian hiệu lực
        if (now.isBefore(discount.getStartDate())) {
            throw new RuntimeException("Mã giảm giá chưa đến thời gian áp dụng");
        }
        if (now.isAfter(discount.getEndDate())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn");
        }

        // Kiểm tra lượt sử dụng
        if (discount.getUsageLimit() != null && discount.getUsedCount() >= discount.getUsageLimit()) {
            throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng");
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (discount.getMinOrderAmount() != null && orderAmount.compareTo(discount.getMinOrderAmount()) < 0) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã giảm giá");
        }

        // Kiểm tra loại đơn hàng
        if (!discount.getApplicableTo().equals("all") && !discount.getApplicableTo().equals(orderType)) {
            throw new RuntimeException("Mã giảm giá không áp dụng cho loại đơn hàng này");
        }

        // Tăng số lần sử dụng
        discount.setUsedCount(discount.getUsedCount() + 1);
        Discount updatedDiscount = discountRepository.save(discount);

        return mapToResponse(updatedDiscount);
    }

    @Override
    @Transactional
    public void deleteDiscount(Long id) {
        discountRepository.deleteById(id);
    }

    /**
     * Chuyển đổi Entity sang DTO
     */
    private DiscountResponse mapToResponse(Discount discount) {
        return DiscountResponse.builder()
                .id(discount.getId())
                .code(discount.getCode())
                .name(discount.getName())
                .description(discount.getDescription())
                .type(discount.getType())
                .value(discount.getValue())
                .minOrderAmount(discount.getMinOrderAmount())
                .maxDiscountAmount(discount.getMaxDiscountAmount())
                .usageLimit(discount.getUsageLimit())
                .usedCount(discount.getUsedCount())
                .applicableTo(discount.getApplicableTo())
                .startDate(discount.getStartDate())
                .endDate(discount.getEndDate())
                .active(discount.getActive())
                .createdAt(discount.getCreatedAt())
                .build();
    }
}

