package dev.datn.foco.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class TableRequest {
    private Long zoneId;
    private String tableName;
    private String status;
    private int capacity;
    private boolean active;
}
