package dev.datn.foco.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemRequest {
    private Long categoryId;

    private String name;

    private String description;

    private Double price;

    private Double cost;

    private Integer prepTime;

    private Integer calories;

    private Boolean available;

    private Boolean featured;

    private Integer sortOrder;
}
