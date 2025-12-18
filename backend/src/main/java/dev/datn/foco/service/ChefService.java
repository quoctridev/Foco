package dev.datn.foco.service;

import dev.datn.foco.dto.respone.OrderDetailResponse;

import java.util.List;

public interface ChefService {
    List<OrderDetailResponse> getPendingOrderDetails();
    
    List<OrderDetailResponse> getPreparingOrderDetails();
    
    List<OrderDetailResponse> getAllActiveOrderDetails();
    
    OrderDetailResponse startPreparing(Long orderDetailId);
    
    OrderDetailResponse markAsReady(Long orderDetailId);
    
    OrderDetailResponse updateOrderDetailStatus(Long orderDetailId, String status);
}

