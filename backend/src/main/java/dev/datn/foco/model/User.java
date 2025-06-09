package dev.datn.foco.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Table(name = "users")
@Entity
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Data
public class User {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "user_id")
    private Long userId;
@Column(nullable = false)
    private String name;
@Column(name = "username",nullable = false)
    private String username;
@Column(nullable = false)
    private String password;
@Column(nullable = false, unique = true)
    private String email;
@Column(nullable = false, unique = true)
    private String phone;
@ManyToOne
@JoinColumn(name = "role_id")
@JsonBackReference
    private Role role;
@ManyToOne
@JoinColumn(name = "store_id")
@JsonBackReference
    private Store storeId;
@Column(name = "is_active",nullable = false)
    private boolean isActive;
@Column(name = "last_login")
    private LocalDateTime lastLogin;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
