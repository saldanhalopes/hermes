package com.hermes.hermes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "asset_impact_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class AssetImpactRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "change_request_id")
    private ChangeRequest changeRequest;

    private String assetType; // Equipamento, Software, Material, Método, Utilitário
    
    private String assetName;
    
    private String assetCode; // TAG ou Código de Inventário

    @Column(columnDefinition = "TEXT")
    private String impactDescription;
    
    private boolean needsRequalification;
}
