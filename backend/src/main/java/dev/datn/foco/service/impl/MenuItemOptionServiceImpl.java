package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.MenuItemOptionRequest;
import dev.datn.foco.dto.request.MenuItemOptionValueRequest;
import dev.datn.foco.dto.respone.MenuItemOptionResponse;
import dev.datn.foco.dto.respone.MenuItemOptionValueResponse;
import dev.datn.foco.model.MenuItemOptions;
import dev.datn.foco.model.MenuItemOptionValues;
import dev.datn.foco.model.MenuItems;
import dev.datn.foco.repository.MenuItemOptionRepository;
import dev.datn.foco.repository.MenuItemOptionValueRepository;
import dev.datn.foco.repository.MenuItemRepository;
import dev.datn.foco.service.MenuItemOptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemOptionServiceImpl implements MenuItemOptionService {

    private final MenuItemOptionRepository menuItemOptionRepository;
    private final MenuItemOptionValueRepository menuItemOptionValueRepository;
    private final MenuItemRepository menuItemRepository;

    @Override
    @Transactional
    public MenuItemOptionResponse createOption(MenuItemOptionRequest request) {
        // Kiểm tra món ăn tồn tại
        MenuItems menuItem = menuItemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn"));

        // Tạo tùy chọn mới
        MenuItemOptions option = MenuItemOptions.builder()
                .menuItem(menuItem)
                .name(request.getName())
                .description(request.getDescription())
                .required(request.getRequired() != null ? request.getRequired() : false)
                .multipleChoice(request.getMultipleChoice() != null ? request.getMultipleChoice() : false)
                .maxSelection(request.getMaxSelections() != null ? request.getMaxSelections() : 1)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        MenuItemOptions savedOption = menuItemOptionRepository.save(option);

        // Tạo các giá trị cho tùy chọn
        List<MenuItemOptionValues> values = new ArrayList<>();
        if (request.getValues() != null && !request.getValues().isEmpty()) {
            for (MenuItemOptionValueRequest valueRequest : request.getValues()) {
                MenuItemOptionValues value = MenuItemOptionValues.builder()
                        .option(savedOption)
                        .name(valueRequest.getName())
                        .extraPrice(
                                valueRequest.getExtraPrice() != null ? BigDecimal.valueOf(valueRequest.getExtraPrice())
                                        : BigDecimal.ZERO)
                        .sortOrder(valueRequest.getSortOrder())
                        .active(valueRequest.getActive() != null ? valueRequest.getActive() : true)
                        .build();
                values.add(menuItemOptionValueRepository.save(value));
            }
        }

        return mapToResponse(savedOption, values);
    }

    @Override
    public MenuItemOptionResponse getOptionById(Long id) {
        MenuItemOptions option = menuItemOptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tùy chọn món ăn"));
        List<MenuItemOptionValues> values = menuItemOptionValueRepository.findByOption_Id(id);
        return mapToResponse(option, values);
    }

    @Override
    public List<MenuItemOptionResponse> getAllOptions() {
        return menuItemOptionRepository.findAll().stream()
                .map(option -> {
                    List<MenuItemOptionValues> values = menuItemOptionValueRepository.findByOption_Id(option.getId());
                    return mapToResponse(option, values);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemOptionResponse> getOptionsByMenuItem(Long itemId) {
        return menuItemOptionRepository.findByMenuItem_Id(itemId).stream()
                .map(option -> {
                    List<MenuItemOptionValues> values = menuItemOptionValueRepository.findByOption_Id(option.getId());
                    return mapToResponse(option, values);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemOptionResponse> getActiveOptions() {
        return menuItemOptionRepository.findByActive(true).stream()
                .map(option -> {
                    List<MenuItemOptionValues> values = menuItemOptionValueRepository.findByOption_Id(option.getId());
                    return mapToResponse(option, values);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MenuItemOptionResponse updateOption(Long id, MenuItemOptionRequest request) {
        MenuItemOptions option = menuItemOptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tùy chọn món ăn"));

        // Cập nhật thông tin tùy chọn
        if (request.getName() != null)
            option.setName(request.getName());
        if (request.getDescription() != null)
            option.setDescription(request.getDescription());
        if (request.getRequired() != null)
            option.setRequired(request.getRequired());
        if (request.getMultipleChoice() != null)
            option.setMultipleChoice(request.getMultipleChoice());
        if (request.getMaxSelections() != null)
            option.setMaxSelection(request.getMaxSelections());
        if (request.getActive() != null)
            option.setActive(request.getActive());

        MenuItemOptions updatedOption = menuItemOptionRepository.save(option);

        // Cập nhật giá trị (xóa cũ và tạo mới)
        List<MenuItemOptionValues> existingValues = menuItemOptionValueRepository.findByOption_Id(id);
        menuItemOptionValueRepository.deleteAll(existingValues);

        List<MenuItemOptionValues> newValues = new ArrayList<>();
        if (request.getValues() != null && !request.getValues().isEmpty()) {
            for (MenuItemOptionValueRequest valueRequest : request.getValues()) {
                MenuItemOptionValues value = MenuItemOptionValues.builder()
                        .option(updatedOption)
                        .name(valueRequest.getName())
                        .extraPrice(
                                valueRequest.getExtraPrice() != null ? BigDecimal.valueOf(valueRequest.getExtraPrice())
                                        : BigDecimal.ZERO)
                        .sortOrder(valueRequest.getSortOrder())
                        .active(valueRequest.getActive() != null ? valueRequest.getActive() : true)
                        .build();
                newValues.add(menuItemOptionValueRepository.save(value));
            }
        }

        return mapToResponse(updatedOption, newValues);
    }

    @Override
    @Transactional
    public void deleteOption(Long id) {
        // Xóa các giá trị trước
        List<MenuItemOptionValues> values = menuItemOptionValueRepository.findByOption_Id(id);
        menuItemOptionValueRepository.deleteAll(values);

        // Xóa tùy chọn
        menuItemOptionRepository.deleteById(id);
    }

    private MenuItemOptionResponse mapToResponse(MenuItemOptions option, List<MenuItemOptionValues> values) {
        List<MenuItemOptionValueResponse> valueResponses = values.stream()
                .map(value -> MenuItemOptionValueResponse.builder()
                        .id(value.getId())
                        .optionId(option.getId())
                        .name(value.getName())
                        .extraPrice(value.getExtraPrice().doubleValue())
                        .sortOrder(value.getSortOrder())
                        .active(value.isActive())
                        .build())
                .collect(Collectors.toList());

        return MenuItemOptionResponse.builder()
                .id(option.getId())
                .itemId(option.getMenuItem().getId())
                .itemName(option.getMenuItem().getName())
                .name(option.getName())
                .description(option.getDescription())
                .required(option.isRequired())
                .multipleChoice(option.isMultipleChoice())
                .maxSelections(option.getMaxSelection())
                .active(option.isActive())
                .values(valueResponses)
                .build();
    }
}
