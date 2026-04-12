package com.hermes.hermes.model;

import com.hermes.hermes.model.CapaStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.envers.Audited;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "capas")
@Data
@Audited
public class Capa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String capaNumber;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String source; // Audit, Deviation, Complaint, etc.

    @Enumerated(EnumType.STRING)
    private CapaStatus status;

    private String criticality;

    @Column(name = "opening_date")
    private LocalDateTime openingDate;

    // --- Root Cause Analysis (5 Whys) ---
    @Column(columnDefinition = "TEXT")
    private String why1;
    @Column(columnDefinition = "TEXT")
    private String why2;
    @Column(columnDefinition = "TEXT")
    private String why3;
    @Column(columnDefinition = "TEXT")
    private String why4;
    @Column(columnDefinition = "TEXT")
    private String why5;

    @Column(columnDefinition = "TEXT")
    private String rootCauseFinal;

    // --- Action Plan ---
    @OneToMany(mappedBy = "capa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CapaAction> actions = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        openingDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
