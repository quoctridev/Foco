package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.MenuItemOptionRequest;
import dev.datn.foco.dto.respone.MenuItemOptionResponse;
import dev.datn.foco.service.MenuItemOptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiVersion.API_VERSION + "/menu-item-options")
@RequiredArgsConstructor
public class MenuItemOptionController {

    private final MenuItemOptionService menuItemOptionService;

    @PostMapping
    public ResponseEntity<ApiResponse<MenuItemOptionResponse>> createOption(
            @RequestBody MenuItemOptionRequest request) {
        MenuItemOptionResponse response = menuItemOptionService.createOption(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<MenuItemOptionResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Tạo tùy chọn món ăn thành công")
                        .data(response)
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemOptionResponse>> getOptionById(@PathVariable Long id) {
        MenuItemOptionResponse response = menuItemOptionService.getOptionById(id);
        return ResponseEntity.ok(ApiResponse.<MenuItemOptionResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy thông tin tùy chọn món ăn thành công")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemOptionResponse>>> getAllOptions() {
        List<MenuItemOptionResponse> responses = menuItemOptionService.getAllOptions();
        return ResponseEntity.ok(ApiResponse.<List<MenuItemOptionResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách tùy chọn món ăn thành công")
                .data(responses)
                .build());
    }

    @GetMapping("/menu-item/{itemId}")
    public ResponseEntity<ApiResponse<List<MenuItemOptionResponse>>> getOptionsByMenuItem(@PathVariable Long itemId) {
        List<MenuItemOptionResponse> responses = menuItemOptionService.getOptionsByMenuItem(itemId);
        return ResponseEntity.ok(ApiResponse.<List<MenuItemOptionResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách tùy chọn món ăn thành công")
                .data(responses)
                .build());
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<MenuItemOptionResponse>>> getActiveOptions() {
        List<MenuItemOptionResponse> responses = menuItemOptionService.getActiveOptions();
        return ResponseEntity.ok(ApiResponse.<List<MenuItemOptionResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách tùy chọn đang hoạt động thành công")
                .data(responses)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemOptionResponse>> updateOption(
            @PathVariable Long id,
            @RequestBody MenuItemOptionRequest request) {
        MenuItemOptionResponse response = menuItemOptionService.updateOption(id, request);
        return ResponseEntity.ok(ApiResponse.<MenuItemOptionResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật tùy chọn món ăn thành công")
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOption(@PathVariable Long id) {
        menuItemOptionService.deleteOption(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa tùy chọn món ăn thành công")
                .build());
    }
}
