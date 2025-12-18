package dev.datn.foco.service;

import dev.datn.foco.dto.request.MenuItemRequest;
import dev.datn.foco.dto.respone.MenuItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MenuItemService {

    MenuItemResponse createMenuItem(MenuItemRequest request, MultipartFile image);

    MenuItemResponse getMenuItemById(Long id);

    List<MenuItemResponse> getAllMenuItems();

    List<MenuItemResponse> getMenuItemsByCategory(Long categoryId);

    List<MenuItemResponse> getAvailableMenuItems();

    List<MenuItemResponse> searchMenuItems(String name);

    MenuItemResponse updateMenuItem(Long id, MenuItemRequest request, MultipartFile image);

    MenuItemResponse updateAvailability(Long id, boolean available);

    void deleteMenuItem(Long id);
}
