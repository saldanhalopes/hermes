package com.hermes.hermes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDTO {
    private Long revisionId;
    private String entityName;
    private String entityId;
    private String operation; // ADD, MOD, DEL
    private LocalDateTime timestamp;
    private String user;
    private String details;
}
