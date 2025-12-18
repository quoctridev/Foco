package dev.datn.foco.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TableRespone {
    private Long id;
    private Long zoneId;
    private String zoneName;
    private String name;
    private int capacity;
    private String status;
    private boolean active;
}
