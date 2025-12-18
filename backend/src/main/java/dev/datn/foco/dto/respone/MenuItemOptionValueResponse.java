package dev.datn.foco.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemOptionValueResponse {
    private Long id;
    private Long optionId;
    private String name;
    private Double extraPrice;
    private Integer sortOrder;
    private Boolean active;
}

