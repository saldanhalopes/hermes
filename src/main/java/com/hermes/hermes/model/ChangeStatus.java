package com.hermes.hermes.model;

public enum ChangeStatus {
    IDENTIFICATION,              // Registro inicial — Emitente cria proposta
    IMPACT_ANALYSIS,             // GQ avalia e envia para áreas avaliarem
    REGULATORY_REVIEW,           // Avaliação AR/DNP
    AREA_EVALUATION,             // Avaliadores de área preenchem impactos
    COMMITTEE_REVIEW,            // Comitê CM — aprovação ou reprovação
    ACTION_PLAN,                 // Elaboração do Plano de Ação
    ACTION_PLAN_APPROVAL,        // Aprovação do Plano de Ação (Gestor + GQ + Supervisor)
    EXECUTION,                   // Acompanhamento da execução do plano
    EFFECTIVENESS_VERIFICATION,  // Verificação pós-mudança (Eficaz / Não Eficaz)
    CLOSED,                      // Encerrado com sucesso
    CANCELLED,                   // Cancelado
    ABANDONED                    // Desistência do CM pelo emitente
}
