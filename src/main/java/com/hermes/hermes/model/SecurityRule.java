package com.hermes.hermes.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "security_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class SecurityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String urlPattern;

    @Column(nullable = false)
    private String httpMethod; // e.g., "GET", "POST", or "ALL"

    @Column(nullable = false)
    private String requiredRole; // e.g., "ADMIN", "USER", or "PERMIT_ALL"

    private String description;
}
