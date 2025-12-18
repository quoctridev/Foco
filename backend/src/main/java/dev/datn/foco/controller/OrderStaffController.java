package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.respone.OrderResponse;
import dev.datn.foco.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiVersion.API_VERSION + "/order-staff")
@RequiredArgsConstructor
public class OrderStaffController {

    private final OrderService orderService;

    @GetMapping("/orders/pending")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getPendingOrders() {
        List<OrderResponse> response = orderService.getOrdersByStatus("pending");
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách đơn chờ xác nhận thành công")
                .data(response)
                .build());
    }

    @GetMapping("/orders/confirmed")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getConfirmedOrders() {
        List<OrderResponse> response = orderService.getOrdersByStatus("confirmed");
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách đơn đã xác nhận thành công")
                .data(response)
                .build());
    }

    @GetMapping("/orders/active")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getActiveOrders() {
        List<OrderResponse> pending = orderService.getOrdersByStatus("pending");
        List<OrderResponse> confirmed = orderService.getOrdersByStatus("confirmed");
        List<OrderResponse> preparing = orderService.getOrdersByStatus("preparing");

        pending.addAll(confirmed);
        pending.addAll(preparing);

        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách đơn đang xử lý thành công")
                .data(pending)
                .build());
    }

    @PatchMapping("/orders/{id}/confirm")
    public ResponseEntity<ApiResponse<OrderResponse>> confirmOrder(@PathVariable Long id) {
        OrderResponse response = orderService.confirmOrder(id);
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Xác nhận đơn hàng thành công")
                .data(response)
                .build());
    }

    @PatchMapping("/orders/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long id) {
        OrderResponse response = orderService.cancelOrder(id);
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Hủy đơn hàng thành công")
                .data(response)
                .build());
    }
}
