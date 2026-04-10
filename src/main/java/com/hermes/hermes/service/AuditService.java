package com.hermes.hermes.service;

import com.hermes.hermes.dto.AuditLogDTO;
import com.hermes.hermes.model.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.hibernate.envers.query.AuditQuery;
import com.hermes.hermes.repository.AccessLogRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.TimeZone;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final EntityManager entityManager;
    private final AccessLogRepository accessLogRepository;

    public List<AuditLogDTO> getRecentChanges(int limit) {
        AuditReader auditReader = AuditReaderFactory.get(entityManager);
        List<AuditLogDTO> auditLogs = new ArrayList<>();

        // Buscar mudanças em ChangeRequest
        addEntityAuditLogs(auditReader, ChangeRequest.class, "Solicitação de Mudança", auditLogs);
        
        // Buscar mudanças em User
        addEntityAuditLogs(auditReader, User.class, "Usuário", auditLogs);

        // Buscar mudanças em ImpactAnalysis
        addEntityAuditLogs(auditReader, ImpactAnalysis.class, "Análise de Impacto", auditLogs);

        // Ordenar por ID de revisão (decrescente) e limitar
        auditLogs.sort(Comparator.comparing(AuditLogDTO::getRevisionId).reversed());
        
        return auditLogs.stream().limit(limit).toList();
    }

    public List<AccessLog> getRecentAccessLogs() {
        return accessLogRepository.findTop100ByOrderByTimestampDesc();
    }

    private <T> void addEntityAuditLogs(AuditReader auditReader, Class<T> entityClass, String displayName, List<AuditLogDTO> targetList) {
        AuditQuery query = auditReader.createQuery()
                .forRevisionsOfEntity(entityClass, false, true);
        
        List<Object[]> results = query.getResultList();
        
        for (Object[] result : results) {
            Object entity = result[0];
            Object revisionEntity = result[1];
            RevisionType revisionType = (RevisionType) result[2];

            long revId = 0;
            LocalDateTime timestamp = LocalDateTime.now();
            
            if (revisionEntity instanceof org.hibernate.envers.DefaultRevisionEntity dre) {
                revId = dre.getId();
                timestamp = LocalDateTime.ofInstant(Instant.ofEpochMilli(dre.getTimestamp()), TimeZone.getDefault().toZoneId());
            }

            String entityId = "";
            if (entity instanceof ChangeRequest cr) entityId = String.valueOf(cr.getId());
            else if (entity instanceof User u) entityId = u.getUsername();
            else if (entity instanceof ImpactAnalysis ia) entityId = String.valueOf(ia.getId());

            targetList.add(AuditLogDTO.builder()
                    .revisionId(revId)
                    .entityName(displayName)
                    .entityId(entityId)
                    .operation(convertRevisionType(revisionType))
                    .timestamp(timestamp)
                    .user("Sistema")
                    .details(entity.toString())
                    .build());
        }
    }

    private String convertRevisionType(RevisionType type) {
        return switch (type) {
            case ADD -> "CRIAÇÃO";
            case MOD -> "EDIÇÃO";
            case DEL -> "EXCLUSÃO";
            default -> "DESCONHECIDO";
        };
    }
}
