package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.CategoryRequest;
import dev.datn.foco.dto.respone.CategoryRespone;
import dev.datn.foco.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping(ApiVersion.API_VERSION + "/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryRespone>> getAllCategories() {
        return ApiResponse.<List<CategoryRespone>>builder()
                .code(200)
                .message("Lấy danh sách danh mục thành công")
                .data(categoryService.findAll())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CategoryRespone> createCategory(
            @RequestPart("category") String categoryJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        CategoryRequest category = mapper.readValue(categoryJson, CategoryRequest.class);

        return ApiResponse.<CategoryRespone>builder()
                .data(categoryService.create(category, image))
                .code(200)
                .message("Bạn đã tạo danh mục thành công")
                .build();

    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa danh mục thành công")
                .build();
    }

}
