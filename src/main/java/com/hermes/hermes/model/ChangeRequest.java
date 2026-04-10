package com.hermes.hermes.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.envers.Audited;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "change_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class ChangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Número e Identificação ---
    @Column(name = "cm_number", unique = true)
    private String cmNumber; // Gerado automaticamente: CM-XXXXXX

    private String title;

    @Column(name = "opening_date")
    private LocalDate openingDate;

    // --- Responsável (Emitente) ---
    @Column(name = "responsible_name")
    private String responsibleName;

    @Column(name = "responsible_area")
    private String responsibleArea;

    // --- Classificação ---
    private String unit; // Itapevi, Momenta, Rio de Janeiro, etc.

    @Column(name = "change_type")
    private String changeType; // Mudança Geral, Mudança de Emergência, Projeto

    @Column(name = "change_subtype")
    private String changeSubtype; // Definitivo, Temporário

    private String criticality; // Baixa, Média, Alta, Crítica

    // --- Descrição da Mudança ---
    @Column(name = "current_situation", columnDefinition = "TEXT")
    private String currentSituation;

    @Column(name = "proposed_situation", columnDefinition = "TEXT")
    private String proposedSituation;

    @Column(columnDefinition = "TEXT")
    private String justification;

    @Column(name = "affected_products", columnDefinition = "TEXT")
    private String affectedProducts;

    // --- Emergencial ---
    @Column(name = "is_emergency")
    @JsonProperty("emergency")
    private boolean isEmergency;

    @Column(name = "emergency_reason", columnDefinition = "TEXT")
    private String emergencyReason;

    // --- CMs Relacionados (números separados por vírgula) ---
    @Column(name = "related_cms")
    private String relatedCms;

    // --- Status e Controle ---
    @Enumerated(EnumType.STRING)
    private ChangeStatus status;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // --- Relacionamentos ---
    @OneToMany(mappedBy = "changeRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ImpactAnalysis> impactAnalyses = new ArrayList<>();

    @OneToMany(mappedBy = "changeRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ActionPlanTask> actionPlanTasks = new ArrayList<>();

    @OneToOne(mappedBy = "changeRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private EffectivenessEvaluation effectivenessEvaluation;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = ChangeStatus.IDENTIFICATION;
        if (openingDate == null) openingDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
