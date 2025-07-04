package dev.datn.foco.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "zones")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Zone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zone_id")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store storeId;
    private String name;
    private String description;
    @Column(name = "is_active", nullable = false)
    private boolean isActive;
}
