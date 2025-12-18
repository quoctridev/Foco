package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.TableRequest;
import dev.datn.foco.dto.respone.TableRespone;
import dev.datn.foco.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION+"/tables")
public class TableController {
    @Autowired
    private TableService tableService;

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/zone/{zoneId}")
    public ApiResponse<List<TableRespone>> getTablesByZone(@PathVariable Long zoneId) {
        try {
            List<TableRespone> tables = tableService.getAllZonesByStore(zoneId);
            return ApiResponse.<List<TableRespone>>builder()
                    .code(200)
                    .message("Lấy danh sách bàn thành công")
                    .data(tables)
                    .build();
        } catch (IllegalArgumentException e) {
            return ApiResponse.<List<TableRespone>>builder()
                    .code(200)
                    .message("Lấy danh sách bàn thành công")
                    .data(List.of())
                    .build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/{id}")
    public ApiResponse<TableRespone> getTableById(@PathVariable Long id) {
        return ApiResponse.<TableRespone>builder()
                .code(200)
                .message("Lấy thông tin bàn thành công")
                .data(tableService.getTable(id))
                .build();
    }

    // Public endpoint để lấy thông tin bàn từ QR code (cho customer)
    @GetMapping("/public/{id}")
    public ApiResponse<TableRespone> getTableByIdPublic(@PathVariable Long id) {
        return ApiResponse.<TableRespone>builder()
                .code(200)
                .message("Lấy thông tin bàn thành công")
                .data(tableService.getTable(id))
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping
    public ApiResponse<TableRespone> createTable(@RequestBody TableRequest request) {
        return ApiResponse.<TableRespone>builder()
                .code(200)
                .message("Tạo bàn thành công")
                .data(tableService.create(request))
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/{id}")
    public ApiResponse<TableRespone> updateTable(@PathVariable Long id, @RequestBody TableRequest request) {
        return ApiResponse.<TableRespone>builder()
                .code(200)
                .message("Cập nhật bàn thành công")
                .data(tableService.update(id, request))
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PatchMapping("/{id}/status")
    public ApiResponse<TableRespone> updateTableStatus(@PathVariable Long id, @RequestParam String status) {
        return ApiResponse.<TableRespone>builder()
                .code(200)
                .message("Cập nhật trạng thái bàn thành công")
                .data(tableService.updateStatus(id, status))
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @DeleteMapping("/{id}")
    public ApiResponse<TableRespone> deleteTable(@PathVariable Long id) {
        return ApiResponse.<TableRespone>builder()
                .code(200)
                .message("Xóa bàn thành công")
                .data(tableService.deleteTable(id))
                .build();
    }
}
