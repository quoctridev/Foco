package dev.datn.foco.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "MergedTables")
public class MergedTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "merge_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "main_table_id", nullable = false)
    private Tables mainTable;

    @ManyToOne
    @JoinColumn(name = "merged_table_id", nullable = false)
    private Tables mergedTable;

    @ManyToOne
    @JoinColumn(name = "merged_by", nullable = false)
    private User mergedBy;

    @Column(name = "merged_at")
    private LocalDateTime mergedAt;

    @Column(name = "unmerged_at")
    private LocalDateTime unmergedAt;

    @PrePersist
    public void onCreate() {
        mergedAt = LocalDateTime.now();
    }
}

