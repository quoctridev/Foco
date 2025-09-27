package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.CategoryRequest;
import dev.datn.foco.dto.respone.CategoryRespone;
import dev.datn.foco.model.Category;
import dev.datn.foco.repository.CategoryRepository;
import dev.datn.foco.service.CategoryService;
import dev.datn.foco.service.ImageUploadService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ImageUploadService imageUploadService;

    public CategoryRespone create(CategoryRequest category, MultipartFile image) {
    String name = Optional.ofNullable(category.getName())
                          .map(String::trim)
                          .orElseThrow(() -> new IllegalArgumentException("Tên danh mục không thể để trống"));

    if (name.isEmpty() || name.length() > 255) {
        throw new IllegalArgumentException("Tên danh mục không hợp lệ");
    }

    Category.CategoryBuilder builder = Category.builder()
        .name(name)
        .description(category.getDescription())
        .sortOrder(category.getSortOrder())
        .active(category.isActive());


    Category saved = categoryRepository.save(builder.build());

    // Nếu cần upload theo ID (vì tên ảnh chứa ID), ta phải upload sau khi đã lưu lần 1
    if (image != null && !image.isEmpty() && saved.getImageUrl() == null) {
        String imageUrl = imageUploadService.upload(image, "category", saved.getId().toString(), "image");
        saved.setImageUrl(imageUrl);
        saved = categoryRepository.save(saved);
    }

    return CategoryRespone.builder()
        .id(saved.getId())
        .name(saved.getName())
        .imageUrl(saved.getImageUrl())
        .active(saved.isActive())
        .description(saved.getDescription())
        .sortOrder(saved.getSortOrder())
        .build();
}

}
