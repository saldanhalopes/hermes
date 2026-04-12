package com.hermes.hermes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.envers.Audited;

/**
 * Sub-área de avaliação dentro de uma área principal.
 * Exemplo: "Validação" possui sub-áreas:
 *   - Validação Processo
 *   - Validação Limpeza
 *   - Media Fill
 *   - Sistema de Água / Vapor
 *   - Validação Outros
 *
 * Exemplo: "Qualificação" possui sub-áreas:
 *   - HVAC
 *   - Instalação, Operação e Desempenho / Térmica
 *   - Gases
 *   - Qualificação Outros
 */
@Entity
@Table(name = "impact_sub_areas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class ImpactSubArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_analysis_id", nullable = false)
    @JsonIgnore
    private ImpactAnalysis parentAnalysis;

    @Column(name = "sub_area_name", nullable = false)
    private String subAreaName; // Ex: "Validação Processo", "HVAC", "Gases"

    @Column(name = "impact_text", columnDefinition = "TEXT")
    private String impactText; // Texto de impacto específico dessa sub-área

    @Column(name = "display_order")
    private int displayOrder = 0;
}
