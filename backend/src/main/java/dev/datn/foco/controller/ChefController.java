package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.respone.OrderDetailResponse;
import dev.datn.foco.service.ChefService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiVersion.API_VERSION + "/chef")
@RequiredArgsConstructor
public class ChefController {
    
    private final ChefService chefService;

    @GetMapping("/orders/pending")
    public ResponseEntity<ApiResponse<List<OrderDetailResponse>>> getPendingOrderDetails() {
        List<OrderDetailResponse> response = chefService.getPendingOrderDetails();
        return ResponseEntity.ok(ApiResponse.<List<OrderDetailResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách món cần làm thành công")
                .data(response)
                .build());
    }

    @GetMapping("/orders/preparing")
    public ResponseEntity<ApiResponse<List<OrderDetailResponse>>> getPreparingOrderDetails() {
        List<OrderDetailResponse> response = chefService.getPreparingOrderDetails();
        return ResponseEntity.ok(ApiResponse.<List<OrderDetailResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách món đang làm thành công")
                .data(response)
                .build());
    }

    @GetMapping("/orders/all-active")
    public ResponseEntity<ApiResponse<List<OrderDetailResponse>>> getAllActiveOrderDetails() {
        List<OrderDetailResponse> response = chefService.getAllActiveOrderDetails();
        return ResponseEntity.ok(ApiResponse.<List<OrderDetailResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy tất cả món đang xử lý thành công")
                .data(response)
                .build());
    }

    @PatchMapping("/order-detail/{id}/start")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> startPreparing(@PathVariable Long id) {
        OrderDetailResponse response = chefService.startPreparing(id);
        return ResponseEntity.ok(ApiResponse.<OrderDetailResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Bắt đầu làm món thành công")
                .data(response)
                .build());
    }

    @PatchMapping("/order-detail/{id}/ready")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> markAsReady(@PathVariable Long id) {
        OrderDetailResponse response = chefService.markAsReady(id);
        return ResponseEntity.ok(ApiResponse.<OrderDetailResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Món đã sẵn sàng")
                .data(response)
                .build());
    }

    @PatchMapping("/order-detail/{id}/status")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> updateOrderDetailStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        OrderDetailResponse response = chefService.updateOrderDetailStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<OrderDetailResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật trạng thái món thành công")
                .data(response)
                .build());
    }
}

