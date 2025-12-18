package dev.datn.foco.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemOptionResponse {
    private Long id;
    private Long itemId;
    private String itemName;
    private String name;
    private String description;
    private Boolean required;
    private Boolean multipleChoice;
    private Integer maxSelections;
    private Integer sortOrder;
    private Boolean active;
    private List<MenuItemOptionValueResponse> values;
}

