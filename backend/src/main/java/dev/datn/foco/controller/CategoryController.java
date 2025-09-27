package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.CategoryRequest;
import dev.datn.foco.dto.respone.CategoryRespone;
import dev.datn.foco.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION + "/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CategoryRespone> createCategory(
            @RequestPart("category") String categoryJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws JsonProcessingException{
            ObjectMapper mapper = new ObjectMapper();
            CategoryRequest category = mapper.readValue(categoryJson, CategoryRequest.class);

            return ApiResponse.<CategoryRespone>builder()
                    .data(categoryService.create(category, image))
                    .code(200)
                    .message("Bạn đã tạo danh mục thành công")
                    .build();
      
    }

}
