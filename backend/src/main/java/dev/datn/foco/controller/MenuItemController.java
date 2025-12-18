package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.MenuItemRequest;
import dev.datn.foco.dto.respone.MenuItemResponse;
import dev.datn.foco.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(ApiVersion.API_VERSION + "/menu-items")
@RequiredArgsConstructor
public class MenuItemController {

        private final MenuItemService menuItemService;

        @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(
                        @RequestPart("menuItem") MenuItemRequest request,
                        @RequestPart(value = "image", required = false) MultipartFile image) {
                MenuItemResponse response = menuItemService.createMenuItem(request, image);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.<MenuItemResponse>builder()
                                                .code(HttpStatus.CREATED.value())
                                                .message("Tạo món ăn thành công")
                                                .data(response)
                                                .build());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItemById(@PathVariable Long id) {
                MenuItemResponse response = menuItemService.getMenuItemById(id);
                return ResponseEntity.ok(ApiResponse.<MenuItemResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy thông tin món ăn thành công")
                                .data(response)
                                .build());
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getAllMenuItems() {
                List<MenuItemResponse> responses = menuItemService.getAllMenuItems();
                return ResponseEntity.ok(ApiResponse.<List<MenuItemResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách món ăn thành công")
                                .data(responses)
                                .build());
        }

        @GetMapping("/category/{categoryId}")
        public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getMenuItemsByCategory(
                        @PathVariable Long categoryId) {
                List<MenuItemResponse> responses = menuItemService.getMenuItemsByCategory(categoryId);
                return ResponseEntity.ok(ApiResponse.<List<MenuItemResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách món ăn thành công")
                                .data(responses)
                                .build());
        }

        @GetMapping("/available")
        public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getAvailableMenuItems() {
                List<MenuItemResponse> responses = menuItemService.getAvailableMenuItems();
                return ResponseEntity.ok(ApiResponse.<List<MenuItemResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Lấy danh sách món có sẵn thành công")
                                .data(responses)
                                .build());
        }

        @GetMapping("/search")
        public ResponseEntity<ApiResponse<List<MenuItemResponse>>> searchMenuItems(@RequestParam String name) {
                List<MenuItemResponse> responses = menuItemService.searchMenuItems(name);
                return ResponseEntity.ok(ApiResponse.<List<MenuItemResponse>>builder()
                                .code(HttpStatus.OK.value())
                                .message("Tìm kiếm món ăn thành công")
                                .data(responses)
                                .build());
        }

        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
                        @PathVariable Long id,
                        @RequestPart("menuItem") MenuItemRequest request,
                        @RequestPart(value = "image", required = false) MultipartFile image) {
                MenuItemResponse response = menuItemService.updateMenuItem(id, request, image);
                return ResponseEntity.ok(ApiResponse.<MenuItemResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Cập nhật món ăn thành công")
                                .data(response)
                                .build());
        }

        @PatchMapping("/{id}/availability")
        public ResponseEntity<ApiResponse<MenuItemResponse>> updateAvailability(
                        @PathVariable Long id,
                        @RequestParam boolean available) {
                MenuItemResponse response = menuItemService.updateAvailability(id, available);
                return ResponseEntity.ok(ApiResponse.<MenuItemResponse>builder()
                                .code(HttpStatus.OK.value())
                                .message("Cập nhật trạng thái món ăn thành công")
                                .data(response)
                                .build());
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
                menuItemService.deleteMenuItem(id);
                return ResponseEntity.ok(ApiResponse.<Void>builder()
                                .code(HttpStatus.OK.value())
                                .message("Xóa món ăn thành công")
                                .build());
        }
}
