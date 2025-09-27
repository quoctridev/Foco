package dev.datn.foco.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.*;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "MenuItemOptions")
public class MenuItemOptions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "item_id")
    private MenuItems menuItem;
    private String name;
    private String description;
    @Column(name = "is_required")
    private boolean required;
    @Column(name = "multiple_choice")
    private boolean multipleChoice;
    @Column(name = "max_selections")
    private int maxSelection;
    @Column(name = "is_active")
    private boolean active;
}
