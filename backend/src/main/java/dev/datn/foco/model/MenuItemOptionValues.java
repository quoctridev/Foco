package dev.datn.foco.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "MenuItemOptionValues")
public class MenuItemOptionValues {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "value_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "option_id")
    private MenuItemOptions option;
    
    private String name;
    
    @Column(name = "extra_price", precision = 10, scale = 2)
    private BigDecimal extraPrice;
    
    @Column(name = "sort_order")
    private Integer sortOrder;
    
    @Column(name = "is_active")
    private boolean active;
    
    @PrePersist
    public void onCreate() {
        if (extraPrice == null) {
            extraPrice = BigDecimal.ZERO;
        }
        if (sortOrder == null) {
            sortOrder = 0;
        }
    }
}
