package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.PaymentRequest;
import dev.datn.foco.dto.respone.PaymentResponse;
import dev.datn.foco.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiVersion.API_VERSION + "/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PaymentResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Tạo thanh toán thành công")
                        .data(response)
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        PaymentResponse response = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy thông tin thanh toán thành công")
                .data(response)
                .build());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByOrder(@PathVariable Long orderId) {
        List<PaymentResponse> responses = paymentService.getPaymentsByOrder(orderId);
        return ResponseEntity.ok(ApiResponse.<List<PaymentResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách thanh toán thành công")
                .data(responses)
                .build());
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByTransactionId(@PathVariable String transactionId) {
        PaymentResponse response = paymentService.getPaymentByTransactionId(transactionId);
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy thông tin thanh toán thành công")
                .data(response)
                .build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PaymentResponse>> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        PaymentResponse response = paymentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật trạng thái thanh toán thành công")
                .data(response)
                .build());
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<PaymentResponse>> confirmPayment(@PathVariable Long id) {
        PaymentResponse response = paymentService.confirmPayment(id);
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Xác nhận thanh toán thành công")
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa thanh toán thành công")
                .build());
    }
}
