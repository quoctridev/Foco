package dev.datn.foco.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity đại diện cho nhà cung cấp
 * Quản lý thông tin các nhà cung cấp nguyên liệu
 */
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Suppliers")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long id;

    // Tên nhà cung cấp
    @Column(name = "name", nullable = false)
    private String name;

    // Người liên hệ
    @Column(name = "contact_person")
    private String contactPerson;

    // Số điện thoại
    @Column(name = "phone")
    private String phone;

    // Email
    @Column(name = "email")
    private String email;

    // Địa chỉ
    @Column(name = "address")
    private String address;

    // Mã số thuế
    @Column(name = "tax_id")
    private String taxId;

    // Điều khoản thanh toán
    @Column(name = "payment_terms")
    private String paymentTerms;

    // Trạng thái hoạt động
    @Column(name = "is_active")
    private Boolean active;

    // Ngày tạo
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Ngày cập nhật
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (active == null) {
            active = true;
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

