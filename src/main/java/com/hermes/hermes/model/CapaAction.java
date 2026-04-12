package com.hermes.hermes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.envers.Audited;
import java.time.LocalDateTime;

@Entity
@Table(name = "capa_actions")
@Data
@Audited
public class CapaAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "capa_id")
    @JsonIgnore
    private Capa capa;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String type; // CORRECTIVE, PREVENTIVE

    private String responsible;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    private boolean completed;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
