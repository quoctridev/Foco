package dev.datn.foco.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import dev.datn.foco.constaint.RoleName;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Table(name = "roles")
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;
    @Column(name = "role_name")
    @Enumerated(EnumType.STRING)
    private RoleName roleName;
    private String description;
    @Column(name = "is_active")
    private boolean isActive;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    @OneToMany(mappedBy = "role")
    @JsonManagedReference
    private List<User> users;
}
