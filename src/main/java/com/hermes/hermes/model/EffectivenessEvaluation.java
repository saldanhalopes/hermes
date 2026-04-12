package com.hermes.hermes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.envers.Audited;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Verificação de Eficácia do CM — realizada após a execução de todas as tarefas do Plano de Ação.
 * Corresponde à seção "Avaliação de Eficácia" do formulário (imagem 18).
 */
@Entity
@Table(name = "effectiveness_evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class EffectivenessEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "change_request_id", nullable = false, unique = true)
    @JsonIgnore
    private ChangeRequest changeRequest;

    /**
     * Descrição detalhada da verificação de eficácia (max 4000 chars)
     */
    @Column(name = "evaluation_text", columnDefinition = "TEXT")
    private String evaluationText;

    /**
     * Resultado: "Eficaz" ou "Não Eficaz"
     */
    @Column(name = "result")
    private String result;

    @Column(name = "evaluated_by")
    private String evaluatedBy;

    @Column(name = "evaluation_date")
    private LocalDate evaluationDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
