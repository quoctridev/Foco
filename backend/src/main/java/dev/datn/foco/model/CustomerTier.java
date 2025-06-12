package dev.datn.foco.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customerTiers")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerTier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tier_id")
    private Long id;
    private String name;
    @Column(name = "min_points")
    private Long minPoint;
    @Column(name = "discount_rate")
    private Double discountRate;
    private String color;
    @Column(name = "is_active")
    private boolean isActive;
}
