package com.hermes.hermes.controller;

import com.hermes.hermes.dto.AnalyticsUpdateDTO;
import com.hermes.hermes.model.ChangeStatus;
import com.hermes.hermes.repository.ChangeRequestRepository;
import com.hermes.hermes.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.*;
import java.util.stream.Collectors;

@Controller
public class DashboardController {

    @Autowired
    private ChangeRequestRepository changeRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/")
    public String dashboard(Model model) {
        AnalyticsUpdateDTO data = getLatestAnalytics();
        
        model.addAttribute("totalChanges", data.getTotalChanges());
        model.addAttribute("pendingChanges", data.getPendingChanges());
        model.addAttribute("approvedChanges", data.getApprovedChanges());
        model.addAttribute("totalUsers", data.getTotalUsers());
        model.addAttribute("typeDistribution", data.getTypeDistribution());
        model.addAttribute("monthlyTrend", data.getMonthlyTrend());

        return "index";
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
