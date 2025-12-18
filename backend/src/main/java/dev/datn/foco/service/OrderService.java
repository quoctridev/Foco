package dev.datn.foco.service;

import dev.datn.foco.dto.request.OrderRequest;
import dev.datn.foco.dto.respone.OrderResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    
    OrderResponse getOrderById(Long id);
    
    OrderResponse getOrderByNumber(String orderNumber);
    
    List<OrderResponse> getAllOrders();
    
    List<OrderResponse> getOrdersByStore(Long storeId);
    
    List<OrderResponse> getOrdersByCustomer(Long customerId);
    
    List<OrderResponse> getOrdersByStatus(String status);
    
    List<OrderResponse> getOrdersByTable(Long tableId);
    
    List<OrderResponse> getOrdersByStoreAndStatus(Long storeId, String status);
    
    List<OrderResponse> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    OrderResponse updateOrderStatus(Long orderId, String status);
    
    OrderResponse confirmOrder(Long orderId);
    
    OrderResponse completeOrder(Long orderId);
    
    OrderResponse cancelOrder(Long orderId);
    
    void deleteOrder(Long id);
}

