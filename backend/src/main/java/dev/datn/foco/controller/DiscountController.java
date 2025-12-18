package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.DiscountRequest;
import dev.datn.foco.dto.respone.DiscountResponse;
import dev.datn.foco.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping(ApiVersion.API_VERSION + "/discounts")
@RequiredArgsConstructor
public class DiscountController {

        private final DiscountService discountService;

        @PostMapping
        public ResponseEntity<ApiResponse<DiscountResponse>> createDiscount(@RequestBody DiscountRequest request) {
                DiscountResponse response = discountService.createDiscount(request);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.<DiscountResponse>builder()
                                                .code(HttpStatus.CREATED.value())
                                                .message("Tạo mã giảm giá thành công")
                                                .data(response)
                                                .build());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<DiscountResponse>> getDiscountById(@PathVariable Long id) {
                DiscountResponse response = discountService.getDiscountById(id);
                return ResponseEntity.ok(ApiResponse.<DiscountResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy thông tin mã giảm giá thành công")
                                .data(response)
                                .build());
        }

        @GetMapping("/code/{code}")
        public ResponseEntity<ApiResponse<DiscountResponse>> getDiscountByCode(@PathVariable String code) {
                DiscountResponse response = discountService.getDiscountByCode(code);
                return ResponseEntity.ok(ApiResponse.<DiscountResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy thông tin mã giảm giá thành công")
                                .data(response)
                                .build());
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<DiscountResponse>>> getAllDiscounts() {
                List<DiscountResponse> responses = discountService.getAllDiscounts();
                return ResponseEntity.ok(ApiResponse.<List<DiscountResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách mã giảm giá thành công")
                                .data(responses)
                                .build());
        }

        @GetMapping("/valid")
        public ResponseEntity<ApiResponse<List<DiscountResponse>>> getValidDiscounts() {
                List<DiscountResponse> responses = discountService.getValidDiscounts();
                return ResponseEntity.ok(ApiResponse.<List<DiscountResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách mã giảm giá còn hiệu lực thành công")
                                .data(responses)
                                .build());
        }

        @PostMapping("/apply")
        public ResponseEntity<ApiResponse<DiscountResponse>> applyDiscount(
                        @RequestParam String code,
                        @RequestParam String orderType,
                        @RequestParam BigDecimal orderAmount) {
                DiscountResponse response = discountService.applyDiscount(code, orderType, orderAmount);
                return ResponseEntity.ok(ApiResponse.<DiscountResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Áp dụng mã giảm giá thành công")
                                .data(response)
                                .build());
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<DiscountResponse>> updateDiscount(
                        @PathVariable Long id,
                        @RequestBody DiscountRequest request) {
                DiscountResponse response = discountService.updateDiscount(id, request);
                return ResponseEntity.ok(ApiResponse.<DiscountResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Cập nhật mã giảm giá thành công")
                                .data(response)
                                .build());
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteDiscount(@PathVariable Long id) {
                discountService.deleteDiscount(id);
                return ResponseEntity.ok(ApiResponse.<Void>builder()
                                .code(HttpStatus.OK.value())
                                .message("Xóa mã giảm giá thành công")
                                .build());
        }
}
