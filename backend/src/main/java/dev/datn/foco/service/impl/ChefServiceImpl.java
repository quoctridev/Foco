package dev.datn.foco.service.impl;

import dev.datn.foco.dto.respone.OrderDetailOptionResponse;
import dev.datn.foco.dto.respone.OrderDetailResponse;
import dev.datn.foco.model.OrderDetail;
import dev.datn.foco.repository.OrderDetailRepository;
import dev.datn.foco.service.ChefService;
import dev.datn.foco.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChefServiceImpl implements ChefService {
    
    private final OrderDetailRepository orderDetailRepository;
    private final WebSocketService webSocketService;

    @Override
    public List<OrderDetailResponse> getPendingOrderDetails() {
        // Chỉ lấy OrderDetails từ các Order đã được confirmed
        return orderDetailRepository.findByStatus("pending").stream()
                .filter(od -> "confirmed".equals(od.getOrder().getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDetailResponse> getPreparingOrderDetails() {
        // Chỉ lấy OrderDetails từ các Order đã được confirmed
        return orderDetailRepository.findByStatus("preparing").stream()
                .filter(od -> "confirmed".equals(od.getOrder().getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDetailResponse> getAllActiveOrderDetails() {
        // Chỉ lấy OrderDetails từ các Order đã được confirmed (đã order xong)
        List<OrderDetail> allActive = orderDetailRepository.findAll().stream()
                .filter(od -> {
                    // Chỉ lấy OrderDetails từ Orders có status = "confirmed" (đã order xong)
                    String orderStatus = od.getOrder().getStatus();
                    String detailStatus = od.getStatus();
                    return "confirmed".equals(orderStatus) && 
                           !"ready".equals(detailStatus) && 
                           !"served".equals(detailStatus);
                })
                .collect(Collectors.toList());
        
        return allActive.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDetailResponse startPreparing(Long orderDetailId) {
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món"));
        
        orderDetail.setStatus("preparing");
        OrderDetail updated = orderDetailRepository.save(orderDetail);
        OrderDetailResponse response = mapToResponse(updated);
        
        // Gửi thông báo realtime cho bếp
        webSocketService.notifyChefOrderUpdate(response);
        
        return response;
    }

    @Override
    @Transactional
    public OrderDetailResponse markAsReady(Long orderDetailId) {
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món"));
        
        orderDetail.setStatus("ready");
        OrderDetail updated = orderDetailRepository.save(orderDetail);
        OrderDetailResponse response = mapToResponse(updated);
        
        // Gửi thông báo realtime cho bếp
        webSocketService.notifyChefOrderUpdate(response);
        
        return response;
    }

    @Override
    @Transactional
    public OrderDetailResponse updateOrderDetailStatus(Long orderDetailId, String status) {
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món"));
        
        orderDetail.setStatus(status);
        OrderDetail updated = orderDetailRepository.save(orderDetail);
        OrderDetailResponse response = mapToResponse(updated);
        
        // Gửi thông báo realtime cho bếp
        webSocketService.notifyChefOrderUpdate(response);
        
        return response;
    }

    private OrderDetailResponse mapToResponse(OrderDetail orderDetail) {
        List<OrderDetailOptionResponse> optionResponses = orderDetail.getOptions().stream()
                .map(option -> OrderDetailOptionResponse.builder()
                        .id(option.getId())
                        .valueId(option.getOptionValue().getId())
                        .valueName(option.getOptionValue().getName())
                        .quantity(option.getQuantity())
                        .extraPrice(option.getExtraPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderDetailResponse.builder()
                .id(orderDetail.getId())
                .itemId(orderDetail.getMenuItem().getId())
                .itemName(orderDetail.getMenuItem().getName())
                .quantity(orderDetail.getQuantity())
                .unitPrice(orderDetail.getUnitPrice())
                .totalPrice(orderDetail.getTotalPrice())
                .specialInstructions(orderDetail.getSpecialInstructions())
                .status(orderDetail.getStatus())
                .options(optionResponses)
                .build();
    }
}

