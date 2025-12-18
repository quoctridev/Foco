package dev.datn.foco.service;

import dev.datn.foco.dto.request.MenuItemOptionRequest;
import dev.datn.foco.dto.respone.MenuItemOptionResponse;

import java.util.List;

public interface MenuItemOptionService {

    MenuItemOptionResponse createOption(MenuItemOptionRequest request);

    MenuItemOptionResponse getOptionById(Long id);

    List<MenuItemOptionResponse> getAllOptions();

    List<MenuItemOptionResponse> getOptionsByMenuItem(Long itemId);

    List<MenuItemOptionResponse> getActiveOptions();

    MenuItemOptionResponse updateOption(Long id, MenuItemOptionRequest request);

    void deleteOption(Long id);
}
