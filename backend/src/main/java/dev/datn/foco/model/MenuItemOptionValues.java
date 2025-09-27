package dev.datn.foco.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "MenuItemOptionValues")
public class MenuItemOptionValues {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "option_id")
    private MenuItemOptions optionId;
    private String name;
    @Column(name = "extraPrice")
    private Double extraPrice;
    @Column(name = "is_active")
    private boolean active;
}
