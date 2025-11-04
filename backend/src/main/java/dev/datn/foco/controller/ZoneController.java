package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.ZoneRequest;
import dev.datn.foco.dto.respone.ZoneRespone;
import dev.datn.foco.service.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION + "/zone")
public class ZoneController {
    @Autowired
    private ZoneService zoneService;

    @GetMapping("/store")
    public ApiResponse<List<ZoneRespone>> getAllZonesByStoreId(@RequestParam Long id) {
        return ApiResponse.<List<ZoneRespone>>builder().code(200).message("Bạn lấy dữ liệu thành công").data(zoneService.getAllZonesByStore(id)).build();
    }

    @GetMapping
    public ApiResponse<ZoneRespone> getZoneById(@RequestParam Long id) {
        return ApiResponse.<ZoneRespone>builder().code(200).message("Bạn lấy dữ liệu thành công").data(zoneService.getZone(id)).build();
    }

    @PostMapping
    public ApiResponse<ZoneRespone> createZone(@RequestBody ZoneRequest zone) {
        return ApiResponse.<ZoneRespone>builder().code(200).message("Bạn tạo khu vực thành công").data(zoneService.createZone(zone)).build();
    }

    @PutMapping
    public ApiResponse<ZoneRespone> updateZone(@RequestParam Long id,@RequestBody ZoneRequest zone) {
        return ApiResponse.<ZoneRespone>builder().code(200).message("Bạn sửa khu vực thành công").data(zoneService.updateZone(id,zone)).build();
    }

    @DeleteMapping
    public ApiResponse<ZoneRespone> deleteZone(@RequestParam Long id) {
        return ApiResponse.<ZoneRespone>builder().code(200).message("Bạn xoá khu vực thành công").data(zoneService.deleteZone(id)).build();
    }
}
