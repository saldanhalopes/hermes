package com.hermes.hermes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Configuração das áreas disponíveis para avaliação de impacto nos CMs.
 * Seed inicial carregado pelo DataInitializer com as ~35 áreas da Eurofarma.
 * Cada AreaConfig gera uma ImpactAnalysis quando um CM é iniciado para análise de impacto.
 */
@Entity
@Table(name = "area_configs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AreaConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Código único da área (usado para identificação no sistema)
     * Ex: "AR", "VALID", "QUALIF", "CQ_FQ", "PROD_BI5"
     */
    @Column(name = "area_code", unique = true, nullable = false)
    private String areaCode;

    /**
     * Nome de exibição da área
     * Ex: "Assuntos Regulatórios", "Validação", "CQ Físico Químico"
     */
    @Column(name = "area_name", nullable = false)
    private String areaName;

    /**
     * Ordem de exibição no formulário
     */
    @Column(name = "display_order")
    private int displayOrder;

    /**
     * Se a área possui sub-áreas de avaliação específicas
     */
    @Column(name = "has_sub_areas")
    private boolean hasSubAreas = false;

    /**
     * Sub-áreas separadas por ponto-e-vírgula.
     * Ex: "Validação Processo;Validação Limpeza;Media Fill;Sistema de Água / Vapor;Validação Outros"
     */
    @Column(name = "sub_areas_list", columnDefinition = "TEXT")
    private String subAreasList;

    /**
     * Se a área está ativa (pode ser desativada sem excluir histórico)
     */
    @Column(name = "active")
    private boolean active = true;

    /**
     * Retorna as sub-áreas como lista
     */
    public List<String> getSubAreasAsList() {
        if (subAreasList == null || subAreasList.isBlank()) {
            return new ArrayList<>();
        }
        return Arrays.asList(subAreasList.split(";"));
    }
}
