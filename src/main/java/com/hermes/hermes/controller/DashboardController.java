package com.hermes.hermes.controller;

import com.hermes.hermes.dto.AnalyticsUpdateDTO;
import com.hermes.hermes.model.ChangeStatus;
import com.hermes.hermes.model.CapaStatus;
import com.hermes.hermes.repository.ChangeRequestRepository;
import com.hermes.hermes.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Dashboard", description = "Monitoramento e Analytics")
public class DashboardController {

    @Autowired
    private ChangeRequestRepository changeRequestRepository;

    @Autowired
    private com.hermes.hermes.repository.CapaRepository capaRepository;

    @Autowired
    private com.hermes.hermes.repository.CapaActionRepository capaActionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping
    @Operation(summary = "Obter dados analíticos", description = "Retorna métricas de criticidade, tipos e tendências mensais")
    public AnalyticsUpdateDTO dashboard() {
        return getLatestAnalytics();
    }

    @GetMapping("/capa")
    @Operation(summary = "Obter dados analíticos de CAPA")
    public com.hermes.hermes.dto.CapaAnalyticsDTO dashboardCapa() {
        Map<String, Long> statusDistribution = new HashMap<>();
        statusDistribution.put("Investigação", capaRepository.countByStatus(CapaStatus.INVESTIGATION));
        statusDistribution.put("Ações", capaRepository.countByStatus(CapaStatus.ACTION_PLAN_EXECUTION));
        statusDistribution.put("Eficácia", capaRepository.countByStatus(CapaStatus.EFFECTIVENESS_VERIFICATION));
        statusDistribution.put("Fechado", capaRepository.countByStatus(CapaStatus.CLOSED));

        return com.hermes.hermes.dto.CapaAnalyticsDTO.builder()
                .totalOpen(capaRepository.count() - capaRepository.countByStatus(CapaStatus.CLOSED))
                .overdueActions(0) // Logic for deadlines can be added later
                .avgClosureTime("14 dias")
                .effectivenessRate(92.0)
                .statusDistribution(statusDistribution)
                .sourceDistribution(new HashMap<>())
                .build();
    }


    public void broadcastAnalyticsUpdate() {
        messagingTemplate.convertAndSend("/topic/analytics", getLatestAnalytics());
    }

    private AnalyticsUpdateDTO getLatestAnalytics() {
        Map<String, Long> typeDistribution = new HashMap<>();
        typeDistribution.put("Processo", changeRequestRepository.countByType("PROCESSO"));
        typeDistribution.put("Equipamento", changeRequestRepository.countByType("EQUIPAMENTO"));
        typeDistribution.put("Sistema", changeRequestRepository.countByType("SISTEMA"));
        typeDistribution.put("Documentação", changeRequestRepository.countByType("DOCUMENTACAO"));

        return AnalyticsUpdateDTO.builder()
                .totalChanges(changeRequestRepository.count())
                .pendingChanges(changeRequestRepository.countByStatus(ChangeStatus.IDENTIFICATION) + 
                               changeRequestRepository.countByStatus(ChangeStatus.IMPACT_ANALYSIS))
                .approvedChanges(changeRequestRepository.countByStatus(ChangeStatus.EXECUTION))
                .totalUsers(userRepository.count())
                .typeDistribution(typeDistribution)
                .monthlyTrend(getMonthlyTrendData())
                .build();
    }

    private List<Long> getMonthlyTrendData() {
        List<Object[]> queryResults = changeRequestRepository.countByMonthCurrentYear();
        Map<Integer, Long> monthCounts = queryResults.stream()
                .collect(Collectors.toMap(
                        res -> ((Number) res[0]).intValue(),
                        res -> ((Number) res[1]).longValue()
                ));

        List<Long> trend = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            trend.add(monthCounts.getOrDefault(i, 0L));
        }
        return trend;
    }
}
