package com.hermes.hermes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "proposed_area_actions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class ProposedAreaAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "impact_analysis_id")
    private ImpactAnalysis impactAnalysis;

    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String rationale;
}
