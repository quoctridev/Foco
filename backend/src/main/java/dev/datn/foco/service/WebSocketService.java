package dev.datn.foco.service;

import dev.datn.foco.dto.respone.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyNewOrder(OrderResponse order) {
        messagingTemplate.convertAndSend("/topic/orders/new", order);
    }

    public void notifyOrderStatusUpdate(OrderResponse order) {
        messagingTemplate.convertAndSend("/topic/orders/status", order);
    }

    public void notifyChefOrderUpdate(Object orderDetail) {
        messagingTemplate.convertAndSend("/topic/chef/orders", orderDetail);
    }

    public void notifyOrderStaffUpdate(OrderResponse order) {
        messagingTemplate.convertAndSend("/topic/order-staff/orders", order);
    }
}
