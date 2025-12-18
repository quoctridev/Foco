package dev.datn.foco.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemOptionValueRequest {
    private String name;
    private Double extraPrice;
    private Integer sortOrder;
    private Boolean active;
}

