package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.MenuItemRequest;
import dev.datn.foco.dto.respone.MenuItemResponse;
import dev.datn.foco.model.Category;
import dev.datn.foco.model.MenuItems;
import dev.datn.foco.repository.CategoryRepository;
import dev.datn.foco.repository.MenuItemRepository;
import dev.datn.foco.service.ImageUploadService;
import dev.datn.foco.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;
    private final ImageUploadService imageUploadService;

    @Override
    @Transactional
    public MenuItemResponse createMenuItem(MenuItemRequest request, MultipartFile image) {
        // Kiểm tra danh mục tồn tại
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

        // Tạo món ăn mới
        MenuItems menuItem = MenuItems.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .cost(request.getCost())
                .prepTime(request.getPrepTime())
                .available(request.getAvailable() != null ? request.getAvailable() : true)
                .build();

        // Lưu để lấy ID
        MenuItems savedMenuItem = menuItemRepository.save(menuItem);

        // Upload hình ảnh nếu có
        if (image != null && !image.isEmpty()) {
            String imageUrl = imageUploadService.upload(image, "menu-item", savedMenuItem.getId().toString(), "image");
            savedMenuItem.setImageUrl(imageUrl);
            savedMenuItem = menuItemRepository.save(savedMenuItem);
        }

        return mapToResponse(savedMenuItem);
    }

    @Override
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItems menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn"));
        return mapToResponse(menuItem);
    }

    @Override
    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemResponse> getMenuItemsByCategory(Long categoryId) {
        return menuItemRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemResponse> getAvailableMenuItems() {
        return menuItemRepository.findByAvailable(true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemResponse> searchMenuItems(String name) {
        return menuItemRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request, MultipartFile image) {
        MenuItems menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn"));

        // Cập nhật danh mục nếu thay đổi
        if (request.getCategoryId() != null && !request.getCategoryId().equals(menuItem.getCategory().getId())) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
            menuItem.setCategory(category);
        }

        // Cập nhật thông tin món ăn
        if (request.getName() != null)
            menuItem.setName(request.getName());
        if (request.getDescription() != null)
            menuItem.setDescription(request.getDescription());
        if (request.getPrice() != null)
            menuItem.setPrice(request.getPrice());
        if (request.getCost() != null)
            menuItem.setCost(request.getCost());
        if (request.getPrepTime() != null)
            menuItem.setPrepTime(request.getPrepTime());
        if (request.getAvailable() != null)
            menuItem.setAvailable(request.getAvailable());

        // Upload hình ảnh mới nếu có
        if (image != null && !image.isEmpty()) {
            String imageUrl = imageUploadService.upload(image, "menu-item", menuItem.getId().toString(), "image");
            menuItem.setImageUrl(imageUrl);
        }

        MenuItems updatedMenuItem = menuItemRepository.save(menuItem);
        return mapToResponse(updatedMenuItem);
    }

    @Override
    @Transactional
    public MenuItemResponse updateAvailability(Long id, boolean available) {
        MenuItems menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn"));
        menuItem.setAvailable(available);
        MenuItems updatedMenuItem = menuItemRepository.save(menuItem);
        return mapToResponse(updatedMenuItem);
    }

    @Override
    @Transactional
    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }

    private MenuItemResponse mapToResponse(MenuItems menuItem) {
        return MenuItemResponse.builder()
                .id(menuItem.getId())
                .categoryId(menuItem.getCategory().getId())
                .categoryName(menuItem.getCategory().getName())
                .name(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                .cost(menuItem.getCost())
                .imageUrl(menuItem.getImageUrl())
                .prepTime(menuItem.getPrepTime())
                .available(menuItem.isAvailable())
                .createdAt(menuItem.getCreatedAt())
                .updatedAt(menuItem.getUpdatedAt())
                .build();
    }
}
