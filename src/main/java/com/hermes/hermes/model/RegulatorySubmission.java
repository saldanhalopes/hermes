package com.hermes.hermes.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "regulatory_submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Audited
public class RegulatorySubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "submission_number", unique = true, nullable = false)
    private String submissionNumber;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Market market;

    @Column(nullable = false)
    private String authority; // Ex: Anvisa, FDA, EMA

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status;

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @Column(name = "approval_date")
    private LocalDate approvalDate;

    @Column(name = "dossier_link")
    private String dossierLink;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToMany
    @JoinTable(
        name = "submission_changes",
        joinColumns = @JoinColumn(name = "submission_id"),
        inverseJoinColumns = @JoinColumn(name = "change_request_id")
    )
    private List<ChangeRequest> changeRequests = new ArrayList<>();

    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
        if (status == null) status = SubmissionStatus.DRAFT;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}
