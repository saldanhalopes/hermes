package com.hermes.hermes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.envers.Audited;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Representa a avaliação de impacto de UMA área específica para um CM.
 * Cada CM tem uma instância desta entidade por área configurada (ex: Validação, CQ, etc.)
 */
@Entity
@Table(name = "impact_analyses",
        uniqueConstraints = @UniqueConstraint(columnNames = {"change_request_id", "area_code"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class ImpactAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "change_request_id", nullable = false)
    private ChangeRequest changeRequest;

    // --- Identificação da Área ---
    @Column(name = "area_code", nullable = false)
    private String areaCode; // Ex: "VALID", "CQ_FQ", "PROD_BI5"

    @Column(name = "area_name", nullable = false)
    private String areaName; // Ex: "Validação", "CQ Físico Químico"

    /**
     * Se a área foi marcada como "Sim" — deve participar da avaliação.
     * Áreas marcadas como "Não" ficam registradas mas não geram painel de avaliação.
     */
    @Column(name = "area_enabled")
    private boolean areaEnabled = false;

    // --- Avaliação de Impacto ---
    @Column(name = "impact_text", columnDefinition = "TEXT")
    private String impactText; // Descrição do impacto da mudança nessa área

    /**
     * Disposição do avaliador: "Sim" (Aprovado), "Não" (Reprovado), "Não Aplicável"
     */
    @Column(name = "approval_status")
    private String approvalStatus;

    @Column(name = "evaluator_name")
    private String evaluatorName; // Nome do avaliador (texto livre)

    @Column(name = "evaluation_date")
    private LocalDate evaluationDate;

    // --- Compatibilidade retroativa ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id")
    private User evaluator; // Usuário vinculado (opcional)

    @Column(name = "completed")
    private boolean completed = false;

    // --- Sub-áreas (ex: Validação tem 5 sub-áreas) ---
    @OneToMany(mappedBy = "parentAnalysis", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ImpactSubArea> subAreas = new ArrayList<>();

    /**
     * Posição de exibição no formulário
     */
    @Column(name = "display_order")
    private int displayOrder = 0;
}
