package dev.datn.foco.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "OrderDetailOptions")
public class OrderDetailOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_detail_id", nullable = false)
    private OrderDetail orderDetail;

    @ManyToOne
    @JoinColumn(name = "value_id", nullable = false)
    private MenuItemOptionValues optionValue;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "extra_price", precision = 10, scale = 2)
    private BigDecimal extraPrice;

    @PrePersist
    public void onCreate() {
        if (quantity == null) {
            quantity = 1;
        }
        if (extraPrice == null) {
            extraPrice = BigDecimal.ZERO;
        }
    }
}

