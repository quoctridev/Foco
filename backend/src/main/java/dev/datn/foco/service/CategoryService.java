package dev.datn.foco.service;

import dev.datn.foco.dto.request.CategoryRequest;
import dev.datn.foco.dto.respone.CategoryRespone;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    CategoryRespone create(CategoryRequest category, MultipartFile image);
    List<CategoryRespone> findAll();
    void delete(Long id);
}
