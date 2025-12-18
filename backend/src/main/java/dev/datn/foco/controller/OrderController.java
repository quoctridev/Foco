package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.OrderRequest;
import dev.datn.foco.dto.respone.OrderResponse;
import dev.datn.foco.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(ApiVersion.API_VERSION + "/orders")
@RequiredArgsConstructor
public class OrderController {

        private final OrderService orderService;

        @PostMapping
        public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@RequestBody OrderRequest request) {
                OrderResponse response = orderService.createOrder(request);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.<OrderResponse>builder()
                                                .code(HttpStatus.CREATED.value())
                                                .message("Tạo đơn hàng thành công")
                                                .data(response)
                                                .build());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
                OrderResponse response = orderService.getOrderById(id);
                return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy thông tin đơn hàng thành công")
                                .data(response)
                                .build());
        }

        @GetMapping("/number/{orderNumber}")
        public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
                OrderResponse response = orderService.getOrderByNumber(orderNumber);
                return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy thông tin đơn hàng thành công")
                                .data(response)
                                .build());
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
                List<OrderResponse> responses = orderService.getAllOrders();
                return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách đơn hàng thành công")
                                .data(responses)
                                .build());
        }

        @GetMapping("/store/{storeId}")
        public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByStore(@PathVariable Long storeId) {
                List<OrderResponse> responses = orderService.getOrdersByStore(storeId);
                return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách đơn hàng thành công")
                                .data(responses)
                                .build());
        }

        @GetMapping("/customer/{customerId}")
        public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByCustomer(@PathVariable Long customerId) {
                List<OrderResponse> responses = orderService.getOrdersByCustomer(customerId);
                return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách đơn hàng thành công")
                                .data(responses)
                                .build());
        }

        @GetMapping("/status/{status}")
        public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByStatus(@PathVariable String status) {
                List<OrderResponse> responses = orderService.getOrdersByStatus(status);
                return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách đơn hàng thành công")
                                .data(responses)
                                .build());
        }

        @GetMapping("/table/{tableId}")
        public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByTable(@PathVariable Long tableId) {
                List<OrderResponse> responses = orderService.getOrdersByTable(tableId);
                return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách đơn hàng thành công")
                                .data(responses)
                                .build());
        }

        @GetMapping("/store/{storeId}/status/{status}")
        public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByStoreAndStatus(
                        @PathVariable Long storeId,
                        @PathVariable String status) {
                List<OrderResponse> responses = orderService.getOrdersByStoreAndStatus(storeId, status);
                return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách đơn hàng thành công")
                                .data(responses)
                                .build());
        }

        @GetMapping("/date-range")
        public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByDateRange(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
                List<OrderResponse> responses = orderService.getOrdersByDateRange(startDate, endDate);
                return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách đơn hàng thành công")
                                .data(responses)
                                .build());
        }

        @PatchMapping("/{id}/status")
        public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
                        @PathVariable Long id,
                        @RequestParam String status) {
                OrderResponse response = orderService.updateOrderStatus(id, status);
                return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Cập nhật trạng thái đơn hàng thành công")
                                .data(response)
                                .build());
        }

        @PatchMapping("/{id}/confirm")
        public ResponseEntity<ApiResponse<OrderResponse>> confirmOrder(@PathVariable Long id) {
                OrderResponse response = orderService.confirmOrder(id);
                return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Xác nhận đơn hàng thành công")
                                .data(response)
                                .build());
        }

        @PatchMapping("/{id}/complete")
        public ResponseEntity<ApiResponse<OrderResponse>> completeOrder(@PathVariable Long id) {
                OrderResponse response = orderService.completeOrder(id);
                return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Hoàn thành đơn hàng thành công")
                                .data(response)
                                .build());
        }

        @PatchMapping("/{id}/cancel")
        public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long id) {
                OrderResponse response = orderService.cancelOrder(id);
                return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Hủy đơn hàng thành công")
                                .data(response)
                                .build());
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
                orderService.deleteOrder(id);
                return ResponseEntity.ok(ApiResponse.<Void>builder()
                                .code(HttpStatus.OK.value())
                                .message("Xóa đơn hàng thành công")
                                .build());
        }
}
