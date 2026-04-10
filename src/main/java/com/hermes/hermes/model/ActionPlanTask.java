package com.hermes.hermes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.envers.Audited;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "action_plan_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class ActionPlanTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "change_request_id")
    private ChangeRequest changeRequest;

    /**
     * Identificador sequencial da ação dentro do CM. Ex: "000001", "000002"
     */
    @Column(name = "identifier")
    private String identifier;

    /**
     * Categoria da ação. Ex: "RNC001.12 - Preventiva", "Corretiva"
     */
    @Column(name = "category")
    private String category;

    // ===== Estrutura 5W2H =====

    @Column(name = "task_what", columnDefinition = "TEXT")
    private String what; // O QUÊ?

    @Column(name = "task_why", columnDefinition = "TEXT")
    private String why; // POR QUÊ?

    @Column(name = "task_where")
    private String where; // ONDE?

    @Column(name = "task_how", columnDefinition = "TEXT")
    private String how; // COMO?

    @Column(name = "task_how_much")
    private String howMuch; // QUANTO?

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_who")
    private User who; // QUEM? (usuário vinculado)

    @Column(name = "who_name")
    private String whoName; // QUEM? (nome texto livre para exibição)

    @Column(name = "responsible_team")
    private String responsibleTeam; // Equipe responsável

    // ===== Datas =====

    @Column(name = "planned_start")
    private LocalDate plannedStart; // QUANDO? (início planejado)

    @Column(name = "planned_end")
    private LocalDate plannedEnd; // QUANDO? (término planejado)

    @Column(name = "actual_start")
    private LocalDate actualStart; // Início Real

    @Column(name = "actual_end")
    private LocalDate actualEnd; // Término Real

    // ===== Progresso =====

    /**
     * Percentual realizado: 0.0 a 100.0
     */
    @Column(name = "percent_completed")
    private Double percentCompleted = 0.0;

    @Column(name = "status")
    private String status; // Pendente, Em Andamento, Concluído, Atrasado

    @Column(name = "evidence", columnDefinition = "TEXT")
    private String evidence; // Evidência de conclusão

    private LocalDateTime completedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        if ("Concluído".equals(status) && completedAt == null) {
            completedAt = LocalDateTime.now();
            if (percentCompleted == null || percentCompleted < 100.0) {
                percentCompleted = 100.0;
            }
        }
    }
}
